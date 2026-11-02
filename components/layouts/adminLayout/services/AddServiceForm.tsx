"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";

import { addServiceAPI } from "@/api/serviceControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { useSnackbarStore } from "@/stores/snackbarStore";

import ServiceAvailabilityFields from "./ServiceAvailabilityFields";
import ServiceBasicFields from "./ServiceBasicFields";
import ServiceBenefitsFields, { ServiceBenefitsFieldsRef } from "./ServiceBenefitsFields";
import ServiceCitiesFields from "./ServiceCitiesFields";
import ServiceIconUploadField from "./ServiceIconUploadField";
import ServiceLanguagesFields, { ServiceLanguagesFieldsRef } from "./ServiceLanguagesFields";
import ServicePlansTabConfig from "./ServicePlansTabConfig";
import ServicePricingFields from "./ServicePricingFields";

import { convertImageToWebP } from "@/utils/imageHelper";
import {
  TITLE_STRICT_REGEX,
  TITLE_STRICT_MESSAGE,
  DESCRIPTION_STRICT_REGEX,
  DESCRIPTION_STRICT_MESSAGE,
} from "@/utils/helpers";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Service name is required")
    .min(3, "Service name must be at least 3 characters")
    .max(100, "Service name cannot exceed 100 characters")
    .matches(
      TITLE_STRICT_REGEX,
      TITLE_STRICT_MESSAGE
    )
    .test("has-letters", "Service name must contain letters", (val) => {
      if (!val) return false;
      return /[a-zA-Z]/.test(val);
    }),
  categoryId: Yup.string().required("Category is required"),
  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .matches(
      DESCRIPTION_STRICT_REGEX,
      DESCRIPTION_STRICT_MESSAGE
    )
    .test(
      "meaningful-text",
      "Description must contain meaningful text with letters, not just symbols",
      (val) => {
        if (!val) return false;
        const letters = (val.match(/[a-zA-Z]/g) || []).length;
        return val.trim().length >= 10 && letters >= 5;
      }
    ),
  metaTitle: Yup.string().trim().optional(),
  metaDescription: Yup.string().trim().optional(),
  tokenPercentage: Yup.number()
    .required("Token percentage is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
  basicPrice: Yup.number()
    .required("Basic plan price is required")
    .min(0, "Cannot be negative"),
  standardPrice: Yup.number().when("isOffline", {
    is: true,
    then: (schema) =>
      schema
        .required("Please fill in all required Standard Plan details.")
        .typeError("Please fill in all required Standard Plan details.")
        .min(0, "Cannot be negative")
        .test(
          "is-greater-than-basic",
          "Standard plan price should be greater than or equal to Basic plan price",
          function (value) {
            const { basicPrice } = this.parent;
            if (value === undefined || value === null || (value as any) === "") return true;
            return basicPrice === undefined || value >= basicPrice;
          },
        ),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  commissionPercentage: Yup.number()
    .required("Commission percentage is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
  durationMinutes: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute"),
  requiresVenue: Yup.boolean(),
  isOnline: Yup.boolean(),
  isOffline: Yup.boolean().test(
    "single-mode-selected",
    "Please select exactly one service mode: Online or Offline",
    function (value) {
      const { isOnline } = this.parent;
      const on = Boolean(isOnline);
      const off = Boolean(value);
      return (on || off) && !(on && off);
    }
  ),
  isUpcomingFestival: Yup.boolean(),
  festivalStartDate: Yup.string().when("isUpcomingFestival", {
    is: true,
    then: (schema) =>
      schema
        .required("Start date is required")
        .test(
          "is-future-start-date",
          "Start date and time cannot be in the past",
          (value) => {
            if (!value) return true;
            const selectedDate = new Date(value);
            if (isNaN(selectedDate.getTime())) return false;
            return selectedDate.getTime() >= Date.now() - 60000;
          }
        )
        .test(
          "is-before-end-date",
          "Start date and time must be earlier than the end date and time",
          function (value) {
            const { festivalEndDate } = this.parent;
            if (!value || !festivalEndDate) return true;
            const startDate = new Date(value);
            const endDate = new Date(festivalEndDate);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return true;
            return startDate.getTime() < endDate.getTime();
          }
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  festivalEndDate: Yup.string().when("isUpcomingFestival", {
    is: true,
    then: (schema) =>
      schema
        .required("End date is required")
        .test(
          "is-after-start-date",
          "End date and time should be later than the start date and time",
          function (value) {
            const { festivalStartDate } = this.parent;
            if (!value) return true;
            const endDate = new Date(value);
            if (isNaN(endDate.getTime())) return false;
            if (festivalStartDate) {
              const startDate = new Date(festivalStartDate);
              if (!isNaN(startDate.getTime())) {
                return endDate.getTime() > startDate.getTime();
              }
            }
            return endDate.getTime() > Date.now() - 60000;
          }
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  languages: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().trim().required("Language is required"),
        code: Yup.string().optional(),
      })
    )
    .min(1, "Please add at least one language"),
  sortOrder: Yup.mixed().test(
    "is-valid-sort-order",
    "Sort order must be a valid positive integer within defined limit",
    function (val) {
      if (val === "" || val === undefined || val === null) return true;
      const str = String(val).trim();
      const num = Number(str);
      if (isNaN(num)) {
        return this.createError({ message: "Sort order must be a valid number" });
      }
      if (num < 1) {
        return this.createError({ message: "Sort order must be a positive integer (minimum 1)" });
      }
      if (!Number.isInteger(num) || str.includes(".")) {
        return this.createError({ message: "Sort order must be a whole integer (no decimals)" });
      }
      if (num > 1000) {
        return this.createError({ message: "Sort order cannot exceed 1,000" });
      }
      return true;
    }
  ),
});

export default function AddServiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Basic Information", "Pricing & Details"];
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconTouched, setIconTouched] = useState(false);
  const benefitsRef = useRef<ServiceBenefitsFieldsRef>(null);
  const languagesRef = useRef<ServiceLanguagesFieldsRef>(null);
  const { showSnackbar } = useSnackbarStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getResolvedMode = (): { isOnline: boolean; isOffline: boolean } => {
    let rawType = "";
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        rawType = (urlParams.get("type") || urlParams.get("mode") || "").toLowerCase();
        if (!rawType) {
          const saved = (sessionStorage.getItem("admin_services_type") || "").toLowerCase();
          if (saved === "temple") {
            return { isOnline: false, isOffline: false };
          }
          if (saved === "offline_pooja" || saved === "offline") {
            return { isOnline: false, isOffline: true };
          }
          if (saved === "online_pooja" || saved === "online") {
            return { isOnline: true, isOffline: false };
          }
        }
      } catch (e) {
        // ignore
      }
    }

    if (!rawType && searchParams) {
      rawType = (searchParams.get("type") || searchParams.get("mode") || "").toLowerCase();
    }

    if (rawType === "temple") {
      return { isOnline: false, isOffline: false };
    }
    if (rawType === "offline" || rawType === "offline_pooja") {
      return { isOnline: false, isOffline: true };
    }
    if (rawType === "online" || rawType === "online_pooja") {
      return { isOnline: true, isOffline: false };
    }

    // Default to Online Pooja because the first tab in Services is Online Pooja Services
    return { isOnline: true, isOffline: false };
  };

  const initialMode = useMemo(() => getResolvedMode(), [searchParams]);

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const webpFile = await convertImageToWebP(file);
      setIconFile(webpFile);
      setIconPreview(URL.createObjectURL(webpFile));
      setIconTouched(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      categoryId: "",
      templeId: "",
      sortOrder: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      tokenPercentage: "",
      basicPrice: "",
      basicFeatures: [
        { title: "", type: "NORMAL", value: "true" },
      ] as Array<{ title: string; type: string; value: string }>,
      basicPurohitCarryItems: [] as string[],
      standardPrice: "",
      standardFeatures: [
        { title: "", type: "NORMAL", value: "true" },
      ] as Array<{ title: string; type: string; value: string }>,
      standardPurohitCarryItems: [] as string[],
      commissionPercentage: "",
      durationMinutes: "",
      requiresVenue: false,
      isOnline: initialMode.isOnline,
      isOffline: initialMode.isOffline,
      isUpcomingFestival: false,
      festivalStartDate: "",
      festivalEndDate: "",
      benefits: [] as Array<{ title: string; description: string }>,
      cities: [] as Array<{ name: string; state: string }>,
      languages: [] as Array<{ name: string; code?: string }>,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!iconFile) {
        setIconTouched(true);
        showSnackbar("Please upload a service icon", "error");
        return;
      }

      if (!values.isOnline && !values.isOffline) {
        showSnackbar(
          "Please select a service mode: Online or Offline",
          "error",
        );
        return;
      }
      if (values.isOnline && values.isOffline) {
        showSnackbar(
          "Please select only one service mode: Online or Offline",
          "error",
        );
        return;
      }

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        if (values.categoryId) {
          formData.append("categoryId", String(values.categoryId));
        }
        formData.append("description", values.description);
        if (values.metaTitle && values.metaTitle.trim()) {
          formData.append("metaTitle", values.metaTitle.trim());
        }
        if (values.metaDescription && values.metaDescription.trim()) {
          formData.append("metaDescription", values.metaDescription.trim());
        }
        formData.append("tokenPercentage", String(values.tokenPercentage));
        formData.append(
          "commissionPercentage",
          String(values.commissionPercentage),
        );
        formData.append("durationMinutes", String(values.durationMinutes));

        // Build plans JSON payload
        const plansPayload: any = {
          basic: {
            price: Number(values.basicPrice) || 0,
            features: (values.basicFeatures || [])
              .filter((f: any) => f && (f.title?.trim() || f.key?.trim()))
              .map((f: any) => ({
                title: (f.title || f.key || "").trim(),
                type: f.type || "NORMAL",
                value:
                  f.type === "PRICE"
                    ? f.value !== undefined && f.value !== "" && f.value !== "true"
                      ? String(f.value).trim()
                      : "0"
                    : "true",
                isActive: true,
              })),
          },
        };

        if (values.isOffline) {
          plansPayload.standard = {
            price: Number(values.standardPrice) || 0,
            features: (values.standardFeatures || [])
              .filter((f: any) => f && (f.title?.trim() || f.key?.trim()))
              .map((f: any) => ({
                title: (f.title || f.key || "").trim(),
                type: f.type || "NORMAL",
                value:
                  f.type === "PRICE"
                    ? f.value !== undefined && f.value !== "" && f.value !== "true"
                      ? String(f.value).trim()
                      : "0"
                    : "true",
                isActive: true,
              })),
          };
        }
        formData.append("plans", JSON.stringify(plansPayload));

        if (
          values.sortOrder !== "" &&
          values.sortOrder !== undefined &&
          values.sortOrder !== null
        ) {
          formData.append("sortOrder", String(values.sortOrder));
        }

        // 3. Purohit Carry Items (Offline Only)
        if (values.isOffline) {
          const validBasicCarry = (values.basicPurohitCarryItems || [])
            .map((i: any) => (typeof i === "string" ? i.trim() : ""))
            .filter(Boolean);

          validBasicCarry.forEach((item, index) => {
            formData.append(`purohitCarryItems[basic][${index}]`, item);
          });

          const validStandardCarry = (values.standardPurohitCarryItems || [])
            .map((i: any) => (typeof i === "string" ? i.trim() : ""))
            .filter(Boolean);
          validStandardCarry.forEach((item, index) => {
            formData.append(`purohitCarryItems[standard][${index}]`, item);
          });
        }

        formData.append(
          "requiresVenue",
          values.isOffline && values.requiresVenue ? "true" : "false",
        );
        formData.append(
          "isOnline",
          values.isOnline ? "true" : "false",
        );
        formData.append(
          "isOffline",
          values.isOffline ? "true" : "false",
        );
        formData.append(
          "isUpcomingFestival",
          values.isUpcomingFestival ? "true" : "false",
        );
        if (values.isUpcomingFestival) {
          formData.append(
            "festivalStartDate",
            new Date(values.festivalStartDate).toISOString(),
          );
          formData.append(
            "festivalEndDate",
            new Date(values.festivalEndDate).toISOString(),
          );
        }

        const validBenefits = values.benefits.filter(
          (b) => b.title && b.title.trim(),
        );
        if (validBenefits.length > 0) {
          formData.append("benefits", JSON.stringify(validBenefits));
        }

        if (values.isOffline) {
          const validCities = values.cities.filter(
            (c) => c.name && c.name.trim(),
          );
          if (validCities.length > 0) {
            formData.append("cities", JSON.stringify(validCities));
          }
        }

        const validLanguages = values.languages.filter(
          (l: any) => l.name && l.name.trim(),
        );
        if (validLanguages.length > 0) {
          formData.append(
            "languages",
            JSON.stringify(
              validLanguages.map((l: any) => ({
                name: l.name.trim(),
                ...(l.code ? { code: l.code } : {}),
              })),
            ),
          );
        }

        formData.append("isActive", "true");

        if (values.templeId) {
          formData.append("templeId", String(values.templeId));
        }

        formData.append("icon", iconFile);

        const response = await addServiceAPI(formData);

        if (response.success) {
          showSnackbar("Service created successfully", "success");
          const isTemple =
            Boolean(values.templeId) ||
            searchParams?.get("type")?.toLowerCase() === "temple" ||
            (typeof window !== "undefined" &&
              new URLSearchParams(window.location.search).get("type")?.toLowerCase() === "temple") ||
            (typeof window !== "undefined" &&
              sessionStorage.getItem("admin_services_type")?.toUpperCase() === "TEMPLE");

          if (isTemple) {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("admin_services_type", "TEMPLE");
            }
            router.push("/admin/services?type=temple");
          } else if (values.isOnline) {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("admin_services_type", "ONLINE_POOJA");
            }
            router.push("/admin/services?type=online_pooja");
          } else {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("admin_services_type", "OFFLINE_POOJA");
            }
            router.push("/admin/services?type=offline_pooja");
          }
        } else {
          showSnackbar(response.message || "Failed to create service", "error");
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || "Error creating service",
          "error",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const mode = getResolvedMode();
    formik.setFieldValue("isOnline", mode.isOnline);
    formik.setFieldValue("isOffline", mode.isOffline);
    if (mode.isOnline) {
      formik.setFieldValue("requiresVenue", false);
    }
  }, [searchParams]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = formik;

  const handleNext = async () => {
    if (activeStep === 0) {
      const step0Fields = [
        "name",
        "categoryId",
        "sortOrder",
        "description",
        "festivalStartDate",
        "festivalEndDate",
        "languages",
      ];
      const step0Errors = await formik.validateForm();

      let hasErrors = false;
      step0Fields.forEach((field) => {
        if (step0Errors[field as keyof typeof step0Errors]) {
          formik.setFieldTouched(field, true, true);
          hasErrors = true;
        }
      });

      if (!iconFile) {
        setIconTouched(true);
        hasErrors = true;
      }

      if (!values.isOnline && !values.isOffline) {
        formik.setFieldTouched("isOnline", true, true);
        formik.setFieldTouched("isOffline", true, true);
        hasErrors = true;
      } else if (values.isOnline && values.isOffline) {
        formik.setFieldTouched("isOnline", true, true);
        formik.setFieldTouched("isOffline", true, true);
        hasErrors = true;
      }

      if (benefitsRef.current && !benefitsRef.current.validateOnContinue()) {
        hasErrors = true;
      }

      if (languagesRef.current && !languagesRef.current.validateOnContinue()) {
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }

      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleCancel = () => {
    if (
      searchParams?.get("type")?.toLowerCase() === "temple" ||
      (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("type")?.toLowerCase() === "temple") ||
      Boolean(values.templeId)
    ) {
      router.push("/admin/services?type=temple");
    } else if (values.isOnline) {
      router.push("/admin/services?type=online_pooja");
    } else if (values.isOffline) {
      router.push("/admin/services?type=offline_pooja");
    } else {
      router.push("/admin/services");
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <FormikProvider value={formik}>
      <FormikValidationSnackbar />
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <NextLink
            href={
              searchParams?.get("type")?.toLowerCase() === "temple" ||
              (typeof window !== "undefined" &&
                new URLSearchParams(window.location.search).get("type")?.toLowerCase() === "temple") ||
              Boolean(values.templeId)
                ? "/admin/services?type=temple"
                : values.isOnline
                ? "/admin/services?type=online_pooja"
                : "/admin/services?type=offline_pooja"
            }
            style={{ textDecoration: "none", color: "#64748b" }}
          >
            Services
          </NextLink>
          <Typography color="text.primary">Add New Service</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1e293b",
              }}
            >
              Create New Service
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#64748b",
                mt: 0.5,
              }}
            >
              Configure a new ritual or service to offer on 1Pooja.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
            sx={{
              color: "#64748b",
              borderColor: "#cbd5e1",
              borderRadius: "30px",
              px: 3.5,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              fontFamily: FONTS.OUTFIT,
              "&:hover": { borderColor: "#94a3b8", bgcolor: "#f1f5f9" },
            }}
          >
            Cancel
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
          }}
        >
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 5,
              "& .MuiStepIcon-root.Mui-active": { color: COLORS.PRIMARY },
              "& .MuiStepIcon-root.Mui-completed": { color: "#10b981" },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontFamily: FONTS.OUTFIT,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 300 }}>
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <ServiceAvailabilityFields
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />

                <Grid size={{ xs: 12 }}>
                  <ServiceIconUploadField
                    iconPreview={iconPreview}
                    onIconChange={handleIconChange}
                    error={Boolean(iconTouched && !iconFile)}
                    helperText={iconTouched && !iconFile ? "Service icon is required" : undefined}
                  />
                </Grid>

                <ServiceBasicFields
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />

                <ServiceBenefitsFields
                  ref={benefitsRef}
                  benefits={values.benefits}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />

                {values.isOffline && (
                  <ServiceCitiesFields
                    cities={values.cities}
                    setFieldValue={setFieldValue}
                  />
                )}

                <ServiceLanguagesFields
                  ref={languagesRef}
                  languages={values.languages}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <ServicePricingFields
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <ServicePlansTabConfig
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              </Grid>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: activeStep === 0 ? "flex-end" : "space-between",
            }}
          >
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                sx={{
                  color: "#64748b",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                key="submit-btn"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  background: COLORS.PRIMARY,
                  color: "white",
                  px: 4,
                  py: 1,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { background: COLORS.PRIMARY_DARK, boxShadow: "none" },
                }}
              >
                {isSubmitting ? "Saving..." : "Save Service"}
              </Button>
            ) : (
              <Button
                key="continue-btn"
                variant="contained"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                disabled={isSubmitting}
                sx={{
                  background: COLORS.PRIMARY,
                  color: "white",
                  px: 4,
                  py: 1,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { background: COLORS.PRIMARY_DARK, boxShadow: "none" },
                }}
              >
                Continue
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </FormikProvider>
  );
}

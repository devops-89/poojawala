"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
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
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import { editServiceAPI, getServiceByIdAPI } from "@/api/serviceControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { useSnackbarStore } from "@/stores/snackbarStore";

import ServiceAvailabilityFields from "./ServiceAvailabilityFields";
import ServiceBasicFields from "./ServiceBasicFields";
import ServiceBenefitsFields from "./ServiceBenefitsFields";
import ServiceCitiesFields from "./ServiceCitiesFields";
import ServiceIconUploadField from "./ServiceIconUploadField";
import ServiceLanguagesFields from "./ServiceLanguagesFields";
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
  isActive: Yup.boolean(),
  isUpcomingFestival: Yup.boolean(),
  festivalStartDate: Yup.string().when("isUpcomingFestival", {
    is: true,
    then: (schema) => schema.required("Start date is required"),
  }),
  festivalEndDate: Yup.string().when("isUpcomingFestival", {
    is: true,
    then: (schema) => schema.required("End date is required"),
  }),
  sortOrder: Yup.mixed().test(
    "is-valid-number",
    "Sort order must be a valid non-negative number",
    (val) => {
      if (val === "" || val === undefined || val === null) return true;
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }
  ),
});

export default function EditServiceForm() {
  const router = useRouter();
  const params = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Basic Information", "Pricing & Details"];
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [existingIconUrl, setExistingIconUrl] = useState<string | null>(null);
  const [numericServiceId, setNumericServiceId] = useState<string | number | null>(null);
  const [isIconRemoved, setIsIconRemoved] = useState(false);
  const { showSnackbar } = useSnackbarStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalValues, setOriginalValues] = useState<any>(null);

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const webpFile = await convertImageToWebP(file);
      setIconFile(webpFile);
      setIconPreview(URL.createObjectURL(webpFile));
      setIsIconRemoved(false);
    }
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    setExistingIconUrl(null);
    setIsIconRemoved(true);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      categoryId: "",
      templeId: "",
      sortOrder: "",
      description: "",
      tokenPercentage: "40.00",
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
      isOnline: false,
      isOffline: true,
      isActive: true,
      isUpcomingFestival: false,
      festivalStartDate: "",
      festivalEndDate: "",
      benefits: [] as Array<{ title: string; description: string }>,
      cities: [] as Array<{ name: string; state: string }>,
      languages: [] as Array<{ name: string; code?: string }>,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (
        originalValues &&
        JSON.stringify(values) === JSON.stringify(originalValues) &&
        !iconFile &&
        !isIconRemoved
      ) {
        showSnackbar("No changes detected", "info");
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
          } else {
            formData.append("cities", JSON.stringify([]));
          }
        } else {
          formData.append("cities", JSON.stringify([]));
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

        if (isIconRemoved) {
          formData.append("iconUrl", "");
        } else {
          let fileToSend = iconFile;
          if (!fileToSend && existingIconUrl) {
            try {
              const imgRes = await fetch(existingIconUrl);
              if (imgRes.ok) {
                const blob = await imgRes.blob();
                const ext = blob.type?.split("/")[1] || "webp";
                fileToSend = new File([blob], `service_icon.${ext}`, {
                  type: blob.type || "image/webp",
                });
              }
            } catch (err) {
              console.error("Could not fetch existing icon file:", err);
            }
          }

          if (fileToSend) {
            formData.append("icon", fileToSend);
          } else if (existingIconUrl) {
            formData.append("iconUrl", existingIconUrl);
          }
        }

        const targetId = numericServiceId || (params.id as string);
        const response = await editServiceAPI(targetId, formData);

        if (response.success) {
          showSnackbar("Service updated successfully", "success");
          router.push("/admin/services");
        } else {
          showSnackbar(response.message || "Failed to update service", "error");
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || "Error updating service",
          "error",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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

  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const res = await getServiceByIdAPI(params.id as string);
        if (res.success && res.data) {
          const service = res.data.data || res.data;
          if (service.id) {
            setNumericServiceId(service.id);
            if (typeof window !== "undefined") {
              localStorage.setItem("last_service_id", String(service.id));
              sessionStorage.setItem("last_service_id", String(service.id));
              if (service.slug) {
                const s = String(service.slug).toLowerCase();
                localStorage.setItem(`slug_to_id_${s}`, String(service.id));
                sessionStorage.setItem(`slug_to_id_${s}`, String(service.id));
                localStorage.setItem(`service_slug_${s}`, String(service.id));
                sessionStorage.setItem(`service_slug_${s}`, String(service.id));
              }
            }
          }
          if (service.slug && /^\d+$/.test(String(params.id))) {
            window.history.replaceState(null, "", `/admin/services/edit/${service.slug}`);
          }

          let basicPrice =
            service.plans?.basic?.price ??
            service.priceWithoutSamagri ??
            service.minPrice ??
            "";

          let standardPrice =
            service.plans?.standard?.price ??
            service.priceWithSamagri ??
            service.maxPrice ??
            "";

          // Unroll features
          const parsePlanFeatures = (rawFeatures: any) => {
            if (Array.isArray(rawFeatures)) {
              return rawFeatures.map((f: any) => ({
                title: f.title || f.name || f.key || "",
                type: (f.type === "PRICE" ? "PRICE" : "NORMAL") as string,
                value:
                  f.value !== undefined
                    ? String(f.value)
                    : f.type === "PRICE"
                    ? ""
                    : "true",
              }));
            }
            if (rawFeatures && typeof rawFeatures === "object") {
              return Object.entries(rawFeatures)
                .filter(
                  ([k]) =>
                    k !== "price" &&
                    k !== "tokenAmount" &&
                    k !== "basicPurohitPayoutAmount" &&
                    k !== "standardPurohitPayoutAmount" &&
                    k !== "purohitPayoutAmount" &&
                    k !== "features" &&
                    k !== "bulletPoints",
                )
                .map(([k, v]) => ({
                  title: k,
                  type: "NORMAL",
                  value: typeof v === "object" ? JSON.stringify(v) : String(v),
                }));
            }
            return [];
          };

          let basicFeatList = parsePlanFeatures(
            service.plans?.basic?.features ||
              (typeof service.plans?.basic === "object"
                ? service.plans.basic
                : null),
          );
          if (basicFeatList.length === 0) {
            basicFeatList = [{ title: "", type: "NORMAL", value: "true" }];
          }

          let standardFeatList = parsePlanFeatures(
            service.plans?.standard?.features ||
              (typeof service.plans?.standard === "object"
                ? service.plans.standard
                : null),
          );
          if (standardFeatList.length === 0) {
            standardFeatList = [{ title: "", type: "NORMAL", value: "true" }];
          }

          // Unroll purohitCarryItems
          let basicPurohitCarryItems: string[] = [];
          let standardPurohitCarryItems: string[] = [];
          if (
            service.purohitCarryItems &&
            typeof service.purohitCarryItems === "object"
          ) {
            if (Array.isArray(service.purohitCarryItems.basic)) {
              basicPurohitCarryItems = service.purohitCarryItems.basic;
            }
            if (Array.isArray(service.purohitCarryItems.standard)) {
              standardPurohitCarryItems = service.purohitCarryItems.standard;
            }
          }
          let resolvedIsOnline = false;
          let resolvedIsOffline = true;
          if (service.isOnline && !service.isOffline) {
            resolvedIsOnline = true;
            resolvedIsOffline = false;
          } else if (service.isOffline && !service.isOnline) {
            resolvedIsOnline = false;
            resolvedIsOffline = true;
          } else if (service.isOnline && service.isOffline) {
            if (service.mode === "ONLINE") {
              resolvedIsOnline = true;
              resolvedIsOffline = false;
            } else if (Array.isArray(service.cities) && service.cities.length > 0) {
              resolvedIsOnline = false;
              resolvedIsOffline = true;
            } else {
              resolvedIsOnline = true;
              resolvedIsOffline = false;
            }
          } else {
            if (service.mode === "ONLINE") {
              resolvedIsOnline = true;
              resolvedIsOffline = false;
            } else {
              resolvedIsOnline = false;
              resolvedIsOffline = true;
            }
          }

          const newValues = {
            name: service.name || "",
            categoryId:
              service.categoryId ||
              service.category?.id ||
              (typeof service.category === "object"
                ? service.category?.id
                : "") ||
              "",
            templeId: service.templeId || service.temple?.id || "",
            sortOrder:
              service.sortOrder !== undefined && service.sortOrder !== null
                ? service.sortOrder
                : "",
            description: service.description || "",
            tokenPercentage: service.tokenPercentage ?? "40.00",
            basicPrice: basicPrice,
            basicFeatures: basicFeatList,
            basicPurohitCarryItems: basicPurohitCarryItems,
            standardPrice: standardPrice,
            standardFeatures: standardFeatList,
            standardPurohitCarryItems: standardPurohitCarryItems,
            commissionPercentage: service.commissionPercentage || "",
            durationMinutes: service.durationMinutes || "",
            requiresVenue: resolvedIsOffline ? (service.requiresVenue ?? false) : false,
            isOnline: resolvedIsOnline,
            isOffline: resolvedIsOffline,
            isActive: service.isActive ?? true,
            isUpcomingFestival: service.isUpcomingFestival ?? false,
            festivalStartDate: service.festivalStartDate
              ? new Date(service.festivalStartDate).toISOString().slice(0, 16)
              : "",
            festivalEndDate: service.festivalEndDate
              ? new Date(service.festivalEndDate).toISOString().slice(0, 16)
              : "",
            benefits: Array.isArray(service.benefits) ? service.benefits : [],
            cities: Array.isArray(service.cities) ? service.cities : [],
            languages: Array.isArray(service.languages)
              ? service.languages.map((l: any) => ({
                  name: typeof l === "string" ? l : l.name || "",
                  code: typeof l === "object" && l.code ? l.code : undefined,
                }))
              : [],
          };
          formik.resetForm({ values: newValues });
          setOriginalValues(newValues);

          if (service.id) {
            setNumericServiceId(service.id);
          }

          const existingIcon = service.iconDownloadurl || service.iconUrl;
          if (existingIcon) {
            setExistingIconUrl(existingIcon);
            setIconPreview(existingIcon);
          }
        } else {
          showSnackbar(
            res.message || "Failed to fetch service details",
            "error",
          );
        }
      } catch (error) {
        showSnackbar("Error fetching service details", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const handleNext = async () => {
    if (activeStep === 0) {
      const fieldLabels: Record<string, string> = {
        name: "Service Name",
        categoryId: "Category",
        description: "Description",
        festivalStartDate: "Festival Start Date",
        festivalEndDate: "Festival End Date",
      };

      const step0Fields = [
        "name",
        "categoryId",
        "description",
        "festivalStartDate",
        "festivalEndDate",
      ];
      const step0Errors = await formik.validateForm();

      const invalidFields: string[] = [];
      step0Fields.forEach((field) => {
        if (step0Errors[field as keyof typeof step0Errors]) {
          formik.setFieldTouched(field, true, true);
          invalidFields.push(fieldLabels[field] || field);
        }
      });

      if (invalidFields.length > 0) {
        showSnackbar(
          `Please complete all required fields in Basic Information before continuing: ${invalidFields.join(", ")}`,
          "error",
        );
        return;
      }

      if (!values.isOnline && !values.isOffline) {
        formik.setFieldTouched("isOnline", true, true);
        formik.setFieldTouched("isOffline", true, true);
        showSnackbar(
          "Please select a service mode: Online or Offline",
          "error",
        );
        return;
      }
      if (values.isOnline && values.isOffline) {
        formik.setFieldTouched("isOnline", true, true);
        formik.setFieldTouched("isOffline", true, true);
        showSnackbar(
          "Please select only one service mode: Online or Offline",
          "error",
        );
        return;
      }
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

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
            href="/admin/services"
            style={{ textDecoration: "none", color: "#64748b" }}
          >
            Services
          </NextLink>
          <Typography color="text.primary">Edit Service</Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            Edit Service
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748b",
              mt: 0.5,
            }}
          >
            Update ritual configuration, pricing, and details.
          </Typography>
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
                  showStatusSwitch={true}
                />

                <Grid size={{ xs: 12 }}>
                  <ServiceIconUploadField
                    iconPreview={iconPreview}
                    onIconChange={handleIconChange}
                    onRemoveIcon={handleRemoveIcon}
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
                  languages={values.languages}
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
                {isSubmitting ? "Saving..." : "Save Changes"}
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

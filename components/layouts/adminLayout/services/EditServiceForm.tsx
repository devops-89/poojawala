"use client";

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

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Service name is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  tokenPercentage: Yup.number()
    .required("Token percentage is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
  basicPrice: Yup.number()
    .required("Basic plan price is required")
    .min(0, "Cannot be negative"),
  standardPrice: Yup.number()
    .required("Standard plan price is required")
    .min(0, "Cannot be negative")
    .test(
      "is-greater-than-basic",
      "Standard plan price should be greater than or equal to Basic plan price",
      function (value) {
        const { basicPrice } = this.parent;
        return (
          basicPrice === undefined ||
          value === undefined ||
          value >= basicPrice
        );
      },
    ),
  commissionPercentage: Yup.number()
    .required("Commission percentage is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
  durationMinutes: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute"),
  requiresVenue: Yup.boolean(),
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
});

export default function EditServiceForm() {
  const router = useRouter();
  const params = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Basic Information", "Pricing & Details"];
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const { showSnackbar } = useSnackbarStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalValues, setOriginalValues] = useState<any>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      tokenPercentage: "30.00",
      basicPrice: "",
      basicFeatures: [{ key: "", value: "" }] as Array<{
        key: string;
        value: string;
      }>,
      standardPrice: "",
      standardFeatures: [{ key: "", value: "" }] as Array<{
        key: string;
        value: string;
      }>,
      commissionPercentage: "",
      durationMinutes: "",
      requiresVenue: false,
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
        !iconFile
      ) {
        showSnackbar("No changes detected", "info");
        return;
      }

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("tokenPercentage", String(values.tokenPercentage));
        formData.append(
          "commissionPercentage",
          String(values.commissionPercentage),
        );
        formData.append("durationMinutes", String(values.durationMinutes));

        const basicPlanObj: Record<string, any> = {
          price: Number(values.basicPrice),
        };

        values.basicFeatures.forEach((item: any) => {
          const k = item.key?.trim();
          if (!k) return;
          const v = item.value?.trim();
          if (v === "false") {
            basicPlanObj[k] = false;
          } else if (v === "true" || v === "") {
            basicPlanObj[k] = true;
          } else if (!isNaN(Number(v)) && v !== "") {
            basicPlanObj[k] = Number(v);
          } else {
            basicPlanObj[k] = v;
          }
        });

        const standardPlanObj: Record<string, any> = {
          price: Number(values.standardPrice),
        };

        values.standardFeatures.forEach((item: any) => {
          const k = item.key?.trim();
          if (!k) return;
          const v = item.value?.trim();
          if (v === "false") {
            standardPlanObj[k] = false;
          } else if (v === "true" || v === "") {
            standardPlanObj[k] = true;
          } else if (!isNaN(Number(v)) && v !== "") {
            standardPlanObj[k] = Number(v);
          } else {
            standardPlanObj[k] = v;
          }
        });

        const plansObj = {
          basic: basicPlanObj,
          standard: standardPlanObj,
        };

        Object.entries(basicPlanObj).forEach(([k, v]) => {
          formData.append(`plans[basic][${k}]`, String(v));
        });
        Object.entries(standardPlanObj).forEach(([k, v]) => {
          formData.append(`plans[standard][${k}]`, String(v));
        });

        formData.append(
          "requiresVenue",
          values.requiresVenue ? "true" : "false",
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

        const validCities = values.cities.filter(
          (c) => c.name && c.name.trim(),
        );
        if (validCities.length > 0) {
          formData.append("cities", JSON.stringify(validCities));
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

        if (iconFile) {
          formData.append("icon", iconFile);
        }

        const response = await editServiceAPI(params.id as string, formData);

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
  } = formik;

  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const res = await getServiceByIdAPI(params.id as string);
        if (res.success && res.data) {
          const service = res.data.data || res.data;

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

          let basicFeatList: Array<{ key: string; value: string }> = [];
          if (
            service.plans?.basic &&
            typeof service.plans.basic === "object"
          ) {
            basicFeatList = Object.entries(service.plans.basic)
              .filter(([k]) => k !== "price" && k !== "bulletPoints")
              .map(([k, v]) => ({ key: k, value: String(v) }));
          }
          if (basicFeatList.length === 0) {
            basicFeatList = [{ key: "", value: "" }];
          }

          let standardFeatList: Array<{ key: string; value: string }> = [];
          if (
            service.plans?.standard &&
            typeof service.plans.standard === "object"
          ) {
            standardFeatList = Object.entries(service.plans.standard)
              .filter(([k]) => k !== "price" && k !== "bulletPoints")
              .map(([k, v]) => ({ key: k, value: String(v) }));
          }
          if (standardFeatList.length === 0) {
            standardFeatList = [{ key: "", value: "" }];
          }

          const newValues = {
            name: service.name || "",
            description: service.description || "",
            tokenPercentage: service.tokenPercentage ?? "30.00",
            basicPrice: basicPrice,
            basicFeatures: basicFeatList,
            standardPrice: standardPrice,
            standardFeatures: standardFeatList,
            commissionPercentage: service.commissionPercentage || "",
            durationMinutes: service.durationMinutes || "",
            requiresVenue: service.requiresVenue ?? false,
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

          if (service.iconDownloadurl || service.iconUrl) {
            setIconPreview(service.iconDownloadurl || service.iconUrl);
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
      const step0Fields = ["name", "description"];
      const step0Errors = await formik.validateForm();

      const hasStep0Errors = step0Fields.some(
        (field) => step0Errors[field as keyof typeof step0Errors],
      );

      if (hasStep0Errors) {
        step0Fields.forEach((field) => {
          formik.setFieldTouched(field, true, true);
        });
        showSnackbar("Please fix errors in Basic Information", "error");
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
        <CircularProgress sx={{ color: "#FF6200" }} />
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
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            Edit Service
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
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
              "& .MuiStepIcon-root.Mui-active": { color: "#FF6200" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#10b981" },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontFamily: "var(--font-outfit), sans-serif",
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
                <Grid size={{ xs: 12 }}>
                  <ServiceIconUploadField
                    iconPreview={iconPreview}
                    onIconChange={handleIconChange}
                  />
                </Grid>

                <ServiceBasicFields
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <ServiceBenefitsFields
                  benefits={values.benefits}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <ServiceCitiesFields
                  cities={values.cities}
                  setFieldValue={setFieldValue}
                />

                <ServiceLanguagesFields
                  languages={values.languages}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <ServiceAvailabilityFields
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  showStatusSwitch={true}
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                key="submit-btn"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  background: "#FF6200",
                  color: "white",
                  px: 4,
                  py: 1,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { background: "#F05A00", boxShadow: "none" },
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
                  background: "#FF6200",
                  color: "white",
                  px: 4,
                  py: 1,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { background: "#F05A00", boxShadow: "none" },
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

"use client";

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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

import { addServiceAPI } from "@/api/serviceControllers";
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
  categoryId: Yup.string().required("Category is required"),
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

export default function AddServiceForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Basic Information", "Pricing & Details"];
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const { showSnackbar } = useSnackbarStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      categoryId: "",
      description: "",
      tokenPercentage: "40.00",
      basicPrice: "",
      basicFeatures: [
        { key: "kalashSthapana", value: "true" },
        { key: "durgaPuja", value: "true" },
        { key: "pujaSamagri", value: "Basic" },
      ] as Array<{ key: string; value: string }>,
      basicPurohitCarryItems: [
        "Ganapati Idol",
        "Puja Aasan",
        "Puja Thali",
        "Kalash",
        "Roli",
        "Moli",
        "Havan Samagri",
      ] as string[],
      standardPrice: "",
      standardFeatures: [
        { key: "kalashSthapana", value: "true" },
        { key: "durgaPuja", value: "true" },
        { key: "pujaSamagri", value: "Complete" },
      ] as Array<{ key: string; value: string }>,
      standardPurohitCarryItems: [
        "Ganapati Idol",
        "Premium Puja Aasan",
        "Premium Puja Thali",
        "Kalash",
        "Navagraha Puja Items",
        "Havan Kund",
        "Premium Puja Decorations",
      ] as string[],
      commissionPercentage: "",
      durationMinutes: "",
      requiresVenue: false,
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
        showSnackbar("Please upload a service icon", "error");
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

        // Append plans nested form data
        formData.append("plans[basic][price]", String(values.basicPrice));
        values.basicFeatures.forEach((item: any) => {
          const k = (typeof item === "string" ? item : item?.key)?.trim();
          if (!k) return;
          formData.append(`plans[basic][features][${k}]`, "true");
        });

        formData.append("plans[standard][price]", String(values.standardPrice));
        values.standardFeatures.forEach((item: any) => {
          const k = (typeof item === "string" ? item : item?.key)?.trim();
          if (!k) return;
          formData.append(`plans[standard][features][${k}]`, "true");
        });

        // 3. Purohit Carry Items
        const validBasicCarry = (values.basicPurohitCarryItems || [])
          .map((i: any) => (typeof i === "string" ? i.trim() : ""))
          .filter(Boolean);
        const validStandardCarry = (values.standardPurohitCarryItems || [])
          .map((i: any) => (typeof i === "string" ? i.trim() : ""))
          .filter(Boolean);

        validBasicCarry.forEach((item, index) => {
          formData.append(`purohitCarryItems[basic][${index}]`, item);
        });
        validStandardCarry.forEach((item, index) => {
          formData.append(`purohitCarryItems[standard][${index}]`, item);
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

        formData.append("icon", iconFile);

        const response = await addServiceAPI(formData);

        if (response.success) {
          showSnackbar("Service created successfully", "success");
          router.push("/admin/services");
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

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  const handleNext = async () => {
    if (activeStep === 0) {
      const step0Fields = ["name", "categoryId", "description"];
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
          <Typography color="text.primary">Add New Service</Typography>
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
            Create New Service
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#64748b",
              mt: 0.5,
            }}
          >
            Configure a new ritual or service to offer on Poojawala.
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

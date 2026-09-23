"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { City, State } from "country-state-city";
import { FieldArray, FormikProvider, useFormik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

import { addServiceAPI } from "@/api/serviceControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { useSnackbarStore } from "@/stores/snackbarStore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Service name is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  minPrice: Yup.number()
    .required("Minimum price is required")
    .min(0, "Cannot be negative"),
  maxPrice: Yup.number()
    .required("Maximum price is required")
    .min(0, "Cannot be negative")
    .test(
      "is-greater",
      "Max price should be greater than Min price",
      function (value) {
        const { minPrice } = this.parent;
        return (
          minPrice === undefined || value === undefined || value >= minPrice
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
      description: "",
      minPrice: "",
      maxPrice: "",
      commissionPercentage: "",
      durationMinutes: "",
      requiresVenue: false,
      isUpcomingFestival: false,
      festivalStartDate: "",
      festivalEndDate: "",
      benefits: [] as Array<{ title: string; description: string }>,
      cities: [] as Array<{ name: string; state: string }>,
      languages: [] as Array<{ name: string }>,
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
        formData.append("description", values.description);
        formData.append("minPrice", String(values.minPrice));
        formData.append("maxPrice", String(values.maxPrice));
        formData.append(
          "commissionPercentage",
          String(values.commissionPercentage),
        );
        formData.append("durationMinutes", String(values.durationMinutes));
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
          (l) => l.name && l.name.trim(),
        );
        if (validLanguages.length > 0) {
          formData.append(
            "languages",
            JSON.stringify(
              validLanguages.map((l) => ({ name: l.name.trim() })),
            ),
          );
        }

        // Auto-generate slug from name and hardcode isActive to satisfy backend validation
        const slug = values.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        formData.append("slug", slug);
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
    setFieldValue,
    handleSubmit,
  } = formik;

  const handleNext = async () => {
    const stepErrors = await formik.validateForm();
    let hasError = false;
    let firstError = "";

    if (activeStep === 0) {
      formik.setFieldTouched("name", true);
      formik.setFieldTouched("description", true);
      if (stepErrors.name) {
        hasError = true;
        firstError = stepErrors.name as string;
      } else if (stepErrors.description) {
        hasError = true;
        firstError = stepErrors.description as string;
      }
    }

    if (hasError) {
      showSnackbar(firstError || "Please fill in all required fields", "error");
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <FormikProvider value={formik}>
      <FormikValidationSnackbar />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 900,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 2 }}
          >
            <NextLink
              href="/admin/services"
              style={{
                textDecoration: "none",
                color: "#64748b",
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Services
            </NextLink>
            <Typography
              sx={{
                color: "#FF6200",
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Add New Service
            </Typography>
          </Breadcrumbs>
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
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      mb: 1,
                      color: "#1e293b",
                    }}
                  >
                    Service Icon *
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      minHeight: "56px",
                      border: "1px solid #c4c4c4",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#212121" },
                      overflow: "hidden",
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleIconChange}
                    />
                    {iconPreview ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          width: "100%",
                        }}
                      >
                        <Box
                          component="img"
                          src={iconPreview}
                          alt="Icon Preview"
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <Typography
                          sx={{ color: "#1e293b", fontSize: "16px", flex: 1 }}
                        >
                          Image Selected (Click to change)
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                        }}
                      >
                        <CloudUploadIcon
                          sx={{ color: "#94a3b8", fontSize: 24 }}
                        />
                        <Typography sx={{ color: "#94a3b8", fontSize: "16px" }}>
                          Click to upload an image...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      mb: 1,
                      color: "#1e293b",
                    }}
                  >
                    Service Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    placeholder="e.g., Satyanarayan Katha"
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      mb: 1,
                      color: "#1e293b",
                    }}
                  >
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    placeholder="Describe the ritual..."
                    variant="outlined"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>

                {/* Benefits Section */}
                <Grid size={{ xs: 12 }}>
                  <FieldArray name="benefits">
                    {({ push, remove }) => (
                      <Box
                        sx={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          p: 3,
                          bgcolor: "#f8fafc",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: values.benefits.length > 0 ? 2 : 0,
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontWeight: 700,
                                color: "#1e293b",
                              }}
                            >
                              Service Benefits
                            </Typography>
                            <Typography
                              sx={{ fontSize: "0.85rem", color: "#64748b" }}
                            >
                              Add key highlights and benefits of this ritual.
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => push({ title: "", description: "" })}
                            sx={{
                              borderColor: "#FF6200",
                              color: "#FF6200",
                              textTransform: "none",
                              borderRadius: "8px",
                              fontWeight: 600,
                              "&:hover": {
                                borderColor: "#E65800",
                                bgcolor: "#fff7ed",
                              },
                            }}
                          >
                            Add Benefit
                          </Button>
                        </Box>

                        {values.benefits.map((benefit: any, index: number) => (
                          <Box
                            key={`benefit-${index}`}
                            sx={{
                              mt: 2,
                              p: 2.5,
                              bgcolor: "white",
                              borderRadius: "12px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.9rem",
                                  color: "#1e293b",
                                  fontFamily: "var(--font-outfit), sans-serif",
                                }}
                              >
                                Benefit: {index + 1}
                              </Typography>
                              <IconButton
                                onClick={() => remove(index)}
                                size="small"
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": { bgcolor: "#fee2e2" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid size={{ xs: 12 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  name={`benefits.${index}.title`}
                                  label="Title"
                                  placeholder="e.g. Traditional Hanuman Puja"
                                  value={benefit.title}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: "8px",
                                    },
                                  }}
                                />
                              </Grid>
                              <Grid size={{ xs: 12 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  size="small"
                                  name={`benefits.${index}.description`}
                                  label="Description"
                                  placeholder="e.g. Performed according to traditional Vedic practices with Sankalp and Mantras."
                                  value={benefit.description}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: "8px",
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FieldArray>
                </Grid>

                {/* Cities Section */}
                <Grid size={{ xs: 12 }}>
                  <FieldArray name="cities">
                    {({ push, remove }) => (
                      <Box
                        sx={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          p: 3,
                          bgcolor: "#f8fafc",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: values.cities.length > 0 ? 2 : 0,
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontWeight: 700,
                                color: "#1e293b",
                              }}
                            >
                              Service Cities
                            </Typography>
                            <Typography
                              sx={{ fontSize: "0.85rem", color: "#64748b" }}
                            >
                              Specify cities and states where this service is
                              available.
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => push({ name: "", state: "" })}
                            sx={{
                              borderColor: "#FF6200",
                              color: "#FF6200",
                              textTransform: "none",
                              borderRadius: "8px",
                              fontWeight: 600,
                              "&:hover": {
                                borderColor: "#E65800",
                                bgcolor: "#fff7ed",
                              },
                            }}
                          >
                            Add City
                          </Button>
                        </Box>

                        {values.cities.map((city: any, index: number) => {
                          const indianStates =
                            State.getStatesOfCountry("IN") || [];
                          const currentState = indianStates.find(
                            (s) =>
                              s.name?.toLowerCase() ===
                              (city?.state || "").toLowerCase(),
                          );
                          const cityOptions = currentState
                            ? (
                                City.getCitiesOfState(
                                  "IN",
                                  currentState.isoCode,
                                ) || []
                              ).map((c) => c.name)
                            : (City.getCitiesOfCountry("IN") || [])
                                .slice(0, 100)
                                .map((c) => c.name);

                          return (
                            <Box
                              key={`city-${index}`}
                              sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                                mt: 2,
                                p: 2,
                                bgcolor: "white",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <Grid container spacing={2} sx={{ flex: 1 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Autocomplete
                                    freeSolo
                                    forcePopupIcon={true}
                                    options={indianStates.map((s) => s.name)}
                                    value={city.state || ""}
                                    onChange={(_, newValue) => {
                                      setFieldValue(
                                        `cities.${index}.state`,
                                        newValue || "",
                                      );
                                    }}
                                    onInputChange={(_, newInputValue) => {
                                      setFieldValue(
                                        `cities.${index}.state`,
                                        newInputValue || "",
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        label="State"
                                        placeholder="Select or type State (e.g. Uttar Pradesh)"
                                        sx={{
                                          "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Autocomplete
                                    freeSolo
                                    forcePopupIcon={true}
                                    options={cityOptions}
                                    value={city.name || ""}
                                    onChange={(_, newValue) => {
                                      setFieldValue(
                                        `cities.${index}.name`,
                                        newValue || "",
                                      );
                                    }}
                                    onInputChange={(_, newInputValue) => {
                                      setFieldValue(
                                        `cities.${index}.name`,
                                        newInputValue || "",
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        label="City"
                                        placeholder="Select or type City (e.g. Ghaziabad)"
                                        sx={{
                                          "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                </Grid>
                              </Grid>
                              <IconButton
                                onClick={() => remove(index)}
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": { bgcolor: "#fee2e2" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </FieldArray>
                </Grid>

                {/* Languages Section */}
                <Grid size={{ xs: 12 }}>
                  <FieldArray name="languages">
                    {({ push, remove }) => (
                      <Box
                        sx={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          p: 3,
                          bgcolor: "#f8fafc",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: values.languages.length > 0 ? 2 : 0,
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-outfit), sans-serif",
                                fontWeight: 700,
                                color: "#1e293b",
                              }}
                            >
                              Languages
                            </Typography>
                            <Typography
                              sx={{ fontSize: "0.85rem", color: "#64748b" }}
                            >
                              Add languages supported for this rituals.
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => push({ name: "" })}
                            sx={{
                              borderColor: "#FF6200",
                              color: "#FF6200",
                              textTransform: "none",
                              borderRadius: "8px",
                              fontWeight: 600,
                              "&:hover": {
                                borderColor: "#E65800",
                                bgcolor: "#fff7ed",
                              },
                            }}
                          >
                            Add Language
                          </Button>
                        </Box>

                        {values.languages.map((lang: any, index: number) => (
                          <Box
                            key={`lang-${index}`}
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                              mt: 2,
                              p: 2,
                              bgcolor: "white",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                name={`languages.${index}.name`}
                                label="Language"
                                placeholder="e.g. Hindi, Sanskrit, English"
                                value={lang.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                  },
                                }}
                              />
                            </Box>
                            <IconButton
                              onClick={() => remove(index)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": { bgcolor: "#fee2e2" },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      mb: 1,
                      color: "#1e293b",
                    }}
                  >
                    Availability Settings
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          name="requiresVenue"
                          checked={Boolean(values.requiresVenue)}
                          onChange={handleChange}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#FF6200",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              { backgroundColor: "#FF6200" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          Requires Venue
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          name="isUpcomingFestival"
                          checked={Boolean(values.isUpcomingFestival)}
                          onChange={handleChange}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#FF6200",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              { backgroundColor: "#FF6200" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          Upcoming Festival
                        </Typography>
                      }
                    />
                  </Box>
                  {values.isUpcomingFestival && (
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontWeight: 700,
                            mb: 1,
                            color: "#1e293b",
                          }}
                        >
                          Festival Start Date
                        </Typography>
                        <TextField
                          fullWidth
                          name="festivalStartDate"
                          variant="outlined"
                          type="datetime-local"
                          value={values.festivalStartDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.festivalStartDate &&
                            Boolean(errors.festivalStartDate)
                          }
                          helperText={
                            touched.festivalStartDate &&
                            errors.festivalStartDate
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontWeight: 700,
                            mb: 1,
                            color: "#1e293b",
                          }}
                        >
                          Festival End Date
                        </Typography>
                        <TextField
                          fullWidth
                          name="festivalEndDate"
                          variant="outlined"
                          type="datetime-local"
                          value={values.festivalEndDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.festivalEndDate &&
                            Boolean(errors.festivalEndDate)
                          }
                          helperText={
                            touched.festivalEndDate && errors.festivalEndDate
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      mb: 1,
                      color: "#1e293b",
                    }}
                  >
                    Minimum Price (₹) *
                  </Typography>
                  <TextField
                    fullWidth
                    name="minPrice"
                    placeholder="e.g. 1000"
                    variant="outlined"
                    type="number"
                    value={values.minPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.minPrice && Boolean(errors.minPrice)}
                    helperText={touched.minPrice && errors.minPrice}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      mb: 1,
                      color: "#1e293b",
                    }}
                  >
                    Maximum Price (₹) *
                  </Typography>
                  <TextField
                    fullWidth
                    name="maxPrice"
                    placeholder="e.g. 5000"
                    variant="outlined"
                    type="number"
                    value={values.maxPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.maxPrice && Boolean(errors.maxPrice)}
                    helperText={touched.maxPrice && errors.maxPrice}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      mb: 1,
                      color: "#1e293b",
                    }}
                  >
                    Commission Percentage (%) *
                  </Typography>
                  <TextField
                    fullWidth
                    name="commissionPercentage"
                    placeholder="e.g. 10"
                    variant="outlined"
                    type="number"
                    value={values.commissionPercentage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.commissionPercentage &&
                      Boolean(errors.commissionPercentage)
                    }
                    helperText={
                      touched.commissionPercentage &&
                      errors.commissionPercentage
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      mb: 1,
                      color: "#1e293b",
                    }}
                  >
                    Duration (Minutes) *
                  </Typography>
                  <TextField
                    fullWidth
                    name="durationMinutes"
                    placeholder="e.g. 120"
                    variant="outlined"
                    type="number"
                    value={values.durationMinutes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.durationMinutes && Boolean(errors.durationMinutes)
                    }
                    helperText={
                      touched.durationMinutes && errors.durationMinutes
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
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

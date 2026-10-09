"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { createTempleAPI, getTempleByIdAPI, updateTempleAPI } from "@/api/templeControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { convertImageToWebP } from "@/utils/imageHelper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { City, State } from "country-state-city";
import { FormikProvider, useFormik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Temple name is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
});

import { TempleFormProps } from "@/utils/types";

export default function TempleForm({ isEdit = false, id }: TempleFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const [loading, setLoading] = useState(isEdit);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      state: "",
      city: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!isEdit && !imageFile) {
        setImageError("Temple image is required");
        showSnackbar("Please upload a temple image", "error");
        return;
      }

      try {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", values.name.trim());
        formData.append("description", values.description.trim());
        if (values.state && values.state.trim()) {
          formData.append("state", values.state.trim());
        }
        formData.append("city", values.city.trim());
        formData.append("address", values.address.trim());
        if (imageFile) {
          formData.append("imageUrl", imageFile);
        }

        let res;
        if (isEdit && id) {
          res = await updateTempleAPI(id, formData);
        } else {
          res = await createTempleAPI(formData);
        }

        if (res.success) {
          showSnackbar(
            isEdit ? "Temple updated successfully" : "Temple created successfully",
            "success"
          );
          router.push("/admin/temples");
        } else {
          showSnackbar(
            res.message || `Failed to ${isEdit ? "update" : "create"} temple`,
            "error"
          );
        }
      } catch (error: any) {
        console.error("Temple submit error:", error);
        showSnackbar(
          error.response?.data?.message ||
            `Error ${isEdit ? "updating" : "creating"} temple. Please try again.`,
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Indian States from country-state-city
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry("IN") || [];
    return states.map((s) => s.name);
  }, []);

  // Filter cities dynamically based on selected state
  const cityOptions = useMemo(() => {
    if (!formik.values.state) return [];
    const states = State.getStatesOfCountry("IN") || [];
    const selectedStateObj = states.find(
      (s) =>
        s?.name?.toLowerCase().trim() ===
        (formik.values.state || "").toLowerCase().trim()
    );
    if (selectedStateObj && selectedStateObj.isoCode) {
      const cities =
        City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
      return Array.from(new Set(cities.map((c) => c.name))).sort((a, b) =>
        a.localeCompare(b)
      );
    }
    return [];
  }, [formik.values.state]);

  useEffect(() => {
    if (isEdit && id) {
      const fetchTemple = async () => {
        try {
          setLoading(true);
          const res = await getTempleByIdAPI(id);
          if (res.success && res.data) {
            const temple = res.data.data || res.data;
            formik.setValues({
              name: temple.name || "",
              description: temple.description || "",
              state: temple.state || "",
              city: temple.city || "",
              address: temple.address || "",
            });

            const existingImg = temple.downloadUrl || temple.imageUrl;
            if (existingImg) {
              setImagePreview(existingImg);
            }
          } else {
            showSnackbar("Temple not found", "error");
            router.push("/admin/temples");
          }
        } catch (err) {
          console.error("Failed to fetch temple details", err);
          showSnackbar("Error fetching temple details", "error");
        } finally {
          setLoading(false);
        }
      };

      fetchTemple();
    }
  }, [isEdit, id]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const webpFile = await convertImageToWebP(file);
        setImageFile(webpFile);
        setImagePreview(URL.createObjectURL(webpFile));
      } catch (err) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
      setImageError(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  return (
    <FormikProvider value={formik}>
      <FormikValidationSnackbar />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header & Breadcrumbs */}
        <Box>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 1, color: "#64748b" }}
          >
            <NextLink
              href="/admin/dashboard"
              style={{ textDecoration: "none", color: "#64748b" }}
            >
              Dashboard
            </NextLink>
            <NextLink
              href="/admin/temples"
              style={{ textDecoration: "none", color: "#64748b" }}
            >
              Temples
            </NextLink>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              {isEdit ? "Edit Temple" : "Add Temple"}
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            {isEdit ? "Edit Temple" : "Add New Temple"}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748b",
              mt: 0.5,
            }}
          >
            {isEdit
              ? "Update temple details and location."
              : "Create a new temple listing with location and details."}
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
              gap: 3.5,
            }}
          >
            {/* 1. Temple Image Upload (At the Very Top) */}
            <Box>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  mb: 1,
                  color: "#1e293b",
                }}
              >
                Temple Image {!isEdit && "*"}
              </Typography>
              <Box
                component="label"
                sx={{
                  width: "100%",
                  minHeight: "68px",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "12px",
                  bgcolor: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.5,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: COLORS.PRIMARY,
                    bgcolor: "#FFF0E6",
                  },
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
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
                      src={imagePreview}
                      alt="Temple Preview"
                      sx={{
                        width: 52,
                        height: 52,
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "0.95rem",
                        }}
                      >
                        Image Selected
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                        Click to change image
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      width: "100%",
                    }}
                  >
                    <CloudUploadIcon sx={{ color: COLORS.PRIMARY, fontSize: 28 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#334155",
                        }}
                      >
                        Click to upload temple image
                      </Typography>
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        PNG, JPG, WebP up to 10MB
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
              {imageError && (
                <Typography sx={{ fontSize: "0.75rem", color: "#d32f2f", mt: 0.5, ml: 1 }}>
                  {imageError}
                </Typography>
              )}
            </Box>

            {/* 2. Temple Name */}
            <TextField
              fullWidth
              name="name"
              label="Temple Name *"
              placeholder="e.g., Shri Hanuman Mandir"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            {/* 3. Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description *"
              placeholder="Enter detailed description of the temple..."
              variant="outlined"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            {/* 4. Location Details */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#1e293b",
                }}
              >
                Location Details
              </Typography>

              {/* State & City Filter */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon
                    options={stateOptions}
                    value={formik.values.state || ""}
                    onChange={(_, newValue) => {
                      const val = (newValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                      formik.setFieldValue("state", val);
                      formik.setFieldValue("city", "");
                    }}
                    onInputChange={(_, newInputValue) => {
                      const val = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                      formik.setFieldValue("state", val);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        name="state"
                        label="State"
                        placeholder="Select or type State"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon
                    disabled={!formik.values.state}
                    options={cityOptions}
                    value={formik.values.city || ""}
                    onChange={(_, newValue) => {
                      const val = (newValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                      formik.setFieldValue("city", val);
                    }}
                    onInputChange={(_, newInputValue) => {
                      const val = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                      formik.setFieldValue("city", val);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        name="city"
                        label="City *"
                        placeholder={
                          !formik.values.state
                            ? "Select State first"
                            : "Select or type City"
                        }
                        variant="outlined"
                        error={formik.touched.city && Boolean(formik.errors.city)}
                        helperText={
                          formik.touched.city
                            ? (formik.errors.city as string)
                            : !formik.values.state
                            ? "Select state to enable city selection"
                            : undefined
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Address Field (under State & City) */}
              <TextField
                fullWidth
                name="address"
                label="Address *"
                placeholder="e.g., Sector 62, Near Central Market"
                variant="outlined"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Bottom Actions */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                component={NextLink}
                href="/admin/temples"
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  borderColor: "#cbd5e1",
                  color: "#64748b",
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.2,
                  fontFamily: FONTS.OUTFIT,
                  "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  bgcolor: COLORS.PRIMARY,
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.2,
                  fontFamily: FONTS.OUTFIT,
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : isEdit ? (
                  "Update Temple"
                ) : (
                  "Save Temple"
                )}
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>
    </FormikProvider>
  );
}

"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import {
  ADDRESS_STRICT_REGEX,
  ADDRESS_STRICT_MESSAGE,
  allowOnlyAddressCharsOnKeyDown,
  sanitizeAddressInput,
  TITLE_STRICT_REGEX,
  TITLE_STRICT_MESSAGE,
  allowOnlyTitleCharsOnKeyDown,
  sanitizeTitleInput,
} from "@/utils/helpers";

import { createTempleAPI, getTempleByIdAPI, updateTempleAPI } from "@/api/templeControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { TiptapEditor } from "@/components/widgets/TiptapEditor";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { convertImageToWebP } from "@/utils/imageHelper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Temple name is required")
    .min(3, "Temple name must be at least 3 characters")
    .max(100, "Temple name cannot exceed 100 characters")
    .matches(
      TITLE_STRICT_REGEX,
      TITLE_STRICT_MESSAGE
    ),
  description: Yup.string()
    .required("Description is required")
    .test("meaningful-html", "Description must contain meaningful text with letters (at least 10 characters), not just symbols", (val) => {
      if (!val) return false;
      const stripped = val.replace(/<[^>]*>/g, "").trim();
      const letters = (stripped.match(/[a-zA-Z]/g) || []).length;
      return stripped.length >= 10 && letters >= 5;
    }),
  state: Yup.string().trim().required("State is required"),
  city: Yup.string().trim().required("City is required"),
  address: Yup.string()
    .trim()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .matches(ADDRESS_STRICT_REGEX, ADDRESS_STRICT_MESSAGE)
    .test("meaningful-address", "Address must contain letters, not just numbers or symbols", (val) => {
      if (!val) return false;
      return /[a-zA-Z]/.test(val);
    }),
});

import { TempleFormProps } from "@/utils/types";

export default function TempleForm({ isEdit = false, id }: TempleFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const [loading, setLoading] = useState(isEdit);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialDataRef = useRef<{
    name: string;
    description: string;
    state: string;
    city: string;
    address: string;
    hasImage: boolean;
  } | null>(null);

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
      if (!isEdit && !imageFile && !imagePreview) {
        setImageError("Temple image is required");
        showSnackbar("Please upload a temple image", "error");
        return;
      }

      // Check if updating without making any modifications
      if (isEdit && initialDataRef.current) {
        const init = initialDataRef.current;
        const isNameSame = values.name.trim() === init.name.trim();
        const isDescSame = values.description.trim() === init.description.trim();
        const isStateSame = (values.state || "").trim() === (init.state || "").trim();
        const isCitySame = values.city.trim() === init.city.trim();
        const isAddressSame = values.address.trim() === init.address.trim();
        const isImageSame = !imageFile && !imageRemoved;

        if (isNameSame && isDescSame && isStateSame && isCitySame && isAddressSame && isImageSame) {
          showSnackbar("No changes have been made", "info");
          return;
        }
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
        } else if (imageRemoved) {
          formData.append("imageUrl", "");
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

            initialDataRef.current = {
              name: temple.name || "",
              description: temple.description || "",
              state: temple.state || "",
              city: temple.city || "",
              address: temple.address || "",
              hasImage: Boolean(existingImg),
            };
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
      setImageRemoved(false);
      setImageError(null);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(true);
    if (!isEdit) {
      setImageError("Temple image is required");
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
              {imagePreview ? (
                <Box
                  sx={{
                    width: "100%",
                    minHeight: "72px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    bgcolor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.5,
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "0.95rem",
                        }}
                      >
                        {imageFile ? "New Image Selected" : "Temple Image"}
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                        Click Change to replace or Remove to clear
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: "8px",
                        borderColor: "#cbd5e1",
                        color: "#334155",
                        textTransform: "none",
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        "&:hover": { borderColor: COLORS.PRIMARY, color: COLORS.PRIMARY },
                      }}
                    >
                      Change Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteOutlineIcon fontSize="small" />}
                      onClick={handleRemoveImage}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      Remove Image
                    </Button>
                  </Box>
                </Box>
              ) : (
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
                </Box>
              )}
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
              onKeyDown={allowOnlyTitleCharsOnKeyDown}
              onChange={(e) => {
                formik.setFieldValue("name", sanitizeTitleInput(e.target.value));
                formik.setFieldTouched("name", true, false);
              }}
              onBlur={formik.handleBlur}
              error={
                Boolean(formik.errors.name) &&
                (formik.touched.name || Boolean(formik.values.name))
              }
              helperText={
                (formik.touched.name || Boolean(formik.values.name))
                  ? formik.errors.name
                  : undefined
              }
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            {/* 3. Description (Rich Text Editor) */}
            <TiptapEditor
              label="Description *"
              value={formik.values.description}
              onChange={(html) => {
                formik.setFieldValue("description", html);
                formik.setFieldTouched("description", true, false);
              }}
              onBlur={() => formik.setFieldTouched("description", true, true)}
              placeholder="Enter detailed description of the temple with rich formatting..."
              minHeight={250}
              error={
                Boolean(formik.errors.description) &&
                (formik.touched.description || Boolean(formik.values.description))
              }
              helperText={
                (formik.touched.description || Boolean(formik.values.description))
                  ? (formik.errors.description as string)
                  : undefined
              }
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
                      formik.setFieldValue("state", val, true);
                      formik.setFieldTouched("state", true, false);
                      formik.setFieldValue("city", "");
                      formik.setFieldTouched("city", false, false);
                    }}
                    onInputChange={(_, newInputValue, reason) => {
                      if (reason === "input") {
                        const val = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                        formik.setFieldValue("state", val, true);
                        formik.setFieldTouched("state", true, false);
                      } else if (reason === "clear") {
                        formik.setFieldValue("state", "");
                        formik.setFieldTouched("state", true, false);
                        formik.setFieldValue("city", "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        name="state"
                        label="State *"
                        placeholder="Select or type State"
                        variant="outlined"
                        error={Boolean(
                          formik.touched.state &&
                          formik.errors.state &&
                          !formik.values.state?.trim()
                        )}
                        helperText={
                          formik.touched.state &&
                          formik.errors.state &&
                          !formik.values.state?.trim()
                            ? (formik.errors.state as string)
                            : undefined
                        }
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
                      formik.setFieldValue("city", val, true);
                      formik.setFieldTouched("city", true, false);
                    }}
                    onInputChange={(_, newInputValue, reason) => {
                      if (reason === "input") {
                        const val = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                        formik.setFieldValue("city", val, true);
                        formik.setFieldTouched("city", true, false);
                      } else if (reason === "clear") {
                        formik.setFieldValue("city", "");
                        formik.setFieldTouched("city", true, false);
                      }
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
                        error={Boolean(
                          formik.touched.city &&
                          formik.errors.city &&
                          !formik.values.city?.trim()
                        )}
                        helperText={
                          formik.touched.city &&
                          formik.errors.city &&
                          !formik.values.city?.trim()
                            ? (formik.errors.city as string)
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
                onKeyDown={allowOnlyAddressCharsOnKeyDown}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("address", true, true);
                }}
                onBlur={formik.handleBlur}
                error={
                  Boolean(formik.errors.address) &&
                  (formik.touched.address || Boolean(formik.values.address))
                }
                helperText={
                  (formik.touched.address || Boolean(formik.values.address))
                    ? formik.errors.address
                    : undefined
                }
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

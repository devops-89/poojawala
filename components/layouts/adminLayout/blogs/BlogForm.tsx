"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SaveIcon from "@mui/icons-material/Save";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import NextLink from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";

import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { TiptapEditor } from "@/components/widgets/TiptapEditor";
import { convertImageToWebP } from "@/utils/imageHelper";

export interface BlogSection {
  heading?: string;
  title?: string;
  content?: string;
  description?: string;
}

export interface BlogFormValues {
  title: string;
  content: string;
  category: string;
  authorName: string;
  readTime: number | string;
  isFeatured: boolean;
  coverImage: string;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
  sections: BlogSection[];
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters")
    .matches(
      /^[a-zA-Z0-9\s&',.\-()?!:;"/]+$/,
      "Title contains invalid special characters"
    )
    .test("has-letters", "Title must contain letters, not just symbols or numbers", (val) => {
      if (!val) return false;
      return /[a-zA-Z]/.test(val);
    }),
  content: Yup.string()
    .required("Content is required")
    .test(
      "meaningful-html",
      "Content must contain meaningful text with letters (at least 20 characters), not just symbols",
      (val) => {
        if (!val) return false;
        const stripped = val.replace(/<[^>]*>/g, "").trim();
        const letters = (stripped.match(/[a-zA-Z]/g) || []).length;
        return stripped.length >= 20 && letters >= 10;
      }
    ),
  category: Yup.string()
    .trim()
    .required("Category is required")
    .min(2, "Category must be at least 2 characters")
    .matches(
      /^[a-zA-Z\s&',.\-/]+$/,
      "Category should only contain letters and standard characters"
    ),
  authorName: Yup.string()
    .trim()
    .required("Author name is required")
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s.]+$/, "Author name should only contain letters and spaces"),
  readTime: Yup.number()
    .typeError("Please enter a valid read time within the allowed limit")
    .min(1, "Read time must be at least 1 minute")
    .max(300, "Please enter a valid read time within the allowed limit (max 300 minutes)")
    .optional(),
  isFeatured: Yup.boolean().optional(),
  coverImage: Yup.string().optional(),
  status: Yup.string().optional(),
  metaTitle: Yup.string().trim().optional(),
  metaDescription: Yup.string().trim().optional(),
  sections: Yup.array()
    .of(
      Yup.object().shape({
        heading: Yup.string().optional(),
        title: Yup.string().optional(),
        content: Yup.string().optional(),
        description: Yup.string().optional(),
      })
    )
    .optional(),
});

interface BlogFormProps {
  initialValues?: BlogFormValues;
  onSubmit: (values: BlogFormValues, imageFile?: File | null) => Promise<void>;
  title: string;
  submitButtonText: string;
  isEdit?: boolean;
}

export default function BlogForm({
  initialValues = {
    title: "",
    content: "",
    category: "",
    authorName: "",
    readTime: "",
    isFeatured: false,
    coverImage: "",
    status: "PUBLISHED",
    metaTitle: "",
    metaDescription: "",
    sections: [],
  },
  onSubmit,
  title,
  submitButtonText,
  isEdit = false,
}: BlogFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues.coverImage || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<BlogFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onSubmit(values, imageFile);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const isFormModified = React.useCallback(() => {
    if (imageFile !== null) return true;
    if (formik.values.title !== initialValues.title) return true;
    if (formik.values.content !== initialValues.content) return true;
    if (formik.values.category !== initialValues.category) return true;
    if (formik.values.authorName !== initialValues.authorName) return true;
    if (String(formik.values.readTime ?? "") !== String(initialValues.readTime ?? "")) return true;
    if (Boolean(formik.values.isFeatured) !== Boolean(initialValues.isFeatured)) return true;
    if ((formik.values.coverImage || "") !== (initialValues.coverImage || "")) return true;
    if (formik.values.status && initialValues.status && formik.values.status !== initialValues.status) return true;
    if ((formik.values.metaTitle || "").trim() !== (initialValues.metaTitle || "").trim()) return true;
    if ((formik.values.metaDescription || "").trim() !== (initialValues.metaDescription || "").trim()) return true;

    const curSecs = formik.values.sections || [];
    const initSecs = initialValues.sections || [];
    if (curSecs.length !== initSecs.length) return true;
    for (let i = 0; i < curSecs.length; i++) {
      const c = curSecs[i];
      const ini = initSecs[i];
      const cTitle = c.title || c.heading || "";
      const iniTitle = ini.title || ini.heading || "";
      const cContent = c.content || c.description || "";
      const iniContent = ini.content || ini.description || "";
      if (cTitle !== iniTitle || cContent !== iniContent) return true;
    }

    return false;
  }, [formik.values, initialValues, imageFile]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const webpFile = await convertImageToWebP(file);
      setImageFile(webpFile);
      const objectUrl = URL.createObjectURL(webpFile);
      setImagePreview(objectUrl);
      formik.setFieldValue("coverImage", objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    formik.setFieldValue("coverImage", "");
  };

  const handleAddSection = () => {
    const currentSections = formik.values.sections || [];
    formik.setFieldValue("sections", [
      ...currentSections,
      { heading: "", content: "" },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    const currentSections = formik.values.sections || [];
    formik.setFieldValue(
      "sections",
      currentSections.filter((_, i) => i !== index)
    );
  };

  const handleSectionChange = (
    index: number,
    field: "heading" | "content" | "title" | "description",
    val: string
  ) => {
    const currentSections = [...(formik.values.sections || [])];
    currentSections[index] = {
      ...currentSections[index],
      [field]: val,
    };
    formik.setFieldValue("sections", currentSections);
  };

  return (
    <FormikProvider value={formik}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: 980,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3.5,
          p: { xs: 2, md: 3.5 },
        }}
      >
        <FormikValidationSnackbar message="Please complete all required fields before publishing the blog." />

        {/* Header & Breadcrumbs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{ mb: 1.5 }}
            >
              <NextLink
                href="/admin/blogs"
                style={{
                  textDecoration: "none",
                  color: "#64748b",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Blogs
              </NextLink>
              <Typography
                sx={{
                  color: COLORS.PRIMARY,
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {isEdit ? "Edit Blog Post" : "Create Blog Post"}
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
              {title}
            </Typography>
          </Box>
        </Box>

        {/* Main Form Paper */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
          }}
        >
          <Grid container spacing={3}>
            {/* Title Field */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Blog Title *"
                name="title"
                placeholder="e.g., Complete Satyanarayan Puja Vidhi: Samagri and Procedure"
                value={formik.values.title}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("title", true, false);
                }}
                onBlur={formik.handleBlur}
                error={
                  Boolean(formik.errors.title) &&
                  (formik.touched.title || Boolean(formik.values.title))
                }
                helperText={
                  (formik.touched.title || Boolean(formik.values.title))
                    ? formik.errors.title
                    : undefined
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>

            {/* Author Name, Category & Read Time */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Author Name *"
                name="authorName"
                placeholder="e.g., Pt. Ramesh Sharma"
                value={formik.values.authorName}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("authorName", true, false);
                }}
                onBlur={formik.handleBlur}
                error={
                  Boolean(formik.errors.authorName) &&
                  (formik.touched.authorName || Boolean(formik.values.authorName))
                }
                helperText={
                  (formik.touched.authorName || Boolean(formik.values.authorName))
                    ? formik.errors.authorName
                    : undefined
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>

            {/* Category - Normal Text Input */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Category *"
                name="category"
                placeholder="e.g., Puja & Rituals / Festivals"
                value={formik.values.category}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched("category", true, false);
                }}
                onBlur={formik.handleBlur}
                error={
                  Boolean(formik.errors.category) &&
                  (formik.touched.category || Boolean(formik.values.category))
                }
                helperText={
                  (formik.touched.category || Boolean(formik.values.category))
                    ? formik.errors.category
                    : undefined
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Read Time (Minutes)"
                name="readTime"
                placeholder="e.g., 4"
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 300,
                  },
                }}
                value={formik.values.readTime}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (!isNaN(Number(val)) && Number(val) <= 10000)) {
                    formik.handleChange(e);
                  }
                  formik.setFieldTouched("readTime", true, false);
                }}
                onBlur={formik.handleBlur}
                error={
                  Boolean(formik.errors.readTime) &&
                  (formik.touched.readTime || Boolean(formik.values.readTime !== "" && formik.values.readTime !== undefined))
                }
                helperText={
                  (formik.touched.readTime || Boolean(formik.values.readTime !== "" && formik.values.readTime !== undefined))
                    ? (formik.errors.readTime as string)
                    : undefined
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>


            {/* Featured Switch */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isFeatured}
                    onChange={(e) =>
                      formik.setFieldValue("isFeatured", e.target.checked)
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: COLORS.PRIMARY,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                      {
                        backgroundColor: COLORS.PRIMARY,
                      },
                    }}
                  />
                }
                label={
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                  >
                    <StarIcon sx={{ color: "#FF9100", fontSize: 18 }} />
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    >
                      Feature this blog
                    </Typography>
                  </Box>
                }
              />
            </Grid>

            {/* Cover Image Upload ONLY (No URL input) */}
            <Grid size={{ xs: 12 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: "#1e293b",
                  mb: 1,
                  fontSize: "0.95rem",
                }}
              >
                Cover Image Upload
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: 3,
                  p: 2.5,
                  borderRadius: "16px",
                  border: "2px dashed #cbd5e1",
                  bgcolor: "#f8fafc",
                }}
              >
                {imagePreview ? (
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar
                      src={imagePreview}
                      variant="rounded"
                      sx={{
                        width: 140,
                        height: 90,
                        borderRadius: "12px",
                        objectFit: "cover",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={handleRemoveImage}
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        bgcolor: "#ef4444",
                        color: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        "&:hover": {
                          bgcolor: "#dc2626",
                        },
                        width: 24,
                        height: 24,
                        p: 0,
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 140,
                      height: 90,
                      borderRadius: "12px",
                      bgcolor: "#FFF0E6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.PRIMARY,
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 36 }} />
                  </Box>
                )}

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "#1e293b",
                      mb: 1,
                    }}
                  >
                    Upload Cover Image File
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderColor: COLORS.PRIMARY,
                      color: COLORS.PRIMARY,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontFamily: FONTS.OUTFIT,
                      "&:hover": {
                        borderColor: COLORS.PRIMARY_DARK,
                        bgcolor: "#FFF0E6",
                      },
                    }}
                  >
                    Browse Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Content / Main Body (Tiptap Rich Text Editor) */}
            <Grid size={{ xs: 12 }}>
              <TiptapEditor
                label="Blog Main Content *"
                value={formik.values.content}
                onChange={(html) => {
                  formik.setFieldValue("content", html);
                  formik.setFieldTouched("content", true, false);
                }}
                onBlur={() => formik.setFieldTouched("content", true, true)}
                placeholder="Write detailed blog article content with rich formatting..."
                minHeight={300}
                error={
                  Boolean(formik.errors.content) &&
                  (formik.touched.content || Boolean(formik.values.content))
                }
                helperText={
                  (formik.touched.content || Boolean(formik.values.content))
                    ? (formik.errors.content as string)
                    : undefined
                }
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* DYNAMIC SECTIONS LIST */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  Blog Sections & Vidhi Steps
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "0.85rem",
                    color: "#64748b",
                  }}
                >
                  Add structured sections such as Required Samagri, Puja
                  Procedure, Katha, Prasad & Aarti, Guidelines etc.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddSection}
                sx={{
                  borderColor: COLORS.PRIMARY,
                  color: COLORS.PRIMARY,
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "none",
                  fontFamily: FONTS.OUTFIT,
                  "&:hover": { borderColor: COLORS.PRIMARY_DARK, bgcolor: "#FFF0E6" },
                }}
              >
                Add Section
              </Button>
            </Box>

            {!formik.values.sections || formik.values.sections.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  borderRadius: "14px",
                  bgcolor: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "0.9rem",
                  }}
                >
                  No custom sections added yet. Click &quot;Add Section&quot; to
                  add structured Puja Vidhi sections.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {formik.values.sections.map((sec, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: COLORS.PRIMARY,
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "0.9rem",
                        }}
                      >
                        Section {idx + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveSection(idx)}
                        sx={{
                          color: "#ef4444",
                          "&:hover": { bgcolor: "#fef2f2" },
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
                          label="Section Title *"
                          placeholder="e.g., Required Samagri / Puja Procedure"
                          value={sec.heading || sec.title || ""}
                          onChange={(e) =>
                            handleSectionChange(idx, "heading", e.target.value)
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              bgcolor: "white",
                              fontFamily: FONTS.OUTFIT,
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TiptapEditor
                          label="Section Description *"
                          value={sec.content || sec.description || ""}
                          onChange={(html) =>
                            handleSectionChange(idx, "content", html)
                          }
                          placeholder="Detailed instructions or list of items for this section..."
                          minHeight={160}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* SEO / Search Engine Optimization */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                SEO / Search Engine Optimization
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "0.85rem",
                  color: "#64748b",
                  mt: 0.5,
                }}
              >
                Add meta title and description to optimize this blog post for search engines and social sharing.
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Meta Title (SEO)"
                  name="metaTitle"
                  placeholder="e.g., Diwali Lakshmi Puja Vidhi: Samagri, Procedure and Auspicious Muhurat"
                  value={formik.values.metaTitle || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.metaTitle && formik.errors.metaTitle)}
                  helperText={formik.touched.metaTitle ? formik.errors.metaTitle : undefined}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: FONTS.OUTFIT,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Meta Description (SEO)"
                  name="metaDescription"
                  placeholder="e.g., Complete guide to performing Diwali Lakshmi Puja at home. Step-by-step vidhi, samagri list, muhurat, and rituals."
                  value={formik.values.metaDescription || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.metaDescription && formik.errors.metaDescription)}
                  helperText={formik.touched.metaDescription ? formik.errors.metaDescription : undefined}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: FONTS.OUTFIT,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
            <Button
              component={NextLink}
              href="/admin/blogs"
              sx={{
                color: "#64748b",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: FONTS.OUTFIT,
              }}
            >
              Cancel
            </Button>

            {!isEdit && (
              <Button
                type="button"
                variant="outlined"
                disabled={isSubmitting}
                onClick={async () => {
                  await formik.setFieldValue("status", "DRAFT");
                  formik.handleSubmit();
                }}
                sx={{
                  borderColor: "#cbd5e1",
                  color: "#475569",
                  textTransform: "none",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontFamily: FONTS.OUTFIT,
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    borderColor: "#94a3b8",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                Save as Draft
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                if (!isEdit) {
                  formik.setFieldValue("status", "PUBLISHED");
                }
              }}
              disabled={isSubmitting || (isEdit && !isFormModified())}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isEdit ? (
                  <SaveIcon />
                ) : (
                  <AddIcon />
                )
              }
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "white",
                textTransform: "none",
                borderRadius: "12px",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
                px: 4,
                py: 1.2,
                "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                "&.Mui-disabled": {
                  bgcolor: "#cbd5e1",
                  color: "#94a3b8",
                },
              }}
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Publishing..."
                : submitButtonText}
            </Button>
          </Box>
        </Paper>
      </Box>
    </FormikProvider>
  );
}

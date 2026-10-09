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
  sections: BlogSection[];
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  category: Yup.string().required("Category is required"),
  authorName: Yup.string().optional(),
  readTime: Yup.number()
    .typeError("Read time must be a number")
    .min(1, "Must be at least 1 min")
    .optional(),
  isFeatured: Yup.boolean().optional(),
  coverImage: Yup.string().optional(),
  status: Yup.string().optional(),
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
        <FormikValidationSnackbar />

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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
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
                label="Author Name"
                name="authorName"
                placeholder="e.g., Pt. Ramesh Sharma"
                value={formik.values.authorName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
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
                value={formik.values.readTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.readTime && Boolean(formik.errors.readTime)
                }
                helperText={formik.touched.readTime && formik.errors.readTime}
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
                onChange={(html) => formik.setFieldValue("content", html)}
                placeholder="Write detailed blog article content with rich formatting..."
                minHeight={300}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={formik.touched.content ? (formik.errors.content as string) : undefined}
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

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
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

"use client";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import NextLink from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";

import { PRODUCT_PRICING_UNIT } from "@/api/productControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import ProductBasicFields from "./widgets/ProductBasicFields";
import ProductDescriptionField from "./widgets/ProductDescriptionField";
import ProductImageUpload from "./widgets/ProductImageUpload";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Cannot be negative"),
  pricingUnit: Yup.string().required("Pricing unit is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(0, "Cannot be negative"),
});

export interface ProductFormValues {
  name: string;
  description: string;
  price: string | number;
  pricingUnit: string;
  quantity: string | number;
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  existingImageUrl?: string | null;
  onSubmit: (formData: FormData) => Promise<void>;
  title: string;
  submitButtonText: string;
  isEdit?: boolean;
}

export default function ProductForm({
  initialValues = {
    name: "",
    description: "",
    price: "",
    pricingUnit: PRODUCT_PRICING_UNIT.PIECE,
    quantity: "",
  },
  existingImageUrl = null,
  onSubmit,
  title,
  submitButtonText,
  isEdit = false,
}: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    existingImageUrl,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", String(values.price));
        formData.append("pricingUnit", values.pricingUnit);
        formData.append("quantity", String(values.quantity ?? 0));
        formData.append("isActive", "true");
        if (imageFile) {
          formData.append("image", imageFile);
        }
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <FormikProvider value={formik}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: 900,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
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
              sx={{ mb: 2 }}
            >
              <NextLink
                href="/admin/products"
                style={{
                  textDecoration: "none",
                  color: "#64748b",
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Products
              </NextLink>
              <Typography
                sx={{
                  color: "#FF6200",
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {isEdit ? "Edit Product" : "Add Product"}
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
              {title}
            </Typography>
          </Box>
          <Button
            component={NextLink}
            href="/admin/products"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: "#e2e8f0",
              color: "#64748b",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
            }}
          >
            Back
          </Button>
        </Box>

        {/* Main Form Paper */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
          }}
        >
          <Grid container spacing={3}>
            {/* Image Upload Widget */}
            <Grid size={{ xs: 12 }}>
              <ProductImageUpload
                imagePreview={imagePreview}
                imageFile={imageFile}
                onImageChange={handleImageChange}
              />
            </Grid>

            {/* Basic Detail Fields Widget (Name, Price, Pricing Unit) */}
            <ProductBasicFields />

            {/* Description Field Widget */}
            <ProductDescriptionField />
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              component={NextLink}
              href="/admin/products"
              sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
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
                bgcolor: "#FF6200",
                color: "white",
                textTransform: "none",
                borderRadius: "12px",
                fontWeight: 700,
                px: 4,
                py: 1.2,
                "&:hover": { bgcolor: "#E65800" },
              }}
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : submitButtonText}
            </Button>
          </Box>
        </Paper>
      </Box>
    </FormikProvider>
  );
}

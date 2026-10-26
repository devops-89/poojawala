"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

import { PRODUCT_PRICING_UNIT } from "@/api/productControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import ProductBasicFields from "./widgets/ProductBasicFields";
import ProductDescriptionField from "./widgets/ProductDescriptionField";
import ProductImageUpload from "./widgets/ProductImageUpload";

import { convertImageToWebP } from "@/utils/imageHelper";
import { useSnackbarStore } from "@/stores/snackbarStore";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(120, "Product name cannot exceed 120 characters")
    .matches(
      /^[a-zA-Z0-9\s&',.\-()%/]+$/,
      "Product name should contain valid words and letters (no disallowed symbols)"
    )
    .test("has-letters", "Product name must contain letters, not just numbers or symbols", (val) => {
      if (!val) return false;
      return /[a-zA-Z]/.test(val);
    }),
  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .test(
      "meaningful-text",
      "Description must contain meaningful text with letters, not just symbols",
      (val) => {
        if (!val) return false;
        const letters = (val.match(/[a-zA-Z]/g) || []).length;
        return val.trim().length >= 10 && letters >= 5;
      }
    ),
  price: Yup.number()
    .typeError("Price must be a valid number")
    .required("Price is required")
    .min(0, "Cannot be negative"),
  pricingUnit: Yup.string().required("Pricing unit is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a valid number")
    .required("Quantity is required")
    .min(0, "Cannot be negative"),
  categoryId: Yup.mixed()
    .test("not-empty", "Please select a product category", (val) => Boolean(val && String(val).trim() !== ""))
    .required("Please select a product category"),
});

export interface ProductFormValues {
  name: string;
  description: string;
  price: string | number;
  pricingUnit: string;
  quantity: string | number;
  categoryId?: string | number;
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
    pricingUnit: "",
    quantity: "",
    categoryId: "",
  },
  existingImageUrl = null,
  onSubmit,
  title,
  submitButtonText,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
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
      if (isEdit) {
        const isNameSame = (values.name || "").trim() === (initialValues.name || "").trim();
        const isDescSame = (values.description || "").trim() === (initialValues.description || "").trim();
        const isPriceSame = Number(values.price) === Number(initialValues.price);
        const isUnitSame = String(values.pricingUnit || "").trim() === String(initialValues.pricingUnit || "").trim();
        const isQtySame = Number(values.quantity ?? 0) === Number(initialValues.quantity ?? 0);
        const isCategorySame = String(values.categoryId ?? "") === String(initialValues.categoryId ?? "");
        const isImageSame = !imageFile;

        if (isNameSame && isDescSame && isPriceSame && isUnitSame && isQtySame && isCategorySame && isImageSame) {
          showSnackbar("No changes have been made to the product", "info");
          return;
        }
      }

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", String(values.price));
        formData.append("pricingUnit", values.pricingUnit);
        formData.append("quantity", String(values.quantity ?? 0));
        if (values.categoryId) {
          formData.append("categoryId", String(values.categoryId));
        }
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const webpFile = await convertImageToWebP(file);
      setImageFile(webpFile);
      setImagePreview(URL.createObjectURL(webpFile));
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
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Products
              </NextLink>
              <Typography
                sx={{
                  color: COLORS.PRIMARY,
                  fontFamily: FONTS.OUTFIT,
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
                bgcolor: COLORS.PRIMARY,
                color: "white",
                textTransform: "none",
                borderRadius: "12px",
                fontWeight: 700,
                px: 4,
                py: 1.2,
                "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
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

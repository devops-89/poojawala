"use client";

import {
  getProductByIdAPI,
  updateProductAPI,
} from "@/api/productControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { Box, CircularProgress } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductForm, { ProductFormValues } from "./ProductForm";

export default function EditProductForm() {
  const router = useRouter();
  const params = useParams();
  const { showSnackbar } = useSnackbarStore();
  const [initialValues, setInitialValues] = useState<ProductFormValues | null>(
    null,
  );
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!params.id) return;
      try {
        setIsLoading(true);
        const res = await getProductByIdAPI(params.id as string);
        const rawData = res?.data?.data || res?.data?.product || res?.data || res;
        const data = Array.isArray(rawData) ? rawData[0] : rawData;
        if (data) {
          setInitialValues({
            name: data.name || "",
            description: data.description || "",
            price: data.price !== undefined ? String(data.price) : "",
            pricingUnit: data.pricingUnit || "PIECE",
            quantity: data.quantity !== undefined && data.quantity !== null ? String(data.quantity) : "0",
          });
          const imgUrl =
            data.imageUrl ||
            data.imageDownloadUrl ||
            data.iconUrl ||
            data.iconDownloadurl;
          if (imgUrl) {
            setExistingImageUrl(imgUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
        showSnackbar("Failed to load product details", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [params.id, showSnackbar]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await updateProductAPI(params.id as string, formData);
      if (res?.success !== false) {
        showSnackbar("Product updated successfully", "success");
        router.push("/admin/products");
      } else {
        showSnackbar(res?.message || "Failed to update product", "error");
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      showSnackbar(
        error?.response?.data?.message || "Error updating product",
        "error",
      );
    }
  };

  if (isLoading || !initialValues) {
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
    <ProductForm
      isEdit={true}
      title={`Edit Product (P-${params.id})`}
      submitButtonText="Update Product"
      onSubmit={handleSubmit}
      initialValues={initialValues}
      existingImageUrl={existingImageUrl}
    />
  );
}

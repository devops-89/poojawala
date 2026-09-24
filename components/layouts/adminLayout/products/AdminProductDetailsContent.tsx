"use client";

import { getProductByIdAPI } from "@/api/productControllers";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import ProductHeaderCard from "@/components/layouts/adminLayout/products/components/ProductHeaderCard";
import ProductInfoCard from "@/components/layouts/adminLayout/products/components/ProductInfoCard";
import { useSnackbarStore } from "@/stores/snackbarStore";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminProductDetailsContent() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!params.id) return;
      try {
        setLoading(true);
        const res = await getProductByIdAPI(params.id as string);
        const data = res?.data?.data || res?.data || res;
        if (data) {
          setProduct(data);
        } else {
          showSnackbar("Failed to load product details", "error");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        showSnackbar("Error fetching product details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [params.id, showSnackbar]);

  if (loading) {
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

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="text.secondary">
          Product not found
        </Typography>
        <Button
          component={NextLink}
          href="/admin/products"
          sx={{ mt: 2, color: "#FF6200" }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <AdminDetailsHeader
        title="Product Details"
        backHref="/admin/products"
        breadcrumbs={[
          { label: "Products", href: "/admin/products" },
          { label: "Product Details" },
        ]}
        actionButton={
          <Button
            component={NextLink}
            href={`/admin/products/edit/${product.id}`}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              bgcolor: "#FF6200",
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              py: 1.2,
              px: 3,
              "&:hover": { bgcolor: "#E65800" },
            }}
          >
            Edit Product
          </Button>
        }
      />

      <ProductHeaderCard product={product} />

      <ProductInfoCard product={product} />
    </Box>
  );
}

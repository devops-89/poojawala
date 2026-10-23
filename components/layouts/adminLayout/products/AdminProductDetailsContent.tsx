"use client";
import { COLORS } from "@/utils/enums";

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
      const identifier = params.id as string;
      if (!identifier) return;

      if (
        product &&
        (product.slug === identifier || String(product.id) === String(identifier))
      ) {
        return;
      }

      try {
        setLoading(true);
        const res = await getProductByIdAPI(identifier);
        const data = res?.data?.data || res?.data || res;
        if (data) {
          setProduct(data);
          if (data.id && typeof window !== "undefined") {
            localStorage.setItem("last_product_id", String(data.id));
            sessionStorage.setItem("last_product_id", String(data.id));
            if (data.slug) {
              const s = String(data.slug).toLowerCase();
              localStorage.setItem(`slug_to_id_${s}`, String(data.id));
              sessionStorage.setItem(`slug_to_id_${s}`, String(data.id));
              localStorage.setItem(`product_slug_${s}`, String(data.id));
              sessionStorage.setItem(`product_slug_${s}`, String(data.id));
              if (/^\d+$/.test(String(identifier))) {
                window.history.replaceState(null, "", `/admin/products/${data.slug}`);
              }
            }
          }
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
  }, [params.id, showSnackbar, product]);

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
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
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
          sx={{ mt: 2, color: COLORS.PRIMARY }}
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
        breadcrumbs={[
          { label: "Products", href: "/admin/products" },
          { label: product.name || "Product Details" },
        ]}
        actionButton={
          <Button
            component={NextLink}
            href={`/admin/products/edit/${product.slug || product.id}`}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              py: 1.2,
              px: 3,
              "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
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

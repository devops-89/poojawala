"use client";

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DescriptionIcon from "@mui/icons-material/Description";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";

export interface ProductInfoCardProps {
  product: any;
}

export default function ProductInfoCard({ product }: ProductInfoCardProps) {
  const price = product.price ?? product.minPrice ?? 0;
  const pricingUnit = product.pricingUnit || "N/A";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        bgcolor: "white",
      }}
    >
      {/* Pricing & Inventory Info Rows */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 4,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2.5,
            bgcolor: "#f8fafc",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
          }}
        >
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#FFF0E6",
              borderRadius: "12px",
              color: "#FF6200",
              display: "flex",
            }}
          >
            <CurrencyRupeeIcon />
          </Box>
          <Box>
            <Typography
              sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.85rem" }}
            >
              Price
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#1e293b",
                fontSize: "1.25rem",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              ₹{price}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2.5,
            bgcolor: "#f8fafc",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
          }}
        >
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#FFF0E6",
              borderRadius: "12px",
              color: "#FF6200",
              display: "flex",
            }}
          >
            <ShoppingBagIcon />
          </Box>
          <Box>
            <Typography
              sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.85rem" }}
            >
              Pricing Unit
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#1e293b",
                fontSize: "1.1rem",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {pricingUnit}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2.5,
            bgcolor: "#f8fafc",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
          }}
        >
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#FFF0E6",
              borderRadius: "12px",
              color: "#FF6200",
              display: "flex",
            }}
          >
            <InventoryIcon />
          </Box>
          <Box>
            <Typography
              sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.85rem" }}
            >
              Quantity
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#1e293b",
                fontSize: "1.1rem",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {product.quantity ?? 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Description Section */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "#fff7ed",
              borderRadius: "8px",
              color: "#FF6200",
              display: "flex",
            }}
          >
            <DescriptionIcon fontSize="small" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            Description
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            color: "#475569",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
        >
          {product.description ||
            "No description available for this product."}
        </Typography>
      </Box>
    </Paper>
  );
}

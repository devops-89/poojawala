"use client";

import { Box, Chip, Paper, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M16 30 Q24 18 32 30' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' fill='%2394a3b8'/%3E%3C/svg%3E";

export interface ProductHeaderCardProps {
  product: any;
}

export default function ProductHeaderCard({
  product,
}: ProductHeaderCardProps) {
  const imgUrl =
    product.imageUrl ||
    product.iconUrl ||
    product.imageDownloadUrl ||
    product.iconDownloadurl ||
    PLACEHOLDER;
  const isActive = product.isActive !== false;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        background: "linear-gradient(135deg, #ffffff 0%, #fff7f2 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            border: "4px solid white",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
            flexShrink: 0,
          }}
        >
          <Image
            src={imgUrl}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`P-${product.id}`}
              sx={{
                bgcolor: "#FFF0E6",
                color: "#FF6200",
                fontWeight: 800,
                fontFamily: "var(--font-outfit), sans-serif",
                borderRadius: "8px",
              }}
            />
            <Chip
              label={isActive ? "Available" : "Unavailable"}
              sx={{
                bgcolor: isActive ? "#d1fae5" : "#fee2e2",
                color: isActive ? "#065f46" : "#991b1b",
                fontWeight: 700,
                fontFamily: "var(--font-outfit), sans-serif",
                borderRadius: "8px",
              }}
            />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 800,
              color: "#1e293b",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            {product.name}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

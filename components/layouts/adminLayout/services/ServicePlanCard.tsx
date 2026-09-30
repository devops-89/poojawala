"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Box, Chip, Divider, Typography } from "@mui/material";
import React from "react";

export interface ServicePlanCardProps {
  planType: "basic" | "standard";
  planBadgeLabel: string;
  planTitle: string;
  price: number | string;
  tokenAmount: number | string;
  purohitPayoutAmount: number | string;
  featureList: string[];
  carryItems: string[];
  formatFeatureName: (key: string) => string;
}

export default function ServicePlanCard({
  planType,
  planBadgeLabel,
  planTitle,
  price,
  tokenAmount,
  purohitPayoutAmount,
  featureList,
  carryItems,
  formatFeatureName,
}: ServicePlanCardProps) {
  const isBasic = planType === "basic";

  const themeConfig = isBasic
    ? {
        boxBg: "#fffbf7",
        boxBorder: "#fed7aa",
        badgeBg: "#FF6200",
        priceColor: "#FF6200",
        dividerBorder: "#ffedd5",
        featureIconColor: "#FF6200",
        featureChipBorder: "#fdba74",
        featureChipColor: "#9a3412",
        carryIconColor: "#c2410c",
        carryChipBg: "#ffedd5",
        carryChipColor: "#c2410c",
      }
    : {
        boxBg: "#f0fdf4",
        boxBorder: "#bbf7d0",
        badgeBg: "#16a34a",
        priceColor: "#16a34a",
        dividerBorder: "#dcfce7",
        featureIconColor: "#16a34a",
        featureChipBorder: "#86efac",
        featureChipColor: "#14532d",
        carryIconColor: "#15803d",
        carryChipBg: "#dcfce7",
        carryChipColor: "#15803d",
      };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "20px",
        bgcolor: themeConfig.boxBg,
        border: `1px solid ${themeConfig.boxBorder}`,
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 2,
          borderBottom: `1px solid ${themeConfig.dividerBorder}`,
        }}
      >
        <Box>
          <Chip
            label={planBadgeLabel}
            size="small"
            sx={{
              bgcolor: themeConfig.badgeBg,
              color: "white",
              fontWeight: 800,
              fontSize: "0.75rem",
              mb: 0.5,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#1e293b",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            {planTitle}
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: themeConfig.priceColor,
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          ₹{price}
        </Typography>
      </Box>

      {/* Token & Payout Info */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 2,
          bgcolor: "white",
          borderRadius: "12px",
          border: `1px solid ${themeConfig.boxBorder}`,
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}
          >
            Token Advance
          </Typography>
          <Typography
            sx={{ fontSize: "1rem", color: "#1e293b", fontWeight: 800 }}
          >
            ₹{tokenAmount}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}
          >
            Purohit Payout
          </Typography>
          <Typography
            sx={{ fontSize: "1rem", color: "#16a34a", fontWeight: 800 }}
          >
            ₹{purohitPayoutAmount}
          </Typography>
        </Box>
      </Box>

      {/* Features */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.95rem",
          color: "#1e293b",
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CheckCircleIcon
          sx={{ color: themeConfig.featureIconColor, fontSize: "1.1rem" }}
        />
        Included Features ({featureList.length})
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {featureList.map((feat: string, idx: number) => (
          <Chip
            key={`${planType}-feat-${idx}`}
            label={formatFeatureName(feat)}
            size="small"
            icon={
              <CheckCircleIcon
                style={{ color: themeConfig.featureIconColor, fontSize: 16 }}
              />
            }
            sx={{
              bgcolor: "white",
              border: `1px solid ${themeConfig.featureChipBorder}`,
              color: themeConfig.featureChipColor,
              fontWeight: 600,
              fontSize: "0.82rem",
              py: 0.5,
            }}
          />
        ))}
        {featureList.length === 0 && (
          <Typography
            sx={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}
          >
            No features specified
          </Typography>
        )}
      </Box>

      {/* Carry Items */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.95rem",
          color: "#1e293b",
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <InventoryIcon
          sx={{ color: themeConfig.carryIconColor, fontSize: "1.1rem" }}
        />
        Purohit Carry Items ({carryItems.length})
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {carryItems.map((item: string, idx: number) => (
          <Chip
            key={`${planType}-carry-${idx}`}
            label={item}
            size="small"
            sx={{
              bgcolor: themeConfig.carryChipBg,
              color: themeConfig.carryChipColor,
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          />
        ))}
        {carryItems.length === 0 && (
          <Typography
            sx={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}
          >
            No carry items specified
          </Typography>
        )}
      </Box>
    </Box>
  );
}

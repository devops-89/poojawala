"use client";

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";

export interface ServicePricingSummaryCardProps {
  service: any;
  basicPrice: number | string;
  standardPrice: number | string;
}

export default function ServicePricingSummaryCard({
  service,
  basicPrice,
  standardPrice,
}: ServicePricingSummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        bgcolor: "white",
        height: "100%",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 800,
          color: "#1e293b",
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          component="span"
          sx={{
            width: 8,
            height: 24,
            bgcolor: "#FF6200",
            borderRadius: 4,
            display: "inline-block",
          }}
        />
        Pricing Summary
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#f8fafc",
          borderRadius: "12px",
          mb: 2,
          border: "1px solid #f1f5f9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "#FFF0E6",
              borderRadius: "8px",
              color: "#FF6200",
              display: "flex",
            }}
          >
            <CurrencyRupeeIcon fontSize="small" />
          </Box>
          <Typography
            sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}
          >
            Basic Plan Price
          </Typography>
        </Box>
        <Typography
          sx={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}
        >
          ₹{basicPrice}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#f8fafc",
          borderRadius: "12px",
          mb: 2,
          border: "1px solid #f1f5f9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "#FFF0E6",
              borderRadius: "8px",
              color: "#FF6200",
              display: "flex",
            }}
          >
            <CurrencyRupeeIcon fontSize="small" />
          </Box>
          <Typography
            sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}
          >
            Standard Plan Price
          </Typography>
        </Box>
        <Typography
          sx={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}
        >
          ₹{standardPrice}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#f8fafc",
          borderRadius: "12px",
          mb: 2,
          border: "1px solid #f1f5f9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "#FFF0E6",
              borderRadius: "8px",
              color: "#FF6200",
              display: "flex",
            }}
          >
            <PercentIcon fontSize="small" />
          </Box>
          <Typography
            sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}
          >
            Token Percentage
          </Typography>
        </Box>
        <Typography
          sx={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}
        >
          {service.tokenPercentage ? `${service.tokenPercentage}%` : "N/A"}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #f1f5f9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "#FFF0E6",
              borderRadius: "8px",
              color: "#FF6200",
              display: "flex",
            }}
          >
            <PercentIcon fontSize="small" />
          </Box>
          <Typography
            sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}
          >
            Commission
          </Typography>
        </Box>
        <Typography
          sx={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}
        >
          {service.commissionPercentage}%
        </Typography>
      </Box>
    </Paper>
  );
}

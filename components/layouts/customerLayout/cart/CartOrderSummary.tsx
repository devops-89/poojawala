"use client";
import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

interface CartOrderSummaryProps {
  totalItemsCount: number;
  rawSubtotal: number;
  finalTotal: number;
}

export default function CartOrderSummary({
  totalItemsCount,
  rawSubtotal,
  finalTotal,
}: CartOrderSummaryProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 3.5 },
        bgcolor: "white",
        border: "1px solid #EADCCF",
        borderRadius: "20px",
        mt: { xs: 0, lg: "42px" },
      }}
    >
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 800,
          fontSize: "13px",
          letterSpacing: "1.2px",
          color: "#2C1810",
          textTransform: "uppercase",
          mb: 2.5,
        }}
      >
        ORDER SUMMARY
      </Typography>

      {/* Pricing Breakdown Rows */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "14px",
            }}
          >
            Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 700,
              color: "#2C1810",
              fontSize: "16px",
            }}
          >
            ₹{rawSubtotal.toLocaleString("en-IN")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "14px",
            }}
          >
            Delivery
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#2E7D32",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            FREE
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#EADCCF", my: 1 }} />

        {/* Total Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            pt: 0.5,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: "22px",
            }}
          >
            Total
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#FF6200",
              fontSize: "28px",
            }}
          >
            ₹{finalTotal.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

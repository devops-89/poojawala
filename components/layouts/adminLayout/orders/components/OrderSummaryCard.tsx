"use client";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Box, Card, Divider, Typography } from "@mui/material";
import React from "react";

export interface OrderSummaryCardProps {
  order: any;
}

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const subtotal = Number(order?.subtotal || order?.totalAmount || 0);
  const discount = Number(order?.discountAmount || 0);
  const total = Number(order?.totalAmount || 0);

  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        height: "100%",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
          pb: 2,
          borderBottom: "1px dashed #e2e8f0",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "#fff7ed",
            display: "flex",
          }}
        >
          <ReceiptLongIcon sx={{ fontSize: 24, color: "#FF6200" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Order Summary
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              color: "#64748b",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Subtotal
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#0f172a",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            ₹{subtotal.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              color: "#64748b",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Discount
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#10b981",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            -₹{discount.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Total Amount
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#FF6200",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            ₹{total.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

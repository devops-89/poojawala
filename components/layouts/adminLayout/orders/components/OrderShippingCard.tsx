"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Card, Typography } from "@mui/material";
import React from "react";

export interface OrderShippingCardProps {
  shippingAddr: any;
  customerName: string;
}

export default function OrderShippingCard({
  shippingAddr,
  customerName,
}: OrderShippingCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        height: "100%",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
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
            backgroundColor: "#eff6ff",
            display: "flex",
          }}
        >
          <LocationOnIcon sx={{ fontSize: 24, color: "#2563eb" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Shipping Address
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontSize: "1.05rem",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          {shippingAddr?.name || customerName}
        </Typography>

        <Typography
          sx={{
            color: "#475569",
            fontFamily: "var(--font-outfit), sans-serif",
            lineHeight: 1.6,
          }}
        >
          {[
            shippingAddr?.addressLine1,
            shippingAddr?.city,
            shippingAddr?.state,
            shippingAddr?.pincode,
          ]
            .filter(Boolean)
            .join(", ") || "Address details unavailable"}
        </Typography>

        {shippingAddr?.phone && (
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontFamily: "var(--font-outfit), sans-serif",
              mt: 1,
            }}
          >
            Contact Phone: <strong>{shippingAddr.phone}</strong>
          </Typography>
        )}
      </Box>
    </Card>
  );
}

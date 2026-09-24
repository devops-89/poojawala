"use client";

import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, Card, Typography } from "@mui/material";
import React from "react";

export interface BookingServiceCardProps {
  booking: any;
}

export default function BookingServiceCard({
  booking,
}: BookingServiceCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "#f3e8ff",
            display: "flex",
          }}
        >
          <DashboardIcon sx={{ fontSize: 24, color: "#9333ea" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Service Information
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography
            sx={{
              color: "#64748b",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "0.8rem",
              mb: 0.5,
            }}
          >
            Service Requested
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
            {booking.service?.name}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              color: "#64748b",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "0.8rem",
              mb: 0.5,
            }}
          >
            Price Range
          </Typography>
          <Typography sx={{ color: "#475569", fontWeight: 600 }}>
            ₹{booking.service?.minPrice || "0.00"} - ₹
            {booking.service?.maxPrice || "0.00"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

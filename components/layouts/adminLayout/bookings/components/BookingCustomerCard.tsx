"use client";

import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { Box, Card, Typography } from "@mui/material";
import React from "react";

export interface BookingCustomerCardProps {
  booking: any;
  customerName: string;
}

export default function BookingCustomerCard({
  booking,
  customerName,
}: BookingCustomerCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        height: "100%",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        },
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
            backgroundColor: "#f0fdf4",
            display: "flex",
          }}
        >
          <PersonIcon sx={{ fontSize: 24, color: "#059669" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Customer Profile
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "baseline",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              color: "#64748b",
              minWidth: "80px",
              fontSize: "0.95rem",
            }}
          >
            Name:
          </Typography>
          <Typography
            sx={{ fontWeight: 600, color: "#0f172a", fontSize: "1.05rem" }}
          >
            {customerName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "baseline",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              color: "#64748b",
              minWidth: "80px",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.95rem",
            }}
          >
            <PhoneIcon sx={{ fontSize: 16 }} /> Phone:
          </Typography>
          <Typography sx={{ fontWeight: 600, color: "#334155" }}>
            {booking.customer?.phone || "N/A"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "baseline",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              color: "#64748b",
              minWidth: "80px",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.95rem",
            }}
          >
            <EmailIcon sx={{ fontSize: 16 }} /> Email:
          </Typography>
          <Typography sx={{ fontWeight: 600, color: "#334155" }}>
            {booking.customer?.email || "N/A"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              color: "#64748b",
              minWidth: "80px",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: 0.2,
              fontSize: "0.95rem",
            }}
          >
            <LocationOnIcon sx={{ fontSize: 16 }} /> Address:
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              color: "#334155",
              flex: 1,
              lineHeight: 1.5,
            }}
          >
            {booking.customerAddress?.fullAddress ||
              booking.addressSnapshot?.city ||
              "Address unavailable"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

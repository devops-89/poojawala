"use client";

import EmailIcon from "@mui/icons-material/Email";
import HandymanIcon from "@mui/icons-material/Handyman";
import PhoneIcon from "@mui/icons-material/Phone";
import { Box, Card, Typography } from "@mui/material";
import React from "react";

export interface BookingPurohitCardProps {
  booking: any;
  technicianName: string;
}

export default function BookingPurohitCard({
  booking,
  technicianName,
}: BookingPurohitCardProps) {
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
            backgroundColor: "#eff6ff",
            display: "flex",
          }}
        >
          <HandymanIcon sx={{ fontSize: 24, color: "#2563eb" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Purohit Assigned
        </Typography>
      </Box>

      {booking.purohit ? (
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
              {technicianName}
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
              {booking.purohit.user?.phone || booking.purohit.phone || "N/A"}
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
              {booking.purohit.user?.email || booking.purohit.email || "N/A"}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "120px",
            backgroundColor: "#f8fafc",
            borderRadius: 3,
            border: "1px dashed #cbd5e1",
          }}
        >
          <Typography
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Purohit not yet assigned
          </Typography>
        </Box>
      )}
    </Card>
  );
}

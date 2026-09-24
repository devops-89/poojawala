"use client";

import { Box, Typography } from "@mui/material";
import React from "react";

export default function SignUpBrandingSide() {
  return (
    <Box
      sx={{
        flex: 0.9,
        background: "linear-gradient(135deg, #FF6200 0%, #FF9100 100%)",
        p: { xs: 2.5, md: 3.5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "white",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 800,
          mb: 1,
          fontSize: { xs: "1.5rem", md: "1.85rem" },
        }}
      >
        Join Us!
      </Typography>
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: "13px",
          lineHeight: 1.45,
          opacity: 0.95,
          mb: 2.5,
        }}
      >
        Create an account to manage your puja bookings, view upcoming
        appointments, and consult with our verified Pandits seamlessly.
      </Typography>
      <Box
        component="img"
        src="/images/home/poojaPackages/dhanush.webp"
        alt="Branding Illustration"
        sx={{
          width: { xs: "130px", md: "160px" },
          filter: "brightness(0) invert(1)",
          opacity: 0.85,
          alignSelf: "center",
        }}
      />
    </Box>
  );
}


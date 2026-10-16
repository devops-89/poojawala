"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { FONTS } from "@/utils/fonts";

export default function CustomerAstrologersHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontWeight: 800,
          color: "#1A1A1A",
          mb: 1,
        }}
      >
        Verified Vedic Astrologers
      </Typography>
      <Typography sx={{ fontFamily: FONTS.PRIMARY, color: "#666" }}>
        Connect with certified astrologers for Kundali matching, horoscope, vastu, and career guidance.
      </Typography>
    </Box>
  );
}

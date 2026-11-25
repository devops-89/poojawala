"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export default function CustomerAstrologersHeader() {
  return (
    <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          bgcolor: "#FFF0E6",
          border: "1px solid #FFD4BC",
          borderRadius: "20px",
          px: 1.5,
          py: 0.4,
          mb: 1.25,
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 13, color: COLORS.PRIMARY }} />
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: "11px",
            fontWeight: 800,
            color: COLORS.PRIMARY,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
        >
          DIVINE VEDIC GUIDANCE
        </Typography>
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#2C1810",
          fontSize: { xs: "1.65rem", sm: "2.1rem", md: "2.4rem" },
          lineHeight: 1.2,
          mb: 0.75,
        }}
      >
        Verified Vedic Astrologers
      </Typography>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          color: "#7C6A60",
          fontSize: { xs: "13.5px", sm: "15px" },
          lineHeight: 1.5,
          maxWidth: 620,
        }}
      >
        Connect with certified astrologers for Kundali matching, horoscope analysis, vastu consultations, and career guidance.
      </Typography>
    </Box>
  );
}

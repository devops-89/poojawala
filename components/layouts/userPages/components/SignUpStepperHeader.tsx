"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Typography } from "@mui/material";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export interface SignUpStepperHeaderProps {
  currentStep: 1 | 2;
  onStep1Click: () => void;
  onStep2Click: () => void;
}

export default function SignUpStepperHeader({
  currentStep,
  onStep1Click,
  onStep2Click,
}: SignUpStepperHeaderProps) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: FONTS.OUTFIT_ONLY,
          fontWeight: 700,
          color: "#1A1A1A",
          fontSize: { xs: "1.25rem", md: "1.45rem" },
          lineHeight: 1.2,
          mb: 0.5,
        }}
      >
        Create an Account
      </Typography>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT_ONLY,
          color: "#666",
          mb: 2,
          fontSize: "0.85rem",
        }}
      >
        Step {currentStep} of 2:{" "}
        {currentStep === 1
          ? "Personal & Account Details"
          : "Delivery Address Details"}
      </Typography>

      {/* Step Progress Indicators */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 0.75,
          bgcolor: "#FFFDF9",
          border: "1px solid #FFE0D0",
          borderRadius: "14px",
        }}
      >
        <Box
          onClick={onStep1Click}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            cursor: "pointer",
            py: 1,
            px: 1.5,
            borderRadius: "10px",
            bgcolor: currentStep === 1 ? COLORS.BRAND_ORANGE : "transparent",
            color: currentStep === 1 ? COLORS.WHITE : "#666",
            boxShadow:
              currentStep === 1
                ? `0 4px 12px ${COLORS.PRIMARY_SHADOW}`
                : "none",
            transition: "all 0.25s ease",
            "&:hover": {
              bgcolor: currentStep === 1 ? COLORS.PRIMARY_DARK : "#FFF0E6",
            },
          }}
        >
          <PersonIcon sx={{ fontSize: 19 }} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.85rem",
              fontFamily: FONTS.OUTFIT_ONLY,
            }}
          >
            1. Personal Details
          </Typography>
        </Box>

        <Box
          onClick={onStep2Click}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            cursor: "pointer",
            py: 1,
            px: 1.5,
            borderRadius: "10px",
            bgcolor: currentStep === 2 ? COLORS.BRAND_ORANGE : "transparent",
            color: currentStep === 2 ? COLORS.WHITE : "#666",
            boxShadow:
              currentStep === 2
                ? `0 4px 12px ${COLORS.PRIMARY_SHADOW}`
                : "none",
            transition: "all 0.25s ease",
            "&:hover": {
              bgcolor: currentStep === 2 ? COLORS.PRIMARY_DARK : "#FFF0E6",
            },
          }}
        >
          <LocationOnIcon sx={{ fontSize: 19 }} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.85rem",
              fontFamily: FONTS.OUTFIT_ONLY,
            }}
          >
            2. Address Details
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

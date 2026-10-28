"use client";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Box, Typography } from "@mui/material";
import React from "react";
import { FONTS } from "@/utils/fonts";

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
    <Box
      sx={{
        mb: 1.5,
        "@media (max-height: 660px)": {
          mb: 0.85,
        },
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#1F1A17",
          fontSize: { xs: "20px", sm: "22px", md: "23px" },
          lineHeight: 1.2,
          letterSpacing: "-0.4px",
          mb: 0.25,
        }}
      >
        Create an Account
      </Typography>

      {/* Step Subtitle */}
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          color: "#6B7280",
          fontSize: { xs: "12px", md: "12.5px" },
          fontWeight: 500,
          mb: 1.25,
        }}
      >
        Step {currentStep} of 2:{" "}
        {currentStep === 1
          ? "Personal & Account Details"
          : "Delivery Address Details"}
      </Typography>

      {/* Segmented Pill Stepper */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 0.85 },
          p: "3px",
          bgcolor: "rgba(255, 246, 237, 0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.75)",
          borderRadius: "12px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Step 1 Button */}
        <Box
          onClick={onStep1Click}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.5, sm: 0.75 },
            cursor: "pointer",
            py: { xs: 0.65, sm: 0.55 },
            px: { xs: 0.5, sm: 1.2 },
            borderRadius: "9px",
            background:
              currentStep === 1
                ? "linear-gradient(135deg, #FF6200 0%, #FF7A1A 100%)"
                : "transparent",
            color: currentStep === 1 ? "#ffffff" : "#6B7280",
            boxShadow:
              currentStep === 1
                ? "0 3px 10px rgba(255, 98, 0, 0.28)"
                : "none",
            transition: "all 0.25s ease",
            "&:hover": {
              color: currentStep === 1 ? "#ffffff" : "#1F1A17",
              bgcolor: currentStep === 1 ? undefined : "rgba(255, 235, 220, 0.4)",
            },
          }}
        >
          <PersonOutlineOutlinedIcon sx={{ fontSize: { xs: 15, sm: 16 } }} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "11.5px", sm: "12.5px" },
              whiteSpace: "nowrap",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              1. Personal Details
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
              1. Personal
            </Box>
          </Typography>
        </Box>

        {/* Step 2 Button */}
        <Box
          onClick={onStep2Click}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.5, sm: 0.75 },
            cursor: "pointer",
            py: { xs: 0.65, sm: 0.55 },
            px: { xs: 0.5, sm: 1.2 },
            borderRadius: "9px",
            background:
              currentStep === 2
                ? "linear-gradient(135deg, #FF6200 0%, #FF7A1A 100%)"
                : "transparent",
            color: currentStep === 2 ? "#ffffff" : "#6B7280",
            boxShadow:
              currentStep === 2
                ? "0 3px 10px rgba(255, 98, 0, 0.28)"
                : "none",
            transition: "all 0.25s ease",
            "&:hover": {
              color: currentStep === 2 ? "#ffffff" : "#1F1A17",
              bgcolor: currentStep === 2 ? undefined : "rgba(255, 235, 220, 0.4)",
            },
          }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "11.5px", sm: "13px" },
              whiteSpace: "nowrap",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              2. Address Details
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
              2. Address
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}


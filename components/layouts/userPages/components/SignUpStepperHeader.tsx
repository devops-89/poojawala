"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Typography } from "@mui/material";
import React from "react";

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
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 800,
          color: "#1A1A1A",
          fontSize: "1.25rem",
          lineHeight: 1.2,
          mb: 0.25,
        }}
      >
        Create an Account
      </Typography>
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          color: "#666",
          mb: 1.5,
          fontSize: "0.825rem",
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
          bgcolor: "#FFF0E6",
          borderRadius: "10px",
          mb: 1.5,
        }}
      >
        <Box
          onClick={onStep1Click}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            cursor: "pointer",
            py: 0.75,
            px: 1,
            borderRadius: "8px",
            bgcolor: currentStep === 1 ? "#FF6200" : "transparent",
            color: currentStep === 1 ? "#fff" : "#FF6200",
            transition: "all 0.2s",
          }}
        >
          <PersonIcon sx={{ fontSize: 18 }} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.825rem",
              fontFamily: '"DM Sans", sans-serif',
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
            gap: 0.75,
            cursor: "pointer",
            py: 0.75,
            px: 1,
            borderRadius: "8px",
            bgcolor: currentStep === 2 ? "#FF6200" : "transparent",
            color: currentStep === 2 ? "#fff" : "#FF6200",
            transition: "all 0.2s",
          }}
        >
          <LocationOnIcon sx={{ fontSize: 18 }} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.825rem",
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            2. Address Details
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}


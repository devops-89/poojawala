"use client";

import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

interface AdminOnboardSectionHeaderProps {
  number: number | string;
  title: string;
  subtitle?: string;
}

export default function AdminOnboardSectionHeader({
  number,
  title,
  subtitle,
}: AdminOnboardSectionHeaderProps) {
  // Strip any leading "1. ", "2. ", etc., so the number is never displayed twice
  const cleanTitle = title.replace(/^\d+\.?\s*/, "");

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.8, mb: 3 }}>
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: "#fff7ed",
          color: COLORS.PRIMARY,
          fontWeight: 800,
          fontFamily: FONTS.OUTFIT,
          fontSize: "16px",
          border: "1.5px solid #fed7aa",
        }}
      >
        {number}
      </Avatar>
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1e293b",
            fontSize: "18px",
            lineHeight: 1.3,
          }}
        >
          {cleanTitle}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontFamily: FONTS.OUTFIT,
              fontSize: "13px",
              mt: 0.25,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}


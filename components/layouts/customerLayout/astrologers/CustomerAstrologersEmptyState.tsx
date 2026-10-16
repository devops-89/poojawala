"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface CustomerAstrologersEmptyStateProps {
  onReset: () => void;
}

export default function CustomerAstrologersEmptyState({
  onReset,
}: CustomerAstrologersEmptyStateProps) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center",
        bgcolor: "#ffffff",
        borderRadius: "20px",
        border: "1px dashed #cbd5e1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "#fff7ed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.PRIMARY,
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 32 }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        No Astrologers Found
      </Typography>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          color: "#64748b",
          maxWidth: 400,
          fontSize: "0.9rem",
        }}
      >
        We couldn&apos;t find any verified astrologers matching your search criteria. Try adjusting your filters.
      </Typography>
      <Button
        variant="outlined"
        onClick={onReset}
        sx={{
          mt: 1,
          fontFamily: FONTS.OUTFIT,
          fontWeight: 600,
          borderRadius: "10px",
          color: COLORS.PRIMARY,
          borderColor: COLORS.PRIMARY,
          textTransform: "none",
          "&:hover": {
            borderColor: COLORS.PRIMARY_DARK,
            bgcolor: "#fff7ed",
          },
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );
}

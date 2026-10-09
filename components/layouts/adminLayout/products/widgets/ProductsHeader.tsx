"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import React from "react";

export default function ProductsHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          Products
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748b",
            mt: 0.5,
          }}
        >
          View and manage sacred products
        </Typography>
      </Box>
      <Button
        component={NextLink}
        href="/admin/products/add"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          bgcolor: COLORS.PRIMARY,
          color: "white",
          textTransform: "none",
          borderRadius: "12px",
          fontWeight: 600,
          py: 1.2,
          px: 2.5,
          boxShadow: "none",
          "&:hover": { bgcolor: COLORS.PRIMARY_DARK, boxShadow: "none" },
          alignSelf: { xs: "flex-start", sm: "auto" },
        }}
      >
        Add Product
      </Button>
    </Box>
  );
}

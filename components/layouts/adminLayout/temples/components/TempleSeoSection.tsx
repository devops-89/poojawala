"use client";
import React from "react";
import { FONTS } from "@/utils/fonts";
import LanguageIcon from "@mui/icons-material/Language";
import { Box, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import { inputSx, labelSx } from "@/utils/templeFormUtils";

interface TempleSeoSectionProps {
  formik: any;
}

export default function TempleSeoSection({ formik }: TempleSeoSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "18px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {/* Section Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: "10px",
            bgcolor: "#F1F5F9",
            color: "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 0.3,
          }}
        >
          <LanguageIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "1.15rem",
              color: "#1E293B",
            }}
          >
            5. SEO / Search Engine Optimization
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: "0.85rem",
              mt: 0.25,
            }}
          >
            Add meta title and description to optimize this temple page for search engines and social sharing.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 0.5 }} />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <Typography sx={labelSx}>META TITLE (SEO)</Typography>
          <TextField
            fullWidth
            name="metaTitle"
            placeholder="e.g., Shri Kashi Vishwanath Temple – Darshan, Aarti and Timings"
            value={formik.values.metaTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={inputSx}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography sx={labelSx}>META DESCRIPTION (SEO)</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="metaDescription"
            placeholder="e.g., Explore Shri Kashi Vishwanath Temple in Varanasi, including temple details, darshan information and daily aarti timings."
            value={formik.values.metaDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={inputSx}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

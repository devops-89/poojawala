"use client";

import { FONTS } from "@/utils/fonts";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import GiteOutlinedIcon from "@mui/icons-material/GiteOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box, Grid, Paper, Typography } from "@mui/material";

export default function CustomerProductsFeatures() {
  const features = [
    {
      icon: <StarBorderIcon sx={{ fontSize: 24 }} />,
      titleLine1: "100% Pure",
      titleLine2: "Ingredients",
      description:
        "Every product tested for purity. No synthetic additives, pure sacred devotion.",
    },
    {
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 24 }} />,
      titleLine1: "3-5 Days",
      titleLine2: "Doorstep Delivery",
      description:
        "Safe, timely dispatch to your doorstep across India with secure packaging.",
    },
    {
      icon: <AutorenewOutlinedIcon sx={{ fontSize: 24 }} />,
      titleLine1: "Easy 7-Day",
      titleLine2: "Hassle-Free Returns",
      description:
        "Damaged or unsatisfied? We replace or refund without questions asked.",
    },
    {
      icon: <GiteOutlinedIcon sx={{ fontSize: 24 }} />,
      titleLine1: "Temple-Grade",
      titleLine2: "Artisan Sourcing",
      description:
        "Handcrafted in sacred heritage towns: Varanasi, Mathura, Ayodhya & Udupi.",
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#23150D",
        color: "white",
        borderRadius: { xs: "20px", sm: "24px" },
        border: "1px solid rgba(255, 255, 255, 0.08)",
        p: { xs: 3, sm: 4, md: 5 },
        mt: { xs: 4, md: 6 },
        overflow: "hidden",
      }}
    >
      <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }}>
        {features.map((feature, idx) => (
          <Grid size={{ xs: 6, md: 3 }} key={idx}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Circular Soft Icon Badge */}
              <Box
                sx={{
                  width: { xs: 42, sm: 48 },
                  height: { xs: 42, sm: 48 },
                  borderRadius: "14px",
                  bgcolor: "rgba(255, 98, 0, 0.15)",
                  border: "1px solid rgba(255, 98, 0, 0.25)",
                  color: "#FF7A30",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: { xs: 1.5, sm: 2 },
                  flexShrink: 0,
                }}
              >
                {feature.icon}
              </Box>

              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  fontSize: { xs: "15px", sm: "17px" },
                  lineHeight: 1.25,
                  color: "#FFFFFF",
                  mb: 0.75,
                }}
              >
                {feature.titleLine1}
                <br />
                {feature.titleLine2}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: "#C5B7AE",
                  fontSize: { xs: "12px", sm: "13px" },
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

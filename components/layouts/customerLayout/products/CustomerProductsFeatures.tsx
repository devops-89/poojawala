"use client";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import GiteOutlinedIcon from "@mui/icons-material/GiteOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box, Grid, Paper, Typography } from "@mui/material";

export default function CustomerProductsFeatures() {
  const features = [
    {
      icon: <StarBorderIcon sx={{ fontSize: 26 }} />,
      titleLine1: "100% Pure",
      titleLine2: "Ingredients",
      description:
        "Every product lab-tested. No synthetic additives, no shortcuts.",
    },
    {
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 26 }} />,
      titleLine1: "3-5 Days",
      titleLine2: "Delivery",
      description:
        "Fast and reliable doorstep delivery within 3 to 5 business days.",
    },
    {
      icon: <AutorenewOutlinedIcon sx={{ fontSize: 26 }} />,
      titleLine1: "Easy 7-Day",
      titleLine2: "Returns",
      description:
        "Wrong item or damaged in transit — we make it right, no questions.",
    },
    {
      icon: <GiteOutlinedIcon sx={{ fontSize: 26 }} />,
      titleLine1: "Temple-Grade",
      titleLine2: "Sourcing",
      description:
        "Partnered with hereditary artisans from Varanasi, Mathura, and Udupi.",
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#23150D",
        color: "white",
        borderRadius: "24px",
        p: { xs: 4, sm: 5, md: 6 },
        mt: 6,
        overflow: "hidden",
      }}
    >
      <Grid container spacing={{ xs: 4, sm: 3, md: 4 }}>
        {features.map((feature, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Circular Soft Icon Badge */}
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  bgcolor: "rgba(217, 83, 30, 0.18)",
                  color: "#D9531E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5,
                  flexShrink: 0,
                }}
              >
                {feature.icon}
              </Box>

              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontWeight: 800,
                  fontSize: "19px",
                  lineHeight: 1.25,
                  color: "#FFFFFF",
                  mb: 1.2,
                }}
              >
                {feature.titleLine1}
                <br />
                {feature.titleLine2}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#C5B7AE",
                  fontSize: "13.5px",
                  lineHeight: 1.6,
                  maxWidth: 240,
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

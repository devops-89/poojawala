"use client";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export default function WebsiteWhyPoojawalaSection() {
  const features = [
    {
      icon: <ShieldOutlinedIcon sx={{ fontSize: 24, color: COLORS.PRIMARY }} />,
      title: "Verified Pandits",
      description: "Background-checked & scripture-tested",
    },
    {
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 24, color: COLORS.PRIMARY }} />,
      title: "Scriptural Accuracy",
      description: "Every mantra and ritual as prescribed",
    },
    {
      icon: <CreditCardOutlinedIcon sx={{ fontSize: 24, color: COLORS.PRIMARY }} />,
      title: "Transparent Pricing",
      description: "Fixed plans, no hidden charges",
    },
    {
      icon: <HeadsetMicOutlinedIcon sx={{ fontSize: 24, color: COLORS.PRIMARY }} />,
      title: "End-to-End Support",
      description: "We coordinate everything for you",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#1E0C06",
        borderRadius: "28px",
        p: { xs: 4, sm: 5, md: 6 },
        my: { xs: 6, md: 8 },
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(30, 12, 6, 0.25)",
      }}
    >
      {/* Ambient Decorative Background Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,98,0,0.15) 0%, rgba(255,98,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center", position: "relative", zIndex: 1 }}>
        {/* Left Side Content */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.2px",
              color: COLORS.PRIMARY,
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            WHY POOJAWALA
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: { xs: "28px", sm: "34px", md: "40px" },
              color: "#FFFFFF",
              lineHeight: 1.25,
              mb: 2.5,
            }}
          >
            Devout Families Trust Our Pandits
          </Typography>

          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontSize: { xs: "14.5px", sm: "16px" },
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.75,
            }}
          >
            Every Pandit on our platform is individually verified for Vedic scholarship, ritual proficiency, and reliability. We match you with the right purohit — not just the nearest available one.
          </Typography>
        </Grid>

        {/* Right Side Feature Points (2x2 Grid) */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={3}>
            {features.map((feat, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    p: 3,
                    height: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.07)",
                      borderColor: "rgba(255, 98, 0, 0.4)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  {/* Icon Box */}
                  <Box
                    sx={{
                      bgcolor: "rgba(255, 98, 0, 0.14)",
                      borderRadius: "12px",
                      p: 1.2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {feat.icon}
                  </Box>

                  {/* Text */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#FFFFFF",
                        mb: 0.5,
                      }}
                    >
                      {feat.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontSize: "13.5px",
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 1.5,
                      }}
                    >
                      {feat.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

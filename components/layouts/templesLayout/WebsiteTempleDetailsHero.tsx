"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import NextLink from "next/link";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface WebsiteTempleDetailsHeroProps {
  temple: any;
  heroImage: string;
  onBookClick: () => void;
}

export default function WebsiteTempleDetailsHero({
  temple,
  heroImage,
  onBookClick,
}: WebsiteTempleDetailsHeroProps) {
  const rawTitle = temple?.name || "Sacred Temple";
  const titleWords = rawTitle.trim().split(/\s+/);

  let firstPart = rawTitle;
  let secondPart = "";

  if (titleWords.length >= 3) {
    const splitIndex = titleWords.length - 2;
    firstPart = titleWords.slice(0, splitIndex).join(" ");
    secondPart = titleWords.slice(splitIndex).join(" ");
  } else if (titleWords.length === 2) {
    firstPart = titleWords[0];
    secondPart = titleWords[1];
  }

  const fullLocation = [temple?.address, temple?.city, temple?.state]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(", ");

  return (
    <Box
      sx={{
        py: { xs: 3, md: 5.5 },
        mb: { xs: 2, md: 4 },
        position: "relative",
      }}
    >
      {/* Background Decorative Ambient Glows */}
      <Box
        sx={{
          position: "absolute",
          top: -80,
          left: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 145, 0, 0.12) 0%, rgba(255, 98, 0, 0) 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 98, 0, 0.1) 0%, rgba(255, 180, 0, 0) 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        separator="›"
        sx={{
          mb: { xs: 3, md: 4.5 },
          fontSize: "14px",
          fontFamily: FONTS.OUTFIT,
          color: "#94a3b8",
          position: "relative",
          zIndex: 1,
        }}
      >
        <NextLink
          href="/"
          style={{ textDecoration: "none", color: "#64748b", fontWeight: 500 }}
        >
          Home
        </NextLink>
        <NextLink
          href="/temples"
          style={{ textDecoration: "none", color: "#64748b", fontWeight: 500 }}
        >
          Temples
        </NextLink>
        <Typography
          sx={{
            color: COLORS.PRIMARY,
            fontWeight: 600,
            fontSize: "14px",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          {temple?.name || "Temple Details"}
        </Typography>
      </Breadcrumbs>

      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        sx={{ alignItems: "flex-start", position: "relative", zIndex: 1 }}
      >
        {/* Left Side Content */}
        <Grid size={{ xs: 12, md: 6.5, lg: 7 }}>
          {/* Top Sacred Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2.2,
              py: 0.75,
              borderRadius: "30px",
              background: "linear-gradient(135deg, #FFF0E6 0%, #FFE4D6 100%)",
              border: "1px solid #FFD0B8",
              mb: { xs: 2.5, md: 3.5 },
              boxShadow: "0 2px 8px rgba(255, 98, 0, 0.08)",
            }}
          >
            <TempleHinduIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12.5px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                color: "#D94E00",
                textTransform: "uppercase",
              }}
            >
              Sacred Temple & Dham
            </Typography>
          </Box>

          {/* Title with Two-Tone Serif Typography */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: { xs: "34px", sm: "44px", md: "52px" },
              lineHeight: 1.22,
              mt: 0,
              mb: { xs: 2.5, md: 3 },
              letterSpacing: "-0.02em",
            }}
          >
            <Box component="span" sx={{ color: "#2C1810" }}>
              {firstPart}{" "}
            </Box>
            {secondPart && (
              <Box component="span" sx={{ color: "#D32F2F" }}>
                {secondPart}
              </Box>
            )}
          </Typography>

          {/* Normal Location Text */}
          {fullLocation && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                mb: { xs: 4, md: 5 },
              }}
            >
              <LocationOnIcon sx={{ color: COLORS.PRIMARY, fontSize: 22, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: "15px", md: "16.5px" },
                  fontWeight: 500,
                  color: "#475569",
                  lineHeight: 1.5,
                }}
              >
                {fullLocation}
              </Typography>
            </Box>
          )}

          {/* Action CTAs */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={onBookClick}
              sx={{
                background: COLORS.PRIMARY,
                color: "#FFFFFF",
                borderRadius: "30px",
                px: 4.5,
                py: 1.6,
                fontSize: "15.5px",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
                textTransform: "none",
                boxShadow: "0 8px 24px rgba(255, 98, 0, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "#E05500",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 28px rgba(255, 98, 0, 0.4)",
                },
              }}
            >
              Book Temple Pooja
            </Button>
          </Box>
        </Grid>

        {/* Right Side Temple Banner Image */}
        <Grid size={{ xs: 12, md: 5.5, lg: 5 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "280px", sm: "360px", md: "440px" },
              borderRadius: "24px",
              overflow: "hidden",
              border: "3px solid #FFFFFF",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
              bgcolor: "#FAF4EE",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt={temple?.name || "Temple Banner"}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

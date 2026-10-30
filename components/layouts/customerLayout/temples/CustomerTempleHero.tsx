"use client";

import React from "react";
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

const DEFAULT_BANNER = "/images/home/poojaPackages/satyanarayan.webp";

interface CustomerTempleHeroProps {
  temple: any;
  heroImage: string;
  onBookClick: () => void;
}

const formatTime = (timeStr?: string | null) => {
  if (!timeStr) return "";
  const parts = String(timeStr).split(":");
  if (parts.length >= 2) {
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    if (isNaN(h)) return timeStr;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h < 10 ? "0" + h : h}:${m} ${ampm}`;
  }
  return timeStr;
};

export default function CustomerTempleHero({
  temple,
  heroImage,
  onBookClick,
}: CustomerTempleHeroProps) {
  const router = useRouter();

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

  const hasTimings = Boolean(temple?.openingTime || temple?.closingTime);
  const timingText = hasTimings
    ? [formatTime(temple?.openingTime), formatTime(temple?.closingTime)]
        .filter(Boolean)
        .join(" - ")
    : "";

  return (
    <>
      {/* Top Bar: Back Button & Breadcrumbs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Breadcrumbs
          separator="›"
          sx={{
            fontSize: "14px",
            fontFamily: FONTS.OUTFIT,
            color: "#94a3b8",
          }}
        >
          <NextLink
            href="/customer/dashboard"
            style={{ textDecoration: "none", color: "#64748b", fontWeight: 500 }}
          >
            Dashboard
          </NextLink>
          <NextLink
            href="/customer/temples"
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

        <Button
          onClick={() => router.push("/customer/temples")}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "#64748b",
            fontFamily: FONTS.PRIMARY,
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            "&:hover": { color: COLORS.PRIMARY, bgcolor: "rgba(255, 98, 0, 0.05)" },
          }}
        >
          Back to Temples
        </Button>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 2, md: 3 },
          mb: { xs: 3, md: 4 },
          position: "relative",
        }}
      >
        {/* Background Ambient Glows */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 145, 0, 0.1) 0%, rgba(255, 98, 0, 0) 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{ alignItems: "center", position: "relative", zIndex: 1 }}
        >
          {/* Left Side Content */}
          <Grid size={{ xs: 12, md: 6.5, lg: 7 }}>
            {/* Top Sacred Badges */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
                mb: { xs: 2, md: 2.5 },
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.65,
                  borderRadius: "30px",
                  background: "linear-gradient(135deg, #FFF0E6 0%, #FFE4D6 100%)",
                  border: "1px solid #FFD0B8",
                  boxShadow: "0 2px 8px rgba(255, 98, 0, 0.08)",
                }}
              >
                <TempleHinduIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    color: "#D94E00",
                    textTransform: "uppercase",
                  }}
                >
                  Sacred Temple & Dham
                </Typography>
              </Box>

              {temple?.primaryDeity && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: 2,
                    py: 0.65,
                    borderRadius: "30px",
                    bgcolor: "#FEF3C7",
                    border: "1px solid #FDE68A",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#92400E",
                    }}
                  >
                    🕉️ Deity: {temple.primaryDeity}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Title with Two-Tone Serif Typography */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                fontSize: { xs: "30px", sm: "38px", md: "46px" },
                lineHeight: 1.2,
                mt: 0,
                mb: { xs: 2, md: 2.5 },
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

            {/* Full Location */}
            {fullLocation && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.2,
                  mb: { xs: 3.5, md: 4.5 },
                }}
              >
                <LocationOnIcon
                  sx={{ color: COLORS.PRIMARY, fontSize: 22, flexShrink: 0, mt: 0.2 }}
                />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: "14px", md: "15.5px" },
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
                  px: 4.2,
                  py: 1.5,
                  fontSize: "15px",
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  textTransform: "none",
                  boxShadow: "0 8px 24px rgba(255, 98, 0, 0.28)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#E05500",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 28px rgba(255, 98, 0, 0.38)",
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
                height: { xs: "260px", sm: "340px", md: "400px" },
                borderRadius: "24px",
                overflow: "hidden",
                border: "3px solid #FFFFFF",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.1)",
                bgcolor: "#FAF4EE",
              }}
            >
              <Box
                component="img"
                src={heroImage}
                alt={temple?.name || "Temple Banner"}
                onError={(e: any) => {
                  e.target.src = DEFAULT_BANNER;
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {temple?.primaryDeity && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    px: 2,
                    py: 0.8,
                    borderRadius: "12px",
                    bgcolor: "rgba(0, 0, 0, 0.65)",
                    backdropFilter: "blur(8px)",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    Sacred Shrine of {temple.primaryDeity}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

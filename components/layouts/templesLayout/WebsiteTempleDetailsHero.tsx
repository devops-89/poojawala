"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import NextLink from "next/link";
import React from "react";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { normalizePoojaText } from "@/utils/helpers";

interface WebsiteTempleDetailsHeroProps {
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

export default function WebsiteTempleDetailsHero({
  temple,
  heroImage,
  onBookClick,
}: WebsiteTempleDetailsHeroProps) {
  const rawTitle = normalizePoojaText(temple?.name || "Sacred Temple");
  const titleWords = rawTitle.trim().split(/\s+/);

  let firstPart = rawTitle;
  let secondPart = "";

  if (titleWords.length >= 2) {
    const splitIndex = titleWords.length - 1;
    firstPart = titleWords.slice(0, splitIndex).join(" ");
    secondPart = titleWords.slice(splitIndex).join(" ");
  }

  const fullLocation = (() => {
    const address = (temple?.address || "").trim();
    const city = (temple?.city || "").trim();
    const state = (temple?.state || "").trim();

    if (!address) {
      return [city, state].filter(Boolean).join(", ");
    }
    const lowerAddr = address.toLowerCase();
    const parts = [address];
    if (city && !lowerAddr.includes(city.toLowerCase())) {
      parts.push(city);
    }
    if (state && !lowerAddr.includes(state.toLowerCase())) {
      parts.push(state);
    }
    return parts.filter(Boolean).join(", ");
  })();

  const hasTimings = Boolean(temple?.openingTime || temple?.closingTime);
  const timingText = hasTimings
    ? [formatTime(temple?.openingTime), formatTime(temple?.closingTime)]
        .filter(Boolean)
        .join(" - ")
    : "";

  const ActionAndTrust = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 2.5 },
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Button
          variant="contained"
          onClick={onBookClick}
          startIcon={<CalendarMonthIcon />}
          sx={{
            background: "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
            color: "#FFFFFF",
            width: { xs: "100%", sm: "auto" },
            px: { xs: 4, sm: 5 },
            py: 1.6,
            borderRadius: "12px",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: { xs: "15px", sm: "16px" },
            textTransform: "none",
            boxShadow: "0 8px 25px rgba(255, 98, 0, 0.35)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)",
              boxShadow: "0 10px 30px rgba(255, 98, 0, 0.45)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Book Temple Pooja
        </Button>
      </Box>

      {/* Trust Micro Badges */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: { xs: 1.5, sm: 3 },
          pt: 0.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <ShieldCheckIcon sx={{ color: COLORS.GREEN_SUCCESS, fontSize: 18 }} />
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "12px", sm: "13px" },
              fontWeight: 600,
              color: "#64748B",
            }}
          >
            Verified Temple Priests
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <ShieldCheckIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "12px", sm: "13px" },
              fontWeight: 600,
              color: "#64748B",
            }}
          >
            100% Consecrated Prasad & Sankalp
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        py: { xs: 2.5, md: 5 },
        mb: { xs: 2, md: 4 },
        position: "relative",
      }}
    >
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        separator="›"
        sx={{
          mb: { xs: 2, md: 3 },
          fontSize: "13px",
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
            fontSize: "13px",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          {normalizePoojaText(temple?.name || "Temple Details")}
        </Typography>
      </Breadcrumbs>

      <Grid
        container
        spacing={{ xs: 3, md: 6 }}
        sx={{ alignItems: "flex-start", position: "relative", zIndex: 1 }}
      >
        {/* Left Side Content */}
        <Grid size={{ xs: 12, md: 6.5, lg: 7 }}>
          {/* Top Sacred Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.8,
              py: 0.55,
              borderRadius: "30px",
              background: "linear-gradient(135deg, #FFF0E6 0%, #FFE4D6 100%)",
              border: "1px solid #FFD0B8",
              mb: { xs: 1.8, md: 2.2 },
              boxShadow: "0 2px 8px rgba(255, 98, 0, 0.08)",
            }}
          >
            <TempleHinduIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "11.5px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                color: "#D94E00",
                textTransform: "uppercase",
              }}
            >
              Sacred Temple & Dham
            </Typography>
          </Box>

          {/* Title with Two-Tone Typography */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: { xs: "28px", sm: "36px", md: "46px" },
              lineHeight: 1.18,
              mt: 0,
              mb: { xs: 2, md: 2.5 },
              letterSpacing: "-0.02em",
            }}
          >
            <Box component="span" sx={{ color: "#1A0B05", display: { xs: "inline", md: "block" } }}>
              {firstPart}
            </Box>
            {secondPart && (
              <>
                <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>
                  {" "}
                </Box>
                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(90deg, #FF5500 0%, #E63E00 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: { xs: "inline", md: "block" },
                    mt: { xs: 0, md: 0.2 },
                  }}
                >
                  {secondPart}
                </Box>
              </>
            )}
          </Typography>

          {/* Metadata Badges: Deity, Location, Timings */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.25,
              alignItems: "center",
              mb: { xs: 2.5, md: 4 },
            }}
          >
            {temple?.primaryDeity && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: 1.8,
                  py: 0.75,
                  borderRadius: "10px",
                  bgcolor: "rgba(255, 251, 247, 0.9)",
                  border: "1px solid #FFE0D0",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  color: COLORS.PRIMARY,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                }}
              >
                <TempleHinduIcon sx={{ fontSize: 14, color: COLORS.PRIMARY }} />
                <span>Deity: {temple.primaryDeity}</span>
              </Box>
            )}

            {fullLocation && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: 1.8,
                  py: 0.75,
                  borderRadius: "10px",
                  bgcolor: "rgba(255, 251, 247, 0.9)",
                  border: "1px solid #BAE6FD",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: FONTS.OUTFIT,
                  color: "#0369A1",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                  maxWidth: "100%",
                }}
              >
                <LocationOnIcon sx={{ fontSize: 16, color: "#0284C7", flexShrink: 0 }} />
                <Typography
                  component="span"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: FONTS.OUTFIT,
                    color: "#0369A1",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: { xs: "230px", sm: "300px", md: "380px" },
                  }}
                >
                  {fullLocation}
                </Typography>
              </Box>
            )}

            {timingText && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: 1.8,
                  py: 0.75,
                  borderRadius: "10px",
                  bgcolor: "rgba(255, 251, 247, 0.9)",
                  border: "1px solid #FED7AA",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: FONTS.OUTFIT,
                  color: "#9A3412",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 16, color: "#EA580C" }} />
                <span>{timingText}</span>
              </Box>
            )}
          </Box>

          {/* Action Button & Trust Guarantee (Desktop only in left column) */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {ActionAndTrust}
          </Box>
        </Grid>

        {/* Right Side Temple Banner Image with Badge */}
        <Grid size={{ xs: 12, md: 5.5, lg: 5 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "250px", sm: "340px", md: "420px" },
              borderRadius: "24px",
              overflow: "hidden",
              border: "3px solid #FFFFFF",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
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
                  gap: 0.8,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  Sacred Shrine of {temple.primaryDeity}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action Button & Trust Guarantee (Mobile only below image) */}
          <Box sx={{ display: { xs: "block", md: "none" }, mt: 2.5 }}>
            {ActionAndTrust}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

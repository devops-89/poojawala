"use client";

import React from "react";
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
  const [imgError, setImgError] = React.useState(false);

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

  const deityName = temple?.primaryDeity || temple?.deity;

  const fullLocation = [temple?.address, temple?.city, temple?.state]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(", ");

  const isLogo = !heroImage || heroImage.includes("1Poojalogo") || heroImage.includes("logo");
  const displayBanner = isLogo || imgError ? DEFAULT_BANNER : heroImage;

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
          gap: 1.5,
          mb: 2,
        }}
      >
        <Breadcrumbs
          separator="›"
          sx={{
            fontSize: "13.5px",
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
              fontSize: "13.5px",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {temple?.name || "Temple Details"}
          </Typography>
        </Breadcrumbs>

        <Button
          onClick={() => router.push("/customer/temples")}
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          sx={{
            color: "#64748b",
            fontFamily: FONTS.OUTFIT,
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "20px",
            px: 1.8,
            py: 0.5,
            border: "1px solid #EFE6D5",
            bgcolor: "#FFFFFF",
            "&:hover": { color: COLORS.PRIMARY, bgcolor: "rgba(255, 98, 0, 0.05)", borderColor: "#FFD4BC" },
          }}
        >
          Back to Temples
        </Button>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 0.5, md: 1 },
          mb: { xs: 2.5, md: 3 },
          position: "relative",
        }}
      >
        {/* Background Ambient Glows */}
        <Box
          sx={{
            position: "absolute",
            top: -40,
            left: -40,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 145, 0, 0.08) 0%, rgba(255, 98, 0, 0) 70%)",
            filter: "blur(36px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Grid
          container
          spacing={{ xs: 2.5, md: 4 }}
          sx={{ alignItems: "center", position: "relative", zIndex: 1 }}
        >
          {/* Left Side Content */}
          <Grid size={{ xs: 12, md: 6.5, lg: 7 }} sx={{ order: { xs: 2, md: 1 } }}>
            {/* Top Sacred Badges */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.2,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 1.8,
                  py: 0.5,
                  borderRadius: "30px",
                  background: "linear-gradient(135deg, #FFF0E6 0%, #FFE4D6 100%)",
                  border: "1px solid #FFD0B8",
                  boxShadow: "0 2px 6px rgba(255, 98, 0, 0.06)",
                }}
              >
                <TempleHinduIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "11.5px",
                    fontWeight: 700,
                    letterSpacing: "0.6px",
                    color: "#D94E00",
                    textTransform: "uppercase",
                  }}
                >
                  Sacred Temple & Dham
                </Typography>
              </Box>

              {deityName && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.6,
                    px: 1.8,
                    py: 0.5,
                    borderRadius: "30px",
                    bgcolor: "#FEF3C7",
                    border: "1px solid #FDE68A",
                  }}
                >
                  <TempleHinduIcon sx={{ fontSize: 13, color: "#92400E" }} />
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "#92400E",
                    }}
                  >
                    Deity: {deityName}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Title with Two-Tone Typography */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: { xs: "26px", sm: "32px", md: "38px" },
                lineHeight: 1.2,
                mt: 0,
                mb: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              <Box component="span" sx={{ color: "#2C1810" }}>
                {firstPart}{" "}
              </Box>
              {secondPart && (
                <Box component="span" sx={{ color: COLORS.PRIMARY }}>
                  {secondPart}
                </Box>
              )}
            </Typography>

            {/* Full Location */}
            {fullLocation && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  mb: 1.8,
                }}
              >
                <LocationOnIcon
                  sx={{ color: COLORS.PRIMARY, fontSize: 18, flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: "13.5px", md: "14.5px" },
                    fontWeight: 500,
                    color: "#5C4A40",
                    lineHeight: 1.4,
                  }}
                >
                  {fullLocation}
                </Typography>
              </Box>
            )}

            {/* Trust Highlights Row (Clean text without icons) */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1.5,
                  py: 0.45,
                  borderRadius: "20px",
                  bgcolor: "#FFF8F2",
                  border: "1px solid #FFE2D1",
                }}
              >
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "12px", fontWeight: 600, color: "#9A3412" }}>
                  Consecrated Rituals
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1.5,
                  py: 0.45,
                  borderRadius: "20px",
                  bgcolor: "#FFF8F2",
                  border: "1px solid #FFE2D1",
                }}
              >
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "12px", fontWeight: 600, color: "#9A3412" }}>
                  Verified Pandits
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1.5,
                  py: 0.45,
                  borderRadius: "20px",
                  bgcolor: "#FFF8F2",
                  border: "1px solid #FFE2D1",
                }}
              >
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "12px", fontWeight: 600, color: "#9A3412" }}>
                  Authentic Samagri
                </Typography>
              </Box>
            </Box>

            {/* Action CTAs */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                onClick={onBookClick}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={{
                  background: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  borderRadius: "30px",
                  px: 3.8,
                  py: 1.15,
                  width: { xs: "100%", sm: "auto" },
                  fontSize: "14.5px",
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(255, 98, 0, 0.25)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background: COLORS.PRIMARY_DARK,
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 24px rgba(255, 98, 0, 0.35)",
                  },
                }}
              >
                Book Temple Pooja
              </Button>
            </Box>
          </Grid>

          {/* Right Side Temple Banner Image (top on mobile) */}
          <Grid size={{ xs: 12, md: 5.5, lg: 5 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "220px", sm: "260px", md: "280px" },
                borderRadius: "18px",
                overflow: "hidden",
                border: "1.5px solid #EFE6D5",
                boxShadow: "0 8px 24px rgba(44, 24, 16, 0.06)",
                bgcolor: "#FAF7F4",
              }}
            >
              <Box
                component="img"
                src={displayBanner}
                alt={temple?.name || "Temple Banner"}
                onError={() => setImgError(true)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {deityName && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    px: 1.6,
                    py: 0.5,
                    borderRadius: "10px",
                    bgcolor: "rgba(0, 0, 0, 0.68)",
                    backdropFilter: "blur(6px)",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                  }}
                >
                  <TempleHinduIcon sx={{ fontSize: 14, color: "#FFA454" }} />
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                    }}
                  >
                    Sacred Shrine of {deityName}
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

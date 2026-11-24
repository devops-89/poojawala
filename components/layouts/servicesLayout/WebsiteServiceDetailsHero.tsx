"use client";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";
import WifiIcon from "@mui/icons-material/Wifi";
import { Box, Button, Grid, Typography } from "@mui/material";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { normalizePoojaText } from "@/utils/helpers";

interface WebsiteServiceDetailsHeroProps {
  service: any;
  durationText?: string;
  formattedCities: string;
  formattedLanguages: string;
  priceDisplay: string;
  heroImage: string;
  onBookClick: () => void;
}

export default function WebsiteServiceDetailsHero({
  service,
  formattedLanguages,
  priceDisplay,
  heroImage,
  onBookClick,
}: WebsiteServiceDetailsHeroProps) {
  // Title formatting
  const rawTitle = normalizePoojaText(
    service?.name || service?.title || "Pooja Service"
  );
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

  const categoryName =
    service?.category?.name ||
    (typeof service?.category === "string" ? service?.category : "") ||
    "Authentic Vedic Ritual";

  const ActionAndTrust = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.8, md: 2.2 },
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
            py: 1.5,
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
          Book This Pooja
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
              color: COLORS.SLATE_MUTED,
            }}
          >
            Verified Vedic Purohits
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <ShieldCheckIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "12px", sm: "13px" },
              fontWeight: 600,
              color: COLORS.SLATE_MUTED,
            }}
          >
            100% Sacred Samagri
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        py: { xs: 2.5, md: 5 },
        position: "relative",
      }}
    >
      <Grid
        container
        spacing={{ xs: 3, md: 5 }}
        sx={{ alignItems: "center", position: "relative", zIndex: 1 }}
      >
        {/* Left Side Content */}
        <Grid size={{ xs: 12, md: 6.5 }}>
          {/* Top Sacred Badge */}
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
              mb: 1.8,
              boxShadow: "0 2px 8px rgba(255, 98, 0, 0.08)",
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
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
              {normalizePoojaText(categoryName)}
            </Typography>
          </Box>

          {/* Title with Two-Tone Typography (Natural line flow, no artificial hard breaks) */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "28px", sm: "36px", md: "44px" },
              lineHeight: 1.22,
              mt: 0,
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            <Box component="span" sx={{ color: "#1A0B05" }}>
              {firstPart}
            </Box>
            {secondPart && (
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg, #FF5500 0%, #E63E00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  ml: 1,
                }}
              >
                {secondPart}
              </Box>
            )}
          </Typography>

          {/* Pill Badges Row */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.2,
              mb: { xs: 2.5, md: 3.5 },
            }}
          >
            {/* Service Mode Badge */}
            {(service?.isOnline || service?.isOffline) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 1.8,
                  py: 0.7,
                  bgcolor: "rgba(255, 251, 247, 0.95)",
                  border: "1px solid #BAE6FD",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  color: "#0369A1",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                }}
              >
                {service.isOnline && service.isOffline ? (
                  <LanguageIcon sx={{ fontSize: 16, color: "#0284C7" }} />
                ) : service.isOnline ? (
                  <WifiIcon sx={{ fontSize: 16, color: "#0284C7" }} />
                ) : (
                  <LocationOnIcon sx={{ fontSize: 16, color: "#0284C7" }} />
                )}
                <span>
                  {service.isOnline && service.isOffline
                    ? "ONLINE & OFFLINE"
                    : service.isOnline
                      ? "ONLINE POOJA"
                      : "OFFLINE POOJA"}
                </span>
              </Box>
            )}

            {/* Language Badge */}
            {formattedLanguages && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 1.8,
                  py: 0.7,
                  bgcolor: "rgba(255, 251, 247, 0.95)",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.4px",
                  color: "#475569",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                }}
              >
                <LanguageIcon sx={{ fontSize: 16, color: "#64748B" }} />
                <span>{formattedLanguages}</span>
              </Box>
            )}
          </Box>

          {/* Action Button & Trust Guarantee (Desktop only in left column) */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {ActionAndTrust}
          </Box>
        </Grid>

        {/* Right Side Image Card with Floating Price Overlay */}
        <Grid size={{ xs: 12, md: 5.5 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              pt: 0,
              pb: { xs: 2.5, md: 3 },
            }}
          >
            {/* Main Image Frame Container */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 260, sm: 360, md: 380, lg: 400 },
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
                border: "2px solid #FFE8D6",
                background: "radial-gradient(circle, #FFFDF8 0%, #FAF4EE 100%)",
                transition: "transform 0.4s ease",
                "&:hover": {
                  transform: "scale(1.01)",
                },
              }}
            >
              <Box
                component="img"
                src={heroImage}
                alt={rawTitle}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Gradient Vignette Overlay at Bottom */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 65%, rgba(26, 11, 5, 0.4) 100%)",
                  pointerEvents: "none",
                }}
              />
            </Box>

            {/* Bottom Left Floating Price Card */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: { xs: 12, sm: 24 },
                bgcolor: "#FFFFFF",
                borderRadius: "18px",
                px: { xs: 2, sm: 3.5 },
                py: { xs: 1.25, sm: 2 },
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                border: "1.5px solid #FFE0D0",
                zIndex: 3,
                minWidth: { xs: "auto", sm: "220px" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: "10px", sm: "11px" },
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  color: COLORS.GOLD_DARK,
                  textTransform: "uppercase",
                  mb: 0.4,
                }}
              >
                STARTING FROM
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  fontSize: { xs: "18px", sm: "24px", md: "26px" },
                  color: "#1A0B05",
                  lineHeight: 1.15,
                }}
              >
                {priceDisplay}
              </Typography>
            </Box>
          </Box>

          {/* Action Button & Trust Guarantee (Mobile only below image & price) */}
          <Box sx={{ display: { xs: "block", md: "none" }, mt: 2.5 }}>
            {ActionAndTrust}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

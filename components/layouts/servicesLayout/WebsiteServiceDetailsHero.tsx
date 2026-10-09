"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";
import { Box, Button, Grid, Typography } from "@mui/material";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface WebsiteServiceDetailsHeroProps {
  service: any;
  durationText: string;
  formattedCities: string;
  formattedLanguages: string;
  priceDisplay: string;
  heroImage: string;
  onBookClick: () => void;
}

export default function WebsiteServiceDetailsHero({
  service,
  durationText,
  formattedCities,
  formattedLanguages,
  priceDisplay,
  heroImage,
  onBookClick,
}: WebsiteServiceDetailsHeroProps) {
  // Title formatting
  const rawTitle =
    service?.name || service?.title || "Navratri Special Durga Puja";
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

  return (
    <Box
      sx={{
        py: { xs: 3, md: 5 },
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
              px: 2,
              py: 0.6,
              borderRadius: "30px",
              background: "linear-gradient(135deg, #FFF0E6 0%, #FFE4D6 100%)",
              border: "1px solid #FFD0B8",
              mb: 2.5,
              boxShadow: "0 2px 8px rgba(255, 98, 0, 0.08)",
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
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
              {service?.category?.name ||
                (typeof service?.category === "string"
                  ? service?.category
                  : "") ||
                "Authentic Vedic Ritual"}
            </Typography>
          </Box>

          {/* Title with Two-Tone Serif Typography */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: { xs: "32px", sm: "44px", md: "52px" },
              lineHeight: 1.15,
              mt: 0,
              mb: 3,
              letterSpacing: "-0.02em",
            }}
          >
            <Box component="span" sx={{ color: "#1A0B05", display: "block" }}>
              {firstPart}
            </Box>
            {secondPart && (
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(90deg, #FF5500 0%, #E63E00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block",
                  mt: 0.2,
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
              gap: 1.25,
              mb: 4,
            }}
          >
            {/* Duration Badge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.85,
                px: 2,
                py: 0.8,
                bgcolor: "rgba(255, 251, 247, 0.9)",
                border: "1px solid #FFE0D0",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: COLORS.PRIMARY,
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#FFF0E6",
                  borderColor: COLORS.PRIMARY,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 17, color: COLORS.PRIMARY }} />
              <span>{durationText}</span>
            </Box>

            {/* Language Badge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.85,
                px: 2,
                py: 0.8,
                bgcolor: "rgba(255, 251, 247, 0.9)",
                border: "1px solid #FFE0D0",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: COLORS.PRIMARY,
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#FFF0E6",
                  borderColor: COLORS.PRIMARY,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <LanguageIcon sx={{ fontSize: 17, color: COLORS.PRIMARY }} />
              <span>{formattedLanguages ? formattedLanguages : "HINDI"}</span>
            </Box>

            {/* Location / Cities Badge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.85,
                px: 2,
                py: 0.8,
                bgcolor: "rgba(255, 251, 247, 0.9)",
                border: "1px solid #FFE0D0",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: COLORS.PRIMARY,
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#FFF0E6",
                  borderColor: COLORS.PRIMARY,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <LocationOnIcon sx={{ fontSize: 17, color: COLORS.PRIMARY }} />
              <span>
                {formattedCities ? formattedCities : "NOIDA & GHAZIABAD"}
              </span>
            </Box>
          </Box>

          {/* Action Button & Trust Guarantee */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Button
                variant="contained"
                onClick={onBookClick}
                startIcon={<CalendarMonthIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
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
                    background:
                      "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)",
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
                pt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <ShieldCheckIcon sx={{ color: COLORS.GREEN_SUCCESS, fontSize: 18 }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
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
                    fontFamily: FONTS.PRIMARY,
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
        </Grid>

        {/* Right Side Image Card with Floating Price Overlay */}
        <Grid size={{ xs: 12, md: 5.5, lg: 5 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              pt: 0,
              pb: { xs: 4, md: 3 },
            }}
          >
            {/* Main Image Frame Container */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 260, sm: 360, md: 420, lg: 450 },
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 22px 50px rgba(30, 12, 6, 0.16)",
                border: "2px solid #FFE8D6",
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
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 1.5, sm: 2 },
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.14)",
                border: "1.5px solid #FFE0D0",
                zIndex: 3,
                minWidth: { xs: "180px", sm: "220px" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontSize: { xs: "10px", sm: "11px" },
                  fontWeight: 800,
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
                  fontFamily: FONTS.PRIMARY,
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
        </Grid>
      </Grid>
    </Box>
  );
}

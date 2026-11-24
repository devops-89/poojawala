"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LanguageIcon from "@mui/icons-material/Language";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WifiIcon from "@mui/icons-material/Wifi";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";

interface Props {
  service: any;
  durationText?: string;
  formattedCities?: string;
  formattedLanguages: string;
  priceDisplay: string;
  priceLabel?: string;
  heroImage: string;
  onOpenBooking: () => void;
  ctaText?: string;
  isAlreadyAdded?: boolean;
}

export default function ServiceDetailsHeroSection({
  service,
  durationText,
  formattedLanguages,
  priceDisplay,
  priceLabel,
  heroImage,
  onOpenBooking,
  ctaText,
  isAlreadyAdded,
}: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#FAF4EE",
        borderRadius: "24px",
        p: { xs: 2, sm: 3.5, md: 5 },
        border: "1px solid #EADCCF",
        mb: { xs: 4, md: 6 },
      }}
    >
      <Grid container spacing={{ xs: 2.5, sm: 3.5, md: 4 }} sx={{ alignItems: "center" }}>
        {/* Hero Left Content: On mobile appears below Image */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 1 } }}>
          {/* Top Badges Row */}
          {(service.isUpcomingFestival || service.isOnline || service.isOffline) && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              {service.isUpcomingFestival && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    bgcolor: "#FEF3C7",
                    border: "1px solid #FCD34D",
                    borderRadius: "20px",
                    color: "#B45309",
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "13px",
                  }}
                >
                  <SparklesIcon sx={{ fontSize: 16, color: "#D97706" }} />
                  <span>UPCOMING FESTIVAL</span>
                </Box>
              )}

              {(service.isOnline || service.isOffline) && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    bgcolor: "#E0F2FE",
                    border: "1px solid #BAE6FD",
                    borderRadius: "20px",
                    color: "#0369A1",
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "13px",
                  }}
                >
                  <WifiIcon sx={{ fontSize: 16, color: "#0284C7" }} />
                  <span>
                    {service.isOnline ? "ONLINE SERVICE" : "OFFLINE SERVICE"}
                  </span>
                </Box>
              )}
            </Box>
          )}

          {/* Service Name Title */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "24px", sm: "34px", md: "42px" },
              lineHeight: 1.2,
              mb: { xs: 1.2, sm: 1.8 },
            }}
          >
            {service.name || service.title}
          </Typography>

          {/* Service Description */}
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#5C4A40",
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              lineHeight: 1.65,
              mb: { xs: 2, sm: 2.5 },
              maxWidth: 560,
            }}
          >
            {service.description ||
              service.desc ||
              service.shortDescription ||
              "Traditional Vedic pooja performed by an experienced Purohit — complete with Sankalp, Path, Aarti and Prasad. Conducted at your home or venue."}
          </Typography>

          {/* Pill Badges Row: Language & Duration */}
          {(formattedLanguages || durationText) && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.2,
                mb: { xs: 2.5, sm: 3.5 },
              }}
            >
              {formattedLanguages ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.8,
                    py: 0.7,
                    bgcolor: "#FFFBF7",
                    border: "1px solid #E4D5C7",
                    borderRadius: "20px",
                    fontSize: { xs: "12.5px", sm: "13px" },
                    fontWeight: 600,
                    fontFamily: FONTS.OUTFIT,
                    color: "#5C4A40",
                  }}
                >
                  <LanguageIcon sx={{ fontSize: 16, color: "#7C6A60" }} />
                  <span>{formattedLanguages}</span>
                </Box>
              ) : null}

              {durationText ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.8,
                    py: 0.7,
                    bgcolor: "#FFFBF7",
                    border: "1px solid #E4D5C7",
                    borderRadius: "20px",
                    fontSize: { xs: "12.5px", sm: "13px" },
                    fontWeight: 600,
                    fontFamily: FONTS.OUTFIT,
                    color: "#5C4A40",
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 16, color: "#7C6A60" }} />
                  <span>{durationText}</span>
                </Box>
              ) : null}
            </Box>
          )}

          {/* Price Section */}
          <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1.2px",
                color: COLORS.GOLD_DARK,
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              {priceLabel || "STARTING FROM"}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#2C1810",
                fontSize: { xs: "28px", sm: "34px", md: "40px" },
              }}
            >
              {priceDisplay}
            </Typography>
          </Box>

          {/* CTA Action Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant={isAlreadyAdded ? "outlined" : "contained"}
              size="large"
              disabled={isAlreadyAdded}
              onClick={onOpenBooking}
              startIcon={<CalendarMonthIcon />}
              sx={{
                width: { xs: "100%", sm: "auto" },
                ...(isAlreadyAdded
                  ? {
                      borderColor: "#EADCCF",
                      color: "#94a3b8 !important",
                      bgcolor: "#FFFBF7 !important",
                    }
                  : {
                      background: "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
                      color: "#FFFFFF !important",
                      boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)",
                        boxShadow: "0 8px 25px rgba(255, 98, 0, 0.4)",
                      },
                    }),
                px: 4,
                py: { xs: 1.4, sm: 1.6 },
                borderRadius: "12px",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
                fontSize: "15px",
                textTransform: "none",
              }}
            >
              {ctaText || "Book This Pooja"}
            </Button>
          </Box>
        </Grid>

        {/* Hero Right Image Card: On mobile appears at Top */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 200, sm: 280, md: 400 },
              borderRadius: { xs: "18px", md: "20px" },
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(44, 24, 16, 0.12)",
              border: "1px solid #E4D5C7",
              bgcolor: "#FFFBF7",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt={service.name || service.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

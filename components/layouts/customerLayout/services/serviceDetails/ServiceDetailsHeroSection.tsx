"use client";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";

interface Props {
  service: any;
  durationText: string;
  formattedCities: string;
  formattedLanguages: string;
  priceDisplay: string;
  heroImage: string;
  onOpenBooking: () => void;
  ctaText?: string;
  isAlreadyAdded?: boolean;
}

export default function ServiceDetailsHeroSection({
  service,
  durationText,
  formattedCities,
  formattedLanguages,
  priceDisplay,
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
        p: { xs: 3, sm: 4, md: 5 },
        border: "1px solid #EADCCF",
        mb: 6,
      }}
    >
      <Grid container spacing={4} sx={{ alignItems: "center" }}>
        {/* Hero Left Content */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Upcoming Festival Badge */}
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
                fontSize: "13px",
                mb: 2,
              }}
            >
              <SparklesIcon sx={{ fontSize: 16, color: "#D97706" }} />
              <span>UPCOMING FESTIVAL</span>
            </Box>
          )}

          {/* Service Name Title */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "24px", sm: "34px", md: "42px" },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            {service.name || service.title}
          </Typography>

          {/* Service Description */}
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#5C4A40",
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              lineHeight: 1.65,
              mb: 3,
              maxWidth: 560,
            }}
          >
            {service.description ||
              service.desc ||
              service.shortDescription ||
              "Traditional Vedic pooja performed by an experienced Purohit — complete with Sankalp, Path, Aarti and Prasad. Conducted at your home or venue."}
          </Typography>

          {/* Pill Badges Row */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 0.85,
                bgcolor: "#FFFBF7",
                border: "1px solid #E4D5C7",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#5C4A40",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 16, color: "#7C6A60" }} />
              <span>{durationText}</span>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 0.85,
                bgcolor: "#FFFBF7",
                border: "1px solid #E4D5C7",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#5C4A40",
              }}
            >
              <LocationOnIcon sx={{ fontSize: 16, color: "#7C6A60" }} />
              <span>
                {formattedCities ||
                  (service.requiresVenue
                    ? "Venue Required"
                    : "Location Available")}
              </span>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 0.85,
                bgcolor: "#FFFBF7",
                border: "1px solid #E4D5C7",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#5C4A40",
              }}
            >
              <LanguageIcon sx={{ fontSize: 16, color: "#7C6A60" }} />
              <span>{formattedLanguages}</span>
            </Box>
          </Box>

          {/* Price Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1.2px",
                color: "#A39288",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              STARTING FROM
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
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
                      bgcolor: "#C84B16 !important",
                      color: "white !important",
                      boxShadow: "0 6px 20px rgba(200, 75, 22, 0.3)",
                      "&:hover": {
                        bgcolor: "#FF6200 !important",
                        boxShadow: "0 8px 25px rgba(200, 75, 22, 0.4)",
                      },
                    }),
                px: 4,
                py: 1.6,
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "15px",
                textTransform: "none",
              }}
            >
              {ctaText || "Book This Pooja"}
            </Button>
          </Box>
        </Grid>

        {/* Hero Right Image Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 280, sm: 360, md: 400 },
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(44, 24, 16, 0.12)",
              border: "1px solid #E4D5C7",
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

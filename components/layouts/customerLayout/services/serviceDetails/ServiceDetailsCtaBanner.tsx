"use client";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";

interface Props {
  service: any;
  durationText: string;
  priceDisplay: string;
  citiesCount: number;
  onOpenBooking: () => void;
}

export default function ServiceDetailsCtaBanner({
  service,
  durationText,
  priceDisplay,
  citiesCount,
  onOpenBooking,
}: Props) {
  // Determine header tag & title based on whether it's an upcoming festival service or normal service
  let tagText = service?.name ? service.name.toUpperCase() : "TRADITIONAL POOJA";
  let headlineTitle = "Book your authentic pooja today";

  if (service?.isUpcomingFestival && service?.festivalStartDate) {
    try {
      const d = new Date(service.festivalStartDate);
      const formattedDayMonth = d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
      });
      headlineTitle = `Reserve your pooja before ${formattedDayMonth}`;
    } catch (e) {
      headlineTitle = "Reserve your festival pooja in advance";
    }
  }

  // Format short price for stat line (e.g. ₹2,100)
  const shortPrice = service?.minPrice
    ? `₹${Number(service.minPrice).toLocaleString("en-IN")}`
    : service?.price || service?.basePrice
      ? `₹${Number(service.price || service.basePrice).toLocaleString("en-IN")}`
      : priceDisplay;

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#2C1810",
        color: "#FAF4EE",
        borderRadius: "24px",
        p: { xs: 4, sm: 5, md: 6 },
        mt: 4,
        mb: 6,
        boxShadow: "0 16px 40px rgba(44, 24, 16, 0.25)",
      }}
    >
      <Grid container spacing={4} sx={{ alignItems: "center" }}>
        {/* Left Side Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "#D97757",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            {tagText}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#FFFBF7",
              fontSize: { xs: "28px", sm: "36px", md: "40px" },
              lineHeight: 1.2,
              mb: 2.5,
            }}
          >
            {headlineTitle}
          </Typography>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#D5C4B9",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: 580,
              mb: 4,
            }}
          >
            Dates fill quickly around peak seasons. Secure your Purohit now so every
            ritual is performed exactly as it should be — without last-minute
            arrangements.
          </Typography>

          {/* Stats Bar */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 3, sm: 5 } }}>
            {/* Stat 1: Duration */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontWeight: 800,
                  fontSize: { xs: "24px", sm: "28px" },
                  color: "#FFFBF7",
                  lineHeight: 1,
                }}
              >
                {durationText}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#D97757",
                  textTransform: "uppercase",
                  mt: 1,
                }}
              >
                CEREMONY
              </Typography>
            </Box>

            {/* Stat 2: Starting Price */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontWeight: 800,
                  fontSize: { xs: "24px", sm: "28px" },
                  color: "#FFFBF7",
                  lineHeight: 1,
                }}
              >
                {shortPrice}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#D97757",
                  textTransform: "uppercase",
                  mt: 1,
                }}
              >
                STARTING PRICE
              </Typography>
            </Box>

            {/* Stat 3: Cities Count */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontWeight: 800,
                  fontSize: { xs: "24px", sm: "28px" },
                  color: "#FFFBF7",
                  lineHeight: 1,
                }}
              >
                {citiesCount > 0 ? citiesCount : "All"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#D97757",
                  textTransform: "uppercase",
                  mt: 1,
                }}
              >
                {citiesCount > 0 ? "CITIES SERVED" : "GLOBAL COVERAGE"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Side CTA Button & Subtext */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", md: "flex-end" },
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onOpenBooking}
            startIcon={<CalendarMonthIcon />}
            sx={{
              width: { xs: "100%", sm: "auto" },
              bgcolor: "#C84B16",
              color: "white",
              px: 4,
              py: 1.8,
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "16px",
              textTransform: "none",
              boxShadow: "0 8px 24px rgba(200, 75, 22, 0.4)",
              "&:hover": {
                bgcolor: "#FF6200",
                boxShadow: "0 10px 28px rgba(200, 75, 22, 0.5)",
              },
            }}
          >
            Book This Pooja
          </Button>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: "12px",
              color: "#A39288",
              mt: 2,
              textAlign: { xs: "center", sm: "left", md: "right" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Confirmation within 24 hours — no advance payment required
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

"use client";
import { Box, Button, Container, Typography } from "@mui/material";

export default function HeroSection() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "380px", sm: "480px", md: "777px" },
        backgroundImage: {
          xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.95) 0%, rgba(255, 253, 249, 0.82) 45%, rgba(255, 253, 249, 0.1) 80%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          md: "linear-gradient(90deg, #FFFDF9 0%, rgba(255, 253, 249, 0.85) 35%, rgba(255, 253, 249, 0.1) 65%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
        },
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        pt: { xs: 2.5, md: 4 },
        pb: { xs: 3.5, md: 8 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Content */}
        <Box sx={{ maxWidth: "600px", mt: "auto", mb: "auto" }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              color: "#0f172a",
              mb: 0.5,
              fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
              lineHeight: { xs: 1.15, md: 1.2 },
              letterSpacing: "-0.04em",
            }}
          >
            Sacred Rituals,
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              color: "#0f172a",
              mb: 0.5,
              fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
              lineHeight: { xs: 1.15, md: 1.2 },
              letterSpacing: "-0.04em",
            }}
          >
            Trusted Pandits,
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              color: "#D32F2F",
              mb: { xs: 1.5, md: 3 },
              fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
              lineHeight: { xs: 1.15, md: 1.2 },
              letterSpacing: "-0.04em",
            }}
          >
            One Booking Away
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#0f172a",
              fontWeight: 600,
              mb: { xs: 2.5, md: 4 },
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              lineHeight: "1.45",
              maxWidth: "440px",
              letterSpacing: "0em",
            }}
          >
            Book verified Pandits for Puja, Astrology, and Vastu — at home, at a
            temple, or online — in under 5 minutes.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, md: 2 },
              flexWrap: "wrap",
              "&:has(.talk-to:hover) .book-now": {
                background: "transparent",
                color: "#FF6200",
                borderColor: "#FF6200",
                border: "2px solid #FF6200",
                boxShadow: "none",
              },
            }}
          >
            <Button
              className="book-now"
              variant="contained"
              href="/purohits#top-purohits"
              sx={{
                background: "#FF6200",
                border: "2px solid #FF6200",
                color: "#fff",
                px: { xs: 2.5, md: 4 },
                py: { xs: 0.9, md: 1.5 },
                borderRadius: "30px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: { xs: "0.85rem", md: "1rem" },
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "#F05A00",
                  borderColor: "#F05A00",
                  boxShadow: "0 4px 14px rgba(255, 98, 0, 0.4)",
                },
              }}
            >
              Book Now
            </Button>
            <Button
              className="talk-to"
              variant="outlined"
              href="/purohits#top-purohits"
              sx={{
                borderColor: "#1A1A1A",
                color: "#1A1A1A",
                background: "transparent",
                px: { xs: 2.5, md: 4 },
                py: { xs: 0.9, md: 1.5 },
                borderRadius: "30px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: { xs: "0.85rem", md: "1rem" },
                borderWidth: "2px",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#FF6200",
                  background: "#FF6200",
                  color: "#FFFFFF",
                  borderWidth: "2px",
                },
              }}
            >
              Talk to an Astrologer
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

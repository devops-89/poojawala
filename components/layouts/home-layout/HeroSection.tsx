"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export default function HeroSection() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clean up any lingering hash from address bar so URL remains clean
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const targetSection = sessionStorage.getItem("home_restore_section");
    if (!targetSection) return;
    sessionStorage.removeItem("home_restore_section");

    const doScroll = () => {
      const el = document.getElementById(targetSection);
      if (el) {
        el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
        return true;
      }
      return false;
    };

    if (!doScroll()) {
      requestAnimationFrame(doScroll);
    }
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "auto", md: "calc(100vh - 80px)" },
        minHeight: { xs: "380px", sm: "460px", md: "calc(100vh - 80px)" },
        maxHeight: { md: "calc(100vh - 80px)" },
        backgroundImage: {
          xs: "linear-gradient(180deg, rgba(12, 6, 2, 0.78) 0%, rgba(12, 6, 2, 0.52) 60%, rgba(12, 6, 2, 0.18) 100%), url(/images/home/hero/heroSectionHome.webp)",
          sm: "linear-gradient(90deg, rgba(12, 6, 2, 0.82) 0%, rgba(12, 6, 2, 0.55) 55%, rgba(12, 6, 2, 0.12) 80%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          md: "linear-gradient(90deg, rgba(12, 6, 2, 0.84) 0%, rgba(12, 6, 2, 0.55) 42%, rgba(12, 6, 2, 0.15) 68%, transparent 85%), url(/images/home/hero/heroSectionHome.webp)",
        },
        backgroundSize: "cover",
        backgroundPosition: { xs: "top right", md: "center" },
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        pt: { xs: 3.5, sm: 4, md: 4 },
        pb: { xs: 4, sm: 5, md: 6 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        {/* Content */}
        <Box sx={{ maxWidth: { xs: "100%", md: "580px" }, mt: "auto", mb: "auto", position: "relative", zIndex: 2 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: FONTS.DM_SANS,
              fontWeight: 800,
              color: "#FFFFFF",
              mb: { xs: 1.5, md: 3 },
              fontSize: { xs: "1.85rem", sm: "2.4rem", md: "48px" },
              lineHeight: { xs: 1.2, md: 1.22 },
              letterSpacing: "-0.03em",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.85), 0 4px 20px rgba(0, 0, 0, 0.7)",
            }}
          >
            Sacred Rituals,
            <Box component="span" sx={{ display: "block" }}>
              Trusted Pandits,
            </Box>
            <Box
              component="span"
              sx={{
                display: "block",
                fontWeight: 800,
                color: "#FFB300",
                mt: 0.5,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 179, 0, 0.5)",
              }}
            >
              One Booking Away
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: FONTS.DM_SANS,
              color: "#F1F5F9",
              fontWeight: 500,
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "14.5px", sm: "15px", md: "16px" },
              lineHeight: 1.6,
              maxWidth: "480px",
              letterSpacing: "0em",
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.9)",
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
                color: COLORS.PRIMARY,
                borderColor: COLORS.PRIMARY,
                border: `2px solid ${COLORS.PRIMARY}`,
                boxShadow: "none",
              },
            }}
          >
            <Button
              className="book-now"
              component={Link}
              variant="contained"
              href="/sign-up?from=book-now"
              sx={{
                background: COLORS.PRIMARY,
                border: `2px solid ${COLORS.PRIMARY}`,
                color: COLORS.WHITE,
                px: { xs: 2.5, md: 4 },
                py: { xs: 0.9, md: 1.5 },
                borderRadius: "30px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: { xs: "0.85rem", md: "1rem" },
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: COLORS.PRIMARY_HOVER,
                  borderColor: COLORS.PRIMARY_HOVER,
                  boxShadow: "0 4px 14px rgba(255, 98, 0, 0.4)",
                },
              }}
            >
              Book Now
            </Button>
            <Button
              className="talk-to"
              component={Link}
              variant="outlined"
              href="/astrologers"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.85)",
                color: "#FFFFFF",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(6px)",
                px: { xs: 2.5, md: 4 },
                py: { xs: 0.9, md: 1.5 },
                borderRadius: "30px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: { xs: "0.85rem", md: "1rem" },
                borderWidth: "2px",
                textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: COLORS.PRIMARY,
                  background: COLORS.PRIMARY,
                  color: COLORS.WHITE,
                  borderWidth: "2px",
                  textShadow: "none",
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

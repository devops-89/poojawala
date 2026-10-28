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
        minHeight: { xs: "380px", sm: "480px", md: "777px" },
        backgroundImage: {
          xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.95) 0%, rgba(255, 253, 249, 0.85) 45%, rgba(255, 253, 249, 0.35) 75%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          md: "linear-gradient(90deg, rgba(255, 253, 249, 0.94) 0%, rgba(255, 253, 249, 0.86) 24%, rgba(255, 253, 249, 0.68) 38%, rgba(255, 253, 249, 0.22) 48%, transparent 56%), url(/images/home/hero/heroSectionHome.webp)",
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
        <Box sx={{ maxWidth: { xs: "100%", md: "560px" }, mt: "auto", mb: "auto", position: "relative", zIndex: 2 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: FONTS.DM_SANS,
              fontWeight: 700,
              color: COLORS.SLATE_DARK,
              mb: { xs: 1.5, md: 3 },
              fontSize: { xs: "1.75rem", sm: "2.4rem", md: "48px" },
              lineHeight: { xs: 1.15, md: 1.2 },
              letterSpacing: "-0.04em",
              textShadow: "0 1px 3px rgba(255, 255, 255, 0.9), 0 2px 14px rgba(255, 253, 249, 0.75)",
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
                color: COLORS.RED_DARK,
                mt: 0.5,
              }}
            >
              One Booking Away
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: FONTS.DM_SANS,
              color: COLORS.SLATE_DARK,
              fontWeight: 600,
              mb: { xs: 2.5, md: 4 },
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              lineHeight: "1.45",
              maxWidth: "440px",
              letterSpacing: "0em",
              textShadow: "0 1px 2px rgba(255, 255, 255, 0.85), 0 1px 8px rgba(255, 253, 249, 0.7)",
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
                borderColor: COLORS.CHARCOAL_DARK,
                color: COLORS.CHARCOAL_DARK,
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
                  borderColor: COLORS.PRIMARY,
                  background: COLORS.PRIMARY,
                  color: COLORS.WHITE,
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

"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FFFDF9",
        py: { xs: 8, md: 12 },
        px: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background soft glow */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 300, md: 550 },
          height: { xs: 300, md: 550 },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 127, 63, 0.12) 0%, rgba(255, 253, 249, 0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* Sacred Badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "rgba(255, 98, 0, 0.08)",
            color: COLORS.PRIMARY,
            px: 2,
            py: 0.75,
            borderRadius: "50px",
            mb: 3,
            fontSize: "0.875rem",
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 18 }} />
          <span>Om Shanti • 404 Error</span>
        </Box>

        {/* 404 Large Display */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: FONTS.DM_SANS,
            fontWeight: 900,
            fontSize: { xs: "5.5rem", sm: "8rem", md: "10rem" },
            lineHeight: 1,
            letterSpacing: "-0.05em",
            background: "linear-gradient(135deg, #FF6200 0%, #FF7F3F 50%, #884EA0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          404
        </Typography>

        {/* Heading */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontFamily: FONTS.DM_SANS,
            fontWeight: 700,
            color: "#1e293b",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
            mb: 1.5,
          }}
        >
          Page Not Found
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748b",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            maxWidth: "540px",
            mx: "auto",
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          The sacred path or page you are seeking does not exist, has been relocated, or is temporarily unavailable. Let us guide you back to your spiritual journey.
        </Typography>

        {/* Navigation Actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            mb: 5,
          }}
        >
          <Button
            component={Link}
            href="/"
            variant="contained"
            startIcon={<HomeIcon />}
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "#ffffff",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              px: 3.5,
              py: 1.25,
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(255, 98, 0, 0.4)",
              "&:hover": {
                bgcolor: COLORS.PRIMARY_DARK,
                boxShadow: "0 12px 28px -5px rgba(255, 98, 0, 0.5)",
              },
            }}
          >
            Return to Home
          </Button>

          <Button
            component={Link}
            href="/services"
            variant="outlined"
            startIcon={<TempleHinduIcon />}
            sx={{
              borderColor: "#e2e8f0",
              color: "#334155",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              px: 3,
              py: 1.25,
              borderRadius: "12px",
              bgcolor: "#ffffff",
              "&:hover": {
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
                bgcolor: "rgba(255, 98, 0, 0.04)",
              },
            }}
          >
            Explore Pujas
          </Button>

          <Button
            component={Link}
            href="/astrologers"
            variant="outlined"
            startIcon={<AutoAwesomeIcon />}
            sx={{
              borderColor: "#e2e8f0",
              color: "#334155",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              px: 3,
              py: 1.25,
              borderRadius: "12px",
              bgcolor: "#ffffff",
              "&:hover": {
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
                bgcolor: "rgba(255, 98, 0, 0.04)",
              },
            }}
          >
            Consult Astrologers
          </Button>
        </Box>

        {/* Helpful links */}
        <Box
          sx={{
            display: "inline-flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3 },
            justifyContent: "center",
            color: "#64748b",
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.875rem",
          }}
        >
          <span>Need help?</span>
          <Link href="/contact" style={{ color: COLORS.PRIMARY, textDecoration: "none", fontWeight: 600 }}>
            Contact Support
          </Link>
          <span>•</span>
          <Link href="/purohits" style={{ color: "#334155", textDecoration: "none" }}>
            Verified Pandits
          </Link>
          <span>•</span>
          <Link href="/blogs" style={{ color: "#334155", textDecoration: "none" }}>
            Spiritual Blogs
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

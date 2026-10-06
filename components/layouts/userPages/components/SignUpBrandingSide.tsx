"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function SignUpBrandingSide() {
  return (
    <Box
      sx={{
        flex: 0.9,
        background:
          "linear-gradient(145deg, #1E0C06 0%, #3D1405 55%, #FF6200 100%)",
        p: { xs: 3, md: 4.5 },
        display: "flex",
        flexDirection: "column",
        justify: "space-between",
        color: "white",
        position: "relative",
        overflow: "hidden",
        minHeight: { md: "560px" },
      }}
    >
      {/* Background Subtle Overlay Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,145,0,0.25) 0%, rgba(255,98,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Section: Logo & Badge */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Go to Website Button */}
        <Box sx={{ mb: 2.5 }}>
          <Button
            component={Link}
            href="/"
            variant="outlined"
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{
              py: 0.5,
              px: 1.75,
              borderRadius: "30px",
              borderColor: "rgba(255, 255, 255, 0.3)",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 600,
              fontSize: "12px",
              textTransform: "none",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.25)",
                borderColor: "rgba(255, 255, 255, 0.6)",
                color: "#ffffff",
              },
            }}
          >
            Go to Website
          </Button>
        </Box>

        <Box
          component="img"
          src="/images/logo.webp"
          alt="Poojawala Logo"
          sx={{
            height: { xs: "36px", md: "46px" },
            objectFit: "contain",
            mb: 3,
            filter: "brightness(0) invert(1)",
          }}
        />

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.6,
            borderRadius: "20px",
            bgcolor: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "#FFE0D0",
              textTransform: "uppercase",
            }}
          >
            ✨ Sacred Experience
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 800,
            mb: 1.5,
            fontSize: { xs: "1.6rem", md: "2.1rem" },
            lineHeight: 1.2,
          }}
        >
          Join Us Today!
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "13.5px",
            lineHeight: 1.55,
            color: "rgba(255, 255, 255, 0.85)",
            mb: 3.5,
          }}
        >
          Create an account to book authentic Pooja, track upcoming Anushthans,
          and consult with verified Pandits seamlessly.
        </Typography>

        {/* Feature Highlights */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {[
            "Verified Vedic Purohits & Scholars",
            "Live & Instant Pooja Status Updates",
            "100% Sacred, Transparent & Secure",
          ].map((item, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
            >
              <CheckCircleOutlinedIcon
                sx={{ color: "#FF9100", fontSize: 18 }}
              />
              <Typography
                sx={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.95)",
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Bottom Section Decorative Artwork */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          mt: 3,
          display: "flex",
          justify: "center",
        }}
      >
        <Box
          component="img"
          src="/images/home/poojaPackages/dhanush.webp"
          alt="Branding Artwork"
          sx={{
            width: { xs: "110px", md: "140px" },
            filter: "brightness(0) invert(1)",
            opacity: 0.6,
          }}
        />
      </Box>
    </Box>
  );
}

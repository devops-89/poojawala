"use client";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { FONTS } from "@/utils/fonts";

export default function SignUpBrandingSide() {
  return (
    <Box
      sx={{
        flex: { md: 0.9, lg: 0.88 },
        background:
          "linear-gradient(165deg, rgba(255, 252, 247, 0.55) 0%, rgba(255, 245, 235, 0.35) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRight: { md: "1.5px solid rgba(255, 235, 220, 0.6)" },
        p: { xs: 2, sm: 2.25, md: "20px 24px" },
        "@media (max-height: 740px)": {
          p: { xs: 2, md: "14px 20px" },
        },
        "@media (max-height: 660px)": {
          p: { xs: 1.5, md: "10px 16px" },
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Brand Logo - Top Aligned with Create an Account */}
      <Box
        component={Link}
        href="/"
        sx={{
          display: "inline-block",
          mb: { xs: 2, md: 2.5 },
          "@media (max-height: 740px)": {
            mb: 1.75,
          },
          "@media (max-height: 660px)": {
            mb: 1.25,
          },
          transition: "transform 0.2s ease",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        <Box
          component="img"
          src="/images/1Poojalogo.webp"
          alt="1Pooja Logo"
          sx={{
            height: { xs: "36px", sm: "40px", md: "46px" },
            "@media (max-height: 740px)": {
              height: { xs: "34px", md: "40px" },
            },
            "@media (max-height: 660px)": {
              height: { xs: "30px", md: "34px" },
            },
            width: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Headline */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#1F1A17",
          fontSize: { xs: "24px", sm: "26px", md: "28px" },
          "@media (max-height: 740px)": {
            fontSize: { xs: "22px", md: "25px" },
          },
          "@media (max-height: 660px)": {
            fontSize: { xs: "20px", md: "22px" },
          },
          lineHeight: 1.22,
          mb: 1.2,
          letterSpacing: "-0.3px",
        }}
      >
        Join Our Divine Community
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          color: "#6B7280",
          fontSize: { xs: "13px", md: "14px" },
          lineHeight: 1.55,
          mb: { xs: 2.25, md: 3 },
          "@media (max-height: 740px)": {
            mb: 2,
          },
          "@media (max-height: 660px)": {
            fontSize: "12.5px",
            mb: 1.5,
          },
          maxWidth: "380px",
        }}
      >
        Create an account to book authentic pooja services, track your bookings,
        and stay connected with divine traditions.
      </Typography>

      {/* 3 Benefit Highlights with soft orange rounded icon boxes */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1.6, md: 2 },
          "@media (max-height: 740px)": {
            gap: 1.5,
          },
          "@media (max-height: 660px)": {
            gap: 1.2,
          },
        }}
      >
        {[
          {
            icon: (
              <SpaOutlinedIcon
                sx={{ fontSize: { xs: 20, md: 22 }, color: "#FF6200" }}
              />
            ),
            title: "Verified Vedic Purohits & Scholars",
          },
          {
            icon: (
              <CalendarMonthOutlinedIcon
                sx={{ fontSize: { xs: 20, md: 22 }, color: "#FF6200" }}
              />
            ),
            title: "Live & Instant Pooja Status Updates",
          },
          {
            icon: (
              <ShieldOutlinedIcon
                sx={{ fontSize: { xs: 20, md: 22 }, color: "#FF6200" }}
              />
            ),
            title: "100% Sacred, Transparent & Secure",
          },
        ].map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, md: 1.75 },
            }}
          >
            <Box
              sx={{
                width: { xs: 40, md: 44 },
                height: { xs: 40, md: 44 },
                "@media (max-height: 660px)": {
                  width: 36,
                  height: 36,
                },
                borderRadius: "12px",
                bgcolor: "rgba(255, 120, 20, 0.1)",
                border: "1px solid rgba(255, 120, 20, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 6px rgba(255, 98, 0, 0.08)",
              }}
            >
              {item.icon}
            </Box>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: { xs: "13.5px", md: "14.5px" },
                "@media (max-height: 660px)": {
                  fontSize: "13px",
                },
                fontWeight: 600,
                color: "#1F1A17",
                lineHeight: 1.35,
              }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}


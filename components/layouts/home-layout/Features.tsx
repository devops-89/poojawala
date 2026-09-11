"use client";
import headphone from "@/public/images/home/hero/headphone.webp";
import lock from "@/public/images/home/hero/lock.webp";
import righttick from "@/public/images/home/hero/righttick.webp";
import { Box, Container, Typography } from "@mui/material";

const features = [
  {
    icon: righttick,
    title: "Trusted Purohit",
    subtitle: "Verified & Experienced",
  },
  {
    icon: lock,
    title: "Secure Booking",
    subtitle: "Safe & Reliable",
  },
  {
    icon: headphone,
    title: "24/7 Support",
    subtitle: "Here For You",
  },
];

export default function Features() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(255, 225, 195, 0.95) 0%, rgba(255, 255, 255, 1) 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: { xs: "space-around", md: "space-between" },
            alignItems: "flex-start",
            gap: { xs: 1, md: 2 },
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: { xs: 1, md: 2 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Box
                component="img"
                src={typeof feature.icon === 'string' ? feature.icon : feature.icon.src}
                alt={feature.title}
                sx={{
                  width: { xs: 32, md: 40 },
                  height: { xs: 32, md: 40 },
                  objectFit: "contain",
                }}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#1A1A1A",
                    lineHeight: 1.2,
                    fontSize: { xs: "13px", sm: "14px", md: "16px" },
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontSize: { xs: "11px", sm: "12px", md: "14px" },
                  }}
                >
                  {feature.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

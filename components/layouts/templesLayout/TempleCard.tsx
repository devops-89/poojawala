"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { TempleItem } from "@/utils/types";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { stripHtml } from "@/utils/helpers";

const FALLBACK_TEMPLE_IMAGE = "/images/home/poojaPackages/satyanarayan.webp";

interface TempleCardProps {
  temple: TempleItem;
}

export default function TempleCard({ temple }: TempleCardProps) {
  const router = useRouter();

  const imageUrl =
    temple.downloadUrl || temple.imageUrl || FALLBACK_TEMPLE_IMAGE;

  const handleCardClick = () => {
    if (!temple?.id) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    router.push(`/temples/${temple.slug || temple.id}`);
  };

  const fullLocation = [temple.address, temple.city, temple.state]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(", ");

  const cleanDescription = stripHtml(temple.description);

  return (
    <Card
      onClick={handleCardClick}
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        border: "1.5px solid #EFE6D5",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 36px rgba(255, 98, 0, 0.15)",
          borderColor: "#FFD9C2",
          "& .temple-img": {
            transform: "scale(1.08)",
          },
          "& .temple-cta-btn": {
            bgcolor: COLORS.PRIMARY,
            color: "#FFFFFF",
          },
        },
      }}
    >
      {/* Top Image Container - Clean Without Duplicate Location Overlay */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "220px",
          overflow: "hidden",
          bgcolor: "#F7F3EB",
        }}
      >
        <Box
          className="temple-img"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {/* Subtle Dark Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
          }}
        />
      </Box>

      {/* Card Content Section */}
      <CardContent
        sx={{
          p: { xs: 2.5, sm: 3 },
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "#FFFDF9",
        }}
      >
        <Box sx={{ mb: 2 }}>
          {/* Sacred Temple Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
              bgcolor: "#FFF0E6",
              color: COLORS.PRIMARY,
              px: 1.2,
              py: 0.35,
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              mb: 1.2,
            }}
          >
            <TempleHinduIcon sx={{ fontSize: 13 }} />
            <span>Sacred Temple</span>
          </Box>

          {/* Temple Name */}
          <Typography
            component="h3"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: { xs: "18px", sm: "20px" },
              color: "#2C1810",
              mb: 0.8,
              lineHeight: 1.3,
            }}
          >
            {temple.name}
          </Typography>

          {/* Single Consolidated Location under Name */}
          {fullLocation && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.6,
                color: "#64748b",
                fontSize: "13px",
                fontFamily: FONTS.OUTFIT,
                mb: 1.2,
              }}
            >
              <LocationOnIcon
                sx={{
                  fontSize: 16,
                  color: COLORS.PRIMARY,
                  mt: "2px",
                  flexShrink: 0,
                }}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: "13px",
                  color: "#64748b",
                  fontWeight: 500,
                  fontFamily: FONTS.OUTFIT,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {fullLocation}
              </Typography>
            </Box>
          )}

          {/* Description */}
          {cleanDescription && (
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "13px",
                color: "#5C4A40",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {cleanDescription}
            </Typography>
          )}
        </Box>

        {/* Bottom CTA Button */}
        <Box sx={{ mt: "auto", pt: 1 }}>
          <Button
            className="temple-cta-btn"
            variant="outlined"
            fullWidth
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: "#FF6200",
              color: COLORS.PRIMARY,
              borderRadius: "28px",
              py: 1,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13.5px",
              fontFamily: FONTS.OUTFIT,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: COLORS.PRIMARY,
                color: "#FFFFFF",
                borderColor: COLORS.PRIMARY,
              },
            }}
          >
            Explore Temple Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

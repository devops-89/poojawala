"use client";
import React, { useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { stripHtml } from "@/utils/helpers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const FALLBACK_TEMPLE_IMAGE = "/images/home/poojaPackages/satyanarayan.webp";

interface CustomerTempleCardProps {
  temple: any;
}

export default function CustomerTempleCard({ temple }: CustomerTempleCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    if (temple?.id || temple?.slug) {
      router.push(`/customer/temple/${temple.slug || temple.id}`);
    }
  };

  const handleBookPoojaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (temple?.id || temple?.slug) {
      router.push(`/customer/temple/${temple.slug || temple.id}#temple-services-section`);
    }
  };

  const rawImage =
    temple?.downloadUrl ||
    temple?.imageUrl ||
    temple?.bannerDownloadUrl ||
    temple?.bannerUrl ||
    temple?.image ||
    "";
  const isLogo = !rawImage || rawImage.includes("1Poojalogo") || rawImage.includes("logo");
  const imageUrl = isLogo || imgError ? FALLBACK_TEMPLE_IMAGE : rawImage;

  const templeTitle = temple?.name || "Sacred Temple";

  const locationText = [temple?.city, temple?.state]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(", ");

  const cleanDescription = stripHtml(temple?.description);

  return (
    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex" }}>
      <Paper
        elevation={0}
        onClick={handleCardClick}
        sx={{
          width: "100%",
          p: { xs: 2, sm: 2.25 },
          borderRadius: "20px",
          border: "1.5px solid #EFE6D5",
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 2.25 },
          alignItems: "stretch",
          cursor: "pointer",
          transition: "all 0.25s ease-in-out",
          boxShadow: "0 2px 10px rgba(44, 24, 16, 0.04)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 12px 28px -6px rgba(44, 24, 16, 0.10)",
            borderColor: "#FFD4BC",
            "& .temple-img": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        {/* Left: Image Container */}
        <Box
          sx={{
            width: { xs: "100%", sm: 175, md: 190 },
            height: { xs: 180, sm: 170 },
            borderRadius: "14px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: "#FAF7F4",
            border: "1px solid #EFE6D5",
            position: "relative",
          }}
        >
          <Box
            component="img"
            className="temple-img"
            src={imageUrl}
            alt={templeTitle}
            onError={() => setImgError(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
          />

          {/* Deity Badge */}
          {temple?.deity && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(4px)",
                borderRadius: "8px",
                px: 1,
                py: 0.25,
                display: "flex",
                alignItems: "center",
                gap: 0.4,
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                zIndex: 2,
              }}
            >
              <TempleHinduIcon sx={{ fontSize: 13, color: COLORS.PRIMARY }} />
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: FONTS.OUTFIT,
                  color: COLORS.PRIMARY,
                  letterSpacing: "0.3px",
                }}
              >
                {temple.deity}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right: Info Area */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
            minWidth: 0,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: { xs: "16px", sm: "17.5px" },
                color: "#2C1810",
                mb: 0.5,
                lineHeight: 1.3,
              }}
            >
              {templeTitle}
            </Typography>

            {locationText ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mb: 1 }}>
                <LocationOnIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12.5px",
                    color: "#64748B",
                    fontWeight: 500,
                  }}
                >
                  {locationText}
                </Typography>
              </Box>
            ) : temple?.address ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mb: 1 }}>
                <LocationOnIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12.5px",
                    color: "#64748B",
                    fontWeight: 500,
                  }}
                >
                  {temple.address}
                </Typography>
              </Box>
            ) : null}

            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12.5px",
                color: "#7C6A60",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              {cleanDescription || "Sacred pilgrimage destination and holy temple offering traditional Vedic rituals."}
            </Typography>
          </Box>

          {/* Action CTAs */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              width: "100%",
              mt: "auto",
              pt: 1.25,
              borderTop: "1px dashed #EFE6D5",
            }}
          >
            <Button
              variant="contained"
              onClick={handleCardClick}
              endIcon={<ArrowForwardIcon sx={{ fontSize: "15px !important" }} />}
              sx={{
                flex: { xs: 1, sm: "initial" },
                bgcolor: COLORS.PRIMARY,
                color: "#ffffff",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: { xs: "12.5px", sm: "13px" },
                textTransform: "none",
                borderRadius: "30px",
                px: { xs: 1.5, sm: 2.5 },
                py: 0.75,
                boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
                "&:hover": {
                  bgcolor: COLORS.PRIMARY_DARK,
                  boxShadow: "0 6px 16px rgba(255, 98, 0, 0.35)",
                },
              }}
            >
              View Temple
            </Button>

            <Button
              variant="outlined"
              onClick={handleBookPoojaClick}
              startIcon={<AutoAwesomeIcon sx={{ fontSize: "14px !important" }} />}
              sx={{
                flex: { xs: 1, sm: "initial" },
                color: COLORS.PRIMARY,
                borderColor: COLORS.PRIMARY,
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: { xs: "12.5px", sm: "13px" },
                textTransform: "none",
                borderRadius: "30px",
                px: { xs: 1.5, sm: 2.25 },
                py: 0.7,
                "&:hover": {
                  borderColor: COLORS.PRIMARY_DARK,
                  bgcolor: "#FFF0E6",
                },
              }}
            >
              Book Pooja
            </Button>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}

"use client";
import React from "react";
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

  const handleCardClick = () => {
    if (temple?.id || temple?.slug) {
      router.push(`/customer/temple/${temple.slug || temple.id}`);
    }
  };

  const handleBookPujaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (temple?.id || temple?.slug) {
      router.push(`/customer/temple/${temple.slug || temple.id}#temple-services-section`);
    }
  };

  const imageUrl =
    temple?.downloadUrl ||
    temple?.imageUrl ||
    temple?.bannerDownloadUrl ||
    temple?.bannerUrl ||
    FALLBACK_TEMPLE_IMAGE;

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
          p: 2.5,
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2.5,
          alignItems: { xs: "center", sm: "flex-start" },
          cursor: "pointer",
          transition: "all 0.25s ease-in-out",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 12px 28px -8px rgba(0,0,0,0.08)",
            borderColor: "#cbd5e1",
            "& .temple-img": {
              transform: "scale(1.06)",
            },
          },
        }}
      >
        {/* Left: Image */}
        <Box
          sx={{
            width: { xs: "100%", sm: 160, md: 180 },
            height: { xs: 200, sm: 155 },
            borderRadius: "14px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: "#FFF8F2",
            position: "relative",
          }}
        >
          <Box
            component="img"
            className="temple-img"
            src={imageUrl}
            alt={templeTitle}
            onError={(e: any) => {
              e.target.src = FALLBACK_TEMPLE_IMAGE;
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
          />
        </Box>

        {/* Right: Info */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#1e293b",
                mb: 0.5,
                lineHeight: 1.3,
              }}
            >
              {templeTitle}
            </Typography>

            {locationText ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {locationText}
                </Typography>
              </Box>
            ) : temple?.address ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {temple.address}
                </Typography>
              </Box>
            ) : null}

            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "13px",
                color: "#64748b",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 2,
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
              gap: 1.5,
              flexWrap: "wrap",
              mt: "auto",
              pt: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={handleCardClick}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "#ffffff",
                fontFamily: FONTS.PRIMARY,
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "none",
                borderRadius: "10px",
                px: 2.2,
                py: 0.7,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#e65800",
                  boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
                },
              }}
            >
              View Temple
            </Button>

            <Button
              variant="outlined"
              onClick={handleBookPujaClick}
              startIcon={<AutoAwesomeIcon sx={{ fontSize: "16px !important" }} />}
              sx={{
                color: COLORS.PRIMARY,
                borderColor: COLORS.PRIMARY,
                fontFamily: FONTS.PRIMARY,
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "none",
                borderRadius: "10px",
                px: 2,
                py: 0.65,
                "&:hover": {
                  borderColor: "#e65800",
                  bgcolor: "rgba(255, 98, 0, 0.04)",
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

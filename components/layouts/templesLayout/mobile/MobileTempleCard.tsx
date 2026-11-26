"use client";

import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { normalizePoojaText, stripHtml } from "@/utils/helpers";
import { TempleItem } from "@/utils/types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button, Card, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const FALLBACK_TEMPLE_IMAGE = "/images/home/poojaPackages/satyanarayan.webp";

interface MobileTempleCardProps {
  temple: TempleItem;
}

const MobileTempleCard = ({ temple }: MobileTempleCardProps) => {
  const router = useRouter();

  const imageUrl =
    temple.downloadUrl || temple.imageUrl || FALLBACK_TEMPLE_IMAGE;
  const displayTitle = normalizePoojaText(temple.name || "Sacred Temple");
  const fullLocation = [temple.city, temple.state]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(", ");
  const cleanDescription =
    normalizePoojaText(stripHtml(temple.description)) ||
    "Consecrated Hindu temple with authentic Vedic poojas and traditions.";

  const navigateToDetails = () => {
    if (!temple?.id && !temple?.slug) return;
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    router.push(`/temples/${temple.slug || temple.id}`);
  };

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigateToDetails();
  };

  return (
    <Card
      elevation={0}
      onClick={navigateToDetails}
      sx={{
        width: "100%",
        borderRadius: "20px",
        border: `1px solid ${COLORS.BORDER_LIGHT}`,
        bgcolor: COLORS.WHITE,
        boxShadow: "0 4px 16px rgba(44, 24, 16, 0.05)",
        p: 1.5,
        cursor: "pointer",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          borderColor: COLORS.GOLD_MEDIUM,
          boxShadow: "0 8px 24px rgba(184, 134, 11, 0.1)",
        },
      }}
    >
      {/* Top Row: Thumbnail + Info */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 112,
            height: 112,
            flexShrink: 0,
            borderRadius: "14px",
            overflow: "hidden",
            bgcolor: COLORS.CREAM_LIGHT,
            border: `1px solid ${COLORS.BORDER_LIGHT}`,
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={displayTitle}
            loading="lazy"
            decoding="async"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="h3"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: "16.5px",
              color: COLORS.TEXT_DARK,
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {displayTitle}
          </Typography>

          {fullLocation && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.4,
                mt: 0.45,
                mb: 0.45,
              }}
            >
              <LocationOnIcon
                sx={{
                  fontSize: 15,
                  color: COLORS.PRIMARY,
                  flexShrink: 0,
                }}
              />
              <Typography
                component="span"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: COLORS.GOLD_DARK,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {fullLocation}
              </Typography>
            </Box>
          )}

          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "12.5px",
              color: COLORS.TEXT_SECONDARY,
              lineHeight: 1.45,
              mt: fullLocation ? 0.2 : 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {cleanDescription}
          </Typography>
        </Box>
      </Box>

      {/* Bottom Action Buttons */}
      <Box sx={{ display: "flex", gap: 1.25, mt: 1.5 }}>
        <Button
          variant="outlined"
          startIcon={
            <InfoOutlinedIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
          }
          onClick={handleActionClick}
          sx={{
            flex: 1,
            minWidth: 0,
            border: `1.5px solid ${COLORS.PRIMARY}`,
            color: COLORS.PRIMARY,
            bgcolor: COLORS.BG_CREAM,
            borderRadius: "14px",
            py: 0.85,
            px: 1,
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: FONTS.OUTFIT,
            textTransform: "none",
            whiteSpace: "nowrap",
            "& .MuiButton-startIcon": { mr: 0.5 },
            "&:hover": {
              bgcolor: COLORS.LIGHT_BG_HOVER,
              borderColor: COLORS.PRIMARY_HOVER,
            },
          }}
        >
          View Details
        </Button>

        <Button
          variant="contained"
          disableElevation
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          onClick={handleActionClick}
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: COLORS.PRIMARY,
            color: COLORS.WHITE,
            borderRadius: "14px",
            py: 0.85,
            px: 1,
            fontSize: "13px",
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
            textTransform: "none",
            whiteSpace: "nowrap",
            boxShadow: `0 4px 14px ${COLORS.PRIMARY_SHADOW}`,
            "& .MuiButton-endIcon": { ml: 0.5 },
            "&:hover": {
              bgcolor: COLORS.PRIMARY_HOVER,
            },
          }}
        >
          Explore Temple
        </Button>
      </Box>
    </Card>
  );
};

export default React.memo(MobileTempleCard);

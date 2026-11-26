"use client";

import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { normalizePoojaText } from "@/utils/helpers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { formatTempleLocation, formatTempleTime } from "./templeDetailsHelpers";

interface MobileTempleHeroProps {
  temple: any;
  heroImage: string;
}

const MobileTempleHero = ({ temple, heroImage }: MobileTempleHeroProps) => {
  const router = useRouter();
  const displayTitle = normalizePoojaText(temple?.name || "Sacred Temple");
  const fullLocation = formatTempleLocation(temple);
  const timingText =
    temple?.openingTime || temple?.closingTime
      ? [
          formatTempleTime(temple?.openingTime),
          formatTempleTime(temple?.closingTime),
        ]
          .filter(Boolean)
          .join(" - ")
      : "";

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/temples");
    }
  };

  return (
    <Box>
      {/* Top Full-Bleed Banner */}
      <Box sx={{ position: "relative", width: "100%", height: "250px" }}>
        <Box
          component="img"
          src={heroImage}
          alt={displayTitle}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Back Button */}
        <IconButton
          aria-label="Go back"
          onClick={handleBack}
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            bgcolor: "rgba(255, 253, 249, 0.92)",
            color: COLORS.TEXT_DARK,
            width: 38,
            height: 38,
            boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
            "&:hover": { bgcolor: COLORS.WHITE },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Sacred Temple Tag */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            px: 1.4,
            py: 0.5,
            borderRadius: "20px",
            bgcolor: "rgba(255, 253, 249, 0.92)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <TempleHinduIcon sx={{ fontSize: 14, color: COLORS.PRIMARY }} />
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "11px",
              fontWeight: 700,
              color: COLORS.PRIMARY,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Sacred Dham
          </Typography>
        </Box>

        {temple?.primaryDeity && (
          <Box
            sx={{
              position: "absolute",
              bottom: 34,
              left: 14,
              px: 1.5,
              py: 0.5,
              borderRadius: "10px",
              bgcolor: "rgba(0, 0, 0, 0.62)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12px",
                fontWeight: 600,
                color: COLORS.WHITE,
              }}
            >
              Sacred Shrine of {temple.primaryDeity}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Overlapping Cream Header Card */}
      <Box
        sx={{
          position: "relative",
          mt: -3,
          bgcolor: COLORS.BG_MAIN,
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          px: 2,
          pt: 2.5,
          pb: 2,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            fontSize: "23px",
            lineHeight: 1.22,
            color: COLORS.TEXT_DARK,
            mb: 1,
          }}
        >
          {displayTitle}
        </Typography>

        {fullLocation && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.6,
              mb: 1.5,
            }}
          >
            <LocationOnIcon
              sx={{
                fontSize: 17,
                color: COLORS.PRIMARY,
                mt: "2px",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "13px",
                fontWeight: 500,
                color: COLORS.TEXT_SECONDARY,
                lineHeight: 1.45,
              }}
            >
              {fullLocation}
            </Typography>
          </Box>
        )}

        {/* Metadata Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.75 }}>
          {temple?.primaryDeity && (
            <Chip
              icon={
                <TempleHinduIcon
                  sx={{ fontSize: "15px !important", color: `${COLORS.PRIMARY} !important` }}
                />
              }
              label={`Deity: ${temple.primaryDeity}`}
              size="small"
              sx={{
                bgcolor: COLORS.CREAM_SOFT,
                border: `1px solid ${COLORS.BORDER_LIGHT}`,
                color: COLORS.TEXT_DARK,
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                fontSize: "12px",
                borderRadius: "10px",
              }}
            />
          )}

          {timingText && (
            <Chip
              icon={
                <AccessTimeIcon
                  sx={{ fontSize: "15px !important", color: `${COLORS.PRIMARY} !important` }}
                />
              }
              label={timingText}
              size="small"
              sx={{
                bgcolor: COLORS.CREAM_SOFT,
                border: `1px solid ${COLORS.BORDER_LIGHT}`,
                color: COLORS.TEXT_DARK,
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                fontSize: "12px",
                borderRadius: "10px",
              }}
            />
          )}
        </Box>

        {/* Compact Trust Badges */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            p: 1.25,
            borderRadius: "14px",
            bgcolor: COLORS.CREAM_LIGHT,
            border: `1px solid ${COLORS.BORDER_LIGHT}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <VerifiedUserIcon
              sx={{ fontSize: 16, color: COLORS.GREEN_SUCCESS }}
            />
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12px",
                fontWeight: 600,
                color: COLORS.TEXT_DARK,
              }}
            >
              Verified Temple Priests
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <VerifiedUserIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12px",
                fontWeight: 600,
                color: COLORS.TEXT_DARK,
              }}
            >
              Consecrated Prasad & Sankalp
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(MobileTempleHero);

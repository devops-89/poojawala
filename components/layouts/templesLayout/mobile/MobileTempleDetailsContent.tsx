"use client";

import WebsiteWhyPoojawalaSection from "@/components/layouts/servicesLayout/WebsiteWhyPoojawalaSection";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { normalizePoojaText } from "@/utils/helpers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import MobileTempleAbout from "./MobileTempleAbout";
import MobileTempleHero from "./MobileTempleHero";
import MobileTempleServices from "./MobileTempleServices";

interface MobileTempleDetailsContentProps {
  temple: any;
  heroImage: string;
  onBookClick: () => void;
}

const MobileTempleDetailsContent = ({
  temple,
  heroImage,
  onBookClick,
}: MobileTempleDetailsContentProps) => {
  const displayTitle = normalizePoojaText(temple?.name || "Sacred Temple");

  return (
    <Box
      sx={{
        bgcolor: COLORS.BG_MAIN,
        minHeight: "100vh",
        pb: 11,
        overflowX: "hidden",
      }}
    >
      <MobileTempleHero temple={temple} heroImage={heroImage} />

      <MobileTempleAbout temple={temple} />

      <MobileTempleServices temple={temple} />

      <Box sx={{ px: 2, borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
        <WebsiteWhyPoojawalaSection />
      </Box>

      {/* Sticky Bottom Booking Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: COLORS.WHITE,
          borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
          boxShadow: "0 -6px 24px rgba(44, 24, 16, 0.08)",
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "11px",
              fontWeight: 700,
              color: COLORS.GOLD_DARK,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Temple Pooja
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "13.5px",
              fontWeight: 700,
              color: COLORS.TEXT_DARK,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayTitle}
          </Typography>
        </Box>

        <Button
          variant="contained"
          disableElevation
          startIcon={<CalendarMonthIcon sx={{ fontSize: 18 }} />}
          onClick={onBookClick}
          sx={{
            flexShrink: 0,
            bgcolor: COLORS.PRIMARY,
            color: COLORS.WHITE,
            borderRadius: "14px",
            px: 2.25,
            py: 1.1,
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "13.5px",
            textTransform: "none",
            boxShadow: `0 4px 14px ${COLORS.PRIMARY_SHADOW}`,
            "&:hover": { bgcolor: COLORS.PRIMARY_HOVER },
          }}
        >
          Book Pooja
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(MobileTempleDetailsContent);

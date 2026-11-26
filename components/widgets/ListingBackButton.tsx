"use client";

import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

interface ListingBackButtonProps {
  variant?: "mobile" | "hero";
  title?: string;
  label?: string;
  fallbackHref?: string;
}

const ListingBackButton = ({
  variant = "hero",
  title,
  label = "Back",
  fallbackHref = "/",
}: ListingBackButtonProps) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }, [router, fallbackHref]);

  if (variant === "mobile") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2,
          pt: 1.25,
          pb: 1.5,
        }}
      >
        <IconButton
          aria-label="Go back"
          onClick={handleBack}
          sx={{
            width: 36,
            height: 36,
            bgcolor: "rgba(255, 255, 255, 0.2)",
            color: COLORS.WHITE,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {title && (
          <Typography
            component="span"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "17px",
              color: COLORS.WHITE,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
      <Button
        onClick={handleBack}
        startIcon={<ArrowBackIcon sx={{ fontSize: 17 }} />}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.16)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          color: COLORS.WHITE,
          borderRadius: "30px",
          px: 2,
          py: 0.65,
          fontFamily: FONTS.OUTFIT,
          fontWeight: 600,
          fontSize: "13px",
          textTransform: "none",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.26)",
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

export default React.memo(ListingBackButton);

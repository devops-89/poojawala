"use client";

import { useUserStore } from "@/stores/userStore";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import {
  createSlug,
  isCustomerLoggedIn,
  normalizePoojaText,
  stripHtml,
} from "@/utils/helpers";
import { ServiceCardProps } from "@/utils/types";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Card, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const formatMobileCardPrice = (price?: string): string => {
  if (!price || price === "0") return "Price on Request";
  const cleanPrice = String(price).replace(/₹/g, "").trim();

  if (cleanPrice.includes("-")) {
    const [rawMin, rawMax] = cleanPrice.split("-");
    const minNum = Number(rawMin.trim());
    const maxNum = Number(rawMax.trim());
    const minStr = !isNaN(minNum)
      ? `₹${minNum.toLocaleString("en-IN")}`
      : `₹${rawMin.trim()}`;
    const maxStr = !isNaN(maxNum)
      ? `₹${maxNum.toLocaleString("en-IN")}`
      : `₹${rawMax.trim()}`;
    return `${minStr} - ${maxStr}`;
  }

  const parsed = Number(cleanPrice);
  return !isNaN(parsed) ? `₹${parsed.toLocaleString("en-IN")}` : `₹${cleanPrice}`;
};

const MobileServiceCard = ({
  id,
  slug,
  title,
  image,
  description,
  price,
}: ServiceCardProps) => {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);

  const displayTitle = normalizePoojaText(title);
  const displayDescription =
    normalizePoojaText(stripHtml(description)) ||
    "Traditional Vedic pooja performed by an experienced Purohit.";
  const formattedPrice = formatMobileCardPrice(price);
  const isRange = formattedPrice.includes("-");

  const navigateToDetails = () => {
    const targetSlug = slug || (title ? createSlug(title) : id);
    if (!targetSlug) return;

    if (typeof window !== "undefined" && id) {
      if (slug) {
        const lower = String(slug).toLowerCase();
        localStorage.setItem(`slug_to_id_${lower}`, String(id));
        sessionStorage.setItem(`slug_to_id_${lower}`, String(id));
        localStorage.setItem(`service_slug_${lower}`, String(id));
        sessionStorage.setItem(`service_slug_${lower}`, String(id));
      }
      const lowerTarget = String(targetSlug).toLowerCase();
      localStorage.setItem(`slug_to_id_${lowerTarget}`, String(id));
      sessionStorage.setItem(`slug_to_id_${lowerTarget}`, String(id));
      localStorage.setItem("last_service_id", String(id));
      sessionStorage.setItem("last_service_id", String(id));
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    const isCustomer = Boolean(
      (profile?.role || "").toUpperCase() === "CUSTOMER" ||
        isCustomerLoggedIn(),
    );
    router.push(
      isCustomer
        ? `/customer/services/${targetSlug}`
        : `/services/${targetSlug}`,
    );
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
            bgcolor: "#FAF4EE",
            border: "1px solid #F3EAD8",
          }}
        >
          <Box
            component="img"
            src={image}
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
              color: "#2C1810",
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {displayTitle}
          </Typography>

          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "12.5px",
              color: COLORS.TEXT_SECONDARY,
              lineHeight: 1.45,
              mt: 0.4,
              mb: 0.9,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayDescription}
          </Typography>

          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "10.5px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: COLORS.GOLD_DARK,
              textTransform: "uppercase",
              mb: 0.15,
            }}
          >
            {isRange ? "PRICE RANGE" : "STARTING FROM"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              flexWrap: "nowrap",
              gap: 0.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: "15.5px",
                color: COLORS.PRIMARY,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {formattedPrice}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12px",
                fontWeight: 500,
                color: COLORS.TEXT_MUTED,
                whiteSpace: "nowrap",
              }}
            >
              / ceremony
            </Typography>
          </Box>
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
          startIcon={<CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />}
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
            "& .MuiButton-startIcon": { mr: 0.5 },
            "&:hover": {
              bgcolor: COLORS.PRIMARY_HOVER,
            },
          }}
        >
          Book Pooja
        </Button>
      </Box>
    </Card>
  );
};

export default React.memo(MobileServiceCard);

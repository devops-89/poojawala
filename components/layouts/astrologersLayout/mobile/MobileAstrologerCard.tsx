"use client";

import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { AstrologerCardProps } from "../AstrologerCard";

const MobileAstrologerCard = ({
  id,
  title,
  image,
  category = "",
  specializations = [],
  specialization = "",
  language = "",
  experience = "",
  rating = "",
  ratePerMinute,
  astrologyPrice,
  city = "",
  state = "",
}: AstrologerCardProps) => {
  const router = useRouter();

  const specList =
    Array.isArray(specializations) && specializations.length > 0
      ? specializations
      : specialization
        ? specialization
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

  const rawPrice =
    astrologyPrice !== undefined &&
    astrologyPrice !== null &&
    astrologyPrice !== ""
      ? astrologyPrice
      : ratePerMinute;
  const numPrice = Number(rawPrice);
  const hasPrice =
    rawPrice != null && rawPrice !== "" && !isNaN(numPrice) && numPrice > 0;

  const numRating = Number(rating);
  const hasRating =
    !isNaN(numRating) &&
    numRating > 0 &&
    String(rating).toLowerCase() !== "new";
  const displayRating = hasRating ? numRating.toFixed(1) : null;

  const initials =
    title
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "A";

  const locationText = [city, state].filter(Boolean).join(", ");
  const subtitleText =
    specList.slice(0, 2).join(" • ") || category || "Vedic Astrologer";

  const handleNavigate = () => {
    const targetUrl = `/customer/astrologers/${id}`;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("post_login_redirect", targetUrl);
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("customercsrftoken");
      const user = sessionStorage.getItem("user");
      if (token || user) {
        router.push(targetUrl);
        return;
      }
    }
    router.push(`/sign-in?redirect=${encodeURIComponent(targetUrl)}`);
  };

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleNavigate();
  };

  return (
    <Card
      elevation={0}
      onClick={handleNavigate}
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
      {/* Top Row: Avatar + Details */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        <Box
          sx={{
            position: "relative",
            width: 96,
            height: 96,
            flexShrink: 0,
          }}
        >
          <Avatar
            src={image || undefined}
            alt={title}
            variant="rounded"
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "16px",
              border: `1.5px solid ${COLORS.BORDER_LIGHT}`,
              background: `linear-gradient(135deg, ${COLORS.PRIMARY} 0%, ${COLORS.RED_DARK} 100%)`,
              color: COLORS.WHITE,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: "26px",
            }}
          >
            {initials}
          </Avatar>

          {displayRating && (
            <Box
              sx={{
                position: "absolute",
                bottom: -6,
                left: "50%",
                transform: "translateX(-50%)",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.3,
                bgcolor: COLORS.WHITE,
                border: `1px solid ${COLORS.BORDER_LIGHT}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                px: 0.9,
                py: 0.15,
                borderRadius: "12px",
              }}
            >
              <StarIcon sx={{ fontSize: 12, color: "#F59E0B" }} />
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: COLORS.TEXT_DARK,
                }}
              >
                {displayRating}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Name + Verified */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
            <Typography
              component="h3"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: "16px",
                color: COLORS.TEXT_DARK,
                lineHeight: 1.25,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>
            <VerifiedIcon
              sx={{ color: "#0284C7", fontSize: 16, flexShrink: 0 }}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "12px",
              fontWeight: 600,
              color: COLORS.GOLD_DARK,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 0.6,
            }}
          >
            {subtitleText}
          </Typography>

          {/* Compact Metadata */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
              mb: 0.75,
            }}
          >
            {experience && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
                <WorkspacePremiumIcon
                  sx={{ fontSize: 14, color: COLORS.PRIMARY }}
                />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "11.5px",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  {experience}
                </Typography>
              </Box>
            )}

            {language && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.35,
                  minWidth: 0,
                }}
              >
                <LanguageIcon sx={{ fontSize: 14, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "11.5px",
                    color: COLORS.TEXT_SECONDARY,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "120px",
                  }}
                >
                  {language}
                </Typography>
              </Box>
            )}

            {locationText && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.35,
                  minWidth: 0,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 14, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "11.5px",
                    color: COLORS.TEXT_MUTED,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {locationText}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Consultation Price */}
          {hasPrice && (
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  fontSize: "15.5px",
                  color: COLORS.PRIMARY,
                }}
              >
                ₹{numPrice.toLocaleString("en-IN")}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "11.5px",
                  fontWeight: 500,
                  color: COLORS.TEXT_MUTED,
                }}
              >
                / consultation
              </Typography>
            </Box>
          )}
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
          View Profile
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
          Consult Now
        </Button>
      </Box>
    </Card>
  );
};

export default React.memo(MobileAstrologerCard);

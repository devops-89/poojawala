"use client";
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import TranslateIcon from "@mui/icons-material/Translate";
import CallIcon from "@mui/icons-material/Call";
import VerifiedIcon from "@mui/icons-material/Verified";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useRouter } from "next/navigation";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface CustomerAstrologerCardProps {
  astrologer: any;
}

const parseList = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === "string" ? item.trim() : String(item)))
      .filter(Boolean);
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((s) => String(s).trim()).filter(Boolean);
      }
    } catch {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [val.trim()];
  }
  return [];
};

export default function CustomerAstrologerCard({
  astrologer,
}: CustomerAstrologerCardProps) {
  const router = useRouter();
  const profile = astrologer?.astrologerProfile || astrologer?.profile || {};

  const handleCardClick = () => {
    if (astrologer?.id) {
      router.push(`/customer/astrologers/${astrologer.id}`);
    }
  };

  // 1. Name
  const fullName =
    `${astrologer?.firstName || ""} ${astrologer?.lastName || ""}`.trim() ||
    astrologer?.username ||
    "Vedic Astrologer";

  // 2. Specializations & Languages
  const specializations = parseList(
    profile?.specializations || profile?.specialization
  );
  const languages = parseList(profile?.languages || profile?.language);

  // 3. Qualifications & Specification
  const qualifications = parseList(
    profile?.qualification || profile?.qualifications
  );
  const primaryQualification = qualifications[0] || "";
  const specification = profile?.specification || "";

  // 4. Experience
  const expYears = profile?.experienceYears ?? profile?.experience;
  const experience = expYears ? `${expYears}+ Yrs Exp` : "Experienced";

  // 5. Astrology Price
  const rawPrice =
    profile?.astrologyPrice ??
    astrologer?.astrologyPrice ??
    profile?.ratePerMinute ??
    astrologer?.ratePerMinute;
  const priceDisplay =
    rawPrice != null && rawPrice !== ""
      ? `₹${Number(rawPrice).toFixed(2)}`
      : "₹0.00";

  // 6. Location
  const city = profile?.city || astrologer?.city || "";
  const state = profile?.state || astrologer?.state || "";
  const locationText = [city, state].filter(Boolean).join(", ");

  // 7. Rating (only show if > 0)
  const numRating = Number(astrologer?.avgRating || profile?.avgRating || 0);
  const hasRating = !isNaN(numRating) && numRating > 0;
  const rating = hasRating ? numRating.toFixed(1) : null;

  // 8. Profile Image
  const imageSrc =
    astrologer?.profileImage ||
    astrologer?.image ||
    profile?.profileImage ||
    "";

  return (
    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex" }}>
      <Paper
        elevation={0}
        onClick={handleCardClick}
        sx={{
          width: "100%",
          p: { xs: 2, sm: 2.5 },
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
            borderColor: "#fed7aa",
          },
        }}
      >
        {/* Left: Avatar / Profile Image */}
        <Box
          sx={{
            width: { xs: 130, sm: 150 },
            height: { xs: 130, sm: 150 },
            borderRadius: "16px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: "#FFF8F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #fed7aa",
            position: "relative",
          }}
        >
          {imageSrc ? (
            <Box
              component="img"
              src={imageSrc}
              alt={fullName}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "#ea580c",
                fontSize: "2.4rem",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
          )}

          {/* Rating Badge - Only shown when avgRating > 0 */}
          {hasRating && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(4px)",
                borderRadius: "8px",
                px: 0.9,
                py: 0.2,
                display: "flex",
                alignItems: "center",
                gap: 0.3,
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              }}
            >
              <StarIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 800,
                  fontFamily: FONTS.OUTFIT,
                  color: "#1e293b",
                }}
              >
                {rating}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right: Astrologer Details & Consultation Action */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Header Info */}
          <Box sx={{ mb: 1 }}>
            {/* Name + Verified + Experience Badge */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1,
                mb: 0.3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, flexWrap: "wrap" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    color: "#1e293b",
                    fontSize: "1.15rem",
                    lineHeight: 1.25,
                  }}
                >
                  {fullName}
                </Typography>
                <Tooltip title="Verified Vedic Astrologer">
                  <VerifiedIcon sx={{ fontSize: 18, color: "#0284c7" }} />
                </Tooltip>
              </Box>

              <Chip
                icon={<SchoolIcon sx={{ fontSize: "14px !important", color: "#c2410c" }} />}
                label={experience}
                size="small"
                sx={{
                  bgcolor: "#ffedd5",
                  color: "#c2410c",
                  fontWeight: 700,
                  fontSize: "11px",
                  height: 22,
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
              />
            </Box>

            {/* Specification / Domain Subtitle */}
            {specification && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <AutoAwesomeIcon sx={{ fontSize: 13, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: COLORS.PRIMARY,
                  }}
                >
                  {specification}
                </Typography>
              </Box>
            )}

            {/* Meta tags: Qualification & Location */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1, mt: 0.5 }}>
              {primaryQualification && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <SchoolIcon sx={{ fontSize: 14, color: "#64748b" }} />
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "12px",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    {primaryQualification}
                  </Typography>
                </Box>
              )}

              {locationText && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                  <LocationOnIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    {locationText}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Specialization Chips */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mb: 1 }}>
              {specializations.length > 0 ? (
                specializations.slice(0, 4).map((spec, i) => (
                  <Chip
                    key={i}
                    label={spec}
                    size="small"
                    sx={{
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#334155",
                      fontSize: "11px",
                      fontWeight: 600,
                      height: 22,
                      borderRadius: "6px",
                    }}
                  />
                ))
              ) : (
                <Chip
                  label="Vedic Astrology"
                  size="small"
                  sx={{
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#334155",
                    fontSize: "11px",
                    fontWeight: 600,
                    height: 22,
                    borderRadius: "6px",
                  }}
                />
              )}
            </Box>

            {/* Languages */}
            {languages.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TranslateIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "11.5px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {languages.join(", ")}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Rate & Consultation Button Footer */}
          <Box sx={{ mt: "auto", pt: 1.5, borderTop: "1px dashed #e2e8f0" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 1.2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                  }}
                >
                  ASTROLOGY PRICE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    color: COLORS.PRIMARY,
                    fontSize: "17px",
                  }}
                >
                  {priceDisplay}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              startIcon={<CallIcon sx={{ fontSize: 18 }} />}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              sx={{
                background: COLORS.PRIMARY,
                color: "white",
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
                py: 0.9,
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                "&:hover": {
                  background: COLORS.PRIMARY_DARK,
                  boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
                },
              }}
            >
              Consult Now
            </Button>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}

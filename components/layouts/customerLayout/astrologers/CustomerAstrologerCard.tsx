"use client";
import React, { useState } from "react";
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

const capitalizeName = (str?: string): string => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function CustomerAstrologerCard({
  astrologer,
}: CustomerAstrologerCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const profile = astrologer?.astrologerProfile || astrologer?.profile || {};

  const handleCardClick = () => {
    if (astrologer?.id) {
      router.push(`/customer/astrologers/${astrologer.id}`);
    }
  };

  // 1. Name with capitalized first & last name
  const fName = capitalizeName(astrologer?.firstName);
  const lName = capitalizeName(astrologer?.lastName);
  const fullName =
    [fName, lName].filter(Boolean).join(" ") ||
    capitalizeName(astrologer?.username) ||
    "Vedic Astrologer";

  // 2. Specializations & Languages (NO static fallback)
  const specializations = parseList(
    profile?.specializations || profile?.specialization
  );
  const languages = parseList(profile?.languages || profile?.language);

  // 3. Qualifications & Specification (NO static fallback)
  const qualifications = parseList(
    profile?.qualification || profile?.qualifications
  );
  const primaryQualification = qualifications[0] || "";
  const specification = profile?.specification || "";

  // 4. Experience (NO static fallback)
  const expYears = profile?.experienceYears ?? profile?.experience;
  const experience = expYears ? `${expYears}+ Yrs Exp` : "";

  // 5. Astrology Price (NO fake fallback)
  const rawPrice =
    profile?.astrologyPrice ??
    astrologer?.astrologyPrice ??
    profile?.ratePerMinute ??
    astrologer?.ratePerMinute;
  const numPrice = Number(rawPrice);
  const hasPrice =
    rawPrice != null && rawPrice !== "" && !isNaN(numPrice) && numPrice > 0;
  const priceDisplay = hasPrice ? `₹${numPrice.toLocaleString("en-IN")}` : null;

  // 6. Location (NO static fallback)
  const city = profile?.city || astrologer?.city || "";
  const state = profile?.state || astrologer?.state || "";
  const locationText = [city, state].filter(Boolean).join(", ");

  // 7. Rating (only show if > 0)
  const numRating = Number(astrologer?.avgRating || profile?.avgRating || 0);
  const hasRating = !isNaN(numRating) && numRating > 0;
  const rating = hasRating ? numRating.toFixed(1) : null;

  // 8. Profile Image (NO placeholder images)
  const rawImage =
    astrologer?.profileImage ||
    astrologer?.image ||
    profile?.profileImage ||
    profile?.avatar ||
    "";
  const isLogo = !rawImage || rawImage.includes("1Poojalogo") || rawImage.includes("logo");
  const imageSrc = isLogo ? "" : rawImage;

  // Initials for avatar
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "A";

  return (
    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex" }}>
      <Paper
        elevation={0}
        onClick={handleCardClick}
        sx={{
          width: "100%",
          p: { xs: 2, sm: 2.5 },
          borderRadius: "20px",
          border: "1.5px solid #EFE6D5",
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.75, sm: 2.25 },
          alignItems: "stretch",
          cursor: "pointer",
          transition: "all 0.25s ease-in-out",
          boxShadow: "0 2px 10px rgba(44, 24, 16, 0.04)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 12px 28px -6px rgba(44, 24, 16, 0.10)",
            borderColor: "#FFD4BC",
          },
        }}
      >
        {/* On Mobile: Avatar + Header Info Row | On Desktop: Just Avatar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.75,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {/* Avatar Box */}
          <Box
            sx={{
              width: { xs: 84, sm: 140 },
              height: { xs: 84, sm: 140 },
              borderRadius: { xs: "14px", sm: "16px" },
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: "#FAF7F4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #FFD4BC",
              position: "relative",
            }}
          >
            {imageSrc && !imgError ? (
              <Box
                component="img"
                src={imageSrc}
                alt={fullName}
                onError={() => setImgError(true)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #FFF0E6 0%, #FFE2D1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  fontWeight: 800,
                  fontFamily: FONTS.OUTFIT,
                  color: COLORS.PRIMARY,
                  userSelect: "none",
                }}
              >
                {initials}
              </Box>
            )}

            {/* Rating Badge */}
            {hasRating && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: 4, sm: 8 },
                  left: { xs: 4, sm: 8 },
                  bgcolor: "rgba(255, 255, 255, 0.96)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "6px",
                  px: 0.7,
                  py: 0.15,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.3,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}
              >
                <StarIcon sx={{ fontSize: 11, color: "#f59e0b" }} />
                <Typography
                  sx={{
                    fontSize: "11px",
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

          {/* Mobile-only Header Info (Sits right next to 84px avatar) */}
          <Box sx={{ display: { xs: "block", sm: "none" }, flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  color: "#2C1810",
                  fontSize: "16px",
                  lineHeight: 1.25,
                }}
              >
                {fullName}
              </Typography>
              <VerifiedIcon sx={{ fontSize: 16, color: "#0284c7" }} />
            </Box>

            {/* Experience chip + Specification on Mobile */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 0.5 }}>
              {experience && (
                <Chip
                  icon={<SchoolIcon sx={{ fontSize: "11px !important", color: "#c2410c" }} />}
                  label={experience}
                  size="small"
                  sx={{
                    bgcolor: "#ffedd5",
                    color: "#c2410c",
                    fontWeight: 700,
                    fontSize: "10.5px",
                    height: 20,
                    borderRadius: "6px",
                  }}
                />
              )}
              {specification && (
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
              )}
            </Box>

            {/* Location & Qualification on Mobile */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
              {primaryQualification && (
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11.5px", color: "#64748b", fontWeight: 500 }}>
                  {primaryQualification}
                </Typography>
              )}
              {primaryQualification && locationText && (
                <Typography sx={{ color: "#cbd5e1", fontSize: "11px" }}>•</Typography>
              )}
              {locationText && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                  <LocationOnIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11.5px", color: "#64748b" }}>
                    {locationText}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Right Details on Desktop / Lower Content on Mobile */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Header Info (Visible only on sm up, hidden on mobile) */}
          <Box sx={{ display: { xs: "none", sm: "block" }, mb: 1 }}>
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
                    color: "#2C1810",
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

              {experience && (
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
              )}
            </Box>

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

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1, mt: 0.5 }}>
              {primaryQualification && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <SchoolIcon sx={{ fontSize: 14, color: "#64748b" }} />
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "12px", color: "#475569", fontWeight: 600 }}>
                    {primaryQualification}
                  </Typography>
                </Box>
              )}

              {locationText && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                  <LocationOnIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                    {locationText}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Specializations & Languages */}
          <Box sx={{ mb: { xs: 1.25, sm: 1.5 } }}>
            {specializations.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mb: 0.75 }}>
                {specializations.slice(0, 4).map((spec, i) => (
                  <Chip
                    key={i}
                    label={spec}
                    size="small"
                    sx={{
                      bgcolor: "#FAF7F4",
                      border: "1px solid #EFE6D5",
                      color: "#4A3B32",
                      fontSize: { xs: "10.5px", sm: "11px" },
                      fontWeight: 600,
                      height: { xs: 20, sm: 22 },
                      borderRadius: "6px",
                    }}
                  />
                ))}
              </Box>
            )}

            {languages.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TranslateIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "11.5px",
                    color: "#7C6A60",
                    fontWeight: 500,
                  }}
                >
                  {languages.join(", ")}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Rate & Consultation Button Footer */}
          <Box
            sx={{
              mt: "auto",
              pt: 1.25,
              borderTop: "1px dashed #EFE6D5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
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
                  fontFamily: FONTS.OUTFIT,
                  lineHeight: 1,
                  mb: 0.25,
                }}
              >
                {hasPrice ? "ASTROLOGY FEE" : "CONSULTATION"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  color: COLORS.PRIMARY,
                  fontSize: { xs: "16px", sm: "18px" },
                  lineHeight: 1.2,
                }}
              >
                {hasPrice ? priceDisplay : "Free Booking"}
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<CallIcon sx={{ fontSize: "16px !important" }} />}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              sx={{
                background: COLORS.PRIMARY,
                color: "white",
                textTransform: "none",
                borderRadius: "30px",
                fontWeight: 700,
                fontSize: { xs: "13px", sm: "14px" },
                px: { xs: 2.25, sm: 3 },
                py: { xs: 0.7, sm: 0.85 },
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                fontFamily: FONTS.OUTFIT,
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

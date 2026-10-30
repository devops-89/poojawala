"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { stripHtml } from "@/utils/helpers";

interface WebsiteTempleAboutSectionProps {
  temple: any;
}

const formatTime = (timeStr?: string | null) => {
  if (!timeStr) return "";
  const parts = String(timeStr).split(":");
  if (parts.length >= 2) {
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    if (isNaN(h)) return timeStr;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h < 10 ? "0" + h : h}:${m} ${ampm}`;
  }
  return timeStr;
};

const parseAartis = (aartisRaw: any): any[] => {
  let list: any[] = [];
  if (Array.isArray(aartisRaw)) {
    list = aartisRaw;
  } else if (typeof aartisRaw === "string") {
    try {
      const parsed = JSON.parse(aartisRaw);
      if (Array.isArray(parsed)) list = parsed;
    } catch {}
  }
  return list.filter((a: any) => a && !a.isDeleted && (a.name || a.time));
};

export default function WebsiteTempleAboutSection({
  temple,
}: WebsiteTempleAboutSectionProps) {
  const cleanDescription = stripHtml(temple?.description);
  const sentences = cleanDescription ? cleanDescription.split(". ") : [];
  let para1 = cleanDescription;
  let para2 = "";

  if (sentences.length > 2) {
    const midIndex = Math.ceil(sentences.length / 2);
    para1 =
      sentences.slice(0, midIndex).join(". ") +
      (sentences.slice(0, midIndex).join(". ").endsWith(".") ? "" : ".");
    para2 = sentences.slice(midIndex).join(". ");
  }

  const aartiList = parseAartis(temple?.aartis);
  const hasVisitingHours = Boolean(temple?.openingTime || temple?.closingTime);
  const hasAartis = aartiList.length > 0;
  const showTimingsCard = hasVisitingHours || hasAartis;

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, borderTop: "1px solid #F3E8DB" }}>
      {/* 1. Main About & Spiritual Heritage Section */}
      <Box sx={{ mb: showTimingsCard ? { xs: 4, md: 5 } : 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 1,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: { xs: "24px", md: "32px" },
              color: "#2C1810",
            }}
          >
            About {temple?.name}
          </Typography>

          {temple?.primaryDeity && (
            <Chip
              icon={<TempleHinduIcon sx={{ fontSize: 16, color: "#C2410C !important" }} />}
              label={`Presiding Deity: ${temple.primaryDeity}`}
              sx={{
                bgcolor: "#FFF7ED",
                color: "#C2410C",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
                fontSize: "13px",
                border: "1px solid #FFEDD5",
                py: 2,
                px: 1,
                borderRadius: "20px",
              }}
            />
          )}
        </Box>

        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: "13.5px",
            color: "#8C7A6B",
            mb: 2.5,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Divine Legend & Spiritual Heritage
        </Typography>

        {cleanDescription ? (
          <Box>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: { xs: "14.5px", md: "15.5px" },
                color: "#475569",
                lineHeight: 1.85,
                mb: para2 ? 2 : 0,
              }}
            >
              {para1}
            </Typography>
            {para2 && (
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: "14.5px", md: "15.5px" },
                  color: "#475569",
                  lineHeight: 1.85,
                }}
              >
                {para2}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "15px",
              color: "#64748b",
              lineHeight: 1.8,
            }}
          >
            {temple?.name} is a sacred spiritual pilgrimage destination situated in{" "}
            {[temple?.address, temple?.city, temple?.state].filter(Boolean).join(", ") || "India"}.
            Devotees visit this revered shrine to seek divine blessings, participate in daily
            aartis, and experience peace and spiritual grace.
          </Typography>
        )}
      </Box>

      {/* 2. Visiting Hours & Daily Aartis Card */}
      {showTimingsCard && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: "24px",
            border: "1.5px solid #FFEDD5",
            bgcolor: "#FFFFFF",
            boxShadow: "0 4px 24px rgba(255, 98, 0, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Card Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                bgcolor: "#FFF7ED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.PRIMARY,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "#1E293B",
                }}
              >
                Visiting Hours & Daily Aartis
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13px",
                  color: "#64748B",
                }}
              >
                Daily schedule for temple visiting hours and consecrated aartis
              </Typography>
            </Box>
          </Box>

          {/* Temple Opening / Closing Times */}
          {hasVisitingHours && (
            <Grid container spacing={2}>
              {temple?.openingTime && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2.2,
                      borderRadius: "16px",
                      bgcolor: "#FFFDF9",
                      border: "1.5px solid #FED7AA",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <WbSunnyIcon sx={{ color: "#EA580C", fontSize: 30 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#9A3412",
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                        }}
                      >
                        Temple Opening
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#1E293B",
                        }}
                      >
                        {formatTime(temple.openingTime)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {temple?.closingTime && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2.2,
                      borderRadius: "16px",
                      bgcolor: "#FFFDF9",
                      border: "1.5px solid #FED7AA",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <BedtimeIcon sx={{ color: "#7C3AED", fontSize: 30 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#5B21B6",
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                        }}
                      >
                        Temple Closing
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#1E293B",
                        }}
                      >
                        {formatTime(temple.closingTime)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}

          {/* Aarti Schedule List */}
          {hasAartis && (
            <Box>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "#C2410C",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  mb: 1.5,
                }}
              >
                Daily Aarti Schedule
              </Typography>

              <Grid container spacing={2}>
                {aartiList.map((aarti: any, index: number) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={aarti.id || index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        borderRadius: "14px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "#FFF7ED",
                          borderColor: "#FED7AA",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <NotificationsActiveIcon
                          sx={{ fontSize: 20, color: COLORS.PRIMARY }}
                        />
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#1E293B",
                          }}
                        >
                          {aarti.name || "Daily Aarti"}
                        </Typography>
                      </Box>

                      <Chip
                        label={formatTime(aarti.time)}
                        size="medium"
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 700,
                          fontSize: "13.5px",
                          bgcolor: "#FFFFFF",
                          color: "#EA580C",
                          border: "1px solid #FDBA74",
                          borderRadius: "10px",
                          px: 1,
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}

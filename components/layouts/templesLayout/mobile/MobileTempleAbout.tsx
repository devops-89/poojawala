"use client";

import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { normalizePoojaText, stripHtml } from "@/utils/helpers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { formatTempleTime, parseTempleAartis } from "./templeDetailsHelpers";

interface MobileTempleAboutProps {
  temple: any;
}

const MobileTempleAbout = ({ temple }: MobileTempleAboutProps) => {
  const [expanded, setExpanded] = useState(false);

  const cleanDescription =
    normalizePoojaText(stripHtml(temple?.description)) ||
    `${temple?.name || "This temple"} is a sacred spiritual pilgrimage destination situated in ${
      [temple?.address, temple?.city, temple?.state].filter(Boolean).join(", ") ||
      "India"
    }. Devotees visit this revered shrine to seek divine blessings, participate in daily aartis, and experience spiritual grace.`;

  const shouldTruncate = cleanDescription.length > 220;
  const aartiList = parseTempleAartis(temple?.aartis);
  const hasVisitingHours = Boolean(temple?.openingTime || temple?.closingTime);
  const showTimingsCard = hasVisitingHours || aartiList.length > 0;

  return (
    <Box sx={{ px: 2, py: 2.5, borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          fontSize: "19px",
          color: COLORS.TEXT_DARK,
          mb: 0.4,
        }}
      >
        About {normalizePoojaText(temple?.name || "Temple")}
      </Typography>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontSize: "12.5px",
          fontWeight: 500,
          color: COLORS.TEXT_MUTED,
          mb: 1.5,
        }}
      >
        Divine Legend & Spiritual Heritage
      </Typography>

      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontSize: "13.5px",
          color: COLORS.TEXT_SECONDARY,
          lineHeight: 1.65,
          ...(!expanded && shouldTruncate
            ? {
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : {}),
        }}
      >
        {cleanDescription}
      </Typography>

      {shouldTruncate && (
        <Button
          size="small"
          onClick={() => setExpanded((prev) => !prev)}
          sx={{
            mt: 0.5,
            p: 0,
            minWidth: 0,
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "13px",
            color: COLORS.PRIMARY,
            textTransform: "none",
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          {expanded ? "Show Less" : "Read More"}
        </Button>
      )}

      {showTimingsCard && (
        <Paper
          elevation={0}
          sx={{
            mt: 2.5,
            p: 2,
            borderRadius: "20px",
            border: `1px solid ${COLORS.BORDER_LIGHT}`,
            bgcolor: COLORS.WHITE,
            boxShadow: "0 4px 16px rgba(44, 24, 16, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                bgcolor: COLORS.CREAM_SOFT,
                border: `1px solid ${COLORS.BORDER_LIGHT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.PRIMARY,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "16px",
                  color: COLORS.TEXT_DARK,
                }}
              >
                Visiting Hours & Daily Aartis
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "12px",
                  color: COLORS.TEXT_MUTED,
                }}
              >
                Daily darshan & aarti schedule
              </Typography>
            </Box>
          </Box>

          {hasVisitingHours && (
            <Box sx={{ display: "flex", gap: 1.25 }}>
              {temple?.openingTime && (
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: "14px",
                    bgcolor: COLORS.BG_MAIN,
                    border: `1px solid ${COLORS.BORDER_LIGHT}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <WbSunnyIcon sx={{ color: COLORS.PRIMARY, fontSize: 22 }} />
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "10.5px",
                        fontWeight: 700,
                        color: COLORS.GOLD_DARK,
                        textTransform: "uppercase",
                      }}
                    >
                      Opening
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "14.5px",
                        fontWeight: 700,
                        color: COLORS.TEXT_DARK,
                      }}
                    >
                      {formatTempleTime(temple.openingTime)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {temple?.closingTime && (
                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: "14px",
                    bgcolor: COLORS.BG_MAIN,
                    border: `1px solid ${COLORS.BORDER_LIGHT}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <BedtimeIcon sx={{ color: COLORS.SECONDARY, fontSize: 22 }} />
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "10.5px",
                        fontWeight: 700,
                        color: COLORS.SECONDARY,
                        textTransform: "uppercase",
                      }}
                    >
                      Closing
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "14.5px",
                        fontWeight: 700,
                        color: COLORS.TEXT_DARK,
                      }}
                    >
                      {formatTempleTime(temple.closingTime)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {aartiList.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: COLORS.GOLD_DARK,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Daily Aarti Schedule
              </Typography>

              {aartiList.map((aarti: any, index: number) => (
                <Box
                  key={aarti.id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    p: 1.25,
                    borderRadius: "12px",
                    bgcolor: COLORS.BG_CREAM,
                    border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <NotificationsActiveIcon
                      sx={{ fontSize: 18, color: COLORS.PRIMARY }}
                    />
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: COLORS.TEXT_DARK,
                      }}
                    >
                      {aarti.name || "Daily Aarti"}
                    </Typography>
                  </Box>

                  <Chip
                    label={formatTempleTime(aarti.time)}
                    size="small"
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: "12px",
                      bgcolor: COLORS.WHITE,
                      color: COLORS.PRIMARY,
                      border: `1px solid ${COLORS.LIGHT_BORDER}`,
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default React.memo(MobileTempleAbout);

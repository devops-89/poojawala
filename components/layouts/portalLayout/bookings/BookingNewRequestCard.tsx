"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React from "react";
import { Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EventIcon from "@mui/icons-material/Event";
import TimerIcon from "@mui/icons-material/Timer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamIcon from "@mui/icons-material/Videocam";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

interface BookingNewRequestCardProps {
  req: {
    id: number | string;
    customer: string;
    ritual: string;
    date: string;
    time: string;
    location: string;
    distance?: string;
    duration: string;
    urgency?: string;
    price: string;
    plan?: string;
    bookingMode?: string;
    originalData?: any;
  };
  onRespond: (bookingId: number | string, action: "ACCEPT" | "DISMISS") => void;
}

export const BookingNewRequestCard: React.FC<BookingNewRequestCardProps> = ({
  req,
  onRespond,
}) => {
  const rawData = req.originalData || req;
  const bookingId = rawData?.id || req.id;
  const rawPlan = (req.plan || req.originalData?.plan || "").toString().toUpperCase();
  const isStandard = rawPlan.includes("STANDARD");
  const planLabel = rawPlan ? (isStandard ? "STANDARD PLAN" : "BASIC PLAN") : null;
  const bookingMode = (req.bookingMode || rawData?.bookingMode || "").toString().toUpperCase();
  const isOnline = bookingMode === "ONLINE" || (Boolean(req.location) && req.location.toLowerCase().includes("online"));

  // Extract selected add-on features (no price shown to purohit)
  const selectedAddons: string[] = [];
  if (Array.isArray(rawData?.priceBreakDown?.selectedFeatures)) {
    rawData.priceBreakDown.selectedFeatures.forEach((f: any) => {
      const t = f?.title || f?.name;
      if (t && !selectedAddons.includes(t)) selectedAddons.push(t);
    });
  }
  if (Array.isArray(rawData?.customFields?.selectedAddons)) {
    rawData.customFields.selectedAddons.forEach((t: any) => {
      const title = typeof t === "string" ? t : t?.title || t?.name;
      if (title && !selectedAddons.includes(title)) selectedAddons.push(title);
    });
  }
  if (Array.isArray(rawData?.selectedFeatures)) {
    rawData.selectedFeatures.forEach((f: any) => {
      const t = typeof f === "string" ? f : f?.title || f?.name;
      if (t && !selectedAddons.includes(t)) selectedAddons.push(t);
    });
  }
  if (Array.isArray(rawData?.features)) {
    rawData.features.forEach((f: any) => {
      const t = typeof f === "string" ? f : f?.title || f?.name;
      if (t && !selectedAddons.includes(t)) selectedAddons.push(t);
    });
  }

  // Extract standard carry items
  const carryItems: string[] = [];
  if (Array.isArray(rawData?.service?.purohitCarryItems)) {
    rawData.service.purohitCarryItems.forEach((item: any) => {
      if (typeof item === "string" && item.trim() && !carryItems.includes(item.trim())) {
        carryItems.push(item.trim());
      }
    });
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: { xs: "16px", sm: "20px" },
        border: "1.5px solid #FFEDD5",
        bgcolor: "#FFFFFF",
        mb: { xs: 2, sm: 2.5, md: 3 },
        boxShadow: "0 4px 20px rgba(255,98,0,0.06)",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(255,98,0,0.12)",
          borderColor: "#FED7AA",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: { xs: "17px", sm: "19px", md: "20px" },
                color: "#1E293B",
                lineHeight: 1.25,
              }}
            >
              {req.ritual}
            </Typography>
            {planLabel && (
              <Chip
                label={planLabel}
                size="small"
                sx={{
                  bgcolor: isStandard ? "#F0FDF4" : "#FFF8F5",
                  color: isStandard ? "#16A34A" : COLORS.PRIMARY,
                  border: isStandard ? "1px solid #BBF7D0" : "1px solid #FFD8C2",
                  fontWeight: 700,
                  fontSize: "11px",
                  height: "22px",
                  borderRadius: "6px",
                }}
              />
            )}
            {bookingMode && bookingMode !== "ONLINE" && (
              <Chip
                label={bookingMode}
                size="small"
                sx={{
                  bgcolor: bookingMode === "OFFLINE" ? "#FEF3C7" : "#E0F2FE",
                  color: bookingMode === "OFFLINE" ? "#92400E" : "#0369A1",
                  border: bookingMode === "OFFLINE" ? "1px solid #FDE68A" : "1px solid #BAE6FD",
                  fontWeight: 700,
                  fontSize: "11px",
                  height: "22px",
                  borderRadius: "6px",
                  letterSpacing: "0.5px",
                }}
              />
            )}
            {req.urgency === "High" && (
              <Chip
                label="High Urgency"
                size="small"
                icon={<BoltIcon sx={{ fontSize: "14px !important" }} />}
                sx={{
                  bgcolor: "#FEF2F2",
                  color: "#DC2626",
                  fontWeight: 700,
                  fontSize: "11px",
                  height: "22px",
                  borderRadius: "6px",
                  border: "1px solid #FECACA",
                }}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#64748B",
                fontSize: "13.5px",
              }}
            >
              Client: <span style={{ fontWeight: 700, color: "#1E293B" }}>{req.customer}</span>
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: "6px",
                bgcolor: "#FFF7ED",
                border: "1px solid #FFEDD5",
                fontSize: "11.5px",
                fontWeight: 700,
                color: COLORS.PRIMARY,
                fontFamily: "monospace",
              }}
            >
              #B-{bookingId}
            </Box>
          </Box>
        </Box>

        {/* Payout Hero Highlight */}
        <Box
          sx={{
            textAlign: { xs: "left", sm: "right" },
            p: { xs: 1, sm: 1.25 },
            bgcolor: "#FFF7ED",
            borderRadius: "12px",
            border: "1px solid #FFEDD5",
            minWidth: { sm: "110px" },
          }}
        >
          <Typography
            sx={{
              fontSize: "10.5px",
              fontWeight: 700,
              color: "#9A3412",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Est. Payout
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "20px", sm: "22px" },
              color: COLORS.PRIMARY,
              lineHeight: 1.1,
            }}
          >
            {req.price}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: "#F1F5F9" }} />

      {/* Details 3-Box Grid: Schedule, Duration, Location */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        {/* Schedule */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "rgba(255, 98, 0, 0.1)",
              color: COLORS.PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <EventIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#64748B",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              Schedule
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#1E293B",
                lineHeight: 1.3,
              }}
            >
              {req.date}, {req.time}
            </Typography>
          </Box>
        </Box>

        {/* Duration */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "rgba(255, 98, 0, 0.1)",
              color: COLORS.PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TimerIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#64748B",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              Duration
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#1E293B",
                lineHeight: 1.3,
              }}
            >
              {req.duration}
            </Typography>
          </Box>
        </Box>

        {/* Location */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            gridColumn: { xs: "1", sm: "span 2", md: "span 1" },
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: isOnline ? "#EFF6FF" : "#EFF6FF",
              color: "#0284C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isOnline ? (
              <VideocamIcon sx={{ fontSize: 20 }} />
            ) : (
              <LocationOnIcon sx={{ fontSize: 20 }} />
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#64748B",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {isOnline ? "Mode" : "Location"}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "13px",
                fontWeight: 600,
                color: "#1E293B",
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {req.location && req.location !== "N/A"
                ? req.location
                : isOnline
                ? "Online (Video Call)"
                : "Address Pending"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {(selectedAddons.length > 0 || carryItems.length > 0) && (
        <Box
          sx={{
            mb: 2.5,
            p: { xs: 1.5, sm: 2 },
            bgcolor: "#FFFDF5",
            borderRadius: "14px",
            border: "1px dashed #FCD34D",
          }}
        >
          {selectedAddons.length > 0 && (
            <Box sx={{ mb: carryItems.length > 0 ? 1.5 : 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}>
                <InventoryIcon sx={{ fontSize: 16, color: "#D97706" }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#92400E",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Customer Selected Add-ons (Bring with you):
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedAddons.map((addon, idx) => (
                  <Chip
                    key={idx}
                    label={addon}
                    size="small"
                    sx={{
                      bgcolor: "#FEF3C7",
                      color: "#92400E",
                      border: "1px solid #FDE68A",
                      fontWeight: 700,
                      fontSize: "12px",
                      height: "26px",
                      borderRadius: "6px",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {carryItems.length > 0 && (
            <Box sx={{ mt: selectedAddons.length > 0 ? 1.5 : 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}>
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: "#4B5563" }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#4B5563",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Standard Samagri to Carry:
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {carryItems.map((item, idx) => (
                  <Chip
                    key={idx}
                    label={item}
                    size="small"
                    sx={{
                      bgcolor: "#F3F4F6",
                      color: "#374151",
                      border: "1px solid #E5E7EB",
                      fontWeight: 600,
                      fontSize: "12px",
                      height: "26px",
                      borderRadius: "6px",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={() => onRespond(bookingId, "DISMISS")}
          sx={{
            color: "#475569",
            borderColor: "#CBD5E1",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "14px",
            borderRadius: "10px",
            py: { xs: 1.1, sm: 1.2 },
            minHeight: 44,
            "&:hover": {
              bgcolor: "#F8FAFC",
              borderColor: "#94A3B8",
            },
          }}
        >
          Decline
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onRespond(bookingId, "ACCEPT")}
          sx={{
            background: COLORS.PRIMARY,
            color: "white",
            textTransform: "none",
            fontWeight: 800,
            fontSize: "14px",
            borderRadius: "10px",
            py: { xs: 1.1, sm: 1.2 },
            minHeight: 44,
            boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
            "&:hover": {
              background: COLORS.PRIMARY_DARK,
              boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
            },
          }}
        >
          Accept Booking
        </Button>
      </Box>
    </Paper>
  );
};

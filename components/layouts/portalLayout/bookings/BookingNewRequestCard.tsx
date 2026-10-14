"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React from "react";
import { Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EventIcon from "@mui/icons-material/Event";
import TimerIcon from "@mui/icons-material/Timer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
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
      sx={{
        p: 3,
        borderRadius: "12px",
        border: "1px solid #FFE0D0",
        bgcolor: "#FFF",
        mb: 3,
        boxShadow: "0 2px 12px rgba(255,98,0,0.05)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "18px",
                color: "#1A1A1A",
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
            {bookingMode && (
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
                  bgcolor: "#FFF0F0",
                  color: "#D32F2F",
                  fontWeight: 700,
                  fontSize: "11px",
                  height: "22px",
                  border: "1px solid #FFCDD2",
                }}
              />
            )}
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#666",
              fontSize: "14px",
            }}
          >
            Client: <span style={{ fontWeight: 600 }}>{req.customer}</span> • B-
            {bookingId}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            fontSize: "22px",
            color: COLORS.PRIMARY,
          }}
        >
          {req.price}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
          <Box>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#999",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Schedule
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "14px",
                fontWeight: 600,
                color: "#333",
              }}
            >
              {req.date}, {req.time}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TimerIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
          <Box>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#999",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Duration
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "14px",
                fontWeight: 600,
                color: "#333",
              }}
            >
              {req.duration}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            minWidth: 0,
          }}
        >
          <LocationOnIcon
            sx={{
              color: COLORS.PRIMARY,
              fontSize: 18,
              flexShrink: 0,
              mt: 0.2,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#999",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Location
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "14px",
                fontWeight: 600,
                color: "#333",
                wordBreak: "break-word",
              }}
            >
              {req.location}
            </Typography>
          </Box>
        </Box>
      </Box>

      {(selectedAddons.length > 0 || carryItems.length > 0) && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "#FFFDF5",
            borderRadius: "10px",
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
                      fontWeight: 500,
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

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onRespond(bookingId, "ACCEPT")}
          sx={{
            background: COLORS.PRIMARY,
            color: "white",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "8px",
            py: 1.2,
            boxShadow: "none",
            "&:hover": { background: COLORS.PRIMARY_DARK },
          }}
        >
          Accept Booking
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => onRespond(bookingId, "DISMISS")}
          sx={{
            color: "#666",
            borderColor: "#ccc",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            py: 1.2,
          }}
        >
          Decline
        </Button>
      </Box>
    </Paper>
  );
};

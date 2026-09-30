"use client";

import React from "react";
import { Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EventIcon from "@mui/icons-material/Event";
import TimerIcon from "@mui/icons-material/Timer";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
    originalData?: any;
  };
  onRespond: (bookingId: number | string, action: "ACCEPT" | "DISMISS") => void;
}

export const BookingNewRequestCard: React.FC<BookingNewRequestCardProps> = ({
  req,
  onRespond,
}) => {
  const bookingId = req.originalData?.id || req.id;
  const rawPlan = (req.plan || req.originalData?.plan || "").toString().toUpperCase();
  const isStandard = rawPlan.includes("STANDARD");
  const planLabel = rawPlan ? (isStandard ? "STANDARD PLAN" : "BASIC PLAN") : null;

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
                fontFamily: "var(--font-outfit), sans-serif",
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
                  color: isStandard ? "#16A34A" : "#FF6200",
                  border: isStandard ? "1px solid #BBF7D0" : "1px solid #FFD8C2",
                  fontWeight: 700,
                  fontSize: "11px",
                  height: "22px",
                  borderRadius: "6px",
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
              fontFamily: "var(--font-outfit), sans-serif",
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
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 800,
            fontSize: "22px",
            color: "#FF6200",
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
          <EventIcon sx={{ color: "#FF6200", fontSize: 18 }} />
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
                fontFamily: "var(--font-outfit), sans-serif",
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
          <TimerIcon sx={{ color: "#FF6200", fontSize: 18 }} />
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
                fontFamily: "var(--font-outfit), sans-serif",
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
              color: "#FF6200",
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
                fontFamily: "var(--font-outfit), sans-serif",
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

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onRespond(bookingId, "ACCEPT")}
          sx={{
            background: "#FF6200",
            color: "white",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "8px",
            py: 1.2,
            boxShadow: "none",
            "&:hover": { background: "#F05A00" },
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

"use client";

import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

interface ServiceDetailsCityInquiryCardProps {
  onOpenInquiry?: () => void;
  onOpenInquiryModal?: () => void;
  // Optional backwards-compatibility props
  serviceCityNamesText?: string;
  userCitiesText?: string;
  onOpenAddAddress?: () => void;
  onOpenAddAddressModal?: () => void;
}

export default function ServiceDetailsCityInquiryCard({
  onOpenInquiry,
  onOpenInquiryModal,
}: ServiceDetailsCityInquiryCardProps) {
  const handleInquiry = onOpenInquiryModal || onOpenInquiry || (() => {});

  return (
    <Box sx={{ maxWidth: "840px", mx: "auto", py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4.5 },
          borderRadius: "20px",
          background: "linear-gradient(135deg, #FFF9F5 0%, #FFF2E8 100%)",
          border: "1.5px dashed #FFBE98",
          boxShadow: "0 8px 30px rgba(255, 98, 0, 0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "14px",
              bgcolor: "rgba(255, 98, 0, 0.12)",
              color: COLORS.PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LocationOnIcon sx={{ fontSize: 30 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: { xs: "22px", sm: "26px" },
                color: "#2C1810",
                mb: 1.2,
              }}
            >
              Service Not Available at Your Location
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "14.5px",
                color: "#64534A",
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              This offline Vedic ritual is currently not available at your saved location.
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "14px",
                color: "#786558",
                lineHeight: 1.5,
              }}
            >
              Have questions, want to request this puja in your city, or need a custom date? Send us an inquiry and our divine coordination team will assist you!
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            pt: 1,
          }}
        >
          <Button
            type="button"
            variant="contained"
            onClick={handleInquiry}
            startIcon={<ChatBubbleOutlineOutlinedIcon />}
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "#FFFFFF",
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              fontSize: "15px",
              borderRadius: "12px",
              px: 4,
              py: 1.3,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
              "&:hover": {
                bgcolor: COLORS.PRIMARY_DARK,
              },
            }}
          >
            Get Inquiry
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

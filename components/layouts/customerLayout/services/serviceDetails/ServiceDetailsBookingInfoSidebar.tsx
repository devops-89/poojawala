"use client";

import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

interface ServiceDetailsBookingInfoSidebarProps {
  onOpenInquiry: () => void;
}

export default function ServiceDetailsBookingInfoSidebar({
  onOpenInquiry,
}: ServiceDetailsBookingInfoSidebarProps) {
  return (
    <Grid size={{ xs: 12, md: 5 }}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1.2px",
          color: COLORS.PRIMARY,
          textTransform: "uppercase",
          mb: 1.5,
        }}
      >
        BOOK YOUR POOJA
      </Typography>

      <Typography
        variant="h3"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#2C1810",
          fontSize: { xs: "28px", sm: "36px", md: "40px" },
          lineHeight: 1.2,
          mb: 2.5,
        }}
      >
        Fill in your details to reserve
      </Typography>

      <Typography
        sx={{
          fontFamily: FONTS.PRIMARY,
          color: "#64534A",
          fontSize: "15px",
          lineHeight: 1.7,
          maxWidth: 440,
        }}
      >
        Share your preferred date, time, and requirements. We'll confirm your
        booking within 24 hours — no advance payment needed.
      </Typography>

      {/* Get Inquiry Card Option */}
      <Box
        sx={{
          mt: 4,
          p: 2.5,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #FFF9F5 0%, #FFF2E8 100%)",
          border: "1px dashed #FFBE98",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 440,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: "rgba(255, 98, 0, 0.12)",
              color: COLORS.PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              mt: 0.2,
            }}
          >
            <HelpOutlinedIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                fontSize: "15px",
                color: "#2C1810",
              }}
            >
              Have questions or custom requirements?
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "13px",
                color: "#786558",
                mt: 0.5,
                lineHeight: 1.5,
              }}
            >
              Need a custom date, specific vidhi details, or tailored Samagri? Send us an inquiry.
            </Typography>
          </Box>
        </Box>

        <Button
          type="button"
          variant="outlined"
          onClick={onOpenInquiry}
          startIcon={<ChatBubbleOutlineOutlinedIcon />}
          sx={{
            color: COLORS.PRIMARY,
            borderColor: COLORS.PRIMARY,
            bgcolor: "#FFFFFF",
            fontFamily: FONTS.PRIMARY,
            fontWeight: 700,
            fontSize: "14px",
            borderRadius: "10px",
            px: 2.5,
            py: 0.9,
            textTransform: "none",
            alignSelf: "flex-start",
            boxShadow: "0 2px 6px rgba(255, 98, 0, 0.08)",
            "&:hover": {
              borderColor: COLORS.PRIMARY_DARK,
              bgcolor: "#FFF4ED",
              color: COLORS.PRIMARY_DARK,
            },
          }}
        >
          Get Inquiry
        </Button>
      </Box>
    </Grid>
  );
}

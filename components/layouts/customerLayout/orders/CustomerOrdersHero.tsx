"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";

interface CustomerOrdersHeroProps {
  totalOrders: number;
}

export default function CustomerOrdersHero({
  totalOrders,
}: CustomerOrdersHeroProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <AppBreadcrumbs
        items={[
          { label: "Dashboard", href: "/customer/dashboard" },
          { label: "Orders" },
        ]}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
          mb: 3,
        }}
      >
        {/* Left Section: Title & Subtitle */}
        <Box sx={{ maxWidth: 650 }}>
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: { xs: "11px", sm: "12px" },
              letterSpacing: "1.5px",
              color: COLORS.PRIMARY,
              textTransform: "uppercase",
              mb: 0.8,
            }}
          >
            YOUR SACRED PURCHASES
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "30px", sm: "42px", md: "48px" },
              lineHeight: 1.1,
              mb: 1.5,
            }}
          >
            My{" "}
            <Box
              component="span"
              sx={{
                color: COLORS.PRIMARY,
                fontStyle: "italic",
                fontWeight: 700,
              }}
            >
              Orders
            </Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: "#64534A",
              fontSize: { xs: "13.5px", sm: "16px" },
              lineHeight: 1.6,
            }}
          >
            Every pooja item, every ritual offering — right here, just for you.
            Track, revisit, and reorder with ease.
          </Typography>
        </Box>

        {/* Right Section: Compact Total Orders Counter Card */}
        <Paper
          elevation={0}
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 1.2, sm: 2 },
            bgcolor: "#FFFFFF",
            border: "1px solid #EADCCF",
            borderRadius: "16px",
            textAlign: "center",
            width: { xs: "fit-content", sm: "auto" },
            minWidth: { xs: "auto", sm: 150 },
            alignSelf: { xs: "flex-start", sm: "flex-start" },
            boxShadow: "0 4px 16px rgba(44, 24, 16, 0.03)",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: COLORS.PRIMARY,
              fontSize: { xs: "22px", sm: "36px" },
              lineHeight: 1,
              mb: 0.3,
            }}
          >
            {totalOrders}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: { xs: "10px", sm: "11px" },
              letterSpacing: "0.8px",
              color: "#8C7A70",
              textTransform: "uppercase",
            }}
          >
            TOTAL ORDERS
          </Typography>
        </Paper>
      </Box>

      <Divider sx={{ borderColor: "#EADCCF" }} />
    </Box>
  );
}

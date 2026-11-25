"use client";

import React from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import NextLink from "next/link";
import CustomerServiceCard from "@/components/layouts/customerLayout/services/CustomerServiceCard";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

interface CustomerTempleServicesProps {
  temple: any;
  services: any[];
  servicesLoading: boolean;
}

export default function CustomerTempleServices({
  temple,
  services,
  servicesLoading,
}: CustomerTempleServicesProps) {
  const bookUrl = `/customer/services?templeId=${temple?.id}`;

  return (
    <Box
      id="temple-services-section"
      sx={{ pt: { xs: 1.5, md: 2 }, pb: { xs: 2, md: 3 }, scrollMarginTop: "90px" }}
    >
      {/* Section Title */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: { xs: "18px", md: "21px" },
            color: "#2C1810",
            mb: 0.25,
          }}
        >
          Temple Poojas & Ceremonies
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: "11px",
            color: "#8C7A6B",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
          }}
        >
          Sacred Rituals & Vedic Ceremonies
        </Typography>
      </Box>

      {/* Services List / Grid */}
      {servicesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : services.length > 0 ? (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {services.map((srv: any) => (
            <CustomerServiceCard key={srv.id} service={srv} />
          ))}
        </Grid>
      ) : (
        /* Empty State / Booking Callout */
        <Box
          sx={{
            p: { xs: 2.5, sm: 3.2 },
            borderRadius: "20px",
            bgcolor: "#FAF7F4",
            border: "1.5px dashed #FFD4BC",
            textAlign: "center",
            maxWidth: "540px",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "#FFF0E6",
              border: "1px solid #FFD4BC",
              color: COLORS.PRIMARY,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.2,
            }}
          >
            <TempleHinduIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: { xs: "15.5px", sm: "17px" },
              color: "#2C1810",
              mb: 0.6,
            }}
          >
            Book a Consecrated Pooja at {temple?.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "12.5px", sm: "13px" },
              color: "#64748B",
              lineHeight: 1.55,
              maxWidth: 440,
              mx: "auto",
              mb: 2.2,
            }}
          >
            Looking to perform an Archana, Rudrabhishek, or customized Vedic havan at
            this temple? Browse all authentic pooja packages and schedule a verified Pandit.
          </Typography>
          <Button
            component={NextLink}
            href={bookUrl}
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
            sx={{
              background: COLORS.PRIMARY,
              color: "#FFFFFF",
              borderRadius: "30px",
              px: 3,
              py: 0.9,
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: FONTS.OUTFIT,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.22)",
              "&:hover": {
                background: COLORS.PRIMARY_DARK,
              },
            }}
          >
            Explore & Book Temple Pooja
          </Button>
        </Box>
      )}
    </Box>
  );
}

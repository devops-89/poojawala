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
      sx={{ py: { xs: 5, md: 7 }, borderTop: "1px solid #F3E8DB", scrollMarginTop: "90px" }}
    >
      {/* Section Title */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: FONTS.PRIMARY,
            fontWeight: 800,
            fontSize: { xs: "24px", md: "30px" },
            color: "#2C1810",
            mb: 0.8,
          }}
        >
          Temple Poojas & Ceremonies
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: "14px",
            color: "#8C7A6B",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Sacred Rituals performed at {temple?.name}
        </Typography>
      </Box>

      {/* Services List / Grid */}
      {servicesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : services.length > 0 ? (
        <Grid container spacing={3}>
          {services.map((srv: any) => (
            <CustomerServiceCard key={srv.id} service={srv} />
          ))}
        </Grid>
      ) : (
        /* Empty State / Booking Callout */
        <Box
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: "20px",
            bgcolor: "#FFFDF9",
            border: "1.5px dashed #FED7AA",
            textAlign: "center",
            maxWidth: "700px",
            mx: "auto",
          }}
        >
          <TempleHinduIcon sx={{ fontSize: 44, color: COLORS.PRIMARY, mb: 1.5 }} />
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              fontSize: "20px",
              color: "#2C1810",
              mb: 1,
            }}
          >
            Book a Consecrated Pooja at {temple?.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "14px",
              color: "#64748b",
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            Looking to perform an Archana, Rudrabhishek, or customized Vedic havan at
            this temple? Browse all authentic pooja packages and schedule a verified Pandit.
          </Typography>
          <Button
            component={NextLink}
            href={bookUrl}
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              background: COLORS.PRIMARY,
              color: "#FFFFFF",
              borderRadius: "30px",
              px: 3.5,
              py: 1.2,
              fontWeight: 700,
              fontSize: "14px",
              fontFamily: FONTS.OUTFIT,
              textTransform: "none",
            }}
          >
            Explore & Book Temple Pooja
          </Button>
        </Box>
      )}
    </Box>
  );
}

"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import ServicePlanCard from "./ServicePlanCard";
import ServicePricingSummaryCard from "./ServicePricingSummaryCard";
import ServiceSpecsAvailabilityCard from "./ServiceSpecsAvailabilityCard";

export interface ServiceSpecsPricingCardProps {
  service: any;
}

const formatFeatureName = (key: string) => {
  if (!key) return "";
  if (key.includes(" ")) return key;
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function ServiceSpecsPricingCard({
  service,
}: ServiceSpecsPricingCardProps) {
  // Extract Basic Plan details
  const basicPrice =
    service.plans?.basic?.price ?? service.priceWithoutSamagri ?? service.minPrice ?? 0;
  const basicTokenAmount =
    service.plans?.basic?.tokenAmount ||
    Math.round(Number(basicPrice) * (Number(service.tokenPercentage || 40) / 100));
  const basicPayoutAmount =
    service.plans?.basic?.basicPurohitPayoutAmount ??
    service.plans?.basic?.purohitPayoutAmount ??
    Math.round(
      Number(basicPrice) * (1 - Number(service.commissionPercentage || 10) / 100)
    );

  const rawBasicFeatures =
    service.plans?.basic?.features ||
    (typeof service.plans?.basic === "object" ? service.plans.basic : {});
  const basicFeatureList =
    typeof rawBasicFeatures === "object" && rawBasicFeatures !== null
      ? Object.keys(rawBasicFeatures).filter(
          (k) =>
            k !== "price" &&
            k !== "tokenAmount" &&
            k !== "basicPurohitPayoutAmount" &&
            k !== "standardPurohitPayoutAmount" &&
            k !== "purohitPayoutAmount" &&
            k !== "features" &&
            k !== "bulletPoints"
        )
      : [];

  // Extract Standard Plan details
  const standardPrice =
    service.plans?.standard?.price ?? service.priceWithSamagri ?? service.maxPrice ?? 0;
  const standardTokenAmount =
    service.plans?.standard?.tokenAmount ||
    Math.round(Number(standardPrice) * (Number(service.tokenPercentage || 40) / 100));
  const standardPayoutAmount =
    service.plans?.standard?.standardPurohitPayoutAmount ??
    service.plans?.standard?.purohitPayoutAmount ??
    Math.round(
      Number(standardPrice) * (1 - Number(service.commissionPercentage || 10) / 100)
    );

  const rawStandardFeatures =
    service.plans?.standard?.features ||
    (typeof service.plans?.standard === "object" ? service.plans.standard : {});
  const standardFeatureList =
    typeof rawStandardFeatures === "object" && rawStandardFeatures !== null
      ? Object.keys(rawStandardFeatures).filter(
          (k) =>
            k !== "price" &&
            k !== "tokenAmount" &&
            k !== "basicPurohitPayoutAmount" &&
            k !== "standardPurohitPayoutAmount" &&
            k !== "purohitPayoutAmount" &&
            k !== "features" &&
            k !== "bulletPoints"
        )
      : [];

  // Carry items
  const basicCarryItems: string[] = Array.isArray(service.purohitCarryItems?.basic)
    ? service.purohitCarryItems.basic
    : [];
  const standardCarryItems: string[] = Array.isArray(service.purohitCarryItems?.standard)
    ? service.purohitCarryItems.standard
    : [];

  return (
    <Grid container spacing={4}>
      {/* Specifications & Availability */}
      <Grid size={{ xs: 12, md: 8 }}>
        <ServiceSpecsAvailabilityCard service={service} />
      </Grid>

      {/* Pricing Details Summary */}
      <Grid size={{ xs: 12, md: 4 }}>
        <ServicePricingSummaryCard
          service={service}
          basicPrice={basicPrice}
          standardPrice={standardPrice}
        />
      </Grid>

      {/* Detailed Service Plans & Purohit Carry Items */}
      <Grid size={{ xs: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1e293b",
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 24,
                bgcolor: COLORS.PRIMARY,
                borderRadius: 4,
                display: "inline-block",
              }}
            />
            Service Plans & Purohit Carry Items
          </Typography>

          <Grid container spacing={3}>
            {/* Basic Plan Box */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ServicePlanCard
                planType="basic"
                planBadgeLabel="BASIC PLAN"
                planTitle="Basic Ritual Package"
                price={basicPrice}
                tokenAmount={basicTokenAmount}
                purohitPayoutAmount={basicPayoutAmount}
                featureList={basicFeatureList}
                carryItems={basicCarryItems}
                formatFeatureName={formatFeatureName}
              />
            </Grid>

            {/* Standard Plan Box */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ServicePlanCard
                planType="standard"
                planBadgeLabel="STANDARD PLAN"
                planTitle="Standard Complete Package"
                price={standardPrice}
                tokenAmount={standardTokenAmount}
                purohitPayoutAmount={standardPayoutAmount}
                featureList={standardFeatureList}
                carryItems={standardCarryItems}
                formatFeatureName={formatFeatureName}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

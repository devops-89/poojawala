"use client";

import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

interface ServiceDetailsPaymentOptionProps {
  plans: any;
  service: any;
  selectedPlan: string;
  showAddons: boolean;
  selectedFeatureIds: number[];
  paymentOption: string;
  onChangePaymentOption: (val: string) => void;
}

export default function ServiceDetailsPaymentOption({
  plans,
  service,
  selectedPlan,
  showAddons,
  selectedFeatureIds,
  paymentOption,
  onChangePaymentOption,
}: ServiceDetailsPaymentOptionProps) {
  const currentPlanObj = plans?.[selectedPlan];
  const basePrice = Number(currentPlanObj?.price || 0);

  let currentPlanAddonTotal = 0;
  if (showAddons) {
    const currentRawFeats =
      currentPlanObj?.features ||
      (service?.serviceFeatures
        ? service.serviceFeatures.filter(
            (sf: any) => sf.plan === selectedPlan.toUpperCase(),
          )
        : null);

    if (Array.isArray(currentRawFeats)) {
      currentRawFeats.forEach((f: any, idx: number) => {
        if (f && f.isActive !== false && f.type === "PRICE") {
          const matchedSf = service?.serviceFeatures?.find(
            (sf: any) =>
              sf.id === f.id ||
              (sf.plan === selectedPlan.toUpperCase() &&
                (sf.title || "").trim().toLowerCase() ===
                  (f.title || f.name || "").trim().toLowerCase())
          );
          const fId =
            f.id != null
              ? Number(f.id)
              : matchedSf?.id != null
                ? Number(matchedSf.id)
                : idx + 1;
          if (selectedFeatureIds.includes(fId)) {
            currentPlanAddonTotal += Number(f.value || f.price || 0);
          }
        }
      });
    }
  }

  const totalPrice = basePrice + currentPlanAddonTotal;

  const tokenPercent = Number(
    service?.tokenPercentage ||
      (basePrice > 0 && currentPlanObj?.tokenAmount
        ? Math.round((Number(currentPlanObj.tokenAmount) / basePrice) * 100)
        : 40)
  );

  const tokenAmt = Math.round((totalPrice * tokenPercent) / 100);

  const tokenLabelText =
    tokenAmt > 0
      ? `Token Amount (Advance - ₹${Number(tokenAmt).toLocaleString("en-IN")})`
      : "Token Amount (Advance)";
  const fullLabelText =
    totalPrice > 0
      ? `Full Payment (₹${Number(totalPrice).toLocaleString("en-IN")})`
      : "Full Payment";

  return (
    <FormControl component="fieldset">
      <FormLabel
        component="legend"
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontWeight: 700,
          fontSize: "14px",
          color: "#2C1810",
          mb: 0.5,
          "&.Mui-focused": { color: COLORS.PRIMARY },
        }}
      >
        Payment Option
      </FormLabel>
      <RadioGroup
        row
        name="paymentOption"
        value={paymentOption}
        onChange={(e) => onChangePaymentOption(e.target.value as "TOKEN" | "FULL")}
      >
        <FormControlLabel
          value="TOKEN"
          control={
            <Radio
              sx={{
                color: COLORS.PRIMARY,
                "&.Mui-checked": { color: COLORS.PRIMARY },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "14px",
                fontWeight: 600,
                color: "#2C1810",
              }}
            >
              {tokenLabelText}
            </Typography>
          }
          sx={{ mr: 4 }}
        />
        <FormControlLabel
          value="FULL"
          control={
            <Radio
              sx={{
                color: COLORS.PRIMARY,
                "&.Mui-checked": { color: COLORS.PRIMARY },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "14px",
                fontWeight: 600,
                color: "#2C1810",
              }}
            >
              {fullLabelText}
            </Typography>
          }
        />
      </RadioGroup>
    </FormControl>
  );
}

"use client";

import React from "react";
import {
  Box,
  Chip,
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
  paymentError?: string;
}

export default function ServiceDetailsPaymentOption({
  plans,
  service,
  selectedPlan,
  showAddons,
  selectedFeatureIds,
  paymentOption,
  onChangePaymentOption,
  paymentError,
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

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            bgcolor: COLORS.PRIMARY,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 800,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          {service?.isOnline ? "4" : "5"}
        </Box>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            fontSize: { xs: "15px", sm: "16px" },
            color: "#1A0B05",
          }}
        >
          Select Payment Option
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
        {/* Option 1: Token Amount */}
        <Box
          onClick={() => onChangePaymentOption("TOKEN")}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: "14px",
            border: paymentOption === "TOKEN" ? `2px solid ${COLORS.PRIMARY}` : "1.5px solid #EADCCF",
            bgcolor: paymentOption === "TOKEN" ? "#FFF9F5" : "#FFFFFF",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: paymentOption === "TOKEN" ? "0 4px 14px rgba(255, 98, 0, 0.1)" : "none",
            "&:hover": { borderColor: COLORS.PRIMARY },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: paymentOption === "TOKEN" ? `2px solid ${COLORS.PRIMARY}` : "2px solid #D8C7B8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {paymentOption === "TOKEN" && (
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: COLORS.PRIMARY }} />
                )}
              </Box>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: "14px", color: "#2C1810" }}>
                Pay Advance Token
              </Typography>
            </Box>
            <Chip
              label="Flexible"
              size="small"
              sx={{
                bgcolor: "#FEF3C7",
                color: "#92400E",
                fontWeight: 700,
                fontSize: "10px",
                height: "20px",
                borderRadius: "6px",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "16px", sm: "17px" },
              color: COLORS.PRIMARY,
              ml: 3.5,
              mt: 0.5,
            }}
          >
            ₹{Number(tokenAmt).toLocaleString("en-IN")}
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11.5px", color: "#7A685D", ml: 3.5, mt: 0.3 }}>
            Pay {tokenPercent}% advance now, rest balance after Puja completion
          </Typography>
        </Box>

        {/* Option 2: Full Payment */}
        <Box
          onClick={() => onChangePaymentOption("FULL")}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: "14px",
            border: paymentOption === "FULL" ? `2px solid ${COLORS.PRIMARY}` : "1.5px solid #EADCCF",
            bgcolor: paymentOption === "FULL" ? "#FFF9F5" : "#FFFFFF",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: paymentOption === "FULL" ? "0 4px 14px rgba(255, 98, 0, 0.1)" : "none",
            "&:hover": { borderColor: COLORS.PRIMARY },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: paymentOption === "FULL" ? `2px solid ${COLORS.PRIMARY}` : "2px solid #D8C7B8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {paymentOption === "FULL" && (
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: COLORS.PRIMARY }} />
                )}
              </Box>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: "14px", color: "#2C1810" }}>
                Full Payment
              </Typography>
            </Box>
            <Chip
              label="Instant"
              size="small"
              sx={{
                bgcolor: "#DCFCE7",
                color: "#166534",
                fontWeight: 700,
                fontSize: "10px",
                height: "20px",
                borderRadius: "6px",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "16px", sm: "17px" },
              color: COLORS.PRIMARY,
              ml: 3.5,
              mt: 0.5,
            }}
          >
            ₹{Number(totalPrice).toLocaleString("en-IN")}
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11.5px", color: "#7A685D", ml: 3.5, mt: 0.3 }}>
            Pay complete amount securely in one step
          </Typography>
        </Box>
      </Box>

      {paymentError && (
        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#d32f2f", mt: 0.8, fontSize: "12px", ml: 0.5, fontWeight: 500 }}>
          {paymentError}
        </Typography>
      )}
    </Box>
  );
}

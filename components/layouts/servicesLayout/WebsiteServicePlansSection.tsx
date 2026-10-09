"use client";

import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface WebsiteServicePlansSectionProps {
  service: any;
}

export default function WebsiteServicePlansSection({
  service,
}: WebsiteServicePlansSectionProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>("standard");

  const plans = service?.plans || {};
  const basicPlan = plans?.basic || null;
  const standardPlan = plans?.standard || null;

  // Format camelCase key to Title Case (e.g. "kalashSthapana" -> "Kalash Sthapana")
  const formatKeyName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Helper to extract dynamic features directly from plan object keys or plan.features
  const getDynamicPlanFeatures = (plan: any) => {
    if (!plan || typeof plan !== "object") return [];

    const targetObj =
      plan.features && typeof plan.features === "object"
        ? plan.features
        : plan;

    const result: string[] = [];

    Object.entries(targetObj).forEach(([key, val]) => {
      const lowerKey = key.toLowerCase();
      // Exclude price, tokenAmount, and payout amounts
      if (
        lowerKey === "price" ||
        lowerKey === "tokenamount" ||
        lowerKey.includes("payout")
      ) {
        return;
      }

      const valStr = String(val).trim();
      // Exclude false values
      if (valStr === "false" || val === false) return;

      const formattedKey = formatKeyName(key);

      if (valStr === "true" || val === true) {
        result.push(formattedKey);
      } else {
        result.push(`${formattedKey}: ${valStr}`);
      }
    });

    return result;
  };

  const basicFeatures = getDynamicPlanFeatures(basicPlan);
  const standardFeatures = getDynamicPlanFeatures(standardPlan);

  const handleBookPlan = (planName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    router.push(`/sign-up?from=book-now&serviceId=${service?.id}&plan=${planName}`);
  };

  // If no plans exist in API, don't render section
  if (!basicPlan && !standardPlan) return null;

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, borderTop: "1px solid #F3E8DB" }}>
      {/* Top Header */}
      <Box sx={{ textAlign: "center", maxWidth: "640px", mx: "auto", mb: 5 }}>
        <Typography
          sx={{
            fontFamily: FONTS.PRIMARY,
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1.2px",
            color: COLORS.PRIMARY,
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          CHOOSE YOUR PLAN
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontFamily: FONTS.PRIMARY,
            fontWeight: 800,
            fontSize: { xs: "28px", sm: "36px", md: "40px" },
            color: "#1A0B05",
            mb: 1.5,
          }}
        >
          Pooja Packages
        </Typography>

        <Typography
          sx={{
            fontFamily: FONTS.PRIMARY,
            fontSize: { xs: "14.5px", sm: "16px" },
            color: "#5C4A40",
            lineHeight: 1.6,
          }}
        >
          Both plans include a verified Vedic Pandit — choose the level of
          samagri and ceremony detail that suits your pooja completion.
        </Typography>
      </Box>

      {/* Plans Container Grid */}
      <Grid
        container
        spacing={4}
        sx={{ justifyContent: "center", alignItems: "stretch" }}
      >
        {/* Basic Plan Card */}
        {basicPlan && (
          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <Paper
              elevation={0}
              onClick={() => setSelectedPlan("basic")}
              sx={{
                p: { xs: 3.5, sm: 4.5 },
                borderRadius: "24px",
                border:
                  selectedPlan === "basic"
                    ? "2px solid #FF6200"
                    : "1.5px solid #F3E4D8",
                bgcolor: "#FFFFFF",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                cursor: "pointer",
                boxShadow:
                  selectedPlan === "basic"
                    ? "0 14px 40px rgba(255, 98, 0, 0.14)"
                    : "0 4px 16px rgba(0, 0, 0, 0.02)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: COLORS.PRIMARY,
                  transform: "translateY(-4px)",
                  boxShadow: "0 14px 40px rgba(255, 98, 0, 0.14)",
                },
              }}
            >
              <Box>
                {/* Plan Name */}
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: "26px",
                    color: "#1A0B05",
                    mb: 1.5,
                  }}
                >
                  Basic
                </Typography>

                {/* Price */}
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: { xs: "36px", sm: "42px" },
                    color: COLORS.PRIMARY,
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  ₹ {Number(basicPlan.price || 5100).toLocaleString("en-IN")}
                </Typography>

                <Box sx={{ borderTop: "1px solid #F3E8DB", pt: 3, mb: 4 }}>
                  {/* Features List derived directly from API plan keys */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {basicFeatures.map((feat, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                        }}
                      >
                        <CheckIcon
                          sx={{
                            fontSize: 18,
                            color: COLORS.PRIMARY,
                            mt: 0.2,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "14.5px",
                            color: "#3D2B22",
                            lineHeight: 1.5,
                            fontWeight: 500,
                          }}
                        >
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Action Button */}
              <Button
                variant={selectedPlan === "basic" ? "contained" : "outlined"}
                onClick={(e) => handleBookPlan("basic", e)}
                sx={{
                  bgcolor: selectedPlan === "basic" ? COLORS.PRIMARY : "transparent",
                  borderColor: COLORS.PRIMARY,
                  borderWidth: "1.5px",
                  color: selectedPlan === "basic" ? "#FFFFFF" : COLORS.PRIMARY,
                  width: "100%",
                  py: 1.4,
                  borderRadius: "12px",
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow:
                    selectedPlan === "basic"
                      ? "0 6px 20px rgba(255, 98, 0, 0.3)"
                      : "none",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor: COLORS.PRIMARY_DARK,
                    borderColor: COLORS.PRIMARY_DARK,
                    borderWidth: "1.5px",
                    color: "#FFFFFF",
                  },
                }}
              >
                Book Basic Plan
              </Button>
            </Paper>
          </Grid>
        )}

        {/* Standard Plan Card */}
        {standardPlan && (
          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <Paper
              elevation={0}
              onClick={() => setSelectedPlan("standard")}
              sx={{
                p: { xs: 3.5, sm: 4.5 },
                borderRadius: "24px",
                border:
                  selectedPlan === "standard"
                    ? "2px solid #FF6200"
                    : "1.5px solid #F3E4D8",
                bgcolor: "#FFFFFF",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                position: "relative",
                cursor: "pointer",
                boxShadow:
                  selectedPlan === "standard"
                    ? "0 14px 40px rgba(255, 98, 0, 0.16)"
                    : "0 4px 16px rgba(0, 0, 0, 0.02)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: COLORS.PRIMARY,
                  transform: "translateY(-4px)",
                  boxShadow: "0 18px 45px rgba(255, 98, 0, 0.2)",
                },
              }}
            >
              {/* Highlight Badge for Standard */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bgcolor: selectedPlan === "standard" ? COLORS.PRIMARY : "#E2E8F0",
                  color: selectedPlan === "standard" ? "#FFFFFF" : "#475569",
                  px: 2.5,
                  py: 0.6,
                  borderRadius: "0 22px 0 14px",
                  fontFamily: FONTS.PRIMARY,
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                MOST COMPLETE
              </Box>

              <Box>
                {/* Plan Name */}
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: "26px",
                    color: "#1A0B05",
                    mb: 1.5,
                  }}
                >
                  Standard
                </Typography>

                {/* Price */}
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: { xs: "36px", sm: "42px" },
                    color: COLORS.PRIMARY,
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  ₹ {Number(standardPlan.price || 8100).toLocaleString("en-IN")}
                </Typography>

                <Box sx={{ borderTop: "1px solid #F3E8DB", pt: 3, mb: 4 }}>
                  {/* Features List derived directly from API plan keys */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {standardFeatures.map((feat, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                        }}
                      >
                        <CheckIcon
                          sx={{
                            fontSize: 18,
                            color: COLORS.PRIMARY,
                            mt: 0.2,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "14.5px",
                            color: "#3D2B22",
                            lineHeight: 1.5,
                            fontWeight: 500,
                          }}
                        >
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Action Button */}
              <Button
                variant={selectedPlan === "standard" ? "contained" : "outlined"}
                onClick={(e) => handleBookPlan("standard", e)}
                sx={{
                  bgcolor:
                    selectedPlan === "standard" ? COLORS.PRIMARY : "transparent",
                  borderColor: COLORS.PRIMARY,
                  borderWidth: "1.5px",
                  color: selectedPlan === "standard" ? "#FFFFFF" : COLORS.PRIMARY,
                  width: "100%",
                  py: 1.4,
                  borderRadius: "12px",
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow:
                    selectedPlan === "standard"
                      ? "0 6px 20px rgba(255, 98, 0, 0.3)"
                      : "none",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor: COLORS.PRIMARY_DARK,
                    borderColor: COLORS.PRIMARY_DARK,
                    borderWidth: "1.5px",
                    color: "#FFFFFF",
                  },
                }}
              >
                Book Standard Plan
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

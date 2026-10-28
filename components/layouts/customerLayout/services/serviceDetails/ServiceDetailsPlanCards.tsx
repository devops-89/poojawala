"use client";

import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { formatKeyName, formatFeatureKey } from "@/utils/serviceDetailsUtils";

interface ServiceDetailsPlanCardsProps {
  isOnlineService: boolean;
  plans: any;
  service: any;
  selectedPlan: string;
  selectedFeatureIds: number[];
  showAddons: boolean;
  handleSelectPlan: (planKey: string) => void;
  toggleFeatureId: (id: number, planKey: string) => void;
  isBookingAllowedForUser?: boolean;
  onOpenInquiry?: () => void;
}

export default function ServiceDetailsPlanCards({
  isOnlineService,
  plans,
  service,
  selectedPlan,
  selectedFeatureIds,
  showAddons,
  handleSelectPlan,
  toggleFeatureId,
  isBookingAllowedForUser = true,
  onOpenInquiry,
}: ServiceDetailsPlanCardsProps) {
  if (isOnlineService) {
    const onlinePlan = plans?.basic || plans?.standard || Object.values(plans || {})[0];
    const onlinePrice = Number(onlinePlan?.price || service?.minPrice || 0);

    const onlineRawFeatures =
      onlinePlan?.features ||
      (service?.serviceFeatures
        ? service.serviceFeatures.filter((sf: any) => sf.plan === "BASIC")
        : null);

    const onlineFeatures: string[] = [];
    if (Array.isArray(onlineRawFeatures)) {
      onlineRawFeatures.forEach((f: any) => {
        if (f && f.isActive !== false) {
          const title = formatKeyName(f.title || f.name || f.key || "");
          if (title && f.type !== "PRICE") {
            onlineFeatures.push(title);
          }
        }
      });
    } else if (onlinePlan?.features && typeof onlinePlan.features === "object") {
      Object.entries(onlinePlan.features).forEach(([k, v]) => {
        const formatted = formatFeatureKey(k, v);
        if (formatted) onlineFeatures.push(formatted);
      });
    }

    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "16px",
          border: "1px solid #EADCCF",
          bgcolor: "#FFFFFF",
          boxShadow: "0 2px 12px rgba(44, 24, 16, 0.04)",
          mb: 5,
        }}
      >
        {/* Header with Price */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            pb: 2,
            borderBottom: "1px solid #F1E5D8",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                color: COLORS.PRIMARY,
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Online Pooja Package
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#2C1810",
                fontSize: { xs: "20px", sm: "24px" },
              }}
            >
              Package Inclusions & Features
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#8C7A6B",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Pooja Offering
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: COLORS.PRIMARY,
                fontSize: { xs: "28px", sm: "32px" },
                lineHeight: 1.15,
                my: 0.3,
              }}
            >
              ₹{onlinePrice.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Box>

        {/* Feature Points */}
        {onlineFeatures.length > 0 && (
          <Box sx={{ pt: 2.5 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1.8,
              }}
            >
              {onlineFeatures.map((feat, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.2,
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      color: COLORS.PRIMARY,
                      fontSize: 18,
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontSize: "14px",
                      color: "#3D2B22",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {feat}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    );
  }

  if (!plans || (!plans.basic && !plans.standard)) {
    return null;
  }

  return (
    <Box sx={{ mb: 5 }}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1.2px",
          color: COLORS.PRIMARY,
          textTransform: "uppercase",
          mb: 1,
        }}
      >
        SELECT YOUR PLAN
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#2C1810",
          fontSize: { xs: "22px", sm: "28px" },
          mb: 3,
        }}
      >
        Choose the package that suits your ritual requirements
      </Typography>

      <Grid container spacing={3}>
        {(["basic", "standard"] as const).map((planKey) => {
          const plan = plans[planKey];
          if (!plan) return null;
          const isSelected = selectedPlan === planKey;
          const planTitle = planKey === "basic" ? "Basic Plan" : "Standard Plan";

          const rawFeatures =
            plan.features ||
            (service?.serviceFeatures
              ? service.serviceFeatures.filter(
                  (sf: any) => sf.plan === planKey.toUpperCase(),
                )
              : null);

          const normalFeatures: string[] = [];
          const priceFeatures: Array<{ id: number; title: string; price: number; plan: string }> = [];

          if (Array.isArray(rawFeatures)) {
            rawFeatures.forEach((f: any, idx: number) => {
              if (f && f.isActive !== false) {
                const title = formatKeyName(f.title || f.name || f.key || "");
                if (f.type === "PRICE") {
                  const matchedSf = service?.serviceFeatures?.find(
                    (sf: any) =>
                      sf.id === f.id ||
                      (sf.plan === planKey.toUpperCase() &&
                        (sf.title || "").trim().toLowerCase() ===
                          (f.title || f.name || "").trim().toLowerCase())
                  );
                  const resolvedId =
                    f.id != null
                      ? Number(f.id)
                      : matchedSf?.id != null
                        ? Number(matchedSf.id)
                        : idx + 1;
                  priceFeatures.push({
                    id: resolvedId,
                    title: title || f.title || "Add-on",
                    price: Number(f.value || f.price || 0),
                    plan: planKey,
                  });
                } else if (title) {
                  normalFeatures.push(title);
                }
              }
            });
          } else if (plan.features && typeof plan.features === "object") {
            const targetObj = plan.features;
            Object.entries(targetObj).forEach(([k, v]) => {
              const formatted = formatFeatureKey(k, v);
              if (formatted) normalFeatures.push(formatted);
            });
          }

          const planAddonTotal = showAddons
            ? priceFeatures
                .filter((pf) => selectedFeatureIds.includes(pf.id))
                .reduce((sum, pf) => sum + Number(pf.price || 0), 0)
            : 0;

          const totalCardPrice = Number(plan.price || 0) + planAddonTotal;

          return (
            <Grid size={{ xs: 12, sm: 6 }} key={planKey} sx={{ display: "flex" }}>
              <Paper
                elevation={0}
                onClick={() => handleSelectPlan(planKey)}
                sx={{
                  width: "100%",
                  p: 3,
                  borderRadius: "18px",
                  border: isSelected
                    ? "2px solid #C84B16"
                    : "1px solid #EADCCF",
                  bgcolor: isSelected ? "#FFFBF7" : "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isSelected
                    ? "0 8px 24px rgba(200, 75, 22, 0.12)"
                    : "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "all 0.25s ease",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 24px rgba(200, 75, 22, 0.15)",
                    borderColor: COLORS.PRIMARY,
                  },
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 800,
                        color: "#2C1810",
                        fontSize: "20px",
                      }}
                    >
                      {planTitle}
                    </Typography>
                    {isSelected && (
                      <Chip
                        label="SELECTED"
                        size="small"
                        sx={{
                          bgcolor: COLORS.PRIMARY,
                          color: "#FFF",
                          fontWeight: 700,
                          fontSize: "11px",
                          height: "22px",
                        }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 800,
                      color: COLORS.PRIMARY,
                      mb: 2.5,
                    }}
                  >
                    ₹{totalCardPrice.toLocaleString("en-IN")}
                  </Typography>

                  {/* Normal Features */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {normalFeatures.map((feat, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.2,
                        }}
                      >
                        <CheckCircleIcon
                          sx={{
                            color: COLORS.PRIMARY,
                            fontSize: 18,
                            flexShrink: 0,
                            mt: 0.2,
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "14px",
                            color: "#5C4A40",
                            fontWeight: 500,
                            lineHeight: 1.5,
                          }}
                        >
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Optional Add-ons */}
                  {showAddons && priceFeatures.length > 0 && (
                    <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px dashed #EADCCF" }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#8C7A6B",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          mb: 1.2,
                        }}
                      >
                        Optional Add-ons
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {priceFeatures.map((pf) => {
                          const isChecked = selectedFeatureIds.includes(pf.id);
                          return (
                            <Box
                              key={pf.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFeatureId(pf.id, planKey);
                              }}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1.5,
                                p: 1.3,
                                borderRadius: "10px",
                                border: isChecked ? "1.5px solid #C84B16" : "1px solid #E2E8F0",
                                bgcolor: isChecked ? "#FFF7ED" : "#FFFFFF",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: COLORS.PRIMARY,
                                  bgcolor: "#FFF7ED",
                                },
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2, flex: 1, minWidth: 0 }}>
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() => toggleFeatureId(pf.id, planKey)}
                                  onClick={(e) => e.stopPropagation()}
                                  size="small"
                                  sx={{
                                    p: 0,
                                    mt: 0.2,
                                    flexShrink: 0,
                                    color: "#94A3B8",
                                    "&.Mui-checked": {
                                      color: COLORS.PRIMARY,
                                    },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: FONTS.PRIMARY,
                                    fontSize: "13.5px",
                                    color: isChecked ? "#2C1810" : "#475569",
                                    fontWeight: isChecked ? 700 : 500,
                                    lineHeight: 1.4,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {pf.title}
                                </Typography>
                              </Box>
                              <Typography
                                component="span"
                                sx={{
                                  fontFamily: FONTS.OUTFIT,
                                  fontSize: "14px",
                                  fontWeight: 800,
                                  color: COLORS.PRIMARY,
                                  whiteSpace: "nowrap",
                                  flexShrink: 0,
                                  textAlign: "right",
                                  display: "inline-block",
                                  ml: 1,
                                }}
                              >
                                +₹{Number(pf.price || 0).toLocaleString("en-IN")}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Button
                  variant={isSelected ? "contained" : "outlined"}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(planKey);
                    if (!isBookingAllowedForUser && onOpenInquiry) {
                      onOpenInquiry();
                    }
                  }}
                  sx={{
                    mt: 3,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    py: 1,
                    ...(isSelected
                      ? {
                          bgcolor: "#C84B16 !important",
                          color: "white !important",
                          "&:hover": {
                            bgcolor: "#B03E0F !important",
                          },
                        }
                      : {
                          borderColor: COLORS.PRIMARY,
                          color: COLORS.PRIMARY,
                          "&:hover": {
                            bgcolor: "#FFFBF7",
                            borderColor: COLORS.PRIMARY,
                          },
                        }),
                  }}
                >
                  {!isBookingAllowedForUser
                    ? "Make an Enquiry"
                    : isSelected
                    ? "Selected Plan"
                    : "Select Plan"}
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

"use client";

import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export interface PurohitServicePlansSectionProps {
  service: any;
}

const getCarryItems = (
  service: any,
  planKey: "basic" | "standard"
): string[] => {
  const raw = service?.purohitCarryItems;
  if (!raw) return [];
  if (typeof raw === "object" && !Array.isArray(raw)) {
    if (Array.isArray(raw[planKey])) return raw[planKey];
    if (typeof raw[planKey] === "string") {
      try {
        const parsed = JSON.parse(raw[planKey]);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
  }
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray(parsed[planKey])
      ) {
        return parsed[planKey];
      }
    } catch (e) {
      return [];
    }
  }
  return [];
};

const getPlanPayout = (service: any, planKey: "basic" | "standard") => {
  const plans = service?.plans || {};
  const planData = plans[planKey] || {};
  const commission = Number(service?.commissionPercentage || 10);

  const isBasic = planKey === "basic";
  const price = Number(
    planData.price ??
      (isBasic
        ? service?.priceWithoutSamagri ?? service?.minPrice ?? 0
        : service?.priceWithSamagri ?? service?.maxPrice ?? 0)
  );

  const payoutAmount =
    planData[`${planKey}PurohitPayoutAmount`] ??
    planData.purohitPayoutAmount ??
    (price > 0 ? Math.round(price * (1 - commission / 100)) : 0);

  return payoutAmount;
};

export default function PurohitServicePlansSection({
  service,
}: PurohitServicePlansSectionProps) {
  const isOnlineOnly = Boolean(service?.isOnline) && !service?.isOffline;

  // Online rituals do not require carrying physical samagri/items, so hide section for online services
  if (isOnlineOnly) {
    return null;
  }

  const basicItems = getCarryItems(service, "basic");
  const standardItems = getCarryItems(service, "standard");

  const basicPayout = getPlanPayout(service, "basic");
  const standardPayout = getPlanPayout(service, "standard");

  // Standard plan only shows if service is NOT online-only and standard plan actually exists with price/payout > 0
  const hasStandardPlan =
    !isOnlineOnly &&
    Boolean(
      service?.plans?.standard &&
        (Number(standardPayout) > 0 ||
          Number(service?.plans?.standard?.price) > 0)
    );

  const planChipLabel = isOnlineOnly ? "ONLINE PLAN" : "BASIC PLAN";
  const planTitle = isOnlineOnly
    ? "Online Ritual Package"
    : "Basic Ritual Package";

  return (
    <Box sx={{ mt: { xs: 3, md: 4 }, mb: { xs: 3, md: 4 } }}>
      {/* Section Header */}
      <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#1E293B",
            fontSize: { xs: "18px", sm: "22px" },
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 5,
              height: 22,
              bgcolor: COLORS.PRIMARY,
              borderRadius: 3,
              display: "inline-block",
            }}
          />
          Package Options & Items to Carry
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748B",
            fontSize: { xs: "13px", sm: "14px" },
            mt: 0.5,
            ml: 2,
          }}
        >
          {hasStandardPlan
            ? "Payout rates and required items you need to carry for each package tier."
            : "Payout rate and ritual details for this ceremony."}
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Basic / Online Plan Card */}
        <Grid size={{ xs: 12, md: hasStandardPlan ? 6 : 8, lg: hasStandardPlan ? 6 : 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: "18px",
              bgcolor: "#FFFFFF",
              border: "1.5px solid #FED7AA",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 18px rgba(255, 98, 0, 0.04)",
              transition: "all 0.2s ease",
            }}
          >
            {/* Header with Payout */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
                pb: 2,
                borderBottom: "1px dashed #E2E8F0",
                gap: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Chip
                  label={planChipLabel}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 98, 0, 0.12)",
                    color: COLORS.PRIMARY,
                    border: "1px solid rgba(255, 98, 0, 0.3)",
                    fontWeight: 800,
                    fontSize: "11px",
                    height: "22px",
                    mb: 0.75,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#1E293B",
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: "16px", sm: "18px" },
                    lineHeight: 1.3,
                  }}
                >
                  {planTitle}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12px",
                    color: "#64748B",
                    mt: 0.25,
                  }}
                >
                  Client arranges essential samagri
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#64748B",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Purohit Payout
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#16A34A",
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: "20px", sm: "24px" },
                    lineHeight: 1.2,
                  }}
                >
                  ₹{Number(basicPayout).toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>

            {/* Required Items Title */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "13.5px",
                color: "#1E293B",
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontFamily: FONTS.OUTFIT,
              }}
            >
              <InventoryIcon sx={{ color: COLORS.PRIMARY, fontSize: "18px" }} />
              Required Items to Carry ({basicItems.length})
            </Typography>

            {/* Carry Items List */}
            <Box sx={{ flex: 1 }}>
              {basicItems.length > 0 ? (
                <Grid container spacing={1}>
                  {basicItems.map((item: string, idx: number) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={`basic-item-${idx}`}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          bgcolor: "#F8FAFC",
                          border: "1px solid #F1F5F9",
                          borderRadius: "10px",
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16, color: COLORS.PRIMARY, flexShrink: 0 }} />
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "#334155",
                            lineHeight: 1.3,
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "10px",
                    bgcolor: "#F8FAFC",
                    border: "1px dashed #CBD5E1",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "13px",
                      color: "#64748B",
                      fontStyle: "italic",
                    }}
                  >
                    {isOnlineOnly
                      ? "Online Ceremony — Conducted remotely via video call. No physical carry items needed."
                      : "Client will arrange all items. Please carry your personal puja utensils/kit."}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Standard Plan Card - Rendered ONLY if standard plan exists */}
        {hasStandardPlan && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: "18px",
                bgcolor: "#FFFFFF",
                border: "1.5px solid #BBF7D0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 18px rgba(22, 163, 74, 0.04)",
                transition: "all 0.2s ease",
              }}
            >
              {/* Header with Payout */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px dashed #E2E8F0",
                  gap: 1.5,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Chip
                    label="STANDARD PLAN"
                    size="small"
                    sx={{
                      bgcolor: "rgba(22, 163, 74, 0.12)",
                      color: "#16A34A",
                      border: "1px solid rgba(22, 163, 74, 0.3)",
                      fontWeight: 800,
                      fontSize: "11px",
                      height: "22px",
                      mb: 0.75,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#1E293B",
                      fontFamily: FONTS.OUTFIT,
                      fontSize: { xs: "16px", sm: "18px" },
                      lineHeight: 1.3,
                    }}
                  >
                    Standard Complete Package
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "12px",
                      color: "#64748B",
                      mt: 0.25,
                    }}
                  >
                    Purohit carries complete pooja samagri
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#64748B",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Purohit Payout
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#16A34A",
                      fontFamily: FONTS.OUTFIT,
                      fontSize: { xs: "20px", sm: "24px" },
                      lineHeight: 1.2,
                    }}
                  >
                    ₹{Number(standardPayout).toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Box>

              {/* Required Items Title */}
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "13.5px",
                  color: "#1E293B",
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontFamily: FONTS.OUTFIT,
                }}
              >
                <InventoryIcon sx={{ color: "#16A34A", fontSize: "18px" }} />
                Required Items to Carry ({standardItems.length})
              </Typography>

              {/* Carry Items List */}
              <Box sx={{ flex: 1 }}>
                {standardItems.length > 0 ? (
                  <Grid container spacing={1}>
                    {standardItems.map((item: string, idx: number) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={`std-item-${idx}`}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1,
                            bgcolor: "#F8FAFC",
                            border: "1px solid #F1F5F9",
                            borderRadius: "10px",
                          }}
                        >
                          <CheckCircleIcon sx={{ fontSize: 16, color: "#16A34A", flexShrink: 0 }} />
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT,
                              fontSize: "12.5px",
                              fontWeight: 600,
                              color: "#334155",
                              lineHeight: 1.3,
                            }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "10px",
                      bgcolor: "#F8FAFC",
                      border: "1px dashed #CBD5E1",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "13px",
                        color: "#64748B",
                        fontStyle: "italic",
                      }}
                    >
                      Complete samagri kit as agreed upon with client.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
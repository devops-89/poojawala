"use client";

import InventoryIcon from "@mui/icons-material/Inventory";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";

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
  const basicItems = getCarryItems(service, "basic");
  const standardItems = getCarryItems(service, "standard");

  const basicPayout = getPlanPayout(service, "basic");
  const standardPayout = getPlanPayout(service, "standard");

  return (
    <Box sx={{ mt: 5, mb: 6 }}>
      {/* Section Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 800,
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 28,
              bgcolor: "#FF6200",
              borderRadius: 4,
              display: "inline-block",
            }}
          />
          Service Plans & Items to Carry
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            color: "#64748b",
            fontSize: "0.95rem",
            mt: 0.5,
            ml: 2.5,
          }}
        >
          Package payouts and required pooja items for each ritual option
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Plan Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: "24px",
              bgcolor: "#fffbf7",
              border: "1px solid #fed7aa",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(255, 98, 0, 0.03)",
            }}
          >
            {/* Header with Payout */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2.5,
                pb: 2,
                borderBottom: "1px solid #ffedd5",
              }}
            >
              <Box>
                <Chip
                  label="BASIC PLAN"
                  size="small"
                  sx={{
                    bgcolor: "#FF6200",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    mb: 0.5,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#1e293b",
                    fontFamily: "var(--font-outfit), sans-serif",
                  }}
                >
                  Basic Ritual Package
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Purohit Payout
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#16a34a",
                    fontFamily: "var(--font-outfit), sans-serif",
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
                fontSize: "0.95rem",
                color: "#1e293b",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              <InventoryIcon sx={{ color: "#c2410c", fontSize: "1.15rem" }} />
              Required Items to Carry ({basicItems.length})
            </Typography>

            {/* Carry Items as Bullet Points */}
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={1.2}>
                {basicItems.map((item: string, idx: number) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={`basic-item-${idx}`}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#FF6200",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          color: "#334155",
                          lineHeight: 1.4,
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {basicItems.length === 0 && (
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    fontStyle: "italic",
                  }}
                >
                  No items listed for Basic Plan
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Standard Plan Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: "24px",
              bgcolor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 20px rgba(22, 163, 74, 0.03)",
            }}
          >
            {/* Header with Payout */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2.5,
                pb: 2,
                borderBottom: "1px solid #dcfce7",
              }}
            >
              <Box>
                <Chip
                  label="STANDARD PLAN"
                  size="small"
                  sx={{
                    bgcolor: "#16a34a",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    mb: 0.5,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#1e293b",
                    fontFamily: "var(--font-outfit), sans-serif",
                  }}
                >
                  Standard Complete Package
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Purohit Payout
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#16a34a",
                    fontFamily: "var(--font-outfit), sans-serif",
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
                fontSize: "0.95rem",
                color: "#1e293b",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              <InventoryIcon sx={{ color: "#15803d", fontSize: "1.15rem" }} />
              Required Items to Carry ({standardItems.length})
            </Typography>

            {/* Carry Items as Bullet Points */}
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={1.2}>
                {standardItems.map((item: string, idx: number) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={`std-item-${idx}`}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#16a34a",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          color: "#334155",
                          lineHeight: 1.4,
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {standardItems.length === 0 && (
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    fontStyle: "italic",
                  }}
                >
                  No items listed for Standard Plan
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

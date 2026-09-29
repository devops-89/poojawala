"use client";

import CheckIcon from "@mui/icons-material/Check";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, Card, Chip, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";

export interface BookingServiceCardProps {
  booking: any;
}

export default function BookingServiceCard({
  booking,
}: BookingServiceCardProps) {
  const service = booking?.service || {};
  const selectedPlanName = booking?.plan ? String(booking.plan).toUpperCase() : "BASIC";
  const selectedPlanKey = String(booking?.plan || "basic").toLowerCase();

  const plans = service?.plans || {};
  const planData =
    plans[selectedPlanKey] ||
    plans[booking?.plan] ||
    plans["basic"] ||
    plans["standard"] ||
    {};

  const displayPrice =
    booking?.finalAmount ||
    booking?.servicePrice ||
    planData?.price ||
    service?.price ||
    service?.priceWithoutSamagri ||
    service?.minPrice ||
    0;

  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: "#f3e8ff",
              display: "flex",
            }}
          >
            <DashboardIcon sx={{ fontSize: 24, color: "#9333ea" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Service Information
          </Typography>
        </Box>

        {booking?.plan && (
          <Chip
            label={`${selectedPlanName} PLAN`}
            sx={{
              bgcolor: "#FFF8F5",
              color: "#FF6200",
              fontWeight: 700,
              border: "1px solid #FF6200",
              fontSize: "0.85rem",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          />
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Service Requested & Price */}
        <Box
          sx={{
            display: "flex",
            justify: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: "250px" }}>
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.8rem",
                mb: 0.5,
              }}
            >
              Service Requested
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {service.name || "N/A"}
            </Typography>
            {service.description && (
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "0.9rem",
                  mt: 0.8,
                  fontFamily: "var(--font-outfit), sans-serif",
                  lineHeight: 1.5,
                }}
              >
                {service.description}
              </Typography>
            )}
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.8rem",
                mb: 0.5,
              }}
            >
              Service Amount
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#10b981",
                fontSize: "1.4rem",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              ₹{Number(displayPrice).toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Box>

        {/* Plan Features / Points */}
        {Object.keys(planData).length > 0 && (
          <>
            <Divider sx={{ my: 1, opacity: 0.6 }} />

            <Box>
              <Typography
                sx={{
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.8rem",
                  mb: 1.5,
                }}
              >
                Plan Details & Features ({selectedPlanName} PLAN)
              </Typography>

              <Grid container spacing={1.5}>
                {Object.entries(planData).map(([key, val]) => {
                  if (
                    key === "price" ||
                    key === "tokenAmount" ||
                    val === false ||
                    val === "false" ||
                    val === null ||
                    val === undefined
                  )
                    return null;

                  const isBoolTrue = val === true || val === "true";
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());

                  return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1.2,
                          borderRadius: "8px",
                          bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <CheckIcon sx={{ color: "#10b981", fontSize: 18 }} />
                        {isBoolTrue ? (
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#334155",
                              fontWeight: 600,
                              fontFamily: "var(--font-outfit), sans-serif",
                            }}
                          >
                            {label}
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#475569",
                              fontFamily: "var(--font-outfit), sans-serif",
                            }}
                          >
                            <span style={{ color: "#64748b" }}>{label}:</span>{" "}
                            <strong style={{ color: "#0f172a" }}>
                              {String(val)}
                            </strong>
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Card>
  );
}

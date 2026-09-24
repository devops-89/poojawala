"use client";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PercentIcon from "@mui/icons-material/Percent";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";

export interface ServiceSpecsPricingCardProps {
  service: any;
}

export default function ServiceSpecsPricingCard({
  service,
}: ServiceSpecsPricingCardProps) {
  return (
    <Grid container spacing={4}>
      {/* Specifications & Availability */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            height: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
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
                bgcolor: "#FF6200",
                borderRadius: 4,
                display: "inline-block",
              }}
            />
            Specifications & Availability
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: service.requiresVenue ? "#3b82f6" : "#94a3b8",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    bgcolor: "#fff",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: service.requiresVenue ? "#dbeafe" : "#f1f5f9",
                    borderRadius: "12px",
                    color: service.requiresVenue ? "#3b82f6" : "#64748b",
                    display: "flex",
                  }}
                >
                  <LocationOnIcon />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#64748b",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    Requires Venue
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: service.requiresVenue ? "#3b82f6" : "#64748b",
                      fontSize: "1.1rem",
                    }}
                  >
                    {service.requiresVenue ? "Yes, Required" : "Not Required"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Total Bookings */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#10b981",
                    boxShadow: "0 4px 20px rgba(16,185,129,0.05)",
                    bgcolor: "#fff",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#d1fae5",
                    borderRadius: "12px",
                    color: "#10b981",
                    display: "flex",
                  }}
                >
                  <ConfirmationNumberIcon />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#64748b",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    Total Bookings
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#10b981",
                      fontSize: "1.1rem",
                    }}
                  >
                    {service.totalBookings ?? service.bookings ?? 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Online Purohits */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#0284c7",
                    boxShadow: "0 4px 20px rgba(2,132,199,0.05)",
                    bgcolor: "#fff",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#e0f2fe",
                    borderRadius: "12px",
                    color: "#0284c7",
                    display: "flex",
                  }}
                >
                  <WifiIcon />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#64748b",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    Online Purohits
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#0284c7",
                      fontSize: "1.1rem",
                    }}
                  >
                    {service.onlinepurohitCount ?? 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Offline Purohits */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#9333ea",
                    boxShadow: "0 4px 20px rgba(147,51,234,0.05)",
                    bgcolor: "#fff",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#f3e8ff",
                    borderRadius: "12px",
                    color: "#9333ea",
                    display: "flex",
                  }}
                >
                  <WifiOffIcon />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#64748b",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    Offline Purohits
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#9333ea",
                      fontSize: "1.1rem",
                    }}
                  >
                    {service.offlinepurohitCount ?? 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {service.isUpcomingFestival && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "#f8fafc",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#8b5cf6",
                        boxShadow: "0 4px 20px rgba(139,92,246,0.05)",
                        bgcolor: "#fff",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#ede9fe",
                        borderRadius: "12px",
                        color: "#8b5cf6",
                        display: "flex",
                      }}
                    >
                      <EventIcon />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          color: "#64748b",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        Festival Start
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#1e293b",
                          fontSize: "1rem",
                        }}
                      >
                        {service.festivalStartDate
                          ? new Date(
                              service.festivalStartDate
                            ).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "#f8fafc",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#8b5cf6",
                        boxShadow: "0 4px 20px rgba(139,92,246,0.05)",
                        bgcolor: "#fff",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#ede9fe",
                        borderRadius: "12px",
                        color: "#8b5cf6",
                        display: "flex",
                      }}
                    >
                      <EventIcon />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          color: "#64748b",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        Festival End
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#1e293b",
                          fontSize: "1rem",
                        }}
                      >
                        {service.festivalEndDate
                          ? new Date(
                              service.festivalEndDate
                            ).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Grid>

      {/* Pricing Details */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            height: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
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
                bgcolor: "#FF6200",
                borderRadius: 4,
                display: "inline-block",
              }}
            />
            Pricing Details
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: "12px",
              mb: 2,
              border: "1px solid #f1f5f9",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#FFF0E6",
                  borderRadius: "8px",
                  color: "#FF6200",
                  display: "flex",
                }}
              >
                <CurrencyRupeeIcon fontSize="small" />
              </Box>
              <Typography
                sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}
              >
                Minimum Price
              </Typography>
            </Box>
            <Typography
              sx={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}
            >
              ₹{service.minPrice}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: "12px",
              mb: 2,
              border: "1px solid #f1f5f9",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#FFF0E6",
                  borderRadius: "8px",
                  color: "#FF6200",
                  display: "flex",
                }}
              >
                <CurrencyRupeeIcon fontSize="small" />
              </Box>
              <Typography
                sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}
              >
                Maximum Price
              </Typography>
            </Box>
            <Typography
              sx={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}
            >
              ₹{service.maxPrice}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #f1f5f9",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#FFF0E6",
                  borderRadius: "8px",
                  color: "#FF6200",
                  display: "flex",
                }}
              >
                <PercentIcon fontSize="small" />
              </Box>
              <Typography
                sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}
              >
                Commission
              </Typography>
            </Box>
            <Typography
              sx={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}
            >
              {service.commissionPercentage}%
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

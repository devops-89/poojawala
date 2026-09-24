"use client";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";

export interface BookingPaymentMatrixProps {
  booking: any;
  isPaying: boolean;
  onInitiatePayout: () => void;
}

export default function BookingPaymentMatrix({
  booking,
  isPaying,
  onInitiatePayout,
}: BookingPaymentMatrixProps) {
  const primaryAccount =
    booking.purohit?.bankAccounts?.find((acc: any) => acc.isPrimary) ||
    booking.purohit?.bankAccounts?.[0];

  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        border: "1px solid #e2e8f0",
        background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 4,
          pb: 2,
          borderBottom: "2px solid #e2e8f0",
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#FF6200",
            color: "white",
            boxShadow: "0 4px 10px rgba(255,98,0,0.2)",
            display: "flex",
          }}
        >
          <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Payment & Payout Matrix
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Payment */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              Customer Payment
            </Typography>
            <Box sx={{ my: 2 }}>
              <Chip
                label={booking.paymentStatus || "PENDING"}
                size="medium"
                sx={{
                  fontWeight: 700,
                  px: 1,
                  backgroundColor:
                    booking.paymentStatus === "PAID" ? "#d1fae5" : "#fef3c7",
                  color:
                    booking.paymentStatus === "PAID" ? "#065f46" : "#d97706",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 500,
                fontSize: "0.875rem",
                mb: 0.5,
              }}
            >
              Final Amount
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
              ₹{booking.finalAmount || "0.00"}
            </Typography>

            <Box sx={{ mt: "auto", pt: 3 }}>
              {booking.donationAmount &&
                parseFloat(booking.donationAmount) > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "0.875rem",
                      }}
                    >
                      Donation
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                      ₹{booking.donationAmount}
                    </Typography>
                  </Box>
                )}
              {booking.discountAmount &&
                parseFloat(booking.discountAmount) > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "0.875rem",
                      }}
                    >
                      Discount
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: "#10b981" }}>
                      -₹{booking.discountAmount}
                    </Typography>
                  </Box>
                )}
            </Box>
          </Paper>
        </Grid>

        {/* Platform Revenue */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              Platform Revenue
            </Typography>
            <Box sx={{ my: 2 }}>
              <Chip
                label={`Comm: ${booking.commissionPercentage || "0"}%`}
                size="medium"
                sx={{
                  fontWeight: 700,
                  px: 1,
                  backgroundColor: "#f1f5f9",
                  color: "#334155",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 500,
                fontSize: "0.875rem",
                mb: 0.5,
              }}
            >
              Platform Commission
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#FF6200" }}>
              ₹{booking.platformCommission || "0.00"}
            </Typography>

            <Box sx={{ mt: "auto", pt: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  backgroundColor: "#fff7ed",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#c2410c",
                    fontSize: "0.875rem",
                  }}
                >
                  Platform Earning
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#ea580c" }}
                >
                  ₹{booking.platformCommission || "0.00"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Purohit Payout */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "2px solid",
              borderColor:
                booking.purohitPayoutStatus === "PAID" ? "#10b981" : "#e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              Purohit Payout
            </Typography>
            <Box sx={{ my: 2 }}>
              <Chip
                label={booking.purohitPayoutStatus || "PENDING"}
                size="medium"
                sx={{
                  fontWeight: 700,
                  px: 1,
                  backgroundColor:
                    booking.purohitPayoutStatus === "PAID"
                      ? "#d1fae5"
                      : "#fef3c7",
                  color:
                    booking.purohitPayoutStatus === "PAID"
                      ? "#065f46"
                      : "#d97706",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 500,
                fontSize: "0.875rem",
                mb: 0.5,
              }}
            >
              Payable Amount
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
              ₹{booking.purohitPayoutAmount || "0.00"}
            </Typography>

            {primaryAccount && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    mb: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  Payout Account
                </Typography>
                {primaryAccount.paymentMethod === "UPI" ? (
                  <Box>
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: "0.75rem",
                        display: "block",
                      }}
                    >
                      UPI ID
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#0f172a",
                        fontSize: "0.875rem",
                      }}
                    >
                      {primaryAccount.upiId || "N/A"}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: "0.75rem",
                        display: "block",
                      }}
                    >
                      Bank Account
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#0f172a",
                        fontSize: "0.875rem",
                      }}
                    >
                      {primaryAccount.bankName} - {primaryAccount.accountNumber}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: "0.75rem",
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      IFSC: {primaryAccount.ifscCode}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: "0.75rem",
                        display: "block",
                      }}
                    >
                      Holder: {primaryAccount.accountHolderName}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ mt: "auto", pt: 3 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  background: "#10b981 !important",
                  color: "white !important",
                  "&:hover": { background: "#059669 !important" },
                  "&.Mui-disabled": {
                    background: "#6ee7b7 !important",
                    color: "#064e3b !important",
                  },
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow:
                    booking.purohitPayoutStatus !== "PAID"
                      ? "0 8px 20px -6px rgba(16,185,129,0.4)"
                      : "none",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
                disabled={
                  isPaying ||
                  booking.purohitPayoutStatus === "PAID" ||
                  booking.paymentStatus !== "PAID"
                }
                onClick={onInitiatePayout}
              >
                {isPaying ? (
                  <CircularProgress size={24} color="inherit" />
                ) : booking.purohitPayoutStatus === "PAID" ? (
                  "Payout Completed"
                ) : (
                  "Initiate Payout"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Card>
  );
}

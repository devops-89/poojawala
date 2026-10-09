"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
  Stack,
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

  // Plan & Purohit Payout calculation based on booking plan
  const planKey = booking.plan?.toLowerCase();
  const planDetails = booking.service?.plans?.[planKey];
  const purohitPayoutAmount =
    booking.purohitPayoutAmount ??
    planDetails?.purohitPayoutAmount ??
    "0.00";

  // Customer booking payments list
  const customerPayments = Array.isArray(booking.payments)
    ? booking.payments.filter((p: any) => p.paymentType === "BOOKING_PAYMENT")
    : booking.bookingPayment
    ? [booking.bookingPayment]
    : [];

  const formatAmount = (amt: any) => {
    if (amt === undefined || amt === null || amt === "") return "0.00";
    const num = typeof amt === "string" ? parseFloat(amt) : amt;
    return isNaN(num)
      ? "0.00"
      : num.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

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
            backgroundColor: COLORS.PRIMARY,
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
            fontFamily: FONTS.OUTFIT,
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
              {booking.plan && (
                <Chip
                  label={`Plan: ${booking.plan}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    color: COLORS.PRIMARY,
                    borderColor: COLORS.PRIMARY,
                    textTransform: "uppercase",
                  }}
                />
              )}
            </Box>

            <Box sx={{ my: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={booking.paymentStatus || "PENDING"}
                size="medium"
                sx={{
                  fontWeight: 700,
                  px: 1,
                  backgroundColor:
                    booking.paymentStatus === "PAID"
                      ? "#d1fae5"
                      : booking.paymentStatus === "PARTIAL"
                      ? "#ffedd5"
                      : "#fef3c7",
                  color:
                    booking.paymentStatus === "PAID"
                      ? "#065f46"
                      : booking.paymentStatus === "PARTIAL"
                      ? "#c2410c"
                      : "#d97706",
                  fontFamily: FONTS.OUTFIT,
                }}
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ mb: 2 }}>
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
                ₹{formatAmount(booking.finalAmount)}
              </Typography>
            </Box>

            {/* Customer Payments Breakdown */}
            {customerPayments.length > 0 && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 1,
                  }}
                >
                  Payment Breakdown ({customerPayments.length})
                </Typography>

                <Stack spacing={1.5}>
                  {customerPayments.map((pm: any, idx: number) => {
                    const isToken =
                      pm.remark === "BOOKING_TOKEN_PAYMENT" ||
                      pm.remark?.toUpperCase().includes("TOKEN") ||
                      (customerPayments.length > 1 && idx === 0);
                    const isSettlement =
                      pm.remark === "BOOKING_SETTLEMENT" ||
                      pm.remark?.toUpperCase().includes("SETTLEMENT") ||
                      (customerPayments.length > 1 && idx === 1);

                    let paymentLabel = "Booking Payment";
                    if (isToken) paymentLabel = "Token Payment";
                    else if (isSettlement) paymentLabel = "Remaining Settlement";

                    return (
                      <Box
                        key={pm.id || idx}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.8125rem",
                              color: "#1e293b",
                            }}
                          >
                            {paymentLabel}
                          </Typography>
                          <Chip
                            label={pm.status || "SUCCESS"}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              backgroundColor:
                                pm.status === "SUCCESS" ? "#d1fae5" : "#fef3c7",
                              color:
                                pm.status === "SUCCESS" ? "#065f46" : "#d97706",
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 800,
                              color: "#0f172a",
                              fontSize: "1.05rem",
                            }}
                          >
                            ₹{formatAmount(pm.amount || pm.customerPaidAmount)}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "#64748b",
                              fontWeight: 600,
                            }}
                          >
                            {pm.paymentMethod ||
                              pm.customerPaymentMethod ||
                              "ONLINE"}
                          </Typography>
                        </Box>

                        {pm.razorpayPaymentId && (
                          <Typography
                            sx={{ fontSize: "0.7rem", color: "#94a3b8", mt: 0.5 }}
                          >
                            ID: {pm.razorpayPaymentId}
                          </Typography>
                        )}

                        {pm.paidAt && (
                          <Typography
                            sx={{ fontSize: "0.7rem", color: "#94a3b8" }}
                          >
                            {formatDate(pm.paidAt)}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Remaining Amount, Donation & Discount */}
            <Box sx={{ mt: "auto", pt: 1.5 }}>
              {booking.remainingAmount &&
                parseFloat(booking.remainingAmount) > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      p: 1.2,
                      backgroundColor: "#fff7ed",
                      borderRadius: 1.5,
                      border: "1px solid #ffedd5",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#c2410c",
                        fontSize: "0.8125rem",
                      }}
                    >
                      Remaining Due
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: "#ea580c",
                        fontSize: "0.875rem",
                      }}
                    >
                      ₹{formatAmount(booking.remainingAmount)}
                    </Typography>
                  </Box>
                )}

              {booking.donationAmount &&
                parseFloat(booking.donationAmount) > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "0.8125rem",
                      }}
                    >
                      Donation
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontSize: "0.8125rem",
                      }}
                    >
                      ₹{formatAmount(booking.donationAmount)}
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
                        fontSize: "0.8125rem",
                      }}
                    >
                      Discount
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#10b981",
                        fontSize: "0.8125rem",
                      }}
                    >
                      -₹{formatAmount(booking.discountAmount)}
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
            <Box sx={{ my: 1.5 }}>
              <Chip
                label={`Comm: ${booking.commissionPercentage || "0"}%`}
                size="medium"
                sx={{
                  fontWeight: 700,
                  px: 1,
                  backgroundColor: "#f1f5f9",
                  color: "#334155",
                  fontFamily: FONTS.OUTFIT,
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
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: COLORS.PRIMARY }}
            >
              ₹{formatAmount(booking.platformCommission)}
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
                  ₹{formatAmount(booking.platformCommission)}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
              {booking.plan && (
                <Chip
                  label={`${booking.plan} Plan`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    backgroundColor: "#e0f2fe",
                    color: "#0369a1",
                    textTransform: "uppercase",
                  }}
                />
              )}
            </Box>

            <Box sx={{ my: 1.5 }}>
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
                  fontFamily: FONTS.OUTFIT,
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
              Payable Amount (Plan Payout)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
              ₹{formatAmount(purohitPayoutAmount)}
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
                  fontFamily: FONTS.OUTFIT,
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


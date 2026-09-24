"use client";

import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Box, Card, Grid, Typography } from "@mui/material";
import React from "react";

export interface OrderPaymentCardProps {
  payment: any;
  orderPaymentStatus?: string;
  orderPaymentMethod?: string;
}

export default function OrderPaymentCard({
  payment,
  orderPaymentStatus,
  orderPaymentMethod,
}: OrderPaymentCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        height: "100%",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
          pb: 2,
          borderBottom: "1px dashed #e2e8f0",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "#f3e8ff",
            display: "flex",
          }}
        >
          <CreditCardIcon sx={{ fontSize: 24, color: "#9333ea" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Payment & Gateway Information
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              Payment Method
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {payment?.paymentMethod ||
                payment?.customerPaymentMethod ||
                orderPaymentMethod ||
                "ONLINE"}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              Payment Status
            </Typography>
            <AdminStatusSelect
              value={payment?.status || orderPaymentStatus || "PENDING"}
              readOnly
            />
          </Box>
        </Grid>

        {payment?.razorpayOrderId && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Razorpay Order ID
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#334155",
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                {payment.razorpayOrderId}
              </Typography>
            </Box>
          </Grid>
        )}

        {payment?.razorpayPaymentId && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Razorpay Payment ID
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#334155",
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                {payment.razorpayPaymentId}
              </Typography>
            </Box>
          </Grid>
        )}

        {payment?.razorpayFee && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Gateway Fee & Tax
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#334155",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Fee: ₹{payment.razorpayFee} | Tax: ₹
                {payment.razorpayTax || "0.00"}
              </Typography>
            </Box>
          </Grid>
        )}

        {payment?.paidAt && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Payment Time
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#0f172a",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                {new Date(payment.paidAt).toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Card>
  );
}

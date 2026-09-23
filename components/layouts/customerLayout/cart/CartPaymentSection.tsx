"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";

interface CartPaymentSectionProps {
  paymentMethod: "razorpay" | "cod";
  onChangePaymentMethod: (method: "razorpay" | "cod") => void;
  onPlaceOrder: () => void;
  isSubmittingOrder: boolean;
  isCartEmpty: boolean;
  finalTotal: number;
}

export default function CartPaymentSection({
  paymentMethod,
  onChangePaymentMethod,
  onPlaceOrder,
  isSubmittingOrder,
  isCartEmpty,
  finalTotal,
}: CartPaymentSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 3.5 },
        bgcolor: "white",
        border: "1px solid #EADCCF",
        borderRadius: "20px",
      }}
    >
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 800,
          fontSize: "13px",
          letterSpacing: "1.2px",
          color: "#2C1810",
          textTransform: "uppercase",
          mb: 2.5,
        }}
      >
        PAY WITH
      </Typography>

      <RadioGroup
        value={paymentMethod}
        onChange={(e) =>
          onChangePaymentMethod(e.target.value as "razorpay" | "cod")
        }
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Option 1: Razorpay */}
        <Paper
          elevation={0}
          onClick={() => onChangePaymentMethod("razorpay")}
          sx={{
            p: 2,
            borderRadius: "14px",
            cursor: "pointer",
            border:
              paymentMethod === "razorpay"
                ? "2px solid #FF6200"
                : "1px solid #EADCCF",
            bgcolor: paymentMethod === "razorpay" ? "#FFF9F5" : "white",
            transition: "all 0.2s ease",
            position: "relative",
          }}
        >
          <Chip
            label="POPULAR"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "#FF6200",
              color: "white",
              fontWeight: 800,
              fontSize: "10px",
              height: 20,
              borderRadius: "4px",
            }}
          />

          <FormControlLabel
            value="razorpay"
            control={
              <Radio
                sx={{
                  color: "#64534A",
                  "&.Mui-checked": { color: "#FF6200" },
                }}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PaymentIcon sx={{ color: "#FF6200" }} />
                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 800,
                      color: "#2C1810",
                      fontSize: "15px",
                    }}
                  >
                    Razorpay
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                      fontSize: "12px",
                    }}
                  >
                    UPI, Credit / Debit Card, NetBanking & Wallets
                  </Typography>
                </Box>
              </Box>
            }
            sx={{ m: 0, width: "100%" }}
          />
        </Paper>


      </RadioGroup>

      {/* Primary Action Button */}
      <Button
        fullWidth
        disabled={isSubmittingOrder || isCartEmpty}
        onClick={onPlaceOrder}
        variant="contained"
        sx={{
          mt: 3,
          bgcolor: "#FF6200",
          color: "white",
          py: 1.8,
          borderRadius: "14px",
          fontWeight: 800,
          fontSize: "16px",
          fontFamily: '"DM Sans", sans-serif',
          textTransform: "none",
          boxShadow: "0 8px 24px rgba(255, 98, 0, 0.35)",
          "&:hover": {
            bgcolor: "#E05600",
            boxShadow: "0 10px 28px rgba(255, 98, 0, 0.45)",
          },
        }}
      >
        {isSubmittingOrder ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          `Place Sacred Order • ₹${finalTotal.toLocaleString("en-IN")}`
        )}
      </Button>
    </Paper>
  );
}

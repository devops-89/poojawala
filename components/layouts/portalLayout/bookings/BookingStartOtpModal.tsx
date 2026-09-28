"use client";

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

interface BookingStartOtpModalProps {
  open: boolean;
  onClose: () => void;
  otpValue: string;
  onOtpChange: (index: number, val: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLDivElement>) => void;
  onResendOtp: () => void;
  isResendingOtp: boolean;
  onVerifyOtp: () => void;
}

export const BookingStartOtpModal: React.FC<BookingStartOtpModalProps> = ({
  open,
  onClose,
  otpValue,
  onOtpChange,
  onOtpKeyDown,
  onResendOtp,
  isResendingOtp,
  onVerifyOtp,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800 }}
      >
        Verify OTP
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            color: "#666",
            mb: 3,
            fontSize: "14px",
          }}
        >
          Enter the 6-digit OTP provided by the client to start the job.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <TextField
              key={idx}
              id={`otp-input-${idx}`}
              variant="outlined"
              value={otpValue[idx] || ""}
              onChange={(e) => onOtpChange(idx, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(idx, e)}
              sx={{
                width: "50px",
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  p: "12px 0",
                  fontFamily: "var(--font-outfit), sans-serif",
                  borderRadius: "8px",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF6000",
                  },
                },
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#666",
              fontSize: "13px",
            }}
          >
            Didn't get OTP?
          </Typography>
          <Button
            onClick={onResendOtp}
            disabled={isResendingOtp}
            sx={{
              color: "#FF6200",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "13px",
              p: 0,
              minWidth: "auto",
              "&:hover": {
                background: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            {isResendingOtp ? "Resending..." : "Resend"}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#666", textTransform: "none", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onVerifyOtp}
          variant="contained"
          sx={{
            background: "#4CAF50 !important",
            color: "#fff !important",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": {
              background: "#388E3C !important",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              background: "#81C784 !important",
              color: "#ffffff !important",
              opacity: 0.7,
            },
          }}
          disabled={otpValue.length !== 6}
        >
          Verify & Start
        </Button>
      </DialogActions>
    </Dialog>
  );
};

"use client";

import { useSendOTP, useVerifyOTP } from "@/hooks/authentication/signup";
import { useModal } from "@/stores/useModal";
import { useSignupStore } from "@/stores/useSignupStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { COLORS, ROLES } from "@/utils/enums";
import FONTS from "@/utils/fonts";
import { MarkEmailReadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface OtpModalProps {
  onVerified?: () => void;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const OtpModal = ({ onVerified }: OtpModalProps) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const signupData = useSignupStore((state) => state.signupData);
  const hideModal = useModal((state) => state.hideModal);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const { loading: resending, sendOtp } = useSendOTP();
  const { loading: verifying, verifyOtp } = useVerifyOTP();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVerify();
    } else if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();
    if (!/^\d+$/.test(pasted)) return;

    const updatedOtp = [...otp];
    for (let i = 0; i < OTP_LENGTH && i < pasted.length; i++) {
      updatedOtp[i] = pasted[i];
    }
    setOtp(updatedOtp);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== OTP_LENGTH) {
      showSnackbar("Please enter a valid 6-digit OTP", "error");
      return;
    }

    if (!signupData?.email) {
      showSnackbar("Signup details not found. Please try again.", "error");
      hideModal();
      return;
    }

    const isVerified = await verifyOtp(
      signupData.email,
      otpValue,
      ROLES.CUSTOMER,
    );
    if (isVerified) {
      hideModal();
      onVerified?.();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resending || !signupData?.email) return;
    const isSent = await sendOtp(signupData.email, ROLES.CUSTOMER);
    if (isSent) {
      setOtp(Array(OTP_LENGTH).fill(""));
      setResendTimer(RESEND_COOLDOWN_SECONDS);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <Box sx={{ textAlign: "center", px: { xs: 0, sm: 1 } }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: COLORS.CREAM_SOFT,
          border: `1px solid ${COLORS.LIGHT_BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <MarkEmailReadOutlined sx={{ fontSize: 28, color: COLORS.PRIMARY }} />
      </Box>

      <Typography
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontSize: { xs: 20, sm: 22 },
          fontWeight: 700,
          color: COLORS.TEXT_DARK,
          mb: 1,
        }}
      >
        Verify Your Email
      </Typography>

      <Typography
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontSize: 14,
          color: COLORS.TEXT_SECONDARY,
          mb: 3,
        }}
      >
        Enter the 6-digit OTP sent to{" "}
        <Box component="span" sx={{ fontWeight: 600, color: COLORS.TEXT_DARK }}>
          {signupData?.email || "your email"}
        </Box>
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 1, sm: 1.5 },
          mb: 3,
        }}
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <TextField
            key={index}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            slotProps={{
              htmlInput: {
                maxLength: 1,
                inputMode: "numeric",
                "aria-label": `OTP digit ${index + 1}`,
                style: {
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: 600,
                  padding: "12px 0",
                },
              },
            }}
            sx={{
              width: { xs: 42, sm: 48 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.PRIMARY,
                },
              },
            }}
          />
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={handleVerify}
        disabled={verifying}
        sx={{
          backgroundColor: COLORS.PRIMARY,
          "&:hover": { backgroundColor: COLORS.PRIMARY_HOVER },
          color: COLORS.WHITE,
          py: 1.25,
          fontSize: 16,
          fontFamily: FONTS.PRIMARY,
          fontWeight: 600,
          borderRadius: "10px",
          textTransform: "none",
          mb: 2,
        }}
      >
        {verifying ? (
          <CircularProgress size={24} sx={{ color: COLORS.WHITE }} />
        ) : (
          "Verify OTP"
        )}
      </Button>

      <Typography
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontSize: 14,
          color: COLORS.TEXT_SECONDARY,
        }}
      >
        Didn&apos;t receive the code?{" "}
        {resendTimer > 0 ? (
          <Box
            component="span"
            sx={{ fontWeight: 600, color: COLORS.TEXT_MUTED }}
          >
            Resend in {resendTimer}s
          </Box>
        ) : (
          <Box
            component="span"
            onClick={handleResend}
            sx={{
              fontWeight: 600,
              color: COLORS.PRIMARY,
              cursor: resending ? "not-allowed" : "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </Box>
        )}
      </Typography>
    </Box>
  );
};

export default OtpModal;

"use client";

import {
  verifyOtpAPI,
  registerPurohitAPI,
  sendOtpAPI,
} from "@/api/userControllers";
import { extractRoleCsrfToken, saveRoleCsrfToken } from "@/api/config";
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { extractBackendErrorMessage } from "@/utils/helpers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function VerifyOtpContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbarStore();
  const { showLoader, hideLoader } = useLoaderStore();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(30);

  const redirectUrl =
    searchParams.get("redirect") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("post_login_redirect")
      : null);

  const signInHref = redirectUrl
    ? `/sign-in?redirect=${encodeURIComponent(redirectUrl)}`
    : "/sign-in";

  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      if (signupData) {
        const res = await sendOtpAPI({
          phone: signupData.phone,
          email: signupData.email,
          role: "CUSTOMER",
        });
        if (res.success || res.statusCode === 200) {
          showSnackbar("OTP resent successfully!", "success");
          setResendTimer(30);
        } else {
          showSnackbar(res.message || "Failed to resend OTP", "error");
        }
      }
    } catch (err: any) {
      showSnackbar(
        extractBackendErrorMessage(err, "Failed to resend OTP"),
        "error"
      );
    }
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj?.role === "CUSTOMER") {
          if (redirectUrl && redirectUrl.startsWith("/customer/")) {
            sessionStorage.removeItem("post_login_redirect");
            router.replace(redirectUrl);
          } else {
            router.replace("/customer/dashboard");
          }
          return;
        } else if (userObj?.role === "PUROHIT") {
          router.replace("/partner/dashboard");
          return;
        } else if (userObj?.role === "ASTROLOGER") {
          router.replace("/partner/astrologybookings");
          return;
        } else if (
          userObj?.role === "ADMIN" ||
          userObj?.role === "SUPERADMIN"
        ) {
          router.replace("/admin/dashboard");
          return;
        }
      } catch (e) {}
    }

    const data = sessionStorage.getItem("signupData");
    if (data) {
      try {
        setSignupData(JSON.parse(data));
      } catch (e) {}
    } else {
      // Fallback display if accessed directly during testing
      setSignupData({ email: "your email address", phone: "" });
    }
  }, [router, showSnackbar, redirectUrl]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>
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
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      showSnackbar("Please enter a valid 6-digit OTP", "error");
      return;
    }

    if (!signupData || !signupData.phone) {
      showSnackbar("Session expired. Please sign up again.", "error");
      router.replace("/sign-up");
      return;
    }

    try {
      setIsSubmitting(true);
      showLoader("Verifying OTP...");

      const verifyRes = await verifyOtpAPI({
        phone: signupData.phone,
        otp: otpValue,
        role: "CUSTOMER",
      });

      if (verifyRes.success || verifyRes.statusCode === 200) {
        showSnackbar(
          "OTP verified successfully! Creating account...",
          "success"
        );

        showLoader("Creating your account...");
        const formData = new FormData();
        Object.keys(signupData).forEach((key) => {
          if (key === "latitude" || key === "longitude") {
            const val = signupData[key];
            if (val && val !== "0" && String(val).trim() !== "") {
              formData.append(key, val);
            }
          } else {
            formData.append(key, signupData[key]);
          }
        });

        const registerRes = await registerPurohitAPI(formData);

        if (
          registerRes.success ||
          registerRes.statusCode === 200 ||
          registerRes.statusCode === 201
        ) {
          sessionStorage.removeItem("signupData");

          const csrf = extractRoleCsrfToken(
            registerRes,
            registerRes.user?.role
          );
          if (csrf) {
            saveRoleCsrfToken(csrf, registerRes.user?.role);
          }
          if (registerRes.user) {
            sessionStorage.setItem("user", JSON.stringify(registerRes.user));
            sessionStorage.setItem("role", registerRes.user.role);
          }
          if (registerRes.accessToken) {
            sessionStorage.setItem("accessToken", registerRes.accessToken);
          }
          if (registerRes.refreshToken) {
            sessionStorage.setItem("refreshToken", registerRes.refreshToken);
          }

          showSnackbar("Account created successfully!", "success");
          if (redirectUrl && redirectUrl.startsWith("/customer/")) {
            sessionStorage.removeItem("post_login_redirect");
            router.replace(redirectUrl);
          } else {
            router.replace("/customer/dashboard");
          }
        } else {
          showSnackbar(
            registerRes.message || "Failed to create account",
            "error"
          );
        }
      } else {
        showSnackbar(verifyRes.message || "Invalid OTP", "error");
      }
    } catch (error: any) {
      showSnackbar(
        extractBackendErrorMessage(error, "Verification failed"),
        "error"
      );
    } finally {
      hideLoader();
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/images/signup-bg1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        py: { xs: 2.5, md: 3 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Top Header: Desktop Back Navigation */}
      <Box
        sx={{
          position: { xs: "relative", md: "absolute" },
          top: { xs: 0, md: 20 },
          left: 0,
          right: 0,
          px: { xs: 2, sm: 4, md: 6 },
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-end" },
          width: "100%",
          mb: { xs: 2, md: 0 },
          zIndex: 10,
        }}
      >
        <Button
          component={Link}
          href={signInHref}
          startIcon={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "rgba(255, 98, 0, 0.12)",
                color: "#FF6200",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 14 }} />
            </Box>
          }
          sx={{
            display: { xs: "none", md: "inline-flex" },
            color: "#1F1A17",
            bgcolor: "#FFFFFF",
            border: "1.5px solid rgba(255, 98, 0, 0.28)",
            borderRadius: "32px",
            pl: 1.2,
            pr: 2.2,
            py: 0.6,
            fontFamily: FONTS.OUTFIT,
            fontWeight: 600,
            fontSize: "13px",
            textTransform: "none",
            boxShadow:
              "0 4px 14px -2px rgba(255, 98, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.04)",
            transition: "all 0.25s ease",
            "&:hover": {
              bgcolor: "#FFFFFF",
              borderColor: "#FF6200",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 18px -2px rgba(255, 98, 0, 0.28)",
            },
          }}
        >
          Back to Sign In
        </Button>
      </Box>

      {/* Main Glassmorphic Card Container */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 0, sm: 1 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "580px", md: "820px" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: { xs: "20px", md: "24px" },
            overflow: "hidden",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 250, 245, 0.28) 100%)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1.5px solid rgba(255, 255, 255, 0.85)",
            boxShadow:
              "0 35px 85px -15px rgba(210, 100, 30, 0.22), 0 15px 35px rgba(0, 0, 0, 0.06), inset 0 2px 2px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(255, 255, 255, 0.4)",
          }}
        >
          {/* Left Side Branding Panel */}
          <Box
            sx={{
              flex: { md: 0.9 },
              background:
                "linear-gradient(165deg, rgba(255, 252, 247, 0.45) 0%, rgba(255, 245, 235, 0.22) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRight: { md: "1.5px solid rgba(255, 255, 255, 0.65)" },
              p: { xs: 2.5, sm: 3, md: "32px 34px" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Brand Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: "inline-block",
                mb: { xs: 2, md: 2.5 },
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Box
                component="img"
                src="/images/1Poojalogo.webp"
                alt="1Pooja Logo"
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Headline */}
            <Typography
              variant="h3"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1F1A17",
                fontSize: { xs: "24px", sm: "26px", md: "28px" },
                lineHeight: 1.22,
                mb: 1.2,
                letterSpacing: "-0.3px",
              }}
            >
              Verify Your Email
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#6B7280",
                fontSize: { xs: "13px", md: "14px" },
                lineHeight: 1.55,
                maxWidth: "360px",
              }}
            >
              Please enter the 6-digit one-time password sent to your email to
              securely complete your registration.
            </Typography>
          </Box>

          {/* Right Side OTP Verification Panel */}
          <Box
            sx={{
              flex: 1.15,
              p: { xs: 2.5, sm: 3, md: "32px 36px" },
              background:
                "linear-gradient(165deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 252, 248, 0.4) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1F1A17",
                fontSize: { xs: "22px", sm: "24px" },
                mb: 0.5,
              }}
            >
              Enter OTP
            </Typography>

            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#6B7280",
                fontSize: "13.5px",
                mb: 3,
              }}
            >
              Code sent to{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  color: "#FF6200",
                  wordBreak: "break-all",
                }}
              >
                {signupData?.email || "your email"}
              </Box>
            </Typography>

            {/* 6 OTP Input Boxes */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1.5 },
                justifyContent: "space-between",
                mb: 3,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleVerify();
                }
              }}
            >
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  value={digit}
                  inputRef={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  variant="outlined"
                  slotProps={{
                    htmlInput: {
                      maxLength: 1,
                      style: {
                        textAlign: "center",
                        fontSize: "1.35rem",
                        fontWeight: 700,
                        padding: "12px 0",
                        fontFamily: FONTS.OUTFIT,
                        color: "#1F1A17",
                      },
                    },
                  }}
                  sx={{
                    width: { xs: "44px", sm: "50px" },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "rgba(255, 255, 255, 0.72)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      transition: "all 0.2s ease",
                      "& fieldset": {
                        borderColor: digit
                          ? "rgba(255, 98, 0, 0.6)"
                          : "rgba(220, 205, 190, 0.75)",
                        borderWidth: digit ? "1.5px" : "1.2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#FF9100",
                      },
                      "&.Mui-focused": {
                        bgcolor: "#FFFFFF",
                        boxShadow: "0 0 0 3px rgba(255, 98, 0, 0.14)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#FF6200",
                        borderWidth: "1.8px",
                      },
                    },
                  }}
                />
              ))}
            </Box>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              fullWidth
              disabled={isSubmitting || otp.join("").length !== 6}
              variant="contained"
              sx={{
                background:
                  "linear-gradient(135deg, #FF6200 0%, #FF7A1A 100%)",
                color: "#ffffff",
                py: 1.1,
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.28)",
                transition: "all 0.25s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #E65800 0%, #FF6200 100%)",
                  boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": {
                  background: "rgba(200, 195, 190, 0.45)",
                  color: "#9CA3AF",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Verify & Create Account"
              )}
            </Button>

            {/* Resend Section */}
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#6B7280",
                textAlign: "center",
                mt: 3,
                fontSize: "13.5px",
                fontWeight: 500,
              }}
            >
              Didn't receive the code?{" "}
              {resendTimer > 0 ? (
                <Box
                  component="span"
                  sx={{ color: "#9CA3AF", fontWeight: 600 }}
                >
                  Resend in {resendTimer}s
                </Box>
              ) : (
                <Box
                  component="button"
                  onClick={handleResendOtp}
                  sx={{
                    color: "#FF6200",
                    fontWeight: 700,
                    textDecoration: "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "13.5px",
                    p: 0,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Resend OTP
                </Box>
              )}
            </Typography>

            {/* Back to Sign Up Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                component={Link}
                href="/sign-up"
                startIcon={
                  <ArrowBackIcon
                    sx={{
                      fontSize: "15px !important",
                      transition: "transform 0.25s ease",
                    }}
                  />
                }
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4B5563",
                  bgcolor: "rgba(255, 255, 255, 0.6)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "100px",
                  px: 2.2,
                  py: 0.7,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "rgba(255, 98, 0, 0.08)",
                    borderColor: "rgba(255, 98, 0, 0.35)",
                    color: "#FF6200",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 14px rgba(255, 98, 0, 0.15)",
                    "& .MuiButton-startIcon": {
                      transform: "translateX(-3px)",
                    },
                  },
                }}
              >
                Back to Sign Up
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

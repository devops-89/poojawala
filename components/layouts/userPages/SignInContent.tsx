"use client";

import { getMeAPI, loginAPI } from "@/api/authControllers";
import { extractRoleCsrfToken, saveRoleCsrfToken } from "@/api/config";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import {
  extractBackendErrorMessage,
  allowOnlyEmailCharsOnKeyDown,
  sanitizeEmailInput,
  EMAIL_STRICT_REGEX,
  EMAIL_STRICT_MESSAGE,
} from "@/utils/helpers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE)
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [showPassword, setShowPassword] = useState(false);

  const redirectParam =
    searchParams.get("redirect") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("post_login_redirect")
      : null);

  useEffect(() => {
    if (redirectParam && typeof window !== "undefined") {
      sessionStorage.setItem("post_login_redirect", redirectParam);
    }
  }, [redirectParam]);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        const role = userObj?.role;
        if (role === "CUSTOMER") {
          const redirectUrl =
            searchParams.get("redirect") ||
            sessionStorage.getItem("post_login_redirect");
          if (redirectUrl && redirectUrl.startsWith("/customer/")) {
            sessionStorage.removeItem("post_login_redirect");
            router.replace(redirectUrl);
          } else {
            router.replace("/customer/dashboard");
          }
        } else if (role === "PUROHIT" || role === "ASTROLOGER") {
          if (role === "ASTROLOGER") {
            router.replace("/partner/astrologybookings");
          } else {
            router.replace("/partner/dashboard");
          }
        } else if (
          role === "ADMIN" ||
          role === "SUPERADMIN" ||
          role === "SUPER_ADMIN"
        ) {
          router.replace("/admin/dashboard");
        }
      } catch (e) {}
    }
  }, [router, searchParams]);

  return (
    <>

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url('/images/login-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: { xs: "70% center", md: "center" },
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          py: { xs: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Top Header: Desktop has Logo Left + Back Button Right; Mobile has ONLY the Grand Centered Logo */}
        <Box
          sx={{
            position: { xs: "relative", md: "absolute" },
            top: { xs: 0, md: 28 },
            left: 0,
            right: 0,
            px: { xs: 2, sm: 4, md: 6 },
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "space-between" },
            width: "100%",
            mb: { xs: 3.5, md: 0 },
            zIndex: 10,
          }}
        >
          {/* Logo: Centered & Much Bigger on Mobile; Left-aligned on Desktop */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              order: 1,
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.04)" },
            }}
          >
            <Box
              component="img"
              src="/images/1Poojalogo.webp"
              alt="1Pooja Logo"
              sx={{
                height: { xs: "72px", sm: "76px", md: "52px" },
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 3px 12px rgba(0, 0, 0, 0.08))",
              }}
            />
          </Box>

          {/* Desktop Back Navigation: Top-Right on Desktop; Hidden on Mobile (placed below card on mobile) */}
          <Button
            component={Link}
            href="/"
            startIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "rgba(255, 98, 0, 0.12)",
                  color: COLORS.PRIMARY,
                  transition: "all 0.25s ease",
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 16 }} />
              </Box>
            }
            sx={{
              display: { xs: "none", md: "inline-flex" },
              order: 2,
              color: "#1F1A17",
              bgcolor: "#FFFFFF",
              border: "1.5px solid rgba(255, 98, 0, 0.28)",
              borderRadius: "32px",
              pl: 1.2,
              pr: 2.6,
              py: 0.8,
              fontFamily: FONTS.OUTFIT_ONLY,
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.1px",
              textTransform: "none",
              boxShadow:
                "0 6px 20px -3px rgba(255, 98, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.05)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "& .MuiButton-startIcon": {
                mr: 1.2,
              },
              "&:hover": {
                bgcolor: "#FFFFFF",
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
                transform: "translateY(-2px)",
                boxShadow:
                  "0 10px 28px -3px rgba(255, 98, 0, 0.32), 0 4px 12px rgba(0, 0, 0, 0.08)",
                "& .MuiButton-startIcon > div": {
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  transform: "translateX(-2px)",
                },
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Back to Website
          </Button>
        </Box>

        {/* Master Card Container */}
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            px: { xs: 1.5, sm: 3 },
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: "100%", sm: "480px", md: "1050px" },
              width: "100%",
              borderRadius: { xs: "24px", sm: "32px" },
              overflow: "hidden",
              boxShadow:
                "0 35px 85px -15px rgba(190, 85, 20, 0.22), 0 18px 40px -6px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1.5px 2px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(255, 255, 255, 0.4)",
              border: "1.5px solid rgba(255, 255, 255, 0.95)",
              outline: "1px solid rgba(230, 195, 160, 0.3)",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.22) 100%)",
              backdropFilter: "blur(6px) saturate(140%)",
              WebkitBackdropFilter: "blur(6px) saturate(140%)",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              position: "relative",
            }}
          >
            {/* Left Column: Sign-in Form */}
            <Box
              sx={{
                flex: { md: 1 },
                p: { xs: "32px 22px", sm: "40px 32px", md: "48px 44px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                zIndex: 2,
              }}
            >

              <Typography
                variant="h3"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: { xs: "26px", sm: "30px", md: "36px" },
                  color: "#1F1A17",
                  letterSpacing: "-0.5px",
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT_ONLY,
                  fontSize: "14.5px",
                  color: "#6B7280",
                  mb: 3.5,
                }}
              >
                Sign in to continue to your account.
              </Typography>

              <Formik
                initialValues={{ email: "", password: "", rememberMe: false }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    // Reset stale in-memory profile and session data
                    useUserStore.getState().clearProfile();
                    if (typeof window !== "undefined") {
                      sessionStorage.clear();
                      localStorage.removeItem("user");
                      localStorage.removeItem("role");
                      localStorage.removeItem("activeRole");
                    }

                    const response = await loginAPI({
                      email: values.email,
                      password: values.password,
                    });
                    if (
                      response.success ||
                      response.token ||
                      response.accessToken ||
                      response.poojawalaPurohitCsrfToken ||
                      response.poojawalaCustomerCsrfToken ||
                      response.poojawalaAstrologerCsrfToken
                    ) {
                      const token =
                        response.tokens?.access?.token ||
                        response.token ||
                        response.accessToken;
                      let userObj = response.user || response.data?.user || response?.data;

                      // Always fetch fresh authenticated profile from backend
                      try {
                        const meResponse = await getMeAPI(token);
                        const freshUser =
                          meResponse?.user ||
                          meResponse?.data?.user ||
                          meResponse?.data ||
                          meResponse;
                        if (
                          freshUser &&
                          typeof freshUser === "object" &&
                          (freshUser.id || freshUser.email || freshUser.firstName || freshUser.name)
                        ) {
                          userObj = freshUser;
                        }
                      } catch (err) {
                        console.warn("getMeAPI on login notice:", err);
                      }

                      const role =
                        userObj?.role || response?.user?.role || response?.data?.user?.role || response?.role || "CUSTOMER";

                      if (userObj) {
                        sessionStorage.setItem("user", JSON.stringify(userObj));
                        useUserStore.getState().setProfile(userObj);
                      }

                      if (role) {
                        sessionStorage.setItem("role", role);
                        sessionStorage.setItem("activeRole", role);
                      }

                      const csrf = extractRoleCsrfToken(response, role);
                      if (csrf) {
                        saveRoleCsrfToken(csrf, role);
                      }

                      showSnackbar("Login successful!", "success");

                      setTimeout(() => {
                        let targetUrl = "/";
                        if (role === "CUSTOMER") {
                          const redirectUrl =
                            searchParams.get("redirect") ||
                            (typeof window !== "undefined"
                              ? sessionStorage.getItem("post_login_redirect")
                              : null);
                          if (redirectUrl && redirectUrl.startsWith("/customer/")) {
                            sessionStorage.removeItem("post_login_redirect");
                            targetUrl = redirectUrl;
                          } else {
                            targetUrl = "/customer/dashboard";
                          }
                        } else if (role === "PUROHIT" || role === "ASTROLOGER") {
                          targetUrl =
                            role === "ASTROLOGER"
                              ? "/partner/astrologybookings"
                              : "/partner/dashboard";
                        } else if (
                          role === "ADMIN" ||
                          role === "SUPERADMIN" ||
                          role === "SUPER_ADMIN"
                        ) {
                          targetUrl = "/admin/dashboard";
                        }
                        window.location.href = targetUrl;
                      }, 300);
                    }
                  } catch (error: any) {
                      console.error("Login failed", error);
                      const rawMsg = extractBackendErrorMessage(
                        error,
                        "Invalid email or password",
                      );
                      const finalMsg =
                        !rawMsg ||
                        rawMsg.toLowerCase() === "validation failed" ||
                        rawMsg.toLowerCase() === "bad request"
                          ? "Invalid email or password"
                          : rawMsg;
                      showSnackbar(finalMsg, "error");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, touched, errors, submitForm }) => (
                    <Box
                      component={Form}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                          const target = e.target as HTMLElement;
                          if (target.tagName?.toLowerCase() === "textarea") return;
                          e.preventDefault();
                          submitForm();
                        }
                      }}
                    >
                      <FormikValidationSnackbar />

                      {/* Email Field */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT_ONLY,
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: "#374151",
                            mb: 0.7,
                          }}
                        >
                          Email address
                        </Typography>
                        <Field name="email">
                        {({ field, form, meta }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            placeholder="you@example.com"
                            variant="outlined"
                            type="email"
                            onKeyDown={allowOnlyEmailCharsOnKeyDown}
                            onChange={(e) => {
                              form.setFieldValue(
                                "email",
                                sanitizeEmailInput(e.target.value)
                              );
                            }}
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <MailOutlinedIcon
                                      sx={{
                                        color:
                                          meta.touched && meta.error
                                            ? "#E53E3E"
                                            : "#9CA3AF",
                                        fontSize: 20,
                                      }}
                                    />
                                  </InputAdornment>
                                ),
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                fontFamily: FONTS.OUTFIT_ONLY,
                                borderRadius: "12px",
                                backgroundColor: "rgba(255, 255, 255, 0.52)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                transition: "all 0.2s ease-in-out",
                                "&:has(input:-webkit-autofill)": {
                                  backgroundColor: "#FFFFFF !important",
                                },
                                "& fieldset": {
                                  borderColor: "rgba(220, 200, 185, 0.75)",
                                  borderWidth: "1.2px",
                                },
                                "&:hover": {
                                  backgroundColor: "rgba(255, 255, 255, 0.72)",
                                },
                                "&:hover fieldset": {
                                  borderColor: COLORS.PRIMARY,
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  boxShadow:
                                    "0 0 0 4px rgba(255, 98, 0, 0.12)",
                                  "& fieldset": {
                                    borderColor: COLORS.PRIMARY,
                                    borderWidth: "1.5px",
                                  },
                                },
                                "&.Mui-error": {
                                  backgroundColor: "#FFF8F7",
                                  "& fieldset": {
                                    borderColor: "#E53E3E",
                                  },
                                },
                                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
                                  {
                                    WebkitBoxShadow:
                                      "0 0 0 1000px #FFFFFF inset !important",
                                    WebkitTextFillColor: "#181411 !important",
                                    caretColor: "#181411",
                                    borderRadius: "0px !important",
                                    transition:
                                      "background-color 50000s ease-in-out 0s",
                                  },
                              },
                              "& .MuiFormHelperText-root": {
                                fontFamily: FONTS.OUTFIT_ONLY,
                                fontSize: "12px",
                                marginLeft: "4px",
                                marginTop: "4px",
                              },
                            }}
                          />
                        )}
                      </Field>
                    </Box>

                    {/* Password Field */}
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT_ONLY,
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "#374151",
                          mb: 0.7,
                        }}
                      >
                        Password
                      </Typography>
                      <Field name="password">
                        {({ field, meta }: any) => (
                          <TextField
                            {...field}
                            fullWidth
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockOutlinedIcon
                                      sx={{
                                        color:
                                          meta.touched && meta.error
                                            ? "#E53E3E"
                                            : "#9CA3AF",
                                        fontSize: 20,
                                      }}
                                    />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                      edge="end"
                                      size="small"
                                      sx={{ color: "#6B7280" }}
                                    >
                                      {showPassword ? (
                                        <VisibilityOff sx={{ fontSize: 20 }} />
                                      ) : (
                                        <Visibility sx={{ fontSize: 20 }} />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                fontFamily: FONTS.OUTFIT_ONLY,
                                borderRadius: "12px",
                                backgroundColor: "rgba(255, 255, 255, 0.52)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                transition: "all 0.2s ease-in-out",
                                "&:has(input:-webkit-autofill)": {
                                  backgroundColor: "#FFFFFF !important",
                                },
                                "& fieldset": {
                                  borderColor: "rgba(220, 200, 185, 0.75)",
                                  borderWidth: "1.2px",
                                },
                                "&:hover": {
                                  backgroundColor: "rgba(255, 255, 255, 0.72)",
                                },
                                "&:hover fieldset": {
                                  borderColor: COLORS.PRIMARY,
                                },
                                "&.Mui-focused": {
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  boxShadow:
                                    "0 0 0 4px rgba(255, 98, 0, 0.12)",
                                  "& fieldset": {
                                    borderColor: COLORS.PRIMARY,
                                    borderWidth: "1.5px",
                                  },
                                },
                                "&.Mui-error": {
                                  backgroundColor: "#FFF8F7",
                                  "& fieldset": {
                                    borderColor: "#E53E3E",
                                  },
                                },
                                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
                                  {
                                    WebkitBoxShadow:
                                      "0 0 0 1000px #FFFFFF inset !important",
                                    WebkitTextFillColor: "#181411 !important",
                                    caretColor: "#181411",
                                    borderRadius: "0px !important",
                                    transition:
                                      "background-color 50000s ease-in-out 0s",
                                  },
                              },
                              "& .MuiFormHelperText-root": {
                                fontFamily: FONTS.OUTFIT_ONLY,
                                fontSize: "12px",
                                marginLeft: "4px",
                                marginTop: "4px",
                              },
                            }}
                          />
                        )}
                      </Field>
                    </Box>

                    {/* Remember me & Forgot Password */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                        mb: 3,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Field
                            as={Checkbox}
                            name="rememberMe"
                            size="small"
                            sx={{
                              color: "#D1D5DB",
                              "&.Mui-checked": { color: COLORS.PRIMARY },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT_ONLY,
                              fontSize: "13.5px",
                              color: "#4B5563",
                              userSelect: "none",
                            }}
                          >
                            Remember me
                          </Typography>
                        }
                      />
                      <MuiLink
                        component={Link}
                        href="/forgot-password?redirect=/sign-in"
                        underline="hover"
                        sx={{
                          fontFamily: FONTS.OUTFIT_ONLY,
                          fontSize: "13.5px",
                          color: COLORS.PRIMARY,
                          fontWeight: 600,
                          transition: "color 0.2s ease",
                          "&:hover": {
                            color: COLORS.PRIMARY_DARK,
                          },
                        }}
                      >
                        Forgot password?
                      </MuiLink>
                    </Box>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      fullWidth
                      disabled={isSubmitting}
                      variant="contained"
                      endIcon={
                        isSubmitting ? (
                          <CircularProgress size={18} sx={{ color: "white" }} />
                        ) : (
                          <ArrowForwardIcon sx={{ fontSize: 18 }} />
                        )
                      }
                      sx={{
                        background:
                          "linear-gradient(135deg, #FF6200 0%, #FF8533 100%)",
                        color: "white",
                        py: 1.5,
                        borderRadius: "14px",
                        textTransform: "none",
                        fontFamily: FONTS.OUTFIT_ONLY,
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.2px",
                        boxShadow: "0 10px 24px -4px rgba(255, 98, 0, 0.4)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #E65800 0%, #FF7315 100%)",
                          boxShadow: "0 14px 28px -4px rgba(255, 98, 0, 0.5)",
                          transform: "translateY(-1.5px)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                        "&.Mui-disabled": {
                          background: "#E5E7EB",
                          color: "#9CA3AF",
                        },
                      }}
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                  </Box>
                )}
              </Formik>

              {/* Sign Up Link */}
              <Box
                sx={{
                  mt: 2,
                  pt: 0.5,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT_ONLY,
                    color: "#6B7280",
                    fontSize: "14px",
                  }}
                >
                  Don't have an account?{" "}
                  <Link
                    href={
                      redirectParam
                        ? `/sign-up?redirect=${encodeURIComponent(
                            redirectParam
                          )}`
                        : "/sign-up"
                    }
                    style={{
                      color: COLORS.PRIMARY,
                      fontWeight: 700,
                      textDecoration: "none",
                      marginLeft: "4px",
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>

            {/* Vertical Center Divider with Ornamental Motif */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "relative",
                width: "1px",
                alignSelf: "stretch",
                my: 5,
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(220, 190, 160, 0.6) 12%, rgba(220, 190, 160, 0.6) 88%, transparent 100%)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(230, 195, 165, 0.8)",
                  width: 14,
                  height: 14,
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(220, 100, 30, 0.15)",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: COLORS.PRIMARY,
                    borderRadius: "1px",
                  }}
                />
              </Box>
            </Box>

            {/* Right Column: Sacred Branding & Lotus Om Background */}
            <Box
              sx={{
                flex: { md: 1.05 },
                p: { md: "48px 44px" },
                position: "relative",
                overflow: "hidden",
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "flex-start",
                zIndex: 1,
              }}
            >
              {/* Top Sacred Eyebrow */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT_ONLY,
                    fontSize: "11.5px",
                    fontWeight: 700,
                    letterSpacing: "2.2px",
                    color: "#C26D1E",
                    textTransform: "uppercase",
                  }}
                >
                  A Sacred Connection
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: "1px",
                      bgcolor: "rgba(194, 109, 30, 0.4)",
                    }}
                  />
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      rotate: "45deg",
                      bgcolor: "#C26D1E",
                    }}
                  />
                  <Box
                    sx={{
                      width: 18,
                      height: "1px",
                      bgcolor: "rgba(194, 109, 30, 0.4)",
                    }}
                  />
                </Box>
              </Box>

              {/* Main Headline */}
              <Typography
                variant="h3"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  fontSize: { xs: "26px", sm: "32px", md: "36px" },
                  lineHeight: 1.25,
                  color: "#1F1A17",
                  letterSpacing: "-0.5px",
                  mb: 1.8,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                Your devotion.
                <br />
                Our responsibility.
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT_ONLY,
                  fontSize: "14.5px",
                  lineHeight: 1.65,
                  color: "#6B7280",
                  maxWidth: "360px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                Book pooja services, consult verified purohits, and stay
                connected with authentic divine traditions.
              </Typography>

              {/* Sacred Lotus Om Artwork: /images/logincard-bg.png */}
              <Box
                component="img"
                src="/images/logincard-bg.png"
                alt="Sacred Lotus Om Artwork"
                sx={{
                  position: "absolute",
                  bottom: { xs: -10, md: -15 },
                  right: { xs: -10, md: -15 },
                  width: { xs: "220px", sm: "270px", md: "320px", lg: "350px" },
                  height: "auto",
                  objectFit: "contain",
                  pointerEvents: "none",
                  zIndex: 0,
                  opacity: { xs: 0.88, md: 0.95 },
                }}
              />
            </Box>
          </Box>
        </Container>

        {/* Mobile Back Button: Centered Cleanly Below the Card */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "center",
            width: "100%",
            mt: 3,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Button
            component={Link}
            href="/"
            startIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: "rgba(255, 98, 0, 0.12)",
                  color: COLORS.PRIMARY,
                  transition: "all 0.25s ease",
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 15 }} />
              </Box>
            }
            sx={{
              color: "#1F1A17",
              bgcolor: "#FFFFFF",
              border: "1.5px solid rgba(255, 98, 0, 0.28)",
              borderRadius: "32px",
              pl: 1.2,
              pr: 2.4,
              py: 0.8,
              fontFamily: FONTS.OUTFIT_ONLY,
              fontWeight: 600,
              fontSize: "13.5px",
              letterSpacing: "0.1px",
              textTransform: "none",
              boxShadow:
                "0 6px 20px -3px rgba(255, 98, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.05)",
              transition: "all 0.25s ease",
              "& .MuiButton-startIcon": {
                mr: 1,
              },
              "&:hover": {
                bgcolor: "#FFFFFF",
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
                transform: "translateY(-1.5px)",
                boxShadow: "0 8px 24px -3px rgba(255, 98, 0, 0.28)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Back to Website
          </Button>
        </Box>
      </Box>
    </>
  );
}

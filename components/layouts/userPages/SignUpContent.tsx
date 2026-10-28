"use client";

import { sendOtpAPI } from "@/api/userControllers";
import SignUpBrandingSide from "@/components/layouts/userPages/components/SignUpBrandingSide";
import SignUpStep1Personal from "@/components/layouts/userPages/components/SignUpStep1Personal";
import SignUpStep2Address from "@/components/layouts/userPages/components/SignUpStep2Address";
import SignUpStepperHeader from "@/components/layouts/userPages/components/SignUpStepperHeader";
import { useSnackbarStore } from "@/stores/snackbarStore";
import {
  extractBackendErrorMessage,
  EMAIL_STRICT_REGEX,
  EMAIL_STRICT_MESSAGE,
  ADDRESS_STRICT_REGEX,
  ADDRESS_STRICT_MESSAGE,
} from "@/utils/helpers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

const today = new Date();
const fifteenYearsAgo = new Date(
  today.getFullYear() - 15,
  today.getMonth(),
  today.getDate()
);

const step1ValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE)
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9][0-9]{9}$/, "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9")
    .required("Phone number is required"),
  dob: Yup.string()
    .required("Date of birth is required")
    .test(
      "is-valid-date",
      "Please enter a valid Date of Birth",
      (val) => {
        if (!val) return false;
        const d = new Date(val);
        return !isNaN(d.getTime());
      }
    )
    .test(
      "is-15-years-old",
      "Date of birth must be at least 15 years ago",
      (val) => {
        if (!val) return false;
        const d = new Date(val);
        return !isNaN(d.getTime()) && d <= fifteenYearsAgo;
      }
    ),
  birthPlace: Yup.string().required("Birth place is required"),
  rashi: Yup.string().optional(),
  gotra: Yup.string().optional(),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const fullValidationSchema = step1ValidationSchema.concat(
  Yup.object().shape({
    addressLabel: Yup.string().required("Address label is required"),
    fullAddress: Yup.string()
      .matches(ADDRESS_STRICT_REGEX, ADDRESS_STRICT_MESSAGE)
      .required("Full address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
  })
);

export default function SignUpContent() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbarStore();

  let redirectParam = searchParams?.get("redirect");
  const serviceIdParam = searchParams?.get("serviceId");
  const astrologerIdParam = searchParams?.get("astrologerId");
  if (!redirectParam) {
    if (astrologerIdParam) {
      redirectParam = `/customer/astrologers/${astrologerIdParam}`;
    } else if (serviceIdParam) {
      redirectParam = `/customer/services/${serviceIdParam}`;
    } else if (typeof window !== "undefined") {
      redirectParam = sessionStorage.getItem("post_login_redirect");
    }
  }

  useEffect(() => {
    if (redirectParam && typeof window !== "undefined") {
      sessionStorage.setItem("post_login_redirect", redirectParam);
    }
  }, [redirectParam]);

  useEffect(() => {
    const fromParam = searchParams?.get("from");
    if (fromParam === "book-now" || fromParam === "booking") {
      showSnackbar("For booking, you have to register yourself first.", "info");
    }
  }, [searchParams, showSnackbar]);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        const role = userObj?.role;
        if (role === "CUSTOMER") {
          if (redirectParam && redirectParam.startsWith("/customer/")) {
            sessionStorage.removeItem("post_login_redirect");
            router.replace(redirectParam);
          } else {
            router.replace("/customer/dashboard");
          }
        } else if (role === "PUROHIT") {
          router.replace("/partner/dashboard");
        } else if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
          router.replace("/admin/dashboard");
        }
      } catch (e) {}
    }
  }, [router, redirectParam]);

  const handleFetchCurrentLocation = (setFieldValue: any) => {
    if (!navigator.geolocation) {
      showSnackbar("Geolocation is not supported by your browser", "error");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toString();
        const lon = position.coords.longitude.toString();

        setFieldValue("latitude", lat);
        setFieldValue("longitude", lon);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          if (res.ok) {
            const data = await res.json();
            const addressObj = data.address || {};

            setFieldValue("fullAddress", data.display_name || "");
            setFieldValue(
              "city",
              addressObj.city ||
                addressObj.town ||
                addressObj.village ||
                addressObj.state_district ||
                ""
            );
            setFieldValue("state", addressObj.state || "");
            setFieldValue("pincode", addressObj.postcode || "");
          }
        } catch (err) {
          console.error("Failed to reverse geocode:", err);
        }

        showSnackbar("Location data fetched successfully!", "success");
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error(error);
        showSnackbar(
          "Failed to fetch location. Please allow location access.",
          "error"
        );
        setIsFetchingLocation(false);
      }
    );
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    birthPlace: "",
    rashi: "",
    gotra: "",
    password: "",
    confirmPassword: "",

    venueType: "HOME",
    addressLabel: "Home",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    isDefault: true,
  };

  const signInHref = redirectParam
    ? `/sign-in?redirect=${encodeURIComponent(redirectParam)}`
    : "/sign-in";

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
        "@media (max-height: 740px)": {
          py: 1.5,
        },
        "@media (max-height: 660px)": {
          py: 1,
        },
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
          href="/"
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
            fontFamily: FONTS.OUTFIT_ONLY,
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
          Back to Website
        </Button>
      </Box>

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
            maxWidth: { xs: "100%", sm: "580px", md: "890px", lg: "900px" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: { xs: "20px", md: "24px" },
            overflow: "hidden",
            bgcolor: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255, 255, 255, 0.92)",
            boxShadow:
              "0 25px 70px -15px rgba(210, 100, 30, 0.18), 0 10px 28px rgba(0, 0, 0, 0.05), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* Left Side Branding */}
          <SignUpBrandingSide />

              {/* Right Side Form */}
              <Box
                sx={{
                  flex: 1.5,
                  p: { xs: 3, md: 4 },
                  bgcolor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Formik
                  initialValues={initialValues}
                  validationSchema={fullValidationSchema}
                  validateOnChange={true}
                  validateOnBlur={true}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const res = await sendOtpAPI({
                        phone: values.phone,
                        email: values.email,
                        role: "CUSTOMER",
                      });
                      if (res.success || res.statusCode === 200) {
                        sessionStorage.setItem(
                          "signupData",
                          JSON.stringify(values)
                        );
                        showSnackbar(res?.message || "OTP sent successfully!", "success");
                        const targetOtpUrl = redirectParam
                          ? `/verify-otp?redirect=${encodeURIComponent(redirectParam)}`
                          : "/verify-otp";
                        router.replace(targetOtpUrl);
                      } else {
                        showSnackbar(
                          res?.message || "Failed to send OTP",
                          "error"
                        );
                      }
                    } catch (error: any) {
                      showSnackbar(
                        extractBackendErrorMessage(error, "Failed to send OTP"),
                        "error"
                      );
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({
                    isSubmitting,
                    values,
                    setFieldValue,
                    setTouched,
                  }) => {
                    const handleStep1Next = async () => {
                      try {
                        await step1ValidationSchema.validate(values, {
                          abortEarly: false,
                        });
                        setCurrentStep(2);
                      } catch (err: any) {
                        if (err.inner) {
                          const touchedObj: any = {};
                          err.inner.forEach((e: any) => {
                            if (e.path) touchedObj[e.path] = true;
                          });
                          setTouched(touchedObj);
                        }
                        showSnackbar(
                          "Please fill all required personal details correctly",
                          "error"
                        );
                      }
                    };

                    return (
                      <Box
                        component={Form}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === "Enter") {
                            const target = e.target as HTMLElement;
                            if (target.tagName?.toLowerCase() === "textarea") return;
                            if (currentStep === 1) {
                              e.preventDefault();
                              handleStep1Next();
                            }
                          }
                        }}
                      >
                        {/* Header with Step Progress */}
                        <SignUpStepperHeader
                          currentStep={currentStep}
                          onStep1Click={() => setCurrentStep(1)}
                          onStep2Click={handleStep1Next}
                        />

                        {/* STEP 1 */}
                        {currentStep === 1 && (
                          <SignUpStep1Personal onNext={handleStep1Next} />
                        )}

                        {/* STEP 2 */}
                        {currentStep === 2 && (
                          <SignUpStep2Address
                            isFetchingLocation={isFetchingLocation}
                            isSubmitting={isSubmitting}
                            onFetchLocation={() =>
                              handleFetchCurrentLocation(setFieldValue)
                            }
                            onBack={() => setCurrentStep(1)}
                          />
                        )}
                      </Box>
                    );
                  }}
                </Formik>

            {/* Divider */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                my: 1,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  bgcolor: "rgba(220, 200, 185, 0.55)",
                }}
              />
              <Typography
                sx={{
                  px: 1.5,
                  fontSize: "11px",
                  color: "#9CA3AF",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 500,
                }}
              >
                or
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  bgcolor: "rgba(220, 200, 185, 0.55)",
                }}
              />
            </Box>

            {/* Already have an account */}
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#6B7280",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Already have an account?{" "}
              <Link
                href={signInHref}
                style={{
                  color: "#FF6200",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Mobile Back to Website */}
      <Box sx={{ display: { xs: "block", md: "none" }, mt: 3, textAlign: "center" }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon fontSize="small" />}
          sx={{
            color: "#4B5563",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 600,
            fontSize: "13px",
            textTransform: "none",
          }}
        >
          Back to Website
        </Button>
      </Box>
    </Box>
  );
}


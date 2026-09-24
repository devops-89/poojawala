"use client";

import { sendOtpAPI } from "@/api/userControllers";
import SignUpBrandingSide from "@/components/layouts/userPages/components/SignUpBrandingSide";
import SignUpStep1Personal from "@/components/layouts/userPages/components/SignUpStep1Personal";
import SignUpStep2Address from "@/components/layouts/userPages/components/SignUpStep2Address";
import SignUpStepperHeader from "@/components/layouts/userPages/components/SignUpStepperHeader";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { useSnackbarStore } from "@/stores/snackbarStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

const emailTldRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co\.in|info|biz|io|co|us|uk|ca|au)$/i;

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
    .matches(
      emailTldRegex,
      "Please enter a valid email address with a valid TLD (e.g. .com, .in)"
    )
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  dob: Yup.date()
    .max(fifteenYearsAgo, "Date of birth must be at least 15 years ago")
    .required("Date of birth is required"),
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
    fullAddress: Yup.string().required("Full address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
  })
);

export default function SignUpContent() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

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
    latitude: "0",
    longitude: "0",
    isDefault: true,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FFFDF9",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decor */}
      <Box
        component="img"
        src="/images/home/chakra.webp"
        alt="Chakra Decor Left"
        sx={{
          position: "absolute",
          top: -150,
          left: -150,
          width: "500px",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        component="img"
        src="/images/home/chakraright.webp"
        alt="Chakra Decor Right"
        sx={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: "500px",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 2, md: 2 },
          px: { xs: 2, md: 3 },
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <Grid size={{ xs: 12, md: 11, lg: 10 }}>
            <Paper
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 15px 45px rgba(0,0,0,0.08)",
                border: "1px solid #FFE0D0",
              }}
            >
              {/* Left Side Branding */}
              <SignUpBrandingSide />

              {/* Right Side Form */}
              <Box
                sx={{
                  flex: 1.4,
                  p: { xs: 2.5, md: 3.5 },
                  bgcolor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Formik
                  initialValues={initialValues}
                  validationSchema={fullValidationSchema}
                  validateOnChange={false}
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
                        showSnackbar("OTP sent successfully!", "success");
                        router.push("/verify-otp");
                      } else {
                        showSnackbar(
                          res.message || "Failed to send OTP",
                          "error"
                        );
                      }
                    } catch (error: any) {
                      showSnackbar(
                        error?.response?.data?.message ||
                          error.message ||
                          "Failed to send OTP",
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
                  }) => (
                    <Box component={Form}>
                      <FormikValidationSnackbar />

                      {/* Header with Step Progress */}
                      <SignUpStepperHeader
                        currentStep={currentStep}
                        onStep1Click={() => setCurrentStep(1)}
                        onStep2Click={async () => {
                          try {
                            await step1ValidationSchema.validate(values, {
                              abortEarly: false,
                            });
                            setCurrentStep(2);
                          } catch (err: any) {
                            showSnackbar(
                              "Please complete personal details first",
                              "error"
                            );
                          }
                        }}
                      />

                      {/* STEP 1 */}
                      {currentStep === 1 && (
                        <SignUpStep1Personal
                          onNext={async () => {
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
                          }}
                        />
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

                      <Box sx={{ mt: 1.5 }}>
                        <Button
                          component={Link}
                          href="/"
                          fullWidth
                          variant="outlined"
                          startIcon={<ArrowBackIcon fontSize="small" />}
                          sx={{
                            py: 0.75,
                            borderRadius: "24px",
                            borderColor: "#FFE0D0",
                            color: "#475569",
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 600,
                            fontSize: "13px",
                            textTransform: "none",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: "#FFF0E6",
                              color: "#FF6200",
                              borderColor: "#FF6200",
                            },
                          }}
                        >
                          Go to Website
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Formik>

                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#666",
                    textAlign: "center",
                    mt: 1.5,
                    fontSize: "13px",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
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
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


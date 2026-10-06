"use client";

import { getMeAPI, resendOtpAPI } from "@/api/authControllers";
import {
  registerPurohitAPI,
  sendOtpAPI,
  verifyOtpAPI,
} from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { convertImageToWebP } from "@/utils/imageHelper";
import {
  Box,
  Button,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import DocumentPreviewDialog from "./register/components/DocumentPreviewDialog";
import RegisterHeader from "./register/components/RegisterHeader";
import Step0BasicDetails from "./register/components/Step0BasicDetails";
import Step1OtpVerification from "./register/components/Step1OtpVerification";
import Step2PurohitProfile from "./register/components/Step2PurohitProfile";
import Step3BankDetails from "./register/components/Step3BankDetails";
import Step4DocumentUpload from "./register/components/Step4DocumentUpload";
import Step5ServiceArea from "./register/components/Step5ServiceArea";
import { maxDobDate, steps, validationSchema } from "./register/constants";

const DRAFT_STORAGE_KEY = "purohit_register_draft";

export default function PortalRegisterContent() {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "0", 10);
  const isAdminFlow = initialStep === 2;
  const [activeStep, setActiveStep] = useState(initialStep);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.role === "PUROHIT") {
          if (!userObj.isAdminCreated && !userObj.is_admin_created) {
            router.replace("/purohit/dashboard");
          }
        } else if (userObj.role === "CUSTOMER") {
          router.replace("/customer/dashboard");
        } else if (
          userObj.role === "ADMIN" ||
          userObj.role === "SUPERADMIN" ||
          userObj.role === "SUPER_ADMIN"
        ) {
          router.replace("/admin/dashboard");
        }
      } catch (e) {}
    }
  }, [router]);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      countryCode: "+91",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      otp: ["", "", "", "", "", ""],
      bio: "",
      qualification: "",
      experienceYears: "",
      aadhaarNumber: "",
      state: "",
      city: "",
      languages: [],
      specializations: [],
      isOnlineAvailable: true,
      isOfflineAvailable: true,
      paymentMethod: "BANK",
      upiId: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      documents: {
        identityDoc: null,
        certificate: null,
        templeAffiliationProof: null,
        profilePhoto: null,
      },
      serviceArea: {
        addressLabel: "Primary Service Area",
        streetName: "",
        fullAddress: "",
        city: "",
        state: "",
        pincode: "",
        latitude: 0,
        longitude: 0,
        serviceRadiusKm: 15,
      },
    },
    validationSchema: validationSchema[activeStep],
    onSubmit: async (values) => {
      if (activeStep === 0) {
        if (isOtpVerified) {
          setActiveStep(2);
          formik.setTouched({});
          return;
        }
        setIsSendingOtp(true);
        try {
          const res = await sendOtpAPI({
            phone: values.mobileNumber,
            email: values.email,
            role: "PUROHIT",
            countryCode: values.countryCode,
          });
          if (res.success || res.message) {
            showSnackbar("OTP sent successfully!", "success");
            setActiveStep(1);
            formik.setTouched({});
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message;
          const displayMsg = Array.isArray(errorMsg)
            ? errorMsg.join(", ")
            : errorMsg || "Failed to send OTP";
          showSnackbar(displayMsg, "error");
        } finally {
          setIsSendingOtp(false);
        }
        return;
      }

      if (activeStep === 1) {
        setIsVerifyingOtp(true);
        try {
          const otpStr = values.otp.join("");
          if (otpStr.length < 6) {
            showSnackbar("Please enter 6-digit OTP", "error");
            setIsVerifyingOtp(false);
            return;
          }
          const res = await verifyOtpAPI({
            phone: values.mobileNumber,
            email: values.email,
            otp: otpStr,
            role: "PUROHIT",
            countryCode: values.countryCode,
          });
          if (res.success || res.message) {
            showSnackbar("OTP Verified successfully!", "success");
            setIsOtpVerified(true);
            setActiveStep(2);
            formik.setTouched({});
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message;
          const displayMsg = Array.isArray(errorMsg)
            ? errorMsg.join(", ")
            : errorMsg || "Invalid OTP";
          showSnackbar(displayMsg, "error");
        } finally {
          setIsVerifyingOtp(false);
        }
        return;
      }

      if (activeStep === steps.length - 1) {
        setIsSubmittingForm(true);
        try {
          const fd = new FormData();
          if (!isAdminFlow) {
            const nameParts = values.fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ");

            fd.append("firstName", firstName);
            fd.append("lastName", lastName);
            fd.append("phone", values.mobileNumber);
            fd.append("countryCode", values.countryCode);
            fd.append("email", values.email);
            fd.append("password", values.password);
            fd.append("confirmPassword", values.confirmPassword);
            fd.append("dob", values.dob);
          }

          fd.append("bio", values.bio);
          fd.append("qualification", values.qualification);
          fd.append("experienceYears", values.experienceYears.toString());
          fd.append("aadhaarNumber", values.aadhaarNumber);
          fd.append("state", values.state);
          fd.append("city", values.city);

          if (isAdminFlow) {
            const userStr = sessionStorage.getItem("user");
            if (userStr) {
              try {
                const userObj = JSON.parse(userStr);
                if (userObj.id) {
                  fd.append("id", userObj.id.toString());
                }
              } catch (e) {
                console.error("Error parsing user from session storage", e);
              }
            }
          }

          values.languages.forEach((l) => fd.append("languages", l as never));
          values.specializations.forEach((s) =>
            fd.append("specializations", s as never),
          );

          fd.append(
            "isOnlineAvailable",
            values.isOnlineAvailable ? "true" : "false",
          );
          fd.append(
            "isOfflineAvailable",
            values.isOfflineAvailable ? "true" : "false",
          );

          fd.append("paymentMethod", values.paymentMethod);
          if (values.paymentMethod === "UPI") {
            fd.append("upiId", values.upiId);
          } else {
            fd.append("accountHolderName", values.accountName);
            fd.append("accountNumber", values.accountNumber);
            fd.append("ifscCode", values.ifscCode);
            fd.append("bankName", values.bankName);
          }

          if (values.documents.identityDoc)
            fd.append(
              "aadhaarDoc",
              await convertImageToWebP(values.documents.identityDoc),
            );
          if (values.documents.certificate)
            fd.append(
              "certificate",
              await convertImageToWebP(values.documents.certificate),
            );
          if (values.documents.templeAffiliationProof)
            fd.append(
              "templeAffiliationProof",
              await convertImageToWebP(values.documents.templeAffiliationProof),
            );
          if (values.documents.profilePhoto)
            fd.append(
              "profileImage",
              await convertImageToWebP(values.documents.profilePhoto),
            );

          const sa = values.serviceArea || {};
          const serviceAreaObj = {
            addressLabel: sa.addressLabel || "Primary Service Area",
            streetName: sa.streetName || "",
            fullAddress: sa.fullAddress || "",
            city: sa.city || values.city || "",
            state: sa.state || values.state || "",
            pincode: sa.pincode || "",
            latitude: Number(sa.latitude) || 0,
            longitude: Number(sa.longitude) || 0,
            serviceRadiusKm: Number(sa.serviceRadiusKm || 15),
          };

          fd.append("serviceArea", JSON.stringify(serviceAreaObj));
          fd.append("serviceRadiusKm", serviceAreaObj.serviceRadiusKm.toString());

          const res = await registerPurohitAPI(fd);
          if (res.success || res.message) {
            const token =
              res.tokens?.access?.token || res.token || res.accessToken;
            try {
              const meResponse = await getMeAPI(token);
              sessionStorage.setItem(
                "user",
                JSON.stringify(
                  meResponse?.user ||
                    meResponse?.data ||
                    meResponse ||
                    res.user,
                ),
              );
            } catch (e) {
              sessionStorage.setItem("user", JSON.stringify(res.user));
            }
            if (res.csrfToken) {
              sessionStorage.setItem("csrfToken", res.csrfToken);
            }
            try {
              sessionStorage.removeItem(DRAFT_STORAGE_KEY);
              localStorage.removeItem(DRAFT_STORAGE_KEY);
            } catch (e) {
              console.error("Failed to remove draft", e);
            }
            showSnackbar("Registration successful!", "success");
            router.replace("/purohit/dashboard");
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message;
          const displayMsg = Array.isArray(errorMsg)
            ? errorMsg.join(", ")
            : errorMsg || "Registration failed";
          showSnackbar(displayMsg, "error");
        } finally {
          setIsSubmittingForm(false);
        }
      } else {
        setActiveStep((prev) => prev + 1);
        formik.setTouched({});
      }
    },
  });

  // Restore draft state from sessionStorage on mount (cleared when tab is closed)
  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.role === "PUROHIT" && !(userObj.isAdminCreated || userObj.is_admin_created)) {
          router.replace("/purohit/dashboard");
          return;
        }
      } catch (e) {}
    }

    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);

      const saved = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.values) {
          formik.setValues({
            ...formik.initialValues,
            ...parsed.values,
            otp: parsed.values.otp || ["", "", "", "", "", ""],
            documents: {
              identityDoc: null,
              certificate: null,
              templeAffiliationProof: null,
              profilePhoto: null,
            },
          });
        }
        if (typeof parsed.isOtpVerified === "boolean") {
          setIsOtpVerified(parsed.isOtpVerified);
        }
        if (typeof parsed.activeStep === "number" && !isAdminFlow) {
          let restoredStep = parsed.activeStep;
          if (restoredStep === 1 && parsed.isOtpVerified) {
            restoredStep = 2;
          }
          setActiveStep(restoredStep);
        }
      }
    } catch (e) {
      console.error("Failed to restore draft from sessionStorage", e);
    } finally {
      setIsRestored(true);
    }
  }, []);

  // Save state to sessionStorage whenever formik values or activeStep change
  useEffect(() => {
    if (!isRestored) return;
    try {
      const draft = {
        values: {
          fullName: formik.values.fullName,
          countryCode: formik.values.countryCode,
          mobileNumber: formik.values.mobileNumber,
          email: formik.values.email,
          password: formik.values.password,
          confirmPassword: formik.values.confirmPassword,
          dob: formik.values.dob,
          otp: formik.values.otp,
          bio: formik.values.bio,
          qualification: formik.values.qualification,
          experienceYears: formik.values.experienceYears,
          aadhaarNumber: formik.values.aadhaarNumber,
          state: formik.values.state,
          city: formik.values.city,
          languages: formik.values.languages,
          specializations: formik.values.specializations,
          isOnlineAvailable: formik.values.isOnlineAvailable,
          isOfflineAvailable: formik.values.isOfflineAvailable,
          paymentMethod: formik.values.paymentMethod,
          upiId: formik.values.upiId,
          bankName: formik.values.bankName,
          accountName: formik.values.accountName,
          accountNumber: formik.values.accountNumber,
          ifscCode: formik.values.ifscCode,
        },
        activeStep,
        isOtpVerified,
      };
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to save draft to sessionStorage", e);
    }
  }, [formik.values, activeStep, isOtpVerified, isRestored]);

  // Resend OTP Timer
  useEffect(() => {
    let interval: any = null;
    if (activeStep === 1 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeStep, resendTimer]);

  const handlePortalResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await sendOtpAPI({
        phone: formik.values.mobileNumber,
        email: formik.values.email,
        role: "PUROHIT",
        countryCode: formik.values.countryCode,
      });
      showSnackbar("OTP resent successfully!", "success");
      setResendTimer(30);
    } catch (err: any) {
      showSnackbar(
        err.response?.data?.message || "Failed to resend OTP",
        "error",
      );
    }
  };

  const handleBack = () => {
    if (activeStep === 2 && isOtpVerified) {
      setActiveStep(0);
    } else {
      setActiveStep((prev) => Math.max(0, prev - 1));
    }
  };

  const handleStepClick = async (targetIndex: number) => {
    if (targetIndex === activeStep) return;

    // Going backward
    if (targetIndex < activeStep) {
      if (targetIndex === 1 && isOtpVerified) {
        setActiveStep(0);
      } else {
        setActiveStep(targetIndex);
      }
      return;
    }

    // Going forward - validate current step first
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      const touchedObj: any = {};
      const markTouched = (obj: any, prefix = "") => {
        Object.keys(obj).forEach((key) => {
          const fieldPath = prefix ? `${prefix}.${key}` : key;
          if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            markTouched(obj[key], fieldPath);
          } else {
            touchedObj[fieldPath] = true;
          }
        });
      };
      markTouched(errors);
      formik.setTouched(touchedObj);

      const extractErrors = (obj: any): string[] => {
        let msgs: string[] = [];
        Object.values(obj).forEach((val: any) => {
          if (typeof val === "string") {
            msgs.push(val);
          } else if (typeof val === "object" && val !== null) {
            msgs = msgs.concat(extractErrors(val));
          }
        });
        return msgs;
      };

      const errorMsgs = extractErrors(errors);
      showSnackbar(
        errorMsgs[0] || "Please fill in mandatory fields in current step",
        "error",
      );
      return;
    }

    // Moving forward
    if (targetIndex === 1 && isOtpVerified) {
      setActiveStep(2);
    } else {
      setActiveStep(targetIndex);
    }
  };

  const handleStepSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      const touchedObj: any = {};
      const markTouched = (obj: any, prefix = "") => {
        Object.keys(obj).forEach((key) => {
          const fieldPath = prefix ? `${prefix}.${key}` : key;
          if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            markTouched(obj[key], fieldPath);
          } else {
            touchedObj[fieldPath] = true;
          }
        });
      };
      markTouched(errors);
      formik.setTouched(touchedObj);

      const extractErrors = (obj: any): string[] => {
        let msgs: string[] = [];
        Object.values(obj).forEach((val: any) => {
          if (typeof val === "string") {
            msgs.push(val);
          } else if (typeof val === "object" && val !== null) {
            msgs = msgs.concat(extractErrors(val));
          }
        });
        return msgs;
      };

      const errorMsgs = extractErrors(errors);
      const firstMsg = errorMsgs[0] || "Please fill in all mandatory fields";
      showSnackbar(firstMsg, "error");
    } else {
      formik.handleSubmit(e);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#FFFDF9",
      }}
    >
      <RegisterHeader />

      <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: "24px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
            border: "1px solid #eee",
          }}
        >
          <Stepper
            activeStep={isAdminFlow ? activeStep - 2 : activeStep}
            alternativeLabel
            sx={{
              mb: 6,
              "& .MuiStepIcon-root.Mui-active": { color: "#FF6200" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#FF6200" },
              "& .MuiStep-root": { cursor: "pointer" },
            }}
          >
            {(isAdminFlow ? steps.slice(2) : steps).map((label, index) => {
              const stepIdx = isAdminFlow ? index + 2 : index;
              return (
                <Step
                  key={label}
                  onClick={() => handleStepClick(stepIdx)}
                  sx={{ cursor: "pointer" }}
                >
                  <StepLabel
                    sx={{
                      cursor: "pointer",
                      "& .MuiStepLabel-label": {
                        fontFamily: "var(--font-outfit), sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <form onSubmit={handleStepSubmit}>
            {activeStep === 0 && (
              <Step0BasicDetails
                formik={formik}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                maxDobDate={maxDobDate}
              />
            )}

            {activeStep === 1 && (
              <Step1OtpVerification
                formik={formik}
                resendTimer={resendTimer}
                handlePortalResendOtp={handlePortalResendOtp}
                otpRefs={otpRefs}
              />
            )}

            {activeStep === 2 && <Step2PurohitProfile formik={formik} />}

            {activeStep === 3 && <Step3BankDetails formik={formik} />}

            {activeStep === 4 && (
              <Step4DocumentUpload
                formik={formik}
                setPreviewFile={setPreviewFile}
              />
            )}

            {activeStep === 5 && <Step5ServiceArea formik={formik} />}

            <Box
              sx={{
                display: "flex",
                justifyContent: activeStep === 0 ? "flex-end" : "space-between",
                alignItems: "center",
                width: "100%",
                mt: 6,
              }}
            >
              {activeStep > 0 && (
                <Button
                  disabled={isSendingOtp || isVerifyingOtp || isSubmittingForm}
                  onClick={handleBack}
                  type="button"
                  sx={{
                    background: "#FF6200",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "30px",
                    px: 4,
                    boxShadow: "none",
                    "&:hover": { background: "#F05A00", boxShadow: "none" },
                    "&.Mui-disabled": {
                      background: "#FFE0D0",
                      color: "#FFA07A",
                    },
                  }}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSendingOtp || isVerifyingOtp || isSubmittingForm}
                sx={{
                  background: "#FF6200",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "30px",
                  px: 4,
                  boxShadow: "none",
                  "&:hover": { background: "#F05A00", boxShadow: "none" },
                  "&.Mui-disabled": {
                    background: "#FFE0D0",
                    color: "#FFA07A",
                  },
                }}
              >
                {activeStep === steps.length - 1
                  ? isSubmittingForm
                    ? "Submitting..."
                    : "Submit Registration"
                  : activeStep === 0
                    ? isOtpVerified
                      ? "Next Step"
                      : isSendingOtp
                        ? "Sending OTP..."
                        : "Next Step"
                    : activeStep === 1
                      ? isVerifyingOtp
                        ? "Verifying..."
                        : "Verify OTP"
                      : "Next Step"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>

      <DocumentPreviewDialog
        previewFile={previewFile}
        setPreviewFile={setPreviewFile}
      />
    </Box>
  );
}

"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS, USER_ROLE } from "@/utils/enums";
import { extractBackendErrorMessage } from "@/utils/helpers";

import { getMeAPI, resendOtpAPI } from "@/api/authControllers";
import {
  registerPurohitAPI,
  sendOtpAPI,
  verifyOtpAPI,
} from "@/api/userControllers";
import { extractRoleCsrfToken, saveRoleCsrfToken } from "@/api/config";
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
import { useFormik, yupToFormErrors } from "formik";
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
import {
  maxDobDate,
  getStepsForRole,
  stepValidationSchemas,
} from "./register/constants";
import { cleanItem } from "@/components/layouts/adminLayout/astrologers/EditAstrologerForm";

const DRAFT_STORAGE_KEY = "purohit_register_draft";

export default function PortalRegisterContent() {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "0", 10);
  const isAdminFlow = initialStep === 2;
  const [activeStep, setActiveStep] = useState(initialStep);
  const [lastActiveStep, setLastActiveStep] = useState<number>(2);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpVerifiedAt, setOtpVerifiedAt] = useState<number | null>(null);
  const [isRestored, setIsRestored] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  useEffect(() => {
    if (activeStep > 1) {
      setLastActiveStep(activeStep);
    }
  }, [activeStep]);

  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const checkOtpExpiration = (): boolean => {
    if (isOtpVerified && otpVerifiedAt && !isAdminFlow) {
      const elapsed = Date.now() - otpVerifiedAt;
      const THIRTY_MINUTES_MS = 30 * 60 * 1000;
      if (elapsed > THIRTY_MINUTES_MS) {
        setIsOtpVerified(false);
        setOtpVerifiedAt(null);
        setActiveStep(1);
        formik.setFieldValue("otp", ["", "", "", "", "", ""]);
        showSnackbar(
          "Your OTP verification has expired. Please verify OTP again.",
          "error"
        );
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (isAdminFlow) return;

    const verifyExpiration = () => {
      if (isOtpVerified && otpVerifiedAt) {
        const elapsed = Date.now() - otpVerifiedAt;
        if (elapsed > 30 * 60 * 1000) {
          setIsOtpVerified(false);
          setOtpVerifiedAt(null);
          setActiveStep(1);
          formik.setFieldValue("otp", ["", "", "", "", "", ""]);
          showSnackbar(
            "Your 30-minute OTP verification session has expired. Please verify OTP again.",
            "error"
          );
        }
      }
    };

    verifyExpiration();
    const timer = setInterval(verifyExpiration, 10000);
    window.addEventListener("focus", verifyExpiration);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", verifyExpiration);
    };
  }, [isOtpVerified, otpVerifiedAt, isAdminFlow, showSnackbar]);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.role === "PUROHIT" || userObj.role === "ASTROLOGER") {
          if (!userObj.isAdminCreated && !userObj.is_admin_created) {
            if (userObj.role === "ASTROLOGER") {
              router.replace("/partner/astrologybookings");
            } else {
              router.replace("/partner/dashboard");
            }
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
      role: "",
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
      astrologyPrice: "",
      ratePerMinute: "",
      paymentMethod: "BANK",
      upiId: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      identityDocType: "aadhaar",
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
    validate: (values) => {
      const stepList = getStepsForRole(values.role);
      const safeStep = Math.min(activeStep, Math.max(0, stepList.length - 1));
      const stepObj = stepList[safeStep] || stepList[0];
      const schema = stepValidationSchemas[stepObj.id];
      if (!schema) return {};
      try {
        schema.validateSync(values, { abortEarly: false, context: { role: values.role } });
        return {};
      } catch (err: any) {
        return yupToFormErrors(err);
      }
    },
    onSubmit: async (values) => {
      const stepList = getStepsForRole(values.role);
      const safeStep = Math.min(activeStep, Math.max(0, stepList.length - 1));
      const stepObj = stepList[safeStep] || stepList[0];
      const isLastStep = safeStep === stepList.length - 1;

      if (stepObj.id === "basic") {
        if (isOtpVerified && !checkOtpExpiration()) {
          setActiveStep(2);
          formik.setTouched({});
          return;
        }
        setIsSendingOtp(true);
        try {
          const res = await sendOtpAPI({
            phone: values.mobileNumber,
            email: values.email,
            role: values.role,
            countryCode: values.countryCode,
          });
          if (res.success || res.message) {
            showSnackbar("OTP sent successfully!", "success");
            setActiveStep(1);
            formik.setTouched({});
          }
        } catch (error: any) {
          showSnackbar(extractBackendErrorMessage(error, "Failed to send OTP"), "error");
        } finally {
          setIsSendingOtp(false);
        }
        return;
      }

      if (stepObj.id === "otp") {
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
            role: values.role,
            countryCode: values.countryCode,
          });
          if (res.success || res.message) {
            showSnackbar("OTP Verified successfully!", "success");
            setIsOtpVerified(true);
            setOtpVerifiedAt(Date.now());
            setActiveStep(Math.max(2, lastActiveStep));
            formik.setTouched({});
          }
        } catch (error: any) {
          showSnackbar(extractBackendErrorMessage(error, "Invalid OTP"), "error");
        } finally {
          setIsVerifyingOtp(false);
        }
        return;
      }

      if (isLastStep) {
        if (checkOtpExpiration()) return;
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
          fd.append("qualification", cleanItem(values.qualification));
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

          const cleanLangs = Array.from(
            new Set((values.languages || []).map(cleanItem).filter(Boolean))
          );
          cleanLangs.forEach((l) => fd.append("languages", l as never));

          const cleanSpecs = Array.from(
            new Set(
              (values.specializations || []).map(cleanItem).filter(Boolean)
            )
          );
          cleanSpecs.forEach((s) => fd.append("specializations", s as never));

          fd.append(
            "isOnlineAvailable",
            values.isOnlineAvailable ? "true" : "false",
          );
          fd.append(
            "isOfflineAvailable",
            values.isOfflineAvailable ? "true" : "false",
          );

          if (values.role === USER_ROLE.ASTROLOGER) {
            const priceVal = values.astrologyPrice || values.ratePerMinute;
            if (priceVal) {
              fd.append("astrologyPrice", priceVal.toString());
              fd.append("ratePerMinute", priceVal.toString());
            }
          }

          if (values.paymentMethod) {
            fd.append("paymentMethod", values.paymentMethod);
            if (values.paymentMethod === "UPI") {
              fd.append("upiId", values.upiId);
            } else {
              fd.append("accountHolderName", values.accountName);
              fd.append("accountNumber", values.accountNumber);
              fd.append("ifscCode", values.ifscCode);
              fd.append("bankName", values.bankName);
            }
          }

          if (values.documents.identityDoc) {
            const docField =
              values.identityDocType === "pan" ? "panDoc" : "aadhaarDoc";
            fd.append(
              docField,
              await convertImageToWebP(values.documents.identityDoc),
            );
          }
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

          if (values.role !== USER_ROLE.ASTROLOGER) {
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
          }

          const res = await registerPurohitAPI(fd);
          if (res.success || res.message) {
            const token =
              res.tokens?.access?.token || res.token || res.accessToken;
            let userObj = res.user;
            if (token) {
              try {
                const meResponse = await getMeAPI(token);
                userObj =
                  meResponse?.user ||
                  meResponse?.data ||
                  meResponse ||
                  res.user;
              } catch (e) {
                console.error("Error fetching user after register", e);
              }
            }
            if (userObj) {
              sessionStorage.setItem("user", JSON.stringify(userObj));
            }
            const activeRole = userObj?.role || res.user?.role || values.role;
            const csrf = extractRoleCsrfToken(res, activeRole);
            if (csrf) {
              saveRoleCsrfToken(csrf, activeRole);
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
            if (activeRole === "ASTROLOGER") {
              router.replace("/partner/astrologybookings");
            } else {
              router.replace("/partner/dashboard");
            }
          }
        } catch (error: any) {
          const errMsg = extractBackendErrorMessage(error, "Registration failed");
          const lowerMsg = errMsg.toLowerCase();
          const isOtpOrSessionError =
            lowerMsg.includes("otp") ||
            lowerMsg.includes("expire") ||
            lowerMsg.includes("verify") ||
            lowerMsg.includes("session") ||
            lowerMsg.includes("unauthorized") ||
            error.response?.status === 400 ||
            error.response?.status === 401;

          if (isOtpOrSessionError && !isAdminFlow) {
            setIsOtpVerified(false);
            setOtpVerifiedAt(null);
            setActiveStep(1);
            formik.setFieldValue("otp", ["", "", "", "", "", ""]);
            showSnackbar(`${errMsg}. Please verify OTP again.`, "error");
          } else {
            showSnackbar(errMsg, "error");
          }




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
        if ((userObj.role === "PUROHIT" || userObj.role === "ASTROLOGER") && !(userObj.isAdminCreated || userObj.is_admin_created)) {
          if (userObj.role === "ASTROLOGER") {
            router.replace("/partner/astrologybookings");
          } else {
            router.replace("/partner/dashboard");
          }
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
            identityDocType: parsed.values.identityDocType || "aadhaar",
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
        if (typeof parsed.otpVerifiedAt === "number") {
          const elapsed = Date.now() - parsed.otpVerifiedAt;
          if (elapsed > 30 * 60 * 1000) {
            setIsOtpVerified(false);
            setOtpVerifiedAt(null);
            if (!isAdminFlow) setActiveStep(1);
          } else {
            setOtpVerifiedAt(parsed.otpVerifiedAt);
          }
        }


        if (typeof parsed.lastActiveStep === "number") {
          setLastActiveStep(parsed.lastActiveStep);
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
          role: formik.values.role,
          astrologyPrice: formik.values.astrologyPrice,
          ratePerMinute: formik.values.ratePerMinute,
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
        lastActiveStep,
        isOtpVerified,
        otpVerifiedAt,
      };
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to save draft to sessionStorage", e);
    }
  }, [formik.values, activeStep, lastActiveStep, isOtpVerified, otpVerifiedAt, isRestored]);

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
        role: formik.values.role,
        countryCode: formik.values.countryCode,
      });
      showSnackbar("OTP resent successfully!", "success");
      setResendTimer(30);
    } catch (err: any) {
      showSnackbar(
        extractBackendErrorMessage(err, "Failed to resend OTP"),
        "error",
      );
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));

  };

  const handleStepClick = async (targetIndex: number) => {
    if (targetIndex === activeStep) return;

    // Going backward
    if (targetIndex < activeStep) {
      setActiveStep(targetIndex);
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

  const currentStepList = getStepsForRole(formik.values.role);
  const safeActiveStep = Math.min(
    activeStep,
    Math.max(0, currentStepList.length - 1)
  );
  const currentStep = currentStepList[safeActiveStep] || currentStepList[0];
  const isLastStep = safeActiveStep === currentStepList.length - 1;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: "url('/images/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: { xs: "70% center", md: "center" },
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <RegisterHeader />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper
          sx={{
            width: "100%",
            p: { xs: 3, md: 5 },
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 250, 245, 0.22) 100%)",
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
            border: "1.5px solid rgba(255, 255, 255, 0.85)",
            boxShadow:
              "0 25px 65px -12px rgba(210, 100, 30, 0.16), 0 10px 30px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Stepper
            activeStep={isAdminFlow ? Math.max(0, safeActiveStep - 2) : safeActiveStep}
            alternativeLabel
            sx={{
              mb: 6,
              "& .MuiStepIcon-root.Mui-active": { color: COLORS.PRIMARY },
              "& .MuiStepIcon-root.Mui-completed": { color: COLORS.PRIMARY },
              "& .MuiStep-root": { cursor: "pointer" },
            }}
          >
            {(isAdminFlow ? currentStepList.slice(2) : currentStepList).map(
              (stepItem, index) => {
                const stepIdx = isAdminFlow ? index + 2 : index;
                return (
                  <Step
                    key={stepItem.id}
                    onClick={() => handleStepClick(stepIdx)}
                    sx={{ cursor: "pointer" }}
                  >
                    <StepLabel
                      sx={{
                        cursor: "pointer",
                        "& .MuiStepLabel-label": {
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 600,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {stepItem.label}
                    </StepLabel>
                  </Step>
                );
              },
            )}
          </Stepper>

          <form onSubmit={handleStepSubmit}>
            {currentStep.id === "basic" && (
              <Step0BasicDetails
                formik={formik}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                maxDobDate={maxDobDate}
              />
            )}

            {currentStep.id === "otp" && (
              <Step1OtpVerification
                formik={formik}
                resendTimer={resendTimer}
                handlePortalResendOtp={handlePortalResendOtp}
                otpRefs={otpRefs}
              />
            )}

            {currentStep.id === "profile" && (
              <Step2PurohitProfile formik={formik} />
            )}

            {currentStep.id === "bank" && (
              <Step3BankDetails formik={formik} />
            )}

            {currentStep.id === "documents" && (
              <Step4DocumentUpload
                formik={formik}
                setPreviewFile={setPreviewFile}
              />
            )}

            {currentStep.id === "serviceArea" && (
              <Step5ServiceArea formik={formik} />
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  currentStep.id === "basic" ? "flex-end" : "space-between",
                alignItems: "center",
                width: "100%",
                mt: 6,
              }}
            >
              {safeActiveStep > 0 && (
                <Button
                  disabled={isSendingOtp || isVerifyingOtp || isSubmittingForm}
                  onClick={handleBack}
                  type="button"
                  sx={{
                    background: COLORS.PRIMARY,
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "30px",
                    px: 4,
                    boxShadow: "none",
                    "&:hover": {
                      background: COLORS.PRIMARY_DARK,
                      boxShadow: "none",
                    },
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
                  background: COLORS.PRIMARY,
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "30px",
                  px: 4,
                  boxShadow: "none",
                  "&:hover": {
                    background: COLORS.PRIMARY_DARK,
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    background: "#FFE0D0",
                    color: "#FFA07A",
                  },
                }}
              >
                {isLastStep
                  ? isSubmittingForm
                    ? "Submitting..."
                    : "Submit Registration"
                  : currentStep.id === "basic"
                    ? isOtpVerified
                      ? "Next Step"
                      : isSendingOtp
                        ? "Sending OTP..."
                        : "Next Step"
                    : currentStep.id === "otp"
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

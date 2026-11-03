"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { FormikProvider, useFormik } from "formik";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { FONTS } from "@/utils/fonts";
import { COLORS, USER_ROLE } from "@/utils/enums";
import { extractBackendErrorMessage } from "@/utils/helpers";
import { addAstrologerByAdminAPI } from "@/api/userControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { useSnackbarStore } from "@/stores/snackbarStore";
import DocumentPreviewDialog from "@/components/layouts/portalLayout/register/components/DocumentPreviewDialog";

import { astrologerOnboardValidationSchema } from "../common/onboarding/onboardingSchemas";
import { executePartnerOnboarding } from "../common/onboarding/onboardingSubmitHelper";
import AdminOnboardBasicSection from "../common/onboarding/AdminOnboardBasicSection";
import AdminOnboardProfileSection from "../common/onboarding/AdminOnboardProfileSection";
import AdminOnboardBankSection from "../common/onboarding/AdminOnboardBankSection";
import AdminOnboardDocsSection from "../common/onboarding/AdminOnboardDocsSection";

export default function AddAstrologerForm() {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      role: USER_ROLE.ASTROLOGER,
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      mobileNumber: "",
      countryCode: "+91",
      dob: "",
      password: "",
      confirmPassword: "",
      astrologyPrice: "",
      ratePerMinute: "",
      bio: "",
      qualification: "",
      experienceYears: "",
      aadhaarNumber: "",
      state: "",
      city: "",
      languages: [] as string[],
      specializations: [] as string[],
      isOnlineAvailable: true,
      isOfflineAvailable: true,
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
    },
    validationSchema: astrologerOnboardValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await executePartnerOnboarding({
          values,
          role: USER_ROLE.ASTROLOGER,
          createApi: addAstrologerByAdminAPI,
        });

        showSnackbar(
          "Astrologer onboarded successfully with all details!",
          "success"
        );
        router.push("/admin/astrologers");
      } catch (error: any) {
        showSnackbar(
          extractBackendErrorMessage(error, "Error onboarding astrologer"),
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <FormikValidationSnackbar />
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: 950,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3.5,
          pb: 8,
        }}
      >
        {/* Breadcrumbs & Header */}
        <Box>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 1.5 }}
          >
            <NextLink
              href="/admin/astrologers"
              style={{
                textDecoration: "none",
                color: "#64748b",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Astrologers
            </NextLink>
            <Typography
              sx={{
                color: COLORS.PRIMARY,
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Onboard Astrologer
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            Onboard New Astrologer
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748b",
              mt: 0.5,
            }}
          >
            Fill in credentials, astrology consultation pricing, profile, bank, and credentials to register a new Astrologer.
          </Typography>
        </Box>

        {/* Unified Long Form Paper */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4.5 },
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: 4.5,
          }}
        >
          {/* SECTION 1: Basic Details */}
          <AdminOnboardBasicSection
            formik={formik}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />

          <Divider sx={{ borderColor: "#f1f5f9" }} />

          {/* SECTION 2: Professional Profile & Consultation Pricing */}
          <AdminOnboardProfileSection formik={formik} />

          <Divider sx={{ borderColor: "#f1f5f9" }} />

          {/* SECTION 3: Bank Details */}
          <AdminOnboardBankSection formik={formik} />

          <Divider sx={{ borderColor: "#f1f5f9" }} />

          {/* SECTION 4: Document Upload */}
          <AdminOnboardDocsSection
            formik={formik}
            setPreviewFile={setPreviewFile}
          />

          <Divider sx={{ borderColor: "#f1f5f9" }} />

          {/* Bottom Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => router.push("/admin/astrologers")}
              disabled={isSubmitting}
              sx={{
                borderRadius: "30px",
                px: 3.5,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#cbd5e1",
                color: "#475569",
                "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              startIcon={!isSubmitting ? <CheckCircleIcon /> : undefined}
              sx={{
                background: COLORS.PRIMARY,
                color: "white",
                px: 4.5,
                py: 1.3,
                borderRadius: "30px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  background: COLORS.PRIMARY_DARK,
                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting ? "Onboarding Astrologer..." : "Onboard Astrologer"}
            </Button>
          </Box>
        </Paper>

        <DocumentPreviewDialog
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
        />
      </Box>
    </FormikProvider>
  );
}

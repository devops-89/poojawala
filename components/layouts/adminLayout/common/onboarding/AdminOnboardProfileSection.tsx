"use client";

import React from "react";
import { Box } from "@mui/material";
import { FormikProps } from "formik";
import { USER_ROLE } from "@/utils/enums";
import AdminOnboardSectionHeader from "./AdminOnboardSectionHeader";
import Step2PurohitProfile from "@/components/layouts/portalLayout/register/components/Step2PurohitProfile";

interface AdminOnboardProfileSectionProps {
  formik: FormikProps<any>;
}

export default function AdminOnboardProfileSection({
  formik,
}: AdminOnboardProfileSectionProps) {
  const isAstrologer = formik.values.role === USER_ROLE.ASTROLOGER;

  return (
    <Box>
      <AdminOnboardSectionHeader
        number={2}
        title={
          isAstrologer
            ? "Professional Profile & Consultation Rate"
            : "Professional Profile"
        }
        subtitle={
          isAstrologer
            ? "Skills, credentials, languages, consultation rate, and bio"
            : "Qualifications, experience years, specializations, languages, and availability"
        }
      />
      <Step2PurohitProfile formik={formik} hideTitle isAdmin />
    </Box>
  );
}


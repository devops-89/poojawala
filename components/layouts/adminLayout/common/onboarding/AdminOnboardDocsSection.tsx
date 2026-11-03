"use client";

import React from "react";
import { Box } from "@mui/material";
import { FormikProps } from "formik";
import AdminOnboardSectionHeader from "./AdminOnboardSectionHeader";
import Step4DocumentUpload from "@/components/layouts/portalLayout/register/components/Step4DocumentUpload";

interface AdminOnboardDocsSectionProps {
  formik: FormikProps<any>;
  setPreviewFile: (file: File | null) => void;
}

export default function AdminOnboardDocsSection({
  formik,
  setPreviewFile,
}: AdminOnboardDocsSectionProps) {
  return (
    <Box>
      <AdminOnboardSectionHeader
        number={4}
        title="Document Upload & Verification"
        subtitle="Profile photo, identity card (Aadhaar/PAN), and qualification certificates"
      />
      <Step4DocumentUpload
        formik={formik}
        setPreviewFile={setPreviewFile}
        hideTitle
      />
    </Box>
  );
}


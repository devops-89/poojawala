"use client";

import React from "react";
import { Box } from "@mui/material";
import { FormikProps } from "formik";
import AdminOnboardSectionHeader from "./AdminOnboardSectionHeader";
import Step3BankDetails from "@/components/layouts/portalLayout/register/components/Step3BankDetails";

interface AdminOnboardBankSectionProps {
  formik: FormikProps<any>;
}

export default function AdminOnboardBankSection({
  formik,
}: AdminOnboardBankSectionProps) {
  return (
    <Box>
      <AdminOnboardSectionHeader
        number={3}
        title="Bank & Payout Details"
        subtitle="Payout preferences via direct Bank Transfer or UPI ID"
      />
      <Step3BankDetails formik={formik} hideTitle />
    </Box>
  );
}


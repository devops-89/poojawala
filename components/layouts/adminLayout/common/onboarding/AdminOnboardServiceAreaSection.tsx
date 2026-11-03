"use client";

import React from "react";
import { Box } from "@mui/material";
import { FormikProps } from "formik";
import AdminOnboardSectionHeader from "./AdminOnboardSectionHeader";
import Step5ServiceArea from "@/components/layouts/portalLayout/register/components/Step5ServiceArea";

interface AdminOnboardServiceAreaSectionProps {
  formik: FormikProps<any>;
}

export default function AdminOnboardServiceAreaSection({
  formik,
}: AdminOnboardServiceAreaSectionProps) {
  return (
    <Box>
      <AdminOnboardSectionHeader
        number={5}
        title="Service Area & Operation Radius"
        subtitle="Primary physical location address, pincode, coordinates, and service radius in KM"
      />
      <Step5ServiceArea formik={formik} hideTitle />
    </Box>
  );
}


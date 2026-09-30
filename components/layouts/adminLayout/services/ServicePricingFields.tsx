"use client";

import { Grid, TextField, Typography } from "@mui/material";
import React from "react";

interface ServicePricingFieldsProps {
  values: {
    tokenPercentage: string | number;
    commissionPercentage: string | number;
    durationMinutes: string | number;
  };
  errors: Record<string, any>;
  touched: Record<string, any>;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement>;
}

export default function ServicePricingFields({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: ServicePricingFieldsProps) {
  return (
    <>
      {/* Token Percentage */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
          }}
        >
          Token Percentage (%) *
        </Typography>
        <TextField
          fullWidth
          name="tokenPercentage"
          placeholder="e.g. 30.00"
          variant="outlined"
          type="number"
          value={values.tokenPercentage}
          onChange={(e: any) => {
            if (Number(e.target.value) < 0) return;
            handleChange(e as any);
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          onBlur={handleBlur}
          error={touched.tokenPercentage && Boolean(errors.tokenPercentage)}
          helperText={touched.tokenPercentage && errors.tokenPercentage}
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>

      {/* Commission Percentage */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
          }}
        >
          Commission Percentage (%) *
        </Typography>
        <TextField
          fullWidth
          name="commissionPercentage"
          placeholder="e.g. 10"
          variant="outlined"
          type="number"
          value={values.commissionPercentage}
          onChange={(e: any) => {
            if (Number(e.target.value) < 0) return;
            handleChange(e as any);
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          onBlur={handleBlur}
          error={
            touched.commissionPercentage &&
            Boolean(errors.commissionPercentage)
          }
          helperText={
            touched.commissionPercentage && errors.commissionPercentage
          }
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>

      {/* Duration */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
          }}
        >
          Duration (Minutes) *
        </Typography>
        <TextField
          fullWidth
          name="durationMinutes"
          placeholder="e.g. 120"
          variant="outlined"
          type="number"
          value={values.durationMinutes}
          onChange={(e: any) => {
            if (Number(e.target.value) < 0) return;
            handleChange(e as any);
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          onBlur={handleBlur}
          error={touched.durationMinutes && Boolean(errors.durationMinutes)}
          helperText={touched.durationMinutes && errors.durationMinutes}
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>
    </>
  );
}

"use client";

import { Grid, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";

interface FormValues {
  description: string;
}

export default function ProductDescriptionField() {
  const { values, handleChange, handleBlur, touched, errors } =
    useFormikContext<FormValues>();

  return (
    <Grid size={{ xs: 12 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description *"
        name="description"
        placeholder="Enter product features, materials, and description..."
        variant="outlined"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.description && Boolean(errors.description)}
        helperText={touched.description && errors.description}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
      />
    </Grid>
  );
}

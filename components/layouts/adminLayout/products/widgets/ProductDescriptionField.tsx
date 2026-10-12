"use client";

import { Grid, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";

interface FormValues {
  description: string;
}

export default function ProductDescriptionField() {
  const { values, handleChange, handleBlur, touched, errors, setFieldTouched } =
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
        onChange={(e) => {
          handleChange(e);
          setFieldTouched("description", true, false);
        }}
        onBlur={handleBlur}
        error={
          Boolean(errors.description) &&
          (touched.description || Boolean(values.description))
        }
        helperText={
          (touched.description || Boolean(values.description))
            ? (errors.description as string)
            : undefined
        }
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
      />
    </Grid>
  );
}

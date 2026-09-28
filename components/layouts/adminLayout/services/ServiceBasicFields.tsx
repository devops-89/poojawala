"use client";

import { Grid, TextField, Typography } from "@mui/material";
import React from "react";

interface ServiceBasicFieldsProps {
  values: {
    name: string;
    description: string;
  };
  errors: Record<string, any>;
  touched: Record<string, any>;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export default function ServiceBasicFields({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: ServiceBasicFieldsProps) {
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
          }}
        >
          Service Name *
        </Typography>
        <TextField
          fullWidth
          name="name"
          placeholder="e.g., Satyanarayan Katha"
          variant="outlined"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
          }}
        >
          Description *
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="description"
          placeholder="Describe the ritual..."
          variant="outlined"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description && errors.description}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>
    </>
  );
}

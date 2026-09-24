"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Field } from "formik";
import React from "react";

export interface SignUpStep2AddressProps {
  isFetchingLocation: boolean;
  isSubmitting: boolean;
  onFetchLocation: () => void;
  onBack: () => void;
}

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    fontFamily: '"DM Sans", sans-serif',
    borderRadius: "10px",
    fontSize: "0.875rem",
  },
  "& .MuiInputLabel-root": {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "0.875rem",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    margin: "2px 0 -4px 0",
  },
};

export default function SignUpStep2Address({
  isFetchingLocation,
  isSubmitting,
  onFetchLocation,
  onBack,
}: SignUpStep2AddressProps) {
  return (
    <Grid container spacing={1.25}>
      {/* Use Current Location Button */}
      <Grid size={{ xs: 12 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onFetchLocation}
          disabled={isFetchingLocation}
          startIcon={
            isFetchingLocation ? (
              <CircularProgress size={14} />
            ) : (
              <MyLocationIcon fontSize="small" />
            )
          }
          sx={{
            py: 0.75,
            color: "#388e3c",
            borderColor: "#c8e6c9",
            bgcolor: "#e8f5e9",
            "&:hover": {
              bgcolor: "#c8e6c9",
              borderColor: "#a5d6a7",
            },
            textTransform: "none",
            fontWeight: 600,
            fontSize: "13px",
            borderRadius: "10px",
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          {isFetchingLocation
            ? "Locating..."
            : "Use Current Location Coordinates"}
        </Button>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Field name="addressLabel">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Address Label (e.g., Home, Office) *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Field name="fullAddress">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              multiline
              rows={2}
              label="Full Address *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Field name="city">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="City *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Field name="state">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="State *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Field name="pincode">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Pincode *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="latitude">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Latitude (Optional)"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="longitude">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Longitude (Optional)"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Field name="isDefault">
          {({ field }: any) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  size="small"
                  sx={{
                    py: 0.25,
                    color: "#FF6200",
                    "&.Mui-checked": { color: "#FF6200" },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.825rem",
                  }}
                >
                  Set as default delivery address
                </Typography>
              }
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Button
          type="button"
          fullWidth
          onClick={onBack}
          variant="outlined"
          startIcon={<ArrowBackIcon fontSize="small" />}
          sx={{
            py: 1,
            borderRadius: "24px",
            borderColor: "#FFE0D0",
            color: "#475569",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: "14px",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#FFF0E6",
              color: "#FF6200",
              borderColor: "#FF6200",
            },
          }}
        >
          ← Back to Step 1
        </Button>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          variant="contained"
          sx={{
            background: "#FF6200",
            color: "white",
            py: 1,
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "15px",
            boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
            "&:hover": {
              background: "#E65800",
              boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
            },
          }}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up & Send OTP"}
        </Button>
      </Grid>
    </Grid>
  );
}


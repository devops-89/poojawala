"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Field } from "formik";
import { MuiTelInput } from "mui-tel-input";
import { useState } from "react";

const today = new Date();
const fifteenYearsAgo = new Date(
  today.getFullYear() - 15,
  today.getMonth(),
  today.getDate(),
);
const maxDobDate = `${fifteenYearsAgo.getFullYear()}-${String(
  fifteenYearsAgo.getMonth() + 1,
).padStart(2, "0")}-${String(fifteenYearsAgo.getDate()).padStart(2, "0")}`;

export interface SignUpStep1PersonalProps {
  onNext: () => void;
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

export default function SignUpStep1Personal({
  onNext,
}: SignUpStep1PersonalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Grid container spacing={1.25}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="firstName">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="First Name *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="lastName">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Last Name *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="email">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Email Address *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="phone">
          {({ field, form, meta }: any) => (
            <MuiTelInput
              fullWidth
              size="small"
              label="Phone Number *"
              name="phone"
              variant="outlined"
              defaultCountry="IN"
              value={field.value ? "+91" + field.value : ""}
              onChange={(newValue, info) => {
                const natNum = info.nationalNumber || "";
                const cleanNum = natNum.replace(/\D/g, "").slice(0, 10);
                form.setFieldValue("phone", cleanNum);
              }}
              onKeyDown={(e) => {
                if (field.value && field.value.length >= 10) {
                  if (
                    ![
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="dob">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              type="date"
              label="Date of Birth *"
              variant="outlined"
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: maxDobDate },
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="birthPlace">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Place of Birth *"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="rashi">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Rashi"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="gotra">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Gotra"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="password">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Password *"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="confirmPassword">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Confirm Password *"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Button
          type="button"
          fullWidth
          onClick={onNext}
          variant="contained"
          sx={{
            mt: 0.5,
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
          Next: Address Details →
        </Button>
      </Grid>
    </Grid>
  );
}

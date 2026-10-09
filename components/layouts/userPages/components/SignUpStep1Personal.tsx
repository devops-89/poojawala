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
import { MuiTelInput } from "@/components/widgets/MuiTelInput";
import { useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { allowOnlyLettersOnKeyDown, sanitizeLettersOnly } from "@/utils/helpers";

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
    fontFamily: FONTS.OUTFIT,
    borderRadius: "12px",
    fontSize: "0.9rem",
    bgcolor: "#FFFDF9",
    "&:hover fieldset": {
      borderColor: "#FF9100",
    },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.BRAND_ORANGE,
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: FONTS.OUTFIT,
    fontSize: "0.875rem",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    margin: "3px 0 -3px 0",
  },
};

export default function SignUpStep1Personal({
  onNext,
}: SignUpStep1PersonalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Grid container spacing={2.25}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="firstName">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="First Name *"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("firstName", sanitizeLettersOnly(e.target.value));
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="lastName">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Last Name *"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("lastName", sanitizeLettersOnly(e.target.value));
              }}
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
              disableDropdown
              onlyCountries={["IN"]}
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
              error={
                (meta.touched || Boolean(field.value)) &&
                (Boolean(meta.error) || (field.value && field.value.length > 0 && !/^[6-9]/.test(field.value)))
              }
              helperText={
                field.value && field.value.length > 0 && !/^[6-9]/.test(field.value)
                  ? "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                  : meta.touched
                  ? meta.error
                  : undefined
              }
              sx={{
                ...inputStyles,
                "& .MuiTelInput-IconButton": {
                  pointerEvents: "none",
                  cursor: "default",
                },
                "& .MuiTelInput-Button": {
                  pointerEvents: "none",
                  cursor: "default",
                },
              }}
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
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Place of Birth *"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("birthPlace", sanitizeLettersOnly(e.target.value));
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="rashi">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Rashi"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("rashi", sanitizeLettersOnly(e.target.value));
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            />
          )}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="gotra">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label="Gotra"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("gotra", sanitizeLettersOnly(e.target.value));
              }}
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
            mt: 1,
            background: "linear-gradient(135deg, #FF6200 0%, #F05A00 100%)",
            color: "white",
            py: 1.25,
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "15px",
            boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #E65800 0%, #D04F00 100%)",
              boxShadow: "0 8px 25px rgba(255, 98, 0, 0.4)",
            },
          }}
        >
          Next: Address Details →
        </Button>
      </Grid>
    </Grid>
  );
}

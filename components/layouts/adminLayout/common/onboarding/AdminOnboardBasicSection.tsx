"use client";

import React from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { FormikProps } from "formik";

import {
  allowOnlyLettersOnKeyDown,
  sanitizeLettersOnly,
  allowOnlyEmailCharsOnKeyDown,
  sanitizeEmailInput,
} from "@/utils/helpers";
import { MuiTelInput } from "@/components/widgets/MuiTelInput";
import AdminOnboardSectionHeader from "./AdminOnboardSectionHeader";
import { maxDobDate } from "./onboardingSchemas";

interface AdminOnboardBasicSectionProps {
  formik: FormikProps<any>;
  showPassword: boolean;
  setShowPassword: (show: boolean | ((prev: boolean) => boolean)) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean | ((prev: boolean) => boolean)) => void;
}

export default function AdminOnboardBasicSection({
  formik,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: AdminOnboardBasicSectionProps) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } = formik;

  return (
    <Box>
      <AdminOnboardSectionHeader
        number={1}
        title="Basic & Login Details"
        subtitle="Personal information and login credentials"
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            name="firstName"
            label="First Name *"
            variant="outlined"
            value={values.firstName}
            onKeyDown={allowOnlyLettersOnKeyDown}
            onChange={(e) => {
              const val = sanitizeLettersOnly(e.target.value);
              setFieldValue("firstName", val);
              setFieldValue("fullName", `${val} ${values.lastName}`.trim());
              setFieldTouched("firstName", true, false);
            }}
            onBlur={handleBlur}
            error={
              Boolean(errors.firstName) &&
              (Boolean(touched.firstName) || Boolean(values.firstName))
            }
            helperText={
              (Boolean(touched.firstName) || Boolean(values.firstName))
                ? (errors.firstName as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            name="lastName"
            label="Last Name *"
            variant="outlined"
            value={values.lastName}
            onKeyDown={allowOnlyLettersOnKeyDown}
            onChange={(e) => {
              const val = sanitizeLettersOnly(e.target.value);
              setFieldValue("lastName", val);
              setFieldValue("fullName", `${values.firstName} ${val}`.trim());
              setFieldTouched("lastName", true, false);
            }}
            onBlur={handleBlur}
            error={
              Boolean(errors.lastName) &&
              (Boolean(touched.lastName) || Boolean(values.lastName))
            }
            helperText={
              (Boolean(touched.lastName) || Boolean(values.lastName))
                ? (errors.lastName as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MuiTelInput
            fullWidth
            name="mobileNumber"
            label="Mobile Number *"
            variant="outlined"
            defaultCountry="IN"
            disableDropdown
            value={
              values.countryCode
                ? values.countryCode + values.mobileNumber
                : values.mobileNumber
            }
            onChange={(_newValue, info) => {
              const natNum = (info.nationalNumber || "")
                .replace(/\D/g, "")
                .slice(0, 10);
              setFieldValue("countryCode", "+91");
              setFieldValue("mobileNumber", natNum);
              setFieldTouched("mobileNumber", true, false);
            }}
            onKeyDown={(e) => {
              if (values.mobileNumber && values.mobileNumber.length >= 10) {
                if (
                  ![
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                    "Home",
                    "End",
                  ].includes(e.key) &&
                  !e.ctrlKey &&
                  !e.metaKey
                ) {
                  e.preventDefault();
                }
              }
            }}
            error={
              (Boolean(touched.mobileNumber) || Boolean(values.mobileNumber)) &&
              (Boolean(errors.mobileNumber) ||
                (values.mobileNumber.length > 0 &&
                  !/^[6-9]/.test(values.mobileNumber)))
            }
            helperText={
              values.mobileNumber.length > 0 &&
              !/^[6-9]/.test(values.mobileNumber)
                ? "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                : (Boolean(touched.mobileNumber) || Boolean(values.mobileNumber))
                ? (errors.mobileNumber as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date of Birth *"
              format="DD/MM/YYYY"
              value={values.dob ? moment(values.dob, "YYYY-MM-DD") : null}
              maxDate={moment(maxDobDate)}
              onChange={(newValue) => {
                if (newValue && newValue.isValid()) {
                  setFieldValue("dob", newValue.format("YYYY-MM-DD"));
                } else {
                  setFieldValue("dob", "");
                }
                setFieldTouched("dob", true, false);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  name: "dob",
                  variant: "outlined",
                  error:
                    Boolean(errors.dob) &&
                    (Boolean(touched.dob) || Boolean(values.dob)),
                  helperText:
                    (Boolean(touched.dob) || Boolean(values.dob))
                      ? (errors.dob as string)
                      : undefined,
                  sx: { "& .MuiOutlinedInput-root": { borderRadius: "12px" } },
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="email"
            label="Email Address *"
            type="email"
            variant="outlined"
            value={values.email}
            onKeyDown={allowOnlyEmailCharsOnKeyDown}
            onChange={(e) => {
              setFieldValue("email", sanitizeEmailInput(e.target.value));
              setFieldTouched("email", true, false);
            }}
            onBlur={handleBlur}
            error={
              Boolean(errors.email) &&
              (Boolean(touched.email) || Boolean(values.email))
            }
            helperText={
              (Boolean(touched.email) || Boolean(values.email))
                ? (errors.email as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            name="password"
            label="Password *"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={(e) => {
              handleChange(e);
              setFieldTouched("password", true, false);
            }}
            onBlur={handleBlur}
            error={
              Boolean(errors.password) &&
              (Boolean(touched.password) || Boolean(values.password))
            }
            helperText={
              (Boolean(touched.password) || Boolean(values.password))
                ? (errors.password as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password *"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            value={values.confirmPassword}
            onChange={(e) => {
              handleChange(e);
              setFieldTouched("confirmPassword", true, false);
            }}
            onBlur={handleBlur}
            error={
              Boolean(errors.confirmPassword) &&
              (Boolean(touched.confirmPassword) || Boolean(values.confirmPassword))
            }
            helperText={
              (Boolean(touched.confirmPassword) || Boolean(values.confirmPassword))
                ? (errors.confirmPassword as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FormikProps } from "formik";
import { MuiTelInput } from "@/components/widgets/MuiTelInput";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS, USER_ROLE } from "@/utils/enums";
import {
  allowOnlyLettersOnKeyDown,
  sanitizeLettersOnly,
  allowOnlyEmailCharsOnKeyDown,
  sanitizeEmailInput,
} from "@/utils/helpers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

interface Step0Props {
  formik: FormikProps<any>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  maxDobDate: string;
}

export default function Step0BasicDetails({
  formik,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  maxDobDate,
}: Step0Props) {
  const inputFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: FONTS.OUTFIT,
      fontSize: { xs: "12.5px", sm: "13.5px" },
      bgcolor: "rgba(255, 255, 255, 0.8)",
      minHeight: { xs: "42px", sm: "44px" },
      transition: "all 0.2s ease",
      "&:hover fieldset": { borderColor: "#FFD4BC" },
      "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
    },
    "& .MuiInputBase-input, & .MuiOutlinedInput-input": {
      fontFamily: `${FONTS.OUTFIT} !important`,
      fontSize: { xs: "12.5px", sm: "13.5px" },
      py: { xs: "8px", sm: "10px" },
    },
    "& .MuiInputLabel-root": {
      fontFamily: `${FONTS.OUTFIT} !important`,
      fontSize: { xs: "12.5px", sm: "13.5px" },
      "&.Mui-focused": { color: COLORS.PRIMARY },
      "&.MuiInputLabel-shrink": {
        fontSize: { xs: "11px", sm: "12px" },
      },
    },
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          fontSize: { xs: "17px", sm: "20px", md: "22px" },
          color: "#1E293B",
          lineHeight: 1.35,
          mb: { xs: 2, md: 2.5 },
        }}
      >
        Basic & Login Details{" "}
        <Box
          component="span"
          sx={{
            fontSize: { xs: "13.5px", sm: "15px" },
            fontWeight: 500,
            color: "#64748B",
            display: { xs: "block", sm: "inline" },
            mt: { xs: 0.3, sm: 0 },
          }}
        >
          (बुनियादी और लॉगिन विवरण)
        </Box>
      </Typography>
      <Grid container spacing={{ xs: 1.8, md: 2.5 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            select
            fullWidth
            name="role"
            label="Role (भूमिका) *"
            variant="outlined"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && (formik.errors.role as string)}
            sx={{
              ...inputFieldSx,
              "& .MuiSelect-select": {
                fontFamily: `${FONTS.OUTFIT} !important`,
                fontSize: { xs: "12.5px", sm: "13.5px" },
                py: { xs: "9px", sm: "11px" },
              },
            }}
            slotProps={{
              select: {
                MenuProps: {
                  slotProps: {
                    paper: {
                      sx: {
                        borderRadius: "14px",
                        border: "1px solid #EFE6D5",
                        boxShadow: "0 8px 24px rgba(44, 24, 16, 0.12)",
                        mt: 0.5,
                        "& .MuiMenuItem-root": {
                          fontFamily: FONTS.OUTFIT,
                          fontSize: { xs: "12.5px", sm: "13px" },
                          py: { xs: 0.8, sm: 0.9 },
                          px: 1.6,
                          minHeight: { xs: "36px", sm: "38px" },
                          color: "#2C1810",
                          borderRadius: "8px",
                          mx: 0.5,
                          my: 0.2,
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: "#FAF4EE",
                            color: COLORS.PRIMARY,
                          },
                          "&.Mui-selected": {
                            bgcolor: "#FFF0E6",
                            color: COLORS.PRIMARY,
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: "#FFE8D9",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value={USER_ROLE.PUROHIT}>Purohit (पुरोहित)</MenuItem>
            <MenuItem value={USER_ROLE.ASTROLOGER}>Astrologer (ज्योतिषी)</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="fullName"
            label="Full Name (पूरा नाम) *"
            variant="outlined"
            value={formik.values.fullName}
            onKeyDown={allowOnlyLettersOnKeyDown}
            onChange={(e) => {
              const val = sanitizeLettersOnly(e.target.value);
              formik.setFieldValue("fullName", val);
            }}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={
              formik.touched.fullName && (formik.errors.fullName as string)
            }
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MuiTelInput
            fullWidth
            disableDropdown
            onlyCountries={["IN"]}
            name="mobileNumber"
            label="Mobile Number (मोबाइल नंबर) *"
            variant="outlined"
            defaultCountry="IN"
            value={
              formik.values.countryCode
                ? formik.values.countryCode + formik.values.mobileNumber
                : formik.values.mobileNumber
            }
            onChange={(newValue, info) => {
              formik.setFieldValue("countryCode", "+91");
              const natNum = info.nationalNumber || "";
              const cleanNum = natNum.replace(/\D/g, "").slice(0, 10);
              formik.setFieldValue("mobileNumber", cleanNum);
            }}
            onKeyDown={(e) => {
              if (
                formik.values.mobileNumber &&
                formik.values.mobileNumber.length >= 10
              ) {
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
              (formik.touched.mobileNumber || Boolean(formik.values.mobileNumber)) &&
              (Boolean(formik.errors.mobileNumber) ||
                (formik.values.mobileNumber.length > 0 && !/^[6-9]/.test(formik.values.mobileNumber)))
            }
            helperText={
              formik.values.mobileNumber.length > 0 && !/^[6-9]/.test(formik.values.mobileNumber)
                ? "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                : formik.touched.mobileNumber
                ? (formik.errors.mobileNumber as string)
                : undefined
            }
            sx={{
              ...inputFieldSx,
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="email"
            label="Email Address (ईमेल पता) *"
            type="email"
            variant="outlined"
            value={formik.values.email}
            onKeyDown={allowOnlyEmailCharsOnKeyDown}
            onChange={(e) => {
              formik.setFieldValue("email", sanitizeEmailInput(e.target.value));
            }}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && (formik.errors.email as string)}
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date of Birth (जन्म तिथि) *"
              format="DD/MM/YYYY"
              value={formik.values.dob ? moment(formik.values.dob, "YYYY-MM-DD") : null}
              maxDate={maxDobDate ? moment(maxDobDate) : undefined}
              onChange={(newValue) => {
                if (newValue && newValue.isValid()) {
                  formik.setFieldValue("dob", newValue.format("YYYY-MM-DD"));
                } else {
                  formik.setFieldValue("dob", "");
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  name: "dob",
                  variant: "outlined",
                  onBlur: () => formik.setFieldTouched("dob", true),
                  error: formik.touched.dob && Boolean(formik.errors.dob),
                  helperText: formik.touched.dob && (formik.errors.dob as string),
                  sx: inputFieldSx,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="password"
            label="Password (पासवर्ड) *"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              formik.touched.password && (formik.errors.password as string)
            }
            sx={inputFieldSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password (पासवर्ड की पुष्टि करें) *"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword &&
              (formik.errors.confirmPassword as string)
            }
            sx={inputFieldSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

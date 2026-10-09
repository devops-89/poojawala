"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FormikProps } from "formik";
import { MuiTelInput } from "@/components/widgets/MuiTelInput";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { allowOnlyLettersOnKeyDown, sanitizeLettersOnly } from "@/utils/helpers";

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
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          mb: 3,
        }}
      >
        Basic & Login Details
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="fullName"
            label="Full Name *"
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MuiTelInput
            fullWidth
            disableDropdown
            onlyCountries={["IN"]}
            name="mobileNumber"
            label="Mobile Number *"
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
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
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
            label="Email Address *"
            type="email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && (formik.errors.email as string)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="dob"
            label="Date of Birth *"
            type="date"
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: maxDobDate },
            }}
            variant="outlined"
            value={formik.values.dob}
            onChange={formik.handleChange}
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && (formik.errors.dob as string)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="password"
            label="Password *"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              formik.touched.password && (formik.errors.password as string)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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
            label="Confirm Password *"
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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

"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Brightness7OutlinedIcon from "@mui/icons-material/Brightness7Outlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Field } from "formik";
import { MuiTelInput } from "@/components/widgets/MuiTelInput";
import { useState } from "react";
import { FONTS } from "@/utils/fonts";
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

const today = new Date();
const fifteenYearsAgo = new Date(
  today.getFullYear() - 15,
  today.getMonth(),
  today.getDate()
);
const maxDobDate = `${fifteenYearsAgo.getFullYear()}-${String(
  fifteenYearsAgo.getMonth() + 1
).padStart(2, "0")}-${String(fifteenYearsAgo.getDate()).padStart(2, "0")}`;

const RASHI_OPTIONS = [
  "Mesh (Aries)",
  "Vrishabh (Taurus)",
  "Mithun (Gemini)",
  "Kark (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrishchik (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makar (Capricorn)",
  "Kumbh (Aquarius)",
  "Meen (Pisces)",
];

export interface SignUpStep1PersonalProps {
  onNext: () => void;
}
//sdfg
const inputStyles = {
  "& .MuiOutlinedInput-root": {
    fontFamily: FONTS.OUTFIT,
    borderRadius: "10px",
    fontSize: "0.85rem",
    bgcolor: "#FFFFFF",
    color: "#1F1A17",
    height: "44px",
    boxSizing: "border-box",
    "@media (max-height: 660px)": {
      height: "39px",
    },
    "& fieldset": {
      borderColor: "rgba(220, 210, 200, 0.8)",
      borderWidth: "1px",
      transition: "all 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: "#FF9100",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FF6200",
      borderWidth: "1.5px",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(255, 98, 0, 0.12)",
    },
  },
  "& .MuiPickersOutlinedInput-root": {
    fontFamily: FONTS.OUTFIT,
    borderRadius: "10px",
    fontSize: "0.85rem",
    bgcolor: "#FFFFFF",
    color: "#1F1A17",
    height: "44px",
    boxSizing: "border-box",
    "@media (max-height: 660px)": {
      height: "39px",
    },
    "& fieldset": {
      borderColor: "rgba(220, 210, 200, 0.8)",
      borderWidth: "1px",
      transition: "all 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: "#FF9100",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FF6200",
      borderWidth: "1.5px",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(255, 98, 0, 0.12)",
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: FONTS.OUTFIT,
    height: "100%",
    boxSizing: "border-box",
    py: 0,
    fontSize: "0.85rem",
    "&::placeholder": {
      color: "#9CA3AF",
      opacity: 1,
    },
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    height: "100% !important",
    boxSizing: "border-box",
    py: "0 !important",
  },
  "& .MuiFormHelperText-root": {
    fontFamily: FONTS.OUTFIT,
    fontSize: "0.72rem",
    margin: "2px 0 -2px 0",
  },
};

const labelStyles = {
  fontFamily: FONTS.OUTFIT,
  fontSize: "12px",
  fontWeight: 700,
  color: "#374151",
  mb: 0.25,
  display: "block",
};

export default function SignUpStep1Personal({
  onNext,
}: SignUpStep1PersonalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Grid container spacing={1.15}>
      {/* First Name */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          First Name <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="firstName">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Enter your first name"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue(
                  "firstName",
                  sanitizeLettersOnly(e.target.value)
                );
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon
                        sx={{ color: "#9CA3AF", fontSize: 20 }}
                      />
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

      {/* Last Name */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          Last Name <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="lastName">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Enter your last name"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue(
                  "lastName",
                  sanitizeLettersOnly(e.target.value)
                );
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon
                        sx={{ color: "#9CA3AF", fontSize: 20 }}
                      />
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

      {/* Email Address */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          Email Address <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="email">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="you@example.com"
              variant="outlined"
              type="email"
              onKeyDown={allowOnlyEmailCharsOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("email", sanitizeEmailInput(e.target.value));
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineOutlinedIcon
                        sx={{ color: "#9CA3AF", fontSize: 20 }}
                      />
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

      {/* Phone Number */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          Phone Number <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="phone">
          {({ field, form, meta }: any) => (
            <MuiTelInput
              fullWidth
              disableDropdown
              onlyCountries={["IN"]}
              size="small"
              placeholder="Enter your phone number"
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
                (Boolean(meta.error) ||
                  (field.value &&
                    field.value.length > 0 &&
                    !/^[6-9]/.test(field.value)))
              }
              helperText={
                field.value &&
                field.value.length > 0 &&
                !/^[6-9]/.test(field.value)
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
                  pl: 1,
                  pr: 0.5,
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

      {/* Date of Birth */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          Date of Birth <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="dob">
          {({ field, form, meta }: any) => (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                format="DD/MM/YYYY"
                value={field.value ? moment(field.value, "YYYY-MM-DD") : null}
                maxDate={moment(maxDobDate)}
                onChange={(newValue) => {
                  if (newValue && newValue.isValid()) {
                    form.setFieldValue("dob", newValue.format("YYYY-MM-DD"));
                  } else {
                    form.setFieldValue("dob", "");
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    variant: "outlined",
                    onBlur: () => form.setFieldTouched("dob", true),
                    error: meta.touched && !!meta.error,
                    helperText: meta.touched && meta.error,
                    slotProps: {
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthOutlinedIcon
                              sx={{ color: "#9CA3AF", fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      },
                    },
                    sx: inputStyles,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        </Field>
      </Grid>

      {/* Place of Birth */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          Place of Birth <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="birthPlace">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Enter your place of birth"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue(
                  "birthPlace",
                  sanitizeLettersOnly(e.target.value)
                );
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon
                        sx={{ color: "#9CA3AF", fontSize: 20 }}
                      />
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

      {/* Rashi */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          Rashi <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="rashi">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              select
              fullWidth
              size="small"
              value={field.value || ""}
              onChange={(e) => form.setFieldValue("rashi", e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Brightness7OutlinedIcon
                        sx={{ color: "#9CA3AF", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                },
                select: {
                  displayEmpty: true,
                  renderValue: (selected: any) => {
                    if (!selected) {
                      return (
                        <Typography
                          sx={{
                            color: "#9CA3AF",
                            fontSize: "0.875rem",
                            fontFamily: FONTS.OUTFIT,
                          }}
                        >
                          Select your rashi
                        </Typography>
                      );
                    }
                    return selected;
                  },
                },
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={inputStyles}
            >
              <MenuItem value="" disabled>
                <Typography
                  sx={{
                    color: "#9CA3AF",
                    fontSize: "0.875rem",
                    fontFamily: FONTS.OUTFIT,
                  }}
                >
                  Select your rashi
                </Typography>
              </MenuItem>
              {RASHI_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt}
                  value={opt}
                  sx={{ fontFamily: FONTS.OUTFIT, fontSize: "0.875rem" }}
                >
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Field>
      </Grid>

      {/* Gotra */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>Gotra</Typography>
        <Field name="gotra">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Enter your gotra"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue(
                  "gotra",
                  sanitizeLettersOnly(e.target.value)
                );
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SpaOutlinedIcon
                        sx={{ color: "#9CA3AF", fontSize: 20 }}
                      />
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

      {/* Password */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          Password <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="password">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Create a password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ color: "#9CA3AF", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff
                            fontSize="small"
                            sx={{ color: "#9CA3AF" }}
                          />
                        ) : (
                          <Visibility
                            fontSize="small"
                            sx={{ color: "#9CA3AF" }}
                          />
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

      {/* Confirm Password */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={labelStyles}>
          Confirm Password <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="confirmPassword">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ color: "#9CA3AF", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
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
                          <VisibilityOff
                            fontSize="small"
                            sx={{ color: "#9CA3AF" }}
                          />
                        ) : (
                          <Visibility
                            fontSize="small"
                            sx={{ color: "#9CA3AF" }}
                          />
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

      {/* Next Button */}
      <Grid size={{ xs: 12 }}>
        <Button
          type="button"
          fullWidth
          onClick={onNext}
          variant="contained"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{
            mt: 0.85,
            background: "linear-gradient(135deg, #FF6200 0%, #FF7A1A 100%)",
            color: "#ffffff",
            py: 0.85,
            borderRadius: "10px",
            textTransform: "none",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "13.5px",
            boxShadow: "0 4px 12px rgba(255, 98, 0, 0.28)",
            transition: "all 0.25s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #E65800 0%, #FF6200 100%)",
              boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Next: Address Details
        </Button>
      </Grid>
    </Grid>
  );
}


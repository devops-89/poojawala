"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { allowOnlyEmailCharsOnKeyDown, sanitizeEmailInput } from "@/utils/helpers";

import React from "react";
import { Avatar, Box, Grid, TextField, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { MuiTelInput } from "@/components/widgets/MuiTelInput";

const today = new Date();
const twentyYearsAgo = new Date(
  today.getFullYear() - 20,
  today.getMonth(),
  today.getDate()
);
const maxDobDate = `${twentyYearsAgo.getFullYear()}-${String(
  twentyYearsAgo.getMonth() + 1
).padStart(2, "0")}-${String(twentyYearsAgo.getDate()).padStart(2, "0")}`;

interface BasicDetailsSectionProps {
  values: any;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export const BasicDetailsSection: React.FC<BasicDetailsSectionProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
        <Avatar
          src={values.profilePhotoUrl}
          alt={values.fullName}
          sx={{ width: 44, height: 44, bgcolor: "#fff7ed", color: COLORS.PRIMARY }}
        >
          <PersonIcon />
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          1. Basic Details
        </Typography>
      </Box>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            name="fullName"
            label="Full Name *"
            variant="outlined"
            value={values.fullName}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
              setFieldValue("fullName", val);
            }}
            onBlur={handleBlur}
            error={
              Boolean(errors.fullName) &&
              (touched.fullName || Boolean(values.fullName))
            }
            helperText={
              (touched.fullName || Boolean(values.fullName))
                ? (errors.fullName as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
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
            }}
            onBlur={handleBlur}
            error={
              Boolean(errors.email) &&
              (touched.email || Boolean(values.email))
            }
            helperText={
              (touched.email || Boolean(values.email))
                ? (errors.email as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MuiTelInput
            fullWidth
            name="phone"
            label="Mobile Number *"
            variant="outlined"
            defaultCountry="IN"
            disableDropdown
            value={
              values.countryCode
                ? values.countryCode + values.phone
                : `+91${values.phone}`
            }
            onChange={(newValue, info) => {
              const natNum = (info.nationalNumber || "")
                .replace(/\D/g, "")
                .slice(0, 10);
              setFieldValue("phone", natNum);
              setFieldValue(
                "countryCode",
                info.countryCallingCode
                  ? `+${info.countryCallingCode}`
                  : "+91"
              );
            }}
            error={
              (touched.phone || Boolean(values.phone)) &&
              (Boolean(errors.phone) ||
                (values.phone && values.phone.length > 0 && !/^[6-9]/.test(values.phone)))
            }
            helperText={
              values.phone && values.phone.length > 0 && !/^[6-9]/.test(values.phone)
                ? "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                : touched.phone
                ? (errors.phone as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            name="dob"
            label="Date of Birth *"
            type="date"
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: maxDobDate },
            }}
            value={values.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.dob && Boolean(errors.dob)}
            helperText={touched.dob && (errors.dob as string)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

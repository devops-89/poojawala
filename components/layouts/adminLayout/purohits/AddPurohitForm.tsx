"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import {
  allowOnlyLettersOnKeyDown,
  sanitizeLettersOnly,
  allowOnlyEmailCharsOnKeyDown,
  sanitizeEmailInput,
  extractBackendErrorMessage,
  EMAIL_STRICT_REGEX,
  EMAIL_STRICT_MESSAGE,
} from "@/utils/helpers";

import { addPurohitByAdminAPI } from "@/api/userControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { useSnackbarStore } from "@/stores/snackbarStore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FormikProvider, useFormik } from "formik";
import { MuiTelInput, matchIsValidTel } from "@/components/widgets/MuiTelInput";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const today = new Date();
const twentyYearsAgo = new Date(
  today.getFullYear() - 20,
  today.getMonth(),
  today.getDate(),
);
const maxDobDate = `${twentyYearsAgo.getFullYear()}-${String(twentyYearsAgo.getMonth() + 1).padStart(2, "0")}-${String(twentyYearsAgo.getDate()).padStart(2, "0")}`;

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .matches(/^[a-zA-Z\s.]+$/, "First name should only contain letters and spaces"),
  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[a-zA-Z\s.]+$/, "Last name should only contain letters and spaces"),
  email: Yup.string()
    .required("Email is required")
    .matches(
      EMAIL_STRICT_REGEX,
      EMAIL_STRICT_MESSAGE
    ),
  mobileNumber: Yup.string()
    .required("Mobile Number is required")
    .matches(/^[6-9][0-9]{9}$/, "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"),
  dob: Yup.string()
    .required("Date of Birth is required")
    .test(
      "is-20-years-old",
      "Date of birth must be at least 20 years ago",
      (val) => {
        if (!val) return false;
        const selectedDate = new Date(val);
        return !isNaN(selectedDate.getTime()) && selectedDate <= twentyYearsAgo;
      }
    ),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .trim(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function AddPurohitForm() {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      countryCode: "+91",
      dob: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload: any = {
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
        };

        if (values.email) payload.email = values.email;
        if (values.mobileNumber) {
          payload.phone = values.mobileNumber;
          payload.countryCode = values.countryCode;
        }
        if (values.dob) payload.dob = values.dob;

        const response = await addPurohitByAdminAPI(payload);

        if (response.success) {
          showSnackbar("Purohit onboarded successfully", "success");
          router.push("/admin/purohits");
        } else {
          showSnackbar(
            response.message || "Failed to onboard purohit",
            "error",
          );
        }
      } catch (error: any) {
        showSnackbar(
          extractBackendErrorMessage(error, "Error onboarding purohit"),
          "error",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <FormikValidationSnackbar />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 900,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
      <Box>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <NextLink
            href="/admin/purohits"
            style={{
              textDecoration: "none",
              color: "#64748b",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Purohits
          </NextLink>
          <Typography
            sx={{
              color: COLORS.PRIMARY,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Onboard Purohit
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h4"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          Onboard New Purohit
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748b",
            mt: 0.5,
          }}
        >
          Fill in the details to register a new Purohit on the platform.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          bgcolor: "white",
        }}
      >
        <Grid container spacing={4}>
          {/* Row 1: First Name & Last Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name *"
              variant="outlined"
              value={values.firstName}
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                formik.setFieldValue("firstName", sanitizeLettersOnly(e.target.value));
                formik.setFieldTouched("firstName", true, false);
              }}
              onBlur={handleBlur}
              error={
                Boolean(errors.firstName) &&
                (touched.firstName || Boolean(values.firstName))
              }
              helperText={
                (touched.firstName || Boolean(values.firstName))
                  ? errors.firstName
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
                formik.setFieldValue("lastName", sanitizeLettersOnly(e.target.value));
                formik.setFieldTouched("lastName", true, false);
              }}
              onBlur={handleBlur}
              error={
                Boolean(errors.lastName) &&
                (touched.lastName || Boolean(values.lastName))
              }
              helperText={
                (touched.lastName || Boolean(values.lastName))
                  ? errors.lastName
                  : undefined
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>

          {/* Row 2: Mobile Number & Date of Birth */}
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
              onChange={(newValue, info) => {
                const natNum = (info.nationalNumber || "")
                  .replace(/\D/g, "")
                  .slice(0, 10);
                formik.setFieldValue("countryCode", "+91");
                formik.setFieldValue("mobileNumber", natNum);
                formik.setFieldTouched("mobileNumber", true, false);
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
                (touched.mobileNumber || Boolean(values.mobileNumber)) &&
                (Boolean(errors.mobileNumber) ||
                  (values.mobileNumber.length > 0 && !/^[6-9]/.test(values.mobileNumber)))
              }
              helperText={
                values.mobileNumber.length > 0 && !/^[6-9]/.test(values.mobileNumber)
                  ? "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                  : (touched.mobileNumber || Boolean(values.mobileNumber))
                  ? (errors.mobileNumber as string)
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
              variant="outlined"
              value={values.dob}
              onChange={(e) => {
                handleChange(e);
                formik.setFieldTouched("dob", true, false);
              }}
              onBlur={handleBlur}
              error={
                Boolean(errors.dob) &&
                (touched.dob || Boolean(values.dob))
              }
              helperText={
                (touched.dob || Boolean(values.dob))
                  ? (errors.dob as string)
                  : undefined
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: maxDobDate },
              }}
            />
          </Grid>

          {/* Row 3: Email Address (Full Width) */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="email"
              label="Email Address *"
              variant="outlined"
              type="email"
              value={values.email}
              onKeyDown={allowOnlyEmailCharsOnKeyDown}
              onChange={(e) => {
                formik.setFieldValue("email", sanitizeEmailInput(e.target.value));
                formik.setFieldTouched("email", true, false);
              }}
              onBlur={handleBlur}
              error={
                Boolean(errors.email) &&
                (touched.email || Boolean(values.email))
              }
              helperText={
                (touched.email || Boolean(values.email)) ? errors.email : undefined
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>

          {/* Row 4: Password & Confirm Password */}
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
                formik.setFieldTouched("password", true, false);
              }}
              onBlur={handleBlur}
              error={
                Boolean(errors.password) &&
                (touched.password || Boolean(values.password))
              }
              helperText={
                (touched.password || Boolean(values.password))
                  ? (errors.password as string)
                  : undefined
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
                formik.setFieldTouched("confirmPassword", true, false);
              }}
              onBlur={handleBlur}
              error={
                Boolean(errors.confirmPassword) &&
                (touched.confirmPassword || Boolean(values.confirmPassword))
              }
              helperText={
                (touched.confirmPassword || Boolean(values.confirmPassword))
                  ? (errors.confirmPassword as string)
                  : undefined
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

        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            sx={{
              background: COLORS.PRIMARY,
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { background: COLORS.PRIMARY_DARK, boxShadow: "none" },
            }}
          >
            {isSubmitting ? "Onboarding..." : "Onboard Purohit"}
          </Button>
        </Box>
      </Paper>
    </Box>
    </FormikProvider>
  );
}

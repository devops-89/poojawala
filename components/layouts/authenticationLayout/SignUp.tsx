"use client";
import { useSendOTP } from "@/hooks/authentication/signup";
import { useModal } from "@/stores/useModal";
import { useSignupStore } from "@/stores/useSignupStore";
import singupBgImage from "@/images/signup-bg1.png";
import { COLORS, ROLES } from "@/utils/enums";
import FONTS from "@/utils/fonts";
import { signupSchema } from "@/utils/validationSchemas";
import OtpModal from "./OtpModal";
import {
  CalendarMonthOutlined,
  Close,
  RestartAlt,
  ShieldOutlined,
  SpaOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useFormik } from "formik";
import { matchIsValidTel, MuiTelInput, MuiTelInputInfo } from "mui-tel-input";
import { useRouter } from "next/navigation";
import AuthenticationWrapper from "./AuthenticationWrapper";
import { useState } from "react";
import moment from "moment";
interface SignUpFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  email: string;
  dob: string;
  password: string;
}

const RegisterUser = () => {
  const lists = [
    {
      label: "Verified Vedic Purohits & Scholars",
      icon: SpaOutlined,
    },
    {
      label: "Live & Instant Pooja Status Updates",
      icon: CalendarMonthOutlined,
    },
    {
      label: "100% Sacred, Transparent & Secure",
      icon: ShieldOutlined,
    },
  ];

  const router = useRouter();
  const setSignupData = useSignupStore((state) => state.setSignupData);
  const showModal = useModal((state) => state.showModal);
  const { loading, sendOtp } = useSendOTP();

  const routeToLogin = () => {
    router.push("/sign-in");
  };

  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      countryCode: "",
      email: "",
      dob: "",
      password: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      setSignupData(values);
      const { email } = values;
      const isSent = await sendOtp(email, ROLES.CUSTOMER);
      if (isSent) {
        showModal(<OtpModal />);
      }
    },
  });

  const [phone, setPhone] = useState("");

  const handleChangePhoneNumber = (value: string, info: MuiTelInputInfo) => {
    setPhone(value);
    const isValid = matchIsValidTel(value);
    if (isValid) {
      formik.setFieldValue("phoneNumber", info?.nationalNumber || "");
      formik.setFieldValue("countryCode", info?.countryCallingCode || "");
      formik.setFieldError("phoneNumber","")
    } else {
      formik.setFieldValue("phoneNumber", "", false);
      formik.setFieldValue("countryCode", "", false);
      formik.setFieldError(
        "phoneNumber",
        info?.nationalNumber
          ? "Please Enter Valid Phone Number"
          : "Please Enter Phone Number"
      );
    }
  };

  const [date, setDate] = useState<moment.Moment | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const dateChangeHandler = (newDate: moment.Moment | null) => {
    setDate(newDate);

    const isValidDate = newDate && moment(newDate).isValid();

    if (isValidDate) {
      formik.setFieldValue("dob", moment(newDate).format("DD-MMM-YYYY"));
    } else {
      formik.setFieldValue("dob", "");
    }
  };

  return (
    <AuthenticationWrapper
      bg={singupBgImage.src}
      heading="Join Our Divine Community"
      description="Create an account to book authentic pooja services, track your bookings, and stay connected with divine traditions"
      list={lists}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <IconButton sx={{ border: "1px solid " + COLORS.PRIMARY }}>
            <Close />
          </IconButton>
        </Box>
        <Typography
          sx={{
            fontSize: 18,
            fontFamily: FONTS.PRIMARY,
            fontWeight: 600,
            mb: 3,
          }}
        >
          Create an Account
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={6}>
              <TextField
                label="First Name*"
                fullWidth
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.touched.firstName && formik.errors.firstName}
                error={Boolean(
                  formik.touched.firstName && formik.errors.firstName,
                )}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Last Name*"
                fullWidth
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.touched.lastName && formik.errors.lastName}
                error={Boolean(
                  formik.touched.lastName && formik.errors.lastName,
                )}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Email Address*"
                fullWidth
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.touched.email && formik.errors.email}
                error={Boolean(formik.touched.email && formik.errors.email)}
              />
            </Grid>
            <Grid size={6}>
              <MuiTelInput
                label="Phone Number*"
                name="phoneNumber"
                defaultCountry="IN"
                onChange={handleChangePhoneNumber}
                onBlur={() =>
                  formik.setFieldTouched(
                    "phoneNumber",
                    true,
                    !formik.errors.phoneNumber,
                  )
                }
                value={phone}
                error={Boolean(
                  formik.touched.phoneNumber && formik.errors.phoneNumber,
                )}
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
              />
            </Grid>
            <Grid size={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Date Of Birth*"
                  disableFuture
                  onChange={dateChangeHandler}
                  value={date}
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      name: "dob",
                      onBlur: () => formik.setFieldTouched("dob", true),
                      error: Boolean(formik.touched.dob && formik.errors.dob),
                      helperText: formik.touched.dob && formik.errors.dob,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={6}>
              <TextField
                label="Password*"
                fullWidth
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.password && formik.errors.password,
                )}
                helperText={formik.touched.password && formik.errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
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
            <Grid size={12}>
              <Button
                sx={{
                  backgroundColor: COLORS.PRIMARY,
                  color: COLORS.WHITE,
                  p: 1,
                  fontSize: 18,
                }}
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: COLORS.WHITE }} />
                ) : (
                  "Submit"
                )}
              </Button>

              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  color: COLORS.BLACK,
                  mt: 2,
                  textAlign: "right",
                }}
              >
                Already Have an Account?
                <Typography
                  component="span"
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    color: COLORS.PRIMARY,
                    cursor: "pointer",
                  }}
                  onClick={routeToLogin}
                >
                  {" "}
                  Login Here
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </AuthenticationWrapper>
  );
};

export default RegisterUser;

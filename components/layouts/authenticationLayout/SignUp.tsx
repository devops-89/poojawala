"use client";
import singupBgImage from "@/images/signup-bg1.png";
import { COLORS } from "@/utils/enums";
import FONTS from "@/utils/fonts";
import { signupSchema } from "@/utils/validationSchemas";
import {
  CalendarMonthOutlined,
  Close,
  ShieldOutlined,
  SpaOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
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
    onSubmit: (values) => {
      console.log("values", values);
    },
  });

  const [phone, setPhone] = useState("");

  const handleChangePhoneNumber = (value: string, info: MuiTelInputInfo) => {
    setPhone(value);
    formik.setFieldValue("phoneNumber", value);
    const isValid = matchIsValidTel(value);
    if (isValid) {
      formik.setFieldValue("countryCode", info?.countryCallingCode || "");
    }
  };

  const [date, setDate] = useState<moment.Moment | null>(null);

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
                onChange={formik.handleChange}
                helperText={formik.errors.firstName}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Last Name*"
                fullWidth
                id="lastName"
                onChange={formik.handleChange}
                helperText={formik.errors.lastName}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Email Address*"
                fullWidth
                id="email"
                onChange={formik.handleChange}
                helperText={formik.errors.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
              />
            </Grid>
            <Grid size={6}>
              <MuiTelInput
                label="Phone Number*"
                defaultCountry="IN"
                onChange={handleChangePhoneNumber}
                value={phone}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={formik.errors.phoneNumber}
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
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={6}>
              <TextField
                label="Password*"
                fullWidth
                id="password"
                type="password"
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.errors.password}
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
              >
                Submit
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

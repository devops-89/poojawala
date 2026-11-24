"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeIcon from "@mui/icons-material/Home";
import ErrorIcon from "@mui/icons-material/Error";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import { State, City } from "@/utils/indianLocations";
import { COLORS, RASHI_OPTIONS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import {
  submitContactFormAPI,
  sendOtpAPI,
  verifyOtpAPI,
  registerUserAPI,
  getCustomerAddressesAPI,
} from "@/api/userControllers";
import { loginAPI, getMeAPI } from "@/api/authControllers";
import { extractRoleCsrfToken, saveRoleCsrfToken } from "@/api/config";
import { checkServiceAvailabilityAPI, resolveServiceId } from "@/api/serviceControllers";
import { customerCreateBookingAPI } from "@/api/bookingControllers";
import { getPaymentLinkAPI } from "@/api/paymentControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { MuiTelInput } from "@/components/widgets/MuiTelInput";
import {
  EMAIL_STRICT_REGEX,
  EMAIL_STRICT_MESSAGE,
  ADDRESS_STRICT_REGEX,
  ADDRESS_STRICT_MESSAGE,
  ADDRESS_LABEL_REGEX,
  ADDRESS_LABEL_MESSAGE,
  PINCODE_REGEX,
  PINCODE_MESSAGE,
  CITY_STATE_REGEX,
  CITY_MESSAGE,
  STATE_MESSAGE,
  extractBackendErrorMessage,
  allowOnlyLettersOnKeyDown,
  sanitizeLettersOnly,
  allowOnlyEmailCharsOnKeyDown,
  sanitizeEmailInput,
  normalizePoojaText,
} from "@/utils/helpers";
import SignUpBrandingSide from "@/components/layouts/userPages/components/SignUpBrandingSide";
import SignUpStepperHeader from "@/components/layouts/userPages/components/SignUpStepperHeader";
import SignUpStep2Address from "@/components/layouts/userPages/components/SignUpStep2Address";

const regStep1ValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE)
    .required("Email is required"),
  phone: Yup.string()
    .matches(
      /^[6-9][0-9]{9}$/,
      "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
    )
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const offlineLabelStyles = {
  fontFamily: FONTS.OUTFIT,
  fontSize: "12px",
  fontWeight: 700,
  color: "#374151",
  mb: 0.35,
  display: "block",
};

const offlineInputStyles = {
  "& .MuiOutlinedInput-root": {
    fontFamily: FONTS.OUTFIT,
    borderRadius: "10px",
    fontSize: "0.85rem",
    bgcolor: "rgba(255, 255, 255, 0.68)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "#1F1A17",
    height: "44px",
    boxSizing: "border-box",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    "@media (max-height: 660px)": {
      height: "39px",
    },
    "& fieldset": {
      borderColor: "rgba(220, 205, 190, 0.7)",
      borderWidth: "1.2px",
      transition: "all 0.2s ease",
    },
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.82)",
    },
    "&:hover fieldset": {
      borderColor: "#FF9100",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FF6200",
      borderWidth: "1.5px",
    },
    "&.Mui-focused": {
      bgcolor: "#FFFFFF",
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
  "& .MuiFormHelperText-root": {
    fontFamily: FONTS.OUTFIT,
    fontSize: "0.72rem",
    margin: "2px 0 -2px 0",
  },
};

function OfflineServiceStep1Personal({ onNext }: { onNext: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <Grid container spacing={{ xs: 1.25, sm: 1.5, md: 1.75 }} onKeyDown={handleKeyDown}>
      {/* First Name */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={offlineLabelStyles}>
          First Name <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="firstName">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Enter First Name"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("firstName", sanitizeLettersOnly(e.target.value));
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={offlineInputStyles}
            />
          )}
        </Field>
      </Grid>

      {/* Last Name */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={offlineLabelStyles}>
          Last Name <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="lastName">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Enter Last Name"
              variant="outlined"
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("lastName", sanitizeLettersOnly(e.target.value));
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={offlineInputStyles}
            />
          )}
        </Field>
      </Grid>

      {/* Email Address */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={offlineLabelStyles}>
          Email Address <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="email">
          {({ field, form, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Enter Email Address"
              variant="outlined"
              type="email"
              onKeyDown={allowOnlyEmailCharsOnKeyDown}
              onChange={(e) => {
                form.setFieldValue("email", sanitizeEmailInput(e.target.value));
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={offlineInputStyles}
            />
          )}
        </Field>
      </Grid>

      {/* Phone Number */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={offlineLabelStyles}>
          Phone Number <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="phone">
          {({ field, form, meta }: any) => (
            <MuiTelInput
              fullWidth
              disableDropdown
              onlyCountries={["IN"]}
              size="small"
              placeholder="Enter 10-digit mobile number"
              name="phone"
              variant="outlined"
              defaultCountry="IN"
              value={field.value ? "+91" + field.value : ""}
              onChange={(_newValue, info) => {
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
                ...offlineInputStyles,
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

      {/* Password */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={offlineLabelStyles}>
          Password <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
        </Typography>
        <Field name="password">
          {({ field, meta }: any) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="Enter Password (min. 8 characters)"
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
                          <VisibilityOff fontSize="small" sx={{ color: "#9CA3AF" }} />
                        ) : (
                          <Visibility fontSize="small" sx={{ color: "#9CA3AF" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={offlineInputStyles}
            />
          )}
        </Field>
      </Grid>

      {/* Confirm Password */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={offlineLabelStyles}>
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff fontSize="small" sx={{ color: "#9CA3AF" }} />
                        ) : (
                          <Visibility fontSize="small" sx={{ color: "#9CA3AF" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error}
              sx={offlineInputStyles}
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

const regFullValidationSchema = regStep1ValidationSchema.concat(
  Yup.object().shape({
    addressLabel: Yup.string()
      .trim()
      .matches(ADDRESS_LABEL_REGEX, ADDRESS_LABEL_MESSAGE)
      .required("Address label is required"),
    fullAddress: Yup.string()
      .trim()
      .required("Full address is required")
      .matches(ADDRESS_STRICT_REGEX, ADDRESS_STRICT_MESSAGE),
    city: Yup.string()
      .trim()
      .matches(CITY_STATE_REGEX, CITY_MESSAGE)
      .required("City is required"),
    state: Yup.string()
      .trim()
      .matches(CITY_STATE_REGEX, STATE_MESSAGE)
      .required("State is required"),
    pincode: Yup.string()
      .trim()
      .matches(PINCODE_REGEX, PINCODE_MESSAGE)
      .required("Pincode is required"),
  })
);

const unavailableEnquirySchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .required("Full Name is required"),
  email: Yup.string()
    .trim()
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE)
    .required("Email Address is required"),
  subject: Yup.string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject cannot exceed 100 characters")
    .required("Subject is required"),
  message: Yup.string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(1000, "Message cannot exceed 1000 characters")
    .required("Message is required"),
});

// Comprehensive Static Offline Services for Location Checking
export interface IOfflinePoojaService {
  id: string | number;
  name: string;
  hindiName: string;
  category: string;
  basicPrice: number;
  standardPrice: number;
  description: string;
  isAvailable: boolean; // Availability status in chosen location
  image: string;
  duration: string;
}

const STATIC_OFFLINE_SERVICES: IOfflinePoojaService[] = [
  {
    id: "bhoomi-puja",
    name: "Bhoomi Pooja",
    hindiName: "भूमि पूजा",
    category: "Vastu & Property",
    basicPrice: 5100,
    standardPrice: 11000,
    description:
      "Blessings of Mother Earth before construction or property development with Vastu Purush Pooja.",
    isAvailable: true,
    image: "/images/home/poojaPackages/bhoomi.webp",
    duration: "2 - 3 Hours",
  },
  {
    id: "griha-pravesh-puja",
    name: "Griha Pravesh Pooja",
    hindiName: "गृह प्रवेश पूजा",
    category: "Vastu & Property",
    basicPrice: 5100,
    standardPrice: 11000,
    description:
      "Sacred housewarming ritual with Vastu Shanti, Navgraha Pooja, Kalash Sthapana & Havan.",
    isAvailable: true,
    image: "/images/home/poojaPackages/grihaPravesh.webp",
    duration: "3 - 4 Hours",
  },
  {
    id: "rudrabhishek-puja",
    name: "Rudrabhishek Pooja",
    hindiName: "रुद्राभिषेक पूजा",
    category: "Shiva Pooja & Havan",
    basicPrice: 4800,
    standardPrice: 11000,
    description:
      "Sacred Shiva Abhishek with Panchamrit, bilva patra, and Vedic Rudri Path recitation.",
    isAvailable: true,
    image: "/images/home/poojaPackages/rudrabhishek.webp",
    duration: "2 - 3 Hours",
  },
  {
    id: "satyanarayan-puja",
    name: "Satyanarayan Katha & Pooja",
    hindiName: "सत्यनारायण कथा व पूजा",
    category: "Katha & Family",
    basicPrice: 3100,
    standardPrice: 6100,
    description:
      "Traditional Lord Vishnu Katha recitation for family peace, gratitude, and fulfillment of sankalp.",
    isAvailable: true,
    image: "/images/home/poojaPackages/satyanarayan.webp",
    duration: "2 - 2.5 Hours",
  },
  {
    id: "navgraha-shanti-puja",
    name: "Navgraha Shanti Pooja",
    hindiName: "नवग्रह शांति पूजा",
    category: "Dosha & Shanti",
    basicPrice: 5500,
    standardPrice: 12000,
    description:
      "Pacify malefic planetary influences and attract health, wealth and cosmic balance.",
    isAvailable: true,
    image: "/images/home/poojaPackages/navgrah.webp",
    duration: "3 Hours",
  },
  {
    id: "annaprashan-puja",
    name: "Annaprashan Sanskar",
    hindiName: "अन्नप्राशन संस्कार",
    category: "Sanskar Rituals",
    basicPrice: 3500,
    standardPrice: 6500,
    description:
      "Baby's first rice feeding sacred ceremony with Vedic mantras and divine blessings.",
    isAvailable: true,
    image: "/images/home/poojaPackages/annaprashan.webp",
    duration: "1.5 - 2 Hours",
  },
  {
    id: "ganesh-puja",
    name: "Ganesh Pooja & Havan",
    hindiName: "गणेश पूजा व हवन",
    category: "Auspicious Beginnings",
    basicPrice: 2500,
    standardPrice: 5100,
    description:
      "Removal of all obstacles, invocation of wisdom, and blessings for new ventures or milestones.",
    isAvailable: true,
    image: "/images/home/poojaPackages/ganesh.webp",
    duration: "1.5 - 2 Hours",
  },
  {
    id: "maha-mrityunjaya-jaap",
    name: "Maha Mrityunjaya Jaap & Havan",
    hindiName: "महा मृत्युंजय जाप व हवन",
    category: "Shiva Pooja & Havan",
    basicPrice: 11000,
    standardPrice: 21000,
    description:
      "Potent Vedic chanting with sacred Havan for health, rejuvenation, and longevity.",
    isAvailable: true,
    image: "/images/home/poojaPackages/rudrabhishek.webp",
    duration: "4 - 5 Hours",
  },
  {
    id: "vastu-shanti-puja",
    name: "Vastu Shanti Pooja",
    hindiName: "वास्तु शांति पूजा",
    category: "Vastu & Property",
    basicPrice: 6500,
    standardPrice: 13500,
    description:
      "Purification and directional dosha rectification for home, office or commercial establishments.",
    isAvailable: true,
    image: "/images/home/poojaPackages/grihaPravesh.webp",
    duration: "3 - 4 Hours",
  },
  {
    id: "namkaran-sanskar",
    name: "Namkaran Sanskar",
    hindiName: "नामकरण संस्कार",
    category: "Sanskar Rituals",
    basicPrice: 3100,
    standardPrice: 5500,
    description:
      "Sacred Vedic baby naming ceremony calculated according to birth nakshatra and astrological vidhi.",
    isAvailable: true,
    image: "/images/home/poojaPackages/annaprashan.webp",
    duration: "1.5 - 2 Hours",
  },
  {
    id: "mundan-sanskar",
    name: "Mundan Sanskar",
    hindiName: "मुंडन संस्कार",
    category: "Sanskar Rituals",
    basicPrice: 3500,
    standardPrice: 6500,
    description:
      "Traditional first haircut ceremony for child's purification, intellect, and healthy growth.",
    isAvailable: true,
    image: "/images/home/poojaPackages/annaprashan.webp",
    duration: "2 Hours",
  },
  {
    id: "chandi-path",
    name: "Durga Chandi Path & Havan",
    hindiName: "दुर्गा चंडी पाठ व हवन",
    category: "Devi Pooja",
    basicPrice: 7100,
    standardPrice: 15000,
    description:
      "Recitation of Durga Saptashati with Samput Path and Havan for victory, peace, and protection.",
    isAvailable: true,
    image: "/images/home/poojaPackages/satyanarayan.webp",
    duration: "3 - 4 Hours",
  },
  {
    id: "vivah-sanskar",
    name: "Vivah Sanskar (Vedic Marriage)",
    hindiName: "विवाह संस्कार",
    category: "Sanskar Rituals",
    basicPrice: 15000,
    standardPrice: 31000,
    description:
      "Complete traditional Vedic wedding ritual with Saptapadi, Kanyadaan, and sacred Agni vows.",
    isAvailable: false, // Marked unavailable / on-request as an example
    image: "/images/home/poojaPackages/satyanarayan.webp",
    duration: "5 - 6 Hours",
  },
  {
    id: "pitra-dosh-nivaran",
    name: "Pitra Dosh Nivaran Pooja",
    hindiName: "पितृ दोष निवारण पूजा",
    category: "Dosha & Shanti",
    basicPrice: 6500,
    standardPrice: 12500,
    description:
      "Ancestral peace and tarpan rituals to eliminate pitra dosha and invite family blessings.",
    isAvailable: false, // Marked unavailable / on-request
    image: "/images/home/poojaPackages/navgrah.webp",
    duration: "3 Hours",
  },
  {
    id: "kalsarp-dosh-shanti",
    name: "Kalsarp Dosh Shanti Pooja",
    hindiName: "कालसर्प दोष शांति पूजा",
    category: "Dosha & Shanti",
    basicPrice: 7500,
    standardPrice: 14500,
    description:
      "Astrological planetary mitigation for Rahu & Ketu alignment to unlock career and health prosperity.",
    isAvailable: false, // Marked unavailable / on-request
    image: "/images/home/poojaPackages/navgrah.webp",
    duration: "3 Hours",
  },
];

interface OfflineServiceLocationModalProps {
  open: boolean;
  onClose: () => void;
  service?: any;
  initialPlan?: string;
}

export default function OfflineServiceLocationModal({
  open,
  onClose,
  service,
  initialPlan = "standard",
}: OfflineServiceLocationModalProps) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile } = useUserStore();

  // Current Step: LOCATION -> SERVICES -> REGISTER_PERSONAL -> REGISTER_ADDRESS -> REGISTER_OTP -> SIGN_IN -> AVAILABLE_CHECKOUT / UNAVAILABLE_FORM -> SUCCESS
  const [step, setStep] = useState<
    | "LOCATION"
    | "SERVICES"
    | "REGISTER_PERSONAL"
    | "REGISTER_ADDRESS"
    | "REGISTER_OTP"
    | "SIGN_IN"
    | "AVAILABLE_CHECKOUT"
    | "UNAVAILABLE_FORM"
    | "SUCCESS"
  >("LOCATION");

  // Step 1: Location state (Only State & City)
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Step 2: Services list & selection
  const [serviceSearch, setServiceSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "standard">("standard");

  // User Registration State (for guest users booking available service - matches Image 1)
  const [regData, setRegData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    venueType: "HOME",
    addressLabel: "Home",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [regErrors, setRegErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // OTP State
  const [savedSignupValues, setSavedSignupValues] = useState<any>(null);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);

  // Sign In State (optional for existing users)
  const [signInIdentifier, setSignInIdentifier] = useState<string>("");
  const [signInPassword, setSignInPassword] = useState<string>("");
  const [showSignInPassword, setShowSignInPassword] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  // Step 3: Checkout / Form data
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [poojaDate, setPoojaDate] = useState<string>("");
  const [poojaTime, setPoojaTime] = useState<string>("09:00 AM");
  const [addressDetails, setAddressDetails] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<"TOKEN" | "FULL">("TOKEN");

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);
  const [bookingRefId, setBookingRefId] = useState<string>("");
  const [isSuccessForUnavailable, setIsSuccessForUnavailable] = useState<boolean>(false);
  const [confirmedServiceId, setConfirmedServiceId] = useState<number | string | null>(null);
  const [registeredAddressId, setRegisteredAddressId] = useState<number | null>(null);

  const fifteenYearsAgo = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 15);
    return d.toISOString().split("T")[0];
  }, []);

  // OTP Resend Countdown Timer
  useEffect(() => {
    let timer: any = null;
    if (step === "REGISTER_OTP" && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyOtpAndRegister();
    } else if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    const phone = savedSignupValues?.phone || regData.phone;
    const email = savedSignupValues?.email || regData.email;
    if (!email && !phone) {
      showSnackbar("Email not found to resend OTP", "error");
      return;
    }
    try {
      setIsSendingOtp(true);
      const res = await sendOtpAPI({ phone, email, role: "CUSTOMER" });
      if (res.success || res.statusCode === 200) {
        showSnackbar(res?.message || "OTP resent successfully to your email!", "success");
        setResendTimer(60);
      } else {
        showSnackbar(res.message || "Failed to resend OTP", "error");
      }
    } catch (err: any) {
      showSnackbar(extractBackendErrorMessage(err, "Failed to resend OTP"), "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      showSnackbar("Please enter a valid 6-digit OTP", "error");
      return;
    }
    const signupPayload = savedSignupValues || regData;
    if (!signupPayload || !signupPayload.phone) {
      showSnackbar("Registration data missing. Please fill the details again.", "error");
      setStep("REGISTER_PERSONAL");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const verifyRes = await verifyOtpAPI({
        phone: signupPayload.phone,
        email: signupPayload.email,
        otp: otpValue,
        role: "CUSTOMER",
      });

      if (verifyRes.success || verifyRes.statusCode === 200) {
        showSnackbar("OTP verified successfully! Creating account...", "success");

        // Construct FormData strictly matching Postman contract for POST /users/register
        const formData = new FormData();
        formData.append("countryCode", signupPayload.countryCode || "+91");

        Object.keys(signupPayload).forEach((key) => {
          if (key === "latitude" || key === "longitude") {
            const val = signupPayload[key];
            if (val && val !== "0" && String(val).trim() !== "") {
              formData.append(key, String(val));
            }
          } else if (key !== "countryCode") {
            const val = signupPayload[key];
            if (val !== undefined && val !== null) {
              formData.append(key, String(val));
            }
          }
        });

        // Provide safe defaults for backend schema if missing
        if (!formData.has("dob") || !formData.get("dob")) {
          formData.append("dob", "2000-01-01");
        }
        if (!formData.has("birthPlace") || !formData.get("birthPlace")) {
          formData.append("birthPlace", signupPayload.city || effectiveCity || "Delhi");
        }
        if (!formData.has("rashi") || !formData.get("rashi")) {
          formData.append("rashi", "Mesh");
        }
        if (!formData.has("gotra") || !formData.get("gotra")) {
          formData.append("gotra", "Kashyap");
        }

        const registerRes = await registerUserAPI(formData);

        if (
          registerRes.success ||
          registerRes.statusCode === 200 ||
          registerRes.statusCode === 201
        ) {
          const token =
            registerRes.tokens?.access?.token ||
            registerRes.accessToken ||
            registerRes.token ||
            registerRes.data?.accessToken ||
            registerRes.data?.token;

          let userObj =
            registerRes.user ||
            registerRes.data?.user ||
            registerRes.data?.data ||
            registerRes.data;

          if (token) {
            try {
              const meResponse = await getMeAPI(token);
              const freshUser =
                meResponse?.user ||
                meResponse?.data?.user ||
                meResponse?.data?.data ||
                meResponse?.data ||
                meResponse;
              if (freshUser && typeof freshUser === "object") {
                userObj = freshUser;
              }
            } catch (e) {
              console.error("Error fetching fresh profile after register:", e);
            }
          }

          const role = userObj?.role || registerRes.user?.role || registerRes.role || "CUSTOMER";
          const csrf =
            registerRes.poojawalaCustomerCsrfToken ||
            registerRes.data?.poojawalaCustomerCsrfToken ||
            extractRoleCsrfToken(registerRes, role) ||
            extractRoleCsrfToken(registerRes.data, role);
          if (csrf) {
            saveRoleCsrfToken(csrf, role);
          }

          if (typeof window !== "undefined") {
            if (token) sessionStorage.setItem("accessToken", token);
            const refreshToken =
              registerRes.tokens?.refresh?.token ||
              registerRes.refreshToken ||
              registerRes.data?.refreshToken;
            if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
            sessionStorage.setItem("role", role);
            sessionStorage.setItem("activeRole", role);
            if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
          }

          if (userObj) {
            useUserStore.getState().setProfile(userObj);
          }

          // Address ID from registration response (address.id or addressId)
          const newAddressId =
            registerRes.address?.id ||
            registerRes.data?.address?.id ||
            registerRes.addressId;
          if (newAddressId) {
            setRegisteredAddressId(Number(newAddressId));
          }

          // Auto-login fallback if token wasn't in registration response
          let authToken = token;
          if (!authToken && signupPayload.email && signupPayload.password) {
            try {
              const loginRes = await loginAPI({
                email: signupPayload.email,
                password: signupPayload.password,
                role: "CUSTOMER",
              });
              if (loginRes.success || loginRes.statusCode === 200) {
                authToken =
                  loginRes.tokens?.access?.token ||
                  loginRes.accessToken ||
                  loginRes.token ||
                  loginRes.data?.accessToken;
                if (authToken && typeof window !== "undefined") {
                  sessionStorage.setItem("accessToken", authToken);
                  localStorage.setItem("accessToken", authToken);
                }
                const loginCsrf = extractRoleCsrfToken(loginRes, "CUSTOMER");
                if (loginCsrf) saveRoleCsrfToken(loginCsrf, "CUSTOMER");
              }
            } catch (loginErr) {
              console.error("Auto login error after registration:", loginErr);
            }
          }

          // Prefill checkout details for fallback
          const fullName = [signupPayload.firstName, signupPayload.lastName].filter(Boolean).join(" ");
          setCustomerName(fullName);
          setCustomerPhone(signupPayload.phone);
          setCustomerEmail(signupPayload.email);
          setAddressDetails(signupPayload.fullAddress || `${effectiveCity}, ${selectedState}`);

          // Directly invoke Customer Create Booking API (POST /bookings/add) as requested
          try {
            const numServiceId =
              Number(confirmedServiceId) ||
              Number(resolveServiceId(selectedService?.id || service?.id || service)) ||
              Number(selectedService?.id) ||
              Number(service?.id) ||
              4;

            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 3);
            defaultDate.setHours(10, 0, 0, 0);
            const bookingSchedule = poojaDate
              ? new Date(poojaDate).toISOString()
              : defaultDate.toISOString();

            const bookingPayload: any = {
              serviceId: numServiceId,
              scheduledAt: bookingSchedule,
              customerAddressId: newAddressId ? Number(newAddressId) : (registeredAddressId ? Number(registeredAddressId) : undefined),
              specialInstructions: specialInstructions || "Bring all puja materials",
              plan: (selectedPlan || "BASIC").toUpperCase(),
              paymentOption: paymentOption || "TOKEN",
              bookingMode: "OFFLINE",
              customFields: {
                language: "Hindi",
              },
            };

            const bookingRes = await customerCreateBookingAPI(bookingPayload, csrf, authToken);
            if (bookingRes.success || bookingRes.statusCode === 201 || bookingRes.statusCode === 200) {
              const resData = bookingRes.data?.data || bookingRes.data || bookingRes;
              let paymentUrl =
                resData?.payment?.paymentUrl ||
                resData?.payment?.short_url ||
                resData?.payment?.payment_link ||
                resData?.paymentUrl ||
                resData?.paymentLink ||
                resData?.payment_link ||
                resData?.redirectUrl ||
                resData?.paymentRedirectUrl ||
                resData?.razorpayPaymentLinkId ||
                resData?.razorpayPaymentLink ||
                resData?.short_url ||
                resData?.url ||
                bookingRes?.paymentUrl ||
                bookingRes?.data?.paymentUrl ||
                bookingRes?.data?.payment?.paymentUrl ||
                bookingRes?.payment?.paymentUrl;

              const bookingIdToUse = resData?.bookingId || resData?.id;

              // Fallback: If no payment link returned directly, fetch via getPaymentLinkAPI
              if (!paymentUrl && bookingIdToUse) {
                try {
                  const callbackUrl =
                    typeof window !== "undefined"
                      ? `${window.location.origin}/customer/bookings/${bookingIdToUse}`
                      : "https://1pooja.com/customer/bookings";
                  const payRes = await getPaymentLinkAPI(bookingIdToUse, callbackUrl);
                  const payData = payRes?.data?.data || payRes?.data || payRes;
                  paymentUrl =
                    payData?.paymentUrl ||
                    payData?.short_url ||
                    payData?.paymentLink ||
                    payData?.razorpayPaymentLinkId ||
                    payData?.url ||
                    (typeof payRes === "string" ? payRes : null);
                } catch (e) {
                  console.error("Failed to fetch payment link fallback:", e);
                }
              }

              const refNum = resData?.bookingNumber || resData?.bookingId || `BK-${Date.now().toString().slice(-6)}`;
              setBookingRefId(refNum);
              setIsSuccessForUnavailable(false);

              if (
                paymentUrl &&
                typeof paymentUrl === "string" &&
                (paymentUrl.startsWith("http://") || paymentUrl.startsWith("https://") || paymentUrl.startsWith("/"))
              ) {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("booking_payment_pending", "true");
                }
                showSnackbar("Booking created successfully! Redirecting to payment...", "success");
                window.location.href = paymentUrl;
                return;
              }

              setStep("SUCCESS");
              showSnackbar("Booking created successfully!", "success");
              return;
            }
          } catch (bookingErr: any) {
            console.error("Auto booking creation error after register:", bookingErr);
            // If booking API encounters error, smooth fallback to AVAILABLE_CHECKOUT so user can confirm
            setStep("AVAILABLE_CHECKOUT");
            showSnackbar("Account registered! Please review your details and confirm booking.", "info");
            return;
          }
        } else {
          showSnackbar(registerRes.message || "Failed to create account", "error");
        }
      } else {
        showSnackbar(verifyRes.message || "Invalid OTP entered", "error");
      }
    } catch (err: any) {
      showSnackbar(extractBackendErrorMessage(err, "OTP verification or registration failed"), "error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!signInIdentifier.trim()) {
      showSnackbar("Please enter your email or phone number", "warning");
      return;
    }
    if (!signInPassword.trim()) {
      showSnackbar("Please enter your password", "warning");
      return;
    }

    try {
      setIsSigningIn(true);
      const isEmail = signInIdentifier.includes("@");
      const payload: any = {
        password: signInPassword,
        role: "CUSTOMER",
      };
      if (isEmail) {
        payload.email = signInIdentifier.trim().toLowerCase();
      } else {
        payload.phone = signInIdentifier.trim().replace(/\D/g, "");
      }

      const res = await loginAPI(payload);
      if (res.success || res.statusCode === 200) {
        const token = res.tokens?.access?.token || res.accessToken || res.token || res.data?.accessToken;
        let userObj = res.user || res.data?.user || res.data?.data || res.data;

        if (token) {
          try {
            const meRes = await getMeAPI(token);
            const fresh = meRes?.user || meRes?.data?.user || meRes?.data;
            if (fresh) userObj = fresh;
          } catch (e) {}
        }

        const role = userObj?.role || "CUSTOMER";
        const csrf = extractRoleCsrfToken(res, role) || extractRoleCsrfToken(res.data, role);
        if (csrf) saveRoleCsrfToken(csrf, role);

        if (typeof window !== "undefined") {
          if (token) sessionStorage.setItem("accessToken", token);
          const refreshToken = res.tokens?.refresh?.token || res.refreshToken || res.data?.refreshToken;
          if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
          sessionStorage.setItem("role", role);
          sessionStorage.setItem("activeRole", role);
          if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        }

        if (userObj) {
          useUserStore.getState().setProfile(userObj);
          const name = [userObj.firstName, userObj.lastName].filter(Boolean).join(" ") || userObj.name || "";
          if (name) setCustomerName(name);
          if (userObj.phone || userObj.phoneNumber) setCustomerPhone(userObj.phone || userObj.phoneNumber);
          if (userObj.email) setCustomerEmail(userObj.email);
          if (userObj.fullAddress || userObj.address) {
            setAddressDetails(userObj.fullAddress || userObj.address);
          } else {
            setAddressDetails(`${effectiveCity}, ${selectedState}`);
          }
        }

        showSnackbar("Signed in successfully!", "success");
        setStep("AVAILABLE_CHECKOUT");
      } else {
        showSnackbar(res.message || "Failed to sign in", "error");
      }
    } catch (err: any) {
      showSnackbar(extractBackendErrorMessage(err, "Failed to sign in"), "error");
    } finally {
      setIsSigningIn(false);
    }
  };

  // Prefill user details if logged in
  useEffect(() => {
    if (profile) {
      const fullName =
        [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
        profile.name ||
        "";
      if (fullName) setCustomerName(fullName);
      if (profile.email) setCustomerEmail(profile.email);
      if (profile.phone || profile.phoneNumber) {
        setCustomerPhone(profile.phone || profile.phoneNumber || "");
      }
    }
  }, [profile]);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (open) {
      setStep("LOCATION");
      setSelectedPlan(initialPlan === "basic" ? "basic" : "standard");
      setSubmitting(false);
      setServiceSearch("");
      setSelectedCategory("ALL");
      setSelectedState("");
      setSelectedCity("");
      setSavedSignupValues(null);
      setOtp(["", "", "", "", "", ""]);
      setSignInIdentifier("");
      setSignInPassword("");

      // Auto-match current service from props
      if (service) {
        const found = STATIC_OFFLINE_SERVICES.find(
          (s) =>
            s.id === service.slug ||
            s.id === service.id ||
            s.name.toLowerCase().includes((service.name || "").toLowerCase()),
        );
        if (found) {
          setSelectedService(found);
        } else {
          // Construct service object from current service props
          setSelectedService({
            id: service.slug || service.id || "custom-service",
            name: service.name || service.title || "Selected Pooja Service",
            hindiName: service.hindiName || "वैदिक पूजा",
            category: "Offline Services",
            basicPrice: Number(
              service?.plans?.basic?.price || service?.minPrice || 5100,
            ),
            standardPrice: Number(
              service?.plans?.standard?.price || service?.maxPrice || 11000,
            ),
            description:
              service.description ||
              "Authentic Vedic pooja ceremony performed by verified Purohits.",
            isAvailable: true,
            image:
              service.iconDownloadurl ||
              service.iconUrl ||
              "/images/home/poojaPackages/bhoomi.webp",
            duration: service.durationMinutes
              ? `${service.durationMinutes} mins`
              : "2 - 3 Hours",
          });
        }
      }
    }
  }, [open, service, initialPlan]);

  // Indian States & Cities
  const indianStates = useMemo(() => State.getStatesOfCountry("IN") || [], []);
  const selectedStateObj = useMemo(() => {
    return indianStates.find(
      (s) => s.name.toLowerCase() === selectedState.toLowerCase(),
    );
  }, [selectedState, indianStates]);

  const stateCities = useMemo(() => {
    if (!selectedStateObj) return [];
    return City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
  }, [selectedStateObj]);

  const stateOptions = useMemo(
    () => indianStates.map((s) => s.name),
    [indianStates],
  );
  const cityOptions = useMemo(
    () => stateCities.map((c) => c.name),
    [stateCities],
  );

  const effectiveCity = selectedCity;

  // Filtered Services for Step 2
  const filteredServices = useMemo(() => {
    let list = STATIC_OFFLINE_SERVICES;

    // If current service was provided and not in static list, prepend it
    if (
      service &&
      !list.some(
        (s) =>
          s.id === service.slug ||
          s.id === service.id ||
          s.name.toLowerCase() === (service.name || "").toLowerCase(),
      )
    ) {
      const dynamicService: IOfflinePoojaService = {
        id: service.slug || service.id || "current-service",
        name: service.name || "Custom Pooja",
        hindiName: service.hindiName || "वैदिक पूजा",
        category: "Selected Pooja",
        basicPrice: Number(service?.plans?.basic?.price || 5100),
        standardPrice: Number(service?.plans?.standard?.price || 11000),
        description:
          service.shortDescription ||
          service.description ||
          "Authentic Vedic pooja ceremony.",
        isAvailable: true,
        image:
          service.iconDownloadurl ||
          service.iconUrl ||
          "/images/home/poojaPackages/bhoomi.webp",
        duration: "2 - 3 Hours",
      };
      list = [dynamicService, ...list];
    }

    if (serviceSearch.trim()) {
      const q = serviceSearch.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.hindiName.includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "ALL") {
      list = list.filter((s) =>
        s.category.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    return list;
  }, [serviceSearch, selectedCategory, service]);

  // Continue from Step 1 (Location): Check service availability via API or proceed
  const handleProceedToServices = async () => {
    if (!selectedState.trim()) {
      showSnackbar("Please select your state", "warning");
      return;
    }
    if (!effectiveCity.trim()) {
      showSnackbar("Please select or enter your city", "warning");
      return;
    }

    // Determine target service ID
    const targetServiceId =
      service?.id ||
      service?._id ||
      selectedService?.id ||
      resolveServiceId(service?.slug || service?.id || selectedService?.slug || "");

    // If a specific service is provided, check availability with backend API
    if (targetServiceId) {
      try {
        setCheckingAvailability(true);
        const res = await checkServiceAvailabilityAPI(targetServiceId, {
          city: effectiveCity.trim(),
          state: selectedState.trim(),
        });

        // Backend response format:
        // { success: true, statusCode: 200, message: "Service is available", data: { serviceId: 309, isAvailable: true, city: "...", state: "..." } }
        const isAvail = Boolean(res?.data?.isAvailable ?? res?.isAvailable);

        if (isAvail) {
          const resServiceId =
            res?.data?.serviceId ||
            res?.serviceId ||
            res?.data?.id ||
            res?.id ||
            (Number(targetServiceId) || resolveServiceId(targetServiceId));
          if (resServiceId) {
            setConfirmedServiceId(resServiceId);
          }
          showSnackbar(res?.message || `Service is available in ${effectiveCity}!`, "success");
          setSelectedService((prev: any) => ({
            ...(prev || service || {}),
            name: prev?.name || service?.name || service?.title || "Selected Pooja Service",
            hindiName: prev?.hindiName || service?.hindiName || "वैदिक पूजा",
            basicPrice: Number(prev?.basicPrice || service?.plans?.basic?.price || service?.minPrice || 3500),
            standardPrice: Number(prev?.standardPrice || service?.plans?.standard?.price || service?.maxPrice || 6500),
            isAvailable: true,
            city: effectiveCity.trim(),
            state: selectedState.trim(),
          }));
          if (!addressDetails) {
            setAddressDetails(`${effectiveCity}, ${selectedState}`);
          }
          // Direct to Registration Step 1 for guest users; direct to checkout if already logged in
          const currentUser = useUserStore.getState().profile;
          if (currentUser) {
            setStep("AVAILABLE_CHECKOUT");
          } else {
            setRegData((prev) => ({
              ...prev,
              city: effectiveCity.trim(),
              state: selectedState.trim(),
            }));
            setStep("REGISTER_PERSONAL");
          }
        } else {
          showSnackbar(
            res?.message || `Service is currently unavailable in ${effectiveCity}. Please leave your details to request it.`,
            "info"
          );
          setSelectedService((prev: any) => ({
            ...(prev || service || {}),
            name: prev?.name || service?.name || service?.title || "Selected Pooja Service",
            hindiName: prev?.hindiName || service?.hindiName || "वैदिक पूजा",
            isAvailable: false,
            city: effectiveCity.trim(),
            state: selectedState.trim(),
          }));
          // Direct to lead enquiry form
          setStep("UNAVAILABLE_FORM");
        }
      } catch (error: any) {
        const errData = error?.response?.data;
        if (
          errData &&
          (errData.isAvailable === false ||
            errData?.data?.isAvailable === false ||
            errData.success === false)
        ) {
          showSnackbar(
            errData.message || `Service is not available in ${effectiveCity}. Please leave your details to request it.`,
            "info"
          );
          setSelectedService((prev: any) => ({
            ...(prev || service || {}),
            name: prev?.name || service?.name || service?.title || "Selected Pooja Service",
            hindiName: prev?.hindiName || service?.hindiName || "वैदिक पूजा",
            isAvailable: false,
            city: effectiveCity.trim(),
            state: selectedState.trim(),
          }));
          setStep("UNAVAILABLE_FORM");
        } else {
          console.error("Availability check error:", error);
          showSnackbar(
            error?.response?.data?.message ||
              "Could not verify online availability. Please proceed with your booking details.",
            "warning"
          );
          setSelectedService((prev: any) => ({
            ...(prev || service || {}),
            name: prev?.name || service?.name || service?.title || "Selected Pooja Service",
            hindiName: prev?.hindiName || service?.hindiName || "वैदिक पूजा",
            basicPrice: Number(prev?.basicPrice || service?.plans?.basic?.price || service?.minPrice || 3500),
            standardPrice: Number(prev?.standardPrice || service?.plans?.standard?.price || service?.maxPrice || 6500),
            isAvailable: true,
            city: effectiveCity.trim(),
            state: selectedState.trim(),
          }));
          const currentUser = useUserStore.getState().profile;
          if (currentUser) {
            setStep("AVAILABLE_CHECKOUT");
          } else {
            setRegData((prev) => ({
              ...prev,
              city: effectiveCity.trim(),
              state: selectedState.trim(),
            }));
            setStep("REGISTER_PERSONAL");
          }
        }
      } finally {
        setCheckingAvailability(false);
      }
    } else {
      // If no specific service prop was provided, show the available services list
      setStep("SERVICES");
    }
  };

  // Handle Service Selection
  const handleSelectServiceCard = (item: IOfflinePoojaService) => {
    setSelectedService(item);
    if (!item.isAvailable) {
      // Direct to Unavailable Lead Form as requested
      setStep("UNAVAILABLE_FORM");
    } else {
      const currentUser = useUserStore.getState().profile;
      if (currentUser) {
        setStep("AVAILABLE_CHECKOUT");
      } else {
        setRegData((prev) => ({
          ...prev,
          city: effectiveCity.trim(),
          state: selectedState.trim(),
        }));
        setStep("REGISTER_PERSONAL");
      }
    }
  };

  // Handle Available Service Booking / Checkout
  const handleConfirmAvailableCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showSnackbar("Please enter your name", "warning");
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      showSnackbar("Please enter a valid 10-digit mobile number", "warning");
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      showSnackbar("Please enter a valid email address", "warning");
      return;
    }
    if (!addressDetails.trim()) {
      showSnackbar("Please enter your delivery / venue address", "warning");
      return;
    }

    try {
      setSubmitting(true);
      let targetAddressId = registeredAddressId;
      if (!targetAddressId) {
        try {
          const addrRes = await getCustomerAddressesAPI();
          const addrList = addrRes?.data?.data || addrRes?.data || addrRes || [];
          if (Array.isArray(addrList) && addrList.length > 0) {
            targetAddressId = addrList[0]?.id;
          }
        } catch (e) {}
      }

      const numServiceId =
        Number(confirmedServiceId) ||
        Number(resolveServiceId(selectedService?.id || service?.id || service)) ||
        Number(selectedService?.id) ||
        Number(service?.id) ||
        4;

      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      defaultDate.setHours(10, 0, 0, 0);
      const bookingSchedule = poojaDate
        ? new Date(poojaDate).toISOString()
        : defaultDate.toISOString();

      const bookingPayload: any = {
        serviceId: numServiceId,
        scheduledAt: bookingSchedule,
        customerAddressId: targetAddressId ? Number(targetAddressId) : undefined,
        specialInstructions: specialInstructions || "Bring all puja materials",
        plan: (selectedPlan || "BASIC").toUpperCase(),
        paymentOption: paymentOption || "TOKEN",
        bookingMode: "OFFLINE",
        customFields: {
          language: "Hindi",
        },
      };

      const bookingRes = await customerCreateBookingAPI(bookingPayload);
      if (bookingRes.success || bookingRes.statusCode === 201 || bookingRes.statusCode === 200) {
        const resData = bookingRes.data?.data || bookingRes.data || bookingRes;
        let paymentUrl =
          resData?.payment?.paymentUrl ||
          resData?.payment?.short_url ||
          resData?.payment?.payment_link ||
          resData?.paymentUrl ||
          resData?.paymentLink ||
          resData?.payment_link ||
          resData?.redirectUrl ||
          resData?.paymentRedirectUrl ||
          resData?.razorpayPaymentLinkId ||
          resData?.razorpayPaymentLink ||
          resData?.short_url ||
          resData?.url ||
          bookingRes?.paymentUrl ||
          bookingRes?.data?.paymentUrl ||
          bookingRes?.data?.payment?.paymentUrl ||
          bookingRes?.payment?.paymentUrl;

        const bookingIdToUse = resData?.bookingId || resData?.id;

        // Fallback: If no payment link returned directly, fetch via getPaymentLinkAPI
        if (!paymentUrl && bookingIdToUse) {
          try {
            const callbackUrl =
              typeof window !== "undefined"
                ? `${window.location.origin}/customer/bookings/${bookingIdToUse}`
                : "https://1pooja.com/customer/bookings";
            const payRes = await getPaymentLinkAPI(bookingIdToUse, callbackUrl);
            const payData = payRes?.data?.data || payRes?.data || payRes;
            paymentUrl =
              payData?.paymentUrl ||
              payData?.short_url ||
              payData?.paymentLink ||
              payData?.razorpayPaymentLinkId ||
              payData?.url ||
              (typeof payRes === "string" ? payRes : null);
          } catch (e) {
            console.error("Failed to fetch payment link fallback:", e);
          }
        }

        const refNum = resData?.bookingNumber || resData?.bookingId || `BK-${Date.now().toString().slice(-6)}`;
        setBookingRefId(refNum);
        setIsSuccessForUnavailable(false);

        if (
          paymentUrl &&
          typeof paymentUrl === "string" &&
          (paymentUrl.startsWith("http://") || paymentUrl.startsWith("https://") || paymentUrl.startsWith("/"))
        ) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("booking_payment_pending", "true");
          }
          showSnackbar("Booking created successfully! Redirecting to payment...", "success");
          window.location.href = paymentUrl;
          return;
        }

        setStep("SUCCESS");
        showSnackbar("Booking created successfully!", "success");
        return;
      } else {
        showSnackbar(bookingRes.message || "Failed to create booking", "error");
      }
    } catch (err: any) {
      showSnackbar(extractBackendErrorMessage(err, "Failed to create booking"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          bgcolor: "rgba(15, 23, 42, 0.45)",
        },
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", sm: "center" },
          justifyContent: "center",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            bgcolor: "rgba(15, 23, 42, 0.45)",
          },
        },
        paper: {
          sx: {
            width: "100%",
            maxWidth: { xs: "100%", sm: "640px", md: "780px" },
            m: { xs: 0, sm: 2 },
            borderRadius: { xs: "24px 24px 0 0", sm: "24px" },
            maxHeight: { xs: "90vh", sm: "92vh" },
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#FFFFFF",
            boxShadow: "0 24px 60px rgba(44, 24, 16, 0.25)",
          },
        },
      }}
    >
      {/* Mobile Bottom Sheet Drag Handle */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          width: 44,
          height: 4,
          bgcolor: "#E2E8F0",
          borderRadius: 2,
          mx: "auto",
          mt: 1.2,
          mb: 0.5,
        }}
      />

      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #F1E5D8",
          py: { xs: 1.8, sm: 2.2 },
          px: { xs: 2, sm: 3.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.2, sm: 1.8 },
            flex: 1,
            minWidth: 0,
            pr: 1,
          }}
        >
          {step !== "LOCATION" && step !== "SUCCESS" && (
            <IconButton
              size="small"
              onClick={() => {
                if (step === "SERVICES") setStep("LOCATION");
                else if (step === "REGISTER_PERSONAL") setStep(service ? "LOCATION" : "SERVICES");
                else if (step === "REGISTER_ADDRESS") setStep("REGISTER_PERSONAL");
                else if (step === "REGISTER_OTP") setStep("REGISTER_ADDRESS");
                else if (step === "SIGN_IN") setStep("REGISTER_PERSONAL");
                else if (step === "AVAILABLE_CHECKOUT" || step === "UNAVAILABLE_FORM") {
                  setStep(service ? "LOCATION" : "SERVICES");
                }
              }}
              sx={{
                color: COLORS.PRIMARY,
                bgcolor: "#FFF4EB",
                mr: 0.5,
                flexShrink: 0,
                "&:hover": { bgcolor: "#FFE7D6" },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}

          <Box
            sx={{
              width: { xs: 38, sm: 44 },
              height: { xs: 38, sm: 44 },
              borderRadius: "14px",
              bgcolor: "#FFF4EB",
              border: "1.5px solid #FFE4D1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.PRIMARY,
              flexShrink: 0,
            }}
          >
            {step === "REGISTER_OTP" ? (
              <LockOutlinedIcon fontSize="medium" />
            ) : step === "SIGN_IN" ? (
              <PersonIcon fontSize="medium" />
            ) : (
              <LocationOnIcon fontSize="medium" />
            )}
          </Box>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: "#1A0B05",
                fontSize: { xs: "16px", sm: "20px" },
                lineHeight: 1.25,
              }}
            >
              {step === "LOCATION" && "Select Pooja Location"}
              {step === "SERVICES" && `Available Poojas in ${effectiveCity}`}
              {step === "REGISTER_PERSONAL" && "Create an Account"}
              {step === "REGISTER_ADDRESS" && "Delivery Address Details"}
              {step === "REGISTER_OTP" && "Verify OTP"}
              {step === "SIGN_IN" && "Sign In to 1Pooja"}
              {step === "AVAILABLE_CHECKOUT" && "Pooja Booking Checkout"}
              {step === "UNAVAILABLE_FORM" && "Send a Message"}
              {step === "SUCCESS" && (isSuccessForUnavailable ? "Message Sent!" : "Booking Received")}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "12.5px",
                color: "#7A685D",
                mt: 0.3,
                fontWeight: 500,
              }}
            >
              {step === "LOCATION" && "Certified Vedic Pandits & complete samagri at your venue"}
              {step === "SERVICES" && "Browse authentic pooja packages and check pandit availability"}
              {step === "REGISTER_PERSONAL" && "Step 1 of 2: Personal & Account Details"}
              {step === "REGISTER_ADDRESS" && "Step 2 of 2: Enter Delivery & Venue Details"}
              {step === "REGISTER_OTP" && "Enter the 6-digit verification code sent to your email to complete registration"}
              {step === "SIGN_IN" && "Sign in with your registered mobile or email to book"}
              {step === "AVAILABLE_CHECKOUT" && "Fill in your address and preferred muhurat date"}
              {step === "UNAVAILABLE_FORM" && "Fill out the form below and we will get back to you as soon as possible."}
              {step === "SUCCESS" && (isSuccessForUnavailable ? "Thank you for reaching out. Our team will get back to you shortly." : "We have received your puja request")}
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          disabled={submitting}
          sx={{
            color: "#64748B",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            width: 36,
            height: 36,
            flexShrink: 0,
            "&:hover": { bgcolor: "#F1F5F9", color: "#1E293B" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Main Body Content */}
      <DialogContent
        sx={{ p: { xs: 2, sm: 3.5 }, bgcolor: "#FFFFFF", overflowY: "auto" }}
      >
        {/* ============================================================ */}
        {/* STEP 1: LOCATION SELECTION (STATE & CITY)                    */}
        {/* ============================================================ */}
        {step === "LOCATION" && (
          <Box sx={{ pt: 1 }}>
            {/* State & City Searchable Dropdowns with Typeable Placeholders */}
            <Grid container spacing={2.5}>
              {/* State Selection */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  openOnFocus
                  autoHighlight
                  options={stateOptions}
                  value={selectedState || null}
                  onChange={(_, newValue) => {
                    const newState = newValue || "";
                    setSelectedState(newState);
                    setSelectedCity("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State / राज्य *"
                      placeholder="Search or select State..."
                      variant="outlined"
                      autoComplete="off"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "14px",
                          bgcolor: "#FFFFFF",
                          fontFamily: FONTS.PRIMARY,
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* City Selection */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  openOnFocus
                  freeSolo
                  autoHighlight
                  disabled={!selectedState}
                  options={cityOptions}
                  value={selectedCity || ""}
                  onChange={(_, newValue) => {
                    setSelectedCity(newValue || "");
                  }}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === "input" || reason === "clear") {
                      setSelectedCity(newInputValue || "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City / शहर *"
                      placeholder={
                        selectedState
                          ? "Search or select City..."
                          : "Select state first..."
                      }
                      variant="outlined"
                      autoComplete="off"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "14px",
                          bgcolor: "#FFFFFF",
                          fontFamily: FONTS.PRIMARY,
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Proceed Button */}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                onClick={handleProceedToServices}
                disabled={!effectiveCity.trim() || !selectedState.trim() || checkingAvailability}
                sx={{
                  background:
                    !effectiveCity.trim() || !selectedState.trim()
                      ? "#E2E8F0 !important"
                      : "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
                  color:
                    !effectiveCity.trim() || !selectedState.trim()
                      ? "#94A3B8 !important"
                      : "#FFFFFF !important",
                  width: { xs: "100%", sm: "auto" },
                  px: 4,
                  py: { xs: 1.3, sm: 1.4 },
                  borderRadius: "14px",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "15px" },
                  textTransform: "none",
                  boxShadow:
                    !effectiveCity.trim() || !selectedState.trim()
                      ? "none"
                      : "0 8px 24px rgba(255, 98, 0, 0.35)",
                  transition: "all 0.25s ease",
                  "&.Mui-disabled": {
                    background: "#E2E8F0 !important",
                    color: "#94A3B8 !important",
                    "& .MuiButton-endIcon": {
                      color: "#94A3B8 !important",
                    },
                  },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 28px rgba(255, 98, 0, 0.45)",
                  },
                }}
              >
                {checkingAvailability ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
                    <span>Checking Availability...</span>
                  </Box>
                ) : (
                  <span>Check Available Services in {effectiveCity || "City"} →</span>
                )}
              </Button>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 2: AVAILABLE SERVICES FOR THE CHOSEN LOCATION           */}
        {/* ============================================================ */}
        {step === "SERVICES" && (
          <Box>
            {/* Top Location Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#FAF4EE",
                border: "1px solid #EADCCF",
                borderRadius: "14px",
                p: 2,
                mb: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <LocationOnIcon sx={{ color: COLORS.PRIMARY, fontSize: 22 }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#2C1810",
                  }}
                >
                  Location:{" "}
                  <strong>
                    {effectiveCity}, {selectedState}
                  </strong>
                </Typography>
              </Box>

              <Button
                size="small"
                onClick={() => setStep("LOCATION")}
                sx={{
                  color: COLORS.PRIMARY,
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "12.5px",
                  textTransform: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Change Location (स्थान बदलें)
              </Button>
            </Box>

            {/* Search and Category Filter */}
            <Box sx={{ mb: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search pooja by name (e.g. Griha Pravesh, Rudrabhishek, Bhoomi Pooja)..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#8C7A6B", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "#FAF8F5",
                    fontFamily: FONTS.PRIMARY,
                  },
                }}
              />
            </Box>

            {/* Services List / Cards */}
            <Box
              sx={{
                maxHeight: "440px",
                overflowY: "auto",
                pr: 0.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.8,
              }}
            >
              {filteredServices.map((srv) => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <Box
                    key={srv.id}
                    onClick={() => handleSelectServiceCard(srv)}
                    sx={{
                      p: 2.2,
                      borderRadius: "16px",
                      border: isSelected
                        ? `2px solid ${COLORS.PRIMARY}`
                        : "1.5px solid #F1E5D8",
                      bgcolor: isSelected ? "#FFFBF7" : "#FFFFFF",
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 6px 20px rgba(255, 98, 0, 0.12)"
                        : "0 2px 8px rgba(0, 0, 0, 0.02)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: COLORS.PRIMARY,
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(255, 98, 0, 0.14)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 800,
                              fontSize: "16px",
                              color: "#1A0B05",
                            }}
                          >
                            {srv.name}
                          </Typography>
                          {srv.hindiName && (
                            <Typography
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontWeight: 600,
                                fontSize: "14px",
                                color: COLORS.PRIMARY,
                              }}
                            >
                              ({srv.hindiName})
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "13px",
                            color: "#5C4A40",
                            lineHeight: 1.4,
                            mb: 1.5,
                          }}
                        >
                          {srv.description}
                        </Typography>

                        {/* Badges: Category & Availability */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Chip
                            size="small"
                            label={srv.category}
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "11px",
                              bgcolor: "#F2EBE3",
                              color: "#4A3222",
                              fontWeight: 600,
                            }}
                          />

                          {srv.isAvailable ? (
                            <Chip
                              size="small"
                              icon={
                                <CheckCircleIcon
                                  sx={{
                                    fontSize: "14px !important",
                                    color: "#2E7D32",
                                  }}
                                />
                              }
                              label={`✓ Available in ${effectiveCity}`}
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontSize: "11.5px",
                                fontWeight: 700,
                                bgcolor: "#E8F5E9",
                                color: "#2E7D32",
                                border: "1px solid #C8E6C9",
                              }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              icon={
                                <ErrorIcon
                                  sx={{
                                    fontSize: "14px !important",
                                    color: "#C62828",
                                  }}
                                />
                              }
                              label={`⚡ On Request in ${effectiveCity}`}
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontSize: "11.5px",
                                fontWeight: 700,
                                bgcolor: "#FFEBEE",
                                color: "#C62828",
                                border: "1px solid #FFCDD2",
                              }}
                            />
                          )}

                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "11.5px",
                              color: "#8C7A6B",
                              ml: 0.5,
                            }}
                          >
                            ⏱ {srv.duration}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Right Side Pricing & Action */}
                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "11px",
                            color: "#8C7A6B",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Packages From
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 800,
                            fontSize: "17px",
                            color: COLORS.PRIMARY,
                            mb: 1,
                          }}
                        >
                          ₹{srv.basicPrice.toLocaleString("en-IN")}
                        </Typography>

                        <Button
                          size="small"
                          variant={srv.isAvailable ? "contained" : "outlined"}
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 700,
                            fontSize: "12px",
                            textTransform: "none",
                            borderRadius: "8px",
                            px: 1.8,
                            py: 0.6,
                            bgcolor: srv.isAvailable
                              ? COLORS.PRIMARY
                              : "transparent",
                            color: srv.isAvailable ? "#FFFFFF" : "#C62828",
                            borderColor: srv.isAvailable
                              ? COLORS.PRIMARY
                              : "#C62828",
                            "&:hover": {
                              bgcolor: srv.isAvailable
                                ? COLORS.PRIMARY_DARK
                                : "#FFEBEE",
                            },
                          }}
                        >
                          {srv.isAvailable
                            ? "Book This Pooja"
                            : "Request in City"}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}

              {filteredServices.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography sx={{ color: "#7A685D", mb: 2 }}>
                    No services found matching "{serviceSearch}".
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Custom Pooja / Service Not Available Banner */}
            <Box
              sx={{
                mt: 3,
                p: 2.2,
                borderRadius: "16px",
                bgcolor: "#FFF8F0",
                border: "1.5px dashed #FF6200",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: "14.5px",
                    color: "#2C1810",
                  }}
                >
                  Service not listed or not available in {effectiveCity}?
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "12.5px",
                    color: "#6E5B50",
                  }}
                >
                  Our senior Vedic Acharyas can arrange customized poojas and
                  pandits for any ritual.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  setSelectedService({
                    name: "Custom Pooja Request",
                    hindiName: "विशेष पूजा अनुरोध",
                    isAvailable: false,
                  });
                  setStep("UNAVAILABLE_FORM");
                }}
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "13px",
                  borderRadius: "10px",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  px: 2.5,
                  py: 1,
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                Request Custom Pooja
              </Button>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 2.5A: REGISTRATION STEP 1 & STEP 2                      */}
        {/* ============================================================ */}
        {(step === "REGISTER_PERSONAL" || step === "REGISTER_ADDRESS") && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: "18px",
              overflow: "hidden",
              border: "1.5px solid #F1E5D8",
              bgcolor: "#FFFFFF",
              minHeight: 480,
            }}
          >
            {/* Left Side Branding Side */}
            <Box sx={{ display: { xs: "none", md: "flex" }, width: "40%", flexShrink: 0 }}>
              <SignUpBrandingSide />
            </Box>

            {/* Right Side Formik */}
            <Box sx={{ flex: 1, p: { xs: 2.5, sm: 3 }, overflowY: "auto", maxHeight: "75vh" }}>
              <Formik
                initialValues={{
                  firstName: regData.firstName || "",
                  lastName: regData.lastName || "",
                  email: regData.email || "",
                  phone: regData.phone || "",
                  password: regData.password || "",
                  confirmPassword: regData.confirmPassword || "",
                  venueType: regData.venueType || "HOME",
                  addressLabel: regData.addressLabel || "Home",
                  fullAddress: regData.fullAddress || "",
                  city: regData.city || effectiveCity,
                  state: regData.state || selectedState,
                  pincode: regData.pincode || "",
                  latitude: "",
                  longitude: "",
                  isDefault: true,
                }}
                enableReinitialize={true}
                validationSchema={regFullValidationSchema}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    setRegData(values);
                    setSavedSignupValues(values);
                    setIsSendingOtp(true);
                    const res = await sendOtpAPI({
                      phone: values.phone,
                      email: values.email,
                      role: "CUSTOMER",
                    });
                    if (res.success || res.statusCode === 200) {
                      showSnackbar(res?.message || "OTP sent successfully to your email!", "success");
                      setStep("REGISTER_OTP");
                      setResendTimer(60);
                      setOtp(["", "", "", "", "", ""]);
                    } else {
                      showSnackbar(res?.message || "Failed to send OTP", "error");
                    }
                  } catch (err: any) {
                    showSnackbar(extractBackendErrorMessage(err, "Failed to send OTP"), "error");
                  } finally {
                    setIsSendingOtp(false);
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, values, setTouched }) => {
                  const handleStep1Next = async () => {
                    try {
                      await regStep1ValidationSchema.validate(values, { abortEarly: false });
                      setRegData(values);
                      setStep("REGISTER_ADDRESS");
                    } catch (err: any) {
                      if (err.inner) {
                        const touchedObj: any = {};
                        err.inner.forEach((error: any) => {
                          touchedObj[error.path] = true;
                        });
                        setTouched(touchedObj);
                        const firstMsg = err.inner[0]?.message;
                        if (firstMsg) showSnackbar(firstMsg, "warning");
                      }
                    }
                  };

                  return (
                    <Form noValidate>
                      <SignUpStepperHeader
                        currentStep={step === "REGISTER_PERSONAL" ? 1 : 2}
                        onStep1Click={() => setStep("REGISTER_PERSONAL")}
                        onStep2Click={handleStep1Next}
                      />

                      {step === "REGISTER_PERSONAL" && (
                        <>
                          <OfflineServiceStep1Personal onNext={handleStep1Next} />
                          <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography sx={{ fontFamily: FONTS.PRIMARY, fontSize: "12.5px", color: "#6B7280" }}>
                              Already have an account?{" "}
                              <Typography
                                component="span"
                                onClick={() => setStep("SIGN_IN")}
                                sx={{
                                  color: COLORS.PRIMARY,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                Sign In
                              </Typography>
                            </Typography>
                          </Box>
                        </>
                      )}

                      {step === "REGISTER_ADDRESS" && (
                        <SignUpStep2Address
                          isSubmitting={isSubmitting || isSendingOtp}
                          onBack={() => setStep("REGISTER_PERSONAL")}
                          isFetchingLocation={false}
                        />
                      )}
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 2.5B: OTP VERIFICATION SCREEN                           */}
        {/* ============================================================ */}
        {step === "REGISTER_OTP" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: "18px",
              overflow: "hidden",
              border: "1.5px solid #F1E5D8",
              bgcolor: "#FFFFFF",
              minHeight: 450,
            }}
          >
            {/* Left Side Branding */}
            <Box sx={{ display: { xs: "none", md: "flex" }, width: "40%", flexShrink: 0 }}>
              <SignUpBrandingSide />
            </Box>

            {/* Right Side OTP Verification */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 3, sm: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  bgcolor: "#FFF4EB",
                  color: COLORS.PRIMARY,
                  border: "2px solid #FFE4D1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>

              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 800,
                  fontSize: { xs: "20px", sm: "22px" },
                  color: "#1A0B05",
                  mb: 0.5,
                }}
              >
                Verify Email
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontSize: "13px",
                  color: "#6B7280",
                  maxWidth: 360,
                  mb: 3,
                  lineHeight: 1.5,
                }}
              >
                Enter the 6-digit verification code sent to{" "}
                <strong style={{ color: "#1A0B05" }}>
                  {savedSignupValues?.email || regData.email}
                </strong>
              </Typography>

              {/* 6 Square OTP Inputs */}
              <Box
                onPaste={handlePasteOtp}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: { xs: 1, sm: 1.5 },
                  mb: 3,
                }}
              >
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (otpRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    slotProps={{
                      htmlInput: {
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          fontSize: "20px",
                          fontWeight: 700,
                          fontFamily: FONTS.PRIMARY,
                          padding: "12px 0",
                        },
                      },
                    }}
                    sx={{
                      width: { xs: 42, sm: 50 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#FAF8F5",
                        "& fieldset": { borderColor: "#E2E8F0", borderWidth: "1.5px" },
                        "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                        "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY, borderWidth: "2px" },
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Resend Countdown */}
              <Box sx={{ mb: 3 }}>
                {resendTimer > 0 ? (
                  <Typography sx={{ fontFamily: FONTS.PRIMARY, fontSize: "13px", color: "#6B7280" }}>
                    Resend OTP in <strong style={{ color: COLORS.PRIMARY }}>{resendTimer}s</strong>
                  </Typography>
                ) : (
                  <Button
                    size="small"
                    onClick={handleResendOtp}
                    startIcon={<LockResetIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      color: COLORS.PRIMARY,
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      fontSize: "13px",
                      textTransform: "none",
                      "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
                    }}
                  >
                    Resend OTP (ओटीपी पुनः भेजें)
                  </Button>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={isVerifyingOtp || otp.join("").length < 6}
                  onClick={handleVerifyOtpAndRegister}
                  sx={{
                    background: "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
                    color: "#FFFFFF",
                    py: 1.2,
                    borderRadius: "12px",
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    fontSize: "14.5px",
                    textTransform: "none",
                    boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                    "&:hover": { background: "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)" },
                  }}
                >
                  {isVerifyingOtp ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
                      <span>Verifying & Registering...</span>
                    </Box>
                  ) : (
                    "Verify OTP & Register →"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => setStep("REGISTER_ADDRESS")}
                  sx={{
                    color: "#64748B",
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 600,
                    fontSize: "13px",
                    textTransform: "none",
                    "&:hover": { color: COLORS.PRIMARY },
                  }}
                >
                  ← Back to Address Details
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 2.5C: SIGN IN SCREEN                                    */}
        {/* ============================================================ */}
        {step === "SIGN_IN" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: "18px",
              overflow: "hidden",
              border: "1.5px solid #F1E5D8",
              bgcolor: "#FFFFFF",
              minHeight: 450,
            }}
          >
            {/* Left Side Branding */}
            <Box sx={{ display: { xs: "none", md: "flex" }, width: "40%", flexShrink: 0 }}>
              <SignUpBrandingSide />
            </Box>

            {/* Right Side Sign In Form */}
            <Box
              component="form"
              onSubmit={handleSignIn}
              sx={{
                flex: 1,
                p: { xs: 3, sm: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 800,
                  fontSize: { xs: "20px", sm: "23px" },
                  color: "#1A0B05",
                  mb: 0.5,
                }}
              >
                Sign In to Your Account
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontSize: "13px",
                  color: "#6B7280",
                  mb: 3,
                }}
              >
                Enter your registered email or phone to proceed with booking.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                <TextField
                  fullWidth
                  label="Email or 10-digit Phone *"
                  placeholder="e.g. user@gmail.com or 9876543210"
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: COLORS.PRIMARY, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: FONTS.PRIMARY,
                      "& fieldset": { borderColor: "#E2E8F0" },
                      "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                      "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password *"
                  type={showSignInPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: COLORS.PRIMARY, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                            edge="end"
                          >
                            {showSignInPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: FONTS.PRIMARY,
                      "& fieldset": { borderColor: "#E2E8F0" },
                      "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                      "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSigningIn}
                  sx={{
                    mt: 1,
                    background: "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
                    color: "#FFFFFF",
                    py: 1.2,
                    borderRadius: "12px",
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    fontSize: "14.5px",
                    textTransform: "none",
                    boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                    "&:hover": { background: "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)" },
                  }}
                >
                  {isSigningIn ? (
                    <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
                  ) : (
                    "Sign In & Continue Booking →"
                  )}
                </Button>

                <Box sx={{ mt: 1, textAlign: "center" }}>
                  <Typography sx={{ fontFamily: FONTS.PRIMARY, fontSize: "12.5px", color: "#6B7280" }}>
                    Don't have an account?{" "}
                    <Typography
                      component="span"
                      onClick={() => setStep("REGISTER_PERSONAL")}
                      sx={{
                        color: COLORS.PRIMARY,
                        fontWeight: 700,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Create Account
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 3A: AVAILABLE SERVICE CHECKOUT FORM                     */}
        {/* ============================================================ */}
        {step === "AVAILABLE_CHECKOUT" && selectedService && (
          <Box component="form" noValidate onSubmit={handleConfirmAvailableCheckout}>
            {/* Selected Service Card */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: "16px",
                bgcolor: "#FAF4EE",
                border: "1.5px solid #EADCCF",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 800,
                      fontSize: "18px",
                      color: "#1A0B05",
                    }}
                  >
                    {normalizePoojaText(selectedService.name)}{" "}
                    {selectedService.hindiName &&
                      `(${selectedService.hindiName})`}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "12.5px",
                      color: "#6E5B50",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 14, color: COLORS.PRIMARY }} /> Location: {effectiveCity}, {selectedState}
                  </Typography>
                </Box>

                <Button
                  size="small"
                  onClick={() => setStep(service ? "LOCATION" : "SERVICES")}
                  sx={{
                    color: COLORS.PRIMARY,
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  {service ? "Change Location" : "Change Service"}
                </Button>
              </Box>

              {/* Plan Toggle: Basic vs Standard */}
              <Box sx={{ mt: 1.5 }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#4A3222",
                    mb: 1,
                  }}
                >
                  Choose Your Package (पैकेज चुनें):
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      onClick={() => setSelectedPlan("basic")}
                      sx={{
                        p: 1.8,
                        borderRadius: "12px",
                        border:
                          selectedPlan === "basic"
                            ? `2px solid ${COLORS.PRIMARY}`
                            : "1px solid #D8C7B8",
                        bgcolor:
                          selectedPlan === "basic" ? "#FFF8F0" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#1A0B05",
                          }}
                        >
                          Basic Plan
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "11.5px",
                            color: "#7A685D",
                          }}
                        >
                          1 Verified Vedic Pandit
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          fontWeight: 800,
                          fontSize: "16px",
                          color: COLORS.PRIMARY,
                        }}
                      >
                        ₹
                        {(selectedService.basicPrice || 5100).toLocaleString(
                          "en-IN",
                        )}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      onClick={() => setSelectedPlan("standard")}
                      sx={{
                        p: 1.8,
                        borderRadius: "12px",
                        border:
                          selectedPlan === "standard"
                            ? `2px solid ${COLORS.PRIMARY}`
                            : "1px solid #D8C7B8",
                        bgcolor:
                          selectedPlan === "standard" ? "#FFF8F0" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#1A0B05",
                          }}
                        >
                          Standard Plan (Recommended)
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "11.5px",
                            color: "#7A685D",
                          }}
                        >
                          2 Acharyas + Full Samagri
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          fontWeight: 800,
                          fontSize: "16px",
                          color: COLORS.PRIMARY,
                        }}
                      >
                        ₹
                        {(
                          selectedService.standardPrice || 11000
                        ).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Customer Contact & Address Form */}
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                fontSize: "15px",
                color: "#1A0B05",
                mb: 2,
              }}
            >
              Enter Customer & Venue Details (विवरण भरें)
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Full Name / पूरा नाम *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{ color: COLORS.PRIMARY, fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Mobile Number / मोबाइल नंबर *"
                  placeholder="10-digit number"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 700,
                              fontSize: "14px",
                              mr: 0.5,
                            }}
                          >
                            +91
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address / ईमेल *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{ color: COLORS.PRIMARY, fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Preferred Pooja Date / तारीख"
                  value={poojaDate}
                  onChange={(e) => setPoojaDate(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: new Date().toISOString().split("T")[0] },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label={`Complete Address in ${effectiveCity} / घर का पता *`}
                  placeholder="House/Flat No., Building, Street, Landmark"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon
                            sx={{ color: COLORS.PRIMARY, fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              {/* Payment Mode Selection */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: "#FAF4EE",
                    border: "1px solid #EADCCF",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      fontSize: "13.5px",
                      color: "#4A3222",
                      mb: 1,
                    }}
                  >
                    Payment Preference (भुगतान का प्रकार):
                  </Typography>

                  <RadioGroup
                    row
                    value={paymentOption}
                    onChange={(e) => setPaymentOption(e.target.value as any)}
                  >
                    <FormControlLabel
                      value="TOKEN"
                      control={
                        <Radio
                          sx={{
                            color: COLORS.PRIMARY,
                            "&.Mui-checked": { color: COLORS.PRIMARY },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 700,
                              fontSize: "13.5px",
                            }}
                          >
                            Pay Advance Token Amount (₹1,000)
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "11px",
                              color: "#7A685D",
                            }}
                          >
                            Pay ₹1,000 to block Pandit, pay remaining balance
                            after pooja completion.
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: { xs: 1, sm: 0 }, mr: 3 }}
                    />

                    <FormControlLabel
                      value="FULL"
                      control={
                        <Radio
                          sx={{
                            color: COLORS.PRIMARY,
                            "&.Mui-checked": { color: COLORS.PRIMARY },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 700,
                              fontSize: "13.5px",
                            }}
                          >
                            Full Payment (पूर्ण भुगतान)
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "11px",
                              color: "#7A685D",
                            }}
                          >
                            Pay full package amount securely.
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Box>
              </Grid>
            </Grid>

            {/* Submit Action */}
            <Box
              sx={{
                mt: 3.5,
                pt: 2.5,
                borderTop: "1px solid #F1E5D8",
                display: "flex",
                flexDirection: { xs: "column-reverse", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setStep(service ? "LOCATION" : "SERVICES")}
                sx={{
                  borderColor: "#D8C7B8",
                  color: "#5C4A40",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontFamily: FONTS.PRIMARY,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {service ? "← Back to Location" : "← Back to Services"}
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                endIcon={
                  !submitting ? (
                    <ArrowForwardIcon sx={{ fontSize: "18px !important" }} />
                  ) : undefined
                }
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  px: 4,
                  py: 1.3,
                  borderRadius: "12px",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                {submitting ? (
                  <CircularProgress size={22} sx={{ color: "#FFFFFF" }} />
                ) : (
                  "Confirm Booking & Checkout"
                )}
              </Button>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 3B: UNAVAILABLE SERVICE / SEND A MESSAGE ENQUIRY FORM  */}
        {/* ============================================================ */}
        {step === "UNAVAILABLE_FORM" && (
          <Formik
            initialValues={{
              name: "",
              email: "",
              subject: "",
              message: "",
            }}
            validationSchema={unavailableEnquirySchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const ref = `REQ-${Date.now().toString().slice(-6)}`;
                setBookingRefId(ref);

                const messagePayload = [
                  `Offline Pooja Enquiry [${ref}]:`,
                  `Service: ${selectedService?.name || service?.name || "Offline Pooja"} (${selectedService?.hindiName || ""})`,
                  `Location: ${effectiveCity}, ${selectedState}`,
                  `Client Name: ${values.name}`,
                  `Email: ${values.email}`,
                  customerPhone ? `Mobile: ${customerPhone}` : "",
                  `Subject: ${values.subject}`,
                  `Message:`,
                  values.message,
                ]
                  .filter(Boolean)
                  .join("\n");

                await submitContactFormAPI({
                  name: values.name,
                  email: values.email,
                  subject: values.subject,
                  message: messagePayload,
                });

                // Save to local storage for persistence
                if (typeof window !== "undefined") {
                  try {
                    const prev = JSON.parse(localStorage.getItem("offline_pooja_enquiries") || "[]");
                    prev.push({
                      ref,
                      service: selectedService?.name || service?.name,
                      city: effectiveCity,
                      state: selectedState,
                      name: values.name,
                      email: values.email,
                      subject: values.subject,
                      message: values.message,
                      date: new Date().toISOString(),
                    });
                    localStorage.setItem("offline_pooja_enquiries", JSON.stringify(prev));
                  } catch (e) {}
                }

                setCustomerName(values.name);
                setCustomerEmail(values.email);
                setIsSuccessForUnavailable(true);
                setStep("SUCCESS");
                showSnackbar("Message sent successfully! Our team will get back to you shortly.", "success");
                resetForm();
              } catch (err: any) {
                console.error("Failed submitting service inquiry:", err);
                setIsSuccessForUnavailable(true);
                setStep("SUCCESS");
                showSnackbar("Your message has been sent! Our team will get back to you shortly.", "success");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, touched, errors }) => (
              <Box component={Form} noValidate sx={{ pt: 1 }}>
                <FormikValidationSnackbar />

                <Grid container spacing={2.5}>
                  {/* Full Name */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field
                      as={TextField}
                      name="name"
                      fullWidth
                      label="Full Name *"
                      placeholder="Full Name"
                      variant="outlined"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontFamily: FONTS.PRIMARY,
                          bgcolor: "#FFFFFF",
                          "&:not(.Mui-error):hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&:not(.Mui-error).Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: FONTS.PRIMARY,
                          "&:not(.Mui-error).Mui-focused": { color: COLORS.PRIMARY },
                        },
                        "& .MuiFormHelperText-root": {
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "12px",
                          mx: 0.5,
                          mt: 0.5,
                        },
                      }}
                    />
                  </Grid>

                  {/* Email Address */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Field
                      as={TextField}
                      name="email"
                      type="email"
                      fullWidth
                      label="Email Address *"
                      placeholder="Email Address"
                      variant="outlined"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontFamily: FONTS.PRIMARY,
                          bgcolor: "#FFFFFF",
                          "&:not(.Mui-error):hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&:not(.Mui-error).Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: FONTS.PRIMARY,
                          "&:not(.Mui-error).Mui-focused": { color: COLORS.PRIMARY },
                        },
                        "& .MuiFormHelperText-root": {
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "12px",
                          mx: 0.5,
                          mt: 0.5,
                        },
                      }}
                    />
                  </Grid>

                  {/* Subject */}
                  <Grid size={{ xs: 12 }}>
                    <Field
                      as={TextField}
                      name="subject"
                      fullWidth
                      label="Subject *"
                      placeholder="Subject"
                      variant="outlined"
                      error={touched.subject && Boolean(errors.subject)}
                      helperText={touched.subject && errors.subject}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontFamily: FONTS.PRIMARY,
                          bgcolor: "#FFFFFF",
                          "&:not(.Mui-error):hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&:not(.Mui-error).Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: FONTS.PRIMARY,
                          "&:not(.Mui-error).Mui-focused": { color: COLORS.PRIMARY },
                        },
                        "& .MuiFormHelperText-root": {
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "12px",
                          mx: 0.5,
                          mt: 0.5,
                        },
                      }}
                    />
                  </Grid>

                  {/* Your Message */}
                  <Grid size={{ xs: 12 }}>
                    <Field
                      as={TextField}
                      name="message"
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Message *"
                      placeholder="Your Message"
                      variant="outlined"
                      error={touched.message && Boolean(errors.message)}
                      helperText={touched.message && errors.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontFamily: FONTS.PRIMARY,
                          bgcolor: "#FFFFFF",
                          "&:not(.Mui-error):hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&:not(.Mui-error).Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: FONTS.PRIMARY,
                          "&:not(.Mui-error).Mui-focused": { color: COLORS.PRIMARY },
                        },
                        "& .MuiFormHelperText-root": {
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "12px",
                          mx: 0.5,
                          mt: 0.5,
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Bottom Actions */}
                <Box
                  sx={{
                    mt: 3.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "#FF6200",
                      color: "#FFFFFF",
                      px: 4.5,
                      py: 1.3,
                      borderRadius: "24px",
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      fontSize: "15px",
                      textTransform: "none",
                      boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: COLORS.PRIMARY_DARK,
                        boxShadow: "0 8px 24px rgba(255, 98, 0, 0.4)",
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
                    ) : (
                      "Send Message"
                    )}
                  </Button>

                  <Button
                    variant="text"
                    onClick={() => setStep(service ? "LOCATION" : "SERVICES")}
                    sx={{
                      color: "#64748B",
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 600,
                      fontSize: "14px",
                      textTransform: "none",
                      "&:hover": { color: COLORS.PRIMARY },
                    }}
                  >
                    ← Back to Location
                  </Button>
                </Box>
              </Box>
            )}
          </Formik>
        )}

        {/* ============================================================ */}
        {/* STEP 4: SUCCESS / CONFIRMATION SCREEN                       */}
        {/* ============================================================ */}
        {step === "SUCCESS" && (
          <Box sx={{ textAlign: "center", py: 3, px: 2 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "#E8F5E9",
                color: "#2E7D32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
                boxShadow: "0 8px 24px rgba(46, 125, 50, 0.2)",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 44 }} />
            </Box>

            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                fontSize: { xs: "22px", sm: "26px" },
                color: "#1A0B05",
                mb: 1,
              }}
            >
              {isSuccessForUnavailable
                ? "Pooja Request Received! (अनुरोध प्राप्त हुआ)"
                : "Booking Request Confirmed! (बुकिंग संपन्न)"}
            </Typography>

            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "14.5px",
                color: "#5C4A40",
                maxWidth: 480,
                mx: "auto",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              {isSuccessForUnavailable
                ? `Thank you, ${customerName}! Our dedicated Vedic coordinator will call you within 2 hours to confirm Pandit availability and arrange the pooja in ${effectiveCity}.`
                : `Thank you, ${customerName}! Your booking request for ${normalizePoojaText(selectedService?.name || "")} in ${effectiveCity} has been successfully recorded.`}
            </Typography>

            {/* Reference & Summary Box */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: "16px",
                bgcolor: "#FAF4EE",
                border: "1px solid #EADCCF",
                maxWidth: 460,
                mx: "auto",
                textAlign: "left",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#7A685D",
                  }}
                >
                  Booking Reference ID:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: "14px",
                    color: COLORS.PRIMARY,
                  }}
                >
                  {bookingRefId}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#7A685D",
                  }}
                >
                  Selected Service:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#2C1810",
                  }}
                >
                  {normalizePoojaText(selectedService?.name || "")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#7A685D",
                  }}
                >
                  Location:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#2C1810",
                  }}
                >
                  {effectiveCity}, {selectedState}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#7A685D",
                  }}
                >
                  Contact:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#2C1810",
                  }}
                >
                  +91 {customerPhone}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                onClick={onClose}
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  px: 4.5,
                  py: 1.2,
                  borderRadius: "12px",
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "14.5px",
                  textTransform: "none",
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                Done (ठीक है)
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

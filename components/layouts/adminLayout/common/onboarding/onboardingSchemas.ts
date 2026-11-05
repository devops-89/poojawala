import * as Yup from "yup";
import { USER_ROLE } from "@/utils/enums";
import {
  isValidIndianPincodeFormat,
  EMAIL_STRICT_REGEX,
  EMAIL_STRICT_MESSAGE,
  ADDRESS_STRICT_REGEX,
  ADDRESS_STRICT_MESSAGE,
  DESCRIPTION_STRICT_REGEX,
  DESCRIPTION_STRICT_MESSAGE,
} from "@/utils/helpers";

const today = new Date();
export const twentyYearsAgo = new Date(
  today.getFullYear() - 20,
  today.getMonth(),
  today.getDate()
);
export const maxDobDate = `${twentyYearsAgo.getFullYear()}-${String(
  twentyYearsAgo.getMonth() + 1
).padStart(2, "0")}-${String(twentyYearsAgo.getDate()).padStart(2, "0")}`;

export const purohitOnboardValidationSchema = Yup.object().shape({
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
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE),
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

  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  bio: Yup.string()
    .trim()
    .required("Bio is required")
    .min(10, "Bio must be at least 10 characters")
    .matches(DESCRIPTION_STRICT_REGEX, DESCRIPTION_STRICT_MESSAGE),
  qualification: Yup.string().required("Qualification is required"),
  experienceYears: Yup.number()
    .typeError("Experience Years must be a number")
    .min(0, "Experience must be at least 0 years")
    .max(99, "Experience cannot exceed 99 years")
    .required("Experience Years is required"),
  aadhaarNumber: Yup.string()
    .matches(/^[0-9]{12}$/, "Aadhaar Number must be exactly 12 digits")
    .required("Aadhaar Number is required"),
  languages: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one language"),
  specializations: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one specialization"),
  isOnlineAvailable: Yup.boolean(),
  isOfflineAvailable: Yup.boolean().test(
    "at-least-one-availability",
    "Select at least one availability mode (Online or Offline)",
    function () {
      const { isOnlineAvailable, isOfflineAvailable } = this.parent;
      return Boolean(isOnlineAvailable || isOfflineAvailable);
    }
  ),

  paymentMethod: Yup.string().required("Payment method is required"),
  upiId: Yup.string().test("is-upi", "Invalid UPI ID", function (val) {
    if (this.parent.paymentMethod !== "UPI") return true;
    if (!val) return this.createError({ message: "UPI ID is required" });
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(val.trim())) {
      return this.createError({
        message: "Please enter a valid UPI ID (e.g. 9876543210@ybl or user@upi)",
      });
    }
    return true;
  }),
  bankName: Yup.string().test("is-bank", "Bank Name is required", function (val) {
    if (this.parent.paymentMethod !== "BANK") return true;
    if (!val) return this.createError({ message: "Bank Name is required" });
    return true;
  }),
  accountName: Yup.string().test("is-bank", "Account Holder Name is required", function (val) {
    if (this.parent.paymentMethod !== "BANK") return true;
    if (!val) return this.createError({ message: "Account Holder Name is required" });
    return true;
  }),
  accountNumber: Yup.string().test("is-bank-account", "Invalid Account Number", function (val) {
    if (this.parent.paymentMethod !== "BANK") return true;
    if (!val) return this.createError({ message: "Account Number is required" });
    const accountNumberRegex = /^[0-9]{9,18}$/;
    if (!accountNumberRegex.test(val.trim())) {
      return this.createError({
        message: "Account Number must be between 9 and 18 digits (numbers only)",
      });
    }
    return true;
  }),
  ifscCode: Yup.string().test("is-ifsc", "Invalid IFSC Code", function (val) {
    if (this.parent.paymentMethod !== "BANK") return true;
    if (!val) return this.createError({ message: "IFSC Code is required" });
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(val.trim().toUpperCase())) {
      return this.createError({
        message: "Please enter a valid 11-character IFSC Code (e.g. SBIN0001234)",
      });
    }
    return true;
  }),

  serviceArea: Yup.object({
    pincode: Yup.string()
      .nullable()
      .optional()
      .test(
        "is-valid-indian-pincode",
        "Please enter a valid 6-digit Indian Pincode",
        (val) => {
          if (!val || !val.trim()) return true;
          return isValidIndianPincodeFormat(val.trim());
        }
      ),
    fullAddress: Yup.string().nullable().optional(),
    streetName: Yup.string().nullable().optional(),
    city: Yup.string().nullable().optional(),
    state: Yup.string().nullable().optional(),
    addressLabel: Yup.string().nullable().optional(),
    serviceRadiusKm: Yup.number().nullable().optional(),
  }).nullable().optional(),
  documents: Yup.object().nullable().optional(),
});

export const astrologerOnboardValidationSchema = Yup.object().shape({
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
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE),
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

  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  bio: Yup.string()
    .trim()
    .required("Bio is required")
    .min(10, "Bio must be at least 10 characters")
    .matches(DESCRIPTION_STRICT_REGEX, DESCRIPTION_STRICT_MESSAGE),
  qualification: Yup.string().required("Qualification is required"),
  experienceYears: Yup.number()
    .typeError("Experience Years must be a number")
    .min(0, "Experience must be at least 0 years")
    .max(99, "Experience cannot exceed 99 years")
    .required("Experience Years is required"),
  aadhaarNumber: Yup.string()
    .matches(/^[0-9]{12}$/, "Aadhaar Number must be exactly 12 digits")
    .required("Aadhaar Number is required"),
  languages: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one language"),
  specializations: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one specialization"),

  astrologyPrice: Yup.mixed().test(
    "valid-price",
    "Please enter a valid consultation rate greater than 0",
    function (value) {
      const checkVal =
        value !== undefined && value !== null && String(value).trim() !== ""
          ? value
          : this.parent?.ratePerMinute;
      if (checkVal === undefined || checkVal === null || String(checkVal).trim() === "") {
        return false;
      }
      const num = Number(checkVal);
      return !isNaN(num) && num > 0;
    }
  ),

  paymentMethod: Yup.string().required("Payment method is required"),
  upiId: Yup.string().test("is-upi", "Invalid UPI ID", function (val) {
    if (this.parent.paymentMethod !== "UPI") return true;
    if (!val) return this.createError({ message: "UPI ID is required" });
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(val.trim())) {
      return this.createError({
        message: "Please enter a valid UPI ID (e.g. 9876543210@ybl or user@upi)",
      });
    }
    return true;
  }),
  bankName: Yup.string().test("is-bank", "Bank Name is required", function (val) {
    if (this.parent.paymentMethod !== "BANK") return true;
    if (!val) return this.createError({ message: "Bank Name is required" });
    return true;
  }),
  accountName: Yup.string().test("is-bank", "Account Holder Name is required", function (val) {
    if (this.parent.paymentMethod !== "BANK") return true;
    if (!val) return this.createError({ message: "Account Holder Name is required" });
    return true;
  }),
  accountNumber: Yup.string().test("is-bank-account", "Invalid Account Number", function (val) {
    if (this.parent.paymentMethod !== "BANK") return true;
    if (!val) return this.createError({ message: "Account Number is required" });
    const accountNumberRegex = /^[0-9]{9,18}$/;
    if (!accountNumberRegex.test(val.trim())) {
      return this.createError({
        message: "Account Number must be between 9 and 18 digits (numbers only)",
      });
    }
    return true;
  }),
  ifscCode: Yup.string().test("is-ifsc", "Invalid IFSC Code", function (val) {
    if (this.parent.paymentMethod !== "BANK") return true;
    if (!val) return this.createError({ message: "IFSC Code is required" });
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(val.trim().toUpperCase())) {
      return this.createError({
        message: "Please enter a valid 11-character IFSC Code (e.g. SBIN0001234)",
      });
    }
    return true;
  }),
  documents: Yup.object().nullable().optional(),
});


import * as yup from 'yup';
import { USER_ROLE } from '@/utils/enums';
import {
  EMAIL_STRICT_REGEX,
  EMAIL_STRICT_MESSAGE,
  ADDRESS_STRICT_REGEX,
  ADDRESS_STRICT_MESSAGE,
  DESCRIPTION_STRICT_REGEX,
  DESCRIPTION_STRICT_MESSAGE,
} from '@/utils/helpers';

export type StepId =
  | 'basic'
  | 'otp'
  | 'profile'
  | 'bank'
  | 'documents'
  | 'serviceArea';

export interface StepItem {
  id: StepId;
  label: string;
}

export const PUROHIT_STEPS: StepItem[] = [
  { id: 'basic', label: 'Basic Details' },
  { id: 'otp', label: 'Verification (OTP)' },
  { id: 'profile', label: 'Professional Profile' },
  { id: 'bank', label: 'Bank Details' },
  { id: 'documents', label: 'Document Upload' },
  { id: 'serviceArea', label: 'Service Area' },
];

export const ASTROLOGER_STEPS: StepItem[] = [
  { id: 'basic', label: 'Basic Details' },
  { id: 'otp', label: 'Verification (OTP)' },
  { id: 'profile', label: 'Professional Profile' },
  { id: 'documents', label: 'Document Upload' },
];

export const getStepsForRole = (role?: string): StepItem[] => {
  if (role === USER_ROLE.ASTROLOGER) {
    return ASTROLOGER_STEPS;
  }
  return PUROHIT_STEPS;
};

export const steps = PUROHIT_STEPS.map((s) => s.label);

export const LANGUAGES = [
  'Hindi',
  'Sanskrit',
  'English',
  'Marathi',
  'Gujarati',
  'Tamil',
  'Telugu',
  'Kannada',
  'Bengali',
];

export const SPECIALIZATIONS = [
  'Vedic Mantras',
  'Astrology',
  'Karmakand',
  'Vastu Shastra',
  'Palmistry',
  'Kundali Matching',
  'Pooja Anushthan',
];

export const QUALIFICATIONS = ['SHASTRI', 'ACHARYA', 'VEDPATHI'];

export const emailTldRegex = EMAIL_STRICT_REGEX;

const alphaSpaceRegex = /^[a-zA-Z\s]+$/;
const cityStateRegex = /^[a-zA-Z\s.-]+$/;

const today = new Date();
export const twentyYearsAgo = new Date(
  today.getFullYear() - 20,
  today.getMonth(),
  today.getDate()
);

export const maxDobDate = `${twentyYearsAgo.getFullYear()}-${String(
  twentyYearsAgo.getMonth() + 1
).padStart(2, '0')}-${String(twentyYearsAgo.getDate()).padStart(2, '0')}`;

export const stepValidationSchemas: Record<StepId, any> = {
  basic: yup.object({
    role: yup
      .string()
      .oneOf([USER_ROLE.PUROHIT, USER_ROLE.ASTROLOGER], 'Please select a valid role')
      .required('Role is required'),
    fullName: yup
      .string()
      .matches(alphaSpaceRegex, 'Full Name cannot contain numbers or special characters')
      .required('Full Name is required'),
    mobileNumber: yup
      .string()
      .matches(/^[6-9][0-9]{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9')
      .required('Mobile Number is required'),
    email: yup
      .string()
      .matches(
        EMAIL_STRICT_REGEX,
        EMAIL_STRICT_MESSAGE
      )
      .required('Email is required'),
    dob: yup
      .string()
      .required('Date of Birth is required')
      .test(
        'is-valid-date',
        'Please enter a valid Date of Birth',
        (val) => {
          if (!val) return false;
          const d = new Date(val);
          return !isNaN(d.getTime());
        }
      )
      .test(
        'is-20-years-old',
        'Date of birth must be at least 20 years ago',
        (val) => {
          if (!val) return false;
          const d = new Date(val);
          return !isNaN(d.getTime()) && d <= twentyYearsAgo;
        }
      ),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  }),
  otp: yup.object({
    // OTP validation is handled by string length check
  }),
  profile: yup.object({
    state: yup
      .string()
      .matches(cityStateRegex, 'State cannot contain numbers or special characters')
      .required('State is required'),
    city: yup
      .string()
      .matches(cityStateRegex, 'City cannot contain numbers or special characters')
      .required('City is required'),
    bio: yup
      .string()
      .trim()
      .required('Bio is required')
      .min(10, 'Bio must be at least 10 characters')
      .matches(DESCRIPTION_STRICT_REGEX, DESCRIPTION_STRICT_MESSAGE),
    qualification: yup.string().required('Qualification is required'),
    experienceYears: yup
      .number()
      .typeError('Experience Years must be a number')
      .min(0, 'Experience must be at least 0 years')
      .max(99, 'Experience cannot exceed 99 years (max 2 digits)')
      .required('Experience Years is required'),
    aadhaarNumber: yup
      .string()
      .matches(/^[0-9]{12}$/, 'Aadhaar Number must be exactly 12 digits')
      .required('Aadhaar Number is required'),
    languages: yup
      .array()
      .of(yup.string())
      .min(1, 'Select at least one language'),
    specializations: yup
      .array()
      .of(yup.string())
      .min(1, 'Select at least one specialization'),
    isOnlineAvailable: yup.boolean(),
    isOfflineAvailable: yup.boolean().test(
      'at-least-one-availability',
      'Select at least one availability mode (Online or Offline)',
      function () {
        const { isOnlineAvailable, isOfflineAvailable, role } = this.parent;
        if (role === USER_ROLE.ASTROLOGER) return true;
        return Boolean(isOnlineAvailable || isOfflineAvailable);
      }
    ),
    ratePerMinute: yup.mixed().test(
      'ratePerMinute-required',
      'Please enter a valid rate per minute (greater than 0)',
      function (value) {
        const role = this.parent?.role;
        if (role === USER_ROLE.ASTROLOGER) {
          if (value === undefined || value === null || String(value).trim() === '') {
            return false;
          }
          const num = Number(value);
          return !isNaN(num) && num > 0;
        }
        return true;
      }
    ),
  }),
  bank: yup.object({
    paymentMethod: yup.string().required(),
    upiId: yup.string().test('is-upi', 'Invalid UPI ID', function (val) {
      if (this.parent.paymentMethod !== 'UPI') return true;
      if (!val) return this.createError({ message: 'UPI ID is required' });
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(val.trim())) {
        return this.createError({
          message: 'Please enter a valid UPI ID (e.g. 9876543210@ybl or user@upi)',
        });
      }
      return true;
    }),
    bankName: yup
      .string()
      .test('is-bank', 'Bank Name is required', function (val) {
        if (this.parent.paymentMethod !== 'BANK') return true;
        if (!val) return this.createError({ message: 'Bank Name is required' });
        if (!cityStateRegex.test(val)) {
          return this.createError({ message: 'Bank Name cannot contain numbers or special characters' });
        }
        return true;
      }),
    accountName: yup
      .string()
      .test('is-bank', 'Account Holder Name is required', function (val) {
        if (this.parent.paymentMethod !== 'BANK') return true;
        if (!val) return this.createError({ message: 'Account Holder Name is required' });
        if (!alphaSpaceRegex.test(val)) {
          return this.createError({ message: 'Account Holder Name cannot contain numbers or special characters' });
        }
        return true;
      }),
    accountNumber: yup
      .string()
      .test('is-bank-account', 'Invalid Account Number', function (val) {
        if (this.parent.paymentMethod !== 'BANK') return true;
        if (!val) return this.createError({ message: 'Account Number is required' });
        const accountNumberRegex = /^[0-9]{9,18}$/;
        if (!accountNumberRegex.test(val.trim())) {
          return this.createError({
            message: 'Account Number must be between 9 and 18 digits (numbers only)',
          });
        }
        return true;
      }),
    ifscCode: yup
      .string()
      .test('is-ifsc', 'Invalid IFSC Code', function (val) {
        if (this.parent.paymentMethod !== 'BANK') return true;
        if (!val) return this.createError({ message: 'IFSC Code is required' });
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(val.trim().toUpperCase())) {
          return this.createError({
            message: 'Please enter a valid 11-character IFSC Code (e.g. SBIN0001234)',
          });
        }
        return true;
      }),
  }),
  documents: yup.object({
    documents: yup.object({
      identityDoc: yup.mixed().required('Aadhaar or PAN Document is required'),
      certificate: yup.mixed().nullable().notRequired(),
      templeAffiliationProof: yup.mixed().nullable().notRequired(),
      profilePhoto: yup.mixed().required('Profile Photograph is required'),
    }),
  }),
  serviceArea: yup.object({
    serviceArea: yup.object({
      pincode: yup
        .string()
        .matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits')
        .required('Pincode is required'),
      fullAddress: yup
        .string()
        .matches(ADDRESS_STRICT_REGEX, ADDRESS_STRICT_MESSAGE)
        .required('Full Address is required'),
      city: yup.string().required('City is required'),
      state: yup.string().required('State is required'),
      serviceRadiusKm: yup
        .number()
        .min(1, 'Service radius must be at least 1 km')
        .max(100, 'Service radius cannot exceed 100 km')
        .required('Service radius is required'),
    }),
  }),
};

export const validationSchema = [
  stepValidationSchemas.basic,
  stepValidationSchemas.otp,
  stepValidationSchemas.profile,
  stepValidationSchemas.bank,
  stepValidationSchemas.documents,
  stepValidationSchemas.serviceArea,
];

export const selectMenuProps = {
  slotProps: {
    paper: {
      sx: { maxHeight: 300, mt: 1 },
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },
};

export const documentFields = [
  { id: 'identityDoc', title: 'Aadhaar / PAN Card *', desc: '' },
  { id: 'certificate', title: 'Educational Certificates', desc: '' },
  { id: 'templeAffiliationProof', title: 'Temple Affiliation Proof', desc: '' },
  { id: 'profilePhoto', title: 'Profile Photograph *', desc: '' },
] as const;

import * as yup from 'yup';

export const steps = [
  'Basic Details',
  'Verification (OTP)',
  'Purohit Profile',
  'Bank Details',
  'Document Upload',
];

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

export const QUALIFICATIONS = ['SHASTRI', 'ACHARYA', 'VEDPATHI', 'OTHER'];

export const emailTldRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co\.in|info|biz|io|co|us|uk|ca|au)$/i;

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

export const validationSchema = [
  yup.object({
    fullName: yup
      .string()
      .matches(alphaSpaceRegex, 'Full Name cannot contain numbers or special characters')
      .required('Full Name is required'),
    mobileNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Mobile Number is required'),
    email: yup
      .string()
      .matches(
        emailTldRegex,
        'Please enter a valid email address with a valid TLD (e.g. .com, .in)'
      )
      .required('Email is required'),
    dob: yup
      .date()
      .max(twentyYearsAgo, 'Date of birth must be at least 20 years ago')
      .required('Date of Birth is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  }),
  yup.object({
    // OTP validation is handled by string length check
  }),
  yup.object({
    state: yup
      .string()
      .matches(cityStateRegex, 'State cannot contain numbers or special characters')
      .required('State is required'),
    city: yup
      .string()
      .matches(cityStateRegex, 'City cannot contain numbers or special characters')
      .required('City is required'),
    bio: yup.string().required('Bio is required'),
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
      .min(1, 'Select at least one language')
      .test(
        'valid-languages',
        'Only predefined languages are allowed',
        (values) =>
          !values || values.every((lang) => LANGUAGES.includes(lang || ''))
      ),
    specializations: yup
      .array()
      .of(yup.string())
      .min(1, 'Select at least one specialization')
      .test(
        'valid-specializations',
        'Only predefined specializations are allowed',
        (values) =>
          !values || values.every((spec) => SPECIALIZATIONS.includes(spec || ''))
      ),
    isOnlineAvailable: yup.boolean(),
    isOfflineAvailable: yup.boolean().test(
      'at-least-one-availability',
      'Select at least one availability mode (Online or Offline)',
      function () {
        const { isOnlineAvailable, isOfflineAvailable } = this.parent;
        return Boolean(isOnlineAvailable || isOfflineAvailable);
      }
    ),
  }),
  yup.object({
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
  yup.object({
    documents: yup.object({
      identityDoc: yup.mixed().required('Aadhaar or PAN Document is required'),
      certificate: yup.mixed().nullable().notRequired(),
      templeAffiliationProof: yup.mixed().nullable().notRequired(),
      profilePhoto: yup.mixed().required('Profile Photograph is required'),
    }),
  }),
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

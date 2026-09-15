'use client';
import React, { useState, useRef } from 'react';
import { Box, Container, Typography, Stepper, Step, StepLabel, Paper, Button, TextField, IconButton, Dialog, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, FormControlLabel, InputAdornment, RadioGroup, Radio, Link as MuiLink } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { sendOtpAPI, verifyOtpAPI, registerPurohitAPI } from '@/api/userControllers';
import { resendOtpAPI, getMeAPI } from '@/api/authControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

const steps = ['Basic Details', 'Verification (OTP)', 'Purohit Profile', 'Bank Details', 'Document Upload'];

const LANGUAGES = ['Hindi', 'Sanskrit', 'English', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];
const SPECIALIZATIONS = ['Vedic Mantras', 'Astrology', 'Karmakand', 'Vastu Shastra', 'Palmistry', 'Kundali Matching', 'Pooja Anushthan'];
const QUALIFICATIONS = ['SHASTRI', 'ACHARYA', 'VEDPATHI', 'OTHER'];

const emailTldRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co\.in|info|biz|io|co|us|uk|ca|au)$/i;

const today = new Date();
const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
const maxDobDate = `${twentyYearsAgo.getFullYear()}-${String(twentyYearsAgo.getMonth() + 1).padStart(2, '0')}-${String(twentyYearsAgo.getDate()).padStart(2, '0')}`;

const validationSchema = [
  yup.object({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    username: yup.string().required('Username is required'),
    mobileNumber: yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Mobile Number is required'),
    email: yup.string()
      .matches(emailTldRegex, 'Please enter a valid email address with a valid TLD (e.g. .com, .in)')
      .required('Email is required'),
    dob: yup.date()
      .max(twentyYearsAgo, 'Date of birth must be at least 20 years ago')
      .required('Date of Birth is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
  }),
  yup.object({
    // OTP validation is handled by string length check
  }),
  yup.object({
    bio: yup.string().required('Bio is required'),
    qualification: yup.string().required('Qualification is required'),
    experienceYears: yup.number().required('Experience Years is required').min(0),
    aadhaarNumber: yup.string().required('Aadhaar Number is required'),
    city: yup.string().required('City is required'),
    languages: yup.array().min(1, 'Select at least one language'),
    specializations: yup.array().min(1, 'Select at least one specialization'),
  }),
  yup.object({
    paymentMethod: yup.string().required(),
    upiId: yup.string().test('is-upi', 'UPI ID is required', function (val) {
      return this.parent.paymentMethod === 'UPI' ? !!val : true;
    }),
    bankName: yup.string().test('is-bank', 'Bank Name is required', function (val) {
      return this.parent.paymentMethod === 'BANK' ? !!val : true;
    }),
    accountName: yup.string().test('is-bank', 'Account Holder Name is required', function (val) {
      return this.parent.paymentMethod === 'BANK' ? !!val : true;
    }),
    accountNumber: yup.string().test('is-bank', 'Account Number is required', function (val) {
      return this.parent.paymentMethod === 'BANK' ? !!val : true;
    }),
    ifscCode: yup.string().test('is-bank', 'IFSC Code is required', function (val) {
      return this.parent.paymentMethod === 'BANK' ? !!val : true;
    }),
  }),
  yup.object({
    documents: yup.object({
      identityDoc: yup.mixed().required('Aadhaar or PAN Document is required'),
      certificate: yup.mixed().required('Certificate is required'),
      templeAffiliationProof: yup.mixed().nullable().notRequired(),
      profilePhoto: yup.mixed().nullable().notRequired(),
    })
  })
];

const selectMenuProps = {
  slotProps: {
    paper: {
      sx: { maxHeight: 300, mt: 1 },
    }
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



export default function PortalRegisterContent() {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '0', 10);
  const isAdminFlow = initialStep === 2;
  const [activeStep, setActiveStep] = useState(initialStep);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);

  React.useEffect(() => {
    let interval: any = null;
    if (activeStep === 1 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeStep, resendTimer]);

  const handlePortalResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await resendOtpAPI({ 
        phone: formik.values.mobileNumber, 
        email: formik.values.email, 
        otpType: 'REGISTER', 
        countryCode: formik.values.countryCode 
      });
      showSnackbar('OTP resent successfully!', 'success');
      setResendTimer(30);
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Failed to resend OTP', 'error');
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      countryCode: '+91',
      mobileNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      dob: '',
      otp: ['', '', '', '', '', ''],
      bio: '',
      qualification: '',
      experienceYears: '',
      aadhaarNumber: '',
      city: '',
      languages: [],
      specializations: [],
      isOnlineAvailable: true,
      isOfflineAvailable: true,
      paymentMethod: 'BANK',
      upiId: '',
      bankName: '',
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      documents: {
        identityDoc: null,
        certificate: null,
        templeAffiliationProof: null,
        profilePhoto: null
      }
    },
    validationSchema: validationSchema[activeStep],
    onSubmit: async (values) => {
      if (activeStep === 0) {
        setIsSendingOtp(true);
        try {
          const res = await sendOtpAPI({ phone: values.mobileNumber, email: values.email, role: 'PUROHIT', countryCode: values.countryCode });
          if (res.success || res.message) {
            showSnackbar('OTP sent successfully!', 'success');
            setActiveStep((prev) => prev + 1);
            formik.setTouched({});
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message;
          const displayMsg = Array.isArray(errorMsg) ? errorMsg.join(', ') : (errorMsg || 'Failed to send OTP');
          showSnackbar(displayMsg, 'error');
        } finally {
          setIsSendingOtp(false);
        }
        return;
      }

      if (activeStep === 1) {
        setIsVerifyingOtp(true);
        try {
          const otpStr = values.otp.join('');
          if (otpStr.length < 6) {
             showSnackbar('Please enter 6-digit OTP', 'error');
             setIsVerifyingOtp(false);
             return;
          }
          const res = await verifyOtpAPI({ phone: values.mobileNumber, email: values.email, otp: otpStr, role: 'PUROHIT', countryCode: values.countryCode });
          if (res.success || res.message) {
            showSnackbar('OTP Verified successfully!', 'success');
            setActiveStep((prev) => prev + 1);
            formik.setTouched({});
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message;
          const displayMsg = Array.isArray(errorMsg) ? errorMsg.join(', ') : (errorMsg || 'Invalid OTP');
          showSnackbar(displayMsg, 'error');
        } finally {
          setIsVerifyingOtp(false);
        }
        return;
      }

      if (activeStep === steps.length - 1) {
        setIsSubmittingForm(true);
        try {
          const fd = new FormData();
          if (!isAdminFlow) {
            fd.append('firstName', values.firstName);
            fd.append('lastName', values.lastName);
            fd.append('username', values.username);
            fd.append('phone', values.mobileNumber);
            fd.append('countryCode', values.countryCode);
            fd.append('email', values.email);
            fd.append('password', values.password);
            fd.append('confirmPassword', values.confirmPassword);
            fd.append('dob', values.dob);
          }

          fd.append('bio', values.bio);
          fd.append('qualification', values.qualification);
          fd.append('experienceYears', values.experienceYears.toString());
          fd.append('aadhaarNumber', values.aadhaarNumber);
          fd.append('city', values.city);
          
          if (isAdminFlow) {
            const userStr = sessionStorage.getItem('user');
            if (userStr) {
              try {
                const userObj = JSON.parse(userStr);
                if (userObj.id) {
                  fd.append('id', userObj.id.toString());
                }
              } catch (e) {
                console.error('Error parsing user from session storage', e);
              }
            }
          }
          
          values.languages.forEach(l => fd.append('languages', l as never));
          values.specializations.forEach(s => fd.append('specializations', s as never));
          
          fd.append('isOnlineAvailable', values.isOnlineAvailable ? 'true' : 'false');
          fd.append('isOfflineAvailable', values.isOfflineAvailable ? 'true' : 'false');
          
          fd.append('paymentMethod', values.paymentMethod);
          if (values.paymentMethod === 'UPI') {
            fd.append('upiId', values.upiId);
          } else {
            fd.append('accountHolderName', values.accountName);
            fd.append('accountNumber', values.accountNumber);
            fd.append('ifscCode', values.ifscCode);
            fd.append('bankName', values.bankName);
          }

          if (values.documents.identityDoc) fd.append('aadhaarDoc', values.documents.identityDoc);
          if (values.documents.certificate) fd.append('certificate', values.documents.certificate);
          if (values.documents.templeAffiliationProof) fd.append('templeAffiliationProof', values.documents.templeAffiliationProof);
          if (values.documents.profilePhoto) fd.append('profileImage', values.documents.profilePhoto);

          const res = await registerPurohitAPI(fd);
          if (res.success || res.message) {
            const token = res.tokens?.access?.token || res.token || res.accessToken;
            try {
              const meResponse = await getMeAPI(token);
              sessionStorage.setItem('user', JSON.stringify(meResponse?.user || meResponse?.data || meResponse || res.user));
            } catch (e) {
              sessionStorage.setItem('user', JSON.stringify(res.user));
            }
            if (res.csrfToken) {
              sessionStorage.setItem('csrfToken', res.csrfToken);
            }
            showSnackbar('Registration successful!', 'success');
            router.push('/purohit/dashboard');
          }
        } catch (error: any) {
          const errorMsg = error.response?.data?.message;
          const displayMsg = Array.isArray(errorMsg) ? errorMsg.join(', ') : (errorMsg || 'Registration failed');
          showSnackbar(displayMsg, 'error');
        } finally {
          setIsSubmittingForm(false);
        }
      } else {
        setActiveStep((prev) => prev + 1);
        formik.setTouched({});
      }
    }
  });

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (idx: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...formik.values.otp];
    const char = value.slice(-1); 
    newOtp[idx] = char;
    formik.setFieldValue('otp', newOtp);
    if (char && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !formik.values.otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const documentFields = [
    { id: 'identityDoc', title: 'Aadhaar / PAN Card', desc: 'Required' },
    { id: 'certificate', title: 'Educational Certificates', desc: 'Required' },
    { id: 'templeAffiliationProof', title: 'Temple Affiliation Proof', desc: 'Optional' },
    { id: 'profilePhoto', title: 'Profile Photograph', desc: 'Optional' },
  ] as const;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFFDF9' }}>
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #FFE0D0', bgcolor: 'white' }}>
        <Typography variant="h4" sx={{ color: '#D32F2F', fontWeight: 800, fontFamily: 'var(--font-outfit), sans-serif' }}>
          Poojawala
        </Typography>
        <Typography sx={{ color: '#666', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 500 }}>
          Purohit Partner Onboarding
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <Stepper activeStep={isAdminFlow ? activeStep - 2 : activeStep} alternativeLabel sx={{ mb: 6, '& .MuiStepIcon-root.Mui-active': { color: '#FF6200' }, '& .MuiStepIcon-root.Mui-completed': { color: '#FF6200' } }}>
            {(isAdminFlow ? steps.slice(2) : steps).map((label) => (
              <Step key={label}>
                <StepLabel sx={{ '& .MuiStepLabel-label': { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 } }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={formik.handleSubmit}>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 3 }}>
                  Basic & Login Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth name="firstName" label="First Name" variant="outlined" value={formik.values.firstName} onChange={formik.handleChange} error={formik.touched.firstName && Boolean(formik.errors.firstName)} helperText={formik.touched.firstName && formik.errors.firstName as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth name="lastName" label="Last Name" variant="outlined" value={formik.values.lastName} onChange={formik.handleChange} error={formik.touched.lastName && Boolean(formik.errors.lastName)} helperText={formik.touched.lastName && formik.errors.lastName as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth name="username" label="Username" variant="outlined" value={formik.values.username} onChange={formik.handleChange} error={formik.touched.username && Boolean(formik.errors.username)} helperText={formik.touched.username && formik.errors.username as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MuiTelInput 
                      fullWidth 
                      name="mobileNumber" 
                      label="Mobile Number" 
                      variant="outlined" 
                      defaultCountry="IN"
                      value={formik.values.countryCode ? formik.values.countryCode + formik.values.mobileNumber : formik.values.mobileNumber} 
                      onChange={(newValue, info) => {
                        formik.setFieldValue('countryCode', '+' + (info.countryCallingCode || '91'));
                        const natNum = info.nationalNumber || '';
                        const cleanNum = natNum.replace(/\D/g, '').slice(0, 10);
                        formik.setFieldValue('mobileNumber', cleanNum);
                      }} 
                      onKeyDown={(e) => {
                        if (formik.values.mobileNumber && formik.values.mobileNumber.length >= 10) {
                          if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }
                      }}
                      error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)} 
                      helperText={formik.touched.mobileNumber && formik.errors.mobileNumber as string} 
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth name="email" label="Email Address" type="email" variant="outlined" value={formik.values.email} onChange={formik.handleChange} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth name="dob" label="Date of Birth" type="date" slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: maxDobDate } }} variant="outlined" value={formik.values.dob} onChange={formik.handleChange} error={formik.touched.dob && Boolean(formik.errors.dob)} helperText={formik.touched.dob && formik.errors.dob as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth name="password" label="Password" type={showPassword ? 'text' : 'password'} variant="outlined" value={formik.values.password} onChange={formik.handleChange} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth name="confirmPassword" label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} variant="outlined" value={formik.values.confirmPassword} onChange={formik.handleChange} error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 2 }}>
                  Verify your Identity
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 4 }}>
                  We've sent a 6-digit OTP to {formik.values.email}.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
                  {formik.values.otp.map((val, idx) => (
                    <TextField 
                      key={idx} 
                      variant="outlined" 
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      inputRef={(el) => { otpRefs.current[idx] = el; }}
                      slotProps={{ htmlInput: { maxLength: 1 } }}
                      sx={{ width: '50px', '& input': { textAlign: 'center', fontSize: '20px', fontWeight: 700, p: 1.5 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                    />
                  ))}
                </Box>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', textAlign: 'center', mt: 3, fontSize: '14px' }}>
                  Didn't receive the OTP?{' '}
                  {resendTimer > 0 ? (
                    <span style={{ color: '#999', fontWeight: 600 }}>Resend in {resendTimer}s</span>
                  ) : (
                    <MuiLink 
                      component="button"
                      type="button"
                      onClick={handlePortalResendOtp} 
                      sx={{ color: '#FF6200', fontWeight: 700, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px' }}
                    >
                      Resend
                    </MuiLink>
                  )}
                </Typography>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 3 }}>
                  Purohit Profile
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth name="city" label="City" variant="outlined" value={formik.values.city} onChange={formik.handleChange} error={formik.touched.city && Boolean(formik.errors.city)} helperText={formik.touched.city && formik.errors.city as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      fullWidth 
                      name="aadhaarNumber" 
                      label="Aadhaar Number" 
                      variant="outlined" 
                      value={formik.values.aadhaarNumber} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 12) {
                          formik.setFieldValue('aadhaarNumber', val);
                        }
                      }} 
                      error={formik.touched.aadhaarNumber && Boolean(formik.errors.aadhaarNumber)} 
                      helperText={formik.touched.aadhaarNumber && formik.errors.aadhaarNumber as string} 
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} error={formik.touched.qualification && Boolean(formik.errors.qualification)}>
                      <InputLabel>Qualification</InputLabel>
                      <Select name="qualification" value={formik.values.qualification} onChange={formik.handleChange} label="Qualification" MenuProps={selectMenuProps}>
                        {QUALIFICATIONS.map((q) => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                      </Select>
                      {formik.touched.qualification && <Typography variant="caption" color="error" sx={{ml: 2, mt: 0.5}}>{formik.errors.qualification as string}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth type="number" name="experienceYears" label="Experience (Years)" variant="outlined" value={formik.values.experienceYears} onChange={formik.handleChange} error={formik.touched.experienceYears && Boolean(formik.errors.experienceYears)} helperText={formik.touched.experienceYears && formik.errors.experienceYears as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} error={formik.touched.languages && Boolean(formik.errors.languages)}>
                      <InputLabel>Languages</InputLabel>
                      <Select multiple name="languages" value={formik.values.languages} onChange={formik.handleChange} input={<OutlinedInput label="Languages" />} renderValue={(selected) => selected.join(', ')} MenuProps={selectMenuProps}>
                        {LANGUAGES.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={formik.values.languages.indexOf(name as never) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.languages && <Typography variant="caption" color="error" sx={{ml: 2, mt: 0.5}}>{formik.errors.languages as string}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} error={formik.touched.specializations && Boolean(formik.errors.specializations)}>
                      <InputLabel>Specializations</InputLabel>
                      <Select multiple name="specializations" value={formik.values.specializations} onChange={formik.handleChange} input={<OutlinedInput label="Specializations" />} renderValue={(selected) => selected.join(', ')} MenuProps={selectMenuProps}>
                        {SPECIALIZATIONS.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={formik.values.specializations.indexOf(name as never) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.specializations && <Typography variant="caption" color="error" sx={{ml: 2, mt: 0.5}}>{formik.errors.specializations as string}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth multiline rows={3} name="bio" label="Bio (About Yourself)" variant="outlined" value={formik.values.bio} onChange={formik.handleChange} error={formik.touched.bio && Boolean(formik.errors.bio)} helperText={formik.touched.bio && formik.errors.bio as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel control={<Checkbox checked={formik.values.isOnlineAvailable} onChange={formik.handleChange} name="isOnlineAvailable" sx={{color: '#FF6200', '&.Mui-checked': { color: '#FF6200' }}} />} label="Available for Online Pooja" />
                    <FormControlLabel control={<Checkbox checked={formik.values.isOfflineAvailable} onChange={formik.handleChange} name="isOfflineAvailable" sx={{color: '#FF6200', '&.Mui-checked': { color: '#FF6200' }}} />} label="Available for Offline Pooja" />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 3 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 3 }}>
                  Bank or UPI Details
                </Typography>

                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                  <FormControl component="fieldset">
                    <RadioGroup row name="paymentMethod" value={formik.values.paymentMethod} onChange={formik.handleChange}>
                      <FormControlLabel value="BANK" control={<Radio sx={{ '&.Mui-checked': { color: '#FF6200' } }} />} label={<Typography sx={{ fontWeight: formik.values.paymentMethod === 'BANK' ? 700 : 500 }}>Bank Account</Typography>} />
                      <FormControlLabel value="UPI" control={<Radio sx={{ '&.Mui-checked': { color: '#FF6200' } }} />} label={<Typography sx={{ fontWeight: formik.values.paymentMethod === 'UPI' ? 700 : 500 }}>UPI ID</Typography>} sx={{ ml: 4 }} />
                    </RadioGroup>
                  </FormControl>
                </Box>

                {formik.values.paymentMethod === 'UPI' ? (
                  <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <TextField fullWidth name="upiId" label="UPI ID (e.g. 9876543210@ybl)" variant="outlined" value={formik.values.upiId} onChange={formik.handleChange} error={formik.touched.upiId && Boolean(formik.errors.upiId)} helperText={formik.touched.upiId && formik.errors.upiId as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth name="accountName" label="Account Holder Name" variant="outlined" value={formik.values.accountName} onChange={formik.handleChange} error={formik.touched.accountName && Boolean(formik.errors.accountName)} helperText={formik.touched.accountName && formik.errors.accountName as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth name="bankName" label="Bank Name" variant="outlined" value={formik.values.bankName} onChange={formik.handleChange} error={formik.touched.bankName && Boolean(formik.errors.bankName)} helperText={formik.touched.bankName && formik.errors.bankName as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth name="accountNumber" label="Account Number" variant="outlined" value={formik.values.accountNumber} onChange={formik.handleChange} error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)} helperText={formik.touched.accountNumber && formik.errors.accountNumber as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth name="ifscCode" label="IFSC Code" variant="outlined" value={formik.values.ifscCode} onChange={formik.handleChange} error={formik.touched.ifscCode && Boolean(formik.errors.ifscCode)} helperText={formik.touched.ifscCode && formik.errors.ifscCode as string} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Grid>

                  </Grid>
                )}
              </Box>
            )}

            {activeStep === 4 && (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 3 }}>
                  Upload Verification Documents
                </Typography>
                
                {formik.errors.documents && typeof formik.errors.documents === 'string' && (
                   <Typography color="error" sx={{ mb: 2 }}>{formik.errors.documents}</Typography>
                )}

                <Grid container spacing={3}>
                  {documentFields.map((doc) => {
                    const file = (formik.values.documents as any)[doc.id] as File | null;
                    const error = formik.touched.documents?.[doc.id as keyof typeof formik.touched.documents] && (formik.errors.documents as any)?.[doc.id];
                    
                    return (
                      <Grid size={{ xs: 12, sm: 6 }} key={doc.id}>
                        <Paper 
                          sx={{ 
                            p: 3, 
                            border: '2px dashed',
                            borderColor: error ? 'error.main' : (file ? '#4CAF50' : '#FFE0D0'),
                            borderRadius: '16px', 
                            textAlign: 'center', 
                            bgcolor: file ? '#F1F8E9' : '#FFFDF9', 
                            transition: 'all 0.3s', 
                            position: 'relative',
                            '&:hover': { borderColor: file ? '#4CAF50' : '#FF6200', bgcolor: file ? '#E8F5E9' : '#FFF8F4' } 
                          }}
                        >
                          {file && (
                            <IconButton 
                              size="small" 
                              onClick={() => formik.setFieldValue(`documents.${doc.id}`, null)}
                              sx={{ position: 'absolute', top: 8, right: 8, color: '#D32F2F', bgcolor: '#FFEBEE', '&:hover': { bgcolor: '#FFCDD2' } }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )}
                          {file ? (
                            file.type.startsWith('image/') ? (
                              <Box sx={{ width: 60, height: 60, mx: 'auto', mb: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
                                <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </Box>
                            ) : (
                              <CheckCircleIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                            )
                          ) : (
                            <CloudUploadIcon sx={{ fontSize: 40, color: error ? 'error.main' : '#FF6200', mb: 1 }} />
                          )}
                          
                          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 0.5 }}>{doc.title}</Typography>
                          
                          <Typography 
                            onClick={() => file && setPreviewFile(file)}
                            sx={{ 
                              fontFamily: 'var(--font-outfit), sans-serif', 
                              color: file ? '#2196F3' : '#666', 
                              fontSize: '12px', 
                              mb: 2, 
                              textOverflow: 'ellipsis', 
                              overflow: 'hidden', 
                              whiteSpace: 'nowrap',
                              cursor: file ? 'pointer' : 'default',
                              textDecoration: file ? 'underline' : 'none',
                              '&:hover': { color: file ? '#1976D2' : '#666' }
                            }}
                          >
                            {file ? file.name : doc.desc}
                          </Typography>
                          
                          {!file && (
                            <Button 
                              component="label" 
                              variant="contained" 
                              size="small" 
                              sx={{ background: '#FF6200', color: 'white', textTransform: 'none', borderRadius: '30px', px: 3, boxShadow: 'none', '&:hover': { background: '#F05A00', boxShadow: 'none' } }}
                            >
                              Select File
                              <input
                                type="file"
                                hidden
                                onChange={(event) => {
                                  if (event.currentTarget.files) {
                                    formik.setFieldValue(`documents.${doc.id}`, event.currentTarget.files[0]);
                                  }
                                }}
                              />
                            </Button>
                          )}
                          
                          {error && (
                            <Typography color="error" sx={{ fontSize: '12px', mt: 1 }}>
                              {error as string}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
                
                <Dialog 
                  open={!!previewFile} 
                  onClose={() => setPreviewFile(null)} 
                  maxWidth="md" 
                  fullWidth
                  sx={{ '& .MuiDialog-paper': { bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden' } }}
                >
                  <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <IconButton 
                      onClick={() => setPreviewFile(null)}
                      sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                    >
                      <CloseIcon />
                    </IconButton>
                    {previewFile && previewFile.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(previewFile)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' }} />
                    ) : previewFile ? (
                      <Box sx={{ width: '100%', position: 'relative' }}>
                        <iframe src={URL.createObjectURL(previewFile)} style={{ width: '100%', height: '85vh', minWidth: '60vw', border: 'none', borderRadius: '12px', backgroundColor: 'white' }} title="Document Preview" />
                      </Box>
                    ) : null}
                  </Box>
                </Dialog>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
              <Button
                disabled={activeStep === 0 || isSendingOtp || isVerifyingOtp || isSubmittingForm}
                onClick={handleBack}
                type="button"
                sx={{ 
                  background: '#FF6200', 
                  color: 'white', 
                  textTransform: 'none', 
                  fontWeight: 600,
                  borderRadius: '30px',
                  px: 4,
                  boxShadow: 'none',
                  '&:hover': { background: '#F05A00', boxShadow: 'none' },
                  '&.Mui-disabled': { background: '#FFE0D0', color: '#FFA07A' }
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSendingOtp || isVerifyingOtp || isSubmittingForm}
                sx={{ 
                  background: '#FF6200', 
                  color: 'white', 
                  textTransform: 'none', 
                  fontWeight: 700, 
                  borderRadius: '30px', 
                  px: 4, 
                  boxShadow: 'none',
                  '&:hover': { background: '#F05A00', boxShadow: 'none' } 
                }}
              >
                {isSendingOtp ? 'Sending OTP...' : isVerifyingOtp ? 'Verifying...' : isSubmittingForm ? 'Submitting...' : activeStep === steps.length - 1 ? 'Submit Registration' : 'Next Step'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

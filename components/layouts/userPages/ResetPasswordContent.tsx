'use client';

import { resendOtpAPI, resetPasswordAPI } from '@/api/authControllers';
import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { COLORS } from '@/utils/enums';
import { FONTS } from '@/utils/fonts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  otp: Yup.array()
    .of(Yup.string())
    .test(
      'is-complete',
      'Please enter all 6 digits of the OTP',
      (val) => val?.join('').length === 6
    ),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const redirect = searchParams.get('redirect') || '/sign-in';

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [timer, setTimer] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    if (timer > 0) return;
    try {
      const response = await resendOtpAPI({ email, otpType: 'RESET_PASSWORD' });
      if (response.success || response.statusCode === 200) {
        showSnackbar('OTP has been resent to your email.', 'success');
        setTimer(30);
      }
    } catch (error: any) {
      console.error('Resend OTP failed', error);
      showSnackbar(
        error.response?.data?.message || 'Failed to resend OTP.',
        'error'
      );
    }
  };

  const handleOtpChange = (
    idx: number,
    value: string,
    setFieldValue: any,
    values: any
  ) => {
    const cleanVal = value.replace(/\D/g, '');
    if (value !== '' && !cleanVal) return;

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 6);
      const newOtp = [...values.otp];
      for (let i = 0; i < digits.length && idx + i < 6; i++) {
        newOtp[idx + i] = digits[i];
      }
      setFieldValue('otp', newOtp);
      const nextFocus = Math.min(5, idx + digits.length - 1);
      otpRefs.current[nextFocus]?.focus();
      return;
    }

    const newOtp = [...values.otp];
    const char = cleanVal.slice(-1);
    newOtp[idx] = char;
    setFieldValue('otp', newOtp);

    if (char && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    setFieldValue: any,
    values: any
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!pastedText) return;
    const newOtp = [...values.otp];
    for (let i = 0; i < pastedText.length; i++) {
      newOtp[i] = pastedText[i];
    }
    setFieldValue('otp', newOtp);
    const nextFocus = Math.min(5, pastedText.length - 1);
    otpRefs.current[nextFocus]?.focus();
  };

  const handleOtpKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLDivElement>,
    values: any,
    submitForm?: () => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (submitForm) submitForm();
    } else if (e.key === 'Backspace' && !values.otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  if (!email) {
    if (typeof window !== 'undefined') {
      router.push('/forgot-password');
    }
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: "url('/images/login-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: { xs: '70% center', md: 'center' },
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Top Header: Brand Logo & Top Back Navigation */}
      <Box
        sx={{
          position: { xs: 'relative', md: 'absolute' },
          top: { xs: 0, md: 28 },
          left: 0,
          right: 0,
          px: { xs: 2, sm: 4, md: 6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'space-between' },
          width: '100%',
          mb: { xs: 3.5, md: 0 },
          zIndex: 10,
        }}
      >
        {/* Brand Logo */}
        <Box
          component={Link}
          href="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            order: 1,
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'scale(1.04)' },
          }}
        >
          <Box
            component="img"
            src="/images/1Poojalogo.webp"
            alt="1Pooja Logo"
            sx={{
              height: { xs: '54px', sm: '58px', md: '50px' },
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 3px 12px rgba(0, 0, 0, 0.08))',
            }}
          />
        </Box>

        {/* Desktop Back Navigation */}
        <Button
          component={Link}
          href={redirect || '/sign-in'}
          startIcon={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 98, 0, 0.12)',
                color: COLORS.PRIMARY,
                transition: 'all 0.25s ease',
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
            </Box>
          }
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            order: 2,
            color: '#1F1A17',
            bgcolor: '#FFFFFF',
            border: '1.5px solid rgba(255, 98, 0, 0.28)',
            borderRadius: '32px',
            pl: 1.2,
            pr: 2.6,
            py: 0.8,
            fontFamily: FONTS.OUTFIT,
            fontWeight: 600,
            fontSize: '14px',
            letterSpacing: '0.1px',
            textTransform: 'none',
            boxShadow:
              '0 6px 20px -3px rgba(255, 98, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: '#FFFFFF',
              borderColor: COLORS.PRIMARY,
              color: COLORS.PRIMARY,
              transform: 'translateY(-2px)',
              boxShadow:
                '0 10px 28px -3px rgba(255, 98, 0, 0.32), 0 4px 12px rgba(0, 0, 0, 0.08)',
              '& .MuiButton-startIcon > div': {
                bgcolor: COLORS.PRIMARY,
                color: '#FFFFFF',
                transform: 'translateX(-2px)',
              },
            },
          }}
        >
          Back to Sign In
        </Button>
      </Box>

      {/* Frosted Glass Form Card */}
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', sm: '470px' },
            width: '100%',
            borderRadius: { xs: '22px', sm: '26px' },
            p: { xs: '22px 18px', sm: '26px 30px' },
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 250, 245, 0.45) 100%)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            outline: '1px solid rgba(230, 195, 160, 0.3)',
            boxShadow:
              '0 35px 85px -15px rgba(190, 85, 20, 0.22), 0 18px 40px -6px rgba(0, 0, 0, 0.08), inset 0 2px 2px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(255, 255, 255, 0.4)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Decorative Icon Badge */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '13px',
              bgcolor: 'rgba(255, 98, 0, 0.1)',
              border: '1px solid rgba(255, 98, 0, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.25,
              boxShadow: '0 4px 12px rgba(255, 98, 0, 0.12)',
            }}
          >
            <LockResetOutlinedIcon sx={{ fontSize: 24, color: '#FF6200' }} />
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: '#1F1A17',
              fontSize: { xs: '21px', sm: '23px' },
              lineHeight: 1.25,
              mb: 0.5,
              letterSpacing: '-0.3px',
            }}
          >
            Reset Password
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: '#6B7280',
              fontSize: { xs: '12.5px', sm: '13px' },
              lineHeight: 1.45,
              mb: 2,
              maxWidth: '380px',
            }}
          >
            Enter the 6-digit OTP sent to{' '}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: '#FF6200', wordBreak: 'break-all' }}
            >
              {email}
            </Box>{' '}
            and set your new password.
          </Typography>

          {/* Formik Form */}
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <Formik
              initialValues={{
                otp: ['', '', '', '', '', ''],
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const response = await resetPasswordAPI({
                    email,
                    otp: values.otp.join(''),
                    password: values.password,
                  });

                  if (response.success || response.statusCode === 200) {
                    showSnackbar('Password reset successfully!', 'success');
                    setTimeout(() => router.push(redirect), 1500);
                  }
                } catch (error: any) {
                  console.error('Reset password failed', error);
                  showSnackbar(
                    error.response?.data?.message ||
                      'Failed to reset password. Please check your OTP.',
                    'error'
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                isSubmitting,
                touched,
                errors,
                values,
                setFieldValue,
                submitForm,
              }) => (
                <Box
                  component={Form}
                  autoComplete="off"
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLElement;
                      if (target.tagName?.toLowerCase() === 'textarea') return;
                      e.preventDefault();
                      submitForm();
                    }
                  }}
                >
                  <FormikValidationSnackbar />

                  {/* OTP Section */}
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#374151',
                        mb: 0.5,
                      }}
                    >
                      Enter 6-Digit OTP <Box component="span" sx={{ color: '#FF6200' }}>*</Box>
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        gap: { xs: 0.6, sm: 1 },
                        justifyContent: 'space-between',
                      }}
                    >
                      {values.otp.map((val, idx) => (
                        <TextField
                          key={idx}
                          variant="outlined"
                          value={val}
                          onChange={(e) =>
                            handleOtpChange(
                              idx,
                              e.target.value,
                              setFieldValue,
                              values
                            )
                          }
                          onKeyDown={(e) =>
                            handleOtpKeyDown(idx, e, values, submitForm)
                          }
                          onPaste={(e) =>
                            handleOtpPaste(e, setFieldValue, values)
                          }
                          inputRef={(el) => {
                            otpRefs.current[idx] = el;
                          }}
                          slotProps={{ htmlInput: { maxLength: 6 } }}
                          error={touched.otp && !!errors.otp}
                          sx={{
                            flex: 1,
                            maxWidth: { xs: '42px', sm: '48px' },
                            '& input': {
                              textAlign: 'center',
                              fontSize: { xs: '16px', sm: '18px' },
                              fontWeight: 800,
                              py: { xs: 0.8, sm: 1.0 },
                              px: 0,
                              fontFamily: FONTS.OUTFIT,
                              color: '#1F1A17',
                            },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              bgcolor: 'rgba(255, 255, 255, 0.75)',
                              backdropFilter: 'blur(10px)',
                              transition: 'all 0.2s ease',
                              '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                                borderWidth: '1.5px',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 98, 0, 0.45)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FF6200',
                                borderWidth: '2px',
                                boxShadow:
                                  '0 0 0 3px rgba(255, 98, 0, 0.12)',
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>

                    {touched.otp && errors.otp && (
                      <Typography
                        sx={{
                          color: '#d32f2f',
                          fontSize: '11.5px',
                          mt: 0.5,
                          fontFamily: FONTS.OUTFIT,
                        }}
                      >
                        {errors.otp as string}
                      </Typography>
                    )}

                    {/* Resend OTP Row */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        onClick={handleResendOtp}
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: '12.5px',
                          color: timer > 0 ? '#9CA3AF' : '#FF6200',
                          cursor: timer > 0 ? 'default' : 'pointer',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: timer > 0 ? 'none' : 'underline',
                          },
                        }}
                      >
                        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* New Password Field */}
                  <Box sx={{ mb: 1.25 }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#374151',
                        mb: 0.4,
                      }}
                    >
                      New Password <Box component="span" sx={{ color: '#FF6200' }}>*</Box>
                    </Typography>

                    <Field name="password">
                      {({ field, meta }: any) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="At least 6 characters"
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined"
                          autoComplete="new-password"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockOutlinedIcon
                                    sx={{ fontSize: 18, color: '#9CA3AF' }}
                                  />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    size="small"
                                    sx={{ color: '#6B7280' }}
                                  >
                                    {showPassword ? (
                                      <VisibilityOff sx={{ fontSize: 18 }} />
                                    ) : (
                                      <Visibility sx={{ fontSize: 18 }} />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                            htmlInput: {
                              autoComplete: 'new-password',
                            },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontFamily: FONTS.OUTFIT,
                              bgcolor: 'rgba(255, 255, 255, 0.75)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '12px',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              '& input': {
                                py: '12px',
                              },
                              '& input:-webkit-autofill': {
                                WebkitBoxShadow:
                                  '0 0 0 1000px rgba(255, 255, 255, 0.95) inset !important',
                                WebkitTextFillColor: '#1F1A17 !important',
                                transition:
                                  'background-color 5000s ease-in-out 0s',
                              },
                              '&:has(input:-webkit-autofill)': {
                                backgroundColor: '#FFFFFF !important',
                              },
                              '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                                borderWidth: '1.5px',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 98, 0, 0.45)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FF6200',
                                borderWidth: '2px',
                              },
                            },
                            '& .MuiFormHelperText-root': {
                              fontFamily: FONTS.OUTFIT,
                              fontSize: '11.5px',
                              mx: 0.5,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Box>

                  {/* Confirm Password Field */}
                  <Box sx={{ mb: 0.5 }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#374151',
                        mb: 0.4,
                      }}
                    >
                      Confirm Password <Box component="span" sx={{ color: '#FF6200' }}>*</Box>
                    </Typography>

                    <Field name="confirmPassword">
                      {({ field, meta }: any) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Re-enter your new password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          variant="outlined"
                          autoComplete="new-password"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockOutlinedIcon
                                    sx={{ fontSize: 18, color: '#9CA3AF' }}
                                  />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    edge="end"
                                    size="small"
                                    sx={{ color: '#6B7280' }}
                                  >
                                    {showConfirmPassword ? (
                                      <VisibilityOff sx={{ fontSize: 18 }} />
                                    ) : (
                                      <Visibility sx={{ fontSize: 18 }} />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                            htmlInput: {
                              autoComplete: 'new-password',
                            },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontFamily: FONTS.OUTFIT,
                              bgcolor: 'rgba(255, 255, 255, 0.75)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '12px',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              '& input': {
                                py: '12px',
                              },
                              '& input:-webkit-autofill': {
                                WebkitBoxShadow:
                                  '0 0 0 1000px rgba(255, 255, 255, 0.95) inset !important',
                                WebkitTextFillColor: '#1F1A17 !important',
                                transition:
                                  'background-color 5000s ease-in-out 0s',
                              },
                              '&:has(input:-webkit-autofill)': {
                                backgroundColor: '#FFFFFF !important',
                              },
                              '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                                borderWidth: '1.5px',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 98, 0, 0.45)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FF6200',
                                borderWidth: '2px',
                              },
                            },
                            '& .MuiFormHelperText-root': {
                              fontFamily: FONTS.OUTFIT,
                              fontSize: '11.5px',
                              mx: 0.5,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Box>

                  {/* Reset Password CTA Button */}
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      mt: 2,
                      py: 1.15,
                      borderRadius: '12px',
                      background:
                        'linear-gradient(135deg, #FF6200 0%, #FF4500 100%)',
                      color: '#ffffff',
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '14.5px',
                      textTransform: 'none',
                      boxShadow: '0 8px 20px -4px rgba(255, 98, 0, 0.4)',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #E65800 0%, #E63E00 100%)',
                        boxShadow: '0 12px 26px -4px rgba(255, 98, 0, 0.5)',
                        transform: 'translateY(-1.5px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(200, 195, 190, 0.5)',
                        color: '#9CA3AF',
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </Box>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>

      {/* Mobile Back Navigation (Centered below card, exactly like Login) */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          width: '100%',
          mt: 2.5,
          mb: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Button
          component={Link}
          href={redirect || '/sign-in'}
          startIcon={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 98, 0, 0.12)',
                color: COLORS.PRIMARY,
                transition: 'all 0.25s ease',
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 15 }} />
            </Box>
          }
          sx={{
            color: '#1F1A17',
            bgcolor: '#FFFFFF',
            border: '1.5px solid rgba(255, 98, 0, 0.28)',
            borderRadius: '32px',
            pl: 1.2,
            pr: 2.4,
            py: 0.8,
            fontFamily: FONTS.OUTFIT,
            fontWeight: 600,
            fontSize: '13.5px',
            letterSpacing: '0.1px',
            textTransform: 'none',
            boxShadow:
              '0 6px 20px -3px rgba(255, 98, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.25s ease',
            '& .MuiButton-startIcon': {
              mr: 1,
            },
            '&:hover': {
              bgcolor: '#FFFFFF',
              borderColor: COLORS.PRIMARY,
              color: COLORS.PRIMARY,
              transform: 'translateY(-1.5px)',
              boxShadow: '0 8px 24px -3px rgba(255, 98, 0, 0.28)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Back to Sign In
        </Button>
      </Box>
    </Box>
  );
}

'use client';

import { forgotPasswordAPI } from '@/api/authControllers';
import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { COLORS } from '@/utils/enums';
import { FONTS } from '@/utils/fonts';
import {
  allowOnlyEmailCharsOnKeyDown,
  EMAIL_STRICT_MESSAGE,
  EMAIL_STRICT_REGEX,
  sanitizeEmailInput,
} from '@/utils/helpers';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE)
    .required('Email is required'),
});

export default function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/sign-in';
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

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
            maxWidth: { xs: '100%', sm: '460px' },
            width: '100%',
            borderRadius: { xs: '24px', sm: '30px' },
            p: { xs: '34px 22px', sm: '42px 36px' },
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
              width: 58,
              height: 58,
              borderRadius: '18px',
              bgcolor: 'rgba(255, 98, 0, 0.1)',
              border: '1px solid rgba(255, 98, 0, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2.25,
              boxShadow: '0 6px 18px rgba(255, 98, 0, 0.12)',
            }}
          >
            <LockResetOutlinedIcon sx={{ fontSize: 32, color: '#FF6200' }} />
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: '#1F1A17',
              fontSize: { xs: '24px', sm: '27px' },
              lineHeight: 1.25,
              mb: 1,
              letterSpacing: '-0.3px',
            }}
          >
            Forgot Password?
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: '#6B7280',
              fontSize: { xs: '13.5px', sm: '14px' },
              lineHeight: 1.55,
              mb: 3.5,
              maxWidth: '340px',
            }}
          >
            Enter your registered email address and we'll send you an OTP to
            reset your password.
          </Typography>

          {/* Formik Form */}
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const response = await forgotPasswordAPI({
                    email: values.email,
                  });
                  if (response.success || response.statusCode === 200) {
                    showSnackbar('OTP sent successfully!', 'success');
                    setTimeout(
                      () =>
                        router.push(
                          `/reset-password?email=${encodeURIComponent(
                            values.email
                          )}&redirect=${encodeURIComponent(redirect)}`
                        ),
                      1000
                    );
                  }
                } catch (error: any) {
                  console.error('Forgot password failed', error);
                  showSnackbar(
                    error.response?.data?.message ||
                      'Failed to send OTP. Please try again.',
                    'error'
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, touched, errors, submitForm }) => (
                <Box
                  component={Form}
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

                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#374151',
                      mb: 0.8,
                    }}
                  >
                    Email Address <Box component="span" sx={{ color: '#FF6200' }}>*</Box>
                  </Typography>

                  <Field name="email">
                    {({ field, form, meta }: any) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="e.g. name@example.com"
                        variant="outlined"
                        type="email"
                        onKeyDown={allowOnlyEmailCharsOnKeyDown}
                        onChange={(e) => {
                          form.setFieldValue(
                            'email',
                            sanitizeEmailInput(e.target.value)
                          );
                        }}
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <MailOutlineOutlinedIcon
                                  sx={{ fontSize: 20, color: '#9CA3AF' }}
                                />
                              </InputAdornment>
                            ),
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontFamily: FONTS.OUTFIT,
                            bgcolor: 'rgba(255, 255, 255, 0.75)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '14px',
                            fontSize: '14.5px',
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
                            },
                          },
                          '& .MuiFormHelperText-root': {
                            fontFamily: FONTS.OUTFIT,
                            fontSize: '12px',
                            mx: 0.5,
                          },
                        }}
                      />
                    )}
                  </Field>

                  {/* Send OTP CTA Button */}
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      mt: 3,
                      py: 1.4,
                      borderRadius: '14px',
                      background:
                        'linear-gradient(135deg, #FF6200 0%, #FF4500 100%)',
                      color: '#ffffff',
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '15px',
                      textTransform: 'none',
                      boxShadow: '0 10px 24px -4px rgba(255, 98, 0, 0.42)',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #E65800 0%, #E63E00 100%)',
                        boxShadow: '0 14px 30px -4px rgba(255, 98, 0, 0.52)',
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
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      'Send OTP'
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

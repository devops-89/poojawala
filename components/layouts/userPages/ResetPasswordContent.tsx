'use client';
import { Box, Button, Container, Grid, Paper, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { resetPasswordAPI, resendOtpAPI } from '@/api/authControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';

const validationSchema = Yup.object().shape({
  otp: Yup.array()
    .of(Yup.string())
    .test('is-complete', 'OTP is required', (val) => val?.join('').length === 6),
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
      showSnackbar(error.response?.data?.message || 'Failed to resend OTP.', 'error');
    }
  };

  const handleOtpChange = (idx: number, value: string, setFieldValue: any, values: any) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...values.otp];
    const char = value.slice(-1); 
    newOtp[idx] = char;
    setFieldValue('otp', newOtp);

    if (char && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLDivElement>, values: any) => {
    if (e.key === 'Backspace' && !values.otp[idx] && idx > 0) {
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
        bgcolor: '#FFFDF9', 
        display: 'flex', 
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 10 }}>
        <Grid container spacing={0} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 8, md: 6, lg: 4 }}>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 6 },
                borderRadius: '24px', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid #FFE0D0',
                position: 'relative'
              }}
            >
              <Button 
                onClick={() => router.back()} 
                sx={{ position: 'absolute', top: 16, right: 16, color: '#666', textTransform: 'none', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, '&:hover': { background: 'transparent', color: '#1A1A1A' } }}
                startIcon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>}
              >
                Back
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', textAlign: 'center' }}>
                  Reset Password
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', mb: 4, textAlign: 'center' }}>
                Enter the OTP sent to <b>{email}</b> and your new password.
              </Typography>

              <Formik
                initialValues={{ otp: ['', '', '', '', '', ''], password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const response = await resetPasswordAPI({ 
                      email, 
                      otp: values.otp.join(''), 
                      password: values.password 
                    });
                    
                    if (response.success || response.statusCode === 200) {
                      showSnackbar('Password reset successfully!', 'success');
                      setTimeout(() => router.push(redirect), 1500);
                    }
                  } catch (error: any) {
                    console.error('Reset password failed', error);
                    showSnackbar(error.response?.data?.message || 'Failed to reset password. Please check your OTP.', 'error');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, touched, errors, values, setFieldValue }) => (
                  <Box component={Form}>
                    <FormikValidationSnackbar />
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', mb: 1, fontSize: '14px' }}>
                        Enter your OTP
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                        {values.otp.map((val, idx) => (
                          <TextField 
                            key={idx} 
                            variant="outlined" 
                            value={val}
                            onChange={(e) => handleOtpChange(idx, e.target.value, setFieldValue, values)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e, values)}
                            inputRef={(el) => { otpRefs.current[idx] = el; }}
                            slotProps={{ htmlInput: { maxLength: 1 } }}
                            error={touched.otp && !!errors.otp}
                            sx={{ '& input': { textAlign: 'center', fontSize: '20px', fontWeight: 700, p: 1.5 }, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
                          />
                        ))}
                      </Box>
                      {touched.otp && errors.otp && (
                        <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5, mx: 1 }}>
                          {errors.otp as string}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Typography 
                          onClick={handleResendOtp}
                          sx={{ 
                            fontFamily: '"DM Sans", sans-serif', 
                            fontSize: '14px', 
                            color: timer > 0 ? '#999' : '#FF6200', 
                            cursor: timer > 0 ? 'default' : 'pointer',
                            fontWeight: 600,
                            '&:hover': { textDecoration: timer > 0 ? 'none' : 'underline' }
                          }}
                        >
                          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Field name="password">
                      {({ field, meta }: any) => (
                        <TextField
                          {...field}
                          fullWidth 
                          label="New Password" 
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined" 
                          margin="normal"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff sx={{ color: '#999' }} /> : <Visibility sx={{ color: '#999' }} />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                            '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                          }}
                        />
                      )}
                    </Field>

                    <Field name="confirmPassword">
                      {({ field, meta }: any) => (
                        <TextField
                          {...field}
                          fullWidth 
                          label="Confirm Password" 
                          type={showConfirmPassword ? 'text' : 'password'}
                          variant="outlined" 
                          margin="normal"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                    {showConfirmPassword ? <VisibilityOff sx={{ color: '#999' }} /> : <Visibility sx={{ color: '#999' }} />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                            '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                          }}
                        />
                      )}
                    </Field>
                    
                    <Button 
                      type="submit"
                      fullWidth 
                      disabled={isSubmitting}
                      variant="contained" 
                      sx={{
                        background: '#FF6200',
                        color: 'white',
                        py: 1.5,
                        mt: 3,
                        borderRadius: '31px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '16px',
                        boxShadow: '0 8px 20px rgba(255, 98, 0, 0.3)',
                        '&:hover': {
                          background: '#E65800',
                          boxShadow: '0 8px 25px rgba(255, 98, 0, 0.4)',
                        }
                      }}
                    >
                      {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </Box>
                )}
              </Formik>
              

            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

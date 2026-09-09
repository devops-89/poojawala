'use client';
import { Box, Button, Container, Grid, Link as MuiLink, Paper, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { sendOtpAPI } from '@/api/userControllers';
import { MuiTelInput } from 'mui-tel-input';

const emailTldRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co\.in|info|biz|io|co|us|uk|ca|au)$/i;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .matches(emailTldRegex, 'Please enter a valid email address with a valid TLD (e.g. .com, .in)')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  dob: Yup.date().required('Date of birth is required'),
  birthPlace: Yup.string().required('Birth place is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

export default function SignUpContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

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
      {/* Background Decor */}
      <Box 
        component="img"
        src="/images/home/chakra.png"
        alt="Chakra Decor Left"
        sx={{
          position: 'absolute',
          top: -150,
          left: -150,
          width: '500px',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <Box 
        component="img"
        src="/images/home/chakraright.png"
        alt="Chakra Decor Right"
        sx={{
          position: 'absolute',
          bottom: -150,
          right: -150,
          width: '500px',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 0 } }}>
        <Grid container spacing={0} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 12, lg: 11 }}>
            <Paper 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                borderRadius: '24px', 
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid #FFE0D0'
              }}
            >
              {/* Left Side Branding */}
              <Box 
                sx={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #FF6200 0%, #FF9100 100%)',
                  p: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, mb: 2 }}>
                  Join Us!
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', lineHeight: 1.6, opacity: 0.9, mb: 4 }}>
                  Create an account to manage your puja bookings, view upcoming appointments, and consult with our verified Pandits seamlessly.
                </Typography>
                <Box component="img" src="/images/home/poojaPackages/dhanush.png" sx={{ width: '250px', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
              </Box>

              {/* Right Side Form */}
              <Box sx={{ flex: 1.4, p: { xs: 3, md: 5 }, bgcolor: '#fff' }}>
                <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Create an Account
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', mb: 4 }}>
                  Please Enter your Details.
                </Typography>

                <Formik
                  initialValues={{ firstName: '', lastName: '', email: '', phone: '', dob: '', birthPlace: '', password: '', confirmPassword: '' }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const res = await sendOtpAPI({ phone: values.phone, email: values.email, role: 'CUSTOMER' });
                      if (res.success || res.statusCode === 200) {
                        sessionStorage.setItem('signupData', JSON.stringify(values));
                        showSnackbar('OTP sent successfully!', 'success');
                        router.push('/verify-otp');
                      } else {
                        showSnackbar(res.message || 'Failed to send OTP', 'error');
                      }
                    } catch (error: any) {
                      showSnackbar(error?.response?.data?.message || error.message || 'Failed to send OTP', 'error');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Box component={Form}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="firstName">
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth 
                                label="First Name" 
                                variant="outlined" 
                                margin="dense"
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                                  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="lastName">
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth 
                                label="Last Name" 
                                variant="outlined" 
                                margin="dense"
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                                  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="email">
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth 
                                label="Email Address" 
                                variant="outlined" 
                                margin="dense"
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                                  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="phone">
                            {({ field, form, meta }: any) => (
                              <MuiTelInput
                                fullWidth 
                                label="Phone Number" 
                                name="phone"
                                variant="outlined" 
                                margin="dense"
                                defaultCountry="IN"
                                value={field.value ? '+91' + field.value : ''} 
                                onChange={(newValue, info) => {
                                  const natNum = info.nationalNumber || '';
                                  const cleanNum = natNum.replace(/\D/g, '').slice(0, 10);
                                  form.setFieldValue('phone', cleanNum);
                                }}
                                onKeyDown={(e) => {
                                  if (field.value && field.value.length >= 10) {
                                    if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                      e.preventDefault();
                                    }
                                  }
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                                  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="dob">
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth 
                                type="date"
                                label="Date of Birth" 
                                variant="outlined" 
                                margin="dense"
                                slotProps={{ inputLabel: { shrink: true } }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                                  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="birthPlace">
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth 
                                label="Place of Birth" 
                                variant="outlined" 
                                margin="dense"
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                                  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="password">
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth 
                                label="Password" 
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined" 
                                margin="dense"
                                slotProps={{
                                  input: {
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowPassword(!showPassword)}
                                          edge="end"
                                        >
                                          {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                                  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="confirmPassword">
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth 
                                label="Confirm Password" 
                                type={showConfirmPassword ? 'text' : 'password'}
                                variant="outlined" 
                                margin="dense"
                                slotProps={{
                                  input: {
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                          edge="end"
                                        >
                                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ 
                                  mb: 3,
                                  '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                                  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                                }}
                              />
                            )}
                          </Field>
                        </Grid>
                      </Grid>

                      <Button 
                        type="submit"
                        fullWidth 
                        disabled={isSubmitting}
                        variant="contained" 
                        sx={{
                          mt: 1,
                          background: '#FF6200',
                          color: 'white',
                          py: 1.5,
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
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                      </Button>
                    </Box>
                  )}
                </Formik>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', textAlign: 'center', mt: 4, fontSize: '14px' }}>
                  Already have an account?{' '}
                  <Link href="/sign-in" style={{ color: '#FF6200', fontWeight: 700, textDecoration: 'none' }}>
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


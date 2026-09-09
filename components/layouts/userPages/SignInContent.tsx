'use client';
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, Link as MuiLink, Paper, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useState } from 'react';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { loginAPI, getMeAPI } from '@/api/authControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function SignInContent() {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [showPassword, setShowPassword] = useState(false);

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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 10 }}>
        <Grid container spacing={0} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 10, lg: 8 }}>
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
                  Welcome Back!
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', lineHeight: 1.6, opacity: 0.9, mb: 4 }}>
                  Sign in to manage your puja bookings, view upcoming appointments, and consult with our verified Pandits.
                </Typography>
                <Box component="img" src="/images/home/poojaPackages/dhanush.png" sx={{ width: '250px', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
              </Box>

              {/* Right Side Form */}
              <Box sx={{ flex: 1.2, p: { xs: 4, md: 6 }, bgcolor: '#fff' }}>
                <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Sign In
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', mb: 4 }}>
                  Please Enter your Details.
                </Typography>

                <Formik
                  initialValues={{ email: '', password: '', rememberMe: false }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const response = await loginAPI({ email: values.email, password: values.password });
                      if (response.success) {
                        const token = response.tokens?.access?.token || response.token || response.accessToken;
                        const meResponse = await getMeAPI(token);
                        const userObj = meResponse?.user || meResponse?.data || meResponse || response.user;
                        sessionStorage.setItem('user', JSON.stringify(userObj));
                        if (response.csrfToken) {
                          sessionStorage.setItem('csrfToken', response.csrfToken);
                        }
                        showSnackbar('Login successful!', 'success');
                        
                        setTimeout(() => {
                          if (userObj?.role === 'CUSTOMER') {
                            router.push('/customer/dashboard');
                          } else {
                            router.push('/');
                          }
                        }, 1000);
                      }
                    } catch (error: any) {
                      console.error('Login failed', error);
                      showSnackbar(error.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Box component={Form}>
                      <Field name="email">
                        {({ field, meta }: any) => (
                          <TextField
                            {...field}
                            fullWidth 
                            label="Email" 
                            variant="outlined" 
                            margin="normal"
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
                      
                      <Field name="password">
                        {({ field, meta }: any) => (
                          <TextField
                            {...field}
                            fullWidth 
                            label="Password" 
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined" 
                            margin="normal"
                            slotProps={{ 
                              inputLabel: { shrink: true },
                              input: {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={() => setShowPassword(!showPassword)}
                                      edge="end"
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }
                            }}
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                            sx={{ 
                              mb: 1,
                              '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                              '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' }
                            }}
                          />
                        )}
                      </Field>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <FormControlLabel 
                          control={<Field as={Checkbox} name="rememberMe" size="small" sx={{ color: '#FF6200', '&.Mui-checked': { color: '#FF6200' } }}/>} 
                          label={<Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#555' }}>Remember me</Typography>} 
                        />
                        <MuiLink component={Link} href="/forgot-password?redirect=/sign-in" underline="hover" sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#FF6200', fontWeight: 600 }}>
                          Forgot Password?
                        </MuiLink>
                      </Box>

                      <Button 
                        type="submit"
                        fullWidth 
                        disabled={isSubmitting}
                        variant="contained" 
                        sx={{
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
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </Box>
                  )}
                </Formik>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', textAlign: 'center', mt: 4, fontSize: '14px' }}>
                  Don't have an account?{' '}
                  <Link href="/sign-up" style={{ color: '#FF6200', fontWeight: 700, textDecoration: 'none' }}>
                    Sign Up
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

'use client';
import React, { useState } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, Divider, Snackbar, Alert, InputAdornment, IconButton, Link as MuiLink } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAPI, getMeAPI } from '@/api/authControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

export default function PortalLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
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
          
          if (userObj?.role === 'PUROHIT' && userObj?.isAdminCreated) {
            setTimeout(() => router.push('/purohit/register?step=2'), 1000);
          } else {
            setTimeout(() => router.push('/purohit/dashboard'), 1000);
          }
        }
      } catch (error: any) {
        showSnackbar(error.response?.data?.message || 'Invalid credentials', 'error');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFFDF9' }}>
      {/* Simple Header */}
      <Box sx={{ p: 2.5, textAlign: 'center', borderBottom: '1px solid #FFE0D0', bgcolor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <MuiLink component={NextLink} href="/" underline="none" sx={{ display: 'inline-flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src="/images/logo.png"
            alt="Poojawala"
            sx={{ height: { xs: '45px', md: '55px' }, objectFit: 'contain', mb: 0.5 }}
          />
        </MuiLink>
        <Typography sx={{ color: '#666', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 500, fontSize: '14px' }}>
          Purohit Partner Portal
        </Typography>
      </Box>

      <Container maxWidth="sm" sx={{ py: 2, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid #eee', width: '100%' }}>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1, textAlign: 'center' }}>
            Welcome Back
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 3, textAlign: 'center' }}>
            Login to manage your bookings and profile
          </Typography>

          <form onSubmit={formik.handleSubmit} noValidate>
            <TextField 
              fullWidth 
              id="email"
              name="email"
              label="Email Address"
              type="email" 
              variant="outlined" 
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
            />
            <TextField 
              fullWidth 
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined" 
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Typography component={NextLink} href="/forgot-password?redirect=/purohit" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', color: '#FF6200', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Forgot Password?
              </Typography>
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{ 
                background: isLoading ? '#4CAF50' : '#FF6200', 
                color: 'white', 
                textTransform: 'none', 
                fontWeight: 700, 
                borderRadius: '30px', 
                py: 1.5,
                fontSize: '16px',
                boxShadow: 'none',
                '&:hover': { background: '#F05A00', boxShadow: 'none' },
                '&.Mui-disabled': {
                  background: '#4CAF50',
                  color: 'white',
                }
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Divider sx={{ my: 3, color: '#999', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px' }}>OR</Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 2 }}>
              Don't have a partner account?
            </Typography>
            <Button
              component={NextLink}
              href="/purohit/register"
              variant="contained"
              fullWidth
              sx={{ 
                background: '#FF6200', 
                color: 'white', 
                textTransform: 'none', 
                fontWeight: 700, 
                borderRadius: '30px', 
                py: 1.5,
                fontSize: '16px',
                boxShadow: 'none',
                '&:hover': { background: '#F05A00', boxShadow: 'none' } 
              }}
            >
              Register as a Purohit
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

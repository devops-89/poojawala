'use client';
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
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

export default function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbarStore();

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
          sessionStorage.setItem('user', JSON.stringify(meResponse?.user || meResponse?.data || meResponse || response.user));
          if (response.csrfToken) {
            sessionStorage.setItem('csrfToken', response.csrfToken);
          }
          showSnackbar('Admin login successful!', 'success');
          setTimeout(() => router.push('/admin/dashboard'), 1000);
        } else {
          showSnackbar(response.message || 'Login failed', 'error');
        }
      } catch (error: any) {
        showSnackbar(error.response?.data?.message || 'Invalid credentials', 'error');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F4F6F8', p: 2 }}>
      <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, maxWidth: 450, width: '100%', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: 'rgba(255, 98, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 32, color: '#FF6200' }} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1, textAlign: 'center' }}>
            Admin Control
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', textAlign: 'center' }}>
            Sign in to manage the Poojawala platform.
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth 
            id="email"
            name="email"
            label="Admin Email" 
            variant="outlined" 
            margin="normal"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': { 
                fontFamily: 'var(--font-outfit), sans-serif',
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6200',
                }
              },
              '& .MuiInputLabel-root': { 
                fontFamily: 'var(--font-outfit), sans-serif',
                '&.Mui-focused': {
                  color: '#FF6200',
                }
              }
            }}
          />

          <TextField
            fullWidth 
            id="password"
            name="password"
            label="Password" 
            type={showPassword ? 'text' : 'password'}
            variant="outlined" 
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ 
              mb: 4,
              '& .MuiOutlinedInput-root': { 
                fontFamily: 'var(--font-outfit), sans-serif',
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6200',
                }
              },
              '& .MuiInputLabel-root': { 
                fontFamily: 'var(--font-outfit), sans-serif',
                '&.Mui-focused': {
                  color: '#FF6200',
                }
              }
            }}
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
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Typography component={NextLink} href="/forgot-password?redirect=/admin" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', color: '#FF6200', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Forgot Password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            variant="contained"
            sx={{
              background: '#FF6200',
              border: '2px solid #FF6200',
              color: '#fff',
              py: 1.5,
              borderRadius: '30px',
              fontFamily: 'var(--font-outfit), sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(255, 98, 0, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                background: '#F05A00', 
                borderColor: '#F05A00',
                boxShadow: '0 4px 14px rgba(255, 98, 0, 0.4)' 
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 98, 0, 0.6)',
                borderColor: 'rgba(255, 98, 0, 0.0)',
                color: '#fff',
              }
            }}
          >
            {isLoading ? 'Logging in...' : 'Secure Login'}
          </Button>
        </form>

      </Paper>
    </Box>
  );
}

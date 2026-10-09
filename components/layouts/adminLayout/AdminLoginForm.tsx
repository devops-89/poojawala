'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { loginAPI, getMeAPI } from '@/api/authControllers';
import { extractRoleCsrfToken, saveRoleCsrfToken } from '@/api/config';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { extractBackendErrorMessage } from '@/utils/helpers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

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

  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'SUPERADMIN') {
          router.replace('/admin/dashboard');
        }
      } catch (e) {}
    }
  }, [router]);

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
        if (response.success || response.token || response.accessToken || response.poojawalaAdminCsrfToken) {
          const token = response.tokens?.access?.token || response.token || response.accessToken;
          let userObj = response.user || response.data?.user;
          if (token) {
            try {
              const meResponse = await getMeAPI(token);
              userObj = meResponse?.user || meResponse?.data || meResponse || userObj;
            } catch (err) {
              console.warn("getMeAPI notice:", err);
            }
          }
          if (userObj) {
            sessionStorage.setItem('user', JSON.stringify(userObj));
          }
          const csrf = extractRoleCsrfToken(response, userObj?.role || "ADMIN");

          if (csrf) {
            saveRoleCsrfToken(csrf, userObj?.role || "ADMIN");
          }
          showSnackbar('Admin login successful!', 'success');
          router.replace('/admin/dashboard');
        } else {
          const rawMsg = response?.message;
          const finalMsg =
            !rawMsg ||
            rawMsg.toLowerCase() === "validation failed" ||
            rawMsg.toLowerCase() === "bad request"
              ? "Invalid email or password"
              : rawMsg;
          showSnackbar(finalMsg, 'error');
        }
      } catch (error: any) {
        const rawMsg = extractBackendErrorMessage(error, 'Invalid email or password');
        const finalMsg =
          !rawMsg ||
          rawMsg.toLowerCase() === "validation failed" ||
          rawMsg.toLowerCase() === "bad request"
            ? "Invalid email or password"
            : rawMsg;
        showSnackbar(finalMsg, 'error');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(
        Object.keys(errors).reduce((acc: any, key: string) => {
          acc[key] = true;
          return acc;
        }, {})
      );
      const firstMsg = Object.values(errors)[0] as string || 'Please fill in all mandatory fields';
      showSnackbar(firstMsg, 'error');
    } else {
      formik.handleSubmit(e);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F4F6F8', p: 2 }}>
      
      <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, maxWidth: 450, width: '100%', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: 'rgba(255, 98, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 32, color: COLORS.PRIMARY }} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: FONTS.OUTFIT_ONLY, fontWeight: 800, color: COLORS.CHARCOAL_DARK, mb: 1, textAlign: 'center' }}>
            Admin Control
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT_ONLY, color: COLORS.SLATE_MUTED, textAlign: 'center' }}>
            Sign in to manage the Poojawala platform.
          </Typography>
        </Box>

        <form onSubmit={handleFormSubmit} noValidate>
          <TextField
            fullWidth 
            id="email"
            name="email"
            label="Admin Email *" 
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
                fontFamily: FONTS.OUTFIT_ONLY,
                '&.Mui-focused fieldset': {
                  borderColor: COLORS.PRIMARY,
                }
              },
              '& .MuiInputLabel-root': { 
                fontFamily: FONTS.OUTFIT_ONLY,
                '&.Mui-focused': {
                  color: COLORS.PRIMARY,
                }
              }
            }}
          />

          <TextField
            fullWidth 
            id="password"
            name="password"
            label="Password *" 
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
                fontFamily: FONTS.OUTFIT_ONLY,
                '&.Mui-focused fieldset': {
                  borderColor: COLORS.PRIMARY,
                }
              },
              '& .MuiInputLabel-root': { 
                fontFamily: FONTS.OUTFIT_ONLY,
                '&.Mui-focused': {
                  color: COLORS.PRIMARY,
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
            <Typography component={NextLink} href="/forgot-password?redirect=/admin" sx={{ fontFamily: FONTS.OUTFIT_ONLY, fontSize: '14px', color: COLORS.PRIMARY, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Forgot Password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            variant="contained"
            sx={{
              background: COLORS.PRIMARY,
              border: `2px solid ${COLORS.PRIMARY}`,
              color: '#fff',
              py: 1.5,
              borderRadius: '30px',
              fontFamily: FONTS.OUTFIT_ONLY,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(255, 98, 0, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                background: COLORS.PRIMARY_HOVER, 
                borderColor: COLORS.PRIMARY_HOVER,
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

          <Box sx={{ mt: 2 }}>
            <Button
              component={NextLink}
              href="/"
              fullWidth
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                py: 1.2,
                borderRadius: '30px',
                borderColor: '#e2e8f0',
                color: '#475569',
                fontFamily: FONTS.OUTFIT_ONLY,
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#FFF0E6',
                  color: COLORS.PRIMARY,
                  borderColor: COLORS.PRIMARY,
                },
              }}
            >
              Go to Website
            </Button>
          </Box>
        </form>

      </Paper>
    </Box>
  );
}

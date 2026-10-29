'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, InputAdornment, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
import { useUserStore } from '@/stores/userStore';
import {
  extractBackendErrorMessage,
  allowOnlyEmailCharsOnKeyDown,
  sanitizeEmailInput,
  EMAIL_STRICT_REGEX,
  EMAIL_STRICT_MESSAGE,
} from '@/utils/helpers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE)
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
      } catch (e) { }
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
        useUserStore.getState().clearProfile();
        if (typeof window !== "undefined") {
          sessionStorage.clear();
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          localStorage.removeItem("activeRole");
        }

        const response = await loginAPI({ email: values.email, password: values.password });
        if (response.success || response.token || response.accessToken || response.poojawalaAdminCsrfToken) {
          const token = response.tokens?.access?.token || response.token || response.accessToken;
          let userObj = response.user || response.data?.user || response?.data;
          try {
            const meResponse = await getMeAPI(token);
            const freshUser = meResponse?.user || meResponse?.data?.user || meResponse?.data || meResponse;
            if (freshUser && typeof freshUser === "object" && (freshUser.id || freshUser.email || freshUser.role)) {
              userObj = freshUser;
            }
          } catch (err) {
            console.warn("getMeAPI notice:", err);
          }
          if (userObj) {
            sessionStorage.setItem('user', JSON.stringify(userObj));
            useUserStore.getState().setProfile(userObj);
          }
          const adminRole = userObj?.role || "ADMIN";
          sessionStorage.setItem('role', adminRole);
          sessionStorage.setItem('activeRole', adminRole);
          const csrf = extractRoleCsrfToken(response, adminRole);

          if (csrf) {
            saveRoleCsrfToken(csrf, adminRole);
          }
          showSnackbar('Admin login successful!', 'success');
          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 300);
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
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: 'url(/images/adminBg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        position: 'relative',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, sm: 4.5, md: 5 },
          maxWidth: 450,
          width: '100%',
          borderRadius: '24px',
          bgcolor: '#FFFFFF',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header Icon & Title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3.5 }}>
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: '16px',
              bgcolor: '#FFF0E6',
              border: '1px solid #FFE0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 28, color: '#EA580C' }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT_ONLY,
              fontWeight: 800,
              color: '#0f172a',
              fontSize: { xs: '24px', sm: '26px' },
              letterSpacing: '-0.02em',
              mb: 0.6,
              textAlign: 'center',
            }}
          >
            Admin Control
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT_ONLY,
              color: '#64748b',
              fontSize: '13.5px',
              fontWeight: 400,
              textAlign: 'center',
            }}
          >
            Sign in to manage the 1Pooja platform.
          </Typography>
        </Box>

        <form
          onSubmit={handleFormSubmit}
          noValidate
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLElement;
              if (target.tagName?.toLowerCase() === 'textarea') return;
              e.preventDefault();
              handleFormSubmit(e as any);
            }
          }}
        >
          {/* Email Address */}
          <Box sx={{ mb: 2.2 }}>
            <Typography
              component="label"
              htmlFor="email"
              sx={{
                display: 'block',
                fontFamily: FONTS.OUTFIT_ONLY,
                fontSize: '13px',
                fontWeight: 600,
                color: '#475569',
                mb: 0.8,
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="abcd12@yopmail.com"
              type="email"
              value={formik.values.email}
              onKeyDown={allowOnlyEmailCharsOnKeyDown}
              onChange={(e) => {
                formik.setFieldValue('email', sanitizeEmailInput(e.target.value));
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ fontSize: 19, color: '#94a3b8', ml: 0.5 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: FONTS.OUTFIT_ONLY,
                  fontSize: '14.5px',
                  color: '#1e293b',
                  bgcolor: '#FAF5F0',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#EFE5DC',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D8C7B8',
                  },
                  '&.Mui-focused': {
                    bgcolor: '#FFFFFF',
                    '& fieldset': {
                      borderColor: '#EA580C',
                      borderWidth: '1.5px',
                    },
                  },
                  '&.Mui-error fieldset': {
                    borderColor: '#EF4444',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.4,
                  '&::placeholder': {
                    color: '#94a3b8',
                    opacity: 0.8,
                  },
                },
              }}
            />
          </Box>

          {/* Password */}
          <Box sx={{ mb: 1 }}>
            <Typography
              component="label"
              htmlFor="password"
              sx={{
                display: 'block',
                fontFamily: FONTS.OUTFIT_ONLY,
                fontSize: '13px',
                fontWeight: 600,
                color: '#475569',
                mb: 0.8,
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              id="password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ fontSize: 19, color: '#94a3b8', ml: 0.5 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#94a3b8', mr: 0.5 }}
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: FONTS.OUTFIT_ONLY,
                  fontSize: '14.5px',
                  color: '#1e293b',
                  bgcolor: '#FAF5F0',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#EFE5DC',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D8C7B8',
                  },
                  '&.Mui-focused': {
                    bgcolor: '#FFFFFF',
                    '& fieldset': {
                      borderColor: '#EA580C',
                      borderWidth: '1.5px',
                    },
                  },
                  '&.Mui-error fieldset': {
                    borderColor: '#EF4444',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.4,
                  '&::placeholder': {
                    color: '#94a3b8',
                    opacity: 0.8,
                  },
                },
              }}
            />
          </Box>

          {/* Forgot Password Link */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Typography
              component={NextLink}
              href="/forgot-password?redirect=/admin"
              sx={{
                fontFamily: FONTS.OUTFIT_ONLY,
                fontSize: '13px',
                color: '#EA580C',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&:hover': { textDecoration: 'underline', color: '#C2410C' },
              }}
            >
              Forgot Password?
            </Typography>
          </Box>

          {/* Secure Login Button */}
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
            sx={{
              background: 'linear-gradient(90deg, #F97316 0%, #EA580C 100%)',
              color: '#fff',
              py: 1.35,
              borderRadius: '24px',
              fontFamily: FONTS.OUTFIT_ONLY,
              fontWeight: 700,
              fontSize: '15px',
              textTransform: 'none',
              boxShadow: '0 6px 18px rgba(234, 88, 12, 0.35)',
              transition: 'all 0.25s ease',
              '&:hover': {
                background: 'linear-gradient(90deg, #EA580C 0%, #C2410C 100%)',
                boxShadow: '0 8px 24px rgba(234, 88, 12, 0.45)',
                transform: 'translateY(-1px)',
              },
              '&.Mui-disabled': {
                background: 'rgba(234, 88, 12, 0.6)',
                color: '#fff',
              },
            }}
          >
            {isLoading ? 'Logging in...' : 'Secure Login'}
          </Button>

          {/* Go to Website Button */}
          <Box sx={{ mt: 1.8 }}>
            <Button
              component={NextLink}
              href="/"
              fullWidth
              startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
              sx={{
                py: 1.2,
                borderRadius: '24px',
                border: '1.5px solid #F0E3D8',
                bgcolor: '#FAF5F0',
                color: '#334155',
                fontFamily: FONTS.OUTFIT_ONLY,
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#FFF0E6',
                  color: '#EA580C',
                  borderColor: '#EA580C',
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


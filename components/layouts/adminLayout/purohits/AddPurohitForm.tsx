'use client';

import { addPurohitByAdminAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Breadcrumbs, Button, Divider, Paper, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

const today = new Date();
const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
const maxDobDate = `${twentyYearsAgo.getFullYear()}-${String(twentyYearsAgo.getMonth() + 1).padStart(2, '0')}-${String(twentyYearsAgo.getDate()).padStart(2, '0')}`;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required').trim(),
  lastName: Yup.string().required('Last name is required').trim(),
  email: Yup.string().email('Invalid email format').nullable(),
  mobileNumber: Yup.string().required('Mobile Number is required').test('is-valid-tel', 'Invalid phone number', function (value) {
    if (!value) return false;
    const combined = this.parent.countryCode ? this.parent.countryCode + value : value;
    return matchIsValidTel(combined);
  }),
  dob: Yup.date().max(twentyYearsAgo, 'Date of birth must be at least 20 years ago').required('Date of Birth is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').trim(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

export default function AddPurohitForm() {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      countryCode: '+91',
      dob: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload: any = {
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
        };
        
        if (values.email) payload.email = values.email;
        if (values.mobileNumber) {
          payload.phone = values.mobileNumber;
          payload.countryCode = values.countryCode;
        }
        if (values.dob) payload.dob = values.dob;

        const response = await addPurohitByAdminAPI(payload);
        
        if (response.success) {
          showSnackbar('Purohit onboarded successfully', 'success');
          router.push('/admin/purohits');
        } else {
          showSnackbar(response.message || 'Failed to onboard purohit', 'error');
        }
      } catch (error: any) {
        showSnackbar(error.response?.data?.message || 'Error onboarding purohit', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
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

  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <NextLink href="/admin/purohits" style={{ textDecoration: 'none', color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '14px' }}>
            Purohits
          </NextLink>
          <Typography sx={{ color: '#FF6200', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '14px' }}>
            Onboard Purohit
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Onboard New Purohit
        </Typography>
        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
          Fill in the details to register a new Purohit on the platform.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
        <Grid container spacing={4}>
          {/* Row 1: First Name & Last Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              fullWidth name="firstName" label="First Name" variant="outlined" 
              value={values.firstName} onChange={handleChange} onBlur={handleBlur}
              error={touched.firstName && Boolean(errors.firstName)} helperText={touched.firstName && errors.firstName}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              fullWidth name="lastName" label="Last Name" variant="outlined" 
              value={values.lastName} onChange={handleChange} onBlur={handleBlur}
              error={touched.lastName && Boolean(errors.lastName)} helperText={touched.lastName && errors.lastName}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
            />
          </Grid>

          {/* Row 2: Mobile Number & Date of Birth */}
          <Grid size={{ xs: 12, md: 6 }}>
            <MuiTelInput 
              fullWidth 
              name="mobileNumber" 
              label="Mobile Number" 
              variant="outlined" 
              defaultCountry="IN"
              value={values.countryCode ? values.countryCode + values.mobileNumber : values.mobileNumber} 
              onChange={(newValue, info) => {
                formik.setFieldValue('countryCode', '+' + (info.countryCallingCode || '91'));
                formik.setFieldValue('mobileNumber', info.nationalNumber || '');
              }} 
              error={touched.mobileNumber && Boolean(errors.mobileNumber)} 
              helperText={touched.mobileNumber && errors.mobileNumber as string} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              fullWidth name="dob" label="Date of Birth" type="date" variant="outlined" 
              value={values.dob} onChange={handleChange} onBlur={handleBlur} 
              error={touched.dob && Boolean(errors.dob)} helperText={touched.dob && errors.dob as string} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: maxDobDate } }} 
            />
          </Grid>

          {/* Row 3: Email Address (Full Width) */}
          <Grid size={{ xs: 12 }}>
            <TextField 
              fullWidth name="email" label="Email Address" variant="outlined" type="email"
              value={values.email} onChange={handleChange} onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)} helperText={touched.email && errors.email}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
            />
          </Grid>

          {/* Row 4: Password & Confirm Password */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              fullWidth name="password" label="Password" variant="outlined" type={showPassword ? 'text' : 'password'}
              value={values.password} onChange={handleChange} onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)} helperText={touched.password && errors.password as string}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              fullWidth name="confirmPassword" label="Confirm Password" variant="outlined" type={showConfirmPassword ? 'text' : 'password'}
              value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)} helperText={touched.confirmPassword && errors.confirmPassword as string}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            type="submit"
            disabled={isSubmitting}
            sx={{ background: '#FF6200', color: 'white', px: 4, py: 1.5, borderRadius: '30px', textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { background: '#F05A00', boxShadow: 'none' } }}
          >
            {isSubmitting ? 'Onboarding...' : 'Onboard Purohit'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

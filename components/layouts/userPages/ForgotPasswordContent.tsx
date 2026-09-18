'use client';
import { Box, Button, Container, Grid, Paper, TextField, Typography, IconButton } from '@mui/material';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { forgotPasswordAPI } from '@/api/authControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
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
                  Forgot Password
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', mb: 4, textAlign: 'center' }}>
                Enter your email address to receive an OTP.
              </Typography>

              <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const response = await forgotPasswordAPI({ email: values.email });
                    if (response.success || response.statusCode === 200) {
                      showSnackbar('OTP sent successfully!', 'success');
                      setTimeout(() => router.push(`/reset-password?email=${encodeURIComponent(values.email)}&redirect=${encodeURIComponent(redirect)}`), 1000);
                    }
                  } catch (error: any) {
                    console.error('Forgot password failed', error);
                    showSnackbar(error.response?.data?.message || 'Failed to send OTP. Please try again.', 'error');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Box component={Form}>
                    <FormikValidationSnackbar />
                    <Field name="email">
                      {({ field, meta }: any) => (
                        <TextField
                          {...field}
                          fullWidth 
                          label="Email" 
                          variant="outlined" 
                          margin="normal"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
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
                      {isSubmitting ? 'Sending...' : 'Send OTP'}
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

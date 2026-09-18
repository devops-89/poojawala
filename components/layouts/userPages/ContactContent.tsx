'use client';
import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import { submitContactFormAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
    .required('Name is required'),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|co\.in|edu|gov|io)$/i,
      'Invalid email format. Must end with a valid domain (e.g., .com, .in)'
    )
    .required('Email is required'),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject cannot exceed 100 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
    .required('Message is required'),
});

export default function ContactContent() {
  const [success, setSuccess] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  return (
    <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh', position: 'relative' }}>
      
      {/* Hero Header */}
      <Box
        sx={{
          pt: 12,
          pb: 8,
          background: 'linear-gradient(135deg, #FF6200 0%, #FF9100 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Typography variant="h2" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Get in Touch
        </Typography>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '18px', opacity: 0.9, maxWidth: '600px', mx: 'auto', px: 2 }}>
          Have questions about our puja packages, purohits, or anything else? We'd love to hear from you.
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ position: 'relative', mt: 4, mb: 10, zIndex: 2 }}>
        <Paper 
          sx={{ 
            borderRadius: '24px', 
            overflow: 'hidden', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Contact Details (Left Column) */}
          <Box sx={{ flex: 1, bgcolor: '#FFF0E6', p: { xs: 4, md: 6 } }}>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 4 }}>
              Contact Information
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
              <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '50%', color: '#FF6200', display: 'flex' }}>
                <PhoneIcon />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '14px', mb: 0.5 }}>Phone</Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1A1A1A', fontSize: '16px' }}>+91 98765 43210</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
              <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '50%', color: '#FF6200', display: 'flex' }}>
                <EmailIcon />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '14px', mb: 0.5 }}>Email</Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1A1A1A', fontSize: '16px' }}>support@poojawala.com</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '50%', color: '#FF6200', display: 'flex' }}>
                <LocationOnIcon />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '14px', mb: 0.5 }}>Office Address</Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1A1A1A', fontSize: '16px' }}>123, Devotion Tower,<br/>Sector 4, New Delhi - 110001</Typography>
              </Box>
            </Box>
          </Box>

          {/* Contact Form (Right Column) */}
          <Box sx={{ flex: 1.5, bgcolor: '#ffffff', p: { xs: 4, md: 6 } }}>
            {success ? (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Box component="img" src="/images/home/poojaPackages/dhanush.webp" sx={{ width: '120px', mb: 3 }} />
                <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Message Sent!
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666' }}>
                  Thank you for reaching out. Our team will get back to you shortly.
                </Typography>
                <Button 
                  onClick={() => setSuccess(false)}
                  sx={{ mt: 4, color: '#FF6200', fontWeight: 600, textTransform: 'none' }}
                >
                  Send another message
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Send a Message
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', mb: 4 }}>
                  Fill out the form below and we will get back to you as soon as possible.
                </Typography>

                <Formik
                  initialValues={{ name: '', email: '', subject: '', message: '' }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                      const response = await submitContactFormAPI({
                        name: values.name,
                        email: values.email,
                        subject: values.subject,
                        message: values.message,
                      });
                      
                      if (response.success) {
                        setSuccess(true);
                        showSnackbar('Message sent successfully!', 'success');
                        resetForm();
                      } else {
                        showSnackbar(response.message || 'Failed to send message', 'error');
                      }
                    } catch (error: any) {
                      showSnackbar(error.response?.data?.message || 'Error sending message', 'error');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, touched, errors }) => (
                    <Box component={Form}>
                      <FormikValidationSnackbar />
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field 
                            as={TextField} name="name" fullWidth label="Full Name" variant="outlined"
                            error={touched.name && !!errors.name} helperText={touched.name && errors.name}
                            sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' }, '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field 
                            as={TextField} name="email" fullWidth label="Email Address" variant="outlined"
                            error={touched.email && !!errors.email} helperText={touched.email && errors.email}
                            sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' }, '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Field 
                            as={TextField} name="subject" fullWidth label="Subject" variant="outlined"
                            error={touched.subject && !!errors.subject} helperText={touched.subject && errors.subject}
                            sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' }, '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Field 
                            as={TextField} name="message" fullWidth label="Your Message" variant="outlined" multiline rows={4}
                            error={touched.message && !!errors.message} helperText={touched.message && errors.message}
                            sx={{ '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' }, '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' } }}
                          />
                        </Grid>
                      </Grid>

                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        variant="contained" 
                        sx={{
                          mt: 4,
                          background: '#FF6200',
                          color: 'white',
                          py: 1.5,
                          px: 5,
                          borderRadius: '31px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '16px',
                          boxShadow: '0 8px 20px rgba(255, 98, 0, 0.3)',
                          '&:hover': { background: '#E65800', boxShadow: '0 8px 25px rgba(255, 98, 0, 0.4)' }
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Box>
                  )}
                </Formik>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

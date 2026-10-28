'use client';
import { Box, Button, Container, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { socialLinks } from '@/components/widgets/Footer';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import { submitContactFormAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';
import {
  allowOnlyEmailCharsOnKeyDown,
  sanitizeEmailInput,
  EMAIL_STRICT_REGEX,
  EMAIL_STRICT_MESSAGE,
  TITLE_STRICT_REGEX,
  TITLE_STRICT_MESSAGE,
  DESCRIPTION_STRICT_REGEX,
  DESCRIPTION_STRICT_MESSAGE,
  allowOnlyTitleCharsOnKeyDown,
  sanitizeTitleInput,
  allowOnlyDescriptionCharsOnKeyDown,
  sanitizeDescriptionInput,
} from '@/utils/helpers';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
    .required('Name is required'),
  email: Yup.string()
    .matches(EMAIL_STRICT_REGEX, EMAIL_STRICT_MESSAGE)
    .required('Email is required'),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject cannot exceed 100 characters')
    .matches(TITLE_STRICT_REGEX, TITLE_STRICT_MESSAGE)
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
    .matches(DESCRIPTION_STRICT_REGEX, DESCRIPTION_STRICT_MESSAGE)
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
        <Typography variant="h2" component="h1" sx={{ fontFamily: FONTS.DM_SANS, fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Get in Touch
        </Typography>
        <Typography sx={{ fontFamily: FONTS.DM_SANS, fontSize: '18px', opacity: 0.9, maxWidth: '600px', mx: 'auto', px: 2 }}>
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
            <Typography variant="h5" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 800, color: COLORS.CHARCOAL_DARK, mb: 4 }}>
              Contact Information
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
              <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '50%', color: COLORS.PRIMARY, display: 'flex' }}>
                <EmailIcon />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: COLORS.SLATE_MUTED, fontSize: '14px', mb: 0.5 }}>Email</Typography>
                <Typography
                  component="a"
                  href="mailto:info@1pooja.com"
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 600,
                    color: COLORS.CHARCOAL_DARK,
                    fontSize: '16px',
                    textDecoration: 'none',
                    display: 'block',
                    '&:hover': { color: COLORS.PRIMARY }
                  }}
                >
                  info@1pooja.com
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 4 }}>
              <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '50%', color: COLORS.PRIMARY, display: 'flex' }}>
                <LocationOnIcon />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: COLORS.SLATE_MUTED, fontSize: '14px', mb: 0.5 }}>Office Address</Typography>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: COLORS.CHARCOAL_DARK, fontSize: '16px' }}>123, Devotion Tower,<br/>Sector 4, New Delhi - 110001</Typography>
              </Box>
            </Box>

            <Box sx={{ pt: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, color: COLORS.SLATE_MUTED, fontSize: '14px', mb: 2, fontWeight: 600 }}>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    sx={{
                      bgcolor: 'white',
                      p: 1.2,
                      borderRadius: '50%',
                      color: COLORS.CHARCOAL_DARK,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: COLORS.PRIMARY,
                        color: 'white',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: '20px' }} />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Contact Form (Right Column) */}
          <Box sx={{ flex: 1.5, bgcolor: '#ffffff', p: { xs: 4, md: 6 } }}>
            {success ? (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Box component="img" src="/images/home/poojaPackages/dhanush.webp" sx={{ width: '120px', mb: 3 }} />
                <Typography variant="h5" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 800, color: COLORS.CHARCOAL_DARK, mb: 1 }}>
                  Message Sent!
                </Typography>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: COLORS.SLATE_MUTED }}>
                  Thank you for reaching out. Our team will get back to you shortly.
                </Typography>
                <Button 
                  onClick={() => setSuccess(false)}
                  sx={{ mt: 4, color: COLORS.PRIMARY, fontWeight: 600, textTransform: 'none' }}
                >
                  Send another message
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 800, color: COLORS.CHARCOAL_DARK, mb: 1 }}>
                  Send a Message
                </Typography>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: COLORS.SLATE_MUTED, mb: 4 }}>
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
                  {({ isSubmitting, touched, errors, submitForm }) => (
                    <Box
                      component={Form}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                          const target = e.target as HTMLElement;
                          if (target.tagName?.toLowerCase() === "textarea") return;
                          e.preventDefault();
                          submitForm();
                        }
                      }}
                    >
                      <FormikValidationSnackbar />
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field 
                            as={TextField} name="name" fullWidth label="Full Name" variant="outlined"
                            error={touched.name && !!errors.name} helperText={touched.name && errors.name}
                            sx={{ '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY }, '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field name="email">
                            {({ field, form, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Email Address"
                                variant="outlined"
                                type="email"
                                onKeyDown={allowOnlyEmailCharsOnKeyDown}
                                onChange={(e) => {
                                  form.setFieldValue("email", sanitizeEmailInput(e.target.value));
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY }, '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY } }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Field name="subject">
                            {({ field, form, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Subject"
                                variant="outlined"
                                onKeyDown={allowOnlyTitleCharsOnKeyDown}
                                onChange={(e) => {
                                  form.setFieldValue("subject", sanitizeTitleInput(e.target.value));
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY }, '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY } }}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Field name="message">
                            {({ field, form, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Your Message"
                                variant="outlined"
                                multiline
                                rows={4}
                                onKeyDown={allowOnlyDescriptionCharsOnKeyDown}
                                onChange={(e) => {
                                  form.setFieldValue("message", sanitizeDescriptionInput(e.target.value));
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={{ '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY }, '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY } }}
                              />
                            )}
                          </Field>
                        </Grid>
                      </Grid>

                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        variant="contained" 
                        sx={{
                          mt: 4,
                          background: COLORS.PRIMARY,
                          color: 'white',
                          py: 1.5,
                          px: 5,
                          borderRadius: '31px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '16px',
                          boxShadow: '0 8px 20px rgba(255, 98, 0, 0.3)',
                          '&:hover': { background: COLORS.PRIMARY_HOVER, boxShadow: '0 8px 25px rgba(255, 98, 0, 0.4)' }
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

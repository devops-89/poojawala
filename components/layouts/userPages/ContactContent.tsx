'use client';
import { Box, Button, Container, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
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

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: FONTS.OUTFIT,
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    fontSize: { xs: '14px', sm: '15px' },
    '& fieldset': {
      borderColor: '#E2E8F0',
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: '#CBD5E1',
    },
    '&.Mui-focused fieldset': {
      borderColor: COLORS.PRIMARY,
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: FONTS.OUTFIT,
    fontSize: { xs: '13.5px', sm: '14.5px' },
    color: '#64748B',
    '&.Mui-focused': {
      color: COLORS.PRIMARY,
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: FONTS.OUTFIT,
    fontSize: '11.5px',
  },
};

export default function ContactContent() {
  const [success, setSuccess] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  return (
    <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh', position: 'relative' }}>
      {/* Hero Header */}
      <Box
        sx={{
          pt: { xs: 5, sm: 6, md: 7 },
          pb: { xs: 4, sm: 5, md: 6 },
          background: 'linear-gradient(135deg, #FF6200 0%, #FF9100 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          px: 2,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            mb: { xs: 1, sm: 1.5 },
            fontSize: { xs: '1.85rem', sm: '2.4rem', md: '3.2rem' },
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          Get in Touch
        </Typography>

        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: { xs: '13.5px', sm: '15.5px', md: '16.5px' },
            fontWeight: 500,
            opacity: 0.95,
            maxWidth: '560px',
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Have questions about our pooja packages, purohits, or sacred rituals? We'd love to hear from you.
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          mt: { xs: 3.5, sm: 4, md: 5 },
          mb: { xs: 6, sm: 8, md: 10 },
          px: { xs: 2, sm: 3 },
          zIndex: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: '20px', sm: '24px' },
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1.5px solid #F1E5D8',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            bgcolor: '#FFFFFF',
          }}
        >
          {/* Contact Details (Left Column) */}
          <Box
            sx={{
              flex: { md: 1 },
              width: { xs: '100%', md: '38%' },
              bgcolor: '#FFF7F0',
              p: { xs: 2.8, sm: 3.5, md: 5 },
              borderRight: { md: '1.5px solid #F1E5D8' },
              borderBottom: { xs: '1.5px solid #F1E5D8', md: 'none' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  color: '#1A0B05',
                  fontSize: { xs: '19px', sm: '22px' },
                  mb: 1,
                  lineHeight: 1.25,
                }}
              >
                Contact Information
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#64748B',
                  fontSize: { xs: '13px', sm: '14px' },
                  lineHeight: 1.5,
                  mb: { xs: 3, sm: 4 },
                }}
              >
                Reach out to our devotee care team anytime for assistance with bookings and ceremonies.
              </Typography>

              {/* Email */}
              <Box sx={{ display: 'flex', gap: 1.8, mb: 3, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    bgcolor: '#FFFFFF',
                    p: 1.2,
                    borderRadius: '12px',
                    color: COLORS.PRIMARY,
                    display: 'flex',
                    boxShadow: '0 2px 10px rgba(255, 98, 0, 0.1)',
                    border: '1px solid #FFE4D6',
                    flexShrink: 0,
                  }}
                >
                  <EmailIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      color: '#94A3B8',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      mb: 0.3,
                    }}
                  >
                    Email
                  </Typography>
                  <Typography
                    component="a"
                    href="mailto:info@1pooja.com"
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      color: '#1E293B',
                      fontSize: { xs: '14.5px', sm: '15.5px' },
                      textDecoration: 'none',
                      wordBreak: 'break-word',
                      transition: 'color 0.2s ease',
                      '&:hover': { color: COLORS.PRIMARY },
                    }}
                  >
                    info@1pooja.com
                  </Typography>
                </Box>
              </Box>

              {/* Office Address */}
              <Box sx={{ display: 'flex', gap: 1.8, mb: 3, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    bgcolor: '#FFFFFF',
                    p: 1.2,
                    borderRadius: '12px',
                    color: COLORS.PRIMARY,
                    display: 'flex',
                    boxShadow: '0 2px 10px rgba(255, 98, 0, 0.1)',
                    border: '1px solid #FFE4D6',
                    flexShrink: 0,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      color: '#94A3B8',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      mb: 0.3,
                    }}
                  >
                    Office Address
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 600,
                      color: '#1E293B',
                      fontSize: { xs: '13.5px', sm: '14.5px' },
                      lineHeight: 1.5,
                    }}
                  >
                    123, Devotion Tower,<br />Sector 4, New Delhi - 110001
                  </Typography>
                </Box>
              </Box>

              {/* Working Hours */}
              <Box sx={{ display: 'flex', gap: 1.8, mb: 3, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    bgcolor: '#FFFFFF',
                    p: 1.2,
                    borderRadius: '12px',
                    color: COLORS.PRIMARY,
                    display: 'flex',
                    boxShadow: '0 2px 10px rgba(255, 98, 0, 0.1)',
                    border: '1px solid #FFE4D6',
                    flexShrink: 0,
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      color: '#94A3B8',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      mb: 0.3,
                    }}
                  >
                    Support Hours
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 600,
                      color: '#1E293B',
                      fontSize: { xs: '13.5px', sm: '14.5px' },
                      lineHeight: 1.5,
                    }}
                  >
                    Mon – Sun: 9:00 AM – 8:00 PM IST
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Social Links */}
            <Box sx={{ pt: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#64748B',
                  fontSize: '12px',
                  mb: 1.5,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    sx={{
                      bgcolor: '#FFFFFF',
                      p: 1,
                      borderRadius: '50%',
                      color: '#475569',
                      border: '1px solid #FFE4D6',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: COLORS.PRIMARY,
                        color: '#FFFFFF',
                        borderColor: COLORS.PRIMARY,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: '18px' }} />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Contact Form (Right Column) */}
          <Box
            sx={{
              flex: { md: 1.6 },
              width: { xs: '100%', md: '62%' },
              bgcolor: '#FFFFFF',
              p: { xs: 2.8, sm: 4, md: 5 },
            }}
          >
            {success ? (
              <Box
                sx={{
                  minHeight: { xs: '320px', md: '420px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 4,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    bgcolor: '#ECFDF5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <CheckCircleOutlinedIcon sx={{ fontSize: '36px', color: '#10B981' }} />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    color: '#1A0B05',
                    fontSize: { xs: '20px', sm: '24px' },
                    mb: 1,
                  }}
                >
                  Message Sent Successfully!
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: '#64748B',
                    fontSize: { xs: '14px', sm: '15px' },
                    maxWidth: '420px',
                    lineHeight: 1.6,
                  }}
                >
                  Thank you for reaching out to 1Pooja. Our devotee care team has received your message and will get back to you shortly.
                </Typography>
                <Button
                  onClick={() => setSuccess(false)}
                  startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    mt: 3.5,
                    color: COLORS.PRIMARY,
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    textTransform: 'none',
                    fontSize: '14px',
                    borderRadius: '20px',
                    px: 2.5,
                    py: 0.8,
                    border: '1px solid #FFD0B8',
                    bgcolor: '#FFF7F0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#FFE4D6',
                      borderColor: COLORS.PRIMARY,
                    },
                  }}
                >
                  Send another message
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    color: '#1A0B05',
                    fontSize: { xs: '19px', sm: '22px' },
                    mb: 0.6,
                    lineHeight: 1.25,
                  }}
                >
                  Send a Message
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: '#64748B',
                    fontSize: { xs: '13px', sm: '14px' },
                    mb: { xs: 3, sm: 3.5 },
                    lineHeight: 1.5,
                  }}
                >
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
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLElement;
                          if (target.tagName?.toLowerCase() === 'textarea') return;
                          e.preventDefault();
                          submitForm();
                        }
                      }}
                    >
                      <FormikValidationSnackbar />
                      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="name">
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Full Name *"
                                variant="outlined"
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={fieldSx}
                              />
                            )}
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field name="email">
                            {({ field, form, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Email Address *"
                                variant="outlined"
                                type="email"
                                onKeyDown={allowOnlyEmailCharsOnKeyDown}
                                onChange={(e) => {
                                  form.setFieldValue('email', sanitizeEmailInput(e.target.value));
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={fieldSx}
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
                                label="Subject *"
                                variant="outlined"
                                onKeyDown={allowOnlyTitleCharsOnKeyDown}
                                onChange={(e) => {
                                  form.setFieldValue('subject', sanitizeTitleInput(e.target.value));
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={fieldSx}
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
                                label="Your Message *"
                                variant="outlined"
                                multiline
                                rows={4}
                                onKeyDown={allowOnlyDescriptionCharsOnKeyDown}
                                onChange={(e) => {
                                  form.setFieldValue('message', sanitizeDescriptionInput(e.target.value));
                                }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                sx={fieldSx}
                              />
                            )}
                          </Field>
                        </Grid>
                      </Grid>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="contained"
                        endIcon={<SendIcon sx={{ fontSize: 17 }} />}
                        sx={{
                          mt: { xs: 3, sm: 3.5 },
                          background: 'linear-gradient(135deg, #FF6200 0%, #E64A00 100%)',
                          color: '#FFFFFF',
                          py: { xs: 1.3, sm: 1.4 },
                          px: { xs: 3.5, sm: 5 },
                          width: { xs: '100%', sm: 'auto' },
                          borderRadius: '31px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: { xs: '14.5px', sm: '15px' },
                          fontFamily: FONTS.OUTFIT,
                          boxShadow: '0 6px 18px rgba(255, 98, 0, 0.28)',
                          transition: 'all 0.25s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #E65500 0%, #CC3E00 100%)',
                            boxShadow: '0 8px 24px rgba(255, 98, 0, 0.4)',
                            transform: 'translateY(-1px)',
                          },
                          '&:disabled': {
                            background: '#E2E8F0',
                            color: '#94A3B8',
                          },
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

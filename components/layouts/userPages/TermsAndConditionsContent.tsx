'use client';

import { Box, Container, Typography, Divider, Paper, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

export default function TermsAndConditionsContent() {
  return (
    <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh', py: { xs: 3, sm: 5, md: 7 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: '16px', sm: '24px' },
            border: '1.5px solid #F1E5D8',
            bgcolor: '#FFFFFF',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
            p: { xs: 2.5, sm: 4, md: 5 },
          }}
        >
          {/* Header Title */}
          <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: '#1A0B05',
                fontSize: { xs: '24px', sm: '32px', md: '38px' },
                lineHeight: 1.25,
                mb: 1,
              }}
            >
              Terms & Conditions
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: '#64748B',
                fontSize: { xs: '12.5px', sm: '13.5px' },
                fontWeight: 500,
                mb: 1.5,
              }}
            >
              Last Updated: September 15, 2026
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: '#334155',
                fontSize: { xs: '14px', sm: '15.5px' },
                lineHeight: 1.7,
              }}
            >
              Welcome to 1Pooja. By accessing or using our website, services, or mobile applications, you agree to comply with and be bound by the following terms and conditions.
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 2.5, sm: 3.5 }, borderColor: '#F1E5D8' }} />

          {/* Body Sections */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 3.5 } }}>
            {/* Section 1 */}
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: '#1E293B',
                  fontSize: { xs: '17px', sm: '19px' },
                  mb: 1.2,
                }}
              >
                1. Acceptance of Terms
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                }}
              >
                By creating an account, booking a pooja, or registering as a Purohit partner on 1Pooja, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree with any part of these terms, please discontinue platform usage.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: '#F1E5D8' }} />

            {/* Section 2 */}
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: '#1E293B',
                  fontSize: { xs: '17px', sm: '19px' },
                  mb: 1.2,
                }}
              >
                2. Platform Services Description
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                }}
              >
                1Pooja acts as a digital marketplace connecting devotees with verified Pandits and Purohits for offline home rituals, online video poojas, and spiritual consultations. We facilitate scheduling, communication, and secure payment processing.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: '#F1E5D8' }} />

            {/* Section 3 */}
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: '#1E293B',
                  fontSize: { xs: '17px', sm: '19px' },
                  mb: 1.2,
                }}
              >
                3. User & Purohit Account Obligations
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: { xs: 2.5, sm: 3 },
                  m: 0,
                  color: '#475569',
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                  '& li': {
                    mb: 0.8,
                    '&:last-child': { mb: 0 },
                  },
                }}
              >
                <li>Users must provide accurate, current, and complete details during account creation and booking.</li>
                <li>Users are responsible for maintaining the security of their credentials.</li>
                <li>Purohits must submit valid credentials, identity verification documents, and adhere to agreed appointment schedules.</li>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#F1E5D8' }} />

            {/* Section 4 */}
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: '#1E293B',
                  fontSize: { xs: '17px', sm: '19px' },
                  mb: 1.2,
                }}
              >
                4. Bookings & Payments
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: { xs: 2.5, sm: 3 },
                  m: 0,
                  color: '#475569',
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                  '& li': {
                    mb: 0.8,
                    '&:last-child': { mb: 0 },
                  },
                }}
              >
                <li>All pooja pricing and inclusions are displayed transparently prior to booking confirmation.</li>
                <li>Payments must be made through approved platform channels (online payment gateways or authorized options).</li>
                <li>Bookings are subject to Pandit availability and timely confirmation.</li>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#F1E5D8' }} />

            {/* Section 5 */}
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: '#1E293B',
                  fontSize: { xs: '17px', sm: '19px' },
                  mb: 1.2,
                }}
              >
                5. Cancellation & Refund Policy
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                }}
              >
                Cancellations made prior to 24 hours of the scheduled pooja time are eligible for a full or partial refund based on samagri preparation status. Cancellations initiated by 1Pooja due to unforeseen Pandit unavailability will receive a 100% full refund or alternative rescheduling.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: '#F1E5D8' }} />

            {/* Section 6 */}
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: '#1E293B',
                  fontSize: { xs: '17px', sm: '19px' },
                  mb: 1.2,
                }}
              >
                6. Code of Conduct & Respectful Conduct
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                }}
              >
                All ritual ceremonies must be conducted with mutual respect and sanctity. Any abusive behavior, fraudulent activity, or non-compliance with sacred traditions may result in immediate account suspension or termination.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: '#F1E5D8' }} />

            {/* Section 7 */}
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: '#1E293B',
                  fontSize: { xs: '17px', sm: '19px' },
                  mb: 1.2,
                }}
              >
                7. Contact Information
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                }}
              >
                If you have questions regarding these Terms & Conditions, please contact us:
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  p: { xs: 2.2, sm: 3 },
                  bgcolor: '#FFF7F0',
                  borderRadius: '14px',
                  border: '1px solid #FFE4D6',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    color: '#1A0B05',
                    fontSize: { xs: '14.5px', sm: '15.5px' },
                  }}
                >
                  1Pooja Legal & Support Team
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: '#475569',
                    fontSize: { xs: '13.5px', sm: '14px' },
                    mt: 0.8,
                    lineHeight: 1.6,
                  }}
                >
                  Email:{' '}
                  <MuiLink
                    href="mailto:info@1pooja.com"
                    underline="hover"
                    sx={{
                      color: COLORS.PRIMARY,
                      fontWeight: 600,
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    info@1pooja.com
                  </MuiLink>
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: '#475569',
                    fontSize: { xs: '13.5px', sm: '14px' },
                    mt: 0.5,
                    lineHeight: 1.6,
                  }}
                >
                  Support Portal:{' '}
                  <MuiLink
                    component={NextLink}
                    href="/contact"
                    underline="hover"
                    sx={{
                      color: COLORS.PRIMARY,
                      fontWeight: 600,
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    1Pooja Help Center
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

'use client';

import { Box, Container, Typography, Divider, Paper, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

export default function PrivacyPolicyContent() {
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
              Privacy Policy
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
              At 1Pooja, we value your trust and are committed to protecting your privacy and personal data. This policy outlines how we collect, use, store, and safeguard your information.
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
                1. Information We Collect
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                  mb: 1.2,
                }}
              >
                We collect information you provide directly to us when registering an account, booking a pooja, or requesting customer support:
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
                <li>
                  <strong>Personal Identifiers:</strong> Name, email address, phone number, date of birth, and place of birth.
                </li>
                <li>
                  <strong>Booking & Address Details:</strong> Location address, event timing, and specific ritual instructions.
                </li>
                <li>
                  <strong>Payment Information:</strong> Transaction IDs and payment verification statuses processed via secure PCI-compliant gateways.
                </li>
                <li>
                  <strong>Purohit Details:</strong> Qualifications, experience, city, identity verification, and bank details for payout processing.
                </li>
              </Box>
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
                2. How We Use Your Information
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                  mb: 1.2,
                }}
              >
                Your data is utilized solely to facilitate seamless spiritual services and platform operations:
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
                <li>Connecting devotees with verified Pandits and scheduling home/online poojas.</li>
                <li>Sending OTP verifications, booking updates, and notification reminders.</li>
                <li>Processing transactions, refunds, and Purohit partner payouts.</li>
                <li>Improving application performance, resolving support tickets, and ensuring platform security.</li>
              </Box>
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
                3. Information Sharing & Disclosure
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                  mb: 1.2,
                }}
              >
                We do not sell or rent your personal data to third parties. We share data only with:
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
                <li>
                  <strong>Assigned Pandits:</strong> Necessary booking address and customer name to fulfill your requested pooja.
                </li>
                <li>
                  <strong>Service Providers:</strong> Secure payment processors, SMS gateways, and cloud hosting providers under strict confidentiality.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If mandated by applicable laws, court orders, or governmental regulations.
                </li>
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
                4. Data Security & Storage
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                }}
              >
                We employ industry-standard encryption (SSL/TLS), access controls, and secure database practices to prevent unauthorized access, alteration, or loss of your personal details.
              </Typography>
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
                5. Your Rights & Choices
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                }}
              >
                You have the right to view, edit, or update your profile details anytime via your account dashboard. You may also request account deletion or data export by contacting our support team.
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
                6. Contact Us
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#475569',
                  fontSize: { xs: '13.5px', sm: '14.5px' },
                  lineHeight: 1.7,
                }}
              >
                If you have questions, concerns, or requests regarding this Privacy Policy, please reach out to us:
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
                  1Pooja Privacy Desk
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
                  Help Center:{' '}
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
                    1Pooja Contact Support
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

'use client';

import { Box, Container, Typography, Divider, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function TermsAndConditionsContent() {
  return (
    <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', fontSize: { xs: '32px', md: '42px' }, mb: 1 }}>
            Terms & Conditions
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '14px', mb: 2 }}>
            Last Updated: September 15, 2026
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#444', fontSize: '16px', lineHeight: 1.7 }}>
            Welcome to Poojawala. By accessing or using our website, services, or mobile applications, you agree to comply with and be bound by the following terms and conditions.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: '#FFE0D0' }} />

        {/* Body Sections */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* Section 1 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              1. Acceptance of Terms
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              By creating an account, booking a puja, or registering as a Purohit partner on Poojawala, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree with any part of these terms, please discontinue platform usage.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 2 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              2. Platform Services Description
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              Poojawala acts as a digital marketplace connecting devotees with verified Pandits and Purohits for offline home rituals, online video pujas, and spiritual consultations. We facilitate scheduling, communication, and secure payment processing.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 3 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              3. User & Purohit Account Obligations
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: '#555', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.8 }}>
              <li>Users must provide accurate, current, and complete details during account creation and booking.</li>
              <li>Users are responsible for maintaining the security of their credentials.</li>
              <li>Purohits must submit valid credentials, identity verification documents, and adhere to agreed appointment schedules.</li>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 4 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              4. Bookings & Payments
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: '#555', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.8 }}>
              <li>All puja pricing and inclusions are displayed transparently prior to booking confirmation.</li>
              <li>Payments must be made through approved platform channels (online payment gateways or authorized options).</li>
              <li>Bookings are subject to Pandit availability and timely confirmation.</li>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 5 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              5. Cancellation & Refund Policy
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              Cancellations made prior to 24 hours of the scheduled puja time are eligible for a full or partial refund based on samagri preparation status. Cancellations initiated by Poojawala due to unforeseen Pandit unavailability will receive a 100% full refund or alternative rescheduling.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 6 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              6. Code of Conduct & Respectful Conduct
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              All ritual ceremonies must be conducted with mutual respect and sanctity. Any abusive behavior, fraudulent activity, or non-compliance with sacred traditions may result in immediate account suspension or termination.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 7 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              7. Contact Information
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              If you have questions regarding these Terms & Conditions, please contact us:
            </Typography>
            <Box sx={{ mt: 2, p: 3, bgcolor: '#FFF0E6', borderRadius: '12px' }}>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A' }}>Poojawala Legal & Support Team</Typography>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', fontSize: '15px', mt: 0.5 }}>Email: <MuiLink href="mailto:support@poojawala.com" underline="hover" color="#FF6200" sx={{ fontWeight: 600 }}>support@poojawala.com</MuiLink></Typography>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', fontSize: '15px', mt: 0.5 }}>Support Portal: <MuiLink component={NextLink} href="/contact" underline="hover" color="#FF6200" sx={{ fontWeight: 600 }}>Poojawala Help Center</MuiLink></Typography>
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}

'use client';

import { Box, Container, Typography, Divider, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function PrivacyPolicyContent() {
  return (
    <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', fontSize: { xs: '32px', md: '42px' }, mb: 1 }}>
            Privacy Policy
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '14px', mb: 2 }}>
            Last Updated: September 15, 2026
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#444', fontSize: '16px', lineHeight: 1.7 }}>
            At Poojawala, we value your trust and are committed to protecting your privacy and personal data. This policy outlines how we collect, use, store, and safeguard your information.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: '#FFE0D0' }} />

        {/* Body Sections */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* Section 1 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              1. Information We Collect
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8, mb: 1.5 }}>
              We collect information you provide directly to us when registering an account, booking a puja, or requesting customer support:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: '#555', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.8 }}>
              <li><strong>Personal Identifiers:</strong> Name, email address, phone number, date of birth, and place of birth.</li>
              <li><strong>Booking & Address Details:</strong> Location address, event timing, and specific ritual instructions.</li>
              <li><strong>Payment Information:</strong> Transaction IDs and payment verification statuses processed via secure PCI-compliant gateways.</li>
              <li><strong>Purohit Details:</strong> Qualifications, experience, city, identity verification, and bank details for payout processing.</li>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 2 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              2. How We Use Your Information
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8, mb: 1.5 }}>
              Your data is utilized solely to facilitate seamless spiritual services and platform operations:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: '#555', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.8 }}>
              <li>Connecting devotees with verified Pandits and scheduling home/online pujas.</li>
              <li>Sending OTP verifications, booking updates, and notification reminders.</li>
              <li>Processing transactions, refunds, and Purohit partner payouts.</li>
              <li>Improving application performance, resolving support tickets, and ensuring platform security.</li>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 3 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              3. Information Sharing & Disclosure
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              We do not sell or rent your personal data to third parties. We share data only with:
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: '#555', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.8 }}>
              <li><strong>Assigned Pandits:</strong> Necessary booking address and customer name to fulfill your requested puja.</li>
              <li><strong>Service Providers:</strong> Secure payment processors, SMS gateways, and cloud hosting providers under strict confidentiality.</li>
              <li><strong>Legal Requirements:</strong> If mandated by applicable laws, court orders, or governmental regulations.</li>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 4 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              4. Data Security & Storage
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              We employ industry-standard encryption (SSL/TLS), access controls, and secure database practices to prevent unauthorized access, alteration, or loss of your personal details.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 5 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              5. Your Rights & Choices
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              You have the right to view, edit, or update your profile details anytime via your account dashboard. You may also request account deletion or data export by contacting our support team.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#EAEAEA' }} />

          {/* Section 6 */}
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1.5 }}>
              6. Contact Us
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.8 }}>
              If you have questions, concerns, or requests regarding this Privacy Policy, please reach out to us:
            </Typography>
            <Box sx={{ mt: 2, p: 3, bgcolor: '#FFF0E6', borderRadius: '12px' }}>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A' }}>Poojawala Privacy Desk</Typography>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', fontSize: '15px', mt: 0.5 }}>Email: <MuiLink href="mailto:support@poojawala.com" underline="hover" color="#FF6200" sx={{ fontWeight: 600 }}>support@poojawala.com</MuiLink></Typography>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', fontSize: '15px', mt: 0.5 }}>Help Center: <MuiLink component={NextLink} href="/contact" underline="hover" color="#FF6200" sx={{ fontWeight: 600 }}>Poojawala Contact Support</MuiLink></Typography>
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}

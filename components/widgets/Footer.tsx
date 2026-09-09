'use client';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Container, Grid, IconButton, Link, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/verify-otp' || pathname === '/purohit' || pathname.startsWith('/purohit/') || pathname.startsWith('/admin') || pathname.startsWith('/customer')) return null;

  return (
    <Box component="footer">
      {/* Top Beige Section */}
      <Box sx={{ bgcolor: '#FEEDE2', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: '"Inter", sans-serif', 
                  fontWeight: 500, 
                  color: '#C82E2E', 
                  mb: 1.5,
                  fontSize: '36px',
                  lineHeight: 'normal',
                  letterSpacing: '0px'
                }}
              >
                Poojawala
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: '"DM Sans", sans-serif',
                  color: '#757575', 
                  fontSize: '14px',
                  lineHeight: '15.3px',
                  letterSpacing: '0.72px',
                  mb: 3,
                  width: '260px'
                }}
              >
                our trusted partner for divine rituals and sacred ceremonies at home.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2.5, mt: 1 }}>
                <IconButton sx={{ p: 0, color: '#141414', '&:hover': { color: '#C82E2E' } }}>
                  <FacebookIcon sx={{ width: '21.55px', height: '21.55px' }} />
                </IconButton>
                <IconButton sx={{ p: 0, color: '#141414', '&:hover': { color: '#C82E2E' } }}>
                  <TwitterIcon sx={{ width: '21.55px', height: '21.55px' }} />
                </IconButton>
                <IconButton sx={{ p: 0, color: '#141414', '&:hover': { color: '#C82E2E' } }}>
                  <InstagramIcon sx={{ width: '21.55px', height: '21.55px' }} />
                </IconButton>
                <IconButton sx={{ p: 0, color: '#141414', '&:hover': { color: '#C82E2E' } }}>
                  <LinkedInIcon sx={{ width: '21.55px', height: '21.55px' }} />
                </IconButton>
              </Box>
            </Grid>

            {/* Quick Links Column */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography 
                sx={{ 
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight:600, 
                  color: '#141414', 
                  mb: 3,
                  fontSize: '16px',
                  lineHeight: '15.3px',
                  letterSpacing: '0.72px'
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['Home', 'Puja Packages', 'Purohits', 'Festivals', 'About Us', 'Help Center'].map((link) => (
                  <Link 
                    key={link} 
                    href="#" 
                    underline="none"
                    sx={{ 
                      fontFamily: '"DM Sans", sans-serif',
                      color: '#757575', 
                      fontSize: '14px',
                      lineHeight: '15.3px',
                      letterSpacing: '0.72px',
                      '&:hover': { color: '#CC2E2E' }
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Top Cities Column */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography 
                sx={{ 
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600, 
                  color: '#141414', 
                  mb: 3,
                  fontSize: '16px',
                  lineHeight: '15.3px',
                  letterSpacing: '0.72px'
                }}
              >
                Top Cities
              </Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '100px' }}>
                  {['Mumbai', 'Bangalore', 'New Delhi', 'Pune', 'Hyderabad', 'Chennai'].map((city) => (
                    <Link 
                      key={city} 
                      href="#" 
                      underline="none"
                      sx={{ 
                        fontFamily: '"DM Sans", sans-serif',
                        color: '#757575', 
                        fontSize: '14px',
                        lineHeight: '15.3px',
                        letterSpacing: '0.72px',
                        '&:hover': { color: '#CC2E2E' }
                      }}
                    >
                      {city}
                    </Link>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'View All Cities'].map((city) => (
                    <Link 
                      key={city} 
                      href="#" 
                      underline="none"
                      sx={{ 
                        fontFamily: '"DM Sans", sans-serif',
                        color: '#757575', 
                        fontSize: '14px',
                        lineHeight: '15.3px',
                        letterSpacing: '0.72px',
                        '&:hover': { color: '#CC2E2E' }
                      }}
                    >
                      {city}
                    </Link>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Contact Us Column */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography 
                sx={{ 
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600, 
                  color: '#141414', 
                  mb: 3,
                  fontSize: '16px',
                  lineHeight: '15.3px',
                  letterSpacing: '0.72px'
                }}
              >
                Contact Us
              </Typography>
              <Link 
                href="mailto:support@poojawala.com" 
                underline="none"
                sx={{ 
                  fontFamily: '"DM Sans", sans-serif',
                  color: '#757575', 
                  fontSize: '14px',
                  lineHeight: '15.3px',
                  letterSpacing: '0.72px',
                  display: 'block',
                  mb: 4,
                  '&:hover': { color: '#CC2E2E' }
                }}
              >
                support@poojawala.com
              </Link>
              
              <Typography 
                sx={{ 
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600, 
                  color: '#141414', 
                  mb: 3,
                  fontSize: '16px',
                  lineHeight: '15.3px',
                  letterSpacing: '0.72px'
                }}
              >
                Join Us
              </Typography>
              <Link 
                href="/purohit" 
                underline="none"
                sx={{ 
                  fontFamily: '"DM Sans", sans-serif',
                  color: '#757575', 
                  fontSize: '14px',
                  lineHeight: '15.3px',
                  letterSpacing: '0.72px',
                  display: 'block',
                  '&:hover': { color: '#CC2E2E' }
                }}
              >
                Register as Purohit
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom White Bar */}
      <Box sx={{ bgcolor: '#ffffff', py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography 
              sx={{ 
                fontFamily: '"DM Sans", sans-serif',
                color: '#9E9E9E', 
                fontSize: '12px' 
              }}
            >
              © 2024 Poojawala. All rights reserved.
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: '"DM Sans", sans-serif',
                color: '#9E9E9E', 
                fontSize: '12px' 
              }}
            >
              Privacy Policy | Terms & Conditions
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

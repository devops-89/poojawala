'use client';
import { Box, Container, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import AstrologerGrid from './AstrologerGrid';
import { FONTS } from '@/utils/fonts';

export default function AstrologersLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Box
      sx={{
        bgcolor: '#FFFDF9',
        minHeight: '100vh',
        pb: 10,
        position: 'relative',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: '340px', sm: '420px', md: '560px' },
          backgroundImage: {
            xs: 'linear-gradient(90deg, rgba(255, 253, 249, 0.92) 0%, rgba(255, 253, 249, 0.7) 40%, rgba(255, 253, 249, 0.15) 80%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)',
            md: 'linear-gradient(90deg, rgba(255, 253, 249, 0.88) 0%, rgba(255, 253, 249, 0.55) 30%, rgba(255, 253, 249, 0.05) 60%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)',
          },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 3, md: 5 },
          pb: { xs: 4, md: 8 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Hero Content */}
          <Box sx={{ maxWidth: '620px', mt: 'auto', mb: 'auto' }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                color: '#0f172a',
                mb: 0.5,
                fontSize: { xs: '1.8rem', sm: '2.4rem', md: '48px' },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: '-0.04em',
              }}
            >
              Explore Our
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                color: '#D32F2F',
                mb: { xs: 1.5, md: 2.5 },
                fontSize: { xs: '1.8rem', sm: '2.4rem', md: '48px' },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: '-0.04em',
              }}
            >
              Verified Astrologers
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                color: '#0f172a',
                fontWeight: 600,
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                lineHeight: '1.5',
                maxWidth: '520px',
              }}
            >
              Connect and consult certified Vedic astrologers for Kundali matching, horoscope analysis, vastu consultation, and personal life guidance.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <AstrologerGrid />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

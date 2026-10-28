'use client';

import React from 'react';
import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NextLink from 'next/link';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

export default function RegisterHeader() {
  return (
    <Box
      sx={{
        pt: { xs: 2, md: 3 },
        pb: { xs: 1, md: 1.5 },
        px: { xs: 2.5, sm: 4, md: 6 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10,
        bgcolor: 'transparent',
      }}
    >
      <MuiLink
        component={NextLink}
        href="/"
        underline="none"
        sx={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <Box
          component="img"
          src="/images/1Poojalogo.webp"
          alt="1Pooja"
          sx={{ height: { xs: '32px', md: '42px' }, objectFit: 'contain' }}
        />
      </MuiLink>

      <Typography
        component="h1"
        sx={{
          color: '#334155',
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          fontSize: { xs: '14px', md: '18px' },
          letterSpacing: '-0.01em',
          display: 'block',
          m: 0,
        }}
      >
        Partner Onboarding
      </Typography>

      <Button
        component={NextLink}
        href="/"
        startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          color: '#334155',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          borderRadius: '50px',
          px: { xs: 2, md: 2.5 },
          py: 0.8,
          fontFamily: FONTS.OUTFIT,
          fontWeight: 600,
          fontSize: { xs: '0.8rem', md: '0.85rem' },
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: '#FFFFFF',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
            color: COLORS.PRIMARY,
          },
        }}
      >
        Go to Website
      </Button>
    </Box>
  );
}

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
        p: 2.5,
        px: { xs: 2, md: 4 },
        borderBottom: '1px solid #FFE0D0',
        bgcolor: COLORS.WHITE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
          src="/images/logo.webp"
          alt="Poojawala"
          sx={{ height: { xs: '40px', md: '50px' }, objectFit: 'contain' }}
        />
      </MuiLink>

      <Typography
        sx={{
          color: COLORS.MUTED_TEXT,
          fontFamily: FONTS.OUTFIT,
          fontWeight: 600,
          fontSize: { xs: '13px', md: '15px' },
          display: { xs: 'none', sm: 'block' },
        }}
      >
        Purohit Partner Onboarding
      </Typography>

      <Button
        component={NextLink}
        href="/"
        startIcon={<ArrowBackIcon />}
        sx={{
          color: '#475569',
          borderColor: '#FFE0D0',
          borderRadius: '25px',
          px: 2.5,
          py: 0.75,
          fontFamily: FONTS.OUTFIT,
          fontWeight: 600,
          fontSize: '0.85rem',
          textTransform: 'none',
          border: '1px solid #FFE0D0',
          '&:hover': {
            bgcolor: '#FFF0E6',
            color: COLORS.PRIMARY,
            borderColor: COLORS.PRIMARY,
          },
        }}
      >
        Go to Website
      </Button>
    </Box>
  );
}

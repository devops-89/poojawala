'use client';

import React from 'react';
import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NextLink from 'next/link';

export default function RegisterHeader() {
  return (
    <Box
      sx={{
        p: 2.5,
        px: { xs: 2, md: 4 },
        borderBottom: '1px solid #FFE0D0',
        bgcolor: 'white',
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
          color: '#666',
          fontFamily: 'var(--font-outfit), sans-serif',
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
          fontFamily: 'var(--font-outfit), sans-serif',
          fontWeight: 600,
          fontSize: '0.85rem',
          textTransform: 'none',
          border: '1px solid #FFE0D0',
          '&:hover': {
            bgcolor: '#FFF0E6',
            color: '#FF6200',
            borderColor: '#FF6200',
          },
        }}
      >
        Go to Website
      </Button>
    </Box>
  );
}

'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useRouter } from 'next/navigation';

export interface EmptyStateCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyStateCard({
  icon,
  title,
  description,
  actionText,
  actionHref,
}: EmptyStateCardProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '560px',
        mx: 'auto',
        my: 3,
        p: { xs: 4, sm: 5 },
        textAlign: 'center',
        background: 'linear-gradient(145deg, #FFFDF9 0%, #FAF4E8 100%)',
        borderRadius: '24px',
        border: '1.5px solid #EFE6D5',
        boxShadow: '0 12px 36px rgba(184, 134, 11, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 16px 44px rgba(184, 134, 11, 0.12)',
          borderColor: '#D4B076',
        },
      }}
    >
      {/* Top Decorative Icon Badge */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '20px',
          bgcolor: '#FFF7ED',
          border: '1.5px solid #FED7AA',
          color: '#FF6200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(255, 98, 0, 0.1)',
        }}
      >
        {icon || <AutoAwesomeOutlinedIcon sx={{ fontSize: 32 }} />}
      </Box>

      {/* Content */}
      <Box>
        <Typography
          component="h3"
          sx={{
            fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
            fontWeight: 800,
            fontSize: { xs: '20px', sm: '22px' },
            color: '#2C1810',
            mb: 1,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
            fontSize: '14.5px',
            color: '#64748b',
            maxWidth: '440px',
            mx: 'auto',
            lineHeight: 1.55,
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Optional Action Button */}
      {actionText && actionHref && (
        <Button
          onClick={() => router.push(actionHref)}
          sx={{
            mt: 1,
            px: 3.5,
            py: 1.1,
            borderRadius: '31px',
            bgcolor: '#FF6200',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '14px',
            fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(255, 98, 0, 0.25)',
            '&:hover': {
              bgcolor: '#E65800',
              boxShadow: '0 6px 18px rgba(255, 98, 0, 0.35)',
            },
          }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
}

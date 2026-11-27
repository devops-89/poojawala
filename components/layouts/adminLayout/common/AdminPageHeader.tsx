'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';
import { sanitizeAdminSearchTerm } from '@/utils/helpers';
import type { AdminPageHeaderProps } from '@/utils/types';

export type { AdminPageHeaderProps };

export default function AdminPageHeader({
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actionButtonText,
  actionButtonHref,
  actionButtonIcon = <AddIcon />,
  onActionButtonClick,
}: AdminPageHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchValue || '');

  useEffect(() => {
    if (!searchValue && localSearch) {
      setLocalSearch('');
    } else if (
      searchValue &&
      sanitizeAdminSearchTerm(localSearch) !== searchValue
    ) {
      setLocalSearch(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        const cleaned = sanitizeAdminSearchTerm(localSearch);
        if (cleaned !== (searchValue || '')) {
          onSearchChange(cleaned);
        }
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchValue]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: '#1e293b',
            fontSize: { xs: '22px', sm: '26px', md: '30px' },
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: '#64748b',
              mt: 0.5,
              fontSize: { xs: '0.85rem', sm: '0.92rem' },
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: { xs: 1.2, sm: 1.5 }, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
        {onSearchChange !== undefined && (
          <TextField
            size="small"
            placeholder={searchPlaceholder || 'Search...'}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.8 }}>
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: '100%', sm: 250, md: 280 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: 'white',
                fontFamily: FONTS.OUTFIT,
                height: { xs: '38px', sm: '40px' },
                fontSize: { xs: '13px', sm: '13.5px' },
                px: 1.2,
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
                '&:hover fieldset': {
                  borderColor: '#CBD5E1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: COLORS.PRIMARY,
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 0,
                fontSize: { xs: '13px', sm: '13.5px' },
                '&::placeholder': {
                  color: '#94A3B8',
                  fontSize: { xs: '12.5px', sm: '13px' },
                  opacity: 1,
                },
              },
            }}
          />
        )}

        {actionButtonText && (
          <Button
            component={actionButtonHref ? NextLink : 'button'}
            href={actionButtonHref || '#'}
            onClick={onActionButtonClick}
            variant="contained"
            sx={{
              background: COLORS.PRIMARY,
              color: 'white',
              textTransform: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              height: { xs: '38px', sm: '40px' },
              px: { xs: 2, sm: 2.5 },
              boxShadow: 'none',
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: '13px', sm: '13.5px' },
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { background: COLORS.PRIMARY_DARK, boxShadow: 'none' },
            }}
            startIcon={actionButtonIcon}
          >
            {actionButtonText}
          </Button>
        )}
      </Box>
    </Box>
  );
}

'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Autocomplete,
  Avatar,
  Box,
  Card,
  Chip,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';

interface AddBookingAstrologerSectionProps {
  astrologers: any[];
  values: any;
  errors: any;
  touched: any;
  handleBlur: any;
  setFieldValue: any;
  setAstrologerSearchText: (text: string) => void;
}

export default function AddBookingAstrologerSection({
  astrologers,
  values,
  errors,
  touched,
  handleBlur,
  setFieldValue,
  setAstrologerSearchText,
}: AddBookingAstrologerSectionProps) {
  const selectedAstrologer =
    astrologers.find((a) => a.id === Number(values.astrologerId)) || null;

  const astrologerOptions =
    selectedAstrologer && !astrologers.some((a) => a.id === selectedAstrologer.id)
      ? [selectedAstrologer, ...astrologers]
      : astrologers;

  return (
    <>
      {/* Select Astrologer */}
      <Grid size={{ xs: 12 }}>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            mb: 1,
            color: '#1e293b',
          }}
        >
          Select Astrologer *
        </Typography>
        <Autocomplete
          options={astrologerOptions}
          filterOptions={(x) => x}
          isOptionEqualToValue={(option: any, val: any) =>
            Number(option?.id) === Number(val?.id)
          }
          getOptionLabel={(option: any) => {
            if (!option) return '';
            const fName =
              option.firstName || option.user?.firstName || '';
            const lName =
              option.lastName || option.user?.lastName || '';
            const fullName = `${fName} ${lName}`.trim() || option.username || '';
            const contact = option.phone || option.email || '';
            return fullName ? `${fullName} (${contact})` : contact;
          }}
          value={selectedAstrologer}
          onChange={(_, newValue: any) => {
            setFieldValue(
              'astrologerId',
              newValue ? String(newValue.id) : ''
            );
          }}
          onInputChange={(_, newInputValue, reason) => {
            if (reason === 'input' || reason === 'clear') {
              setAstrologerSearchText(newInputValue);
            }
          }}
          renderOption={(props, option: any) => {
            const { key, ...optionProps } = props;
            const fullName = `${option.firstName || ''} ${
              option.lastName || ''
            }`.trim() || option.username;
            const profile = option.astrologerProfile;
            const specializations = Array.isArray(profile?.specializations)
              ? profile.specializations.slice(0, 2).join(', ')
              : '';
            const rate = profile?.ratePerMinute;

            return (
              <Box
                key={key || option.id}
                component="li"
                {...optionProps}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                }}
              >
                <Avatar
                  src={option.profileImage}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#f3e8ff',
                    color: '#9333ea',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  {fullName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    {fullName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#64748b', display: 'block' }}
                  >
                    {option.phone} • {option.email}
                  </Typography>
                  {specializations && (
                    <Typography
                      variant="caption"
                      sx={{ color: '#9333ea', fontWeight: 500 }}
                    >
                      {specializations}
                    </Typography>
                  )}
                </Box>
                {rate && (
                  <Chip
                    size="small"
                    label={`₹${rate}/min`}
                    sx={{
                      bgcolor: '#ecfdf5',
                      color: '#059669',
                      fontWeight: 700,
                      fontFamily: FONTS.OUTFIT,
                    }}
                  />
                )}
              </Box>
            );
          }}
          renderInput={(params) => {
            if (params.slotProps?.htmlInput) {
              params.slotProps.htmlInput.autoComplete = 'new-password';
            }
            return (
              <TextField
                {...params}
                name="search_astrologer_input"
                onBlur={handleBlur}
                placeholder="Search astrologer..."
                error={
                  touched.astrologerId && Boolean(errors.astrologerId)
                }
                helperText={
                  touched.astrologerId
                    ? (errors.astrologerId as string)
                    : undefined
                }
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                }}
              />
            );
          }}
        />
      </Grid>

      {/* Astrologer Details Preview Card */}
      {selectedAstrologer && (
        <Grid size={{ xs: 12 }}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #f1f5f9',
              bgcolor: '#faf5ff',
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              flexWrap: 'wrap',
            }}
          >
            <Avatar
              src={selectedAstrologer.profileImage}
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#9333ea',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.25rem',
              }}
            >
              {(
                selectedAstrologer.firstName ||
                selectedAstrologer.username ||
                'A'
              )
                .charAt(0)
                .toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    fontFamily: FONTS.OUTFIT,
                  }}
                >
                  {selectedAstrologer.firstName}{' '}
                  {selectedAstrologer.lastName || ''}
                </Typography>
                <Chip
                  size="small"
                  icon={<WorkspacePremiumIcon sx={{ fontSize: '14px !important' }} />}
                  label="Verified Astrologer"
                  sx={{
                    bgcolor: '#f3e8ff',
                    color: '#7e22ce',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: '#64748b', fontSize: '0.85rem' }}
              >
                {selectedAstrologer.phone} • {selectedAstrologer.email}
              </Typography>
              {selectedAstrologer.astrologerProfile?.city && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 14 }} />
                  {selectedAstrologer.astrologerProfile.city}
                </Typography>
              )}
            </Box>

            {selectedAstrologer.astrologerProfile && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedAstrologer.astrologerProfile.ratePerMinute && (
                  <Box sx={{ textAlign: 'center', px: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b' }}
                    >
                      Rate
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#16a34a',
                        fontFamily: FONTS.OUTFIT,
                      }}
                    >
                      ₹{selectedAstrologer.astrologerProfile.ratePerMinute}/min
                    </Typography>
                  </Box>
                )}
                {selectedAstrologer.astrologerProfile.experienceYears && (
                  <Box sx={{ textAlign: 'center', px: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b' }}
                    >
                      Experience
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#0f172a',
                        fontFamily: FONTS.OUTFIT,
                      }}
                    >
                      {selectedAstrologer.astrologerProfile.experienceYears} yrs
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Card>
        </Grid>
      )}
    </>
  );
}

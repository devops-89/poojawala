'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Chip,
  FormHelperText,
  AutocompleteRenderGetTagProps,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { FormikProps } from 'formik';
import { State, City } from 'country-state-city';
import { QUALIFICATIONS, LANGUAGES, SPECIALIZATIONS } from '../constants';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';
import { allowOnlyLettersOnKeyDown, sanitizeLettersOnly } from '@/utils/helpers';

const CustomAutocomplete = Autocomplete as any;

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: FONTS.PRIMARY,
    fontSize: '14px',
    bgcolor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#D1D5DB',
    },
    '&:hover fieldset': {
      borderColor: COLORS.PRIMARY,
    },
    '&.Mui-focused fieldset': {
      borderColor: COLORS.PRIMARY,
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: FONTS.PRIMARY,
    fontSize: '14px',
    '&.Mui-focused': {
      color: COLORS.PRIMARY,
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: FONTS.PRIMARY,
    fontSize: '12px',
    mt: 0.5,
  },
};

interface Step2Props {
  formik: FormikProps<any>;
}

export default function Step2PurohitProfile({ formik }: Step2Props) {
  // All Indian States from country-state-city
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry('IN') || [];
    return states.map((s) => s.name).sort((a, b) => a.localeCompare(b));
  }, []);

  // Dynamically filter cities based on selected state
  const cityOptions = useMemo(() => {
    if (!formik.values.state) return [];
    const states = State.getStatesOfCountry('IN') || [];
    const selectedStateObj = states.find(
      (s) => s?.name?.toLowerCase().trim() === (formik.values.state || '').toLowerCase().trim()
    );
    if (selectedStateObj && selectedStateObj.isoCode) {
      const cities = City.getCitiesOfState('IN', selectedStateObj.isoCode) || [];
      return Array.from(new Set(cities.map((c) => c.name))).sort((a, b) => a.localeCompare(b));
    }
    return [];
  }, [formik.values.state]);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          mb: 3,
        }}
      >
        Purohit Profile
      </Typography>

      <Grid container spacing={2.5}>
        {/* State */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            openOnFocus
            autoHighlight
            forcePopupIcon
            size="small"
            options={stateOptions}
            value={formik.values.state || null}
            onChange={(_, newValue) => {
              formik.setFieldValue('state', newValue || '');
              // Reset city if state changes
              formik.setFieldValue('city', '');
            }}
            isOptionEqualToValue={(option, value) => {
              if (!value) return false;
              return option.toLowerCase().trim() === String(value).toLowerCase().trim();
            }}
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                name="state"
                label="State *"
                placeholder="Select State"
                variant="outlined"
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && (formik.errors.state as string)}
                sx={fieldSx}
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            openOnFocus
            autoHighlight
            forcePopupIcon
            size="small"
            disabled={!formik.values.state}
            options={cityOptions}
            value={formik.values.city || null}
            onChange={(_, newValue) => {
              formik.setFieldValue('city', newValue || '');
            }}
            isOptionEqualToValue={(option, value) => {
              if (!value) return false;
              return option.toLowerCase().trim() === String(value).toLowerCase().trim();
            }}
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                name="city"
                label="City *"
                placeholder={!formik.values.state ? 'Select State first' : 'Select City'}
                variant="outlined"
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={
                  formik.touched.city
                    ? (formik.errors.city as string)
                    : !formik.values.state
                    ? 'Select state to enable city selection'
                    : undefined
                }
                sx={fieldSx}
              />
            )}
          />
        </Grid>

        {/* Aadhaar Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            name="aadhaarNumber"
            label="Aadhaar Number *"
            placeholder="Enter 12-digit Aadhaar number"
            variant="outlined"
            value={formik.values.aadhaarNumber || ''}
            onKeyDown={(e) => {
              if (
                !/\d/.test(e.key) &&
                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'].includes(e.key) &&
                !e.ctrlKey &&
                !e.metaKey
              ) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 12) {
                formik.setFieldValue('aadhaarNumber', val);
              }
            }}
            error={
              formik.touched.aadhaarNumber &&
              Boolean(formik.errors.aadhaarNumber)
            }
            helperText={
              formik.touched.aadhaarNumber &&
              (formik.errors.aadhaarNumber as string)
            }
            sx={fieldSx}
          />
        </Grid>

        {/* Qualification */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            openOnFocus
            autoHighlight
            forcePopupIcon
            size="small"
            options={QUALIFICATIONS}
            value={formik.values.qualification || null}
            onChange={(_, newValue) => {
              formik.setFieldValue('qualification', newValue || '');
            }}
            isOptionEqualToValue={(option, value) => {
              if (!value) return false;
              return option.toLowerCase().trim() === String(value).toLowerCase().trim();
            }}
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                name="qualification"
                label="Qualification *"
                placeholder="Select Qualification"
                variant="outlined"
                error={
                  formik.touched.qualification &&
                  Boolean(formik.errors.qualification)
                }
                helperText={
                  formik.touched.qualification &&
                  (formik.errors.qualification as string)
                }
                sx={fieldSx}
              />
            )}
          />
        </Grid>

        {/* Experience */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            type="text"
            name="experienceYears"
            label="Experience (Years) *"
            placeholder="e.g. 5"
            variant="outlined"
            value={formik.values.experienceYears || ''}
            onKeyDown={(e) => {
              if (
                !/\d/.test(e.key) &&
                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'].includes(e.key) &&
                !e.ctrlKey &&
                !e.metaKey
              ) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 2);
              formik.setFieldValue('experienceYears', val);
            }}
            error={
              formik.touched.experienceYears &&
              Boolean(formik.errors.experienceYears)
            }
            helperText={
              formik.touched.experienceYears &&
              (formik.errors.experienceYears as string)
            }
            sx={fieldSx}
          />
        </Grid>

        {/* Languages */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomAutocomplete
            multiple
            openOnFocus
            forcePopupIcon
            size="small"
            options={LANGUAGES}
            value={formik.values.languages || []}
            onChange={(_: any, newValue: any) => {
              const validOnly = (newValue || []).filter((l: string) =>
                LANGUAGES.includes(l)
              );
              formik.setFieldValue('languages', validOnly);
            }}
            renderTags={(value: readonly string[], getTagProps: AutocompleteRenderGetTagProps) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key || option + index}
                    variant="outlined"
                    label={option}
                    size="small"
                    sx={{
                      borderRadius: '6px',
                      fontFamily: FONTS.PRIMARY,
                      fontSize: '12px',
                      height: '24px',
                      bgcolor: '#FFF7ED',
                      borderColor: '#FFDBBD',
                      color: COLORS.PRIMARY,
                    }}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                name="languages"
                label="Languages *"
                variant="outlined"
                placeholder={formik.values.languages?.length ? '' : 'Select languages'}
                error={
                  formik.touched.languages && Boolean(formik.errors.languages)
                }
                helperText={
                  formik.touched.languages &&
                  (formik.errors.languages as string)
                }
                sx={fieldSx}
              />
            )}
          />
        </Grid>

        {/* Specializations */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomAutocomplete
            multiple
            openOnFocus
            forcePopupIcon
            size="small"
            options={SPECIALIZATIONS}
            value={formik.values.specializations || []}
            onChange={(_: any, newValue: any) => {
              const validOnly = (newValue || []).filter((s: string) =>
                SPECIALIZATIONS.includes(s)
              );
              formik.setFieldValue('specializations', validOnly);
            }}
            renderTags={(value: readonly string[], getTagProps: AutocompleteRenderGetTagProps) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key || option + index}
                    variant="outlined"
                    label={option}
                    size="small"
                    sx={{
                      borderRadius: '6px',
                      fontFamily: FONTS.PRIMARY,
                      fontSize: '12px',
                      height: '24px',
                      bgcolor: '#FFF7ED',
                      borderColor: '#FFDBBD',
                      color: COLORS.PRIMARY,
                    }}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                name="specializations"
                label="Specializations *"
                variant="outlined"
                placeholder={formik.values.specializations?.length ? '' : 'Select specializations'}
                error={
                  formik.touched.specializations &&
                  Boolean(formik.errors.specializations)
                }
                helperText={
                  formik.touched.specializations &&
                  (formik.errors.specializations as string)
                }
                sx={fieldSx}
              />
            )}
          />
        </Grid>

        {/* Bio */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            name="bio"
            label="Bio (About Yourself) *"
            placeholder="Tell us about your background, Vedic education, and ritual experience..."
            variant="outlined"
            value={formik.values.bio || ''}
            onChange={formik.handleChange}
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={formik.touched.bio && (formik.errors.bio as string)}
            sx={fieldSx}
          />
        </Grid>

        {/* Availability */}
        <Grid size={{ xs: 12 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color:
                !formik.values.isOnlineAvailable &&
                !formik.values.isOfflineAvailable &&
                (formik.submitCount > 0 || Boolean(formik.errors.isOfflineAvailable))
                  ? '#d32f2f'
                  : '#333',
              mb: 0.5,
            }}
          >
            Service Availability *
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(formik.values.isOnlineAvailable)}
                  onChange={formik.handleChange}
                  name="isOnlineAvailable"
                  sx={{ color: COLORS.PRIMARY, '&.Mui-checked': { color: COLORS.PRIMARY } }}
                />
              }
              label="Available for Online Pooja"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(formik.values.isOfflineAvailable)}
                  onChange={formik.handleChange}
                  name="isOfflineAvailable"
                  sx={{ color: COLORS.PRIMARY, '&.Mui-checked': { color: COLORS.PRIMARY } }}
                />
              }
              label="Available for Offline Pooja"
            />
          </Box>
          {!formik.values.isOnlineAvailable &&
            !formik.values.isOfflineAvailable &&
            (formik.submitCount > 0 || Boolean(formik.errors.isOfflineAvailable)) && (
              <FormHelperText error sx={{ ml: 0, mt: 0.5 }}>
                {(formik.errors.isOfflineAvailable as string) ||
                  'Select at least one availability mode (Online or Offline)'}
              </FormHelperText>
            )}
        </Grid>
      </Grid>
    </Box>
  );
}

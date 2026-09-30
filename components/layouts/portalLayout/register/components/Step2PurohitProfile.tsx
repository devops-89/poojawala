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
  AutocompleteRenderGetTagProps,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { FormikProps } from 'formik';
import { State, City } from 'country-state-city';
import { QUALIFICATIONS, LANGUAGES, SPECIALIZATIONS } from '../constants';

const CustomAutocomplete = Autocomplete as any;

interface Step2Props {
  formik: FormikProps<any>;
}

export default function Step2PurohitProfile({ formik }: Step2Props) {
  // All Indian States from country-state-city
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry('IN') || [];
    return states.map((s) => s.name);
  }, []);

  // Dynamically filter cities based on selected state
  const cityOptions = useMemo(() => {
    const states = State.getStatesOfCountry('IN') || [];
    const selectedStateObj = states.find(
      (s) => s?.name?.toLowerCase() === (formik.values.state || '').toLowerCase()
    );
    if (selectedStateObj && selectedStateObj.isoCode) {
      const cities = City.getCitiesOfState('IN', selectedStateObj.isoCode) || [];
      return cities.map((c) => c.name);
    }
    const allCities = City.getCitiesOfCountry('IN') || [];
    return allCities.map((c) => c.name);
  }, [formik.values.state]);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'var(--font-outfit), sans-serif',
          fontWeight: 700,
          mb: 3,
        }}
      >
        Purohit Profile
      </Typography>

      <Grid container spacing={3}>
        {/* State */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            options={stateOptions}
            value={formik.values.state || ''}
            onChange={(_, newValue) => {
              const val = (newValue || '').replace(/[^a-zA-Z\s.-]/g, '');
              formik.setFieldValue('state', val);
              // Reset city if state changes
              formik.setFieldValue('city', '');
            }}
            onInputChange={(_, newInputValue) => {
              const val = (newInputValue || '').replace(/[^a-zA-Z\s.-]/g, '');
              formik.setFieldValue('state', val);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="state"
                label="State *"
                variant="outlined"
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && (formik.errors.state as string)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            options={cityOptions}
            value={formik.values.city || ''}
            onChange={(_, newValue) => {
              const val = (newValue || '').replace(/[^a-zA-Z\s.-]/g, '');
              formik.setFieldValue('city', val);
            }}
            onInputChange={(_, newInputValue) => {
              const val = (newInputValue || '').replace(/[^a-zA-Z\s.-]/g, '');
              formik.setFieldValue('city', val);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="city"
                label="City *"
                variant="outlined"
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && (formik.errors.city as string)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}
          />
        </Grid>

        {/* Aadhaar Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="aadhaarNumber"
            label="Aadhaar Number *"
            variant="outlined"
            value={formik.values.aadhaarNumber || ''}
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>

        {/* Qualification */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            options={QUALIFICATIONS}
            value={formik.values.qualification || ''}
            onChange={(_, newValue) => {
              const val = (newValue || '').replace(/[^a-zA-Z\s.-]/g, '');
              formik.setFieldValue('qualification', val);
            }}
            onInputChange={(_, newInputValue) => {
              const val = (newInputValue || '').replace(/[^a-zA-Z\s.-]/g, '');
              formik.setFieldValue('qualification', val);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="qualification"
                label="Qualification *"
                variant="outlined"
                error={
                  formik.touched.qualification &&
                  Boolean(formik.errors.qualification)
                }
                helperText={
                  formik.touched.qualification &&
                  (formik.errors.qualification as string)
                }
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}
          />
        </Grid>

        {/* Experience */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="text"
            name="experienceYears"
            label="Experience (Years) *"
            variant="outlined"
            value={formik.values.experienceYears || ''}
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>

        {/* Languages */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomAutocomplete
            multiple
            freeSolo
            forcePopupIcon
            options={LANGUAGES}
            value={formik.values.languages || []}
            onChange={(_: any, newValue: any) => {
              formik.setFieldValue('languages', newValue || []);
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
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                name="languages"
                label="Languages *"
                variant="outlined"
                placeholder="Select or type custom language"
                error={
                  formik.touched.languages && Boolean(formik.errors.languages)
                }
                helperText={
                  formik.touched.languages &&
                  (formik.errors.languages as string)
                }
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}
          />
        </Grid>

        {/* Specializations */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomAutocomplete
            multiple
            freeSolo
            forcePopupIcon
            options={SPECIALIZATIONS}
            value={formik.values.specializations || []}
            onChange={(_: any, newValue: any) => {
              formik.setFieldValue('specializations', newValue || []);
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
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                name="specializations"
                label="Specializations *"
                variant="outlined"
                placeholder="Select or type custom specialization"
                error={
                  formik.touched.specializations &&
                  Boolean(formik.errors.specializations)
                }
                helperText={
                  formik.touched.specializations &&
                  (formik.errors.specializations as string)
                }
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}
          />
        </Grid>

        {/* Bio */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="bio"
            label="Bio (About Yourself) *"
            variant="outlined"
            value={formik.values.bio || ''}
            onChange={formik.handleChange}
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={formik.touched.bio && (formik.errors.bio as string)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>

        {/* Availability */}
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(formik.values.isOnlineAvailable)}
                onChange={formik.handleChange}
                name="isOnlineAvailable"
                sx={{ color: '#FF6200', '&.Mui-checked': { color: '#FF6200' } }}
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
                sx={{ color: '#FF6200', '&.Mui-checked': { color: '#FF6200' } }}
              />
            }
            label="Available for Offline Pooja"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

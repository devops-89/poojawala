'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Chip,
  FormHelperText,
  AutocompleteRenderValueGetItemProps,
  createFilterOptions,
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Grid from '@mui/material/Grid';
import { FormikProps } from 'formik';
import { State, City } from '@/utils/indianLocations';
import { QUALIFICATIONS, LANGUAGES, SPECIALIZATIONS } from '../constants';
import {
  cleanItem,
  ASTROLOGY_SPECIALIZATIONS,
} from '@/components/layouts/adminLayout/astrologers/EditAstrologerForm';
import { FONTS } from '@/utils/fonts';
import { COLORS, USER_ROLE } from '@/utils/enums';
import {
  allowOnlyLettersOnKeyDown,
  sanitizeLettersOnly,
  allowOnlyDescriptionCharsOnKeyDown,
  sanitizeDescriptionInput,
} from '@/utils/helpers';
import { getPlatformSettingsAPI } from '@/api/userControllers';
import { parsePlatformSetting } from '@/components/layouts/adminLayout/astrologers/AstrologyCommissionBanner';

const filter = createFilterOptions<string>();

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
  const [platformCommission, setPlatformCommission] = useState<string>('');

  useEffect(() => {
    let active = true;
    getPlatformSettingsAPI()
      .then((res) => {
        if (!active) return;
        const parsed = parsePlatformSetting(res, 'ASTROLOGY_COMMISSION_PERCENTAGE');
        if (parsed.value) {
          setPlatformCommission(parsed.value);
        }
      })
      .catch((err) => {
        console.error('Failed to load platform commission percentage:', err);
      });
    return () => {
      active = false;
    };
  }, []);

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

  const [isBioManuallyEdited, setIsBioManuallyEdited] = useState(false);
  const lastGeneratedBioRef = React.useRef<string>('');

  const buildAutoBio = () => {
    const isAstrologer = formik.values.role === USER_ROLE.ASTROLOGER;
    const rawName = (formik.values.fullName || '').trim();
    const name = rawName || (isAstrologer ? 'Astrologer' : 'Pandit Ji');
    const exp = formik.values.experienceYears ? `${formik.values.experienceYears}+ years` : '';
    const qual = (formik.values.qualification || '').trim();
    const langs = (formik.values.languages || []).filter(Boolean);
    const specs = (formik.values.specializations || []).filter(Boolean);

    const langText = langs.length > 0 ? langs.join(', ') : '';
    const specText = specs.length > 0 ? specs.join(', ') : '';

    if (isAstrologer) {
      let bio = `Namaste! I am ${name}, a certified Vedic Astrologer`;
      if (exp) {
        bio += ` with over ${exp} of dedicated experience in Vedic astrology, horoscope reading, and spiritual consultation`;
      } else {
        bio += ` dedicated to providing authentic Vedic astrological guidance and spiritual consultation`;
      }
      bio += `.`;

      if (qual) {
        bio += ` I hold formal qualification in ${qual}.`;
      }
      if (specText) {
        bio += ` My core specializations include ${specText}.`;
      }
      if (langText) {
        bio += ` Fluent in ${langText}, I provide personalized consultations with accurate predictions and practical Vedic remedies.`;
      }
      return bio;
    } else {
      let bio = `Namaste! I am ${name}, a devoted Vedic Purohit`;
      if (exp) {
        bio += ` with over ${exp} of dedicated experience in performing sacred rituals and traditional poojas`;
      } else {
        bio += ` dedicated to conducting authentic Vedic rituals with complete devotion and Shastric vidhi`;
      }
      bio += `.`;

      if (qual) {
        bio += ` I have completed formal education in ${qual}.`;
      }
      if (specText) {
        bio += ` I specialize in performing ${specText} following complete Vedic traditions and authentic mantras.`;
      }
      if (langText) {
        bio += ` Fluent in ${langText}, I ensure devotees understand the spiritual significance of each ceremony.`;
      }

      if (formik.values.isOnlineAvailable && formik.values.isOfflineAvailable) {
        bio += ` Available for both offline home ceremonies and online Vedic e-poojas.`;
      } else if (formik.values.isOnlineAvailable) {
        bio += ` Available for online Vedic e-poojas.`;
      } else if (formik.values.isOfflineAvailable) {
        bio += ` Available for offline home poojas.`;
      }
      return bio;
    }
  };

  useEffect(() => {
    const currentBio = formik.values.bio || '';
    const isAutoOrEmpty = !currentBio || currentBio === lastGeneratedBioRef.current || !isBioManuallyEdited;

    if (isAutoOrEmpty) {
      const newBio = buildAutoBio();
      if (newBio && newBio !== currentBio) {
        lastGeneratedBioRef.current = newBio;
        formik.setFieldValue('bio', newBio);
      }
    }
  }, [
    formik.values.role,
    formik.values.fullName,
    formik.values.experienceYears,
    formik.values.qualification,
    formik.values.languages,
    formik.values.specializations,
    formik.values.isOnlineAvailable,
    formik.values.isOfflineAvailable,
  ]);

  const handleRegenerateBio = () => {
    const newBio = buildAutoBio();
    lastGeneratedBioRef.current = newBio;
    setIsBioManuallyEdited(false);
    formik.setFieldValue('bio', newBio);
  };

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
        {formik.values.role === USER_ROLE.ASTROLOGER
          ? 'Astrologer Profile'
          : formik.values.role === USER_ROLE.PUROHIT
          ? 'Purohit Profile'
          : 'Professional Profile'}
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
            freeSolo
            openOnFocus
            autoHighlight
            forcePopupIcon
            size="small"
            options={QUALIFICATIONS}
            value={formik.values.qualification || ''}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const trimmed = cleanItem(inputValue);
              const isExisting = options.some(
                (opt) => opt.toLowerCase() === trimmed.toLowerCase()
              );
              if (trimmed !== '' && !isExisting) {
                filtered.push(trimmed);
              }
              return filtered;
            }}
            onChange={(_, newValue) => {
              const val = cleanItem(typeof newValue === 'string' ? newValue : newValue || '');
              formik.setFieldValue('qualification', val);
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === 'input') {
                formik.setFieldValue('qualification', cleanItem(newInputValue));
              }
            }}
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                name="qualification"
                label="Qualification *"
                placeholder="Select or type qualification and press Enter"
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
          <Autocomplete<string, true, false, true>
            multiple
            freeSolo
            autoHighlight
            openOnFocus
            forcePopupIcon
            size="small"
            options={LANGUAGES}
            value={formik.values.languages || []}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const trimmed = cleanItem(inputValue);
              const isExisting = options.some(
                (opt) => opt.toLowerCase() === trimmed.toLowerCase()
              );
              const isAlreadySelected = (formik.values.languages || []).some(
                (val: string) => val.toLowerCase() === trimmed.toLowerCase()
              );
              if (trimmed !== '' && !isExisting && !isAlreadySelected) {
                filtered.push(trimmed);
              }
              return filtered;
            }}
            onChange={(_: any, newValue: any) => {
              const cleaned = Array.from(
                new Set(
                  (newValue || [])
                    .map((item: any) =>
                      cleanItem(
                        typeof item === 'string'
                          ? item
                          : item?.value || item?.inputValue || String(item)
                      )
                    )
                    .filter(Boolean)
                )
              );
              formik.setFieldValue('languages', cleaned);
            }}
            renderValue={(value: readonly string[], getItemProps: AutocompleteRenderValueGetItemProps<true>) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getItemProps({ index });
                return (
                  <Chip
                    key={key}
                    variant="outlined"
                    label={cleanItem(option)}
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
                placeholder={formik.values.languages?.length ? '' : 'Select or type language (e.g. Malayalam) and press Enter'}
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
          <Autocomplete<string, true, false, true>
            multiple
            freeSolo
            autoHighlight
            openOnFocus
            forcePopupIcon
            size="small"
            options={formik.values.role === USER_ROLE.ASTROLOGER ? ASTROLOGY_SPECIALIZATIONS : SPECIALIZATIONS}
            value={formik.values.specializations || []}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const trimmed = cleanItem(inputValue);
              const isExisting = options.some(
                (opt) => opt.toLowerCase() === trimmed.toLowerCase()
              );
              const isAlreadySelected = (formik.values.specializations || []).some(
                (val: string) => val.toLowerCase() === trimmed.toLowerCase()
              );
              if (trimmed !== '' && !isExisting && !isAlreadySelected) {
                filtered.push(trimmed);
              }
              return filtered;
            }}
            onChange={(_: any, newValue: any) => {
              const cleaned = Array.from(
                new Set(
                  (newValue || [])
                    .map((s: any) =>
                      cleanItem(
                        typeof s === 'string'
                          ? s
                          : s?.value || s?.inputValue || String(s)
                      )
                    )
                    .filter(Boolean)
                )
              );
              formik.setFieldValue('specializations', cleaned);
            }}
            renderValue={(value: readonly string[], getItemProps: AutocompleteRenderValueGetItemProps<true>) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getItemProps({ index });
                return (
                  <Chip
                    key={key}
                    variant="outlined"
                    label={cleanItem(option)}
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
                label={formik.values.role === USER_ROLE.ASTROLOGER ? "Specializations (Astrology) *" : "Specializations *"}
                variant="outlined"
                placeholder={formik.values.specializations?.length ? '' : 'Select or type specializations and press Enter'}
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

        {/* Astrology Price (Only for Astrologer) */}
        {formik.values.role === USER_ROLE.ASTROLOGER && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              name="astrologyPrice"
              label="Astrology Price (₹) *"
              placeholder="e.g. 1000.00"
              variant="outlined"
              value={formik.values.astrologyPrice || formik.values.ratePerMinute || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                const parts = val.split('.');
                const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                formik.setFieldValue('astrologyPrice', sanitized);
                formik.setFieldValue('ratePerMinute', sanitized);
                formik.setFieldTouched('astrologyPrice', true, false);
              }}
              onBlur={formik.handleBlur}
              slotProps={{
                input: {
                  startAdornment: (
                    <CurrencyRupeeIcon sx={{ color: COLORS.PRIMARY, mr: 0.5, fontSize: 18 }} />
                  ),
                },
              }}
              error={
                formik.touched.astrologyPrice &&
                Boolean(formik.errors.astrologyPrice)
              }
              helperText={
                formik.touched.astrologyPrice && formik.errors.astrologyPrice
                  ? (formik.errors.astrologyPrice as string)
                  : undefined
              }
              sx={fieldSx}
            />
            {platformCommission && (
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: '0.8rem',
                  color: '#c2410c',
                  mt: 0.75,
                  ml: 1,
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Platform Commission: <strong>{platformCommission}%</strong> (will be deducted per consultation)
              </Typography>
            )}
          </Grid>
        )}

        {/* Bio */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#333', fontFamily: FONTS.PRIMARY }}>
                Bio (About Yourself) *
              </Typography>
              {Boolean(formik.values.bio && !isBioManuallyEdited) && (
                <Chip
                  label="Auto-filled"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '11px',
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 600,
                    bgcolor: 'rgba(255, 98, 0, 0.1)',
                    color: COLORS.PRIMARY,
                    border: '1px solid rgba(255, 98, 0, 0.25)',
                  }}
                />
              )}
            </Box>
            <Button
              type="button"
              size="small"
              variant="text"
              onClick={handleRegenerateBio}
              startIcon={<AutoAwesomeIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />}
              sx={{
                textTransform: 'none',
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                fontSize: '12px',
                color: COLORS.PRIMARY,
                p: '2px 8px',
                borderRadius: '6px',
                '&:hover': { bgcolor: 'rgba(255, 98, 0, 0.08)' },
              }}
            >
              Auto-generate Bio
            </Button>
          </Box>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={4}
            name="bio"
            placeholder="Tell us about your background, Vedic education, and ritual experience..."
            variant="outlined"
            value={formik.values.bio || ''}
            onKeyDown={allowOnlyDescriptionCharsOnKeyDown}
            onChange={(e) => {
              setIsBioManuallyEdited(true);
              formik.setFieldValue('bio', sanitizeDescriptionInput(e.target.value));
            }}
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={formik.touched.bio && (formik.errors.bio as string)}
            sx={fieldSx}
          />
        </Grid>

        {/* Availability (Only for Purohit) */}
        {formik.values.role !== USER_ROLE.ASTROLOGER && (
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
        )}
      </Grid>
    </Box>
  );
}

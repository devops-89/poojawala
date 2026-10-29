"use client";

import React, { useMemo } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  createFilterOptions,
  AutocompleteRenderValueGetItemProps,
} from "@mui/material";
import { State, City } from "@/utils/indianLocations";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { cleanItem } from "@/components/layouts/adminLayout/astrologers/EditAstrologerForm";

const filter = createFilterOptions<string>();

interface SkillsTabProps {
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  qualification: string;
  setQualification: (val: string) => void;
  experienceYears: string;
  setExperienceYears: (val: string) => void;
  languages: string[];
  handleLanguageChange?: (e: any) => void;
  setLanguages?: (val: string[]) => void;
  specializations: string[];
  handleRitualsChange?: (e: any) => void;
  setSpecializations?: (val: string[]) => void;
  isOnlineAvailable: boolean;
  setIsOnlineAvailable: (val: boolean) => void;
  isOfflineAvailable: boolean;
  setIsOfflineAvailable: (val: boolean) => void;
  saving: boolean;
  onSave: () => void;
  availableLanguages: string[];
  availableRituals: string[];
  isAstrologer?: boolean;
  ratePerMinute?: string;
  setRatePerMinute?: (val: string) => void;
  astrologyPrice?: string;
  setAstrologyPrice?: (val: string) => void;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({
  city,
  setCity,
  state,
  setState,
  qualification,
  setQualification,
  experienceYears,
  setExperienceYears,
  languages,
  handleLanguageChange,
  setLanguages,
  specializations,
  handleRitualsChange,
  setSpecializations,
  isOnlineAvailable,
  setIsOnlineAvailable,
  isOfflineAvailable,
  setIsOfflineAvailable,
  saving,
  onSave,
  availableLanguages,
  availableRituals,
  isAstrologer = false,
  ratePerMinute = "",
  setRatePerMinute,
  astrologyPrice,
  setAstrologyPrice,
}) => {
  // All Indian States from country-state-city
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry("IN") || [];
    return states.map((s) => s.name).sort((a, b) => a.localeCompare(b));
  }, []);

  // Dynamically filter cities based on selected state
  const cityOptions = useMemo(() => {
    if (!state) return [];
    const states = State.getStatesOfCountry("IN") || [];
    const selectedStateObj = states.find(
      (s) => s?.name?.toLowerCase().trim() === (state || "").toLowerCase().trim()
    );
    if (selectedStateObj && selectedStateObj.isoCode) {
      const cities = City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
      return Array.from(new Set(cities.map((c) => c.name))).sort((a, b) => a.localeCompare(b));
    }
    return [];
  }, [state]);

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          fontSize: "20px",
          mb: 3,
        }}
      >
        {isAstrologer ? "Astrology Details & Charges" : "Skills & Expertise"}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            openOnFocus
            autoHighlight
            forcePopupIcon
            options={stateOptions}
            value={state || null}
            onChange={(_, newValue) => {
              setState(newValue || "");
              setCity("");
            }}
            isOptionEqualToValue={(option, value) => {
              if (!value) return false;
              return option.toLowerCase().trim() === String(value).toLowerCase().trim();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="State"
                placeholder="Select State"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            openOnFocus
            autoHighlight
            forcePopupIcon
            disabled={!state}
            options={cityOptions}
            value={city || null}
            onChange={(_, newValue) => {
              setCity(newValue || "");
            }}
            isOptionEqualToValue={(option, value) => {
              if (!value) return false;
              return option.toLowerCase().trim() === String(value).toLowerCase().trim();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Base City"
                placeholder={!state ? "Select State first" : "Select City"}
                variant="outlined"
                helperText={!state ? "Select state first to choose city" : undefined}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Qualification / Degree"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder={
              isAstrologer
                ? "e.g. Acharya, Shastri, Jyotish Praveen"
                : "e.g. Acharya, Shastri, Ph.D. in Sanskrit"
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Years of Experience"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
          />
        </Grid>

        {isAstrologer && (setAstrologyPrice || setRatePerMinute) && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Astrology Price (₹) *"
              placeholder="e.g. 1000.00"
              value={astrologyPrice !== undefined ? astrologyPrice : ratePerMinute}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, "");
                const parts = val.split(".");
                const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : val;
                if (setAstrologyPrice) setAstrologyPrice(sanitized);
                if (setRatePerMinute) setRatePerMinute(sanitized);
              }}
              helperText="Consultation price charged for astrology consultation"
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: isAstrologer && !(setAstrologyPrice || setRatePerMinute) ? 12 : 6 }}>
          <Autocomplete<string, true, false, true>
            multiple
            freeSolo
            autoHighlight
            forcePopupIcon
            options={availableLanguages}
            value={languages || []}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const trimmed = cleanItem(inputValue);
              const isExisting = options.some(
                (opt) => opt.toLowerCase() === trimmed.toLowerCase()
              );
              const isAlreadySelected = (languages || []).some(
                (val: string) => val.toLowerCase() === trimmed.toLowerCase()
              );
              if (trimmed !== "" && !isExisting && !isAlreadySelected) {
                filtered.push(trimmed);
              }
              return filtered;
            }}
            onChange={(_, newValue) => {
              const cleaned = Array.from(
                new Set(
                  (newValue || [])
                    .map((item: any) =>
                      cleanItem(
                        typeof item === "string"
                          ? item
                          : item?.value || item?.inputValue || String(item)
                      )
                    )
                    .filter(Boolean)
                )
              );
              if (setLanguages) {
                setLanguages(cleaned);
              } else if (handleLanguageChange) {
                handleLanguageChange({ target: { value: cleaned } });
              }
            }}
            renderValue={(value: readonly string[], getItemProps: AutocompleteRenderValueGetItemProps<true>) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getItemProps({ index });
                return (
                  <Chip
                    key={key}
                    label={cleanItem(option)}
                    size="small"
                    sx={{
                      borderRadius: "6px",
                      bgcolor: "#FFF7ED",
                      borderColor: "#FFDBBD",
                      color: COLORS.PRIMARY,
                      fontWeight: 600,
                    }}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Languages Spoken"
                placeholder={languages?.length ? "" : "Select or type language (e.g. Malayalam) and press Enter"}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: isAstrologer ? 12 : 6 }}>
          <Autocomplete<string, true, false, true>
            multiple
            freeSolo
            autoHighlight
            forcePopupIcon
            options={availableRituals}
            value={specializations || []}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const trimmed = cleanItem(inputValue);
              const isExisting = options.some(
                (opt) => opt.toLowerCase() === trimmed.toLowerCase()
              );
              const isAlreadySelected = (specializations || []).some(
                (val: string) => val.toLowerCase() === trimmed.toLowerCase()
              );
              if (trimmed !== "" && !isExisting && !isAlreadySelected) {
                filtered.push(trimmed);
              }
              return filtered;
            }}
            onChange={(_, newValue) => {
              const cleaned = Array.from(
                new Set(
                  (newValue || [])
                    .map((item: any) =>
                      cleanItem(
                        typeof item === "string"
                          ? item
                          : item?.value || item?.inputValue || String(item)
                      )
                    )
                    .filter(Boolean)
                )
              );
              if (setSpecializations) {
                setSpecializations(cleaned);
              } else if (handleRitualsChange) {
                handleRitualsChange({ target: { value: cleaned } });
              }
            }}
            renderValue={(value: readonly string[], getItemProps: AutocompleteRenderValueGetItemProps<true>) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getItemProps({ index });
                return (
                  <Chip
                    key={key}
                    label={cleanItem(option)}
                    size="small"
                    sx={{
                      borderRadius: "6px",
                      bgcolor: "#FFF7ED",
                      borderColor: "#FFDBBD",
                      color: COLORS.PRIMARY,
                      fontWeight: 600,
                    }}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={
                  isAstrologer
                    ? "Astrology Specializations"
                    : "Specialized Rituals & Pujas"
                }
                placeholder={specializations?.length ? "" : "Select or type specialization and press Enter"}
              />
            )}
          />
        </Grid>

        {!isAstrologer && (
          <Grid size={{ xs: 12 }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "16px",
                mb: 1,
                mt: 2,
              }}
            >
              Service Modes Available
            </Typography>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isOnlineAvailable}
                    onChange={(e) => setIsOnlineAvailable(e.target.checked)}
                    color="warning"
                  />
                }
                label="Online Puja / Consultation"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isOfflineAvailable}
                    onChange={(e) => setIsOfflineAvailable(e.target.checked)}
                    color="warning"
                  />
                }
                label="In-Person / At Home Visit"
              />
            </Box>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={saving}
          sx={{
            background: "#FF6200 !important",
            color: "white !important",
            borderRadius: "8px",
            px: 4,
            py: 1.2,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { background: "#F05A00 !important" },
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

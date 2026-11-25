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
  isDirty?: boolean;
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
  isDirty = false,
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

  const inputFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: FONTS.OUTFIT,
      fontSize: { xs: "13px", sm: "14px" },
      bgcolor: "#FFFDF9",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: "#EFE6D5",
      },
      "&:hover fieldset": {
        borderColor: "#FFD4BC",
      },
      "&.Mui-focused fieldset": {
        borderColor: COLORS.PRIMARY,
      },
      "&.Mui-disabled": {
        bgcolor: "#F8FAFC",
        "& fieldset": {
          borderColor: "#E2E8F0",
        },
      },
    },
    "& .MuiInputBase-input, & .MuiOutlinedInput-input": {
      fontFamily: `${FONTS.OUTFIT} !important`,
      fontSize: { xs: "13px", sm: "14px" },
      color: "#1A1A1A",
    },
    "& .MuiInputLabel-root": {
      fontFamily: `${FONTS.OUTFIT} !important`,
      fontSize: { xs: "13px", sm: "14px" },
      color: "#64748B",
      "&.Mui-focused": {
        color: COLORS.PRIMARY,
      },
    },
    "& .MuiFormHelperText-root": {
      fontFamily: `${FONTS.OUTFIT} !important`,
      fontSize: "11.5px",
      color: "#94A3B8",
      mt: 0.5,
    },
  };

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          fontSize: { xs: "18px", sm: "20px" },
          color: "#1A1A1A",
          mb: { xs: 2, sm: 3 },
        }}
      >
        {isAstrologer ? "Astrology Details & Charges" : "Skills & Expertise"}
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
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
                sx={inputFieldSx}
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
                sx={inputFieldSx}
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
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Years of Experience"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            sx={inputFieldSx}
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
              sx={inputFieldSx}
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
                sx={inputFieldSx}
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
                    : "Specialized Rituals & Poojas"
                }
                placeholder={specializations?.length ? "" : "Select or type specialization and press Enter"}
                sx={inputFieldSx}
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
                label="Online Pooja / Consultation"
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

      <Box sx={{ mt: { xs: 3, sm: 4 }, display: "flex", justifyContent: { xs: "stretch", sm: "flex-end" } }}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={saving || !isDirty}
          sx={{
            width: { xs: "100%", sm: "auto" },
            background: (saving || !isDirty) ? "#cbd5e1 !important" : "#FF6200 !important",
            cursor: (saving || !isDirty) ? "not-allowed !important" : "pointer",
            color: (saving || !isDirty) ? "#64748b !important" : "white !important",
            borderRadius: "8px",
            px: 4,
            py: 1.2,
            height: "42px",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "14px",
            textTransform: "none",
            boxShadow: (saving || !isDirty) ? "none" : "0 4px 14px rgba(255, 98, 0, 0.25)",
            "&:hover": { background: (saving || !isDirty) ? "#cbd5e1 !important" : "#F05A00 !important" },
          }}
        >
          {saving ? "Saving..." : "Update Changes"}
        </Button>
      </Box>
    </Box>
  );
};

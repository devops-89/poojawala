"use client";
import React from "react";
import {
  Autocomplete,
  AutocompleteRenderValueGetItemProps,
  Box,
  Chip,
  Grid,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import {
  LANGUAGES,
  QUALIFICATIONS,
} from "@/components/layouts/portalLayout/register/constants";

export const ASTROLOGY_SPECIALIZATIONS = [
  "Vedic Astrology",
  "Kundali Matching",
  "Palmistry",
  "Numerology",
  "Vastu Shastra",
  "Tarot Reading",
  "Prashna Kundali",
  "Face Reading",
  "KP Astrology",
  "Gemology",
  "Pooja Anushthan",
  "Karmakand",
];

const filter = createFilterOptions<string>();

export const cleanItem = (item: any): string => {
  if (item === null || item === undefined) return "";
  let str = String(item).trim();
  let prev = "";
  while (str !== prev) {
    prev = str;
    str = str.replace(/^["'\\/]+|["'\\/]+$/g, "").trim();
  }
  str = str.replace(/\\"/g, '"').replace(/\\'/g, "'").trim();
  prev = "";
  while (str !== prev) {
    prev = str;
    str = str.replace(/^["'\\/]+|["'\\/]+$/g, "").trim();
  }
  return str;
};

export const parseList = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return Array.from(new Set(data.map(cleanItem).filter(Boolean)));
  }
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return Array.from(new Set(parsed.map(cleanItem).filter(Boolean)));
        }
      } catch {}
    }
    return Array.from(
      new Set(
        trimmed
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map(cleanItem)
          .filter(Boolean)
      )
    );
  }
  return [];
};

interface AstrologerProfileSectionProps {
  values: any;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  stateOptions: string[];
  cityOptions: string[];
}

export const AstrologerProfileSection: React.FC<AstrologerProfileSectionProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  stateOptions,
  cityOptions,
}) => {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
        <AutoAwesomeIcon sx={{ color: COLORS.PRIMARY }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          2. Astrologer Profile & Credentials
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {/* Rate Per Minute */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="ratePerMinute"
            label="Consultation Rate Per Minute (₹) *"
            placeholder="e.g. 50.00"
            variant="outlined"
            value={values.ratePerMinute}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, "");
              const parts = val.split(".");
              const sanitized =
                parts.length > 2
                  ? `${parts[0]}.${parts.slice(1).join("")}`
                  : val;
              setFieldValue("ratePerMinute", sanitized);
            }}
            onBlur={handleBlur}
            slotProps={{
              input: {
                startAdornment: (
                  <CurrencyRupeeIcon
                    sx={{ color: COLORS.PRIMARY, mr: 0.5, fontSize: 20 }}
                  />
                ),
              },
            }}
            error={
              Boolean(errors.ratePerMinute) &&
              (touched.ratePerMinute || Boolean(values.ratePerMinute))
            }
            helperText={
              touched.ratePerMinute || Boolean(values.ratePerMinute)
                ? (errors.ratePerMinute as string)
                : "Price charged per minute for astrology consultation"
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* Aadhaar Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="aadhaarNumber"
            label="Aadhaar Number *"
            variant="outlined"
            value={values.aadhaarNumber || ""}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 12);
              setFieldValue("aadhaarNumber", val);
            }}
            slotProps={{
              htmlInput: { maxLength: 12, inputMode: "numeric" },
            }}
            error={
              Boolean(errors.aadhaarNumber) &&
              (touched.aadhaarNumber || Boolean(values.aadhaarNumber))
            }
            helperText={
              touched.aadhaarNumber || Boolean(values.aadhaarNumber)
                ? (errors.aadhaarNumber as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* State */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            options={stateOptions}
            value={values.state || ""}
            onChange={(_, newValue) => {
              const val = (newValue || "").replace(/[^a-zA-Z\s.-]/g, "");
              setFieldValue("state", val);
              setFieldValue("city", "");
            }}
            onInputChange={(_, newInputValue) => {
              const val = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
              setFieldValue("state", val);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="state"
                label="State *"
                variant="outlined"
                error={touched.state && Boolean(errors.state)}
                helperText={touched.state && (errors.state as string)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            disabled={!values.state}
            options={cityOptions}
            value={values.city || ""}
            onChange={(_, newValue) => {
              const val = (newValue || "").replace(/[^a-zA-Z\s.-]/g, "");
              setFieldValue("city", val);
            }}
            onInputChange={(_, newInputValue) => {
              const val = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
              setFieldValue("city", val);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="city"
                label="City *"
                placeholder={
                  !values.state
                    ? "Select State first"
                    : "Select or type City"
                }
                variant="outlined"
                error={touched.city && Boolean(errors.city)}
                helperText={
                  touched.city
                    ? (errors.city as string)
                    : !values.state
                    ? "Select state to enable city selection"
                    : undefined
                }
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            )}
          />
        </Grid>

        {/* Qualification */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            freeSolo
            autoHighlight
            forcePopupIcon
            options={QUALIFICATIONS}
            value={values.qualification || ""}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const trimmed = cleanItem(inputValue);
              const isExisting = options.some(
                (opt) => opt.toLowerCase() === trimmed.toLowerCase()
              );
              if (trimmed !== "" && !isExisting) {
                filtered.push(trimmed);
              }
              return filtered;
            }}
            onChange={(_, newValue) => {
              const val = cleanItem(
                typeof newValue === "string" ? newValue : newValue || ""
              );
              setFieldValue("qualification", val);
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === "input") {
                setFieldValue("qualification", cleanItem(newInputValue));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="qualification"
                label="Qualification *"
                placeholder="Select or type qualification and press Enter"
                variant="outlined"
                error={Boolean(
                  touched.qualification && errors.qualification
                )}
                helperText={
                  touched.qualification &&
                  (errors.qualification as string)
                }
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            )}
          />
        </Grid>

        {/* Experience (Years) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="experienceYears"
            label="Experience (Years) *"
            variant="outlined"
            value={values.experienceYears || ""}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              setFieldValue("experienceYears", val);
            }}
            error={Boolean(
              touched.experienceYears && errors.experienceYears
            )}
            helperText={
              touched.experienceYears &&
              (errors.experienceYears as string)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* Languages Multi-Select */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete<string, true, false, true>
            multiple
            freeSolo
            autoHighlight
            forcePopupIcon
            options={LANGUAGES}
            value={values.languages || []}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const trimmed = cleanItem(inputValue);
              const isExisting = options.some(
                (opt) => opt.toLowerCase() === trimmed.toLowerCase()
              );
              const isAlreadySelected = (values.languages || []).some(
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
              setFieldValue("languages", cleaned);
            }}
            renderValue={(
              value: readonly string[],
              getItemProps: AutocompleteRenderValueGetItemProps<true>
            ) =>
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
                name="languages"
                label="Languages Spoken *"
                variant="outlined"
                placeholder={
                  values.languages?.length
                    ? ""
                    : "Select or type language (e.g. Malayalam) and press Enter"
                }
                error={Boolean(touched.languages && errors.languages)}
                helperText={
                  touched.languages && (errors.languages as string)
                }
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            )}
          />
        </Grid>

        {/* Astrology Specializations Multi-Select */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete<string, true, false, true>
            multiple
            freeSolo
            autoHighlight
            forcePopupIcon
            options={ASTROLOGY_SPECIALIZATIONS}
            value={values.specializations || []}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const trimmed = cleanItem(inputValue);
              const isExisting = options.some(
                (opt) => opt.toLowerCase() === trimmed.toLowerCase()
              );
              const isAlreadySelected = (
                values.specializations || []
              ).some(
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
              setFieldValue("specializations", cleaned);
            }}
            renderValue={(
              value: readonly string[],
              getItemProps: AutocompleteRenderValueGetItemProps<true>
            ) =>
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
                name="specializations"
                label="Astrology Specializations *"
                variant="outlined"
                placeholder={
                  values.specializations?.length
                    ? ""
                    : "Select or type specialization and press Enter"
                }
                error={Boolean(
                  touched.specializations && errors.specializations
                )}
                helperText={
                  touched.specializations &&
                  (errors.specializations as string)
                }
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
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
            label="Short Bio *"
            variant="outlined"
            value={values.bio || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Write a brief introduction about astrology expertise, consulting approach..."
            error={Boolean(errors.bio && (touched.bio || values.bio))}
            helperText={
              touched.bio || Boolean(values.bio)
                ? (errors.bio as string)
                : undefined
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

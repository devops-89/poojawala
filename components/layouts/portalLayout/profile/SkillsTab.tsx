"use client";

import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

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
  handleLanguageChange: (e: any) => void;
  specializations: string[];
  handleRitualsChange: (e: any) => void;
  isOnlineAvailable: boolean;
  setIsOnlineAvailable: (val: boolean) => void;
  isOfflineAvailable: boolean;
  setIsOfflineAvailable: (val: boolean) => void;
  saving: boolean;
  onSave: () => void;
  availableLanguages: string[];
  availableRituals: string[];
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
  specializations,
  handleRitualsChange,
  isOnlineAvailable,
  setIsOnlineAvailable,
  isOfflineAvailable,
  setIsOfflineAvailable,
  saving,
  onSave,
  availableLanguages,
  availableRituals,
}) => {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 800,
          fontSize: "20px",
          mb: 3,
        }}
      >
        Skills & Expertise
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g. Uttar Pradesh, Maharashtra"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Base City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Qualification / Degree"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="e.g. Acharya, Shastri, Ph.D. in Sanskrit"
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="languages-label">Languages Spoken</InputLabel>
            <Select
              labelId="languages-label"
              multiple
              value={languages}
              onChange={handleLanguageChange}
              input={<OutlinedInput label="Languages Spoken" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableLanguages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  <Checkbox checked={languages.indexOf(lang) > -1} />
                  <ListItemText primary={lang} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="rituals-label">Specialized Rituals & Pujas</InputLabel>
            <Select
              labelId="rituals-label"
              multiple
              value={specializations}
              onChange={handleRitualsChange}
              input={<OutlinedInput label="Specialized Rituals & Pujas" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableRituals.map((ritual) => (
                <MenuItem key={ritual} value={ritual}>
                  <Checkbox checked={specializations.indexOf(ritual) > -1} />
                  <ListItemText primary={ritual} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
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

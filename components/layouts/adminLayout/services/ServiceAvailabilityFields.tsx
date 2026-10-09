"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { Box, FormControlLabel, Grid, Switch, TextField, Typography } from "@mui/material";
import React from "react";

interface ServiceAvailabilityFieldsProps {
  values: {
    requiresVenue: boolean;
    isActive?: boolean;
    isUpcomingFestival: boolean;
    festivalStartDate: string;
    festivalEndDate: string;
  };
  errors: Record<string, any>;
  touched: Record<string, any>;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement>;
  showStatusSwitch?: boolean;
}

export default function ServiceAvailabilityFields({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  showStatusSwitch = false,
}: ServiceAvailabilityFieldsProps) {
  return (
    <Grid size={{ xs: 12 }}>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          mb: 1,
          color: "#1e293b",
        }}
      >
        Availability Settings
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 1 }}>
        <FormControlLabel
          control={
            <Switch
              name="requiresVenue"
              checked={Boolean(values.requiresVenue)}
              onChange={handleChange}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: COLORS.PRIMARY,
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: COLORS.PRIMARY,
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                color: "#475569",
              }}
            >
              Requires Venue
            </Typography>
          }
        />



        <FormControlLabel
          control={
            <Switch
              name="isUpcomingFestival"
              checked={Boolean(values.isUpcomingFestival)}
              onChange={handleChange}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: COLORS.PRIMARY,
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: COLORS.PRIMARY,
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                color: "#475569",
              }}
            >
              Upcoming Festival
            </Typography>
          }
        />
      </Box>

      {values.isUpcomingFestival && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="festivalStartDate"
              label="Festival Start Date *"
              variant="outlined"
              type="datetime-local"
              slotProps={{ inputLabel: { shrink: true } }}
              value={values.festivalStartDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.festivalStartDate && Boolean(errors.festivalStartDate)
              }
              helperText={
                touched.festivalStartDate && errors.festivalStartDate
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="festivalEndDate"
              label="Festival End Date *"
              variant="outlined"
              type="datetime-local"
              slotProps={{ inputLabel: { shrink: true } }}
              value={values.festivalEndDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.festivalEndDate && Boolean(errors.festivalEndDate)}
              helperText={touched.festivalEndDate && errors.festivalEndDate}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

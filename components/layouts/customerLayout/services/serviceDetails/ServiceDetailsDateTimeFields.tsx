"use client";

import React from "react";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FONTS } from "@/utils/fonts";

interface ServiceDetailsDateTimeFieldsProps {
  scheduledDate: string;
  scheduledTime: string;
  todayStr: string;
  timeOptions: { value: string; label: string; disabled: boolean }[];
  isAllSlotsPassedToday: boolean;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export default function ServiceDetailsDateTimeFields({
  scheduledDate,
  scheduledTime,
  todayStr,
  timeOptions,
  isAllSlotsPassedToday,
  onDateChange,
  onTimeChange,
}: ServiceDetailsDateTimeFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Scheduled Date"
          type="date"
          value={scheduledDate}
          onChange={(e) => onDateChange(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: todayStr },
          }}
          required
          sx={{
            bgcolor: "#FFFBF7",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontFamily: FONTS.PRIMARY,
            },
            "& .MuiInputLabel-root": {
              fontFamily: FONTS.PRIMARY,
              color: "#64534A",
            },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl
          fullWidth
          required
          sx={{
            bgcolor: "#FFFBF7",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontFamily: FONTS.PRIMARY,
            },
            "& .MuiInputLabel-root": {
              fontFamily: FONTS.PRIMARY,
              color: "#64534A",
            },
          }}
        >
          <InputLabel id="preferred-time-label" shrink>
            Preferred Time
          </InputLabel>
          <Select
            labelId="preferred-time-label"
            value={scheduledTime}
            label="Preferred Time"
            displayEmpty
            onChange={(e) => onTimeChange(e.target.value)}
            required
            MenuProps={{
              disableScrollLock: true,
              slotProps: {
                paper: {
                  sx: {
                    maxHeight: 280,
                    borderRadius: "10px",
                  },
                },
              },
            }}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <span style={{ color: "#9E9E9E", fontFamily: FONTS.PRIMARY }}>
                    Select Time (08:00 AM - 08:00 PM)
                  </span>
                );
              }
              const match = timeOptions.find((t) => t.value === selected);
              return match ? match.label : selected;
            }}
            sx={{
              borderRadius: "10px",
              fontFamily: FONTS.PRIMARY,
            }}
          >
            <MenuItem value="" disabled sx={{ fontFamily: FONTS.PRIMARY, color: "#8C7A6B" }}>
              Select Time (08:00 AM - 08:00 PM)
            </MenuItem>
            {timeOptions.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  color: opt.disabled ? "#BDBDBD" : "inherit",
                }}
              >
                {opt.label} {opt.disabled ? "(Passed)" : ""}
              </MenuItem>
            ))}
          </Select>
          {isAllSlotsPassedToday && (
            <FormHelperText sx={{ color: "#d97706", fontFamily: FONTS.PRIMARY, mt: 0.5 }}>
              Slots for today are closed (8:00 AM - 8:00 PM). Please choose another date.
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
}

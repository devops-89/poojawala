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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { FONTS } from "@/utils/fonts";

interface ServiceDetailsDateTimeFieldsProps {
  scheduledDate: string;
  scheduledTime: string;
  todayStr: string;
  timeOptions: { value: string; label: string; disabled: boolean }[];
  isAllSlotsPassedToday: boolean;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateError?: string;
  timeError?: string;
}

export default function ServiceDetailsDateTimeFields({
  scheduledDate,
  scheduledTime,
  todayStr,
  timeOptions,
  isAllSlotsPassedToday,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: ServiceDetailsDateTimeFieldsProps) {
  const [openCalendar, setOpenCalendar] = React.useState(false);


  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="Scheduled Date"
            format="DD/MM/YYYY"
            value={scheduledDate ? moment(scheduledDate, "YYYY-MM-DD") : null}
            minDate={todayStr ? moment(todayStr, "YYYY-MM-DD") : moment().startOf("day")}
            maxDate={moment().add(3, "months").endOf("day")}
            open={openCalendar}
            onOpen={() => setOpenCalendar(true)}
            onClose={() => setOpenCalendar(false)}
            onChange={(newValue) => {
              if (newValue && newValue.isValid()) {
                onDateChange(newValue.format("YYYY-MM-DD"));
              } else {
                onDateChange("");
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: Boolean(dateError),
                helperText: dateError,
                onClick: () => setOpenCalendar(true),
                sx: {
                  bgcolor: "#FFFBF7",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontFamily: FONTS.PRIMARY,
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: FONTS.PRIMARY,
                    color: Boolean(dateError) ? "#d32f2f" : "#64534A",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl
          fullWidth
          error={Boolean(timeError)}
          sx={{
            bgcolor: "#FFFBF7",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontFamily: FONTS.PRIMARY,
            },
            "& .MuiInputLabel-root": {
              fontFamily: FONTS.PRIMARY,
              color: Boolean(timeError) ? "#d32f2f" : "#64534A",
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
            error={Boolean(timeError)}
            MenuProps={{
              slotProps: {
                paper: {
                  sx: {
                    maxHeight: 280,
                    overflowY: "auto",
                    borderRadius: "10px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    mt: 0.5,
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
          {timeError ? (
            <FormHelperText error sx={{ fontFamily: FONTS.PRIMARY, mt: 0.5 }}>
              {timeError}
            </FormHelperText>
          ) : isAllSlotsPassedToday ? (
            <FormHelperText sx={{ color: "#d97706", fontFamily: FONTS.PRIMARY, mt: 0.5 }}>
              Slots for today are closed (minimum 2 hours advance booking required). Please choose another date.
            </FormHelperText>
          ) : scheduledDate === todayStr ? (
            <FormHelperText sx={{ color: "#8C7A6B", fontFamily: FONTS.PRIMARY, mt: 0.5 }}>
              Note: Same-day pooja bookings require at least 2 hours advance notice.
            </FormHelperText>
          ) : null}
        </FormControl>
      </Grid>
    </Grid>
  );
}

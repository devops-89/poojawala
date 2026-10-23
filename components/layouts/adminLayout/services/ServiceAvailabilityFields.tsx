"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

interface ServiceAvailabilityFieldsProps {
  values: {
    requiresVenue: boolean;
    isActive?: boolean;
    isUpcomingFestival: boolean;
    festivalStartDate: string;
    festivalEndDate: string;
    isOnline?: boolean;
    isOffline?: boolean;
  };
  errors: Record<string, any>;
  touched: Record<string, any>;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement>;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  showStatusSwitch?: boolean;
}

export default function ServiceAvailabilityFields({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}: ServiceAvailabilityFieldsProps) {
  const isOnline = Boolean(values.isOnline);
  const isOffline = Boolean(values.isOffline);
  const hasModeError = (!isOnline && !isOffline) || (isOnline && isOffline);

  const handleSelectMode = (mode: "online" | "offline") => {
    if (setFieldValue) {
      if (mode === "online") {
        setFieldValue("isOnline", true, true);
        setFieldValue("isOffline", false, true);
        setFieldValue("requiresVenue", false, false);
      } else {
        setFieldValue("isOnline", false, true);
        setFieldValue("isOffline", true, true);
      }
    }
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          p: 3,
          bgcolor: "#f8fafc",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "1.05rem",
              mb: 0.5,
            }}
          >
            Service Mode & Availability
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
            Select whether this ritual is conducted Online (virtual) or Offline (in-person).
          </Typography>
        </Box>

        {/* Note Callout */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            px: 2,
            mb: 2.5,
            bgcolor: "#fff7ed",
            border: "1px solid #ffedd5",
            borderRadius: "10px",
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 19, color: "#ea580c", flexShrink: 0 }} />
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "0.86rem",
              fontWeight: 600,
              color: "#9a3412",
            }}
          >
            Note: You can select only one service mode — either Online Mode or Offline Mode.
          </Typography>
        </Box>

        {/* Mode & Availability Switches */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
          <FormControlLabel
            control={
              <Switch
                name="isOnline"
                checked={isOnline}
                onChange={() => handleSelectMode("online")}
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
                  fontWeight: isOnline ? 700 : 500,
                  color: isOnline ? "#ea580c" : "#475569",
                }}
              >
                Online Mode
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Switch
                name="isOffline"
                checked={isOffline}
                onChange={() => handleSelectMode("offline")}
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
                  fontWeight: isOffline ? 700 : 500,
                  color: isOffline ? "#ea580c" : "#475569",
                }}
              >
                Offline Mode
              </Typography>
            }
          />

          {isOffline && (
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
          )}

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

        {/* Mode validation error */}
        {hasModeError && (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#d32f2f",
              fontSize: "0.82rem",
              fontWeight: 600,
              mt: 1.5,
            }}
          >
            {errors.isOnline ||
              errors.isOffline ||
              "Please select exactly one service mode: Online or Offline."}
          </Typography>
        )}

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
                    bgcolor: "white",
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
                error={
                  touched.festivalEndDate && Boolean(errors.festivalEndDate)
                }
                helperText={touched.festivalEndDate && errors.festivalEndDate}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Grid>
  );
}

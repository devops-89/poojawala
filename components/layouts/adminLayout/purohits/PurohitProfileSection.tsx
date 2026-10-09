"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React from "react";
import {
  Autocomplete,
  Box,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import BadgesIcon from "@mui/icons-material/AssignmentInd";
import {
  LANGUAGES,
  QUALIFICATIONS,
  SPECIALIZATIONS,
} from "@/components/layouts/portalLayout/register/constants";

interface PurohitProfileSectionProps {
  values: any;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  stateOptions: string[];
  cityOptions: string[];
}

export const PurohitProfileSection: React.FC<PurohitProfileSectionProps> = ({
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
        <BadgesIcon sx={{ color: COLORS.PRIMARY }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          2. Purohit Profile & Credentials
        </Typography>
      </Box>
      <Grid container spacing={2.5}>
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

        {/* Aadhaar Number Field */}
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
            error={touched.aadhaarNumber && Boolean(errors.aadhaarNumber)}
            helperText={
              touched.aadhaarNumber && (errors.aadhaarNumber as string)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* Qualification Dropdown */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            options={QUALIFICATIONS}
            value={values.qualification || ""}
            onChange={(_, newValue) => {
              setFieldValue("qualification", newValue || "");
            }}
            onInputChange={(_, newInputValue) => {
              setFieldValue("qualification", newInputValue || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="qualification"
                label="Qualification *"
                variant="outlined"
                error={touched.qualification && Boolean(errors.qualification)}
                helperText={
                  touched.qualification && (errors.qualification as string)
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
            error={touched.experienceYears && Boolean(errors.experienceYears)}
            helperText={
              touched.experienceYears && (errors.experienceYears as string)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* Languages Multi-Select Dropdown */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete<string, true>
            multiple
            forcePopupIcon
            options={LANGUAGES}
            value={values.languages || []}
            onChange={(_, newValue) => {
              setFieldValue("languages", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="languages"
                label="Languages Spoken *"
                variant="outlined"
                placeholder="Select languages"
                error={touched.languages && Boolean(errors.languages)}
                helperText={touched.languages && (errors.languages as string)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            )}
          />
        </Grid>

        {/* Specializations Multi-Select Dropdown */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Autocomplete<string, true>
            multiple
            forcePopupIcon
            options={SPECIALIZATIONS}
            value={values.specializations || []}
            onChange={(_, newValue) => {
              setFieldValue("specializations", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                name="specializations"
                label="Specializations *"
                variant="outlined"
                placeholder="Select specializations"
                error={
                  touched.specializations && Boolean(errors.specializations)
                }
                helperText={
                  touched.specializations && (errors.specializations as string)
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
            placeholder="Write a brief introduction about yourself and your experience..."
            error={touched.bio && Boolean(errors.bio)}
            helperText={touched.bio && (errors.bio as string)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* Availability Switches */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={values.isOnlineAvailable}
                  onChange={(e) =>
                    setFieldValue("isOnlineAvailable", e.target.checked)
                  }
                  color="warning"
                />
              }
              label="Online Puja Available"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={values.isOfflineAvailable}
                  onChange={(e) =>
                    setFieldValue("isOfflineAvailable", e.target.checked)
                  }
                  color="warning"
                />
              }
              label="Offline Puja Available"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { MuiTelInput } from "@/components/widgets/MuiTelInput";
import { convertImageToWebP } from "@/utils/imageHelper";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

interface PersonalInfoTabProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  birthPlace: string;
  setBirthPlace: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  profileImage: File | null;
  setProfileImage: (file: File | null) => void;
  profileImageUrl: string | null;
  saving: boolean;
  onSave: () => void;
  maxDobDate: string;
  isDirty?: boolean;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  username,
  setUsername,
  email,
  setEmail,
  phone,
  setPhone,
  dob,
  setDob,
  birthPlace,
  setBirthPlace,
  bio,
  setBio,
  profileImage,
  setProfileImage,
  profileImageUrl,
  saving,
  onSave,
  maxDobDate,
  isDirty = false,
}) => {
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
        Personal Info
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 3.5 } }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : profileImageUrl || undefined
            }
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              border: "3px solid #FFE0D0",
              bgcolor: COLORS.PRIMARY,
            }}
          >
            {!profileImage && !profileImageUrl && (
              <PersonIcon sx={{ fontSize: { xs: 48, sm: 60 }, color: "white" }} />
            )}
          </Avatar>
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: -4,
              right: -4,
              bgcolor: COLORS.PRIMARY,
              color: "white",
              "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
              width: { xs: 30, sm: 34 },
              height: { xs: 30, sm: 34 },
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <PhotoCameraIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const webpFile = await convertImageToWebP(e.target.files[0]);
                  setProfileImage(webpFile);
                }
              }}
            />
          </IconButton>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: { xs: "16px", sm: "18px" },
              color: "#1A1A1A",
            }}
          >
            Profile Photo
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: { xs: "12.5px", sm: "13px" },
              mt: 0.3,
            }}
          >
            Upload a clear passport size photograph.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            disabled
            helperText="Email cannot be changed"
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MuiTelInput
            fullWidth
            label="Mobile Number"
            value={phone ? (phone.startsWith("+91") ? phone : `+91${phone}`) : ""}
            disabled
            defaultCountry="IN"
            disableDropdown
            helperText="Mobile number cannot be changed"
            sx={{
              ...inputFieldSx,
              "& .MuiTelInput-IconButton": {
                pointerEvents: "none",
                cursor: "default",
              },
              "& .MuiTelInput-Button": {
                pointerEvents: "none",
                cursor: "default",
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date of Birth"
              format="DD/MM/YYYY"
              value={dob ? moment(dob, "YYYY-MM-DD") : null}
              maxDate={maxDobDate ? moment(maxDobDate) : undefined}
              onChange={(newValue) => {
                if (newValue && newValue.isValid()) {
                  setDob(newValue.format("YYYY-MM-DD"));
                } else {
                  setDob("");
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: inputFieldSx,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Short Bio / Introduction"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your background, lineage, or experience..."
            sx={inputFieldSx}
          />
        </Grid>
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

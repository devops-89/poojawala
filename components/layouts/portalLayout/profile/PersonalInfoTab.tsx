"use client";

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
        Personal Info
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : profileImageUrl || undefined
            }
            sx={{
              width: 100,
              height: 100,
              border: "2px solid #FFE0D0",
              bgcolor: "#FF6200",
            }}
          >
            {!profileImage && !profileImageUrl && (
              <PersonIcon sx={{ fontSize: 60, color: "white" }} />
            )}
          </Avatar>
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: -5,
              right: -5,
              bgcolor: "#FF6200",
              color: "white",
              "&:hover": { bgcolor: "#F05A00" },
              width: 32,
              height: 32,
            }}
          >
            <PhotoCameraIcon sx={{ fontSize: 18 }} />
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
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            Profile Photo
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#666",
              fontSize: "13px",
            }}
          >
            Upload a clear passport size photograph.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            disabled
            helperText="Email cannot be changed"
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
          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: maxDobDate },
            }}
          />
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
          />
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

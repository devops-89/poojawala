"use client";
import React from "react";
import { FONTS } from "@/utils/fonts";
import {
  allowOnlyAddressCharsOnKeyDown,
  allowOnlyTitleCharsOnKeyDown,
  sanitizeTitleInput,
} from "@/utils/helpers";
import { TiptapEditor } from "@/components/widgets/TiptapEditor";
import { MuiTelInput } from "mui-tel-input";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import {
  Autocomplete,
  Box,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { inputSx, labelSx } from "@/utils/templeFormUtils";

interface TempleProfileSectionProps {
  formik: any;
  stateOptions: string[];
  cityOptions: string[];
}

export default function TempleProfileSection({
  formik,
  stateOptions,
  cityOptions,
}: TempleProfileSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "18px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {/* Section Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: "10px",
            bgcolor: "#FFF7ED",
            color: "#EA580C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 0.3,
          }}
        >
          <TempleHinduIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "1.15rem",
              color: "#1E293B",
            }}
          >
            1. Temple Profile & Location Details
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: "0.85rem",
              mt: 0.25,
            }}
          >
            Essential information about the shrine and managing authority.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 0.5 }} />

      <Grid container spacing={2.5}>
        {/* Temple Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelSx}>
            TEMPLE / SHRINE NAME <span style={{ color: "#DC2626" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="name"
            placeholder="e.g. Shree Siddhivinayak Temple"
            value={formik.values.name}
            onKeyDown={allowOnlyTitleCharsOnKeyDown}
            onChange={(e) => {
              formik.setFieldValue("name", sanitizeTitleInput(e.target.value));
              formik.setFieldTouched("name", true, false);
            }}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.name && formik.errors.name)}
            helperText={formik.touched.name ? formik.errors.name : undefined}
            sx={inputSx}
          />
        </Grid>

        {/* Primary Deity */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelSx}>
            PRIMARY DEITY <span style={{ color: "#DC2626" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="primaryDeity"
            placeholder="e.g. Lord Ganesha / Lord Shiva"
            value={formik.values.primaryDeity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.primaryDeity && formik.errors.primaryDeity
            )}
            helperText={
              formik.touched.primaryDeity
                ? formik.errors.primaryDeity
                : undefined
            }
            sx={inputSx}
          />
        </Grid>

        {/* Managing Trust / Committee Name */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={labelSx}>MANAGING TRUST / COMMITTEE NAME</Typography>
          <TextField
            fullWidth
            name="trustName"
            placeholder="e.g. Shree Siddhivinayak Temple Trust"
            value={formik.values.trustName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={inputSx}
          />
        </Grid>

        {/* Contact Person / Trustee */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelSx}>
            CONTACT PERSON / TRUSTEE <span style={{ color: "#DC2626" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="contactName"
            placeholder="Trustee Name"
            value={formik.values.contactName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.contactName && formik.errors.contactName
            )}
            helperText={
              formik.touched.contactName
                ? formik.errors.contactName
                : undefined
            }
            sx={inputSx}
          />
        </Grid>

        {/* Phone Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelSx}>
            PHONE NUMBER <span style={{ color: "#DC2626" }}>*</span>
          </Typography>
          <MuiTelInput
            fullWidth
            name="phone"
            variant="outlined"
            defaultCountry="IN"
            disableDropdown
            onlyCountries={["IN"]}
            value={
              formik.values.phone
                ? formik.values.phone.startsWith("+91")
                  ? formik.values.phone
                  : `+91${formik.values.phone}`
                : "+91"
            }
            onChange={(newValue, info) => {
              const natNum = (info.nationalNumber || "")
                .replace(/\D/g, "")
                .slice(0, 10);
              formik.setFieldValue("phone", natNum);
              formik.setFieldTouched("phone", true, false);
            }}
            onBlur={formik.handleBlur}
            onKeyDown={(e) => {
              if (formik.values.phone && formik.values.phone.length >= 10) {
                if (
                  ![
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }
            }}
            error={
              (formik.touched.phone || Boolean(formik.values.phone)) &&
              (Boolean(formik.errors.phone) ||
                (formik.values.phone &&
                  formik.values.phone.length > 0 &&
                  !/^[6-9]/.test(formik.values.phone)))
            }
            helperText={
              formik.values.phone &&
              formik.values.phone.length > 0 &&
              !/^[6-9]/.test(formik.values.phone)
                ? "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                : formik.touched.phone
                ? (formik.errors.phone as string)
                : undefined
            }
            sx={{
              ...inputSx,
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

        {/* Official Email */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={labelSx}>OFFICIAL EMAIL ADDRESS</Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="trust@templedomain.org"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.email && formik.errors.email)}
            helperText={formik.touched.email ? formik.errors.email : undefined}
            sx={inputSx}
          />
        </Grid>

        {/* Street Location / Address */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={labelSx}>
            ADDRESS / STREET LOCATION <span style={{ color: "#DC2626" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="address"
            placeholder="Street, Landmark, Area"
            value={formik.values.address}
            onKeyDown={allowOnlyAddressCharsOnKeyDown}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.address && formik.errors.address)}
            helperText={
              formik.touched.address ? formik.errors.address : undefined
            }
            sx={inputSx}
          />
        </Grid>

        {/* State & City */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelSx}>
            STATE <span style={{ color: "#DC2626" }}>*</span>
          </Typography>
          <Autocomplete
            freeSolo
            forcePopupIcon
            options={stateOptions}
            value={formik.values.state || ""}
            onChange={(_, newValue) => {
              const val = (newValue || "").replace(/[^a-zA-Z\s.-]/g, "");
              formik.setFieldValue("state", val, true);
              formik.setFieldTouched("state", true, false);
              formik.setFieldValue("city", "");
              formik.setFieldTouched("city", false, false);
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === "input") {
                const val = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                formik.setFieldValue("state", val, true);
                formik.setFieldTouched("state", true, false);
              } else if (reason === "clear") {
                formik.setFieldValue("state", "");
                formik.setFieldTouched("state", true, false);
                formik.setFieldValue("city", "");
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select or type State"
                error={Boolean(
                  formik.touched.state &&
                    formik.errors.state &&
                    !formik.values.state?.trim()
                )}
                helperText={
                  formik.touched.state &&
                  formik.errors.state &&
                  !formik.values.state?.trim()
                    ? (formik.errors.state as string)
                    : undefined
                }
                sx={inputSx}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelSx}>
            CITY <span style={{ color: "#DC2626" }}>*</span>
          </Typography>
          <Autocomplete
            freeSolo
            forcePopupIcon
            disabled={!formik.values.state}
            options={cityOptions}
            value={formik.values.city || ""}
            onChange={(_, newValue) => {
              const val = (newValue || "").replace(/[^a-zA-Z\s.-]/g, "");
              formik.setFieldValue("city", val, true);
              formik.setFieldTouched("city", true, false);
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === "input") {
                const val = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                formik.setFieldValue("city", val, true);
                formik.setFieldTouched("city", true, false);
              } else if (reason === "clear") {
                formik.setFieldValue("city", "");
                formik.setFieldTouched("city", true, false);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  !formik.values.state
                    ? "Select State first"
                    : "Select or type City"
                }
                error={Boolean(
                  formik.touched.city &&
                    formik.errors.city &&
                    !formik.values.city?.trim()
                )}
                helperText={
                  formik.touched.city &&
                  formik.errors.city &&
                  !formik.values.city?.trim()
                    ? (formik.errors.city as string)
                    : undefined
                }
                sx={inputSx}
              />
            )}
          />
        </Grid>

        {/* About / Description (Rich Text Editor) */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={labelSx}>
            ABOUT / TEMPLE DESCRIPTION{" "}
            <span style={{ color: "#DC2626" }}>*</span>
          </Typography>
          <TiptapEditor
            label=""
            value={formik.values.description}
            onChange={(html) => {
              formik.setFieldValue("description", html);
              formik.setFieldTouched("description", true, false);
            }}
            onBlur={() => formik.setFieldTouched("description", true, true)}
            placeholder="Enter history, significance, rituals, and architecture details..."
            minHeight={200}
            error={
              Boolean(formik.errors.description) &&
              (formik.touched.description ||
                Boolean(formik.values.description))
            }
            helperText={
              formik.touched.description ||
              Boolean(formik.values.description)
                ? (formik.errors.description as string)
                : undefined
            }
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

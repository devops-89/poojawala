"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useFormikContext } from "formik";
import React, { useEffect, useMemo } from "react";
import AddressLocationButton from "@/components/widgets/addressModal/AddressLocationButton";
import AddressMapPreview from "@/components/widgets/addressModal/AddressMapPreview";
import { useAddressGeocoding } from "@/components/widgets/addressModal/useAddressGeocoding";
import { FONTS } from "@/utils/fonts";
import {
  allowOnlyLettersOnKeyDown,
  sanitizeLettersOnly,
  allowOnlyAddressCharsOnKeyDown,
  sanitizeAddressInput,
} from "@/utils/helpers";

export interface SignUpStep2AddressProps {
  isFetchingLocation?: boolean;
  isSubmitting: boolean;
  onFetchLocation?: () => void;
  onBack: () => void;
}

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    fontFamily: FONTS.OUTFIT,
    borderRadius: "10px",
    fontSize: "0.835rem",
    bgcolor: "#FFFFFF",
    color: "#1F1A17",
    height: "44px",
    boxSizing: "border-box",
    "@media (max-height: 660px)": {
      height: "39px",
    },
    "& fieldset": {
      borderColor: "rgba(220, 210, 200, 0.8)",
      borderWidth: "1px",
      transition: "all 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: "#FF9100",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FF6200",
      borderWidth: "1.5px",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(255, 98, 0, 0.12)",
    },
  },
  "& .MuiOutlinedInput-root.MuiInputBase-multiline": {
    height: "auto",
    minHeight: "68px",
    py: 1,
  },
  "& .MuiInputBase-input": {
    fontFamily: FONTS.OUTFIT,
    height: "100%",
    boxSizing: "border-box",
    py: 0,
    fontSize: "0.835rem",
    "&::placeholder": {
      color: "#9CA3AF",
      opacity: 1,
    },
  },
  "& .MuiInputBase-inputMultiline": {
    height: "auto",
  },
  "& .MuiFormHelperText-root": {
    fontFamily: FONTS.OUTFIT,
    fontSize: "0.72rem",
    margin: "1px 0 -1px 0",
  },
};

const labelStyles = {
  fontFamily: FONTS.OUTFIT,
  fontSize: "12px",
  fontWeight: 700,
  color: "#374151",
  mb: 0.3,
  display: "block",
};

export default function SignUpStep2Address({
  isSubmitting,
  onBack,
}: SignUpStep2AddressProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();

  const initialGeoData = useMemo(
    () => ({
      addressLabel: values.addressLabel || "Home",
      fullAddress: values.fullAddress || "",
      city: values.city || "",
      state: values.state || "",
      pincode: values.pincode || "",
      latitude: values.latitude || "0",
      longitude: values.longitude || "0",
      isDefault: values.isDefault ?? true,
    }),
    [
      values.addressLabel,
      values.fullAddress,
      values.city,
      values.state,
      values.pincode,
      values.latitude,
      values.longitude,
      values.isDefault,
    ]
  );

  const {
    addressData,
    setAddressData,
    statusMessage,
    isFetchingLocation,
    isSearchingGeo,
    mapContainerRef,
    fetchCurrentLocation,
    geoFromFields,
    handlePincodeChange,
    handleAddressInputChange,
    handleAddressInputBlur,
  } = useAddressGeocoding(true, initialGeoData);

  // Keep Formik values synced with Geocoding Hook state
  useEffect(() => {
    const newLat = String(addressData.latitude || "0");
    const newLng = String(addressData.longitude || "0");

    setFieldValue("addressLabel", addressData.addressLabel || "Home");
    setFieldValue("fullAddress", addressData.fullAddress || "");
    setFieldValue("city", addressData.city || "");
    setFieldValue("state", addressData.state || "");
    setFieldValue("pincode", addressData.pincode || "");
    setFieldValue("latitude", newLat);
    setFieldValue("longitude", newLng);
  }, [
    addressData.addressLabel,
    addressData.fullAddress,
    addressData.city,
    addressData.state,
    addressData.pincode,
    addressData.latitude,
    addressData.longitude,
    setFieldValue,
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {/* Location Button inline in front of Heading */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: { xs: "0.85rem", sm: "0.92rem" },
            color: "#1F1A17",
            whiteSpace: "nowrap",
          }}
        >
          Delivery Location & Address
        </Typography>

        <AddressLocationButton
          isFetchingLocation={isFetchingLocation}
          onFetchLocation={fetchCurrentLocation}
          size="small"
        />
      </Box>

      <Grid container spacing={1.25}>
        {/* ROW 1: PINCODE & ADDRESS LABEL IN 2-COLUMN GRID */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelStyles}>
            Pincode <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter 6-digit pincode"
            value={addressData.pincode}
            onKeyDown={(e) => {
              if (
                !/\d/.test(e.key) &&
                ![
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                  "Enter",
                  "Home",
                  "End",
                ].includes(e.key) &&
                !e.ctrlKey &&
                !e.metaKey
              ) {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              handlePincodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            slotProps={{
              htmlInput: { maxLength: 6, inputMode: "numeric" },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PinDropOutlinedIcon
                      sx={{ color: "#9CA3AF", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined"
            error={touched.pincode && Boolean(errors.pincode)}
            helperText={touched.pincode && (errors.pincode as string)}
            sx={inputStyles}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelStyles}>
            Address Label <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. Home, Office"
            value={addressData.addressLabel}
            onChange={(e) => {
              setAddressData((prev) => ({
                ...prev,
                addressLabel: e.target.value,
              }));
              setFieldValue("addressLabel", e.target.value);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeOutlinedIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined"
            error={touched.addressLabel && Boolean(errors.addressLabel)}
            helperText={touched.addressLabel && (errors.addressLabel as string)}
            sx={inputStyles}
          />
        </Grid>

        {/* ROW 2: FULL ADDRESS */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={labelStyles}>
            Full Address <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            placeholder="House/Flat No., Apartment, Street, Locality"
            value={addressData.fullAddress}
            onKeyDown={allowOnlyAddressCharsOnKeyDown}
            onChange={(e) => {
              const sanitized = sanitizeAddressInput(e.target.value);
              handleAddressInputChange(sanitized);
              setFieldValue("fullAddress", sanitized);
            }}
            onBlur={handleAddressInputBlur}
            variant="outlined"
            error={touched.fullAddress && Boolean(errors.fullAddress)}
            helperText={touched.fullAddress && (errors.fullAddress as string)}
            sx={inputStyles}
          />
        </Grid>

        {/* ROW 3: CITY & STATE IN 2-COLUMN GRID */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelStyles}>
            City <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter city"
            value={addressData.city}
            onKeyDown={allowOnlyLettersOnKeyDown}
            onChange={(e) => {
              const cleanVal = sanitizeLettersOnly(e.target.value);
              setAddressData((prev) => ({ ...prev, city: cleanVal }));
              setFieldValue("city", cleanVal);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCityOutlinedIcon
                      sx={{ color: "#9CA3AF", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined"
            error={touched.city && Boolean(errors.city)}
            helperText={touched.city && (errors.city as string)}
            sx={inputStyles}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelStyles}>
            State <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter state"
            value={addressData.state}
            onKeyDown={allowOnlyLettersOnKeyDown}
            onChange={(e) => {
              const cleanVal = sanitizeLettersOnly(e.target.value);
              setAddressData((prev) => ({ ...prev, state: cleanVal }));
              setFieldValue("state", cleanVal);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MapOutlinedIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined"
            error={touched.state && Boolean(errors.state)}
            helperText={touched.state && (errors.state as string)}
            sx={inputStyles}
          />
        </Grid>

        {/* Checkbox Default Address */}
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(values.isDefault ?? true)}
                onChange={(e) => setFieldValue("isDefault", e.target.checked)}
                size="small"
                sx={{
                  py: 0.25,
                  color: "#FF6200",
                  "&.Mui-checked": { color: "#FF6200" },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "0.85rem",
                  color: "#4B5563",
                  fontWeight: 500,
                }}
              >
                Set as default delivery address
              </Typography>
            }
          />
        </Grid>
      </Grid>

      {/* Interactive Mapbox Map Preview */}
      <AddressMapPreview
        mapContainerRef={mapContainerRef}
        statusMessage={statusMessage}
        isSearchingGeo={isSearchingGeo}
        onFindLocation={() => geoFromFields(undefined, true)}
        height={{ xs: "105px", sm: "115px", md: "125px" }}
      />

      {/* Action Buttons */}
      <Grid container spacing={1.5} sx={{ mt: 0.75 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="button"
            fullWidth
            onClick={onBack}
            variant="outlined"
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{
              py: 0.85,
              borderRadius: "10px",
              borderColor: "rgba(220, 205, 190, 0.8)",
              color: "#4B5563",
              bgcolor: "#FFFFFF",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "13.5px",
              textTransform: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 240, 230, 0.5)",
                color: "#FF6200",
                borderColor: "#FF6200",
              },
            }}
          >
            Back to Step 1
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            variant="contained"
            endIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckCircleIcon sx={{ fontSize: 17 }} />
              )
            }
            sx={{
              background: "linear-gradient(135deg, #FF6200 0%, #FF7A1A 100%)",
              color: "white",
              py: 0.85,
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "13.5px",
              boxShadow: "0 4px 12px rgba(255, 98, 0, 0.28)",
              transition: "all 0.25s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #E65800 0%, #FF6200 100%)",
                boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
                transform: "translateY(-1px)",
              },
            }}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up & Send OTP"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}



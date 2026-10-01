"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormikContext } from "formik";
import React, { useEffect, useMemo } from "react";
import AddressLocationButton from "@/components/widgets/addressModal/AddressLocationButton";
import AddressMapPreview from "@/components/widgets/addressModal/AddressMapPreview";
import { useAddressGeocoding } from "@/components/widgets/addressModal/useAddressGeocoding";

export interface SignUpStep2AddressProps {
  isFetchingLocation?: boolean;
  isSubmitting: boolean;
  onFetchLocation?: () => void;
  onBack: () => void;
}

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    fontFamily: '"DM Sans", sans-serif',
    borderRadius: "10px",
    fontSize: "0.875rem",
  },
  "& .MuiInputLabel-root": {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "0.875rem",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    margin: "2px 0 -4px 0",
  },
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Location Button at top */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#1e293b",
          }}
        >
          Delivery Location & Address
        </Typography>

        <AddressLocationButton
          isFetchingLocation={isFetchingLocation}
          onFetchLocation={fetchCurrentLocation}
        />
      </Box>

      <Grid container spacing={1.25}>
        {/* ROW 1: PINCODE & ADDRESS LABEL IN 2-COLUMN GRID */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Pincode *"
            value={addressData.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 6, inputMode: "numeric" } }}
            variant="outlined"
            error={touched.pincode && Boolean(errors.pincode)}
            helperText={touched.pincode && (errors.pincode as string)}
            sx={inputStyles}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Address Label (e.g., Home, Office) *"
            value={addressData.addressLabel}
            onChange={(e) => {
              setAddressData((prev) => ({
                ...prev,
                addressLabel: e.target.value,
              }));
              setFieldValue("addressLabel", e.target.value);
            }}
            variant="outlined"
            error={touched.addressLabel && Boolean(errors.addressLabel)}
            helperText={touched.addressLabel && (errors.addressLabel as string)}
            sx={inputStyles}
          />
        </Grid>

        {/* ROW 2: FULL ADDRESS */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            label="Full Address *"
            value={addressData.fullAddress}
            onChange={(e) => {
              handleAddressInputChange(e.target.value);
              setFieldValue("fullAddress", e.target.value);
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
          <TextField
            fullWidth
            size="small"
            label="City *"
            value={addressData.city}
            onChange={(e) => {
              setAddressData((prev) => ({ ...prev, city: e.target.value }));
              setFieldValue("city", e.target.value);
            }}
            variant="outlined"
            error={touched.city && Boolean(errors.city)}
            helperText={touched.city && (errors.city as string)}
            sx={inputStyles}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="State *"
            value={addressData.state}
            onChange={(e) => {
              setAddressData((prev) => ({ ...prev, state: e.target.value }));
              setFieldValue("state", e.target.value);
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
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.825rem",
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
      />

      {/* Action Buttons */}
      <Grid container spacing={1.5} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="button"
            fullWidth
            onClick={onBack}
            variant="outlined"
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{
              py: 1,
              borderRadius: "24px",
              borderColor: "#FFE0D0",
              color: "#475569",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: "14px",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#FFF0E6",
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
            sx={{
              background: "#FF6200",
              color: "white",
              py: 1,
              borderRadius: "24px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "15px",
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
              "&:hover": {
                background: "#E65800",
                boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
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


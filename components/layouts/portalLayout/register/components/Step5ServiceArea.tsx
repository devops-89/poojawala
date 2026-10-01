"use client";

import {
  Box,
  Button,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import AddressLocationButton from "@/components/widgets/addressModal/AddressLocationButton";
import AddressMapPreview from "@/components/widgets/addressModal/AddressMapPreview";
import { useAddressGeocoding } from "@/components/widgets/addressModal/useAddressGeocoding";

interface Step5ServiceAreaProps {
  formik: any;
}

export default function Step5ServiceArea({ formik }: Step5ServiceAreaProps) {
  const { values, setFieldValue, errors, touched } = formik;
  const serviceArea = values.serviceArea || {};

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
  } = useAddressGeocoding(true, {
    addressLabel: serviceArea.addressLabel || "Primary Service Area",
    fullAddress: serviceArea.fullAddress || "",
    city: serviceArea.city || values.city || "",
    state: serviceArea.state || values.state || "",
    pincode: serviceArea.pincode || "",
    latitude: serviceArea.latitude || "0",
    longitude: serviceArea.longitude || "0",
    isDefault: true,
  });

  // Keep Formik values synced with Geocoding Hook state
  useEffect(() => {
    setFieldValue("serviceArea", {
      ...serviceArea,
      addressLabel: addressData.addressLabel || "Primary Service Area",
      fullAddress: addressData.fullAddress,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      latitude: Number(addressData.latitude) || 0,
      longitude: Number(addressData.longitude) || 0,
      serviceRadiusKm: Number(serviceArea.serviceRadiusKm || 15),
    });
  }, [addressData]);

  const serviceAreaErrors = errors.serviceArea || {};
  const serviceAreaTouched = touched.serviceArea || {};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          Define Primary Service Location & Radius
        </Typography>

        <AddressLocationButton
          isFetchingLocation={isFetchingLocation}
          onFetchLocation={fetchCurrentLocation}
        />
      </Box>

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {/* ROW 1: PINCODE & ADDRESS LABEL */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Pincode *"
            value={addressData.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 6, inputMode: "numeric" } }}
            variant="outlined"
            error={
              Boolean(serviceAreaTouched.pincode) &&
              Boolean(serviceAreaErrors.pincode)
            }
            helperText={
              Boolean(serviceAreaTouched.pincode) &&
              (serviceAreaErrors.pincode as string)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Address Label *"
            value={addressData.addressLabel}
            onChange={(e) =>
              setAddressData((prev) => ({
                ...prev,
                addressLabel: e.target.value,
              }))
            }
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* ROW 2: FULL ADDRESS */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Full Service Address *"
            value={addressData.fullAddress}
            onChange={(e) => handleAddressInputChange(e.target.value)}
            onBlur={handleAddressInputBlur}
            variant="outlined"
            error={
              Boolean(serviceAreaTouched.fullAddress) &&
              Boolean(serviceAreaErrors.fullAddress)
            }
            helperText={
              Boolean(serviceAreaTouched.fullAddress) &&
              (serviceAreaErrors.fullAddress as string)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <Typography
            variant="caption"
            sx={{ color: "#6b7280", mt: 0.5, display: "block" }}
          >
            Enter your main office, residence or temple address for service bookings.
          </Typography>
        </Grid>

        {/* ROW 3: STREET NAME / LANDMARK */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Street Name / Area / Landmark"
            value={serviceArea.streetName || ""}
            onChange={(e) =>
              setFieldValue("serviceArea", {
                ...serviceArea,
                streetName: e.target.value,
              })
            }
            variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* ROW 4: CITY & STATE */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="City *"
            value={addressData.city}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, city: e.target.value }))
            }
            variant="outlined"
            error={
              Boolean(serviceAreaTouched.city) &&
              Boolean(serviceAreaErrors.city)
            }
            helperText={
              Boolean(serviceAreaTouched.city) &&
              (serviceAreaErrors.city as string)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="State *"
            value={addressData.state}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, state: e.target.value }))
            }
            variant="outlined"
            error={
              Boolean(serviceAreaTouched.state) &&
              Boolean(serviceAreaErrors.state)
            }
            helperText={
              Boolean(serviceAreaTouched.state) &&
              (serviceAreaErrors.state as string)
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
        </Grid>

        {/* ROW 5: SERVICE RADIUS SLIDER */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              p: 2.5,
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              bgcolor: "#f8fafc",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#1e293b",
                mb: 0.5,
              }}
            >
              Service Operating Radius: {serviceArea.serviceRadiusKm || 15} km
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", mb: 2, display: "block" }}
            >
              Select how far (in Kilometers) you are willing to travel from this location to perform pujas.
            </Typography>

            <Slider
              value={Number(serviceArea.serviceRadiusKm || 15)}
              onChange={(_, val) =>
                setFieldValue("serviceArea", {
                  ...serviceArea,
                  serviceRadiusKm: val as number,
                })
              }
              min={1}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                color: "#FF6200",
                "& .MuiSlider-thumb": { width: 22, height: 22 },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Interactive Mapbox Map Preview */}
      <AddressMapPreview
        mapContainerRef={mapContainerRef}
        statusMessage={statusMessage}
        isSearchingGeo={isSearchingGeo}
        onFindLocation={() => geoFromFields(undefined, true)}
      />
    </Box>
  );
}

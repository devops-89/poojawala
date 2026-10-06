"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import AddressLocationButton from "@/components/widgets/addressModal/AddressLocationButton";
import AddressMapPreview from "@/components/widgets/addressModal/AddressMapPreview";
import { useAddressGeocoding } from "@/components/widgets/addressModal/useAddressGeocoding";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  selectedAddressId: number | null;
  addressForm: {
    addressLabel: string;
    streetName: string;
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
    latitude: string;
    longitude: string;
    serviceRadiusKm: number;
  };
  setAddressForm: React.Dispatch<React.SetStateAction<any>>;
  onSaveAddress: (updatedData?: any) => void;
  savingAddress: boolean;
  onFetchCurrentLocation: () => void;
  isFetchingLocation: boolean;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  open,
  onClose,
  selectedAddressId,
  addressForm,
  setAddressForm,
  onSaveAddress,
  savingAddress,
  onFetchCurrentLocation,
  isFetchingLocation,
}) => {
  const {
    addressData,
    setAddressData,
    statusMessage,
    isSearchingGeo,
    mapContainerRef,
    fetchCurrentLocation,
    geoFromFields,
    handlePincodeChange,
    handleAddressInputChange,
    handleAddressInputBlur,
  } = useAddressGeocoding(open, addressForm);

  // Sync address form when user clicks Save Location instead of continuous useEffect loop

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: { xs: "16px", sm: "22px" },
          m: { xs: 1.5, sm: 2, md: 3 },
          width: { xs: "calc(100% - 24px)", sm: "auto" },
          maxHeight: { xs: "calc(100% - 24px)", sm: "90vh" },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 800,
          fontSize: { xs: "1.2rem", sm: "1.45rem" },
          pb: 1.5,
          pt: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box component="span">
          {selectedAddressId ? "Edit Service Area" : "Add New Service Area"}
        </Box>
        <AddressLocationButton
          isFetchingLocation={isFetchingLocation}
          onFetchLocation={fetchCurrentLocation}
        />
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Address Label (e.g., Home, Office, Temple) *"
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
                label="Full Address *"
                value={addressData.fullAddress}
                onChange={(e) => handleAddressInputChange(e.target.value)}
                onBlur={handleAddressInputBlur}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <Typography
                variant="caption"
                sx={{ color: "#6b7280", mt: 0.5, display: "block" }}
              >
                Fill any one of address, city or pincode. The map marker updates automatically.
              </Typography>
            </Grid>

            {/* ROW 3: STREET NAME / AREA */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Street Name / Area / Landmark *"
                value={addressForm.streetName || ""}
                onChange={(e) =>
                  setAddressForm((prev: any) => ({
                    ...prev,
                    streetName: e.target.value,
                  }))
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* SERVICE RADIUS SLIDER */}
            <Grid size={{ xs: 12 }}>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: "14px",
                  mb: 1,
                  mt: 1,
                }}
              >
                Service Radius: {Number(addressForm.serviceRadiusKm) || 10} km
              </Typography>
              <Slider
                value={Number(addressForm.serviceRadiusKm) || 10}
                onChange={(_, val) =>
                  setAddressForm((prev: any) => ({
                    ...prev,
                    serviceRadiusKm: val as number,
                  }))
                }
                min={1}
                max={100}
                valueLabelDisplay="auto"
                sx={{ color: "#FF6200" }}
              />
            </Grid>

            {/* DEFAULT CHECKBOX */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addressData.isDefault}
                    onChange={(e) =>
                      setAddressData((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#FF6200",
                      "&.Mui-checked": { color: "#FF6200" },
                    }}
                  />
                }
                label="Set as default service location"
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#475569",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            const updatedForm = {
              ...addressForm,
              addressLabel: addressData.addressLabel,
              fullAddress: addressData.fullAddress,
              city: addressData.city,
              state: addressData.state,
              pincode: addressData.pincode,
              latitude: addressData.latitude,
              longitude: addressData.longitude,
              isDefault: addressData.isDefault,
            };
            setAddressForm(updatedForm);
            onSaveAddress(updatedForm);
          }}
          disabled={savingAddress}
          sx={{
            bgcolor: "#FF6200 !important",
            color: "white !important",
            fontWeight: 700,
            px: 3,
            py: 1,
            borderRadius: "10px",
            textTransform: "none",
            "&:hover": { bgcolor: "#ea580c !important" },
          }}
        >
          {savingAddress ? "Saving..." : "Save Location"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

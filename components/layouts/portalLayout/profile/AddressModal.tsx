"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import {
  allowOnlyAddressCharsOnKeyDown,
  sanitizeAddressInput,
  allowOnlyAddressLabelCharsOnKeyDown,
  sanitizeAddressLabelInput,
  allowOnlyLettersOnKeyDown,
  sanitizeLettersOnly,
  sanitizePincodeInput,
  validateAddressPayload,
  AddressValidationErrors,
} from "@/utils/helpers";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  selectedAddressId: number | string | null;
  addressForm: {
    id?: number | string | null;
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
  const [errors, setErrors] = useState<AddressValidationErrors>({});

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

  // Clear errors when modal opens or closes
  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);



  const isEdit = Boolean(selectedAddressId || addressForm?.id);
  const initialAddressRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      initialAddressRef.current = {
        addressLabel: sanitizeAddressLabelInput(addressForm?.addressLabel || ""),
        streetName: sanitizeAddressInput(addressForm?.streetName || ""),
        fullAddress: sanitizeAddressInput(addressForm?.fullAddress || ""),
        city: sanitizeLettersOnly(addressForm?.city || ""),
        state: sanitizeLettersOnly(addressForm?.state || ""),
        pincode: sanitizePincodeInput(addressForm?.pincode || ""),
        serviceRadiusKm: Number(addressForm?.serviceRadiusKm) || 10,
        isDefault: Boolean(addressForm?.isDefault),
        latitude: addressForm?.latitude ? String(addressForm.latitude) : "",
        longitude: addressForm?.longitude ? String(addressForm.longitude) : "",
      };
    }
  }, [open, selectedAddressId, addressForm?.id]);

  const isAddressDirty = useMemo(() => {
    const currentStreet = (addressData.streetName ?? addressForm?.streetName ?? "").trim();
    const currentLabel = (addressData.addressLabel || "").trim();
    const currentFull = (addressData.fullAddress || "").trim();
    const currentCity = (addressData.city || "").trim();
    const currentState = (addressData.state || "").trim();
    const currentPin = (addressData.pincode || "").trim();
    const currentRadius = Number(addressData.serviceRadiusKm) || 10;
    const currentDefault = Boolean(addressData.isDefault);
    const currentLat = addressData.latitude ? String(addressData.latitude).trim() : "";
    const currentLng = addressData.longitude ? String(addressData.longitude).trim() : "";

    if (!isEdit) {
      return Boolean(
        currentPin &&
        currentLabel &&
        currentCity &&
        currentState &&
        (currentFull || currentStreet)
      );
    }

    const init = initialAddressRef.current || {};
    return (
      currentLabel !== (init.addressLabel || "").trim() ||
      currentStreet !== (init.streetName || "").trim() ||
      currentFull !== (init.fullAddress || "").trim() ||
      currentCity !== (init.city || "").trim() ||
      currentState !== (init.state || "").trim() ||
      currentPin !== (init.pincode || "").trim() ||
      currentRadius !== (Number(init.serviceRadiusKm) || 10) ||
      currentDefault !== Boolean(init.isDefault) ||
      (currentLat && currentLat !== (init.latitude || "").trim()) ||
      (currentLng && currentLng !== (init.longitude || "").trim())
    );
  }, [isEdit, addressData, addressForm]);

  const isSaveDisabled = savingAddress || !isAddressDirty;

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
          fontFamily: FONTS.OUTFIT,
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
          {Boolean(selectedAddressId || addressForm?.id)
            ? "Edit Service Area"
            : "Add New Service Area"}
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
                onKeyDown={(e) => {
                  if (
                    e.ctrlKey ||
                    e.metaKey ||
                    [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                      "Enter",
                      "Home",
                      "End",
                    ].includes(e.key)
                  ) {
                    return;
                  }
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = sanitizePincodeInput(e.target.value);
                  handlePincodeChange(val);
                  if (errors.pincode) {
                    setErrors((prev) => ({ ...prev, pincode: undefined }));
                  }
                }}
                slotProps={{ htmlInput: { maxLength: 6, inputMode: "numeric" } }}
                variant="outlined"
                error={Boolean(errors.pincode)}
                helperText={errors.pincode}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Address Label (e.g., Home, Office, Temple) *"
                value={addressData.addressLabel}
                onKeyDown={allowOnlyAddressLabelCharsOnKeyDown}
                onChange={(e) => {
                  const val = sanitizeAddressLabelInput(e.target.value);
                  setAddressData((prev) => ({
                    ...prev,
                    addressLabel: val,
                  }));
                  if (errors.addressLabel) {
                    setErrors((prev) => ({ ...prev, addressLabel: undefined }));
                  }
                }}
                slotProps={{ htmlInput: { maxLength: 50 } }}
                variant="outlined"
                error={Boolean(errors.addressLabel)}
                helperText={errors.addressLabel}
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
                onKeyDown={allowOnlyAddressCharsOnKeyDown}
                onChange={(e) => {
                  const val = sanitizeAddressInput(e.target.value);
                  handleAddressInputChange(val);
                  if (errors.fullAddress) {
                    setErrors((prev) => ({ ...prev, fullAddress: undefined }));
                  }
                }}
                onBlur={handleAddressInputBlur}
                variant="outlined"
                error={Boolean(errors.fullAddress)}
                helperText={
                  errors.fullAddress ||
                  "Enter your complete street, house/flat or landmark address details."
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* ROW 3: STREET NAME / AREA */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Street Name / Area / Landmark *"
                value={addressData.streetName ?? addressForm.streetName ?? ""}
                onKeyDown={allowOnlyAddressCharsOnKeyDown}
                onChange={(e) => {
                  const val = sanitizeAddressInput(e.target.value).slice(0, 100);
                  setAddressData((prev) => ({ ...prev, streetName: val }));
                  setAddressForm((prev: any) => ({ ...prev, streetName: val }));
                  if (errors.streetName) {
                    setErrors((prev) => ({ ...prev, streetName: undefined }));
                  }
                }}
                slotProps={{ htmlInput: { maxLength: 100 } }}
                variant="outlined"
                error={Boolean(errors.streetName)}
                helperText={errors.streetName}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* ROW 4: CITY & STATE */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City *"
                value={addressData.city}
                onKeyDown={allowOnlyLettersOnKeyDown}
                onChange={(e) => {
                  const val = sanitizeLettersOnly(e.target.value).slice(0, 60);
                  setAddressData((prev) => ({ ...prev, city: val }));
                  if (errors.city) {
                    setErrors((prev) => ({ ...prev, city: undefined }));
                  }
                }}
                slotProps={{ htmlInput: { maxLength: 60 } }}
                variant="outlined"
                error={Boolean(errors.city)}
                helperText={errors.city}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="State *"
                value={addressData.state}
                onKeyDown={allowOnlyLettersOnKeyDown}
                onChange={(e) => {
                  const val = sanitizeLettersOnly(e.target.value).slice(0, 60);
                  setAddressData((prev) => ({ ...prev, state: val }));
                  if (errors.state) {
                    setErrors((prev) => ({ ...prev, state: undefined }));
                  }
                }}
                slotProps={{ htmlInput: { maxLength: 60 } }}
                variant="outlined"
                error={Boolean(errors.state)}
                helperText={errors.state}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* SERVICE RADIUS SLIDER */}
            <Grid size={{ xs: 12 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
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
                sx={{ color: COLORS.PRIMARY }}
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
                      color: COLORS.PRIMARY,
                      "&.Mui-checked": { color: COLORS.PRIMARY },
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
            const currentStreetName = (
              addressData.streetName ??
              addressForm.streetName ??
              ""
            ).trim();

            const constructedAddress = (
              addressData.fullAddress ||
              [
                currentStreetName,
                addressData.city,
                addressData.state,
                addressData.pincode,
              ]
                .filter(Boolean)
                .join(", ")
            ).trim();

            // Validate all address fields with strict regexes
            const validation = validateAddressPayload({
              pincode: addressData.pincode,
              addressLabel: addressData.addressLabel,
              fullAddress: constructedAddress,
              streetName: currentStreetName,
              city: addressData.city,
              state: addressData.state,
            });

            if (!validation.isValid) {
              setErrors(validation.errors);
              return;
            }
            setErrors({});

            const updatedForm = {
              ...addressForm,
              addressLabel: sanitizeAddressLabelInput((addressData.addressLabel || "").trim()),
              streetName: sanitizeAddressInput(currentStreetName),
              fullAddress: sanitizeAddressInput(constructedAddress),
              city: sanitizeLettersOnly((addressData.city || "").trim()),
              state: sanitizeLettersOnly((addressData.state || "").trim()),
              pincode: sanitizePincodeInput((addressData.pincode || "").trim()),
              latitude: addressData.latitude,
              longitude: addressData.longitude,
              isDefault: addressData.isDefault,
            };
            setAddressForm(updatedForm);
            onSaveAddress(updatedForm);
          }}
          disabled={isSaveDisabled}
          sx={{
            bgcolor: isSaveDisabled ? "#cbd5e1 !important" : "#FF6200 !important",
            color: isSaveDisabled ? "#64748b !important" : "white !important",
            cursor: isSaveDisabled ? "not-allowed !important" : "pointer",
            fontWeight: 700,
            px: 3,
            py: 1,
            borderRadius: "10px",
            textTransform: "none",
            "&:hover": {
              bgcolor: isSaveDisabled ? "#cbd5e1 !important" : "#ea580c !important",
            },
          }}
        >
          {savingAddress ? "Saving..." : isEdit ? "Update Location" : "Save Location"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

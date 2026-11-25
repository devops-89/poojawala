"use client";
import {
  addCustomerAddressAPI,
  updateCustomerAddressAPI,
} from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import AddressFormInputs from "./addressModal/AddressFormInputs";
import AddressLocationButton from "./addressModal/AddressLocationButton";
import AddressMapPreview from "./addressModal/AddressMapPreview";
import { AddAddressModalProps, AddressFormData } from "@/utils/types";
import { useAddressGeocoding } from "./addressModal/useAddressGeocoding";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { validateAddressPayload, AddressValidationErrors, sanitizeAddressInput, sanitizeAddressLabelInput, sanitizeLettersOnly, sanitizePincodeInput } from "@/utils/helpers";
export type { AddressFormData };

export default function AddAddressModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: AddAddressModalProps) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<AddressValidationErrors>({});

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
    resetForm,
    pincodeError,
  } = useAddressGeocoding(open, initialData);

  useEffect(() => {
    if (pincodeError) {
      setErrors((prev) => ({ ...prev, pincode: pincodeError }));
    } else {
      setErrors((prev) => {
        if (prev.pincode && prev.pincode.toLowerCase().includes("indian pincode")) {
          const next = { ...prev };
          delete next.pincode;
          return next;
        }
        return prev;
      });
    }
  }, [pincodeError]);

  const isEdit = Boolean(initialData?.id || addressData?.id);
  const isAddressDirty = useMemo(() => {
    const currentLabel = (addressData.addressLabel || "").trim();
    const currentFull = (addressData.fullAddress || "").trim();
    const currentCity = (addressData.city || "").trim();
    const currentState = (addressData.state || "").trim();
    const currentPin = (addressData.pincode || "").trim();
    const currentDefault = Boolean(addressData.isDefault);
    const currentVenue = addressData.venueType || "HOME";

    if (!isEdit) {
      return Boolean(currentLabel && currentFull && currentCity && currentState && currentPin);
    }

    const init = initialData || {};
    return (
      currentLabel !== (init.addressLabel || "").trim() ||
      currentFull !== (init.fullAddress || "").trim() ||
      currentCity !== (init.city || "").trim() ||
      currentState !== (init.state || "").trim() ||
      currentPin !== (init.pincode || init.zipCode || "").trim() ||
      currentDefault !== Boolean(init.isDefault) ||
      currentVenue !== (init.venueType || "HOME")
    );
  }, [isEdit, addressData, initialData]);

  const isSaveDisabled = saving || !isAddressDirty || Boolean(pincodeError);

  const handleSave = async () => {
    if (pincodeError) {
      setErrors((prev) => ({ ...prev, pincode: pincodeError }));
      showSnackbar(pincodeError, "error");
      return;
    }
    const validation = validateAddressPayload(addressData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showSnackbar(validation.firstError || "Please check address fields", "error");
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      let lat = addressData.latitude;
      let lng = addressData.longitude;

      // Fallback: If lat/lng are missing or 0, try to geocode from entered fields before saving
      if ((!lat || lat === "0") && (addressData.fullAddress || addressData.pincode || addressData.city)) {
        await geoFromFields(undefined, false);
        lat = addressData.latitude;
        lng = addressData.longitude;
      }

      const payload: any = {
        venueType: addressData.venueType || "HOME",
        fullAddress: sanitizeAddressInput(addressData.fullAddress || ""),
        addressLabel: sanitizeAddressLabelInput(addressData.addressLabel || ""),
        city: sanitizeLettersOnly(addressData.city || ""),
        state: sanitizeLettersOnly(addressData.state || ""),
        pincode: sanitizePincodeInput(addressData.pincode || ""),
        latitude: lat && lat !== "0" ? String(lat) : "0",
        longitude: lng && lng !== "0" ? String(lng) : "0",
        isDefault: Boolean(addressData.isDefault),
      };

      let result = null;
      if (addressData.id) {
        result = await updateCustomerAddressAPI(addressData.id, payload);
        showSnackbar("Address updated successfully", "success");
      } else {
        result = await addCustomerAddressAPI(payload);
        showSnackbar("Address added successfully", "success");
      }
      onSuccess(result?.data || result);
      onClose();
    } catch (error: any) {
      const errRes = error.response?.data;
      let errMsg = "Failed to save address";
      if (Array.isArray(errRes?.error) && errRes.error.length > 0) {
        errMsg = errRes.error.join(", ");
      } else if (typeof errRes?.error === "string") {
        errMsg = errRes.error;
      } else if (errRes?.message) {
        errMsg = errRes.message;
      }
      showSnackbar(errMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: { xs: "18px", sm: "22px" },
          m: { xs: 1.5, sm: 2, md: 3 },
          width: { xs: "calc(100% - 24px)", sm: "100%" },
          maxWidth: { xs: "100%", sm: "580px" },
          maxHeight: { xs: "calc(100% - 32px)", sm: "90vh" },
          boxShadow: "0 20px 60px rgba(44, 24, 16, 0.15)",
          outline: "none",
        },
        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: COLORS.PRIMARY,
        },
        "& .MuiInputLabel-root.Mui-focused": { color: COLORS.PRIMARY },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: FONTS.OUTFIT,
          p: { xs: 2, sm: 2.5 },
          pb: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "1.2rem", sm: "1.35rem" },
              color: "#2C1810",
            }}
          >
            {addressData.id ? "Edit Address" : "Add New Address"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <AddressLocationButton
                isFetchingLocation={isFetchingLocation}
                onFetchLocation={fetchCurrentLocation}
              />
            </Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: "#64534A",
                bgcolor: "#F7EFE6",
                p: 0.8,
                "&:hover": { bgcolor: "#EFE6D5" },
              }}
            >
              <CloseIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Box>
        </Box>

        {/* Mobile: Location Button placed on clean row below Title */}
        <Box sx={{ display: { xs: "block", sm: "none" }, width: "100%", mt: 1.2 }}>
          <AddressLocationButton
            isFetchingLocation={isFetchingLocation}
            onFetchLocation={fetchCurrentLocation}
            sx={{ width: "100%", justifyContent: "center" }}
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Form Input Fields */}
          <AddressFormInputs
            addressData={addressData}
            setAddressData={setAddressData}
            onPincodeChange={handlePincodeChange}
            onAddressInputChange={handleAddressInputChange}
            onAddressInputBlur={handleAddressInputBlur}
            errors={errors}
            setErrors={setErrors}
          />

          {/* Interactive Map Preview */}
          <AddressMapPreview
            mapContainerRef={mapContainerRef}
            statusMessage={statusMessage}
            isSearchingGeo={isSearchingGeo}
            onFindLocation={() => geoFromFields(undefined, true)}
          />
        </Box>
      </DialogContent>

      {/* Dialog Footer Actions */}
      <DialogActions
        sx={{
          p: { xs: 2, sm: 2.5 },
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: { xs: 1.2, sm: 2 },
          }}
        >
          {/* Main Action Buttons: On mobile shown first */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
              order: { xs: 1, sm: 2 },
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                flex: { xs: 1, sm: "none" },
                width: { sm: "auto" },
                color: "#64534A",
                borderColor: "#E5D9CC",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: { xs: "13px", sm: "14px" },
                textTransform: "none",
                py: { xs: 1, sm: 1.1 },
                px: { xs: 2, sm: 3 },
                borderRadius: "12px",
                "&:hover": {
                  borderColor: "#FF6200",
                  bgcolor: "#FFF8F2",
                  color: "#FF6200",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaveDisabled}
              sx={{
                flex: { xs: 1.4, sm: "none" },
                width: { sm: "auto" },
                bgcolor: isSaveDisabled ? "#E2E8F0 !important" : "#FF6200 !important",
                color: isSaveDisabled ? "#94A3B8 !important" : "#ffffff !important",
                cursor: isSaveDisabled ? "not-allowed !important" : "pointer",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: { xs: "13px", sm: "14px" },
                px: { xs: 2, sm: 3.5 },
                py: { xs: 1, sm: 1.1 },
                borderRadius: "12px",
                textTransform: "none",
                boxShadow: isSaveDisabled ? "none" : "0 4px 12px rgba(255, 98, 0, 0.25)",
                "&:hover": {
                  bgcolor: isSaveDisabled ? "#E2E8F0 !important" : "#e64a00 !important",
                },
              }}
            >
              {saving ? "Saving..." : isEdit ? "Update Address" : "Save Address"}
            </Button>
          </Box>

          {/* Reset Action: On mobile, subtle link below main actions */}
          <Box
            sx={{
              order: { xs: 2, sm: 1 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              onClick={resetForm}
              variant="text"
              sx={{
                width: { xs: "100%", sm: "auto" },
                color: "#8C7A6B",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                fontSize: "13px",
                textTransform: "none",
                py: 0.5,
                "&:hover": { bgcolor: "#F5ECE3", color: "#2C1810" },
              }}
            >
              Reset Fields
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

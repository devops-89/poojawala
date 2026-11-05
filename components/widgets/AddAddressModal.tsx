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
} from "@mui/material";
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
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: { xs: "16px", sm: "22px" },
          m: { xs: 1.5, sm: 2, md: 3 },
          width: { xs: "calc(100% - 24px)", sm: "auto" },
          maxHeight: { xs: "calc(100% - 24px)", sm: "90vh" },
        },
        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: COLORS.PRIMARY,
        },
        "& .MuiInputLabel-root.Mui-focused": { color: COLORS.PRIMARY },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: FONTS.PRIMARY,
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
          {addressData.id ? "Edit Address" : "Add New Address"}
        </Box>
        <AddressLocationButton
          isFetchingLocation={isFetchingLocation}
          onFetchLocation={fetchCurrentLocation}
        />
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
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: { xs: "column-reverse", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Button
          onClick={resetForm}
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "auto" },
            color: "#475569",
            borderColor: "#d1d5db",
            borderRadius: "10px",
            px: 2.5,
            py: 1,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "#f3f4f6" },
          }}
        >
          Reset
        </Button>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1.5, sm: 2 },
            alignItems: "center",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              width: { xs: "50%", sm: "auto" },
              color: "#475569",
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              textTransform: "none",
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaveDisabled}
            sx={{
              width: { xs: "50%", sm: "auto" },
              bgcolor: isSaveDisabled ? "#cbd5e1 !important" : "#FF6200 !important",
              color: isSaveDisabled ? "#64748b !important" : "white !important",
              cursor: isSaveDisabled ? "not-allowed !important" : "pointer",
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              px: 3,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: isSaveDisabled ? "#cbd5e1 !important" : "#ea580c !important",
              },
            }}
          >
            {saving ? "Saving..." : isEdit ? "Update Address" : "Save Address"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

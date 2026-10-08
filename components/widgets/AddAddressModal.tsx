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
import { useState } from "react";
import AddressFormInputs from "./addressModal/AddressFormInputs";
import AddressLocationButton from "./addressModal/AddressLocationButton";
import AddressMapPreview from "./addressModal/AddressMapPreview";
import { AddAddressModalProps, AddressFormData } from "@/utils/types";
import { useAddressGeocoding } from "./addressModal/useAddressGeocoding";
export type { AddressFormData };

export default function AddAddressModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: AddAddressModalProps) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [saving, setSaving] = useState(false);

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
  } = useAddressGeocoding(open, initialData);

  const handleSave = async () => {
    const missingFields = [];
    if (!addressData.pincode?.trim()) missingFields.push("Pincode");
    if (!addressData.addressLabel?.trim()) missingFields.push("Address Label");
    if (!addressData.fullAddress?.trim()) missingFields.push("Full Address");
    if (!addressData.city?.trim()) missingFields.push("City");
    if (!addressData.state?.trim()) missingFields.push("State");

    if (missingFields.length > 0) {
      showSnackbar(
        `Please fill in required fields: ${missingFields.join(", ")}`,
        "error"
      );
      return;
    }

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
        fullAddress: addressData.fullAddress,
        addressLabel: addressData.addressLabel,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
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
          borderColor: "#FF6200",
        },
        "& .MuiInputLabel-root.Mui-focused": { color: "#FF6200" },
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
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              textTransform: "none",
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            sx={{
              width: { xs: "50%", sm: "auto" },
              bgcolor: "#FF6200 !important",
              color: "white !important",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              px: 3,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#ea580c !important" },
              "&.Mui-disabled": { opacity: 0.7 },
            }}
          >
            {saving ? "Saving..." : "Save Address"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

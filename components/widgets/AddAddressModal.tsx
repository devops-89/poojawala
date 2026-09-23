"use client";
import {
  addCustomerAddressAPI,
  updateCustomerAddressAPI,
} from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface AddressFormData {
  id?: string | number;
  venueType: string;
  fullAddress: string;
  addressLabel: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  isDefault: boolean;
}

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (savedAddress?: any) => void;
  initialData?: any | null;
}

export default function AddAddressModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: AddAddressModalProps) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [saving, setSaving] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [addressData, setAddressData] = useState<AddressFormData>({
    venueType: "HOME",
    fullAddress: "",
    addressLabel: "Home",
    city: "",
    state: "",
    pincode: "",
    latitude: "0",
    longitude: "0",
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setAddressData({
        id: initialData.id,
        venueType: initialData.venueType || "HOME",
        fullAddress: initialData.fullAddress || initialData.addressLine1 || "",
        addressLabel: initialData.addressLabel || "Home",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || initialData.zipCode || "",
        latitude: initialData.latitude || "0",
        longitude: initialData.longitude || "0",
        isDefault: Boolean(initialData.isDefault),
      });
    } else {
      setAddressData({
        venueType: "HOME",
        fullAddress: "",
        addressLabel: "Home",
        city: "",
        state: "",
        pincode: "",
        latitude: "0",
        longitude: "0",
        isDefault: false,
      });
    }
  }, [initialData, open]);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      showSnackbar("Geolocation is not supported by your browser", "error");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toString();
        const lon = position.coords.longitude.toString();

        let newAddressData = {
          ...addressData,
          latitude: lat,
          longitude: lon,
        };

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );
          if (res.ok) {
            const data = await res.json();
            const addressObj = data.address || {};

            newAddressData = {
              ...newAddressData,
              fullAddress: data.display_name || "",
              city:
                addressObj.city ||
                addressObj.town ||
                addressObj.village ||
                addressObj.state_district ||
                "",
              state: addressObj.state || "",
              pincode: addressObj.postcode || "",
            };
          }
        } catch (err) {
          console.error("Failed to reverse geocode:", err);
        }

        setAddressData(newAddressData);
        showSnackbar("Location data fetched successfully!", "success");
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error(error);
        showSnackbar(
          "Failed to fetch location. Please allow location access.",
          "error",
        );
        setIsFetchingLocation(false);
      },
    );
  };

  const handleSave = async () => {
    const missingFields = [];
    if (!addressData.addressLabel?.trim()) missingFields.push("Address Label");
    if (!addressData.fullAddress?.trim()) missingFields.push("Full Address");
    if (!addressData.city?.trim()) missingFields.push("City");
    if (!addressData.state?.trim()) missingFields.push("State");
    if (!addressData.pincode?.trim()) missingFields.push("Pincode");

    if (missingFields.length > 0) {
      showSnackbar(
        `Please fill in required fields: ${missingFields.join(", ")}`,
        "error",
      );
      return;
    }

    setSaving(true);
    try {
      let result = null;
      if (addressData.id) {
        result = await updateCustomerAddressAPI(addressData.id, addressData);
        showSnackbar("Address updated successfully", "success");
      } else {
        result = await addCustomerAddressAPI(addressData);
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
        "& .MuiDialog-paper": { borderRadius: "20px" },
        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: "#FF6200",
        },
        "& .MuiInputLabel-root.Mui-focused": { color: "#FF6200" },
      }}
    >
      <DialogTitle
        sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, pb: 1 }}
      >
        {addressData.id ? "Edit Address" : "Add New Address"}
      </DialogTitle>
      <DialogContent dividers>
        <Button
          fullWidth
          variant="outlined"
          onClick={fetchCurrentLocation}
          disabled={isFetchingLocation}
          startIcon={
            isFetchingLocation ? (
              <CircularProgress size={16} />
            ) : (
              <MyLocationIcon />
            )
          }
          sx={{
            mb: 3,
            py: 1.5,
            color: "#388e3c",
            borderColor: "#c8e6c9",
            bgcolor: "#e8f5e9",
            "&:hover": { bgcolor: "#c8e6c9", borderColor: "#a5d6a7" },
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "12px",
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          {isFetchingLocation
            ? "Locating..."
            : "Use Current Location Coordinates"}
        </Button>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address Label (e.g., Home, Office) *"
              value={addressData.addressLabel}
              onChange={(e) =>
                setAddressData({
                  ...addressData,
                  addressLabel: e.target.value,
                })
              }
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Full Address *"
              value={addressData.fullAddress}
              onChange={(e) =>
                setAddressData({
                  ...addressData,
                  fullAddress: e.target.value,
                })
              }
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="City *"
              value={addressData.city}
              onChange={(e) =>
                setAddressData({ ...addressData, city: e.target.value })
              }
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="State *"
              value={addressData.state}
              onChange={(e) =>
                setAddressData({ ...addressData, state: e.target.value })
              }
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Pincode *"
              value={addressData.pincode}
              onChange={(e) =>
                setAddressData({ ...addressData, pincode: e.target.value })
              }
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addressData.isDefault}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      isDefault: e.target.checked,
                    })
                  }
                  sx={{
                    color: "#FF6200",
                    "&.Mui-checked": { color: "#FF6200" },
                  }}
                />
              }
              label={
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif' }}>
                  Set as default address
                </Typography>
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Latitude (Optional)"
              value={addressData.latitude}
              onChange={(e) =>
                setAddressData({ ...addressData, latitude: e.target.value })
              }
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Longitude (Optional)"
              value={addressData.longitude}
              onChange={(e) =>
                setAddressData({ ...addressData, longitude: e.target.value })
              }
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#64748b",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Box
          component="button"
          onClick={handleSave}
          disabled={saving}
          sx={{
            bgcolor: "#FF6200 !important",
            color: "white !important",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            px: 2.5,
            py: 1,
            borderRadius: "6px",
            transition: "background-color 0.2s",
            opacity: saving ? 0.7 : 1,
            "&:hover": { bgcolor: "#ea580c !important" },
          }}
        >
          {saving
            ? "Saving..."
            : addressData.id
              ? "Save Address"
              : "Save Address"}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

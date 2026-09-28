"use client";

import React from "react";
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
import MyLocationIcon from "@mui/icons-material/MyLocation";

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
  onSaveAddress: () => void;
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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800 }}
      >
        {selectedAddressId ? "Edit Service Area" : "Add New Service Area"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<MyLocationIcon />}
            onClick={onFetchCurrentLocation}
            disabled={isFetchingLocation}
            sx={{
              color: "#FF6200",
              borderColor: "#FF6200",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              "&:hover": { borderColor: "#F05A00", bgcolor: "#FFF8F2" },
            }}
          >
            {isFetchingLocation
              ? "Fetching Location..."
              : "Use Current Location"}
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address Label (e.g. Home, Office, Temple)"
              value={addressForm.addressLabel}
              onChange={(e) =>
                setAddressForm({ ...addressForm, addressLabel: e.target.value })
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Full Address"
              value={addressForm.fullAddress}
              onChange={(e) =>
                setAddressForm({ ...addressForm, fullAddress: e.target.value })
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Street Name / Landmark"
              value={addressForm.streetName}
              onChange={(e) =>
                setAddressForm({ ...addressForm, streetName: e.target.value })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="City"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="State"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Pincode"
              value={addressForm.pincode}
              onChange={(e) =>
                setAddressForm({ ...addressForm, pincode: e.target.value })
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                mb: 1,
              }}
            >
              Service Radius: {addressForm.serviceRadiusKm} km
            </Typography>
            <Slider
              value={addressForm.serviceRadiusKm}
              onChange={(_, val) =>
                setAddressForm({
                  ...addressForm,
                  serviceRadiusKm: val as number,
                })
              }
              min={1}
              max={100}
              valueLabelDisplay="auto"
              sx={{ color: "#FF6200" }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                  color="warning"
                />
              }
              label="Set as default service location"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#666", textTransform: "none", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSaveAddress}
          variant="contained"
          disabled={savingAddress}
          sx={{
            background: "#FF6200 !important",
            color: "white !important",
            borderRadius: "8px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { background: "#F05A00 !important" },
          }}
        >
          {savingAddress ? "Saving..." : "Save Location"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

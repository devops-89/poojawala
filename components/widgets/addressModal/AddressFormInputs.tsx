"use client";
import React from "react";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AddressFormData } from "@/utils/types";
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
  AddressValidationErrors,
} from "@/utils/helpers";

interface AddressFormInputsProps {
  addressData: AddressFormData;
  setAddressData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  onPincodeChange: (val: string) => void;
  onAddressInputChange: (val: string) => void;
  onAddressInputBlur?: () => void;
  errors?: AddressValidationErrors;
  setErrors?: React.Dispatch<React.SetStateAction<AddressValidationErrors>>;
}

export default function AddressFormInputs({
  addressData,
  setAddressData,
  onPincodeChange,
  onAddressInputChange,
  onAddressInputBlur,
  errors = {},
  setErrors,
}: AddressFormInputsProps) {
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {/* ROW 1: PINCODE & ADDRESS LABEL IN 2-COLUMN GRID */}
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
            onPincodeChange(val);
            if (errors?.pincode && setErrors) {
              setErrors((prev) => ({ ...prev, pincode: undefined }));
            }
          }}
          slotProps={{ htmlInput: { maxLength: 6, inputMode: "numeric" } }}
          variant="outlined"
          error={Boolean(errors?.pincode)}
          helperText={errors?.pincode}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            "& .MuiInputBase-input": { fontSize: { xs: "0.95rem", sm: "1rem" } },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Address Label (e.g., Home, Office) *"
          value={addressData.addressLabel}
          onKeyDown={allowOnlyAddressLabelCharsOnKeyDown}
          onChange={(e) => {
            const val = sanitizeAddressLabelInput(e.target.value);
            setAddressData({
              ...addressData,
              addressLabel: val,
            });
            if (errors?.addressLabel && setErrors) {
              setErrors((prev) => ({ ...prev, addressLabel: undefined }));
            }
          }}
          slotProps={{ htmlInput: { maxLength: 50 } }}
          variant="outlined"
          error={Boolean(errors?.addressLabel)}
          helperText={errors?.addressLabel}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            "& .MuiInputBase-input": { fontSize: { xs: "0.95rem", sm: "1rem" } },
          }}
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
            onAddressInputChange(val);
            if (errors?.fullAddress && setErrors) {
              setErrors((prev) => ({ ...prev, fullAddress: undefined }));
            }
          }}
          onBlur={onAddressInputBlur}
          variant="outlined"
          error={Boolean(errors?.fullAddress)}
          helperText={
            errors?.fullAddress ||
            "Enter your complete street, house/flat or landmark address details."
          }
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            "& .MuiInputBase-input": { fontSize: { xs: "0.95rem", sm: "1rem" } },
          }}
        />
      </Grid>

      {/* ROW 3: CITY & STATE IN 2-COLUMN GRID */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="City *"
          value={addressData.city}
          onKeyDown={allowOnlyLettersOnKeyDown}
          onChange={(e) => {
            const val = sanitizeLettersOnly(e.target.value).slice(0, 60);
            setAddressData({ ...addressData, city: val });
            if (errors?.city && setErrors) {
              setErrors((prev) => ({ ...prev, city: undefined }));
            }
          }}
          slotProps={{ htmlInput: { maxLength: 60 } }}
          variant="outlined"
          error={Boolean(errors?.city)}
          helperText={errors?.city}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            "& .MuiInputBase-input": { fontSize: { xs: "0.95rem", sm: "1rem" } },
          }}
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
            setAddressData({ ...addressData, state: val });
            if (errors?.state && setErrors) {
              setErrors((prev) => ({ ...prev, state: undefined }));
            }
          }}
          slotProps={{ htmlInput: { maxLength: 60 } }}
          variant="outlined"
          error={Boolean(errors?.state)}
          helperText={errors?.state}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            "& .MuiInputBase-input": { fontSize: { xs: "0.95rem", sm: "1rem" } },
          }}
        />
      </Grid>

      {/* DEFAULT CHECKBOX */}
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
                color: COLORS.PRIMARY,
                "&.Mui-checked": { color: COLORS.PRIMARY },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Set as default address
            </Typography>
          }
        />
      </Grid>
    </Grid>
  );
}

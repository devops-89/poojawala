"use client";
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

interface AddressFormInputsProps {
  addressData: AddressFormData;
  setAddressData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  onPincodeChange: (val: string) => void;
  onAddressInputChange: (val: string) => void;
  onAddressInputBlur?: () => void;
}

export default function AddressFormInputs({
  addressData,
  setAddressData,
  onPincodeChange,
  onAddressInputChange,
  onAddressInputBlur,
}: AddressFormInputsProps) {
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {/* ROW 1: PINCODE & ADDRESS LABEL IN 2-COLUMN GRID */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Pincode *"
          value={addressData.pincode}
          onChange={(e) => onPincodeChange(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 6, inputMode: "numeric" } }}
          variant="outlined"
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
          onChange={(e) =>
            setAddressData({
              ...addressData,
              addressLabel: e.target.value,
            })
          }
          variant="outlined"
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
          onChange={(e) => onAddressInputChange(e.target.value)}
          onBlur={onAddressInputBlur}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            "& .MuiInputBase-input": { fontSize: { xs: "0.95rem", sm: "1rem" } },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: "#6b7280",
            mt: 0.5,
            display: "block",
            fontSize: { xs: "0.72rem", sm: "0.75rem" },
          }}
        >
          Fill any one of address, city or pincode. The map marker and location details update automatically.
        </Typography>
      </Grid>

      {/* ROW 3: CITY & STATE IN 2-COLUMN GRID */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="City *"
          value={addressData.city}
          onChange={(e) =>
            setAddressData({ ...addressData, city: e.target.value })
          }
          variant="outlined"
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
          onChange={(e) =>
            setAddressData({ ...addressData, state: e.target.value })
          }
          variant="outlined"
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

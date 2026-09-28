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
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

interface BankModalProps {
  open: boolean;
  onClose: () => void;
  selectedBankId: number | null;
  bankForm: {
    paymentMethod: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountType: string;
    upiId: string;
    isPrimary: boolean;
  };
  setBankForm: React.Dispatch<React.SetStateAction<any>>;
  onSaveBank: () => void;
  savingBank: boolean;
}

export const BankModal: React.FC<BankModalProps> = ({
  open,
  onClose,
  selectedBankId,
  bankForm,
  setBankForm,
  onSaveBank,
  savingBank,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800 }}
      >
        {selectedBankId ? "Edit Bank Account" : "Add Bank Account"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              mb: 1,
            }}
          >
            Select Payout Method
          </Typography>
          <RadioGroup
            row
            value={bankForm.paymentMethod}
            onChange={(e) =>
              setBankForm({ ...bankForm, paymentMethod: e.target.value })
            }
          >
            <FormControlLabel
              value="BANK"
              control={<Radio color="warning" />}
              label="Bank Account"
            />
            <FormControlLabel
              value="UPI"
              control={<Radio color="warning" />}
              label="UPI ID"
            />
          </RadioGroup>
        </Box>

        {bankForm.paymentMethod === "UPI" ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="UPI ID (e.g. mobile@upi, username@okaxis)"
                value={bankForm.upiId}
                onChange={(e) =>
                  setBankForm({ ...bankForm, upiId: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Account Holder Name"
                value={bankForm.accountHolderName}
                onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    accountHolderName: e.target.value,
                  })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Bank Name"
                value={bankForm.bankName}
                onChange={(e) =>
                  setBankForm({ ...bankForm, bankName: e.target.value })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Account Number"
                value={bankForm.accountNumber}
                onChange={(e) =>
                  setBankForm({ ...bankForm, accountNumber: e.target.value })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="IFSC Code"
                value={bankForm.ifscCode}
                onChange={(e) =>
                  setBankForm({ ...bankForm, ifscCode: e.target.value })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Select
                fullWidth
                value={bankForm.accountType}
                onChange={(e) =>
                  setBankForm({ ...bankForm, accountType: e.target.value })
                }
              >
                <MenuItem value="SAVINGS">Savings Account</MenuItem>
                <MenuItem value="CURRENT">Current Account</MenuItem>
              </Select>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={bankForm.isPrimary}
                onChange={(e) =>
                  setBankForm({ ...bankForm, isPrimary: e.target.checked })
                }
                color="warning"
              />
            }
            label="Set as primary payout account"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#666", textTransform: "none", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSaveBank}
          variant="contained"
          disabled={savingBank}
          sx={{
            background: "#FF6200 !important",
            color: "white !important",
            borderRadius: "8px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { background: "#F05A00 !important" },
          }}
        >
          {savingBank ? "Saving..." : "Save Details"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

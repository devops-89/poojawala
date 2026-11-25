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
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { allowOnlyLettersOnKeyDown, sanitizeLettersOnly } from "@/utils/helpers";

interface BankModalProps {
  open: boolean;
  onClose: () => void;
  selectedBankId: number | string | null;
  bankForm: {
    id?: number | string | null;
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

  const isEdit = Boolean(selectedBankId || bankForm?.id);
  const initialBankRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (open) {
      initialBankRef.current = {
        paymentMethod: bankForm?.paymentMethod || "BANK",
        accountHolderName: bankForm?.accountHolderName || "",
        accountNumber: bankForm?.accountNumber || "",
        ifscCode: bankForm?.ifscCode || "",
        bankName: bankForm?.bankName || "",
        accountType: bankForm?.accountType || "SAVINGS",
        upiId: bankForm?.upiId || "",
        isPrimary: Boolean(bankForm?.isPrimary),
      };
    }
  }, [open, selectedBankId]);

  const isBankDirty = React.useMemo(() => {
    const currentMethod = bankForm.paymentMethod || "BANK";
    const currentHolder = (bankForm.accountHolderName || "").trim();
    const currentAcc = (bankForm.accountNumber || "").trim();
    const currentIfsc = (bankForm.ifscCode || "").trim();
    const currentBankName = (bankForm.bankName || "").trim();
    const currentType = bankForm.accountType || "SAVINGS";
    const currentUpi = (bankForm.upiId || "").trim();
    const currentPrimary = Boolean(bankForm.isPrimary);

    if (!isEdit) {
      if (currentMethod === "UPI") {
        return Boolean(currentUpi);
      }
      return Boolean(currentHolder && currentAcc && currentIfsc && currentBankName);
    }

    const init = initialBankRef.current || {};
    return (
      currentMethod !== (init.paymentMethod || "BANK") ||
      currentHolder !== (init.accountHolderName || "").trim() ||
      currentAcc !== (init.accountNumber || "").trim() ||
      currentIfsc !== (init.ifscCode || "").trim() ||
      currentBankName !== (init.bankName || "").trim() ||
      currentType !== (init.accountType || "SAVINGS") ||
      currentUpi !== (init.upiId || "").trim() ||
      currentPrimary !== Boolean(init.isPrimary)
    );
  }, [isEdit, bankForm]);

  const isSaveDisabled = savingBank || !isBankDirty;


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: "14px", sm: "18px" },
            border: "1.5px solid #FF9800",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.2)",
            m: { xs: 1.5, sm: "auto" },
            width: { xs: "calc(100% - 24px)", sm: "auto" },
            maxHeight: "calc(100% - 32px)",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#2C1810",
          fontSize: { xs: "17px", sm: "19px" },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: { xs: 1.5, sm: 1.8 },
          px: { xs: 2, sm: 2.5 },
          bgcolor: "#FAF4EE",
          borderBottom: "1px solid #EFE6D5",
        }}
      >
        {selectedBankId ? "Edit Bank Account" : "Add Bank Account"}
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#7C6A60",
            bgcolor: "#F5ECE3",
            p: 0.6,
            "&:hover": { bgcolor: "#EFE6D5", color: "#2C1810" },
          }}
        >
          <CloseIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
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
                  setBankForm({ ...bankForm, upiId: e.target.value.trim() })
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
                label="Account Holder Name *"
                value={bankForm.accountHolderName}
                onKeyDown={allowOnlyLettersOnKeyDown}
                onChange={(e) =>
                  setBankForm({
                    ...bankForm,
                    accountHolderName: sanitizeLettersOnly(e.target.value),
                  })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Bank Name *"
                value={bankForm.bankName}
                onKeyDown={allowOnlyLettersOnKeyDown}
                onChange={(e) =>
                  setBankForm({ ...bankForm, bankName: sanitizeLettersOnly(e.target.value) })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Account Number *"
                value={bankForm.accountNumber}
                onKeyDown={(e) => {
                  if (
                    !/\d/.test(e.key) &&
                    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter", "Home", "End"].includes(e.key) &&
                    !e.ctrlKey &&
                    !e.metaKey
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 18);
                  setBankForm({ ...bankForm, accountNumber: val });
                }}
                slotProps={{ htmlInput: { maxLength: 18, inputMode: "numeric" } }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="IFSC Code *"
                value={bankForm.ifscCode}
                onKeyDown={(e) => {
                  if (
                    !/[a-zA-Z0-9]/.test(e.key) &&
                    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter", "Home", "End"].includes(e.key) &&
                    !e.ctrlKey &&
                    !e.metaKey
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 11);
                  setBankForm({ ...bankForm, ifscCode: val });
                }}
                slotProps={{ htmlInput: { maxLength: 11 } }}
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
      <DialogActions sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5, bgcolor: "#FAF4EE", borderTop: "1px solid #EFE6D5" }}>
        <Button
          onClick={onClose}
          sx={{ color: "#666", textTransform: "none", fontWeight: 700, fontFamily: FONTS.OUTFIT }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSaveBank}
          variant="contained"
          disabled={isSaveDisabled}
          sx={{
            background: isSaveDisabled ? "#cbd5e1 !important" : "#FF6200 !important",
            cursor: isSaveDisabled ? "not-allowed !important" : "pointer",
            color: isSaveDisabled ? "#64748b !important" : "white !important",
            borderRadius: "8px",
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
            fontSize: "13.5px",
            textTransform: "none",
            px: 3,
            height: "38px",
            boxShadow: isSaveDisabled ? "none" : "0 4px 12px rgba(255, 98, 0, 0.25)",
            "&:hover": {
              background: isSaveDisabled ? "#cbd5e1 !important" : "#F05A00 !important",
            },
          }}
        >
          {savingBank ? "Saving..." : isEdit ? "Update Details" : "Save Details"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

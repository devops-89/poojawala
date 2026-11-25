"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";

interface BookingCancelModalProps {
  open: boolean;
  onClose: () => void;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  onConfirmCancel: () => void;
  isCancelling: boolean;
}

export const BookingCancelModal: React.FC<BookingCancelModalProps> = ({
  open,
  onClose,
  cancelReason,
  setCancelReason,
  onConfirmCancel,
  isCancelling,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: "16px", sm: "18px" },
            border: "1px solid #EFE6D5",
            boxShadow: "0 20px 48px rgba(0, 0, 0, 0.16)",
            m: { xs: 2, sm: "auto" },
            width: { xs: "calc(100% - 32px)", sm: "480px" },
            maxWidth: { xs: "100%", sm: "500px" },
            p: { xs: 0.5, sm: 1 },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#1E293B",
          fontSize: { xs: "18px", sm: "20px" },
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CancelIcon sx={{ color: "#DC2626", fontSize: 22 }} />
          <span>Cancel Booking</span>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#94A3B8",
            "&:hover": { color: "#475569", bgcolor: "#F1F5F9" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: "8px !important" }}>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748B",
            mb: 2,
            fontSize: { xs: "13px", sm: "13.5px" },
            lineHeight: 1.5,
          }}
        >
          Please provide a reason for cancelling this booking. This information
          helps us improve our services.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Enter cancellation reason..."
          variant="outlined"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "13px", sm: "13.5px" },
              bgcolor: "#FAFAFA",
              "& fieldset": { borderColor: "#E2E8F0" },
              "&:hover fieldset": { borderColor: "#CBD5E1" },
              "&.Mui-focused fieldset": {
                borderColor: COLORS.PRIMARY,
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 2.5 },
          pt: 1.5,
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "#475569",
            borderColor: "#CBD5E1",
            textTransform: "none",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 600,
            borderRadius: "8px",
            px: 2.5,
            height: "38px",
            fontSize: "13px",
            "&:hover": { bgcolor: "#F8FAFC", borderColor: "#94A3B8" },
          }}
          disabled={isCancelling}
        >
          Back
        </Button>
        <Button
          onClick={onConfirmCancel}
          variant="contained"
          disabled={isCancelling || !cancelReason.trim()}
          sx={{
            background: "#DC2626 !important",
            color: "white !important",
            textTransform: "none",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            borderRadius: "8px",
            boxShadow: "none",
            px: 3,
            height: "38px",
            fontSize: "13px",
            "&:hover": {
              background: "#B91C1C !important",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)",
            },
            "&.Mui-disabled": {
              background: "#FECACA !important",
              color: "white !important",
              opacity: 0.8,
            },
          }}
        >
          {isCancelling ? "Cancelling..." : "Confirm Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

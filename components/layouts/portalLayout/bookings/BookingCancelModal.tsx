"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#D32F2F",
        }}
      >
        Cancel Booking
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#666",
            mb: 3,
            mt: 1,
            fontSize: "14px",
          }}
        >
          Please provide a reason for cancelling this booking. This information
          helps us improve our services.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter cancellation reason..."
          variant="outlined"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontFamily: FONTS.OUTFIT,
              "&.Mui-focused fieldset": {
                borderColor: COLORS.PRIMARY,
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "flex-end", gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#666", textTransform: "none", fontWeight: 600 }}
          disabled={isCancelling}
        >
          Back
        </Button>
        <Button
          onClick={onConfirmCancel}
          variant="contained"
          color="error"
          disabled={isCancelling || !cancelReason.trim()}
          sx={{
            background: "#D32F2F !important",
            color: "white !important",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            minWidth: "120px",
            "&:hover": {
              background: "#B71C1C !important",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              background: "#ef5350 !important",
              color: "white !important",
              opacity: 0.7,
            },
          }}
        >
          {isCancelling ? "Cancelling..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

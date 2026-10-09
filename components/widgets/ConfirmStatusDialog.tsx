"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface ConfirmStatusDialogProps {
  open: boolean;
  title?: string;
  itemName?: string;
  newStatus?: string;
  customMessage?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmStatusDialog({
  open,
  title = "Confirm Status Change",
  itemName,
  newStatus,
  customMessage,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmStatusDialogProps) {
  const formattedStatus = newStatus
    ? newStatus.replace(/_/g, " ").toUpperCase()
    : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          width: { xs: "calc(100% - 32px)", sm: "100%" },
          m: { xs: 2, sm: "auto" },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: FONTS.OUTFIT_ONLY,
          fontWeight: 700,
          color: COLORS.SLATE_DARK,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          component="div"
          sx={{
            fontFamily: FONTS.OUTFIT_ONLY,
            color: "#475569",
          }}
        >
          {customMessage ? (
            customMessage
          ) : (
            <>
              Are you sure you want to change status of{" "}
              {itemName ? <strong>&quot;{itemName}&quot;</strong> : "this item"}{" "}
              to {formattedStatus ? <strong>{formattedStatus}</strong> : "the selected status"}?
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: COLORS.SLATE_MUTED,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: COLORS.BRAND_ORANGE,
            color: COLORS.WHITE,
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
          }}
        >
          {loading ? "Updating..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

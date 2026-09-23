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

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  itemName?: string;
  customMessage?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  title = "Confirm Delete",
  itemName,
  customMessage,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmDeleteDialogProps) {
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
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            color: "#475569",
          }}
        >
          {customMessage ? (
            customMessage
          ) : itemName ? (
            <>
              Are you sure you want to delete <strong>&quot;{itemName}&quot;</strong>? This action cannot be undone.
            </>
          ) : (
            "Are you sure you want to delete this item? This action cannot be undone."
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "#64748b",
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
          color="error"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

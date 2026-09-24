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
          component="div"
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            color: "#475569",
          }}
        >
          {customMessage ? (
            customMessage
          ) : (
            <>
              Are you sure you want to change status of{" "}
              {itemName ? <strong>&quot;{itemName}&quot;</strong> : "this item"}{" "}
              to {newStatus ? <strong>{newStatus}</strong> : "the selected status"}?
            </>
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
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: "#FF6200",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            "&:hover": { bgcolor: "#E65800" },
          }}
        >
          {loading ? "Updating..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

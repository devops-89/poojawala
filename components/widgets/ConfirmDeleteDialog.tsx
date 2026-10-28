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
  // Preserve last valid props so that during closing exit animation,
  // title, itemName, and customMessage do not flicker or flash default text!
  const lastPropsRef = React.useRef({
    title,
    itemName,
    customMessage,
  });

  if (open) {
    lastPropsRef.current = {
      title,
      itemName,
      customMessage,
    };
  }

  const activeTitle = open ? title : lastPropsRef.current.title;
  const activeItemName = open ? itemName : lastPropsRef.current.itemName;
  const activeCustomMessage = open ? customMessage : lastPropsRef.current.customMessage;

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
        {activeTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          component="div"
          sx={{
            fontFamily: FONTS.OUTFIT_ONLY,
            color: "#475569",
          }}
        >
          {activeCustomMessage ? (
            activeCustomMessage
          ) : activeItemName ? (
            <>
              Are you sure you want to delete <strong>&quot;{activeItemName}&quot;</strong>? This action cannot be undone.
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

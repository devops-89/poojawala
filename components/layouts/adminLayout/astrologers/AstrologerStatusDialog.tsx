"use client";
import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { FONTS } from "@/utils/fonts";

interface AstrologerStatusDialogProps {
  target: { astrologer: any; newStatus: string } | null;
  rejectionReason: string;
  onRejectionReasonChange: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AstrologerStatusDialog: React.FC<AstrologerStatusDialogProps> = ({
  target,
  rejectionReason,
  onRejectionReasonChange,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <ConfirmStatusDialog
      open={Boolean(target)}
      title="Change Verification Status"
      itemName={target?.astrologer?.name}
      newStatus={target?.newStatus}
      customMessage={
        target?.newStatus === "Rejected" ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
            <Typography sx={{ color: "#475569", fontFamily: FONTS.OUTFIT }}>
              Please provide a rejection reason for <strong>{target?.astrologer?.name}</strong>:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason *"
              placeholder="e.g. Invalid documents uploaded"
              variant="outlined"
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Box>
        ) : undefined
      }
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
    />
  );
};

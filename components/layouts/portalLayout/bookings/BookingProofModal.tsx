"use client";
import { FONTS } from "@/utils/fonts";

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface BookingProofModalProps {
  proofPreview: string | null;
  onClose: () => void;
  onUploadProof: () => void;
  isUploadingProof: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BookingProofModal: React.FC<BookingProofModalProps> = ({
  proofPreview,
  onClose,
  onUploadProof,
  isUploadingProof,
  fileInputRef,
  handleFileChange,
}) => {
  return (
    <>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Dialog
        open={Boolean(proofPreview)}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800 }}
        >
          Submit Proof Image
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            {proofPreview && (
              <img
                src={proofPreview}
                alt="Proof Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "8px",
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            sx={{ color: "#666", textTransform: "none", fontWeight: 600 }}
            disabled={isUploadingProof}
          >
            Cancel
          </Button>
          <Button
            onClick={onUploadProof}
            variant="contained"
            disabled={isUploadingProof}
            sx={{
              background: "#4CAF50 !important",
              color: "#fff !important",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                background: "#388E3C !important",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                background: "#81C784 !important",
                color: "#ffffff !important",
                opacity: 0.7,
              },
            }}
          >
            {isUploadingProof ? "Uploading..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

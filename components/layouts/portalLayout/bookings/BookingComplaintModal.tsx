"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

interface BookingComplaintModalProps {
  open: boolean;
  onClose: () => void;
  complaintCategory: string;
  setComplaintCategory: (val: string) => void;
  complaintSubject: string;
  setComplaintSubject: (val: string) => void;
  complaintDescription: string;
  setComplaintDescription: (val: string) => void;
  complaintFiles: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSubmitComplaint: () => void;
  isSubmittingComplaint: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const BookingComplaintModal: React.FC<BookingComplaintModalProps> = ({
  open,
  onClose,
  complaintCategory,
  setComplaintCategory,
  complaintSubject,
  setComplaintSubject,
  complaintDescription,
  setComplaintDescription,
  complaintFiles,
  onFileChange,
  onRemoveFile,
  onSubmitComplaint,
  isSubmittingComplaint,
  fileInputRef,
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
            width: { xs: "calc(100% - 32px)", sm: "580px", md: "620px" },
            maxWidth: { xs: "100%", sm: "620px" },
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
          pt: { xs: 1, sm: 1.5 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ReportProblemIcon sx={{ color: "#DC2626", fontSize: 22 }} />
          <span>Raise a Complaint</span>
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.8, sm: 2 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 1.8, sm: 2 },
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel
                id="complaint-category-label"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13.5px",
                  "&.Mui-focused": { color: COLORS.PRIMARY },
                }}
              >
                Category
              </InputLabel>
              <Select
                labelId="complaint-category-label"
                value={complaintCategory}
                label="Category"
                onChange={(e) => setComplaintCategory(e.target.value)}
                sx={{
                  borderRadius: "10px",
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13.5px",
                  bgcolor: "#FAFAFA",
                  "& fieldset": { borderColor: "#E2E8F0" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.PRIMARY,
                  },
                }}
              >
                <MenuItem value="BEHAVIOR_ISSUE" sx={{ fontFamily: FONTS.OUTFIT, fontSize: "13.5px" }}>
                  Behavior Issue
                </MenuItem>
                <MenuItem value="PAYMENT_ISSUE" sx={{ fontFamily: FONTS.OUTFIT, fontSize: "13.5px" }}>
                  Payment Issue
                </MenuItem>
                <MenuItem value="SERVICE_ISSUE" sx={{ fontFamily: FONTS.OUTFIT, fontSize: "13.5px" }}>
                  Service Issue
                </MenuItem>
                <MenuItem value="OTHER" sx={{ fontFamily: FONTS.OUTFIT, fontSize: "13.5px" }}>
                  Other
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Subject"
              placeholder="Brief subject of complaint"
              variant="outlined"
              value={complaintSubject}
              onChange={(e) => setComplaintSubject(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13.5px",
                  bgcolor: "#FAFAFA",
                  "& fieldset": { borderColor: "#E2E8F0" },
                  "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
                },
                "& .MuiInputLabel-root": {
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13.5px",
                  "&.Mui-focused": { color: COLORS.PRIMARY },
                },
              }}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            placeholder="Detailed description of the issue..."
            variant="outlined"
            value={complaintDescription}
            onChange={(e) => setComplaintDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontFamily: FONTS.OUTFIT,
                fontSize: "13.5px",
                bgcolor: "#FAFAFA",
                "& fieldset": { borderColor: "#E2E8F0" },
                "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
              },
              "& .MuiInputLabel-root": {
                fontFamily: FONTS.OUTFIT,
                fontSize: "13.5px",
                "&.Mui-focused": { color: COLORS.PRIMARY },
              },
            }}
          />

          <Box>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                mb: 0.8,
                fontSize: "13px",
                color: "#475569",
              }}
            >
              Evidence (Optional)
            </Typography>
            <Box
              sx={{
                border: "1.5px dashed #CBD5E1",
                borderRadius: "10px",
                p: 1.5,
                textAlign: "center",
                bgcolor: "#FAFAFA",
                transition: "all 0.15s ease",
                "&:hover": { bgcolor: "#F8FAFC", borderColor: COLORS.PRIMARY },
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onFileChange}
              />
              <Button
                startIcon={<PhotoCameraIcon sx={{ fontSize: 18 }} />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  color: COLORS.PRIMARY,
                  textTransform: "none",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                Upload Images
              </Button>
            </Box>
            {complaintFiles.length > 0 && (
              <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {complaintFiles.map((file, idx) => (
                  <Chip
                    key={idx}
                    label={file.name}
                    onDelete={() => onRemoveFile(idx)}
                    deleteIcon={<CloseIcon />}
                    size="small"
                    sx={{
                      borderRadius: "6px",
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "12px",
                      bgcolor: "#FFF0E6",
                      color: COLORS.PRIMARY,
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
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
          disabled={isSubmittingComplaint}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmitComplaint}
          variant="contained"
          disabled={
            isSubmittingComplaint ||
            !complaintCategory ||
            !complaintSubject ||
            !complaintDescription
          }
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
          {isSubmittingComplaint ? "Submitting..." : "Submit Complaint"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

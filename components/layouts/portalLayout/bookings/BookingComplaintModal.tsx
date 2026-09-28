"use client";

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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 800,
          color: "#D32F2F",
        }}
      >
        Raise a Complaint
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel
              id="complaint-category-label"
              sx={{ "&.Mui-focused": { color: "#FF2600" } }}
            >
              Category
            </InputLabel>
            <Select
              labelId="complaint-category-label"
              value={complaintCategory}
              label="Category"
              onChange={(e) => setComplaintCategory(e.target.value)}
              sx={{
                borderRadius: "8px",
                fontFamily: "var(--font-outfit), sans-serif",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF2600",
                },
              }}
            >
              <MenuItem value="BEHAVIOR_ISSUE">Behavior Issue</MenuItem>
              <MenuItem value="PAYMENT_ISSUE">Payment Issue</MenuItem>
              <MenuItem value="SERVICE_ISSUE">Service Issue</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Subject"
            placeholder="Brief subject of the complaint"
            variant="outlined"
            value={complaintSubject}
            onChange={(e) => setComplaintSubject(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontFamily: "var(--font-outfit), sans-serif",
                "&.Mui-focused fieldset": { borderColor: "#FF2600" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#FF2600" },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            placeholder="Detailed description of the issue..."
            variant="outlined"
            value={complaintDescription}
            onChange={(e) => setComplaintDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontFamily: "var(--font-outfit), sans-serif",
                "&.Mui-focused fieldset": { borderColor: "#FF2600" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#FF2600" },
            }}
          />

          <Box>
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 600,
                mb: 1,
                fontSize: "14px",
              }}
            >
              Evidence (Optional)
            </Typography>
            <Box
              sx={{
                border: "1px dashed #ccc",
                borderRadius: "8px",
                p: 2,
                textAlign: "center",
                bgcolor: "#fafafa",
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
                startIcon={<PhotoCameraIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  color: "#FF6200",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Upload Images
              </Button>
            </Box>
            {complaintFiles.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {complaintFiles.map((file, idx) => (
                  <Chip
                    key={idx}
                    label={file.name}
                    onDelete={() => onRemoveFile(idx)}
                    deleteIcon={<CloseIcon />}
                    size="small"
                    sx={{ borderRadius: "6px" }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#666", textTransform: "none", fontWeight: 600 }}
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
            background: "#D32F2F !important",
            color: "white !important",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            px: 3,
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
          {isSubmittingComplaint ? "Submitting..." : "Submit Complaint"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

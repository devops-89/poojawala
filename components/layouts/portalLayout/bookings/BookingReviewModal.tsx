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
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewIcon from "@mui/icons-material/RateReview";

interface BookingReviewModalProps {
  open: boolean;
  onClose: () => void;
  rating: number | null;
  setRating: (rating: number | null) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  onSubmitReview: () => void;
  isSubmittingReview: boolean;
}

export const BookingReviewModal: React.FC<BookingReviewModalProps> = ({
  open,
  onClose,
  rating,
  setRating,
  reviewText,
  setReviewText,
  onSubmitReview,
  isSubmittingReview,
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
            width: { xs: "calc(100% - 32px)", sm: "500px" },
            maxWidth: { xs: "100%", sm: "520px" },
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
          fontSize: { xs: "18px", sm: "20px" },
          color: "#1E293B",
          pb: 1,
          pt: { xs: 1, sm: 1.5 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RateReviewIcon sx={{ color: "#0284C7", fontSize: 22 }} />
          <span>Add Review</span>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2.5,
            p: { xs: 2, sm: 2.5 },
            borderRadius: "12px",
            bgcolor: "#FFFDF9",
            border: "1px solid #F5ECE0",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              mb: 1.2,
              color: "#475569",
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            Rate your consultation experience:
          </Typography>
          <Rating
            name="job-rating"
            value={rating}
            onChange={(_, newValue) => {
              setRating(newValue);
            }}
            size="large"
            emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
            sx={{
              color: "#F59E0B",
              fontSize: { xs: "32px", sm: "36px" },
            }}
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write your review or client feedback here..."
          variant="outlined"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "13px", sm: "13.5px" },
              bgcolor: "#FAFAFA",
              "& fieldset": {
                borderColor: "#E2E8F0",
              },
              "&:hover fieldset": {
                borderColor: "#CBD5E1",
              },
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
          disabled={isSubmittingReview}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmitReview}
          variant="contained"
          disabled={isSubmittingReview || !rating}
          sx={{
            background: "#FF6200 !important",
            color: "#fff !important",
            textTransform: "none",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            borderRadius: "8px",
            boxShadow: "none",
            px: 3,
            height: "38px",
            fontSize: "13px",
            "&:hover": {
              background: "#F05A00 !important",
              boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
            },
            "&.Mui-disabled": {
              background: "#FFD0B3 !important",
              color: "#ffffff !important",
              opacity: 0.8,
            },
          }}
        >
          {isSubmittingReview ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

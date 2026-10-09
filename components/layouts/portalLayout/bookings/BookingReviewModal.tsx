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
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800 }}
      >
        Add Review
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
            mt: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              mb: 1,
              color: "#333",
            }}
          >
            Rate your experience
          </Typography>
          <Rating
            name="job-rating"
            value={rating}
            onChange={(_, newValue) => {
              setRating(newValue);
            }}
            size="large"
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write your review here..."
          variant="outlined"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
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
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#666", textTransform: "none", fontWeight: 600 }}
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
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": {
              background: "#F05A00 !important",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              background: "#FF8A33 !important",
              color: "#ffffff !important",
              opacity: 0.7,
            },
          }}
        >
          {isSubmittingReview ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React, { useState } from 'react';
import {
  allowOnlyDescriptionCharsOnKeyDown,
  sanitizeDescriptionInput,
  DESCRIPTION_STRICT_REGEX,
  DESCRIPTION_STRICT_MESSAGE,
} from '@/utils/helpers';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { addReviewAPI } from '@/api/bookingControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

interface Props {
  booking: any;
  onReviewAdded: () => void;
}

export default function BookingReviewCard({ booking, onReviewAdded }: Props) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const handleOpen = () => {
    setRating(5);
    setReviewText('');
    setReviewModalOpen(true);
  };

  const handleClose = () => {
    setReviewModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!rating || rating === 0) {
      showSnackbar('Please select a rating', 'error');
      return;
    }

    if (reviewText.trim() && !DESCRIPTION_STRICT_REGEX.test(reviewText.trim())) {
      showSnackbar(DESCRIPTION_STRICT_MESSAGE, 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await addReviewAPI(booking.id, rating, reviewText);
      if (res.success) {
        showSnackbar('Review submitted successfully', 'success');
        handleClose();
        onReviewAdded();
      } else {
        showSnackbar(res.message || 'Failed to submit review', 'error');
      }
    } catch (error: any) {
      console.error(error);
      showSnackbar(error.response?.data?.message || 'Error submitting review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAstrology = booking?.bookingType === 'ASTROLOGY' || Boolean(booking?.astrologer);
  const hasReview = Boolean(
    booking?.customerReview || 
    (booking?.customerRating && Number(booking.customerRating) > 0)
  );

  return (
    <>
      <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
        <Typography variant="h6" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a', mb: 2 }}>
          {isAstrology ? 'Astrology Consultation Review' : 'Customer Review'}
        </Typography>

        {hasReview ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={Number(booking.customerRating) || 5} readOnly size="medium" emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
              <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                {Number(booking.customerRating || 5).toFixed(1)} / 5.0
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#475569', fontSize: '14px', fontStyle: 'italic', bgcolor: '#f8fafc', p: 2, borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              "{booking.customerReview || 'Review submitted without text.'}"
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>
              {isAstrology 
                ? 'You have not submitted a review for this consultation yet. Please share your experience.'
                : 'Please share your experience with this booking.'}
            </Typography>
            <Box
              component="button"
              onClick={handleOpen}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 24px',
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                backgroundColor: COLORS.PRIMARY,
                color: '#ffffff',
                borderRadius: '10px',
                fontFamily: FONTS.PRIMARY,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(255, 98, 0, 0.25)',
                '&:hover': { backgroundColor: COLORS.PRIMARY_DARK, boxShadow: '0 4px 12px rgba(255, 98, 0, 0.35)' }
              }}
            >
              <RateReviewIcon sx={{ fontSize: 18 }} />
              Add Review
            </Box>
          </Box>
        )}
      </Paper>

      <Dialog open={reviewModalOpen} onClose={handleClose} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a' }}>
          {isAstrology ? 'Rate & Review Consultation' : 'Add Review'}
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#1e293b' }}>
                How was your consultation experience?
              </Typography>
              <Rating
                name="booking-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Share your feedback (Optional)"
              variant="outlined"
              value={reviewText}
              onKeyDown={allowOnlyDescriptionCharsOnKeyDown}
              onChange={(e) => setReviewText(sanitizeDescriptionInput(e.target.value))}
              placeholder="How was your consultation experience with the astrologer?"
              sx={{
                '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY },
                '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY },
                '& .Mui-focused fieldset': { borderColor: '#FF6200 !important' },
                '& label.Mui-focused': { color: COLORS.PRIMARY }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: FONTS.PRIMARY }}>
            Cancel
          </Button>
          <Box 
            component="button"
            onClick={handleSubmit} 
            disabled={isSubmitting || !rating} 
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 20px',
              fontSize: '0.875rem',
              border: 'none',
              cursor: (isSubmitting || !rating) ? 'default' : 'pointer',
              transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              backgroundColor: (isSubmitting || !rating) ? '#e2e8f0' : COLORS.PRIMARY,
              color: (isSubmitting || !rating) ? '#94a3b8' : '#ffffff',
              borderRadius: '8px',
              fontFamily: FONTS.PRIMARY,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: (isSubmitting || !rating) ? '#e2e8f0' : COLORS.PRIMARY_DARK }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

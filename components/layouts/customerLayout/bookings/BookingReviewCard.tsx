import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { addReviewAPI } from '@/api/bookingControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

interface Props {
  booking: any;
  onReviewAdded: () => void;
}

export default function BookingReviewCard({ booking, onReviewAdded }: Props) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const handleOpen = () => {
    setRating(0);
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

  const hasReview = booking.customerReview || (booking.reviewStatus && booking.reviewStatus !== 'DRAFT');
  const showAddReviewButton = !hasReview;

  if (!hasReview && !showAddReviewButton) {
    return null; 
  }

  return (
    <>
      <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
        <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 2 }}>
          Customer Review
        </Typography>

        {hasReview ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={booking.customerRating || 5} readOnly size="small" emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
            </Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
              "{booking.customerReview || 'Review submitted without text.'}"
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>
              Please share your experience with this booking.
            </Typography>
            <Box
              component="button"
              onClick={handleOpen}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 24px',
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                backgroundColor: '#FF6200',
                color: '#ffffff',
                borderRadius: '8px',
                fontFamily: '"DM Sans", sans-serif',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#E65800' }
              }}
            >
              Add Review
            </Box>
          </Box>
        )}
      </Paper>

      <Dialog open={reviewModalOpen} onClose={handleClose} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a' }}>
          Add Review
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1e293b' }}>
                How was your experience?
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
              onChange={(e) => setReviewText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' },
                '& .Mui-focused fieldset': { borderColor: '#FF6200 !important' },
                '& label.Mui-focused': { color: '#FF6200' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
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
              padding: '6px 16px',
              fontSize: '0.875rem',
              border: 'none',
              cursor: (isSubmitting || !rating) ? 'default' : 'pointer',
              transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              backgroundColor: (isSubmitting || !rating) ? '#e2e8f0' : '#FF6200',
              color: (isSubmitting || !rating) ? '#94a3b8' : '#ffffff',
              borderRadius: '8px',
              fontFamily: '"DM Sans", sans-serif',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: (isSubmitting || !rating) ? '#e2e8f0' : '#E65800' }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

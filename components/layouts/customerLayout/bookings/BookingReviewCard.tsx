import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React, { useState } from 'react';
import {
  allowOnlyDescriptionCharsOnKeyDown,
  sanitizeDescriptionInput,
  DESCRIPTION_STRICT_REGEX,
  DESCRIPTION_STRICT_MESSAGE,
} from '@/utils/helpers';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CloseIcon from '@mui/icons-material/Close';
import { addReviewAPI } from '@/api/bookingControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

const RATING_LABELS: { [index: number]: { label: string; color: string } } = {
  1: { label: 'Terrible', color: '#dc2626' },
  2: { label: 'Poor', color: '#ea580c' },
  3: { label: 'Average', color: '#d97706' },
  4: { label: 'Very Good', color: '#059669' },
  5: { label: 'Excellent!', color: '#16a34a' },
};

interface Props {
  booking: any;
  onReviewAdded: () => void;
}

export default function BookingReviewCard({ booking, onReviewAdded }: Props) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(5);
  const [hoverRating, setHoverRating] = useState<number>(-1);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const handleOpen = () => {
    setRating(5);
    setHoverRating(-1);
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

  const activeRating = hoverRating !== -1 ? hoverRating : (rating || 5);
  const ratingInfo = RATING_LABELS[activeRating] || RATING_LABELS[5];

  const purohitName =
    booking?.purohit?.user?.firstName ||
    booking?.purohit?.firstName ||
    '';

  const reviewQuestion = isAstrology
    ? 'How was your consultation experience?'
    : purohitName
    ? `How was your pooja experience with ${purohitName}?`
    : 'How was your pooja experience?';

  const reviewPlaceholder = isAstrology
    ? 'How was your consultation experience with the astrologer? (Optional)'
    : 'Share your feedback about the rituals, punctuality, and overall service... (Optional)';

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          borderRadius: { xs: '18px', md: '24px' },
          border: '1.5px solid #EFE6D5',
          boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
          bgcolor: '#FFFFFF',
          height: '100%',
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '18px', mb: 2 }}>
          {isAstrology ? 'Astrology Consultation Review' : 'Customer Review'}
        </Typography>

        {hasReview ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={Number(booking.customerRating) || 5} readOnly size="medium" emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '15px' }}>
                {Number(booking.customerRating || 5).toFixed(1)} / 5.0
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#5C4A40', fontSize: '14px', fontStyle: 'italic', bgcolor: '#FAF4EE', p: 2, borderRadius: '14px', border: '1px solid #EFE6D5' }}>
              "{booking.customerReview || 'Review submitted without text.'}"
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>
              {isAstrology 
                ? 'You have not submitted a review for this consultation yet. Please share your experience.'
                : 'Please share your experience with this booking.'}
            </Typography>
            <Button
              onClick={handleOpen}
              startIcon={<RateReviewIcon sx={{ fontSize: 18 }} />}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: '#ffffff',
                borderRadius: '12px',
                fontFamily: FONTS.OUTFIT,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '13px',
                px: 2.5,
                py: 0.9,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#ea580c' }
              }}
            >
              Add Review
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog
        open={reviewModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: { xs: '18px', sm: '22px' },
            border: '1.5px solid #EFE6D5',
            p: { xs: 0.5, sm: 1 },
            m: { xs: 1.5, sm: 3 },
            maxHeight: 'calc(100% - 32px)',
            bgcolor: '#FFFFFF',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: '#2C1810',
            fontSize: { xs: '17px', sm: '19px' },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: { xs: 1, sm: 1.2 },
            px: { xs: 1.8, sm: 2.5 },
            borderBottom: '1px solid #F5ECE3',
          }}
        >
          {isAstrology ? 'Rate & Review Consultation' : 'Add Review'}
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: '#7C6A60',
              bgcolor: '#FAF4EE',
              p: 0.6,
              '&:hover': { bgcolor: '#F5ECE3', color: '#2C1810' },
            }}
          >
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 1.8, sm: 2.5 }, py: { xs: 1, sm: 1.5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, py: 0.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.6 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: '#2C1810',
                  fontSize: { xs: '14px', sm: '15px' },
                  textAlign: 'center',
                }}
              >
                {reviewQuestion}
              </Typography>
              <Rating
                name="booking-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHoverRating(newHover);
                }}
                sx={{
                  fontSize: { xs: '32px', sm: '38px' },
                  '& .MuiRating-iconFilled': {
                    color: '#f59e0b',
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: '12px',
                  color: ratingInfo.color,
                }}
              >
                {ratingInfo.label}
              </Typography>
            </Box>

            <TextField
              fullWidth
              size="small"
              multiline
              rows={2.5}
              label="Share your feedback (Optional)"
              variant="outlined"
              value={reviewText}
              onKeyDown={allowOnlyDescriptionCharsOnKeyDown}
              onChange={(e) => setReviewText(sanitizeDescriptionInput(e.target.value))}
              placeholder={reviewPlaceholder}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: FONTS.OUTFIT,
                  borderRadius: '12px',
                  bgcolor: '#FFFBF7',
                  border: '1px solid #EFE6D5',
                  fontSize: '13.5px',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: FONTS.OUTFIT,
                  color: '#7C6A60',
                  fontSize: '13px',
                },
                '& .Mui-focused fieldset': {
                  borderColor: `${COLORS.PRIMARY} !important`,
                },
                '& label.Mui-focused': {
                  color: COLORS.PRIMARY,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 1.8, sm: 2.5 },
            py: { xs: 1.2, sm: 1.5 },
            gap: 1.2,
            borderTop: '1px solid #F5ECE3',
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            '& > button': {
              flex: { xs: 1, sm: 'initial' },
            },
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{
              color: COLORS.PRIMARY,
              bgcolor: '#FFF0E6',
              border: '1px solid #FFD4BC',
              textTransform: 'none',
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              fontSize: '12.5px',
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#FFE4D4',
                borderColor: COLORS.PRIMARY,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !rating}
            variant="contained"
            sx={{
              borderRadius: '20px',
              fontFamily: FONTS.OUTFIT,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '12.5px',
              px: 3,
              py: 0.75,
              boxShadow: 'none',
              bgcolor: isSubmitting || !rating ? '#e2e8f0 !important' : `${COLORS.PRIMARY} !important`,
              color: isSubmitting || !rating ? '#94a3b8 !important' : '#ffffff !important',
              '&:hover': { bgcolor: '#ea580c !important' },
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

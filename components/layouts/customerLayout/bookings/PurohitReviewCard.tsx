import React from 'react';
import { Box, Typography, Paper, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface Props {
  booking: any;
}

export default function PurohitReviewCard({ booking }: Props) {
  const hasReview = booking.purohitReview || (booking.purohitRating && booking.purohitRating !== "0.0");

  if (!hasReview) {
    return null; 
  }

  return (
    <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
      <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 2 }}>
        Purohit Review
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={Number(booking.purohitRating) || 5} readOnly size="small" emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
        </Box>
        {booking.purohitReview && (
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
            "{booking.purohitReview}"
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

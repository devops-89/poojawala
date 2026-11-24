import { FONTS } from "@/utils/fonts";
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
        Purohit Review
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={Number(booking.purohitRating) || 5} readOnly size="small" emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
        </Box>
        {booking.purohitReview && (
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#5C4A40', fontSize: '14px', fontStyle: 'italic', bgcolor: '#FAF4EE', p: 2, borderRadius: '14px', border: '1px solid #EFE6D5' }}>
            "{booking.purohitReview}"
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

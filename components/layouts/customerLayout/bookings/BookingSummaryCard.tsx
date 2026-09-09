import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface Props {
  booking: any;
  statusLabel: string;
}

export default function BookingSummaryCard({ booking, statusLabel }: Props) {
  return (
    <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
      <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 3 }}>
        Booking Summary
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>Service</Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking.service?.name ?? 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>Status</Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {statusLabel}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>Payment Status</Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking.paymentStatus || booking.bookingPaymentStatus || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>Booking Mode</Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking.bookingMode ?? 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>Booked On</Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking.createdAtIst ? booking.createdAtIst.split(',')[0] : (booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : 'N/A')}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

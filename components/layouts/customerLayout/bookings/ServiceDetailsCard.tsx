import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface Props {
  booking: any;
}

export default function ServiceDetailsCard({ booking }: Props) {
  return (
    <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
      <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 3 }}>
        Service Details
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>Purohit</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
              {booking.purohit?.user ? `${booking.purohit.user.firstName || ''} ${booking.purohit.user.lastName || ''}`.trim() : 'Not assigned'}
            </Typography>
            {booking.purohit?.avgRating && Number(booking.purohit.avgRating) > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#FFF5F0', px: 1, py: 0.25, borderRadius: '4px' }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#FF6200', fontSize: '12px' }}>
                  {Number(booking.purohit.avgRating).toFixed(1)} ★
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>Phone</Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking.purohit?.user?.phone ?? 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px', minWidth: '80px' }}>Address</Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px', textAlign: 'right', maxWidth: '70%' }}>
            {booking.customerAddress?.fullAddress || booking.address || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>Location</Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking.customerAddress?.city || booking.city || 'N/A'} {booking.customerAddress?.pincode ? `- ${booking.customerAddress.pincode}` : ''}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

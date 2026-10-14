import { FONTS } from "@/utils/fonts";
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface Props {
  booking: any;
}

export default function ServiceDetailsCard({ booking }: Props) {
  return (
    <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
      <Typography variant="h6" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a', mb: 3 }}>
        Purohit Details
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Purohit</Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking.purohit?.user ? `${booking.purohit.user.firstName || ''} ${booking.purohit.user.lastName || ''}`.trim() : 'Not assigned'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Phone</Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking.purohit?.user?.phone ?? 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

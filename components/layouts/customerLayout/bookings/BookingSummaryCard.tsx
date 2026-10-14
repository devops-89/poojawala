import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

interface Props {
  booking: any;
  statusLabel: string;
}

export default function BookingSummaryCard({ booking, statusLabel }: Props) {
  const statusStr = (booking?.status || '').toUpperCase();
  const statusBg =
    statusStr === 'ONGOING' || statusStr === 'ENROUTE' || statusStr === 'ARRIVED'
      ? '#E8F5E9'
      : statusStr === 'COMPLETED'
      ? '#E3F2FD'
      : statusStr === 'CANCELLED'
      ? '#FFEBEE'
      : '#FFF5F0';
  const statusColor =
    statusStr === 'ONGOING' || statusStr === 'ENROUTE' || statusStr === 'ARRIVED'
      ? '#2E7D32'
      : statusStr === 'COMPLETED'
      ? '#1565C0'
      : statusStr === 'CANCELLED'
      ? '#C62828'
      : COLORS.PRIMARY;

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '100%',
      }}
    >
      <Typography variant="h6" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a', mb: 3 }}>
        Booking Summary
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Service</Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking?.service?.name ?? 'N/A'}
          </Typography>
        </Box>

        {booking?.bookingNumber && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Booking Number</Typography>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
              {booking.bookingNumber}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Status</Typography>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              fontWeight: 700,
              fontFamily: FONTS.PRIMARY,
              bgcolor: statusBg,
              color: statusColor,
              fontSize: '12px',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Booking Mode</Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking?.bookingMode === 'OFFLINE'
              ? 'In-Person (Offline)'
              : booking?.bookingMode === 'ONLINE'
              ? 'Virtual (Online)'
              : (booking?.bookingMode ?? 'N/A')}
          </Typography>
        </Box>

        {booking?.plan && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Package Plan</Typography>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
              {booking.plan.charAt(0).toUpperCase() + booking.plan.slice(1).toLowerCase()} Plan
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Booked On</Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking?.createdAtIst
              ? booking.createdAtIst.split(',')[0]
              : booking?.createdAt
              ? new Date(booking.createdAt).toLocaleDateString('en-IN')
              : 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

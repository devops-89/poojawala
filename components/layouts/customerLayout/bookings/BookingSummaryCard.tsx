import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React from 'react';
import moment from 'moment';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { formatInr, getBookingPaymentDetails } from './bookingPaymentHelper';
import { formatScheduledDateTime } from '@/utils/helpers';

interface Props {
  booking: any;
  statusLabel: string;
}

export default function BookingSummaryCard({ booking, statusLabel }: Props) {
  const isAstrology = booking?.bookingType === 'ASTROLOGY' || Boolean(booking?.astrologer);
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

  const astro = booking?.astrologer;
  const astroName = astro ? `${astro.firstName || ''} ${astro.lastName || ''}`.trim() : null;

  const ratePerMinute =
    booking?.astrologer?.astrologerProfile?.ratePerMinute ||
    booking?.astrologerProfile?.ratePerMinute ||
    null;

  const payDetails = getBookingPaymentDetails(booking);
  const consultationAmount = payDetails.finalAmount || Number(booking?.finalAmount ?? booking?.servicePrice ?? 0);

  const serviceName = isAstrology
    ? (booking?.service?.name ||
       booking?.serviceName ||
       booking?.service?.title ||
       (astroName ? `Astrology Consultation with ${astroName}` : 'Astrology Consultation'))
    : (booking?.service?.name ||
       booking?.serviceName ||
       booking?.service?.title ||
       booking?.serviceTitle ||
       booking?.poojaName ||
       booking?.pooja?.name ||
       booking?.title ||
       'Pooja Service');

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
      <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '18px', mb: 3 }}>
        Booking Summary
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>
            {isAstrology ? 'Service Type' : 'Service'}
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '14px' }}>
            {serviceName}
          </Typography>
        </Box>

        {isAstrology && astroName && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Astrologer</Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '14px' }}>
              {astroName}
            </Typography>
          </Box>
        )}

        {booking?.bookingNumber && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Booking Number</Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '14px' }}>
              {booking.bookingNumber}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Status</Typography>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              bgcolor: statusBg,
              color: statusColor,
              borderRadius: '20px',
              fontSize: '12px',
              border: `1px solid rgba(0,0,0,0.06)`,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Booking Mode</Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
            {booking?.bookingMode === 'OFFLINE'
              ? 'In-Person (Offline)'
              : booking?.bookingMode === 'ONLINE'
              ? 'Virtual (Online Consultation)'
              : (booking?.bookingMode ?? 'N/A')}
          </Typography>
        </Box>

        {isAstrology && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Consultation Fee</Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: '#2C1810', fontSize: '14px' }}>
                ₹{formatInr(consultationAmount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Payment Status</Typography>
              <Chip
                label={booking?.paymentStatus === 'PAID' ? 'Paid' : 'Payment Pending'}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  bgcolor: booking?.paymentStatus === 'PAID' ? '#ecfdf5' : '#fef2f2',
                  color: booking?.paymentStatus === 'PAID' ? '#166534' : '#b91c1c',
                  border: `1px solid ${booking?.paymentStatus === 'PAID' ? '#bbf7d0' : '#fecaca'}`,
                  borderRadius: '20px',
                  fontSize: '12px',
                }}
              />
            </Box>
          </>
        )}

        {Boolean(booking?.scheduledAt) && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>
              {isAstrology ? 'Scheduled Session' : 'Scheduled Date & Time'}
            </Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
              {formatScheduledDateTime(booking.scheduledAt)}
            </Typography>
          </Box>
        )}

        {!isAstrology && booking?.plan && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Package Plan</Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
              {booking.plan.charAt(0).toUpperCase() + booking.plan.slice(1).toLowerCase()} Plan
            </Typography>
          </Box>
        )}

        {isAstrology && booking?.cancellationReason && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#dc2626', fontSize: '14px', fontWeight: 600 }}>Cancellation Reason</Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#dc2626', fontSize: '14px' }}>
              {booking.cancellationReason} {booking.cancelledBy ? `(By ${booking.cancelledBy})` : ''}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Booked On</Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
            {booking?.createdAt
              ? moment(booking.createdAt).isValid()
                ? moment(booking.createdAt).format("DD/MM/YYYY")
                : new Date(booking.createdAt).toLocaleDateString('en-IN')
              : 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

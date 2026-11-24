import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React, { useMemo } from 'react';
import moment from 'moment';
import { Box, Button, Chip, Grid, Paper, Typography } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { getBookingPaymentDetails, formatInr } from './bookingPaymentHelper';
import { formatScheduledDateTime } from '@/utils/helpers';

interface Props {
  booking: any;
  formattedDate: string;
  formattedAmount: string;
  statusLabel: string;
  statusStr: string;
  isPaymentPending: boolean;
  isActive: boolean;
  onCancelClick?: () => void;
  onRescheduleClick?: () => void;
  onRaiseTicketClick?: () => void;
  onCompletePaymentClick?: () => void;
  isRedirectingPayment?: boolean;
}

export default function BookingDetailHero({
  booking,
  formattedDate,
  formattedAmount,
  statusLabel,
  statusStr,
  isPaymentPending,
  isActive,
  onCancelClick,
  onRescheduleClick,
  onRaiseTicketClick,
  onCompletePaymentClick,
  isRedirectingPayment,
}: Props) {
  const isAstrology = booking?.bookingType === 'ASTROLOGY' || Boolean(booking?.astrologer);
  const payDetails = getBookingPaymentDetails(booking);
  const isCancelled = statusStr === 'CANCELLED';

  const serviceHeading = useMemo(() => {
    if (isAstrology) {
      return (
        booking?.service?.name ||
        booking?.serviceName ||
        booking?.service?.title ||
        (booking?.astrologer
          ? `Astrology Consultation with ${booking.astrologer.firstName || ''} ${booking.astrologer.lastName || ''}`.trim()
          : 'Astrology Consultation')
      );
    }
    return (
      booking?.service?.name ||
      booking?.serviceName ||
      booking?.service?.title ||
      booking?.serviceTitle ||
      booking?.poojaName ||
      booking?.pooja?.name ||
      booking?.title ||
      'Pooja Service'
    );
  }, [booking, isAstrology]);

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

  // If token is paid, customer pays remaining amount.
  // If token is not paid, customer directly pays full amount via API.
  let payButtonLabel = 'Pay Full Amount';
  if (isRedirectingPayment) {
    payButtonLabel = 'Redirecting to Payment...';
  } else if (payDetails.isTokenPaid) {
    payButtonLabel = `Pay Remaining Amount (₹${formatInr(payDetails.remainingAmount)})`;
  } else {
    payButtonLabel = `Pay Full Amount (₹${formatInr(payDetails.finalAmount)})`;
  }

  const showPayButton = payDetails.canMakePayment && !isCancelled;

  const displayDate = booking?.scheduledAt
    ? formatScheduledDateTime(booking.scheduledAt)
    : (formattedDate || "N/A");

  const ratePerMinute =
    booking?.astrologer?.astrologerProfile?.ratePerMinute ||
    booking?.astrologerProfile?.ratePerMinute ||
    null;

  const tokenAmt = Number(
    booking?.tokenAmount ??
    booking?.priceBreakDown?.tokenAmount ??
    booking?.paidAmount ??
    booking?.finalAmount ??
    50
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5, md: 4 },
        borderRadius: { xs: '18px', md: '24px' },
        border: '1.5px solid #EFE6D5',
        boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
        bgcolor: '#FFFFFF',
      }}
    >
      {/* 1. Card Top Header: Eyebrow + Status Badge */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 2, md: 2.5 },
          pb: { xs: 1.5, md: 0 },
          borderBottom: { xs: '1px solid #F5ECE3', md: 'none' },
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: '11.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#D94E00',
          }}
        >
          {isAstrology ? 'Astrology Consultation Details' : 'Booking Details'}
        </Typography>

        <Chip
          label={statusLabel}
          sx={{
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
            bgcolor: statusBg,
            color: statusColor,
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: '20px',
            height: '28px',
            fontSize: '12.5px',
            px: 0.5,
          }}
        />
      </Box>

      {/* 2. Main Content Grid */}
      <Grid container spacing={{ xs: 2.5, md: 4 }} sx={{ alignItems: 'flex-start' }}>
        {/* Left Column: Service Information */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: '#2C1810',
              fontSize: { xs: '20px', sm: '24px', md: '28px' },
              mb: 0.8,
              lineHeight: 1.25,
            }}
          >
            {serviceHeading}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.8, color: '#7C6A60' }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: '#D94E00' }} />
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: { xs: '13px', sm: '14px' } }}>
              Scheduled on <strong>{displayDate}</strong>
            </Typography>
          </Box>

          {/* Booking Mode & Plan Badges */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: isCancelled ? 2 : 2.5 }}>
            {booking?.bookingMode && (
              <Chip
                label={
                  booking.bookingMode === 'OFFLINE'
                    ? 'In-Person (Offline)'
                    : booking.bookingMode === 'ONLINE'
                    ? 'Virtual (Online Consultation)'
                    : booking.bookingMode
                }
                size="small"
                sx={{
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  bgcolor: '#F0F9FF',
                  color: '#0284C7',
                  border: '1px solid #BAE6FD',
                  borderRadius: '20px',
                  fontSize: '12px',
                  height: '28px',
                }}
              />
            )}
            {!isAstrology && booking?.plan && (
              <Chip
                label={`${booking.plan.charAt(0).toUpperCase() + booking.plan.slice(1).toLowerCase()} Plan`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  bgcolor: '#FFF7ED',
                  color: '#C2410C',
                  border: '1px solid #FED7AA',
                  borderRadius: '20px',
                  fontSize: '12px',
                  height: '28px',
                }}
              />
            )}
          </Box>

          {/* Cancellation Alert Banner */}
          {isCancelled && (
            <Box
              sx={{
                p: 2,
                bgcolor: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                mb: 2,
              }}
            >
              <CancelIcon sx={{ color: '#dc2626', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13.5px', color: '#991b1b', fontWeight: 700 }}>
                  Booking Cancelled
                </Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12.5px', color: '#b91c1c', mt: 0.3, lineHeight: 1.5 }}>
                  {booking?.cancellationReason
                    ? `Reason: ${booking.cancellationReason}${booking.cancelledBy ? ` (by ${booking.cancelledBy})` : ''}`
                    : 'This booking has been cancelled. No further payment is required.'}
                </Typography>
              </Box>
            </Box>
          )}

          {!isAstrology && (statusStr === 'PENDING' || statusStr === 'ACCEPTED') && (
            <Button
              onClick={onRescheduleClick}
              startIcon={<EditCalendarIcon sx={{ fontSize: 17 }} />}
              sx={{
                bgcolor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'none',
                px: 2,
                py: 0.7,
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#DBEAFE',
                },
              }}
            >
              Reschedule
            </Button>
          )}
        </Grid>

        {/* Right Column: Clean Payment Summary Box & Actions */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* Payment Summary Box */}
          <Box
            sx={{
              bgcolor: '#FAF7F4',
              border: '1.5px solid #EFE6D5',
              borderRadius: '16px',
              p: { xs: 2, sm: 2.5 },
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#7C6A60',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {isAstrology ? 'Consultation Fee' : 'Total Booking Amount'}
              </Typography>

              {isCancelled ? (
                <Chip
                  size="small"
                  label="No Due"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: '11px',
                    bgcolor: '#f3f4f6',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    height: '22px',
                  }}
                />
              ) : payDetails.isFullyPaid ? (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: '13px !important', color: '#16a34a' }} />}
                  size="small"
                  label="Fully Paid"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: '11px',
                    bgcolor: '#ecfdf5',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                    height: '22px',
                  }}
                />
              ) : payDetails.isTokenPaid ? (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: '13px !important', color: '#059669' }} />}
                  size="small"
                  label="Partially Paid"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: '11px',
                    bgcolor: '#f0fdf4',
                    color: '#047857',
                    border: '1px solid #bbf7d0',
                    height: '22px',
                  }}
                />
              ) : (
                <Chip
                  icon={<AccessTimeIcon sx={{ fontSize: '13px !important', color: '#dc2626' }} />}
                  size="small"
                  label="Pending"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: '11px',
                    bgcolor: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                    height: '22px',
                  }}
                />
              )}
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: isCancelled ? '#5C4A40' : '#2C1810',
                fontSize: { xs: '24px', sm: '28px', md: '30px' },
              }}
            >
              ₹{formatInr(payDetails.finalAmount)}
            </Typography>

            {/* Token payment breakdown if token was paid */}
            {payDetails.isTokenPaid && (
              <Box
                sx={{
                  pt: 1.2,
                  borderTop: '1px solid #EFE6D5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
                  <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12.5px', fontWeight: 600, color: '#047857' }}>
                    Token Paid: <strong>₹{formatInr(payDetails.paidAmount)}</strong>
                  </Typography>
                </Box>

                {!isCancelled && (
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12.5px', fontWeight: 700, color: '#c2410c' }}>
                    Remaining Due: ₹{formatInr(payDetails.remainingAmount)}
                  </Typography>
                )}
              </Box>
            )}

            {/* If Active & Unpaid */}
            {!payDetails.isTokenPaid && !payDetails.isFullyPaid && !isCancelled && (
              <Box
                sx={{
                  pt: 1.2,
                  borderTop: '1px solid #EFE6D5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.6,
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 14, color: '#ea580c' }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12px', fontWeight: 700, color: '#c2410c' }}>
                  Full Payment Due: ₹{formatInr(payDetails.finalAmount)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.2,
              flexWrap: 'wrap',
              mt: 2,
              justifyContent: { xs: 'stretch', md: 'flex-end' },
              '& > button': {
                flex: { xs: 1, sm: 'initial' },
              },
            }}
          >
            {showPayButton && (
              <Button
                onClick={onCompletePaymentClick}
                disabled={isRedirectingPayment}
                startIcon={<AccountBalanceWalletIcon sx={{ fontSize: 18 }} />}
                sx={{
                  bgcolor: '#059669',
                  color: '#ffffff',
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'none',
                  borderRadius: '12px',
                  px: 2.2,
                  py: 0.85,
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                  '&:hover': {
                    bgcolor: '#047857',
                  },
                }}
              >
                {payButtonLabel}
              </Button>
            )}

            <Button
              onClick={onRaiseTicketClick}
              startIcon={<SupportAgentIcon sx={{ fontSize: 18 }} />}
              sx={{
                bgcolor: '#FFF0E6',
                border: '1px solid #FFD4BC',
                color: COLORS.PRIMARY,
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'none',
                borderRadius: '12px',
                px: 2.2,
                py: 0.85,
                '&:hover': {
                  bgcolor: '#FFE4D4',
                  borderColor: COLORS.PRIMARY,
                },
              }}
            >
              Raise Ticket
            </Button>

            {isActive && !isCancelled && (
              <Button
                onClick={onCancelClick}
                startIcon={<CancelIcon sx={{ fontSize: 18 }} />}
                sx={{
                  bgcolor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'none',
                  borderRadius: '12px',
                  px: 2,
                  py: 0.85,
                  '&:hover': {
                    bgcolor: '#FEE2E2',
                    borderColor: '#DC2626',
                  },
                }}
              >
                Cancel Booking
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Astrology Consultation Fee Notice in English */}
      {isAstrology && (
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            bgcolor: booking.paymentStatus === 'PAID' ? '#f0fdf4' : '#fff7ed',
            borderRadius: '16px',
            border: `1.5px solid ${booking.paymentStatus === 'PAID' ? '#bbf7d0' : '#fed7aa'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <InfoOutlinedIcon
            sx={{
              color: booking.paymentStatus === 'PAID' ? '#16a34a' : '#ea580c',
              fontSize: 22,
              mt: 0.2,
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: '14px',
                fontWeight: 700,
                color: booking.paymentStatus === 'PAID' ? '#166534' : '#9a3412',
              }}
            >
              Consultation Fee: ₹{formatInr(payDetails.finalAmount)}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: '13px',
                color: booking.paymentStatus === 'PAID' ? '#15803d' : '#c2410c',
                mt: 0.5,
                lineHeight: 1.6,
              }}
            >
              {booking.paymentStatus === 'PAID'
                ? 'Your full consultation charge has been successfully paid. Your session is confirmed and you can connect with the astrologer at the scheduled time.'
                : 'This is the complete consultation fee for your astrology session. Please complete the payment to confirm your booking.'}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

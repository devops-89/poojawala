import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getBookingPaymentDetails, formatInr } from './bookingPaymentHelper';

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
  const payDetails = getBookingPaymentDetails(booking);

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

  const showPayButton = payDetails.canMakePayment;

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <Grid container spacing={3} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: COLORS.PRIMARY,
              mb: 1,
            }}
          >
            Booking Details
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a', mb: 1 }}>
            {booking?.service?.name ?? 'Service'}
          </Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px', mb: 1.5 }}>
            Scheduled on {formattedDate}
          </Typography>

          {/* Booking Mode & Plan Badges */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
            {booking?.bookingMode && (
              <Chip
                label={
                  booking.bookingMode === 'OFFLINE'
                    ? 'In-Person (Offline)'
                    : booking.bookingMode === 'ONLINE'
                    ? 'Virtual (Online)'
                    : booking.bookingMode
                }
                size="small"
                sx={{
                  fontWeight: 600,
                  fontFamily: FONTS.PRIMARY,
                  bgcolor: '#F0F9FF',
                  color: '#0284C7',
                  border: '1px solid #BAE6FD',
                  borderRadius: '8px',
                  fontSize: '12px',
                  height: '28px',
                }}
              />
            )}
            {booking?.plan && (
              <Chip
                label={`${booking.plan.charAt(0).toUpperCase() + booking.plan.slice(1).toLowerCase()} Plan`}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontFamily: FONTS.PRIMARY,
                  bgcolor: '#FFF7ED',
                  color: '#C2410C',
                  border: '1px solid #FED7AA',
                  borderRadius: '8px',
                  fontSize: '12px',
                  height: '28px',
                }}
              />
            )}
          </Box>

          {(statusStr === 'PENDING' || statusStr === 'ACCEPTED') && (
            <Box
              component="button"
              onClick={onRescheduleClick}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 16px',
                fontSize: '0.8125rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                borderRadius: '12px',
                fontFamily: FONTS.PRIMARY,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#2563eb' },
              }}
            >
              <EditCalendarIcon sx={{ fontSize: 18 }} />
              Reschedule
            </Box>
          )}
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: 1.5,
          }}
        >
          {/* Status chips row */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={statusLabel}
              sx={{
                fontWeight: 700,
                fontFamily: FONTS.PRIMARY,
                bgcolor:
                  statusStr === 'ONGOING' || statusStr === 'ENROUTE' || statusStr === 'ARRIVED'
                    ? '#E8F5E9'
                    : statusStr === 'COMPLETED'
                    ? '#E3F2FD'
                    : statusStr === 'CANCELLED'
                    ? '#FFEBEE'
                    : '#FFF5F0',
                color:
                  statusStr === 'ONGOING' || statusStr === 'ENROUTE' || statusStr === 'ARRIVED'
                    ? '#2E7D32'
                    : statusStr === 'COMPLETED'
                    ? '#1565C0'
                    : statusStr === 'CANCELLED'
                    ? '#C62828'
                    : COLORS.PRIMARY,
              }}
            />

            {/* Payment badge chip */}
            {payDetails.isFullyPaid ? (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: '15px !important', color: '#16a34a' }} />}
                label="Fully Paid"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontFamily: FONTS.PRIMARY,
                  bgcolor: '#ecfdf5',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  height: '32px',
                }}
              />
            ) : payDetails.isTokenPaid ? (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: '15px !important', color: '#059669' }} />}
                label={`Token Paid: ₹${formatInr(payDetails.paidAmount)}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontFamily: FONTS.PRIMARY,
                  bgcolor: '#f0fdf4',
                  color: '#047857',
                  border: '1px solid #bbf7d0',
                  height: '32px',
                }}
              />
            ) : statusStr !== 'CANCELLED' ? (
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: '15px !important', color: '#dc2626' }} />}
                label="Payment Pending"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontFamily: FONTS.PRIMARY,
                  bgcolor: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  height: '32px',
                }}
              />
            ) : null}
          </Box>

          {/* Amount & breakdown */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: 0.5,
            }}
          >
            <Typography variant="h4" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a' }}>
              ₹{formatInr(payDetails.finalAmount)}
            </Typography>

            {payDetails.isTokenPaid && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  bgcolor: '#f8fafc',
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  mt: 0.25,
                }}
              >
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
                  <Typography
                    sx={{ fontFamily: FONTS.PRIMARY, fontSize: '12px', fontWeight: 600, color: '#047857' }}
                  >
                    Token Paid: ₹{formatInr(payDetails.paidAmount)}
                  </Typography>
                </Box>
                <Typography sx={{ color: '#cbd5e1', fontSize: '12px' }}>|</Typography>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    sx={{ fontFamily: FONTS.PRIMARY, fontSize: '12px', fontWeight: 700, color: '#ea580c' }}
                  >
                    Remaining Due: ₹{formatInr(payDetails.remainingAmount)}
                  </Typography>
                </Box>
              </Box>
            )}



            {!payDetails.isTokenPaid && !payDetails.isFullyPaid && statusStr !== 'CANCELLED' && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: '#fff7ed',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '8px',
                  border: '1px solid #ffedd5',
                  mt: 0.25,
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 14, color: '#ea580c' }} />
                <Typography
                  sx={{ fontFamily: FONTS.PRIMARY, fontSize: '12px', fontWeight: 600, color: '#c2410c' }}
                >
                  Full Payment Due: ₹{formatInr(payDetails.finalAmount)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              flexWrap: 'wrap',
              mt: 1,
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            {showPayButton && (
              <Box
                component="button"
                onClick={onCompletePaymentClick}
                disabled={isRedirectingPayment}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '7px 18px',
                  fontSize: '0.8125rem',
                  border: 'none',
                  cursor: isRedirectingPayment ? 'not-allowed' : 'pointer',
                  transition: 'all 200ms ease',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontFamily: FONTS.PRIMARY,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  opacity: isRedirectingPayment ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: isRedirectingPayment ? '#10b981' : '#059669',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                  },
                }}
              >
                <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />
                {payButtonLabel}
              </Box>
            )}

            <Box
              component="button"
              onClick={onRaiseTicketClick}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 16px',
                fontSize: '0.8125rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                borderRadius: '12px',
                fontFamily: FONTS.PRIMARY,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#d97706' },
              }}
            >
              <SupportAgentIcon sx={{ fontSize: 18 }} />
              Raise Ticket
            </Box>

            {isActive && (
              <Box
                component="button"
                onClick={onCancelClick}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  fontSize: '0.8125rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontFamily: FONTS.PRIMARY,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#dc2626' },
                }}
              >
                <CancelIcon sx={{ fontSize: 18 }} />
                Cancel Booking
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

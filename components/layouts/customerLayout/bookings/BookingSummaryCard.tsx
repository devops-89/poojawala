import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { getBookingPaymentDetails, formatInr } from './bookingPaymentHelper';

interface Props {
  booking: any;
  statusLabel: string;
}

export default function BookingSummaryCard({ booking, statusLabel }: Props) {
  const payDetails = getBookingPaymentDetails(booking);

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

  const recentPayment =
    payDetails.tokenPayment ||
    payDetails.settlementPayment ||
    payDetails.fullPayment ||
    (payDetails.payments.length > 0 ? payDetails.payments[0] : null);

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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Booked On</Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {booking?.createdAtIst
              ? booking.createdAtIst.split(',')[0]
              : booking?.createdAt
              ? new Date(booking.createdAt).toLocaleDateString('en-IN')
              : 'N/A'}
          </Typography>
        </Box>

        {/* Payment Breakdown Card */}
        <Box sx={{ mt: 1, pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <ReceiptLongIcon sx={{ fontSize: 18, color: '#64748b' }} />
            <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#334155', fontSize: '14px' }}>
              Payment Details
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: '#f8fafc',
              p: 2,
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '13px' }}>
                Payment Status
              </Typography>
              {payDetails.isFullyPaid ? (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#16a34a' }} />}
                  label="Fully Paid"
                  size="small"
                  sx={{ bgcolor: '#ecfdf5', color: '#166534', fontWeight: 700, fontSize: '11px', height: '24px' }}
                />
              ) : payDetails.isTokenPaid ? (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#10b981' }} />}
                  label="Partially Paid (Token Cleared)"
                  size="small"
                  sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 700, fontSize: '11px', height: '24px' }}
                />
              ) : (
                <Chip
                  icon={<AccessTimeIcon sx={{ fontSize: '14px !important', color: '#f59e0b' }} />}
                  label="Payment Pending"
                  size="small"
                  sx={{ bgcolor: '#fffbeb', color: '#b45309', fontWeight: 700, fontSize: '11px', height: '24px' }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '13px' }}>
                Total Amount
              </Typography>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                ₹{formatInr(payDetails.finalAmount)}
              </Typography>
            </Box>

            {payDetails.isTokenPaid && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '13px' }}>
                    Token Amount {payDetails.tokenPercentage ? `(${payDetails.tokenPercentage}%)` : ''}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 600,
                      color: payDetails.isTokenPaid ? '#166534' : '#0f172a',
                      fontSize: '13px',
                    }}
                  >
                    ₹{formatInr(payDetails.paidAmount || payDetails.tokenAmount)}{' '}
                    {payDetails.isTokenPaid ? '(Paid ✓)' : '(Pending)'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '13px' }}>
                    Remaining Balance
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      color: payDetails.isFullyPaid ? '#16a34a' : '#ea580c',
                      fontSize: '13px',
                    }}
                  >
                    ₹{formatInr(payDetails.remainingAmount)}{' '}
                    {payDetails.isFullyPaid ? '(Cleared ✓)' : '(Due)'}
                  </Typography>
                </Box>
              </>
            )}

            {recentPayment && (
              <Box
                sx={{
                  pt: 1,
                  mt: 0.5,
                  borderTop: '1px dashed #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.75,
                }}
              >
                {recentPayment.paymentMethod && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#94a3b8', fontSize: '12px' }}>
                      Payment Method
                    </Typography>
                    <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#475569', fontSize: '12px' }}>
                      {recentPayment.paymentMethod}
                    </Typography>
                  </Box>
                )}
                {recentPayment.razorpayPaymentId && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#94a3b8', fontSize: '12px' }}>
                      Transaction ID
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 500,
                        color: '#475569',
                        fontSize: '12px',
                        wordBreak: 'break-all',
                      }}
                    >
                      {recentPayment.razorpayPaymentId}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

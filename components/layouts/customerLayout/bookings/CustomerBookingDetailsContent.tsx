'use client';
import { cancelBookingAPI, getBookingDetailsAPI, rescheduleBookingAPI } from '@/api/bookingControllers';
import { getPaymentLinkAPI } from '@/api/paymentControllers';
import RaiseTicketModal from '@/components/widgets/RaiseTicketModal';
import { useSnackbarStore } from '@/stores/snackbarStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Breadcrumbs, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import BookingDetailHero from './BookingDetailHero';
import BookingReviewCard from './BookingReviewCard';
import BookingSummaryCard from './BookingSummaryCard';
import PurohitReviewCard from './PurohitReviewCard';
import ServiceDetailsCard from './ServiceDetailsCard';

export default function CustomerBookingDetailsContent({ bookingId }: { bookingId: string | number }) {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    if (!bookingId) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getBookingDetailsAPI(bookingId);
        if (res.success && res.data) {
          setBooking(res.data);
        } else {
          showSnackbar('Failed to fetch booking details', 'error');
        }
      } catch (error) {
        console.error(error);
        showSnackbar('Error fetching booking details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [bookingId]);

  const fetchDetails = async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      const res = await getBookingDetailsAPI(bookingId);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        showSnackbar('Failed to fetch booking details', 'error');
      }
    } catch (error) {
      console.error(error);
      showSnackbar('Error fetching booking details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const [isRedirectingPayment, setIsRedirectingPayment] = useState(false);

  const handleCompletePayment = async () => {
    setIsRedirectingPayment(true);
    try {
      const callbackUrl = window.location.origin + window.location.pathname;
      const res = await getPaymentLinkAPI(bookingId, callbackUrl);
      if (res.success && res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        showSnackbar(res.message || 'Failed to generate payment link', 'error');
        setIsRedirectingPayment(false);
      }
    } catch (error: any) {
      console.error(error);
      showSnackbar(error.response?.data?.message || error.message || 'Error generating payment link', 'error');
      setIsRedirectingPayment(false);
    }
  };

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const res = await cancelBookingAPI(bookingId);
      if (res.success) {
        showSnackbar('Booking cancelled successfully', 'success');
        setCancelModalOpen(false);
        fetchDetails(); // Refresh details
      } else {
        showSnackbar(res.message || 'Failed to cancel booking', 'error');
      }
    } catch (error: any) {
      console.error(error);
      showSnackbar(error.response?.data?.message || 'Error cancelling booking', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleRescheduleBooking = async () => {
    if (!newScheduleTime || !rescheduleReason) {
      showSnackbar('Please provide both new date/time and a reason', 'error');
      return;
    }
    const customerAddressId = booking?.customerAddressId || booking?.customerAddress?.id;
    if (!customerAddressId) {
      showSnackbar('Cannot find customer address ID for this booking', 'error');
      return;
    }

    setIsRescheduling(true);
    try {
      const scheduledAtIso = new Date(newScheduleTime).toISOString();
      const res = await rescheduleBookingAPI(bookingId, scheduledAtIso, customerAddressId, rescheduleReason);
      if (res.success) {
        showSnackbar('Booking rescheduled successfully', 'success');
        setRescheduleModalOpen(false);
        setNewScheduleTime('');
        setRescheduleReason('');
        fetchDetails(); // Refresh details
      } else {
        showSnackbar(res.message || 'Failed to reschedule booking', 'error');
      }
    } catch (error: any) {
      console.error(error);
      showSnackbar(error.response?.data?.message || 'Error rescheduling booking', 'error');
    } finally {
      setIsRescheduling(false);
    }
  };

  const [isRaiseTicketModalOpen, setIsRaiseTicketModalOpen] = useState(false);

  const formattedDate = useMemo(() => {
    if (booking?.scheduledAtIst) return booking.scheduledAtIst;
    if (!booking?.scheduledAt) return 'N/A';
    const date = new Date(booking.scheduledAt);
    if (isNaN(date.getTime())) return 'N/A';
    
    const timeStr = booking.scheduledTime ? ` at ${booking.scheduledTime}` : '';
    return date.toLocaleDateString('en-IN', {
      dateStyle: 'medium',
    }) + timeStr;
  }, [booking]);

  const formattedAmount = useMemo(() => {
    const amt = booking?.finalAmount ?? booking?.finalamount ?? booking?.agreedPrice;
    if (!amt || Number(amt) <= 0) return '-';
    return `₹${amt}`;
  }, [booking]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b' }}>
          Booking not found.
        </Typography>
        <Button variant="outlined" onClick={() => router.push('/customer/dashboard')} sx={{ color: '#FF6200', borderColor: '#FF6200', textTransform: 'none' }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const statusStr = booking.status?.toUpperCase() || 'PENDING';
  const statusLabel = booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase() : 'Pending';

  const isActive = statusStr === 'PENDING' || statusStr === 'ACCEPTED';
  const isPaymentPending = statusStr !== 'CANCELLED' && booking.paymentStatus !== 'SUCCESS' && booking.paymentStatus !== 'PAID';

  return (
    <Box sx={{ maxWidth: '1100px', mx: 'auto', pb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.push('/customer/bookings')} 
            sx={{ bgcolor: '#f1f5f9', color: '#334155', '&:hover': { bgcolor: '#e2e8f0' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Booking Details
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b' }}>
              Review the full details for your selected booking.
            </Typography>
          </Box>
        </Box>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2, ml: 7, fontFamily: '"DM Sans", sans-serif', fontSize: '14px' }}>
          <Link href="/customer/dashboard" style={{ textDecoration: 'none', color: '#64748b' }}>
            Bookings
          </Link>
          <Typography color="text.primary" sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 600 }}>
            Booking Details
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <BookingDetailHero 
          booking={booking}
          formattedDate={formattedDate}
          formattedAmount={formattedAmount}
          statusLabel={statusLabel}
          statusStr={statusStr}
          isPaymentPending={isPaymentPending}
          isActive={isActive}
          onCancelClick={() => setCancelModalOpen(true)}
          onRescheduleClick={() => setRescheduleModalOpen(true)}
          onRaiseTicketClick={() => setIsRaiseTicketModalOpen(true)}
          onCompletePaymentClick={handleCompletePayment}
          isRedirectingPayment={isRedirectingPayment}
        />

        <Grid container spacing={4}>
          <Grid size={{xs:12,lg:6}}>
            <BookingSummaryCard booking={booking} statusLabel={statusLabel} />
          </Grid>

          <Grid size={{xs:12,lg:6}}>
            <ServiceDetailsCard booking={booking} />
          </Grid>
          
          <Grid size={{xs:12,lg:6}}>
            <BookingReviewCard booking={booking} onReviewAdded={fetchDetails} />
          </Grid>
          { (booking.purohitReview || (booking.purohitRating && booking.purohitRating !== "0.0")) && (
            <Grid size={{xs:12,lg:6}}>
              <PurohitReviewCard booking={booking} />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Cancel Confirmation Modal */}
      <Dialog open={cancelModalOpen} onClose={() => setCancelModalOpen(false)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1, minWidth: { xs: '300px', sm: '400px' } } }}>
        <DialogTitle sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Cancel Booking
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#1e293b' }}>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCancelModalOpen(false)} disabled={isCancelling} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', borderRadius: '30px', px: 3, py: 1 }}>
            No, keep it
          </Button>
          <Button onClick={handleCancelBooking} disabled={isCancelling} variant="contained" sx={{ textTransform: 'none', borderRadius: '30px', px: 4, py: 1, fontWeight: 600, fontFamily: '"DM Sans", sans-serif', boxShadow: 'none', background: '#ef4444', color: 'white', '&:hover': { background: '#dc2626', boxShadow: 'none' } }}>
            {isCancelling ? 'Cancelling...' : 'Yes, cancel'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Confirmation Modal */}
      <Dialog open={rescheduleModalOpen} onClose={() => setRescheduleModalOpen(false)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1, minWidth: { xs: '300px', sm: '500px' } } }}>
        <DialogTitle sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Reschedule Booking
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px' }}>
              Please select a new date and time and provide a reason for the reschedule.
            </Typography>
            
            <TextField
              fullWidth
              type="datetime-local"
              label="New Schedule Date & Time"
              variant="outlined"
              value={newScheduleTime}
              onChange={(e) => setNewScheduleTime(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' },
                '& .Mui-focused fieldset': { borderColor: '#3b82f6 !important' },
                '& label.Mui-focused': { color: '#3b82f6' }
              }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason for rescheduling"
              variant="outlined"
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { fontFamily: '"DM Sans", sans-serif' },
                '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif' },
                '& .Mui-focused fieldset': { borderColor: '#3b82f6 !important' },
                '& label.Mui-focused': { color: '#3b82f6' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setRescheduleModalOpen(false)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
            Cancel
          </Button>
          <Box 
            component="button"
            onClick={handleRescheduleBooking} 
            disabled={isRescheduling || !newScheduleTime || !rescheduleReason} 
            sx={{ 
              bgcolor: '#FF6200 !important', 
              color: 'white !important', 
              fontFamily: '"DM Sans", sans-serif', 
              fontWeight: 600, 
              border: 'none',
              cursor: (isRescheduling || !newScheduleTime || !rescheduleReason) ? 'not-allowed' : 'pointer',
              px: 2.5,
              py: 1,
              borderRadius: '8px',
              transition: 'all 0.2s',
              opacity: (isRescheduling || !newScheduleTime || !rescheduleReason) ? 0.6 : 1,
              '&:hover': { bgcolor: (isRescheduling || !newScheduleTime || !rescheduleReason) ? '#FF6200 !important' : '#ea580c !important' } 
            }}
          >
            {isRescheduling ? 'Rescheduling...' : 'Submit Reschedule'}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Raise Ticket Modal */}
      <RaiseTicketModal 
        open={isRaiseTicketModalOpen} 
        onClose={() => setIsRaiseTicketModalOpen(false)} 
        bookingId={bookingId} 
      />
    </Box>
  );
}

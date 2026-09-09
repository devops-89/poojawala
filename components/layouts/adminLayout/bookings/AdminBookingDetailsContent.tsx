
'use client';

import { Box, Button, Card, Chip, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import HandymanIcon from '@mui/icons-material/Handyman';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';

import { getBookingDetailsAPI, initiateManualPayoutAPI } from '@/api/bookingControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

export default function AdminBookingDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showSnackbar } = useSnackbarStore();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await getBookingDetailsAPI(id);
        if (res.success && res.data) {
          setBooking(res.data);
        } else {
          showSnackbar(res.message || 'Failed to fetch booking details', 'error');
        }
      } catch (err: any) {
        showSnackbar(err.response?.data?.message || 'Error fetching details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id, showSnackbar]);

  const handleInitiatePayout = async () => {
      try {
        setIsPaying(true);
        const res = await initiateManualPayoutAPI({ bookingId: booking.id });
        if (res.success) {
          showSnackbar(res.message || 'Payout initiated successfully', 'success');
          // Update the booking state to reflect the payout is paid locally
          setBooking({ ...booking, purohitPayoutStatus: 'PAID' });
        } else {
          showSnackbar(res.message || 'Failed to initiate payout', 'error');
        }
      } catch (err: any) {
        showSnackbar(err.response?.data?.message || 'Error initiating payout', 'error');
      } finally {
        setIsPaying(false);
      }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color='error' variant='h6'>Booking not found or could not be loaded.</Typography>
      </Box>
    );
  }

  const customerName = booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName || ''}`.trim() : 'N/A';
  const technicianName = booking.purohit ? (booking.purohit.user ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ''}`.trim() : `${booking.purohit.firstName} ${booking.purohit.lastName || ''}`.trim()) : 'Not Assigned';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#d1fae5', text: '#059669' };
      case 'PENDING': return { bg: '#fef3c7', text: '#d97706' };
      case 'CANCELLED': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#dbeafe', text: '#2563eb' };
    }
  };

  const statusStyle = getStatusColor(booking.status);
  const primaryAccount = booking.purohit?.bankAccounts?.find((acc: any) => acc.isPrimary) || booking.purohit?.bankAccounts?.[0];
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 6, maxWidth: '1200px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box 
          onClick={() => router.back()}
          sx={{ p: 1, borderRadius: '50%', '&:hover': { bgcolor: '#f1f5f9' }, cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex' }}
        >
          <ArrowBackIcon sx={{ color: '#475569', fontSize: 24 }} />
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h4' sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '-0.02em' }}>
              Booking Details
            </Typography>
            <Chip 
              label={`Status: ${booking.status || 'N/A'}`} 
              size='small' 
              icon={<CheckCircleIcon sx={{ fontSize: 16, color: statusStyle.text }} />}
              sx={{ fontWeight: 700, backgroundColor: statusStyle.bg, color: statusStyle.text, px: 0.5, fontFamily: 'var(--font-outfit), sans-serif' }} 
            />
          </Box>
          <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ fontSize: 16 }} /> 
            Scheduled for {new Date(booking.scheduledAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0} 
            sx={{ 
              p: 3.5, 
              borderRadius: 4, 
              height: '100%',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '1px dashed #e2e8f0' }}>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#f0fdf4', display: 'flex' }}>
                <PersonIcon sx={{ fontSize: 24, color: '#059669' }} />
              </Box>
              <Typography variant='h6' sx={{ fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-outfit), sans-serif' }}>Customer Profile</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline' }}>
                <Typography sx={{ fontWeight: 500, color: '#64748b', minWidth: '80px', fontSize: '0.95rem' }}>Name:</Typography>
                <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem' }}>{customerName}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline' }}>
                <Typography sx={{ fontWeight: 500, color: '#64748b', minWidth: '80px', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}>
                  <PhoneIcon sx={{ fontSize: 16 }} /> Phone:
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#334155' }}>{booking.customer?.phone || 'N/A'}</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline' }}>
                <Typography sx={{ fontWeight: 500, color: '#64748b', minWidth: '80px', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}>
                  <EmailIcon sx={{ fontSize: 16 }} /> Email:
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#334155' }}>{booking.customer?.email || 'N/A'}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
                <Typography sx={{ fontWeight: 500, color: '#64748b', minWidth: '80px', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2, fontSize: '0.95rem' }}>
                  <LocationOnIcon sx={{ fontSize: 16 }} /> Address:
                </Typography>
                <Typography sx={{ fontWeight: 500, color: '#334155', flex: 1, lineHeight: 1.5 }}>
                  {booking.customerAddress?.fullAddress || booking.addressSnapshot?.city || 'Address unavailable'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Technician Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0} 
            sx={{ 
              p: 3.5, 
              borderRadius: 4, 
              height: '100%',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '1px dashed #e2e8f0' }}>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#eff6ff', display: 'flex' }}>
                <HandymanIcon sx={{ fontSize: 24, color: '#2563eb' }} />
              </Box>
              <Typography variant='h6' sx={{ fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-outfit), sans-serif' }}>Purohit Assigned</Typography>
            </Box>
            
            {booking.purohit ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline' }}>
                  <Typography sx={{ fontWeight: 500, color: '#64748b', minWidth: '80px', fontSize: '0.95rem' }}>Name:</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem' }}>{technicianName}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline' }}>
                  <Typography sx={{ fontWeight: 500, color: '#64748b', minWidth: '80px', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}>
                    <PhoneIcon sx={{ fontSize: 16 }} /> Phone:
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#334155' }}>{booking.purohit.user?.phone || booking.purohit.phone || 'N/A'}</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline' }}>
                  <Typography sx={{ fontWeight: 500, color: '#64748b', minWidth: '80px', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}>
                    <EmailIcon sx={{ fontSize: 16 }} /> Email:
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#334155' }}>{booking.purohit.user?.email || booking.purohit.email || 'N/A'}</Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', backgroundColor: '#f8fafc', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
                <Typography sx={{ color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}>Purohit not yet assigned</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Service Details */}
        <Grid size={{ xs: 12 }}>
          <Card 
            elevation={0} 
            sx={{ 
              p: 3.5, 
              borderRadius: 4, 
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#f3e8ff', display: 'flex' }}>
                <DashboardIcon sx={{ fontSize: 24, color: '#9333ea' }} />
              </Box>
              <Typography variant='h6' sx={{ fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-outfit), sans-serif' }}>Service Information</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem', mb: 0.5 }}>Service Requested</Typography>
                <Typography variant='h6' sx={{ fontWeight: 700, color: '#0f172a' }}>{booking.service?.name}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem', mb: 0.5 }}>Price Range</Typography>
                <Typography sx={{ color: '#475569', fontWeight: 600 }}>₹{booking.service?.minPrice || '0.00'} - ₹{booking.service?.maxPrice || '0.00'}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Payment & Payout Info */}
        <Grid size={{ xs: 12 }}>
          <Card 
            elevation={0} 
            sx={{ 
              p: 3.5, 
              borderRadius: 4, 
              border: '1px solid #e2e8f0', 
              background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, pb: 2, borderBottom: '2px solid #e2e8f0' }}>
              <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#FF6200', color: 'white', boxShadow: '0 4px 10px rgba(255,98,0,0.2)', display: 'flex' }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant='h5' sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-outfit), sans-serif' }}>Payment & Payout Matrix</Typography>
            </Box>
            
            <Grid container spacing={3}>
              {/* Customer Payment */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <Typography sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>Customer Payment</Typography>
                  <Box sx={{ my: 2 }}>
                    <Chip 
                      label={booking.paymentStatus || 'PENDING'} 
                      size='medium' 
                      sx={{ fontWeight: 700, px: 1, backgroundColor: booking.paymentStatus === 'PAID' ? '#d1fae5' : '#fef3c7', color: booking.paymentStatus === 'PAID' ? '#065f46' : '#d97706', fontFamily: 'var(--font-outfit), sans-serif' }} 
                    />
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.875rem', mb: 0.5 }}>Final Amount</Typography>
                  <Typography variant='h4' sx={{ fontWeight: 800, color: '#0f172a' }}>₹{booking.finalAmount || '0.00'}</Typography>
                  
                  <Box sx={{ mt: 'auto', pt: 3 }}>
                    {booking.donationAmount && parseFloat(booking.donationAmount) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Donation</Typography>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>₹{booking.donationAmount}</Typography>
                      </Box>
                    )}
                    {booking.discountAmount && parseFloat(booking.discountAmount) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Discount</Typography>
                        <Typography sx={{ fontWeight: 700, color: '#10b981' }}>-₹{booking.discountAmount}</Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Platform Revenue */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <Typography sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>Platform Revenue</Typography>
                  <Box sx={{ my: 2 }}>
                    <Chip 
                      label={`Comm: ${booking.commissionPercentage || '0'}%`} 
                      size='medium' 
                      sx={{ fontWeight: 700, px: 1, backgroundColor: '#f1f5f9', color: '#334155', fontFamily: 'var(--font-outfit), sans-serif' }} 
                    />
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.875rem', mb: 0.5 }}>Platform Commission</Typography>
                  <Typography variant='h4' sx={{ fontWeight: 800, color: '#FF6200' }}>₹{booking.platformCommission || '0.00'}</Typography>
                  
                  <Box sx={{ mt: 'auto', pt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, backgroundColor: '#fff7ed', borderRadius: 2 }}>
                      <Typography sx={{ fontWeight: 800, color: '#c2410c', fontSize: '0.875rem' }}>Platform Earning</Typography>
                      <Typography variant='h6' sx={{ fontWeight: 800, color: '#ea580c' }}>₹{booking.platformCommission || '0.00'}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Purohit Payout */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '2px solid', borderColor: booking.purohitPayoutStatus === 'PAID' ? '#10b981' : '#e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <Typography sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>Purohit Payout</Typography>
                  <Box sx={{ my: 2 }}>
                    <Chip 
                      label={booking.purohitPayoutStatus || 'PENDING'} 
                      size='medium' 
                      sx={{ fontWeight: 700, px: 1, backgroundColor: booking.purohitPayoutStatus === 'PAID' ? '#d1fae5' : '#fef3c7', color: booking.purohitPayoutStatus === 'PAID' ? '#065f46' : '#d97706', fontFamily: 'var(--font-outfit), sans-serif' }} 
                    />
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.875rem', mb: 0.5 }}>Payable Amount</Typography>
                  <Typography variant='h4' sx={{ fontWeight: 800, color: '#0f172a' }}>₹{booking.purohitPayoutAmount || '0.00'}</Typography>
                  
                  {primaryAccount && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Typography sx={{ fontWeight: 700, color: '#475569', mb: 1, fontSize: '0.875rem' }}>Payout Account</Typography>
                      {primaryAccount.paymentMethod === 'UPI' ? (
                        <Box>
                          <Typography sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>UPI ID</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{primaryAccount.upiId || 'N/A'}</Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Bank Account</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{primaryAccount.bankName} - {primaryAccount.accountNumber}</Typography>
                          <Typography sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', mt: 0.5 }}>IFSC: {primaryAccount.ifscCode}</Typography>
                          <Typography sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Holder: {primaryAccount.accountHolderName}</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 'auto', pt: 3 }}>
                    <Button 
                      variant='contained' 
                      fullWidth
                      size='large'
                      sx={{ 
                        background: '#10b981 !important', 
                        color: 'white !important',
                        '&:hover': { background: '#059669 !important' },
                        '&.Mui-disabled': {
                          background: '#6ee7b7 !important', // light green when disabled
                          color: '#064e3b !important'
                        },
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        py: 1.2,
                        borderRadius: 2,
                        boxShadow: booking.purohitPayoutStatus !== 'PAID' ? '0 8px 20px -6px rgba(16,185,129,0.4)' : 'none',
                        fontFamily: 'var(--font-outfit), sans-serif'
                      }}
                      disabled={isPaying || booking.purohitPayoutStatus === 'PAID' || booking.paymentStatus !== 'PAID'}
                      onClick={handleInitiatePayout}
                    >
                      {isPaying ? <CircularProgress size={24} color='inherit' /> : (booking.purohitPayoutStatus === 'PAID' ? 'Payout Completed' : 'Initiate Payout')}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

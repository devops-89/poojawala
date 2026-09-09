'use client';
import { respondBookingAPI, getActiveBookingAPI, getAvailableBookingsAPI, sendBookingStartOtpAPI, resendBookingStartOtpAPI, updateBookingStatusAPI, verifyBookingOtpAPI, uploadCompletionProofAPI, addReviewAPI, cancelBookingAPI, addComplaintAPI } from '@/api/bookingControllers';
import { getPaymentLinkAPI } from '@/api/paymentControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useSocketStore } from '@/stores/socketStore';
import { useLoaderStore } from '@/stores/loaderStore';
import { BOOKING_STATUS, PAYMENT_STATUS, BOOKING_PAYMENT_STATUS } from '@/utils/enums';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BoltIcon from '@mui/icons-material/Bolt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import TimerIcon from '@mui/icons-material/Timer';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Breadcrumbs, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, Paper, Step, StepLabel, Stepper, Tab, Tabs, TextField, Typography, Rating, Pagination, FormControl, InputLabel, Select } from '@mui/material';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`bookings-tabpanel-${index}`} style={{ width: '100%' }} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BookingsContent() {
  const { showSnackbar } = useSnackbarStore();
  const { showLoader, hideLoader } = useLoaderStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);
  const [tabValue, setTabValue] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('Accepted');
  const [newRequests, setNewRequests] = useState<any[]>([]);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [activeTotalPages, setActiveTotalPages] = useState(1);
  const statuses = ['Accepted', 'Enroute', 'Arrived', 'Ongoing', 'Completed'];

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpJobId, setOtpJobId] = useState<number | null>(null);
  const [otpValue, setOtpValue] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [updatingJobId, setUpdatingJobId] = useState<number | null>(null);

  // Review states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewJobId, setReviewJobId] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Complaint states
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [complaintJobId, setComplaintJobId] = useState<number | null>(null);
  const [complaintCategory, setComplaintCategory] = useState('');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [complaintFiles, setComplaintFiles] = useState<File[]>([]);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const complaintFileInputRef = React.useRef<HTMLInputElement>(null);

  // Cancel states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const handleOpenReviewModal = (jobId: number) => {
    setReviewJobId(jobId);
    setRating(0);
    setReviewText('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewJobId || !rating) {
      showSnackbar('Please provide a rating', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      await addReviewAPI(reviewJobId, rating, reviewText);
      showSnackbar('Review submitted successfully', 'success');
      setReviewModalOpen(false);
      setReviewJobId(null);
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleOpenComplaintModal = (id: number) => {
    setComplaintJobId(id);
    setComplaintModalOpen(true);
  };

  const handleComplaintFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setComplaintFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    // reset input so same file can be selected again if needed
    if (complaintFileInputRef.current) complaintFileInputRef.current.value = '';
  };

  const handleRemoveComplaintFile = (indexToRemove: number) => {
    setComplaintFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitComplaint = async () => {
    if (!complaintJobId || !complaintCategory || !complaintSubject || !complaintDescription) return;
    setIsSubmittingComplaint(true);
    try {
      const formData = new FormData();
      formData.append('bookingId', complaintJobId.toString());
      formData.append('category', complaintCategory);
      formData.append('subject', complaintSubject);
      formData.append('description', complaintDescription);
      complaintFiles.forEach(file => {
        formData.append('evidence', file);
      });
      
      await addComplaintAPI(formData);
      showSnackbar('Complaint created successfully', 'success');
      setComplaintModalOpen(false);
      setComplaintCategory('');
      setComplaintSubject('');
      setComplaintDescription('');
      setComplaintFiles([]);
      setComplaintJobId(null);
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to submit complaint', 'error');
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const [proofJobId, setProofJobId] = useState<number | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleProofButtonClick = (jobId: number) => {
    setProofJobId(jobId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadProof = async () => {
    if (!proofJobId || !proofFile) return;
    setIsUploadingProof(true);
    try {
      const formData = new FormData();
      formData.append('files', proofFile); 
      await uploadCompletionProofAPI(proofJobId, formData);
      showSnackbar('Completion proof uploaded successfully', 'success');
      setProofFile(null);
      setProofPreview(null);
      setProofJobId(null);
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to upload proof', 'error');
    } finally {
      setIsUploadingProof(false);
    }
  };

  const getValidTransitions = (currentStatus: string) => {
    switch (currentStatus.toUpperCase()) {
      case 'ACCEPTED': return ['Enroute', 'Cancelled'];
      case 'ENROUTE': return ['Arrived', 'Cancelled'];
      case 'ONGOING': return ['Completed'];
      default: return [];
    }
  };

  const handleUpdateStatusClick = (event: React.MouseEvent<HTMLElement>, jobId: number) => {
    setStatusMenuAnchorEl(event.currentTarget);
    setUpdatingJobId(jobId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchorEl(null);
    setUpdatingJobId(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!updatingJobId) return;

    if (newStatus.toUpperCase() === 'CANCELLED') {
      setCancelModalOpen(true);
      setStatusMenuAnchorEl(null);
      return;
    }

    try {
      showLoader(`Updating status to ${newStatus}...`);
      await updateBookingStatusAPI(updatingJobId, newStatus.toUpperCase());
      setActiveBookings((prev) => prev.map(job => (job.originalData?.id || job.id) === updatingJobId ? { ...job, status: newStatus.toUpperCase() } : job));
      setActiveStatus(newStatus);
      showSnackbar(`Booking status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error("Error updating status:", error);
      showSnackbar("Failed to update status", "error");
    } finally {
      hideLoader();
    }
    handleStatusMenuClose();
  };

  const handleConfirmCancel = async () => {
    if (!updatingJobId) return;
    if (!cancelReason.trim()) {
      showSnackbar('Please provide a reason for cancellation', 'error');
      return;
    }
    setIsCancelling(true);
    try {
      await cancelBookingAPI(updatingJobId, cancelReason);
      setActiveBookings((prev) => prev.map(job => (job.originalData?.id || job.id) === updatingJobId ? { ...job, status: 'CANCELLED' } : job));
      setActiveStatus('Cancelled');
      showSnackbar('Booking cancelled successfully', 'success');
      setCancelModalOpen(false);
      setCancelReason('');
      setUpdatingJobId(null);
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to cancel booking', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    let newOtp = otpValue.split('');
    while(newOtp.length < 6) newOtp.push('');
    newOtp[index] = val.slice(-1);
    setOtpValue(newOtp.join(''));
    if (val && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && (!otpValue[index] || otpValue[index] === '') && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  useEffect(() => {
    const savedTab = localStorage.getItem('bookingsTab');
    if (savedTab) {
      setTabValue(Number(savedTab));
    }
    setIsClient(true);
  }, []);

  const handleRespondBooking = async (bookingId: number | string, action: 'ACCEPT' | 'DISMISS') => {
    try {
      showLoader(action === 'ACCEPT' ? 'Accepting Booking...' : 'Declining Booking...');
      const response = await respondBookingAPI(bookingId, action);
      if (response.success) {
        showSnackbar(`Booking ${action === 'ACCEPT' ? 'accepted' : 'declined'} successfully!`, 'success');
        
        // Trigger a complete refetch from the API to update the state correctly
        const store = useSocketStore.getState();
        store.triggerRefresh();
      } else {
        showSnackbar(response.message || `Failed to ${action.toLowerCase()} booking`, 'error');
      }
    } catch (error: any) {
      console.error(`Error responding to booking (Action: ${action}):`, error);
      showSnackbar(error?.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const fetchAvailableBookings = async () => {
      try {
        const response = await getAvailableBookingsAPI();
        if (response?.data?.bookings) {
          const getPriceDisplay = (booking: any) => {
            if (booking.purohitPayoutAmount && Number(booking.purohitPayoutAmount) > 0) return `₹${booking.purohitPayoutAmount}`;
            if (booking.agreedPrice && Number(booking.agreedPrice) > 0) return `₹${booking.agreedPrice}`;
            if (booking.service?.minPrice && booking.service?.maxPrice) {
              return `₹${Math.round(Number(booking.service.minPrice))} - ₹${Math.round(Number(booking.service.maxPrice))}`;
            }
            return '₹0';
          };

          const mappedBookings = response.data.bookings.map((booking: any) => ({
            id: booking.bookingNumber || booking.id,
            customer: booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim() : 'Customer',
            ritual: booking.service?.name || 'Puja Service',
            date: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            time: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            location: booking.customerAddress?.fullAddress || 'N/A',
            distance: 'N/A',
            duration: booking.service?.durationMinutes ? `${booking.service.durationMinutes} Mins` : 'N/A',
            urgency: 'Normal',
            price: getPriceDisplay(booking),
            originalData: booking
          }));
          setNewRequests(mappedBookings);
        }
      } catch (error) {
        console.error("Error fetching available bookings:", error);
      }
    };

    const fetchActiveBookings = async () => {
      try {
        const response = await getActiveBookingAPI(activeStatus, activePage, 10);
        if (response?.data?.bookings) {
          const getPriceDisplay = (booking: any) => {
            if (booking.purohitPayoutAmount && Number(booking.purohitPayoutAmount) > 0) return `₹${booking.purohitPayoutAmount}`;
            if (booking.agreedPrice && Number(booking.agreedPrice) > 0) return `₹${booking.agreedPrice}`;
            if (booking.service?.minPrice && booking.service?.maxPrice) {
              return `₹${Math.round(Number(booking.service.minPrice))} - ₹${Math.round(Number(booking.service.maxPrice))}`;
            }
            return '₹0';
          };

          const mappedBookings = response.data.bookings.map((booking: any) => ({
            id: booking.bookingNumber || booking.id,
            customer: booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim() : 'Customer',
            ritual: booking.service?.name || 'Puja Service',
            date: booking.scheduledAtIst ? booking.scheduledAtIst.split(',')[0] : (booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'),
            time: booking.scheduledAtIst ? booking.scheduledAtIst.split(',')[1]?.trim() : (booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'),
            location: booking.customerAddress?.fullAddress || 'N/A',
            distance: 'N/A',
            duration: booking.service?.durationMinutes ? `${booking.service.durationMinutes} Mins` : 'N/A',
            price: getPriceDisplay(booking),
            status: booking.status,
            originalData: booking
          }));
          setActiveBookings(mappedBookings);
          setActiveTotalPages(response.data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching active bookings:", error);
      }
    };

    if (tabValue === 0) {
      fetchAvailableBookings();
    } else if (tabValue === 1) {
      fetchActiveBookings();
    }
  }, [tabValue, isClient, activeStatus, activePage, refreshTrigger]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
            Pooja Bookings
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 2 }}>
            Manage your incoming requests and active jobs.
          </Typography>
        </Box>
      </Box>

      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 4 }}>
        <NextLink href="/purohit/dashboard" style={{ textDecoration: 'none', color: '#666', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '14px' }}>
          Dashboard
        </NextLink>
        <Typography sx={{ color: '#FF6200', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '14px' }}>
          Bookings
        </Typography>
      </Breadcrumbs>

      {/* Job List Container */}
      <Paper sx={{ borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#FAFAFA' }}>
          <Tabs value={tabValue} onChange={(e, val) => { setTabValue(val); localStorage.setItem('bookingsTab', val.toString()); }} sx={{ px: 2, '& .MuiTab-root': { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, textTransform: 'none', fontSize: '15px', py: 2 }, '& .Mui-selected': { color: '#FF6200' }, '& .MuiTabs-indicator': { backgroundColor: '#FF6200' } }}>
            <Tab label="New Requests" />
            <Tab label="Active Bookings" />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '500px', bgcolor: '#F8F9FA' }}>
          
          {/* --- TAB 0: New Requests --- */}
          <CustomTabPanel value={tabValue} index={0}>
            {newRequests.length === 0 ? (
              <Paper sx={{ p: 4, borderRadius: '12px', textAlign: 'center', bgcolor: '#FFF', border: '1px dashed #ccc' }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '16px', fontWeight: 600 }}>
                  No new bookings available at the moment.
                </Typography>
              </Paper>
            ) : (
              newRequests.map((req) => (
                <Paper key={req.id} sx={{ p: 3, borderRadius: '12px', border: '1px solid #FFE0D0', bgcolor: '#FFF', mb: 3, boxShadow: '0 2px 12px rgba(255,98,0,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '18px', color: '#1A1A1A' }}>{req.ritual}</Typography>
                      {req.urgency === 'High' && <Chip label="High Urgency" size="small" icon={<BoltIcon sx={{ fontSize: '14px !important' }} />} sx={{ bgcolor: '#FFF0F0', color: '#D32F2F', fontWeight: 700, fontSize: '11px', height: '22px', border: '1px solid #FFCDD2' }} />}
                    </Box>
                    <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>Client: <span style={{ fontWeight: 600 }}>{req.customer}</span> • B-{req.originalData?.id || req.id}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, fontSize: '22px', color: '#FF6200' }}>{req.price}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EventIcon sx={{ color: '#FF6200', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 700 }}>Schedule</Typography>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 600, color: '#333' }}>{req.date}, {req.time}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><TimerIcon sx={{ color: '#FF6200', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 700 }}>Duration</Typography>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 600, color: '#333' }}>{req.duration}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minWidth: 0 }}><LocationOnIcon sx={{ color: '#FF6200', fontSize: 18, flexShrink: 0, mt: 0.2 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 700 }}>Location</Typography>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 600, color: '#333', wordBreak: 'break-word' }}>{req.location}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" fullWidth onClick={() => handleRespondBooking(req.originalData?.id || req.id, 'ACCEPT')} sx={{ background: '#FF6200', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: '8px', py: 1.2, boxShadow: 'none', '&:hover': { background: '#F05A00' } }}>
                    Accept Booking
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => handleRespondBooking(req.originalData?.id || req.id, 'DISMISS')} sx={{ color: '#666', borderColor: '#ccc', textTransform: 'none', fontWeight: 600, borderRadius: '8px', py: 1.2 }}>
                    Decline
                  </Button>
                </Box>
              </Paper>
              ))
            )}
          </CustomTabPanel>

          {/* --- TAB 1: Active Bookings --- */}
          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
              {statuses.map((status) => (
                <Chip
                  key={status}
                  label={status}
                  clickable
                  onClick={() => { setActiveStatus(status); setActivePage(1); }}
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
                    height: '32px',
                    bgcolor: activeStatus === status ? '#FF6200' : '#FFF',
                    color: activeStatus === status ? '#FFF' : '#666',
                    border: activeStatus === status ? '1px solid #FF6200' : '1px solid #ddd',
                    '&:hover': {
                      bgcolor: activeStatus === status ? '#F05A00' : '#f5f5f5',
                    }
                  }}
                />
              ))}
            </Box>

            {activeBookings.filter(job => job.status?.toUpperCase() === activeStatus.toUpperCase()).length === 0 ? (
              <Paper sx={{ p: 4, borderRadius: '12px', textAlign: 'center', bgcolor: '#FFF', border: '1px dashed #ccc' }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '16px', fontWeight: 600 }}>
                  No active bookings found.
                </Typography>
              </Paper>
            ) : (
              activeBookings.filter(job => job.status?.toUpperCase() === activeStatus.toUpperCase()).map((job: any) => (
                <Paper key={job.id} sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee', bgcolor: '#FFF', mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '18px', color: '#1A1A1A' }}>{job.ritual}</Typography>
                      <Chip 
                        label={job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase() : 'Status'} 
                        size="small" 
                        deleteIcon={[BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.ENROUTE].includes(job.status?.toUpperCase() || '') ? <KeyboardArrowDownIcon /> : undefined}
                        onDelete={[BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.ENROUTE].includes(job.status?.toUpperCase() || '') ? (e) => handleUpdateStatusClick(e as any, job.originalData?.id || job.id) : undefined}
                        onClick={[BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.ENROUTE].includes(job.status?.toUpperCase() || '') ? (e) => handleUpdateStatusClick(e, job.originalData?.id || job.id) : undefined}
                        sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: '11px', height: '22px', cursor: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.ENROUTE].includes(job.status?.toUpperCase() || '') ? 'pointer' : 'default', '& .MuiChip-deleteIcon': { color: '#2E7D32', fontSize: '16px', '&:hover': { color: '#1B5E20' } }, '&:hover': { bgcolor: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.ENROUTE].includes(job.status?.toUpperCase() || '') ? '#C8E6C9' : '#E8F5E9' } }} 
                      />
                    </Box>
                    <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>Client: <span style={{ fontWeight: 600 }}>{job.customer}</span> • B-{job.originalData?.id || job.id}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: { xs: 1, md: 0 } }}>
                    {job.status?.toUpperCase() === BOOKING_STATUS.ARRIVED && (
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={async () => { 
                          try {
                            const idToUse = job.originalData?.id || job.id;
                            setOtpJobId(idToUse); 
                            await sendBookingStartOtpAPI(idToUse);
                            setOtpModalOpen(true); 
                            showSnackbar('OTP sent successfully', 'success');
                          } catch(error) {
                            console.error("Error sending OTP:", error);
                            showSnackbar("Failed to send OTP to client.", "error");
                          }
                        }}
                        sx={{ background: '#FF6200', color: 'white', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { background: '#E55000', boxShadow: 'none' }, boxShadow: 'none' }}
                      >
                        Verify OTP
                      </Button>
                    )}
                    {job.status?.toUpperCase() === BOOKING_STATUS.ONGOING && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={async () => {
                          try {
                            const idToUse = job.originalData?.id || job.id;
                            showLoader('Redirecting to payment...');
                            const callbackUrl = window.location.origin + window.location.pathname;
                            const res = await getPaymentLinkAPI(idToUse, callbackUrl);
                            if (res.success && res.data?.paymentUrl) {
                              window.location.href = res.data.paymentUrl;
                            } else {
                              showSnackbar(res.message || 'Failed to generate payment link', 'error');
                              hideLoader();
                            }
                          } catch (error: any) {
                            console.error(error);
                            showSnackbar(error.response?.data?.message || error.message || 'Error generating payment link', 'error');
                            hideLoader();
                          }
                        }}
                        startIcon={<AccountBalanceWalletIcon />}
                        sx={{ background: '#10b981', color: 'white', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { background: '#059669', boxShadow: 'none' }, boxShadow: 'none' }}
                      >
                        Make Payment
                      </Button>
                    )}
                    {job.status?.toUpperCase() === BOOKING_STATUS.COMPLETED && (
                      <>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleProofButtonClick(job.originalData?.id || job.id)}
                          startIcon={<PhotoCameraIcon />}
                          sx={{ background: '#4CAF50', color: 'white', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { background: '#388E3C', boxShadow: 'none' }, boxShadow: 'none' }}
                        >
                          Add Proof
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleOpenReviewModal(job.originalData?.id || job.id)}
                          startIcon={<RateReviewIcon />}
                          sx={{ background: '#2196F3', color: 'white', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { background: '#1976D2', boxShadow: 'none' }, boxShadow: 'none' }}
                        >
                          Add Review
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleOpenComplaintModal(job.originalData?.id || job.id)}
                          startIcon={<ReportProblemIcon />}
                          sx={{ background: '#F44336', color: 'white', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { background: '#D32F2F', boxShadow: 'none' }, boxShadow: 'none' }}
                        >
                          Write Complaint
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="outlined" 
                      size="small"
                      href={job.originalData?.customer?.phone ? `tel:${job.originalData.customer.phone}` : undefined}
                      sx={{ color: '#333', borderColor: '#ccc', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                      Contact Client {job.originalData?.customer?.phone ? `- ${job.originalData.customer.phone}` : ''}
                    </Button>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EventIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 700 }}>Schedule</Typography>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 600, color: '#333' }}>{job.date}, {job.time}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><AccountBalanceWalletIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
                    <Box>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 700 }}>Est. Payout</Typography>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 800, color: '#333' }}>{job.price}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minWidth: 0 }}><LocationOnIcon sx={{ color: '#2E7D32', fontSize: 18, flexShrink: 0, mt: 0.2 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 700 }}>Location</Typography>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 600, color: '#333', wordBreak: 'break-word' }}>{job.location}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
                
                <Box sx={{ mb: 4 }}>
                  <Stepper 
                    activeStep={job.status?.toUpperCase() === 'CANCELLED' ? -1 : statuses.findIndex(s => s.toUpperCase() === job.status?.toUpperCase())} 
                    alternativeLabel
                    sx={{
                      '& .MuiStepIcon-root.Mui-active': { color: '#FF6200' },
                      '& .MuiStepIcon-root.Mui-completed': { color: '#FF6200' },
                    }}
                  >
                    {statuses.filter(s => s !== 'Cancelled').map((label) => (
                      <Step key={label}>
                        <StepLabel>
                          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '12px' }}>
                            {label}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

              </Paper>
              ))
            )}

            {activeTotalPages > 0 && activeBookings.filter(job => job.status?.toUpperCase() === activeStatus.toUpperCase()).length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={activeTotalPages}
                  page={activePage}
                  onChange={(event, value) => setActivePage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: 'var(--font-outfit), sans-serif',
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#FF6200 !important',
                      color: '#ffffff',
                    },
                  }}
                />
              </Box>
            )}
          </CustomTabPanel>

        </Box>
      </Paper>

      <Menu
        anchorEl={statusMenuAnchorEl}
        open={Boolean(statusMenuAnchorEl)}
        onClose={handleStatusMenuClose}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '150px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' } }}
      >
        {(updatingJobId ? getValidTransitions(activeBookings.find(j => (j.originalData?.id || j.id) === updatingJobId)?.status || '') : []).map((status) => (
          <MenuItem key={status} onClick={() => handleStatusChange(status)} sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 500 }}>
            {status}
          </MenuItem>
        ))}
      </Menu>

      {/* OTP Verification Modal */}
      <Dialog open={otpModalOpen} onClose={() => setOtpModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800 }}>Verify OTP</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 3, fontSize: '14px' }}>
            Enter the 6-digit OTP provided by the client to start the job.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <TextField
                key={idx}
                id={`otp-input-${idx}`}
                variant="outlined"
                value={otpValue[idx] || ''}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                sx={{
                  width: '50px',
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 700,
                    p: '12px 0',
                    fontFamily: 'var(--font-outfit), sans-serif',
                    borderRadius: '8px'
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF6000',
                    }
                  }
                }}
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 0.5 }}>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '13px' }}>
              Didn't get OTP?
            </Typography>
            <Button 
              onClick={async () => {
                if (otpJobId) {
                  try {
                    setIsResendingOtp(true);
                    await resendBookingStartOtpAPI(otpJobId);
                    showSnackbar('OTP resent successfully', 'success');
                  } catch(e) {
                    console.error(e);
                    showSnackbar('Failed to resend OTP', 'error');
                  } finally {
                    setIsResendingOtp(false);
                  }
                }
              }} 
              disabled={isResendingOtp}
              sx={{ color: '#FF6200', textTransform: 'none', fontWeight: 600, fontSize: '13px', p: 0, minWidth: 'auto', '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
            >
              {isResendingOtp ? 'Resending...' : 'Resend'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOtpModalOpen(false)} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button 
            onClick={async () => {
              if (otpValue.length === 6 && otpJobId) {
                try {
                  await verifyBookingOtpAPI(otpJobId, otpValue);
                  setOtpModalOpen(false);
                  setOtpValue('');
                  // Note: Optionally we could fetch again or update local state
                  // Assuming backend sets it to ONGOING, let's navigate there
                  setActiveStatus('Ongoing');
                  showSnackbar('OTP verified successfully! Job started.', 'success');
                } catch(e) {
                  console.error(e);
                  showSnackbar('Invalid OTP or failed to verify', 'error');
                }
              }
            }} 
            variant="contained" 
            sx={{ 
              background: '#4CAF50 !important', 
              color: '#fff !important', 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: '8px', 
              boxShadow: 'none', 
              '&:hover': { background: '#388E3C !important', boxShadow: 'none' },
              '&.Mui-disabled': {
                background: '#81C784 !important',
                color: '#ffffff !important',
                opacity: 0.7
              }
            }}
            disabled={otpValue.length !== 6}
          >
            Verify & Start
          </Button>
        </DialogActions>
      </Dialog>

      {/* Completion Workflow Modal */}
      <Dialog open={completionModalOpen} onClose={() => setCompletionModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800 }}>Complete Job Workflow</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 3, fontSize: '14px' }}>
            To mark this ritual as completed and trigger the payout, please provide the following details.
          </Typography>

          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 1, fontSize: '15px' }}>1. Customer OTP Verification</Typography>
          <TextField fullWidth placeholder="Enter 6-digit OTP shared by client" variant="outlined" sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />

          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 1, fontSize: '15px' }}>2. Upload Ceremony Photo (Optional)</Typography>
          <Box sx={{ border: '1px dashed #ccc', borderRadius: '8px', p: 3, textAlign: 'center', mb: 4, bgcolor: '#fafafa' }}>
            <IconButton sx={{ bgcolor: '#FF6200', color: 'white', mb: 1, '&:hover': { bgcolor: '#F05A00' } }}><PhotoCameraIcon /></IconButton>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '13px', color: '#666' }}>Click to upload a photo of the completed puja.</Typography>
          </Box>

          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 1, fontSize: '15px' }}>3. Notes / Feedback</Typography>
          <TextField fullWidth multiline rows={3} placeholder="Any notes regarding the ritual..." variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />

        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCompletionModalOpen(false)} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" sx={{ background: '#2E7D32', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 3, boxShadow: 'none', '&:hover': { background: '#1B5E20' } }}>
            Submit & Complete Job
          </Button>
        </DialogActions>
      </Dialog>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Dialog open={Boolean(proofPreview)} onClose={() => { setProofPreview(null); setProofFile(null); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800 }}>Submit Proof Image</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {proofPreview && (
              <img src={proofPreview} alt="Proof Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => { setProofPreview(null); setProofFile(null); }} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }} disabled={isUploadingProof}>Cancel</Button>
          <Button 
            onClick={handleUploadProof} 
            variant="contained" 
            disabled={isUploadingProof}
            sx={{ 
              background: '#4CAF50 !important', 
              color: '#fff !important', 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: '8px', 
              boxShadow: 'none', 
              '&:hover': { background: '#388E3C !important', boxShadow: 'none' },
              '&.Mui-disabled': {
                background: '#81C784 !important',
                color: '#ffffff !important',
                opacity: 0.7
              }
            }}
          >
            {isUploadingProof ? 'Uploading...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800 }}>Add Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 1 }}>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, mb: 1, color: '#333' }}>
              Rate your experience
            </Typography>
            <Rating
              name="job-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your review here..."
            variant="outlined"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px', 
                fontFamily: 'var(--font-outfit), sans-serif',
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6200',
                }
              } 
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setReviewModalOpen(false)} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }} disabled={isSubmittingReview}>Cancel</Button>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained" 
            disabled={isSubmittingReview || !rating}
            sx={{ 
              background: '#FF6200 !important', 
              color: '#fff !important', 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: '8px', 
              boxShadow: 'none', 
              '&:hover': { background: '#F05A00 !important', boxShadow: 'none' },
              '&.Mui-disabled': {
                background: '#FF8A33 !important',
                color: '#ffffff !important',
                opacity: 0.7
              }
            }}
          >
            {isSubmittingReview ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cancelModalOpen} onClose={() => { setCancelModalOpen(false); setCancelReason(''); setUpdatingJobId(null); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#D32F2F' }}>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 3, mt: 1, fontSize: '14px' }}>
            Please provide a reason for cancelling this booking. This information helps us improve our services.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter cancellation reason..."
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px', 
                fontFamily: 'var(--font-outfit), sans-serif',
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6200',
                }
              } 
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => { setCancelModalOpen(false); setCancelReason(''); setUpdatingJobId(null); }} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }} disabled={isCancelling}>Back</Button>
          <Button 
            onClick={handleConfirmCancel} 
            variant="contained"
            color="error"
            disabled={isCancelling || !cancelReason.trim()}
            sx={{ 
              background: '#D32F2F !important', 
              color: 'white !important', 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: '8px', 
              boxShadow: 'none', 
              minWidth: '120px',
              '&:hover': { background: '#B71C1C !important', boxShadow: 'none' },
              '&.Mui-disabled': {
                background: '#ef5350 !important',
                color: 'white !important',
                opacity: 0.7
              }
            }}
          >
            {isCancelling ? 'Cancelling...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={complaintModalOpen} onClose={() => setComplaintModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#D32F2F' }}>Raise a Complaint</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="complaint-category-label" sx={{ '&.Mui-focused': { color: '#FF2600' } }}>Category</InputLabel>
              <Select
                labelId="complaint-category-label"
                value={complaintCategory}
                label="Category"
                onChange={(e) => setComplaintCategory(e.target.value)}
                sx={{ 
                  borderRadius: '8px', 
                  fontFamily: 'var(--font-outfit), sans-serif',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF2600' }
                }}
              >
                <MenuItem value="BEHAVIOR_ISSUE">Behavior Issue</MenuItem>
                <MenuItem value="PAYMENT_ISSUE">Payment Issue</MenuItem>
                <MenuItem value="SERVICE_ISSUE">Service Issue</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Subject"
              placeholder="Brief subject of the complaint"
              variant="outlined"
              value={complaintSubject}
              onChange={(e) => setComplaintSubject(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-outfit), sans-serif', '&.Mui-focused fieldset': { borderColor: '#FF2600' } },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF2600' }
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              placeholder="Detailed description of the issue..."
              variant="outlined"
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-outfit), sans-serif', '&.Mui-focused fieldset': { borderColor: '#FF2600' } },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF2600' }
              }}
            />
            
            <Box>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, mb: 1, fontSize: '14px' }}>Evidence (Optional)</Typography>
              <Box sx={{ border: '1px dashed #ccc', borderRadius: '8px', p: 2, textAlign: 'center', bgcolor: '#fafafa' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  ref={complaintFileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleComplaintFileChange}
                />
                <Button 
                  startIcon={<PhotoCameraIcon />} 
                  onClick={() => complaintFileInputRef.current?.click()}
                  sx={{ color: '#FF6200', textTransform: 'none', fontWeight: 600 }}
                >
                  Upload Images
                </Button>
              </Box>
              {complaintFiles.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {complaintFiles.map((file, idx) => (
                    <Chip 
                      key={idx} 
                      label={file.name} 
                      onDelete={() => handleRemoveComplaintFile(idx)} 
                      deleteIcon={<CloseIcon />}
                      size="small"
                      sx={{ borderRadius: '6px' }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setComplaintModalOpen(false)} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }} disabled={isSubmittingComplaint}>Cancel</Button>
          <Button 
            onClick={handleSubmitComplaint} 
            variant="contained" 
            disabled={isSubmittingComplaint || !complaintCategory || !complaintSubject || !complaintDescription}
            sx={{ 
              background: '#D32F2F !important', 
              color: 'white !important', 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: '8px', 
              boxShadow: 'none', 
              px: 3,
              '&:hover': { background: '#B71C1C !important', boxShadow: 'none' },
              '&.Mui-disabled': {
                background: '#ef5350 !important',
                color: 'white !important',
                opacity: 0.7
              }
            }}
          >
            {isSubmittingComplaint ? 'Submitting...' : 'Submit Complaint'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

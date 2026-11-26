'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Menu,
  MenuItem,
  Pagination,
  Avatar,
  Skeleton,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SensorsIcon from '@mui/icons-material/Sensors';
import {
  getAstrologyBookingsAPI,
  updateBookingStatusAPI,
  addReviewAPI,
} from '@/api/bookingControllers';
import { getMeAPI } from '@/api/authControllers';
import { useRouter, useSearchParams } from 'next/navigation';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import { addComplaintAPI } from '@/api/bookingControllers';
import { BookingCancelModal } from './bookings/BookingCancelModal';
import { BookingReviewModal } from './bookings/BookingReviewModal';
import { BookingComplaintModal } from './bookings/BookingComplaintModal';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useSocketStore } from '@/stores/socketStore';
import { useLoaderStore } from '@/stores/loaderStore';
import { getBookingPurohitPayoutDisplay } from '@/utils/payoutHelper';
import { convertImageToWebP } from '@/utils/imageHelper';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

// Safe date-time parsers that prevent "Invalid Date"
const formatScheduleDateTime = (booking: any) => {
  if (booking?.scheduledAt) {
    try {
      const d = new Date(booking.scheduledAt);
      if (!isNaN(d.getTime())) {
        const dateStr = d.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const timeStr = d.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        return { date: dateStr, time: timeStr, full: `${dateStr}, ${timeStr}` };
      }
    } catch (e) {}
  }
  return { date: 'Flexible', time: 'N/A', full: 'Flexible' };
};

const formatCreatedDateTime = (booking: any) => {
  if (booking?.createdAt) {
    try {
      const d = new Date(booking.createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      }
    } catch (e) {}
  }
  return 'N/A';
};

// The 3 statuses requested by the user
const ASTROLOGER_STATUSES = ['Accepted', 'Completed', 'Cancelled'];

export default function AstrologyBookingsContent() {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const { showLoader, hideLoader } = useLoaderStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        setProfile(JSON.parse(userStr));
      }
    } catch (e) {}

    getMeAPI()
      .then((res) => {
        if (res?.data) {
          const fetchedUser = res.data.user || res.data.data || res.data;
          if (fetchedUser) {
            setProfile(fetchedUser);
            try {
              const userStr = sessionStorage.getItem("user");
              const localUser = userStr ? JSON.parse(userStr) : {};
              sessionStorage.setItem("user", JSON.stringify({ ...localUser, ...fetchedUser }));
            } catch (e) {}
          }
        }
      })
      .catch(console.error);
  }, []);

  const verificationStatus =
    profile?.profile?.verificationStatus ||
    profile?.verificationStatus ||
    "";
  const rejReason =
    profile?.profile?.rejectionReason ||
    profile?.rejectionReason ||
    "";
  const isRejected =
    verificationStatus === "REJECTED" || Boolean(rejReason);

  const rawIsAdminCreated =
    profile?.isAdminCreated !== undefined
      ? profile.isAdminCreated
      : profile?.is_admin_created !== undefined
      ? profile.is_admin_created
      : profile?.user?.isAdminCreated !== undefined
      ? profile.user.isAdminCreated
      : profile?.user?.is_admin_created !== undefined
      ? profile.user.is_admin_created
      : false;

  const isAdminCreated = Boolean(rawIsAdminCreated);

  const showIncompleteProfileCard =
    isAdminCreated && verificationStatus !== "APPROVED" && !isRejected;

  const searchParams = useSearchParams();
  const searchStatus = searchParams?.get('status');

  const getInitialStatus = () => {
    if (searchStatus) {
      const match = ASTROLOGER_STATUSES.find(
        (s) => s.toLowerCase() === searchStatus.toLowerCase()
      );
      if (match) return match;
    }
    return 'Accepted';
  };

  const [activeStatus, setActiveStatusState] = useState<string>(getInitialStatus);
  const [activePage, setActivePage] = useState(1);
  const [activeTotalPages, setActiveTotalPages] = useState(1);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [isFetchingBookings, setIsFetchingBookings] = useState(true);

  const setActiveStatus = (status: string) => {
    setActiveStatusState(status);
    setActivePage(1);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("status", status);
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    const sParam = searchParams?.get('status');
    if (sParam) {
      const matched = ASTROLOGER_STATUSES.find(
        (s) => s.toLowerCase() === sParam.toLowerCase()
      );
      if (matched && matched !== activeStatus) {
        setActiveStatusState(matched);
      }
    }
  }, [searchParams]);

  // Status Menu states
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
  const complaintFileInputRef = useRef<HTMLInputElement | null>(null);

  // Cancel states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const getPriceDisplay = (booking: any): string => {
    if (booking.purohitPayoutAmount && Number(booking.purohitPayoutAmount) > 0) {
      return `₹${Number(booking.purohitPayoutAmount).toLocaleString('en-IN')}`;
    }
    if (booking.finalAmount && Number(booking.finalAmount) > 0) {
      return `₹${Number(booking.finalAmount).toLocaleString('en-IN')}`;
    }
    if (booking.totalAmount && Number(booking.totalAmount) > 0) {
      return `₹${Number(booking.totalAmount).toLocaleString('en-IN')}`;
    }
    if (booking.price && Number(booking.price) > 0) {
      return `₹${Number(booking.price).toLocaleString('en-IN')}`;
    }
    return getBookingPurohitPayoutDisplay(booking);
  };

  const fetchActiveBookings = async () => {
    setIsFetchingBookings(true);
    try {
      const response = await getAstrologyBookingsAPI(
        activePage,
        10,
        activeStatus.toUpperCase()
      );

      const payload = response?.data || response;
      const list = Array.isArray(payload?.bookings)
        ? payload.bookings
        : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];

      const total =
        payload?.pagination?.total ||
        payload?.total ||
        payload?.totalBookings ||
        list.length;
      const limit = payload?.pagination?.limit || 10;
      setActiveTotalPages(Math.max(1, Math.ceil(total / limit)));

      const mappedBookings = list.map((booking: any) => {
        const schedule = formatScheduleDateTime(booking);
        const bookedAt = formatCreatedDateTime(booking);

        const rawPayout =
          (booking.partnerPayoutAmount !== null && booking.partnerPayoutAmount !== undefined && booking.partnerPayoutAmount !== "" && booking.partnerPayoutAmount !== "0.00")
            ? booking.partnerPayoutAmount
            : (booking.priceBreakDown?.astrologerPayout !== null && booking.priceBreakDown?.astrologerPayout !== undefined)
              ? booking.priceBreakDown.astrologerPayout
              : (booking.astrologerProfile?.astrologerPayout !== null && booking.astrologerProfile?.astrologerPayout !== undefined)
                ? booking.astrologerProfile.astrologerPayout
                : (booking.astrologer?.astrologerProfile?.astrologerPayout !== null && booking.astrologer?.astrologerProfile?.astrologerPayout !== undefined)
                  ? booking.astrologer.astrologerProfile.astrologerPayout
                  : booking.purohitPayoutAmount || 0;

        const astrologerPayout = Number(rawPayout) || 0;
        const payoutStatus =
          booking.partnerPayoutStatus ||
          booking.purohitPayoutStatus ||
          booking.astrologerPayoutStatus ||
          'PENDING';

        return {
          id: booking.bookingNumber || booking.id,
          bookingNumber: booking.bookingNumber || `PW-${booking.id}`,
          customer: booking.customer
            ? `${booking.customer.firstName || ''} ${booking.customer.lastName || ''}`.trim()
            : 'Devotee',
          ritual: booking.plan?.name || (booking.bookingType === 'ASTROLOGY' ? 'Astrology Consultation' : 'Astrology Consultation'),
          date: schedule.date,
          time: schedule.time,
          scheduleFull: schedule.full,
          bookedAt,
          location: booking.customerAddress?.fullAddress || (booking.bookingMode ? `${booking.bookingMode} Consultation` : 'Online Consultation'),
          astrologerPayout,
          payoutStatus,
          paymentStatus: booking.paymentStatus || 'PAID',
          price: `₹${astrologerPayout}`,
          status: booking.status,
          plan: booking.plan,
          bookingMode: booking.bookingMode || 'ONLINE',
          originalData: booking,
        };
      });

      setActiveBookings(mappedBookings);
    } catch (error) {
      console.error('Error fetching astrology bookings:', error);
      setActiveBookings([]);
    } finally {
      setIsFetchingBookings(false);
    }
  };

  useEffect(() => {
    fetchActiveBookings();
  }, [activeStatus, activePage, refreshTrigger]);

  // Status Change handlers
  const handleUpdateStatusClick = (event: React.MouseEvent<HTMLElement>, jobId: number) => {
    setStatusMenuAnchorEl(event.currentTarget);
    setUpdatingJobId(jobId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchorEl(null);
    setUpdatingJobId(null);
  };

  const handleStatusChange = async (newStatus: string, specificJobId?: number | string) => {
    const targetId = specificJobId || updatingJobId;
    if (!targetId) return;

    if (newStatus.toUpperCase() === 'CANCELLED') {
      setUpdatingJobId(Number(targetId));
      setCancelModalOpen(true);
      setStatusMenuAnchorEl(null);
      return;
    }

    try {
      showLoader('Updating status...');
      const response = await updateBookingStatusAPI(targetId, newStatus);
      if (response.success) {
        showSnackbar(`Booking marked as ${newStatus}!`, 'success');
        fetchActiveBookings();
      } else {
        showSnackbar(response.message || 'Failed to update status', 'error');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      showSnackbar(error?.response?.data?.message || 'Error updating status', 'error');
    } finally {
      hideLoader();
      handleStatusMenuClose();
    }
  };

  const handleConfirmCancel = async () => {
    if (!updatingJobId) return;
    if (!cancelReason.trim()) {
      showSnackbar('Please enter a cancellation reason', 'error');
      return;
    }
    setIsCancelling(true);
    try {
      const response = await updateBookingStatusAPI(updatingJobId, 'CANCELLED');
      if (response.success) {
        showSnackbar('Booking cancelled successfully', 'success');
        setCancelModalOpen(false);
        setCancelReason('');
        setUpdatingJobId(null);
        fetchActiveBookings();
      } else {
        showSnackbar(response.message || 'Failed to cancel booking', 'error');
      }
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      showSnackbar(error?.response?.data?.message || 'Error cancelling booking', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  // Review handlers
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

  // Complaint handlers
  const handleOpenComplaintModal = (jobId: number) => {
    setComplaintJobId(jobId);
    setComplaintCategory('');
    setComplaintSubject('');
    setComplaintDescription('');
    setComplaintFiles([]);
    setComplaintModalOpen(true);
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
      for (const file of complaintFiles) {
        const webpFile = await convertImageToWebP(file);
        formData.append('evidence', webpFile);
      }

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

  const handleComplaintFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setComplaintFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveComplaintFile = (index: number) => {
    setComplaintFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', pb: { xs: 3, sm: 4 } }}>
      {/* Top Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: { xs: 2.5, sm: 3.5, md: 4 },
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <AutoAwesomeIcon sx={{ color: COLORS.PRIMARY, fontSize: { xs: 26, sm: 30, md: 34 } }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: COLORS.DARK,
                fontSize: { xs: '22px', sm: '26px', md: '30px' },
                lineHeight: 1.2,
              }}
            >
              Astrology Bookings
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Verification Rejection Alert Card */}
      {isRejected && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: { xs: '16px', sm: '20px' },
            bgcolor: '#FFF0F0',
            border: '2px solid #FFD6D6',
            boxShadow: '0 6px 24px rgba(211, 47, 47, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
            <Box
              sx={{
                bgcolor: '#FFE0E0',
                color: '#D32F2F',
                p: 1.2,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ErrorIcon sx={{ fontSize: 28 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.8, flexWrap: 'wrap' }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: { xs: '16px', sm: '18px' },
                    color: '#D32F2F',
                  }}
                >
                  Verification Status: REJECTED
                </Typography>
                <Chip
                  label="Action Required"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: '20px', height: '22px' }}
                />
              </Box>

              {rejReason && (
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: '13.5px',
                    color: '#991B1B',
                    mb: 1,
                  }}
                >
                  Rejection Reason: {rejReason}
                </Typography>
              )}

              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: '13px', sm: '14px' },
                  color: '#4B5563',
                  lineHeight: 1.5,
                  mb: 2,
                }}
              >
                Note: Your astrologer profile verification was rejected by Admin. Please update your identity & verification documents in Profile Settings to submit your profile for re-verification.
              </Typography>

              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  sessionStorage.setItem('profileActiveTab', 'documents');
                  router.push('/partner/profile/edit');
                }}
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontFamily: FONTS.OUTFIT,
                  px: 2.5,
                  py: 0.9,
                  minHeight: '40px',
                  boxShadow: '0 4px 14px rgba(211, 47, 47, 0.25)',
                  '&:hover': {
                    bgcolor: '#B91C1C',
                  },
                }}
              >
                Update Documents & Profile
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Complete Profile Card for Admin Created Astrologer */}
      {showIncompleteProfileCard && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: { xs: '16px', sm: '20px' },
            bgcolor: '#FFF8E1',
            border: '2px solid #FFE082',
            boxShadow: '0 6px 24px rgba(255, 143, 0, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
            <Box
              sx={{
                bgcolor: '#FFE8B6',
                color: '#E65100',
                p: 1.2,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PendingActionsIcon sx={{ fontSize: 28 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.8, flexWrap: 'wrap' }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: { xs: '16px', sm: '18px' },
                    color: '#E65100',
                  }}
                >
                  Action Required: Complete Your Profile
                </Typography>
                <Chip
                  label="Verification Pending"
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: '20px', bgcolor: '#FF9800', color: '#FFF', height: '22px' }}
                />
              </Box>

              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: '13px', sm: '14px' },
                  color: '#4B5563',
                  lineHeight: 1.5,
                  mb: 2,
                }}
              >
                Your account was created by Admin. Please complete your professional details, qualifications, astrology specializations, consultation rate, and upload your identity verification documents to submit your profile for admin approval.
              </Typography>

              <Button
                variant="contained"
                onClick={() => {
                  router.push('/partner/profile/edit');
                }}
                startIcon={<EditIcon />}
                sx={{
                  bgcolor: '#FF6200',
                  color: 'white',
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  borderRadius: '10px',
                  textTransform: 'none',
                  px: 2.5,
                  py: 0.9,
                  minHeight: '40px',
                  boxShadow: '0 4px 14px rgba(255, 98, 0, 0.25)',
                  '&:hover': {
                    bgcolor: '#E05500',
                  },
                }}
              >
                Complete Profile
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Main Container - Active Bookings View Only */}
      <Paper
        sx={{
          borderRadius: { xs: '16px', md: '20px' },
          border: '1px solid #EFE6D5',
          boxShadow: '0 4px 20px rgba(44, 24, 16, 0.04)',
          overflow: 'hidden',
          p: { xs: 2, sm: 2.5, md: 3.5 },
          bgcolor: '#FFFFFF',
        }}
      >
        {/* Status Filter Chips: Accepted, Completed, Cancelled */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.2,
            mb: { xs: 2.5, md: 3.5 },
            overflowX: 'auto',
            pb: { xs: 0.5, md: 0 },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            alignItems: 'center',
          }}
        >
          {ASTROLOGER_STATUSES.map((status) => {
            const isSelected = activeStatus.toUpperCase() === status.toUpperCase();
            return (
              <Chip
                key={status}
                label={status}
                clickable
                onClick={() => {
                  setActiveStatus(status);
                  setActivePage(1);
                }}
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: { xs: '13px', sm: '13.5px' },
                  height: { xs: '34px', sm: '36px' },
                  px: 1.2,
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  bgcolor: isSelected ? COLORS.PRIMARY : '#FFFDFB',
                  color: isSelected ? '#FFFFFF' : COLORS.MUTED_TEXT,
                  border: isSelected ? `1px solid ${COLORS.PRIMARY}` : '1px solid #E5E7EB',
                  boxShadow: isSelected ? '0 2px 8px rgba(255, 98, 0, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isSelected ? COLORS.PRIMARY_DARK : '#F9FAFB',
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Loading State Skeleton */}
        {isFetchingBookings ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {[1, 2].map((k) => (
              <Paper
                key={k}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: '16px',
                  border: '1px solid #EFE6D5',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={50} height={50} sx={{ bgcolor: '#FFF0E6' }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="45%" height={26} />
                    <Skeleton variant="text" width="65%" height={20} />
                  </Box>
                </Box>
                <Skeleton variant="rounded" height={74} sx={{ borderRadius: '12px', mb: 2, bgcolor: '#FAF7F2' }} />
                <Skeleton variant="rounded" height={36} sx={{ borderRadius: '8px', bgcolor: '#F5EFE6' }} />
              </Paper>
            ))}
          </Box>
        ) : activeBookings.length === 0 ? (
          /* Empty State */
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: '16px',
              textAlign: 'center',
              bgcolor: '#FFFDFB',
              border: '1.5px dashed #EFE6D5',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#FFF3EB',
                color: COLORS.PRIMARY,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: '#2C1810',
                fontSize: { xs: '17px', sm: '19px' },
                fontWeight: 800,
                mb: 0.5,
              }}
            >
              No {activeStatus} Bookings
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: '#7A6B63',
                fontSize: { xs: '13px', sm: '14px' },
                maxWidth: 420,
                mx: 'auto',
              }}
            >
              {activeStatus === 'Accepted'
                ? 'You currently have no active accepted consultations. New bookings confirmed by devotees will show up here.'
                : activeStatus === 'Completed'
                ? 'No completed consultation history found yet.'
                : 'No cancelled bookings in this category.'}
            </Typography>
          </Paper>
        ) : (
          /* Bookings Cards */
          activeBookings.map((job: any) => {
            const rawData = job.originalData || job;
            const jobId = rawData.id || job.id;
            const statusUpper = (job.status || '').toUpperCase();
            const isAccepted = statusUpper === 'ACCEPTED';
            const isCompleted = statusUpper === 'COMPLETED';
            const isCancelled = statusUpper === 'CANCELLED';

            const bookingMode = (job.bookingMode || rawData.bookingMode || 'ONLINE').toUpperCase();
            const clientNotes =
              rawData.notes ||
              rawData.kundaliDetails ||
              rawData.userNotes ||
              rawData.customFields?.kundaliDetails ||
              rawData.customFields?.userNotes ||
              rawData.description;

            const clientPhone = rawData.customer?.phone || rawData.customerPhone || rawData.phone;
            const clientEmail = rawData.customer?.email || rawData.customerEmail || rawData.email;

            return (
              <Paper
                key={job.id}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: { xs: '14px', md: '16px' },
                  border: '1px solid #EFE6D5',
                  bgcolor: '#FFFFFF',
                  mb: { xs: 2, md: 2.5 },
                  boxShadow: '0 2px 10px rgba(44, 24, 16, 0.03)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(44, 24, 16, 0.06)',
                    borderColor: '#E3D3BE',
                  },
                }}
              >
                {/* Header row: Left devotee details & Right actions */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'flex-start' },
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  {/* Left: Customer Avatar + Title & Client info */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
                    <Avatar
                      src={rawData.customer?.profileImage || undefined}
                      alt={job.customer}
                      sx={{
                        width: { xs: 40, sm: 46 },
                        height: { xs: 40, sm: 46 },
                        bgcolor: '#FFF0E6',
                        color: COLORS.PRIMARY,
                        border: '1.5px solid #FFD8BE',
                        fontWeight: 800,
                        fontSize: { xs: '16px', sm: '18px' },
                        fontFamily: FONTS.OUTFIT,
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      {(rawData.customer?.firstName?.[0] || job.customer?.[0] || 'D').toUpperCase()}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 800,
                          fontSize: { xs: '16px', sm: '18px' },
                          color: '#1E293B',
                          lineHeight: 1.25,
                        }}
                      >
                        {job.ritual}
                      </Typography>

                      {/* Customer Details Row */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1.2, sm: 2 },
                          flexWrap: 'wrap',
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            color: '#475569',
                            fontSize: { xs: '12.5px', sm: '13.5px' },
                            fontWeight: 600,
                          }}
                        >
                          Client:{' '}
                          <span style={{ color: '#0F172A', fontWeight: 700 }}>
                            {job.customer}
                          </span>
                        </Typography>

                        {clientPhone && (
                          <Box
                            component="a"
                            href={`tel:${clientPhone}`}
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.4,
                              color: COLORS.PRIMARY,
                              textDecoration: 'none',
                              fontFamily: FONTS.OUTFIT,
                              fontSize: { xs: '12px', sm: '13px' },
                              fontWeight: 600,
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            <PhoneIcon sx={{ fontSize: 13 }} />
                            +91 {clientPhone}
                          </Box>
                        )}

                        {clientEmail && (
                          <Box
                            component="a"
                            href={`mailto:${clientEmail}`}
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.4,
                              color: '#64748B',
                              textDecoration: 'none',
                              fontFamily: FONTS.OUTFIT,
                              fontSize: { xs: '12px', sm: '13px' },
                              fontWeight: 500,
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            <EmailIcon sx={{ fontSize: 13 }} />
                            {clientEmail}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Action Buttons: Responsive for Mobile and Desktop */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      alignItems: 'center',
                      mt: { xs: 0.5, md: 0 },
                    }}
                  >
                    {isAccepted && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleStatusChange('COMPLETED', jobId)}
                          startIcon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
                          sx={{
                            flex: { xs: '1 1 auto', sm: 'none' },
                            bgcolor: '#16A34A',
                            color: 'white',
                            textTransform: 'none',
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 700,
                            borderRadius: '8px',
                            px: 1.8,
                            py: 0.6,
                            height: '34px',
                            fontSize: '12.5px',
                            boxShadow: 'none',
                            '&:hover': {
                              bgcolor: '#15803D',
                              boxShadow: 'none',
                            },
                          }}
                        >
                          Mark Completed
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => {
                            setUpdatingJobId(jobId);
                            setCancelModalOpen(true);
                          }}
                          startIcon={<CancelIcon sx={{ fontSize: '16px !important' }} />}
                          sx={{
                            flex: { xs: '1 1 auto', sm: 'none' },
                            textTransform: 'none',
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 600,
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.6,
                            height: '34px',
                            fontSize: '12.5px',
                            '&:hover': {
                              bgcolor: '#FEE2E2',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {isCompleted && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenReviewModal(jobId)}
                          startIcon={<RateReviewIcon sx={{ fontSize: '16px !important' }} />}
                          sx={{
                            flex: { xs: '1 1 auto', sm: 'none' },
                            bgcolor: '#0284C7',
                            color: 'white',
                            textTransform: 'none',
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 600,
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.6,
                            height: '34px',
                            fontSize: '12.5px',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#0369A1', boxShadow: 'none' },
                          }}
                        >
                          Add Review
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenComplaintModal(jobId)}
                          startIcon={<ReportProblemIcon sx={{ fontSize: '16px !important' }} />}
                          sx={{
                            flex: { xs: '1 1 auto', sm: 'none' },
                            bgcolor: '#DC2626',
                            color: 'white',
                            textTransform: 'none',
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 600,
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.6,
                            height: '34px',
                            fontSize: '12.5px',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#B91C1C', boxShadow: 'none' },
                          }}
                        >
                          Write Complaint
                        </Button>
                      </>
                    )}

                    {clientPhone && (
                      <Button
                        variant="outlined"
                        size="small"
                        href={`tel:${clientPhone}`}
                        startIcon={<PhoneIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          flex: { xs: '1 1 auto', sm: 'none' },
                          color: '#334155',
                          borderColor: '#CBD5E1',
                          textTransform: 'none',
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 600,
                          borderRadius: '8px',
                          px: 1.5,
                          py: 0.6,
                          height: '34px',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          '&:hover': { bgcolor: '#F8FAFC', borderColor: '#94A3B8' },
                        }}
                      >
                        Contact Client
                      </Button>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5, borderColor: '#F2E8DC' }} />

                {/* 3-Column Info Strip */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    p: { xs: 2, sm: 2.2 },
                    bgcolor: '#FFFDF9',
                    borderRadius: '14px',
                    border: '1px solid #EFE6D5',
                    mb: clientNotes ? 2 : 0,
                  }}
                >
                  {/* 1. Schedule Date & Time */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: { xs: 1, md: 0 },
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: '#FFF0E6',
                        borderRadius: '10px',
                        color: COLORS.PRIMARY,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                      }}
                    >
                      <EventIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#7A4B3A',
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          letterSpacing: '0.5px',
                          fontFamily: FONTS.OUTFIT,
                          lineHeight: 1.2,
                        }}
                      >
                        Schedule Date & Time
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: { xs: '13.5px', sm: '14px' },
                          fontWeight: 700,
                          color: '#1E293B',
                          lineHeight: 1.3,
                          mt: 0.3,
                        }}
                      >
                        {job.date}{' '}
                        <span style={{ color: COLORS.PRIMARY, fontWeight: 700, marginLeft: 6 }}>
                          {job.time} (IST)
                        </span>
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 1.2, borderColor: '#F2E8DC' }} />
                  <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 2, borderColor: '#F2E8DC' }} />

                  {/* 2. Astrologer Payout */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: { xs: 1, md: 0 },
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: '#ECFDF5',
                        borderRadius: '10px',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                      }}
                    >
                      <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#065F46',
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          letterSpacing: '0.5px',
                          fontFamily: FONTS.OUTFIT,
                          lineHeight: 1.2,
                        }}
                      >
                        Astrologer Payout
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontSize: { xs: '15px', sm: '16px' },
                            fontWeight: 800,
                            color: '#059669',
                            lineHeight: 1.2,
                          }}
                        >
                          ₹{job.astrologerPayout ?? (job.originalData?.priceBreakDown?.astrologerPayout ?? 0)}
                        </Typography>
                        <Chip
                          label={
                            job.payoutStatus?.toUpperCase() === 'PAID'
                              ? 'Paid'
                              : job.payoutStatus || 'Pending'
                          }
                          size="small"
                          sx={{
                            height: '20px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            bgcolor: job.payoutStatus?.toUpperCase() === 'PAID' ? '#DCFCE7' : '#FEF3C7',
                            color: job.payoutStatus?.toUpperCase() === 'PAID' ? '#16A34A' : '#D97706',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 1.2, borderColor: '#F2E8DC' }} />
                  <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 2, borderColor: '#F2E8DC' }} />

                  {/* 3. Session Mode */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: { xs: 1, md: 0 },
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: bookingMode === 'OFFLINE' ? '#FEF3C7' : '#EFF6FF',
                        borderRadius: '10px',
                        color: bookingMode === 'OFFLINE' ? '#D97706' : '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                      }}
                    >
                      {bookingMode === 'OFFLINE' ? (
                        <LocationOnIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <VideoCameraFrontIcon sx={{ fontSize: 20 }} />
                      )}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: bookingMode === 'OFFLINE' ? '#92400E' : '#1E40AF',
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          letterSpacing: '0.5px',
                          fontFamily: FONTS.OUTFIT,
                          lineHeight: 1.2,
                        }}
                      >
                        Session Mode
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: { xs: '13.5px', sm: '14px' },
                          fontWeight: 700,
                          color: '#1E293B',
                          lineHeight: 1.3,
                          mt: 0.3,
                        }}
                      >
                        {bookingMode}{' '}
                        <span style={{ color: '#64748B', fontWeight: 500, fontSize: '12px', marginLeft: 6 }}>
                          ({bookingMode === 'OFFLINE' ? 'In-Person' : 'Audio / Video'})
                        </span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Client Notes / Kundali Details Box */}
                {clientNotes && (
                  <Box
                    sx={{
                      mb: 0,
                      p: { xs: 1.8, sm: 2 },
                      bgcolor: '#FFFDF5',
                      borderRadius: '12px',
                      border: '1px dashed #FCD34D',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <MenuBookIcon sx={{ fontSize: 16, color: '#B45309' }} />
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#92400E',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Client Questions / Kundali Details:
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: { xs: '12.5px', sm: '13.5px' },
                        color: '#78350F',
                        lineHeight: 1.6,
                      }}
                    >
                      {clientNotes}
                    </Typography>
                  </Box>
                )}
              </Paper>
            );
          })
        )}

        {/* Pagination */}
        {activeTotalPages > 1 && (
          <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={activeTotalPages}
              page={activePage}
              onChange={(_, v) => setActivePage(v)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: { xs: '12px', sm: '14px' },
                  borderRadius: '8px',
                },
                '& .Mui-selected': {
                  bgcolor: `${COLORS.PRIMARY} !important`,
                  color: 'white !important',
                  boxShadow: '0 2px 8px rgba(255, 98, 0, 0.3)',
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Status Transition Menu */}
      <Menu
        anchorEl={statusMenuAnchorEl}
        open={Boolean(statusMenuAnchorEl)}
        onClose={handleStatusMenuClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              border: '1px solid #EFE6D5',
              boxShadow: '0 8px 24px rgba(44, 24, 16, 0.12)',
              minWidth: 170,
              p: 0.5,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleStatusChange('COMPLETED')}
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: '13.5px',
            fontWeight: 700,
            color: '#16A34A',
            borderRadius: '8px',
            py: 1,
            '&:hover': { bgcolor: '#DCFCE7' },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 18, mr: 1 }} />
          Mark Completed
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusChange('CANCELLED')}
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: '13.5px',
            fontWeight: 700,
            color: '#DC2626',
            borderRadius: '8px',
            py: 1,
            '&:hover': { bgcolor: '#FEE2E2' },
          }}
        >
          <CancelIcon sx={{ fontSize: 18, mr: 1 }} />
          Cancel Booking
        </MenuItem>
      </Menu>

      {/* Modals */}
      <BookingCancelModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        onConfirmCancel={handleConfirmCancel}
        isCancelling={isCancelling}
      />

      <BookingReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        rating={rating}
        setRating={setRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        onSubmitReview={handleSubmitReview}
        isSubmittingReview={isSubmittingReview}
      />

      <BookingComplaintModal
        open={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        complaintCategory={complaintCategory}
        setComplaintCategory={setComplaintCategory}
        complaintSubject={complaintSubject}
        setComplaintSubject={setComplaintSubject}
        complaintDescription={complaintDescription}
        setComplaintDescription={setComplaintDescription}
        complaintFiles={complaintFiles}
        onFileChange={handleComplaintFileChange}
        onRemoveFile={handleRemoveComplaintFile}
        onSubmitComplaint={handleSubmitComplaint}
        isSubmittingComplaint={isSubmittingComplaint}
        fileInputRef={complaintFileInputRef}
      />
    </Box>
  );
}

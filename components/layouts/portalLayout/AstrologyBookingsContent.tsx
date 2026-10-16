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
  CircularProgress,
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
import {
  getAstrologyBookingsAPI,
  updateBookingStatusAPI,
  addReviewAPI,
} from '@/api/bookingControllers';
import { getMeAPI } from '@/api/authControllers';
import { useRouter } from 'next/navigation';
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

  const [activeStatus, setActiveStatus] = useState('Accepted');
  const [activePage, setActivePage] = useState(1);
  const [activeTotalPages, setActiveTotalPages] = useState(1);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [isFetchingBookings, setIsFetchingBookings] = useState(true);

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

      const mappedBookings = list.map((booking: any) => ({
        id: booking.bookingNumber || booking.id,
        customer: booking.customer
          ? `${booking.customer.firstName || ''} ${booking.customer.lastName || ''}`.trim()
          : 'Devotee',
        ritual: booking.service?.name || 'Astrology Consultation',
        date: booking.scheduledAtIst
          ? new Date(booking.scheduledAtIst).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : booking.scheduledAt
          ? new Date(booking.scheduledAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Flexible',
        time: booking.scheduledAtIst
          ? new Date(booking.scheduledAtIst).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : booking.scheduledAt
          ? new Date(booking.scheduledAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'N/A',
        location: booking.customerAddress?.fullAddress || booking.bookingMode || 'Online Consultation',
        price: getPriceDisplay(booking),
        status: booking.status,
        plan: booking.plan,
        bookingMode: booking.bookingMode,
        originalData: booking,
      }));

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

  const handleStatusChange = async (newStatus: string) => {
    if (!updatingJobId) return;

    if (newStatus.toUpperCase() === 'CANCELLED') {
      setCancelModalOpen(true);
      setStatusMenuAnchorEl(null);
      return;
    }

    try {
      showLoader('Updating status...');
      const response = await updateBookingStatusAPI(updatingJobId, newStatus);
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
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AutoAwesomeIcon sx={{ color: COLORS.PRIMARY, fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: COLORS.DARK,
                mb: 0.5,
              }}
            >
              Astrology Bookings
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: COLORS.MUTED_TEXT,
            }}
          >
            Manage your client astrology sessions and active consultations.
          </Typography>
        </Box>
      </Box>

      {/* Verification Rejection Alert Card */}
      {isRejected && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: "20px",
            bgcolor: "#FFF0F0",
            border: "2px solid #FFD6D6",
            boxShadow: "0 6px 24px rgba(211, 47, 47, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, flexWrap: "wrap" }}>
            <Box
              sx={{
                bgcolor: "#FFE0E0",
                color: "#D32F2F",
                p: 1.5,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ErrorIcon sx={{ fontSize: 32 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 260 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: "18px",
                    color: "#D32F2F",
                  }}
                >
                  Verification Status: REJECTED
                </Typography>
                <Chip
                  label="Action Required"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: "20px" }}
                />
              </Box>

              {rejReason && (
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#991B1B",
                    mb: 1,
                  }}
                >
                  Rejection Reason: {rejReason}
                </Typography>
              )}

              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "14px",
                  color: "#4B5563",
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                Note: Your astrologer profile verification was rejected by Admin. Please update your identity & verification documents in Profile Settings to submit your profile for re-verification.
              </Typography>

              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  sessionStorage.setItem("profileActiveTab", "documents");
                  router.push("/partner/profile/edit");
                }}
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 14px rgba(211, 47, 47, 0.25)",
                  "&:hover": {
                    bgcolor: "#B91C1C",
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
            p: 3,
            mb: 4,
            borderRadius: "20px",
            bgcolor: "#FFF8E1",
            border: "2px solid #FFE082",
            boxShadow: "0 6px 24px rgba(255, 143, 0, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, flexWrap: "wrap" }}>
            <Box
              sx={{
                bgcolor: "#FFE8B6",
                color: "#E65100",
                p: 1.5,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PendingActionsIcon sx={{ fontSize: 32 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 260 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: "18px",
                    color: "#E65100",
                  }}
                >
                  Action Required: Complete Your Profile
                </Typography>
                <Chip
                  label="Verification Pending"
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: "20px", bgcolor: "#FF9800", color: "#FFF" }}
                />
              </Box>

              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "14px",
                  color: "#4B5563",
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                Your account was created by Admin. Please complete your professional details, qualifications, astrology specializations, consultation rate, and upload your identity verification documents to submit your profile for admin approval.
              </Typography>

              <Button
                variant="contained"
                onClick={() => {
                  router.push("/partner/profile/edit");
                }}
                startIcon={<EditIcon />}
                sx={{
                  bgcolor: "#FF6200",
                  color: "white",
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                  "&:hover": {
                    bgcolor: "#E05500",
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
          borderRadius: '16px',
          border: `1px solid ${COLORS.BORDER_LIGHT}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          p: { xs: 2.5, md: 4 },
          bgcolor: COLORS.WHITE,
        }}
      >
        {/* Status Filter Chips: Accepted, Completed, Cancelled */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3.5, flexWrap: 'wrap', alignItems: 'center' }}>
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
                  fontSize: '13px',
                  height: '34px',
                  px: 1,
                  bgcolor: isSelected ? COLORS.PRIMARY : COLORS.WHITE,
                  color: isSelected ? COLORS.WHITE : COLORS.MUTED_TEXT,
                  border: isSelected
                    ? `1px solid ${COLORS.PRIMARY}`
                    : '1px solid #ddd',
                  '&:hover': {
                    bgcolor: isSelected ? COLORS.PRIMARY_DARK : '#f5f5f5',
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Loading State */}
        {isFetchingBookings ? (
          <Paper
            sx={{
              p: 6,
              borderRadius: '12px',
              textAlign: 'center',
              bgcolor: COLORS.WHITE,
              border: `1px solid ${COLORS.BORDER_LIGHT}`,
            }}
          >
            <CircularProgress sx={{ color: COLORS.PRIMARY, mb: 2 }} />
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: COLORS.MUTED_TEXT,
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              Loading consultations...
            </Typography>
          </Paper>
        ) : activeBookings.length === 0 ? (
          /* Empty State */
          <Paper
            sx={{
              p: 6,
              borderRadius: '12px',
              textAlign: 'center',
              bgcolor: COLORS.WHITE,
              border: '1px dashed #ccc',
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: COLORS.MUTED_TEXT,
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              No {activeStatus.toLowerCase()} bookings found.
            </Typography>
          </Paper>
        ) : (
          /* Bookings Cards (Exact Purohit Active Booking Card Format) */
          activeBookings.map((job: any) => {
            const rawData = job.originalData || job;
            const jobId = rawData.id || job.id;
            const statusUpper = (job.status || '').toUpperCase();
            const isAccepted = statusUpper === 'ACCEPTED';
            const isCompleted = statusUpper === 'COMPLETED';
            const isCancelled = statusUpper === 'CANCELLED';

            const bookingMode = (job.bookingMode || rawData.bookingMode || 'ONLINE').toUpperCase();
            const clientNotes = rawData.notes || rawData.kundaliDetails || rawData.userNotes;

            return (
              <Paper
                key={job.id}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: '14px',
                  border: '1px solid #eee',
                  bgcolor: '#FFF',
                  mb: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                  },
                }}
              >
                {/* Header row */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 700,
                          fontSize: '18px',
                          color: '#1A1A1A',
                        }}
                      >
                        {job.ritual}
                      </Typography>

                      {/* Mode Badge */}
                      <Chip
                        label={bookingMode}
                        size="small"
                        sx={{
                          bgcolor: bookingMode === 'OFFLINE' ? '#FEF3C7' : '#E0F2FE',
                          color: bookingMode === 'OFFLINE' ? '#92400E' : '#0369A1',
                          border: bookingMode === 'OFFLINE' ? '1px solid #FDE68A' : '1px solid #BAE6FD',
                          fontWeight: 700,
                          fontSize: '11px',
                          height: '22px',
                          borderRadius: '6px',
                        }}
                      />

                      {/* Status Chip (Clickable dropdown if Accepted) */}
                      <Chip
                        label={
                          job.status
                            ? job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()
                            : 'Status'
                        }
                        size="small"
                        deleteIcon={isAccepted ? <KeyboardArrowDownIcon /> : undefined}
                        onDelete={isAccepted ? (e) => handleUpdateStatusClick(e as any, jobId) : undefined}
                        onClick={isAccepted ? (e) => handleUpdateStatusClick(e, jobId) : undefined}
                        sx={{
                          bgcolor: isCancelled ? '#FEE2E2' : isCompleted ? '#DCFCE7' : '#E8F5E9',
                          color: isCancelled ? '#DC2626' : isCompleted ? '#16A34A' : '#2E7D32',
                          fontWeight: 700,
                          fontSize: '11px',
                          height: '22px',
                          cursor: isAccepted ? 'pointer' : 'default',
                          '& .MuiChip-deleteIcon': {
                            color: '#2E7D32',
                            fontSize: '16px',
                          },
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        color: '#666',
                        fontSize: '14px',
                      }}
                    >
                      Client: <span style={{ fontWeight: 600 }}>{job.customer}</span> • B-{jobId}
                    </Typography>
                  </Box>

                  {/* Top-Right Action Buttons */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: { xs: 1, md: 0 },
                    }}
                  >
                    {isAccepted && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleStatusChange('COMPLETED')}
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            background: '#16A34A',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            boxShadow: 'none',
                            '&:hover': {
                              background: '#15803D',
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
                          startIcon={<CancelIcon />}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
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
                          startIcon={<RateReviewIcon />}
                          sx={{
                            background: '#2196F3',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            boxShadow: 'none',
                            '&:hover': { background: '#1976D2', boxShadow: 'none' },
                          }}
                        >
                          Add Review
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenComplaintModal(jobId)}
                          startIcon={<ReportProblemIcon />}
                          sx={{
                            background: '#F44336',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            boxShadow: 'none',
                            '&:hover': { background: '#D32F2F', boxShadow: 'none' },
                          }}
                        >
                          Write Complaint
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outlined"
                      size="small"
                      href={
                        rawData?.customer?.phone
                          ? `tel:${rawData.customer.phone}`
                          : undefined
                      }
                      sx={{
                        color: '#333',
                        borderColor: '#ccc',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#f5f5f5' },
                      }}
                    >
                      Contact Client {rawData?.customer?.phone ? `- ${rawData.customer.phone}` : ''}
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* 3-Column Info Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#999',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      >
                        Schedule
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#333',
                        }}
                      >
                        {job.date}, {job.time}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWalletIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#999',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      >
                        Consultation Payout
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: '15px',
                          fontWeight: 800,
                          color: '#333',
                        }}
                      >
                        {job.price}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minWidth: 0 }}>
                    <LocationOnIcon sx={{ color: '#2E7D32', fontSize: 20, flexShrink: 0, mt: 0.2 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#999',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      >
                        Session Mode / Location
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#333',
                          wordBreak: 'break-word',
                        }}
                      >
                        {job.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Client Notes / Kundali Details Box */}
                {clientNotes && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      bgcolor: '#FFFDF5',
                      borderRadius: '10px',
                      border: '1px dashed #FCD34D',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#92400E',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 0.5,
                      }}
                    >
                      Client Questions / Kundali Details:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: '13px',
                        color: '#78350F',
                      }}
                    >
                      {clientNotes}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

                {/* Progress Stepper */}
                <Box sx={{ mb: 2 }}>
                  {isCancelled ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#DC2626' }}>
                      <CancelIcon fontSize="small" />
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '13px' }}>
                        This consultation session was cancelled.
                      </Typography>
                    </Box>
                  ) : (
                    <Stepper
                      activeStep={isCompleted ? 1 : 0}
                      alternativeLabel
                      sx={{
                        '& .MuiStepIcon-root.Mui-active': { color: COLORS.PRIMARY },
                        '& .MuiStepIcon-root.Mui-completed': { color: '#16A34A' },
                      }}
                    >
                      <Step key="Accepted">
                        <StepLabel>
                          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, fontSize: '12px' }}>
                            Accepted
                          </Typography>
                        </StepLabel>
                      </Step>
                      <Step key="Completed">
                        <StepLabel>
                          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, fontSize: '12px' }}>
                            Completed
                          </Typography>
                        </StepLabel>
                      </Step>
                    </Stepper>
                  )}
                </Box>
              </Paper>
            );
          })
        )}

        {/* Pagination */}
        {activeTotalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={activeTotalPages}
              page={activePage}
              onChange={(_, v) => setActivePage(v)}
              color="primary"
              sx={{
                '& .Mui-selected': { bgcolor: `${COLORS.PRIMARY} !important`, color: 'white' },
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
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              minWidth: 150,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleStatusChange('COMPLETED')}
          sx={{ fontFamily: FONTS.OUTFIT, fontSize: '14px', fontWeight: 600, color: '#16A34A' }}
        >
          Mark Completed
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusChange('CANCELLED')}
          sx={{ fontFamily: FONTS.OUTFIT, fontSize: '14px', fontWeight: 600, color: '#DC2626' }}
        >
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

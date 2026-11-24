'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button,
  Typography, 
  CircularProgress,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Card, 
  Divider, 
  Tabs, 
  Tab, 
  IconButton, 
  Tooltip, 
  Pagination 
} from '@mui/material';
import AppTablePagination from '@/components/widgets/AppTablePagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getCustomerBookingsAPI } from '@/api/bookingControllers';
import { useLoaderStore } from '@/stores/loaderStore';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useSocketStore } from '@/stores/socketStore';
import {
  getTablePaginationState,
  syncTablePagination,
} from '@/utils/paginationHelper';
import { formatScheduledDateTime } from '@/utils/helpers';

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
    case 'ACCEPTED': return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
    case 'PENDING': return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
    case 'CANCELLED': return { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' };
    case 'ENROUTE': return { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' };
    case 'ARRIVED': return { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' };
    case 'ONGOING': return { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD' };
    default: return { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' };
  }
};

const POOJA_TABS = ['All Bookings', 'Pending', 'Accepted', 'Enroute', 'Arrived', 'Ongoing', 'Completed', 'Cancelled'];
const ASTROLOGY_TABS = ['All Bookings', 'Accepted', 'Completed', 'Cancelled'];

export default function CustomerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [bookingType, setBookingType] = useState<'POOJA' | 'ASTROLOGY'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const typeFromParam = (urlParams.get('type') || urlParams.get('bookingType'))?.toUpperCase();
      if (typeFromParam === 'ASTROLOGY' || typeFromParam === 'POOJA') {
        sessionStorage.setItem('customer_bookings_type', typeFromParam);
        return typeFromParam as 'POOJA' | 'ASTROLOGY';
      }
      const saved = sessionStorage.getItem('customer_bookings_type')?.toUpperCase();
      if (saved === 'ASTROLOGY' || saved === 'POOJA') {
        return saved as 'POOJA' | 'ASTROLOGY';
      }
    }
    return 'POOJA';
  });

  const initialPagination = getTablePaginationState('customer_dashboard_pagination', {
    defaultLimit: 10,
  });

  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [loading, setLoading] = useState(true);
  const fetchIdRef = React.useRef(0);

  useEffect(() => {
    syncTablePagination(
      'customer_dashboard_pagination',
      { page, rowsPerPage },
      { defaultLimit: 10 }
    );
  }, [page, rowsPerPage]);

  const { showLoader, hideLoader } = useLoaderStore();
  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const currentTabsList = bookingType === 'ASTROLOGY' ? ASTROLOGY_TABS : POOJA_TABS;

  const isInitialMountRef = React.useRef(true);

  // Clean URL parameters (type, bookingType, razorpay_*) on mount and check payment return
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = (urlParams.get('type') || urlParams.get('bookingType'))?.toUpperCase();
    if (typeParam === 'ASTROLOGY' || typeParam === 'POOJA') {
      sessionStorage.setItem('customer_bookings_type', typeParam);
      if (typeParam !== bookingType) {
        setBookingType(typeParam as 'POOJA' | 'ASTROLOGY');
      }
    }

    const hasTypeParam = urlParams.has('type') || urlParams.has('bookingType');
    const pendingBooking = sessionStorage.getItem('booking_payment_pending');
    const hasPaymentParams =
      urlParams.get('razorpay_payment_id') ||
      urlParams.get('razorpay_payment_link_status') ||
      urlParams.get('payment_id');

    if (pendingBooking || hasPaymentParams) {
      sessionStorage.removeItem('booking_payment_pending');
      showSnackbar('Booking request created successfully!', 'success');
    }

    if (hasTypeParam || hasPaymentParams) {
      const url = new URL(window.location.href);
      url.searchParams.delete('type');
      url.searchParams.delete('bookingType');
      url.searchParams.delete('razorpay_payment_id');
      url.searchParams.delete('razorpay_payment_link_id');
      url.searchParams.delete('razorpay_payment_link_reference_id');
      url.searchParams.delete('razorpay_payment_link_status');
      url.searchParams.delete('razorpay_signature');
      url.searchParams.delete('payment_id');

      const newSearch = url.searchParams.toString();
      const newUrl = url.pathname + (newSearch ? `?${newSearch}` : '');
      window.history.replaceState(null, '', newUrl);
    }
  }, [bookingType, showSnackbar]);

  // Sync status tab with URL parameter if present
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const activeTabs = bookingType === 'ASTROLOGY' ? ASTROLOGY_TABS : POOJA_TABS;
    if (statusParam) {
      const foundIdx = activeTabs.findIndex(
        (t) => t.toLowerCase() === statusParam.toLowerCase()
      );
      if (foundIdx !== -1 && foundIdx !== tabValue) {
        setTabValue(foundIdx);
      }
    }
  }, [bookingType, searchParams, tabValue]);

  // Main data fetch for user actions (type switch, tab change, pagination)
  useEffect(() => {
    const fetchBookings = async () => {
      const currentFetchId = ++fetchIdRef.current;
      const activeTabs = bookingType === 'ASTROLOGY' ? ASTROLOGY_TABS : POOJA_TABS;
      const currentStatus = tabValue === 0 ? undefined : activeTabs[tabValue];

      setLoading(true);

      try {
        const res = await getCustomerBookingsAPI(currentStatus, page + 1, rowsPerPage, bookingType);
        if (currentFetchId !== fetchIdRef.current) return;

        if (res.success && res.data?.bookings) {
          const rawBookings = res.data.bookings;
          const paginated = rawBookings.length > rowsPerPage
            ? rawBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rawBookings;
          setBookings(paginated);
          setTotalBookings(res.data.pagination?.total || rawBookings.length);
        } else {
          setBookings([]);
          setTotalBookings(0);
        }
      } catch (error) {
        if (currentFetchId !== fetchIdRef.current) return;
        console.error(error);
        showSnackbar('Failed to fetch bookings', 'error');
        setBookings([]);
        setTotalBookings(0);
      } finally {
        if (currentFetchId === fetchIdRef.current) {
          setLoading(false);
          hideLoader();
        }
      }
    };

    fetchBookings();
  }, [page, rowsPerPage, tabValue, bookingType, showSnackbar, hideLoader]);

  // Silent background refresh for real-time socket events (does not trigger full-screen loader)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (refreshTrigger === 0) return;

    let isCancelled = false;
    const timeoutId = setTimeout(async () => {
      try {
        const activeTabs = bookingType === 'ASTROLOGY' ? ASTROLOGY_TABS : POOJA_TABS;
        const currentStatus = tabValue === 0 ? undefined : activeTabs[tabValue];
        const res = await getCustomerBookingsAPI(currentStatus, page + 1, rowsPerPage, bookingType);
        if (isCancelled) return;

        if (res.success && res.data?.bookings) {
          const rawBookings = res.data.bookings;
          const paginated = rawBookings.length > rowsPerPage
            ? rawBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rawBookings;
          setBookings(paginated);
          setTotalBookings(res.data.pagination?.total || rawBookings.length);
        }
      } catch (error) {
        if (!isCancelled) {
          console.warn('Silent refresh notice:', error);
        }
      }
    }, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [refreshTrigger, bookingType, tabValue, page, rowsPerPage]);

  const handleBookingTypeChange = (event: React.SyntheticEvent, newValue: 'POOJA' | 'ASTROLOGY') => {
    if (newValue && newValue !== bookingType) {
      setBookingType(newValue);
      setTabValue(0);
      setPage(0);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('customer_bookings_type', newValue);
        const url = new URL(window.location.href);
        if (url.searchParams.has('type') || url.searchParams.has('bookingType') || url.searchParams.has('status')) {
          url.searchParams.delete('type');
          url.searchParams.delete('bookingType');
          url.searchParams.delete('status');
          const newSearch = url.searchParams.toString();
          const newUrl = url.pathname + (newSearch ? `?${newSearch}` : '');
          window.history.replaceState(null, '', newUrl);
        }
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue !== tabValue) {
      setTabValue(newValue);
      setPage(0);
      if (typeof window !== 'undefined') {
        const activeTabs = bookingType === 'ASTROLOGY' ? ASTROLOGY_TABS : POOJA_TABS;
        const tabName = activeTabs[newValue];
        const url = new URL(window.location.href);
        url.searchParams.delete('type');
        url.searchParams.delete('bookingType');
        if (newValue === 0) {
          url.searchParams.delete('status');
        } else {
          url.searchParams.set('status', tabName);
        }
        const newSearch = url.searchParams.toString();
        const newUrl = url.pathname + (newSearch ? `?${newSearch}` : '');
        window.history.replaceState(null, '', newUrl);
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (id: number | string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('customer_bookings_type', bookingType);
    }
    router.push(`/customer/bookings/${id}`);
  };

  return (
    <Box sx={{ pb: { xs: 4, md: 6 } }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: '#2C1810',
          fontSize: { xs: '24px', sm: '28px', md: '32px' },
          mb: { xs: 2, md: 2.5 },
        }}
      >
        My Bookings
      </Typography>

      {/* Booking Type Navigation Tabs */}
      <Box sx={{ borderBottom: '1px solid #EFE6D5', mb: { xs: 2.5, md: 3 } }}>
        <Tabs 
          value={bookingType} 
          onChange={handleBookingTypeChange}
          sx={{ 
            minHeight: '48px',
            '& .MuiTab-root': { 
              fontFamily: FONTS.OUTFIT, 
              fontWeight: 700, 
              textTransform: 'none', 
              fontSize: { xs: '14px', sm: '15px' }, 
              color: '#7C6A60',
              minWidth: 'auto',
              px: { xs: 2, sm: 3 },
              py: 1.5,
              mr: { xs: 1, sm: 2 },
              borderRadius: '10px 10px 0 0',
              transition: 'all 0.2s ease',
              '&:hover': { 
                color: '#FF6200',
                bgcolor: 'rgba(255, 98, 0, 0.05)',
              },
            }, 
            '& .Mui-selected': { 
              color: '#FF6200 !important',
            }, 
            '& .MuiTabs-indicator': { 
              backgroundColor: COLORS.PRIMARY,
              height: '3px',
              borderRadius: '3px 3px 0 0',
            } 
          }}
        >
          <Tab 
            value="POOJA" 
            label="Pooja Bookings" 
            icon={<SelfImprovementIcon sx={{ fontSize: 20 }} />} 
            iconPosition="start" 
          />
          <Tab 
            value="ASTROLOGY" 
            label="Astrologer Bookings" 
            icon={<AutoAwesomeIcon sx={{ fontSize: 18 }} />} 
            iconPosition="start" 
          />
        </Tabs>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          border: '1.5px solid #EFE6D5',
          boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
          overflow: 'hidden',
          bgcolor: '#FFFFFF',
        }}
      >
        {/* Status Tabs Section */}
        <Box sx={{ borderBottom: '1px solid #EFE6D5', bgcolor: '#FFFBF7' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              px: { xs: 1, sm: 2 }, 
              '& .MuiTab-root': { 
                fontFamily: FONTS.OUTFIT, 
                fontWeight: 600, 
                textTransform: 'none', 
                fontSize: { xs: '13px', sm: '14px' }, 
                color: '#7C6A60',
                minWidth: 'auto',
                px: { xs: 2, sm: 2.5 },
                py: { xs: 1.8, sm: 2.2 }
              }, 
              '& .Mui-selected': { 
                color: '#FF6200 !important',
                fontWeight: 700,
              }, 
              '& .MuiTabs-indicator': { 
                backgroundColor: COLORS.PRIMARY,
                height: '3px',
              } 
            }}
          >
            {currentTabsList.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Desktop View (Table) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer>
            {bookingType === 'ASTROLOGY' ? (
              /* ASTROLOGY BOOKINGS TABLE */
              <Table sx={{ minWidth: 800 }}>
                <TableHead sx={{ bgcolor: '#FAF4EE' }}>
                  <TableRow>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Booking ID</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Astrologer</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Booking Date</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Amount</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <CircularProgress size={32} sx={{ color: COLORS.PRIMARY }} />
                        <Typography sx={{ mt: 1.5, fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>
                          Loading bookings...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8, fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>
                        No astrology bookings found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((row) => {
                      const amt = row.finalAmount ?? row.servicePrice ?? row.finalamount;
                      const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
                      const astro = row.astrologer;
                      const astroName = astro ? `${astro.firstName || ''} ${astro.lastName || ''}`.trim() : 'Astrologer';
                      const statusStyle = getStatusColor(row.status);
                      const statusLabel = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending';

                      return (
                        <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', borderBottom: '1px solid #F5ECE3' }}>
                            B-{row.id}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', borderBottom: '1px solid #F5ECE3' }}>
                            {astroName}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, color: '#5C4A40', borderBottom: '1px solid #F5ECE3' }}>
                            {row.scheduledAt ? formatScheduledDateTime(row.scheduledAt) : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', borderBottom: '1px solid #F5ECE3' }}>
                            {displayAmt}
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #F5ECE3' }}>
                            <Chip 
                              label={statusLabel} 
                              size="small" 
                              sx={{ 
                                fontWeight: 700, 
                                fontFamily: FONTS.OUTFIT,
                                fontSize: '12px',
                                bgcolor: statusStyle.bg,
                                color: statusStyle.text,
                                border: `1px solid ${statusStyle.border || statusStyle.text}25`,
                                borderRadius: '20px',
                                px: 0.5,
                              }} 
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ borderBottom: '1px solid #F5ECE3' }}>
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleViewDetails(row.id)}
                                size="small"
                                sx={{
                                  color: COLORS.PRIMARY,
                                  bgcolor: '#FFF0E6',
                                  border: '1px solid #FFD4BC',
                                  borderRadius: '10px',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    bgcolor: '#FFE4D4',
                                    borderColor: COLORS.PRIMARY,
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            ) : (
              /* POOJA BOOKINGS TABLE */
              <Table sx={{ minWidth: 800 }}>
                <TableHead sx={{ bgcolor: '#FAF4EE' }}>
                  <TableRow>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Booking ID</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Service</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Booking Date</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Amount</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#64534A', fontSize: '12px', textTransform: 'uppercase', py: 2 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <CircularProgress size={32} sx={{ color: COLORS.PRIMARY }} />
                        <Typography sx={{ mt: 1.5, fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>
                          Loading bookings...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8, fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((row) => {
                      const amt = row.finalAmount ?? row.finalamount;
                      const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
                      const statusStyle = getStatusColor(row.status);
                      const statusLabel = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending';
                      const serviceTitle =
                        row.service?.name ||
                        row.serviceName ||
                        row.service?.title ||
                        row.serviceTitle ||
                        row.poojaName ||
                        row.pooja?.name ||
                        row.title ||
                        'Pooja Service';
                      
                      return (
                        <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', borderBottom: '1px solid #F5ECE3' }}>
                            B-{row.id}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', borderBottom: '1px solid #F5ECE3' }}>
                            {serviceTitle}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, color: '#5C4A40', borderBottom: '1px solid #F5ECE3' }}>
                            {row.scheduledAt ? formatScheduledDateTime(row.scheduledAt) : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', borderBottom: '1px solid #F5ECE3' }}>
                            {displayAmt}
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #F5ECE3' }}>
                            <Chip 
                              label={statusLabel} 
                              size="small" 
                              sx={{ 
                                fontWeight: 700, 
                                fontFamily: FONTS.OUTFIT,
                                fontSize: '12px',
                                bgcolor: statusStyle.bg,
                                color: statusStyle.text,
                                border: `1px solid ${statusStyle.border || statusStyle.text}25`,
                                borderRadius: '20px',
                                px: 0.5,
                              }} 
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ borderBottom: '1px solid #F5ECE3' }}>
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleViewDetails(row.id)}
                                size="small"
                                sx={{
                                  color: COLORS.PRIMARY,
                                  bgcolor: '#FFF0E6',
                                  border: '1px solid #FFD4BC',
                                  borderRadius: '10px',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    bgcolor: '#FFE4D4',
                                    borderColor: COLORS.PRIMARY,
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          {totalBookings > 0 && (
            <AppTablePagination
              count={totalBookings}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newLimit) => {
                setRowsPerPage(newLimit);
                setPage(0);
              }}
              itemName={bookingType === 'ASTROLOGY' ? 'consultations' : 'bookings'}
            />
          )}
        </Box>
      </Paper>

      {/* Mobile View (Cards) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, mt: 3 }}>
        {loading ? (
          <Paper sx={{ p: 4, borderRadius: '20px', textAlign: 'center', bgcolor: '#FFFBF7', border: '1.5px solid #EFE6D5' }}>
            <CircularProgress size={32} sx={{ color: COLORS.PRIMARY }} />
            <Typography sx={{ mt: 1.5, fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>
              Loading bookings...
            </Typography>
          </Paper>
        ) : bookings.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: '20px', textAlign: 'center', bgcolor: '#FFFBF7', border: '1.5px dashed #FFD4BC' }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '15px', fontWeight: 600 }}>
              No {bookingType === 'ASTROLOGY' ? 'astrology' : 'pooja'} bookings found.
            </Typography>
          </Paper>
        ) : bookingType === 'ASTROLOGY' ? (
          /* ASTROLOGY MOBILE CARDS */
          bookings.map((row) => {
            const statusLabel = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending';
            const amt = row.finalAmount ?? row.servicePrice ?? row.finalamount;
            const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
            const astro = row.astrologer;
            const astroName = astro ? `${astro.firstName || ''} ${astro.lastName || ''}`.trim() : 'Astrologer';
            const statusStyle = getStatusColor(row.status);

            return (
              <Card
                key={row.id}
                variant="outlined"
                sx={{
                  borderRadius: '20px',
                  p: { xs: 2, sm: 2.5 },
                  bgcolor: '#FFFFFF',
                  borderColor: '#EFE6D5',
                  borderWidth: '1.5px',
                  boxShadow: '0 4px 14px rgba(44, 24, 16, 0.04)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#FFD4BC',
                    boxShadow: '0 6px 20px rgba(44, 24, 16, 0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '1.05rem', lineHeight: 1.3 }}>
                      {astroName}
                    </Typography>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '13px', mt: 0.3 }}>
                      Booking ID: <span style={{ fontWeight: 700, color: '#2C1810' }}>B-{row.id}</span>
                    </Typography>
                  </Box>
                  <Chip 
                    label={statusLabel} 
                    size="small" 
                    sx={{ 
                      fontWeight: 700, 
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '11px',
                      height: '24px',
                      bgcolor: statusStyle.bg,
                      color: statusStyle.text,
                      border: `1px solid ${statusStyle.border || statusStyle.text}25`,
                      borderRadius: '20px',
                      flexShrink: 0,
                    }} 
                  />
                </Box>

                <Divider sx={{ my: 1.5, borderColor: '#F5ECE3' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <EventIcon sx={{ color: '#FF6200', fontSize: 16 }} />
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px', color: '#7C6A60', fontWeight: 600 }}>Booking Date:</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px', fontWeight: 600, color: '#2C1810' }}>
                    {row.scheduledAt ? formatScheduledDateTime(row.scheduledAt) : 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <AccountBalanceWalletIcon sx={{ color: '#FF6200', fontSize: 16 }} />
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px', color: '#7C6A60', fontWeight: 600 }}>Amount:</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '14px', fontWeight: 800, color: '#2C1810' }}>
                    {displayAmt}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  onClick={() => handleViewDetails(row.id)}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: '16px' }} />}
                  sx={{
                    color: COLORS.PRIMARY,
                    bgcolor: '#FFF0E6',
                    border: '1px solid #FFD4BC',
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: '13px',
                    textTransform: 'none',
                    py: 0.85,
                    borderRadius: '12px',
                    mt: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#FFE4D4',
                      borderColor: COLORS.PRIMARY,
                    },
                  }}
                >
                  View Booking Details
                </Button>
              </Card>
            );
          })
        ) : (
          /* POOJA MOBILE CARDS */
          bookings.map((row) => {
            const statusLabel = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending';
            const amt = row.finalAmount ?? row.finalamount;
            const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
            const statusStyle = getStatusColor(row.status);
            
            return (
              <Card
                key={row.id}
                variant="outlined"
                sx={{
                  borderRadius: '20px',
                  p: { xs: 2, sm: 2.5 },
                  bgcolor: '#FFFFFF',
                  borderColor: '#EFE6D5',
                  borderWidth: '1.5px',
                  boxShadow: '0 4px 14px rgba(44, 24, 16, 0.04)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#FFD4BC',
                    boxShadow: '0 6px 20px rgba(44, 24, 16, 0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '1.05rem', lineHeight: 1.3 }}>
                      {row.service?.name ||
                       row.serviceName ||
                       row.service?.title ||
                       row.serviceTitle ||
                       row.poojaName ||
                       row.pooja?.name ||
                       row.title ||
                       'Pooja Service'}
                    </Typography>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '13px', mt: 0.3 }}>
                      Booking ID: <span style={{ fontWeight: 700, color: '#2C1810' }}>B-{row.id}</span>
                    </Typography>
                  </Box>
                  <Chip 
                    label={statusLabel} 
                    size="small" 
                    sx={{ 
                      fontWeight: 700, 
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '11px',
                      height: '24px',
                      bgcolor: statusStyle.bg,
                      color: statusStyle.text,
                      border: `1px solid ${statusStyle.border || statusStyle.text}25`,
                      borderRadius: '20px',
                      flexShrink: 0,
                    }} 
                  />
                </Box>

                <Divider sx={{ my: 1.5, borderColor: '#F5ECE3' }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <EventIcon sx={{ color: '#FF6200', fontSize: 16 }} />
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px', color: '#7C6A60', fontWeight: 600 }}>Booking Date:</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px', fontWeight: 600, color: '#2C1810' }}>
                    {row.scheduledAt ? formatScheduledDateTime(row.scheduledAt) : 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <AccountBalanceWalletIcon sx={{ color: '#FF6200', fontSize: 16 }} />
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px', color: '#7C6A60', fontWeight: 600 }}>Amount:</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '14px', fontWeight: 800, color: '#2C1810' }}>
                    {displayAmt}
                  </Typography>
                </Box>
                
                <Button
                  fullWidth
                  onClick={() => handleViewDetails(row.id)}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: '16px' }} />}
                  sx={{
                    color: COLORS.PRIMARY,
                    bgcolor: '#FFF0E6',
                    border: '1px solid #FFD4BC',
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: '13px',
                    textTransform: 'none',
                    py: 0.85,
                    borderRadius: '12px',
                    mt: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#FFE4D4',
                      borderColor: COLORS.PRIMARY,
                    },
                  }}
                >
                  View Booking Details
                </Button>
              </Card>
            );
          })
        )}
        
        {/* Mobile Pagination */}
        {totalBookings > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
            <Pagination 
              count={Math.ceil(totalBookings / rowsPerPage)} 
              page={page + 1} 
              onChange={(e, p) => setPage(p - 1)} 
              color="primary"
              size="medium"
              sx={{ 
                '& .MuiPaginationItem-root': { fontFamily: FONTS.OUTFIT, fontWeight: 600 },
                '& .Mui-selected': { bgcolor: '#FF6200 !important', color: 'white', '&:hover': { bgcolor: '#E65800 !important' } }
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

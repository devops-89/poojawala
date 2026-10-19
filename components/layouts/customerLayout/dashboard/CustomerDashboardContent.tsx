'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
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
  TablePagination, 
  Pagination 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getCustomerBookingsAPI } from '@/api/bookingControllers';
import { useLoaderStore } from '@/stores/loaderStore';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useSocketStore } from '@/stores/socketStore';

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return { bg: '#d1fae5', text: '#059669' };
    case 'ACCEPTED': return { bg: '#dbeafe', text: '#2563eb' };
    case 'PENDING': return { bg: '#fef3c7', text: '#d97706' };
    case 'CANCELLED': return { bg: '#fee2e2', text: '#ef4444' };
    case 'ENROUTE': return { bg: '#e0e7ff', text: '#4f46e5' };
    case 'ARRIVED': return { bg: '#fce7f3', text: '#db2777' };
    case 'ONGOING': return { bg: '#e0f2fe', text: '#0284c7' };
    default: return { bg: '#f1f5f9', text: '#64748b' };
  }
};

const POOJA_TABS = ['All Bookings', 'Pending', 'Accepted', 'Enroute', 'Arrived', 'Ongoing', 'Completed', 'Cancelled'];
const ASTROLOGY_TABS = ['All Bookings', 'Accepted', 'Completed', 'Cancelled'];

export default function CustomerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [bookingType, setBookingType] = useState<'POOJA' | 'ASTROLOGY'>(() => {
    const typeFromParam = searchParams.get('type')?.toUpperCase();
    if (typeFromParam === 'ASTROLOGY' || typeFromParam === 'POOJA') {
      return typeFromParam as 'POOJA' | 'ASTROLOGY';
    }
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('customer_bookings_type');
      if (saved === 'ASTROLOGY' || saved === 'POOJA') {
        return saved as 'POOJA' | 'ASTROLOGY';
      }
    }
    return 'POOJA';
  });

  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { showLoader, hideLoader } = useLoaderStore();
  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const currentTabsList = bookingType === 'ASTROLOGY' ? ASTROLOGY_TABS : POOJA_TABS;

  // Sync state with URL / sessionStorage
  useEffect(() => {
    const typeParam = searchParams.get('type')?.toUpperCase();
    if (typeParam === 'ASTROLOGY' || typeParam === 'POOJA') {
      if (typeParam !== bookingType) {
        setBookingType(typeParam as 'POOJA' | 'ASTROLOGY');
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('customer_bookings_type', typeParam);
      }
    } else if (typeof window !== 'undefined') {
      const savedType = sessionStorage.getItem('customer_bookings_type');
      if (savedType === 'ASTROLOGY' || savedType === 'POOJA') {
        if (savedType !== bookingType) {
          setBookingType(savedType as 'POOJA' | 'ASTROLOGY');
        }
        const params = new URLSearchParams(window.location.search);
        params.set('type', savedType);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [searchParams, pathname, router, bookingType]);

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

  useEffect(() => {
    const fetchBookings = async () => {
      showLoader('Loading bookings...');
      try {
        const activeTabs = bookingType === 'ASTROLOGY' ? ASTROLOGY_TABS : POOJA_TABS;
        const currentStatus = tabValue === 0 ? undefined : activeTabs[tabValue];
        const res = await getCustomerBookingsAPI(currentStatus, page + 1, rowsPerPage, bookingType);
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
        console.error(error);
        showSnackbar('Failed to fetch bookings', 'error');
        setBookings([]);
        setTotalBookings(0);
      } finally {
        hideLoader();
      }
    };
    fetchBookings();
  }, [page, rowsPerPage, tabValue, bookingType, refreshTrigger]);

  const handleBookingTypeChange = (event: React.SyntheticEvent, newValue: 'POOJA' | 'ASTROLOGY') => {
    if (newValue) {
      setBookingType(newValue);
      setTabValue(0);
      setPage(0);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('customer_bookings_type', newValue);
        const params = new URLSearchParams(window.location.search);
        params.set('type', newValue);
        params.delete('status');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
    if (typeof window !== 'undefined') {
      const activeTabs = bookingType === 'ASTROLOGY' ? ASTROLOGY_TABS : POOJA_TABS;
      const tabName = activeTabs[newValue];
      const params = new URLSearchParams(window.location.search);
      params.set('type', bookingType);
      if (newValue === 0) {
        params.delete('status');
      } else {
        params.set('status', tabName);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <Box>
      <Typography variant="h4" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
        My Bookings
      </Typography>
      <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', mb: 3 }}>
        Manage all your service bookings.
      </Typography>

      {/* Booking Type Navigation Tabs */}
      <Box sx={{ borderBottom: '1px solid #e2e8f0', mb: 3 }}>
        <Tabs 
          value={bookingType} 
          onChange={handleBookingTypeChange}
          sx={{ 
            minHeight: '48px',
            '& .MuiTab-root': { 
              fontFamily: FONTS.PRIMARY, 
              fontWeight: 700, 
              textTransform: 'none', 
              fontSize: '15px', 
              color: '#64748b',
              minWidth: 'auto',
              px: { xs: 2, sm: 3 },
              py: 1.5,
              mr: { xs: 1, sm: 2 },
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s ease',
              '&:hover': { 
                color: '#FF6200',
                bgcolor: 'rgba(255, 98, 0, 0.04)',
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

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Status Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              px: 2, 
              '& .MuiTab-root': { 
                fontFamily: FONTS.PRIMARY, 
                fontWeight: 600, 
                textTransform: 'none', 
                fontSize: '14px', 
                color: '#64748b',
                minWidth: 'auto',
                px: 3,
                py: 2.5
              }, 
              '& .Mui-selected': { color: '#FF6200 !important' }, 
              '& .MuiTabs-indicator': { backgroundColor: COLORS.PRIMARY } 
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
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Booking ID</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Astrologer</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Booking Date</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Amount</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8, fontFamily: FONTS.PRIMARY, color: '#64748b' }}>
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

                      return (
                        <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#1e293b' }}>
                            B-{row.id}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.PRIMARY, color: '#334155' }}>
                            {astroName}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.PRIMARY, color: '#475569' }}>
                            {row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#1e293b' }}>
                            {displayAmt}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending'} 
                              size="small" 
                              sx={{ 
                                fontWeight: 600, 
                                fontFamily: FONTS.PRIMARY,
                                fontSize: '12px',
                                bgcolor: statusStyle.bg,
                                color: statusStyle.text
                              }} 
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton onClick={() => handleViewDetails(row.id)} size="small" sx={{ color: COLORS.PRIMARY, bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
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
              /* POOJA BOOKINGS TABLE (UNCHANGED) */
              <Table sx={{ minWidth: 800 }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Booking ID</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Service</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Booking Date</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Amount</TableCell>
                    <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8, fontFamily: FONTS.PRIMARY, color: '#64748b' }}>
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((row) => {
                      const amt = row.finalAmount ?? row.finalamount;
                      const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
                      
                      return (
                        <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#1e293b' }}>B-{row.id}</TableCell>
                          <TableCell sx={{ fontFamily: FONTS.PRIMARY, color: '#334155' }}>{row.service?.name || 'Puja Service'}</TableCell>
                          <TableCell sx={{ fontFamily: FONTS.PRIMARY, color: '#475569' }}>
                            {row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#1e293b' }}>{displayAmt}</TableCell>
                          <TableCell>
                            {(() => {
                              const statusStyle = getStatusColor(row.status);
                              return (
                                <Chip 
                                  label={row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending'} 
                                  size="small" 
                                  sx={{ 
                                    fontWeight: 600, 
                                    fontFamily: FONTS.PRIMARY,
                                    fontSize: '12px',
                                    bgcolor: statusStyle.bg,
                                    color: statusStyle.text
                                  }} 
                                />
                              );
                            })()}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton onClick={() => handleViewDetails(row.id)} size="small" sx={{ color: COLORS.PRIMARY, bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
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
            <TablePagination
              component="div"
              count={totalBookings}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              slotProps={{
                select: {
                  MenuProps: {
                    variant: "menu",
                    anchorOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    disableScrollLock: true,
                  },
                },
              }}
              sx={{
                borderTop: '1px solid #e2e8f0',
                '& .MuiTablePagination-toolbar': { minHeight: '60px' },
                fontFamily: FONTS.PRIMARY,
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Mobile View (Cards) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, mt: 3 }}>
        {bookings.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: '12px', textAlign: 'center', bgcolor: '#FFF', border: '1px dashed #ccc' }}>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#666', fontSize: '16px', fontWeight: 600 }}>
              No {bookingType === 'ASTROLOGY' ? 'astrology' : 'puja'} bookings found.
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
              <Card key={row.id} variant="outlined" sx={{ borderRadius: '16px', p: 2, bgcolor: 'white', borderColor: '#e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                    {astroName}
                  </Typography>
                  <Chip 
                    label={statusLabel} 
                    size="small" 
                    sx={{ 
                      fontWeight: 700, 
                      fontFamily: FONTS.PRIMARY,
                      fontSize: '11px',
                      height: '22px',
                      bgcolor: statusStyle.bg,
                      color: statusStyle.text
                    }} 
                  />
                </Box>

                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px', mb: 1.5 }}>
                  Booking ID: <span style={{ fontWeight: 600, color: '#1e293b' }}>B-{row.id}</span>
                </Typography>
                
                <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventIcon sx={{ color: '#2E7D32', fontSize: 16 }} />
                    <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Booking Date:</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                    {row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccountBalanceWalletIcon sx={{ color: '#2E7D32', fontSize: 16 }} />
                    <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Amount:</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#333' }}>
                    {displayAmt}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewDetails(row.id)} size="small" sx={{ color: COLORS.PRIMARY, bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            );
          })
        ) : (
          /* POOJA MOBILE CARDS (UNCHANGED) */
          bookings.map((row) => {
            const statusLabel = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending';
            const amt = row.finalAmount ?? row.finalamount;
            const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
            
            return (
              <Card key={row.id} variant="outlined" sx={{ borderRadius: '16px', p: 2, bgcolor: 'white', borderColor: '#e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                    {row.service?.name || 'Puja Service'}
                  </Typography>
                  {(() => {
                    const statusStyle = getStatusColor(row.status);
                    return (
                      <Chip 
                        label={statusLabel} 
                        size="small" 
                        sx={{ 
                          fontWeight: 700, 
                          fontFamily: FONTS.PRIMARY,
                          fontSize: '11px',
                          height: '22px',
                          bgcolor: statusStyle.bg,
                          color: statusStyle.text
                        }} 
                      />
                    );
                  })()}
                </Box>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px', mb: 1.5 }}>
                  Booking ID: <span style={{ fontWeight: 600, color: '#1e293b' }}>B-{row.id}</span>
                </Typography>
                
                <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventIcon sx={{ color: '#2E7D32', fontSize: 16 }} />
                    <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Booking Date:</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                    {row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccountBalanceWalletIcon sx={{ color: '#2E7D32', fontSize: 16 }} />
                    <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Amount:</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#333' }}>
                    {displayAmt}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewDetails(row.id)} size="small" sx={{ color: COLORS.PRIMARY, bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
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
                '& .MuiPaginationItem-root': { fontFamily: FONTS.PRIMARY, fontWeight: 600 },
                '& .Mui-selected': { bgcolor: '#FF6200 !important', color: 'white', '&:hover': { bgcolor: '#E65800 !important' } }
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Card, Divider, Tabs, Tab, IconButton, Tooltip, TablePagination, Pagination } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useRouter } from 'next/navigation';
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

export default function CustomerDashboardContent() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();
  const { showLoader, hideLoader } = useLoaderStore();
  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const tabsList = ['All Bookings', 'Pending', 'Accepted', 'Enroute', 'Arrived', 'Ongoing', 'Completed', 'Cancelled'];

  useEffect(() => {
    const fetchBookings = async () => {
      showLoader('Loading bookings...');
      try {
        const currentStatus = tabValue === 0 ? undefined : tabsList[tabValue];
        const res = await getCustomerBookingsAPI(currentStatus, page + 1, rowsPerPage);
        if (res.success && res.data?.bookings) {
          setBookings(res.data.bookings);
          setTotalBookings(res.data.pagination?.total || res.data.bookings.length);
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
  }, [page, rowsPerPage, tabValue, refreshTrigger]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
        My Bookings
      </Typography>
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', mb: 4 }}>
        Manage all your service bookings.
      </Typography>

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              px: 2, 
              '& .MuiTab-root': { 
                fontFamily: '"DM Sans", sans-serif', 
                fontWeight: 600, 
                textTransform: 'none', 
                fontSize: '14px', 
                color: '#64748b',
                minWidth: 'auto',
                px: 3,
                py: 2.5
              }, 
              '& .Mui-selected': { color: '#FF6200 !important' }, 
              '& .MuiTabs-indicator': { backgroundColor: '#FF6200' } 
            }}
          >
            {tabsList.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Desktop View (Table) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Booking ID</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Service</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Booking Date</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Amount</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8, fontFamily: '"DM Sans", sans-serif', color: '#64748b' }}>
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((row) => {
                    const amt = row.finalAmount ?? row.finalamount;
                    const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
                    
                    return (
                      <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1e293b' }}>B-{row.id}</TableCell>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', color: '#334155' }}>{row.service?.name || 'Puja Service'}</TableCell>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', color: '#475569' }}>
                          {row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1e293b' }}>{displayAmt}</TableCell>
                        <TableCell>
                          {(() => {
                            const statusStyle = getStatusColor(row.status);
                            return (
                              <Chip 
                                label={row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending'} 
                                size="small" 
                                sx={{ 
                                  fontWeight: 600, 
                                  fontFamily: '"DM Sans", sans-serif',
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
                            <IconButton onClick={() => router.push(`/customer/bookings/${row.id}`)} size="small" sx={{ color: '#FF6200', bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
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
          </TableContainer>
          {totalBookings > 0 && (
            <TablePagination
              component="div"
              count={totalBookings}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: '1px solid #e2e8f0',
                '& .MuiTablePagination-toolbar': { minHeight: '60px' },
                fontFamily: '"DM Sans", sans-serif',
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Mobile View (Cards) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, mt: 3 }}>
        {bookings.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: '12px', textAlign: 'center', bgcolor: '#FFF', border: '1px dashed #ccc' }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '16px', fontWeight: 600 }}>
              No bookings found.
            </Typography>
          </Paper>
        ) : (
          bookings.map((row) => {
            const statusStr = row.status?.toUpperCase() || 'PENDING';
            const statusLabel = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending';
            const amt = row.finalAmount ?? row.finalamount;
            const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
            
            return (
              <Card key={row.id} variant="outlined" sx={{ borderRadius: '16px', p: 2, bgcolor: 'white', borderColor: '#e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
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
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '11px',
                        height: '22px',
                        bgcolor: statusStyle.bg,
                        color: statusStyle.text
                      }} 
                    />
                    );
                  })()}
                </Box>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px', mb: 1.5 }}>
                  Booking ID: <span style={{ fontWeight: 600, color: '#1e293b' }}>B-{row.id}</span>
                </Typography>
                
                <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventIcon sx={{ color: '#2E7D32', fontSize: 16 }} />
                    <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Date:</Typography>
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
                    <IconButton onClick={() => router.push(`/customer/bookings/${row.id}`)} size="small" sx={{ color: '#FF6200', bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
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
                '& .MuiPaginationItem-root': { fontFamily: '"DM Sans", sans-serif', fontWeight: 600 },
                '& .Mui-selected': { bgcolor: '#FF6200 !important', color: 'white', '&:hover': { bgcolor: '#E65800 !important' } }
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Button, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, TablePagination, CircularProgress, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAllBookingsByAdminAPI, updateBookingStatusAPI, assignBookingAPI } from '@/api/bookingControllers';
import { getPurohitsAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

const STATUS_TABS = [
  { id: 'All Bookings', label: 'All Bookings' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'ACCEPTED', label: 'Accepted' },
  { id: 'ENROUTE', label: 'Enroute' },
  { id: 'ARRIVED', label: 'Arrived' },
  { id: 'ONGOING', label: 'Ongoing' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminBookingsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All Bookings';

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [focused, setFocused] = useState(false);
  
  const [assignTarget, setAssignTarget] = useState<string | number | null>(null);
  const [selectedPurohit, setSelectedPurohit] = useState<string | number>('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{ id: string | number, status: string } | null>(null);
  const [purohitsList, setPurohitsList] = useState<any[]>([]);
  const { showSnackbar } = useSnackbarStore();

  const handleOpenAssignModal = async (bookingId: string | number) => {
    setAssignTarget(bookingId);
    try {
      const res = await getPurohitsAPI(1, 100, undefined, 'APPROVED');
      if (res.success) {
        setPurohitsList(res.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch purohits:", error);
      showSnackbar("Failed to fetch purohits", "error");
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await getAllBookingsByAdminAPI(page + 1, rowsPerPage, statusFilter, searchValue);
      if (res.success) {
        setBookings(res.data.bookings || []);
        setTotalBookings(res.data.pagination?.total || res.data.total || 0); 
      } else {
        showSnackbar(res.message || 'Failed to fetch bookings', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error fetching bookings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage, statusFilter, searchValue]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
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

  const handleStatusChangeClick = (id: string | number, newStatus: string) => {
    setConfirmStatusChange({ id, status: newStatus });
  };

  const confirmUpdateStatus = async () => {
    if (!confirmStatusChange) return;
    try {
      setIsLoading(true);
      const res = await updateBookingStatusAPI(confirmStatusChange.id, confirmStatusChange.status);
      if (res.success) {
        showSnackbar('Booking status updated successfully', 'success');
        setConfirmStatusChange(null);
        fetchBookings();
      } else {
        showSnackbar(res.message || 'Failed to update status', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error updating status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignPurohit = async () => {
    if (assignTarget && selectedPurohit) {
      try {
        setIsLoading(true);
        const res = await assignBookingAPI(assignTarget, selectedPurohit);
        if (res.success) {
          showSnackbar('Purohit assigned successfully', 'success');
          setAssignTarget(null);
          setSelectedPurohit('');
          fetchBookings();
        } else {
          showSnackbar(res.message || 'Failed to assign purohit', 'error');
        }
      } catch (error: any) {
        showSnackbar(error.response?.data?.message || 'Error assigning purohit', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Bookings
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
            Manage all service bookings
          </Typography>
        </Box>
        <Button
          component={NextLink}
          href="/admin/bookings/add"
          variant="outlined"
          sx={{
            color: '#1e293b',
            borderColor: '#cbd5e1',
            bgcolor: 'white',
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            py: 1,
            px: 3,
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
            alignSelf: { xs: 'flex-start', sm: 'auto' }
          }}
          startIcon={<AddIcon />}
        >
          Add Booking
        </Button>
      </Box>

      {/* Filters and Tabs */}
      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white', overflow: 'hidden' }}>
        <Tabs 
          value={statusFilter} 
          onChange={(_, val) => setStatusFilter(val)}
          sx={{ 
            px: 2, pt: 1, borderBottom: '1px solid #e2e8f0',
            '& .MuiTabs-indicator': { backgroundColor: '#FF6200' },
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: '#64748b', minWidth: 100, fontFamily: 'var(--font-outfit), sans-serif' },
            '& .MuiTab-root.Mui-selected': { color: '#FF6200' },
          }}
        >
          {STATUS_TABS.map(tab => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>

        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>BOOKING ID</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>CUSTOMER DETAILS</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>SERVICE</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>PUROHIT</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>BOOKING DATE</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>AMOUNT</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>STATUS</TableCell>
                <TableCell align="center" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress sx={{ color: '#FF6200' }} />
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif' }}>No bookings found matching your criteria.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => {
                  const statusStyle = getStatusColor(booking.status || 'PENDING');
                  const customerName = booking.customer?.firstName ? `${booking.customer.firstName} ${booking.customer.lastName || ''}` : 'Unknown';
                  const technicianName = booking.purohit?.user?.firstName ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ''}` : 'Unassigned';
                  const amount = booking.finalAmount ? `₹${booking.finalAmount}` : '-';
                  const dateObj = booking.scheduledAt || booking.createdAt;
                  const date = dateObj ? new Date(dateObj).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : '-';
                  
                  return (
                    <TableRow key={booking.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#FF6200', fontFamily: 'var(--font-outfit), sans-serif' }}>
                          B-{booking.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif' }}>
                          {customerName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.8rem' }}>
                          {booking.customer?.phone || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 500 }}>
                          {booking.service?.name || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {technicianName === 'Unassigned' ? (
                          <Typography sx={{ color: '#f59e0b', fontStyle: 'italic', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                            Unassigned
                          </Typography>
                        ) : (
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif' }}>
                              {technicianName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.8rem' }}>
                              {booking.purohit?.user?.phone || '-'}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                          {date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif' }}>
                          {amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {booking.status === 'PENDING' ? (
                          <Select
                            size="small"
                            value={booking.status}
                            onChange={(e) => handleStatusChangeClick(booking.id, e.target.value)}
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.text,
                              fontWeight: 700,
                              fontFamily: 'var(--font-outfit), sans-serif',
                              borderRadius: '6px',
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '& .MuiSelect-select': { py: 0.5, px: 1.5 },
                              '& .MuiSvgIcon-root': { color: statusStyle.text }
                            }}
                          >
                            <MenuItem value="PENDING" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>Pending</MenuItem>
                            <MenuItem value="CANCELLED" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>Cancel Booking</MenuItem>
                          </Select>
                        ) : (
                          <Box sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.text,
                            fontWeight: 700,
                            fontFamily: 'var(--font-outfit), sans-serif',
                            borderRadius: '6px',
                            py: 0.5,
                            px: 1.5,
                            display: 'inline-block',
                            fontSize: '0.875rem'
                          }}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).toLowerCase()}
                          </Box>
                        )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton component={NextLink} href={`/admin/bookings/${booking.id}`} sx={{ color: '#FF6200', bgcolor: '#fff7ed', '&:hover': { color: '#E65800', bgcolor: '#ffedd5' } }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {technicianName === 'Unassigned' && (
                          <IconButton onClick={() => handleOpenAssignModal(booking.id)} sx={{ color: '#f59e0b', bgcolor: '#fef3c7', '&:hover': { color: '#d97706', bgcolor: '#fde68a' } }}>
                            <PersonAddIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalBookings || bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: '1px solid #e2e8f0', '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontFamily: 'var(--font-outfit), sans-serif' } }}
        />
      </Paper>

      {/* Assign Purohit Modal */}
      <Dialog open={Boolean(assignTarget)} onClose={() => setAssignTarget(null)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1, minWidth: 400 } }}>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>Assign Purohit</DialogTitle>
        <DialogContent sx={{ mt: 1, overflow: 'visible' }}>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <Autocomplete
              options={purohitsList.filter((u: any) => {
                const purohitId = u.purohitProfile?.id || u.profile?.id || u.purohit?.id;
                if (!purohitId) return false;
                
                const selectedBooking = assignTarget ? bookings.find(b => b.id === assignTarget) : null;
                const selectedServiceId = selectedBooking?.service?.id || selectedBooking?.serviceId;
                
                if (selectedServiceId) {
                  const services = u.purohitProfile?.purohitServices || u.profile?.purohitServices || u.purohit?.purohitServices || [];
                  const hasService = services.some((s: any) => s.serviceId === selectedServiceId || s.service?.id === selectedServiceId);
                  if (!hasService) return false;
                }
                return true;
              })}
              getOptionLabel={(u: any) => {
                const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username;
                return `${name} (${u.profile?.city || u.purohitProfile?.city || 'N/A'})`;
              }}
              value={purohitsList.find((u: any) => (u.purohitProfile?.id || u.profile?.id || u.purohit?.id) === selectedPurohit) || null}
              onChange={(_, newValue) => {
                setSelectedPurohit(newValue ? (newValue.purohitProfile?.id || newValue.profile?.id || newValue.purohit?.id) : '');
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select Purohit" 
                  variant="outlined"
                  placeholder="Search purohit by name, email or phone"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                    '& label.Mui-focused': { color: '#FF6200' },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6200' }
                  }}
                />
              )}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setAssignTarget(null)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}>Cancel</Button>
            <Button 
              onClick={(e) => {
                if (!selectedPurohit || isLoading) {
                  e.preventDefault();
                  return;
                }
                handleAssignPurohit();
              }} 
              variant="contained" 
              sx={{
                background: '#FF6200 !important',
                color: '#ffffff !important',
                opacity: (!selectedPurohit || isLoading) ? '0.5 !important' : '1 !important',
                cursor: (!selectedPurohit || isLoading) ? 'not-allowed !important' : 'pointer !important',
                textTransform: 'none', 
                borderRadius: '8px', 
                fontWeight: 600, 
                fontFamily: 'var(--font-outfit), sans-serif', 
                boxShadow: 'none',
                '&:hover': {
                  background: '#E65800 !important',
                  boxShadow: 'none !important'
                }
              }}
            >
            Assign & Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Status Change Modal */}
      <Dialog open={Boolean(confirmStatusChange)} onClose={() => setConfirmStatusChange(null)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1, minWidth: 400 } }}>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>Confirm Status Change</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1e293b' }}>
            Are you sure you want to change the status of this booking to <strong>{confirmStatusChange?.status}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setConfirmStatusChange(null)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', borderRadius: '30px', px: 3, py: 1 }}>Cancel</Button>
          <Button onClick={confirmUpdateStatus} disabled={isLoading} variant="contained" sx={{ textTransform: 'none', borderRadius: '30px', px: 4, py: 1, fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', boxShadow: 'none', background: '#FF6200', color: 'white', '&:hover': { background: '#F05A00', boxShadow: 'none' } }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

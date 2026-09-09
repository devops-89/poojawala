'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, TablePagination, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NextLink from 'next/link';
import { getCompletedBookingsAPI } from '@/api/bookingControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

export default function AdminBookingSettlementsContent() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [settlements, setSettlements] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbarStore();

  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCompletedBookingsAPI(page + 1, rowsPerPage);
      if (res.success && res.data?.bookings) {
        setSettlements(res.data.bookings);
        setTotalCount(res.data.meta?.total || res.data.pagination?.total || res.data.bookings.length);
      }
    } catch (err: any) {
      console.error('Failed to fetch settlements:', err);
      showSnackbar(err.response?.data?.message || 'Failed to fetch bookings for payout', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const getStatusStyle = (status: string, type: 'booking' | 'payment' | 'payout') => {
    if (status === 'COMPLETED' || status === 'Paid' || status === 'PAID') {
      return { bg: '#d1fae5', text: '#059669' };
    }
    if (status === 'Pending' || status === 'PENDING') {
      return { bg: '#fef3c7', text: '#d97706' };
    }
    return { bg: '#f1f5f9', text: '#64748b' };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Bookings For Payout
        </Typography>
        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
          View completed bookings and process technician payouts
        </Typography>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>BOOKING ID</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>TECHNICIAN NAME</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>SERVICE NAME</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>AMOUNT</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>BOOKING STATUS</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>PAYMENT STATUS</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>PAYOUT STATUS</TableCell>
                <TableCell align="right" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#FF6200' }} />
                  </TableCell>
                </TableRow>
              ) : settlements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5, color: '#64748b' }}>
                    No completed bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                settlements.map((item: any) => {
                  const bookingStyle = getStatusStyle(item.status, 'booking');
                  const paymentStyle = getStatusStyle(item.paymentStatus, 'payment');
                  const payoutStatusValue = item.payoutStatus || item.purohitPayoutStatus || 'PENDING';
                  const payoutStyle = getStatusStyle(payoutStatusValue, 'payout');
                  
                  const technicianName = item.purohit?.user ? `${item.purohit.user.firstName} ${item.purohit.user.lastName || ''}`.trim() : (item.purohit?.firstName ? `${item.purohit.firstName} ${item.purohit.lastName || ''}`.trim() : 'Unknown');

                  return (
                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-outfit), sans-serif' }}>
                          B-{item.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif' }}>
                          {technicianName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 500 }}>
                          {item.service?.name || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif' }}>
                          ₹{item.purohitPayoutAmount || item.finalAmount || '0.00'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={item.status} size="small" sx={{ bgcolor: bookingStyle.bg, color: bookingStyle.text, fontWeight: 700, fontFamily: 'var(--font-outfit), sans-serif', borderRadius: '6px' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={item.paymentStatus || 'PENDING'} size="small" sx={{ bgcolor: paymentStyle.bg, color: paymentStyle.text, fontWeight: 700, fontFamily: 'var(--font-outfit), sans-serif', borderRadius: '6px' }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={payoutStatusValue} size="small" sx={{ bgcolor: payoutStyle.bg, color: payoutStyle.text, fontWeight: 700, fontFamily: 'var(--font-outfit), sans-serif', borderRadius: '6px' }} />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton component={NextLink} href={`/admin/bookings/${item.id}`} sx={{ color: '#10b981', bgcolor: '#f8fafc', '&:hover': { color: '#059669', bgcolor: '#d1fae5' } }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
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
          count={totalCount}
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
    </Box>
  );
}

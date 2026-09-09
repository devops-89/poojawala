'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TablePagination, Pagination, Card, Divider, Tooltip, IconButton, CircularProgress } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventIcon from '@mui/icons-material/Event';
import DownloadIcon from '@mui/icons-material/Download';
import { getMyPaymentsAPI, downloadInvoiceAPI } from '@/api/paymentControllers';
import { useLoaderStore } from '@/stores/loaderStore';
import { useSnackbarStore } from '@/stores/snackbarStore';

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
    case 'COMPLETED': return { bg: '#d1fae5', text: '#059669' };
    case 'PENDING': return { bg: '#fef3c7', text: '#d97706' };
    case 'FAILED': return { bg: '#fee2e2', text: '#ef4444' };
    default: return { bg: '#f1f5f9', text: '#64748b' };
  }
};

export default function CustomerPaymentsContent() {
  const [payments, setPayments] = useState<any[]>([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { showLoader, hideLoader } = useLoaderStore();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const fetchPayments = async () => {
      showLoader('Loading payments...');
      try {
        const res = await getMyPaymentsAPI(page + 1, rowsPerPage);
        if (res.success && res.data?.items) {
          setPayments(res.data.items);
          setTotalPayments(res.pagination?.total || res.data.pagination?.total || res.data.items.length);
        } else {
          setPayments([]);
          setTotalPayments(0);
        }
      } catch (error) {
        console.error(error);
        showSnackbar('Failed to fetch payments', 'error');
        setPayments([]);
        setTotalPayments(0);
      } finally {
        hideLoader();
      }
    };
    fetchPayments();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadInvoice = async (bookingId: number) => {
    if (!bookingId) {
      showSnackbar('Invoice not available', 'error');
      return;
    }
    try {
      setDownloadingId(bookingId);
      const blobData = await downloadInvoiceAPI(bookingId);
      
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_B-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) link.parentNode.removeChild(link);
      
      showSnackbar('Invoice downloaded successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to download invoice', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
        My Payments
      </Typography>
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', mb: 4 }}>
        View and manage your payment history.
      </Typography>

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Desktop View (Table) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Payment ID</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Type</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Booking ID</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Method</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Date</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Amount</TableCell>
                  <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8, fontFamily: '"DM Sans", sans-serif', color: '#64748b' }}>
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((row) => {
                    const amt = row.amount;
                    const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
                    const dateToShow = row.paidAt || row.createdAt;
                    
                    return (
                      <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1e293b' }}>P-{row.id}</TableCell>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', color: '#334155' }}>
                          {row.paymentType ? row.paymentType.replace(/_/g, ' ') : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', color: '#475569' }}>
                          {row.bookingId ? `B-${row.bookingId}` : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', color: '#475569' }}>
                          {row.paymentMethod || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', color: '#475569' }}>
                          {dateToShow ? new Date(dateToShow).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
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
                          {row.bookingId ? (
                            <Tooltip title="Download Invoice">
                              <IconButton onClick={() => handleDownloadInvoice(row.bookingId)} size="small" disabled={downloadingId === row.bookingId} sx={{ color: '#FF6200', bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
                                {downloadingId === row.bookingId ? <CircularProgress size={20} sx={{ color: '#FF6200' }} /> : <DownloadIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPayments > 0 && (
            <TablePagination
              component="div"
              count={totalPayments}
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
        {payments.length === 0 ? (
          <Paper sx={{ p: 4, borderRadius: '12px', textAlign: 'center', bgcolor: '#FFF', border: '1px dashed #ccc' }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '16px', fontWeight: 600 }}>
              No payments found.
            </Typography>
          </Paper>
        ) : (
          payments.map((row) => {
            const statusLabel = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending';
            const amt = row.amount;
            const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
            const dateToShow = row.paidAt || row.createdAt;
            
            return (
              <Card key={row.id} variant="outlined" sx={{ borderRadius: '16px', p: 2, bgcolor: 'white', borderColor: '#e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                    P-{row.id}
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
                  {row.paymentType ? row.paymentType.replace(/_/g, ' ') : 'N/A'}
                </Typography>
                
                <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />
                
                {row.bookingId && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Booking ID:</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                      B-{row.bookingId}
                    </Typography>
                  </Box>
                )}

                {row.paymentMethod && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Method:</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                      {row.paymentMethod}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventIcon sx={{ color: '#2E7D32', fontSize: 16 }} />
                    <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Date:</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                    {dateToShow ? new Date(dateToShow).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
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

                {row.bookingId && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                    <Tooltip title="Download Invoice">
                      <IconButton onClick={() => handleDownloadInvoice(row.bookingId)} size="small" disabled={downloadingId === row.bookingId} sx={{ color: '#FF6200', bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
                        {downloadingId === row.bookingId ? <CircularProgress size={20} sx={{ color: '#FF6200' }} /> : <DownloadIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Card>
            );
          })
        )}
        
        {/* Mobile Pagination */}
        {totalPayments > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
            <Pagination 
              count={Math.ceil(totalPayments / rowsPerPage)} 
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

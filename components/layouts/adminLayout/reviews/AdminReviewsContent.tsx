'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Rating, TablePagination, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllReviewsAPI, getReviewByBookingIdAPI, updateReviewStatusAPI, deleteReviewAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

const STATUS_TABS = [
  { id: 'All', label: 'All Reviews' },
  { id: 'Published', label: 'Published' },
  { id: 'Draft', label: 'Draft' },
];

export default function AdminReviewsContent() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  useEffect(() => {
    fetchReviews(statusFilter);
  }, [statusFilter]);

  const fetchReviews = async (status: string) => {
    try {
      setLoading(true);
      const response = await getAllReviewsAPI(status);
      if (response?.success && response?.data?.data) {
        setReviews(response.data.data.map((r: any) => ({
          ...r,
          id: `B-${r.bookingId}`,
          bookingId: r.bookingId,
          customer: r.customer ? `${r.customer.firstName || ''} ${r.customer.lastName || ''}`.trim() : 'Unknown',
          service: r.service?.name || 'Unknown',
          purohit: r.purohit ? `${r.purohit.firstName || ''} ${r.purohit.lastName || ''}`.trim() : 'Unknown',
          status: r.reviewStatus ? (r.reviewStatus.toLowerCase() === 'published' ? 'Published' : 'Draft') : 'Draft',
          customerRating: parseFloat(r.customerRating) || 0,
          customerComment: r.customerReview || '',
          purohitRating: parseFloat(r.purohitRating) || 0,
          purohitComment: r.purohitReview || ''
        })));
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      showSnackbar('Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (id: string, bookingId: string | number, newStatus: string) => {
    try {
      const response = await updateReviewStatusAPI(bookingId, newStatus.toUpperCase());
      if (response?.success) {
        setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
        showSnackbar('Review status updated successfully', 'success');
      } else {
        showSnackbar('Failed to update review status', 'error');
      }
    } catch (error) {
      console.error('Failed to update review status:', error);
      showSnackbar('Failed to update review status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeleting(true);
      const response = await deleteReviewAPI(reviewToDelete.bookingId);
      if (response?.success) {
        setReviews(reviews.filter(r => r.id !== reviewToDelete.id));
        showSnackbar('Review deleted successfully', 'success');
      } else {
        showSnackbar('Failed to delete review', 'error');
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      showSnackbar('Failed to delete review', 'error');
    } finally {
      setIsDeleting(false);
      setReviewToDelete(null);
    }
  };

  const handleViewReview = async (item: any) => {
    setSelectedReview({ id: item.id, service: item.service }); // Show initial info immediately
    setIsModalLoading(true);
    try {
      const response = await getReviewByBookingIdAPI(item.bookingId);
      if (response?.success && response?.data) {
        const r = response.data;
        setSelectedReview({
          id: `B-${r.bookingId}`,
          bookingId: r.bookingId,
          service: r.service?.name || item.service, 
          customer: r.customer ? `${r.customer.firstName || ''} ${r.customer.lastName || ''}`.trim() : 'Unknown',
          purohit: r.purohit ? `${r.purohit.firstName || ''} ${r.purohit.lastName || ''}`.trim() : 'Unknown',
          status: r.reviewStatus ? (r.reviewStatus.toLowerCase() === 'published' ? 'Published' : 'Draft') : 'Draft',
          customerRating: parseFloat(r.customerRating) || 0,
          customerComment: r.customerReview || '',
          purohitRating: parseFloat(r.purohitRating) || 0,
          purohitComment: r.purohitReview || ''
        });
      } else {
        showSnackbar('Failed to fetch review details', 'error');
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Failed to fetch review details:', error);
      showSnackbar('Failed to fetch review details', 'error');
      setSelectedReview(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Published') return { bg: '#d1fae5', text: '#059669' };
    return { bg: '#fef3c7', text: '#d97706' };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Reviews & Ratings
        </Typography>
        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
          Manage customer feedback and ratings
        </Typography>
      </Box>

      {/* Tabs and Table */}
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
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>CUSTOMER</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>SERVICE</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>PUROHIT</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>STATUS</TableCell>
                <TableCell align="center" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#FF6200' }} />
                  </TableCell>
                </TableRow>
              ) : filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: '#64748b' }}>
                    No reviews found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any) => {
                  const statusStyle = getStatusStyle(item.status);

                return (
                  <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                        {item.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                        {item.customer}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>
                        {item.service}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                        {item.purohit}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, item.bookingId, e.target.value)}
                        sx={{
                          bgcolor: statusStyle.bg,
                          color: statusStyle.text,
                          fontWeight: 700,
                          fontFamily: 'var(--font-outfit), sans-serif',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiSelect-select': { py: 0.5, px: 1.5, fontSize: '0.8rem' },
                          '& .MuiSvgIcon-root': { color: statusStyle.text }
                        }}
                      >
                        <MenuItem value="Draft" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem', fontWeight: 600 }}>DRAFT</MenuItem>
                        <MenuItem value="Published" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem', fontWeight: 600 }}>PUBLISHED</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleViewReview(item)} sx={{ color: '#10b981', '&:hover': { bgcolor: '#d1fae5' } }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => setReviewToDelete(item)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' }, ml: 1 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              }))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReviews.length}
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

      {/* Review Details Modal */}
      <Dialog 
        open={Boolean(selectedReview)} 
        onClose={() => setSelectedReview(null)}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
              Review Details
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', fontSize: '0.9rem', mt: 0.5 }}>
              Booking ID: <Typography component="span" sx={{ fontWeight: 700, color: '#1e293b' }}>{selectedReview?.id}</Typography> | Service: <Typography component="span" sx={{ fontWeight: 700, color: '#FF6200' }}>{selectedReview?.service}</Typography>
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedReview(null)} size="small" sx={{ color: '#FF6200' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {isModalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress sx={{ color: '#FF6200' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Customer Review Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px', borderColor: '#e2e8f0', height: '100%' }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, mb: 2, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    CUSTOMER REVIEW - {selectedReview?.customer?.toUpperCase() || 'UNKNOWN'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={selectedReview?.customerRating || 0} readOnly size="small" sx={{ color: '#f59e0b' }} />
                    <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>
                      {selectedReview?.customerRating}/5
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#475569', fontStyle: 'italic', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                    "{selectedReview?.customerComment}"
                  </Typography>
                </Paper>
              </Grid>

              {/* Purohit Review Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px', borderColor: '#e2e8f0', height: '100%' }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, mb: 2, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    PUROHIT REVIEW - {selectedReview?.purohit?.toUpperCase() || 'UNKNOWN'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={selectedReview?.purohitRating || 0} readOnly size="small" sx={{ color: '#f59e0b' }} />
                    <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>
                      {selectedReview?.purohitRating}/5
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#475569', fontStyle: 'italic', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                    "{selectedReview?.purohitComment}"
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setSelectedReview(null)} 
            variant="contained" 
            sx={{ 
              textTransform: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              fontFamily: 'var(--font-outfit), sans-serif', 
              boxShadow: 'none', 
              color: 'white',
              background: '#FF6200 !important', 
              '&:hover': { background: '#E65800 !important', boxShadow: 'none' } 
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        maxWidth="xs"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Delete Review
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setReviewToDelete(null)}
            disabled={isDeleting}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              color: '#64748b',
              fontFamily: 'var(--font-outfit), sans-serif',
              mr: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained" 
            disabled={isDeleting}
            sx={{ 
              textTransform: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              fontFamily: 'var(--font-outfit), sans-serif', 
              boxShadow: 'none', 
              color: 'white',
              background: '#ef4444 !important', 
              '&:hover': { background: '#dc2626 !important', boxShadow: 'none' } 
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

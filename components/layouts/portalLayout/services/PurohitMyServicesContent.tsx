'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Switch, DialogContentText, InputAdornment, Pagination, Card, CardContent, Divider } from '@mui/material';
import { getPurohitServicesAPI, updatePurohitServiceAPI, deletePurohitServiceAPI } from '@/api/serviceControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function PurohitMyServicesContent() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingService, setEditingService] = useState<any>(null);
  const [editOnlinePrice, setEditOnlinePrice] = useState('');
  const [editOfflinePrice, setEditOfflinePrice] = useState('');
  const [editIsOnline, setEditIsOnline] = useState(true);
  const [editIsOffline, setEditIsOffline] = useState(true);
  const [editDurationMinutes, setEditDurationMinutes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [serviceToDelete, setServiceToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const { showSnackbar } = useSnackbarStore();

  const fetchMyServices = async () => {
    try {
      setLoading(true);
      const res = await getPurohitServicesAPI(page, limit);
      if (res?.data?.data) {
        setServices(res.data.data);
        setTotalItems(res.data.pagination?.total || res.data.data.length);
      } else {
        setServices([]);
        setTotalItems(0);
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error loading your services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, [page, limit]);

  const handleEditClick = (ps: any) => {
    setEditingService(ps);
    setEditOnlinePrice(ps.onlinePrice ? String(ps.onlinePrice) : '');
    setEditOfflinePrice(ps.offlinePrice ? String(ps.offlinePrice) : '');
    setEditIsOnline(ps.isOnline);
    setEditIsOffline(ps.isOffline);
    setEditDurationMinutes(ps.durationMinutes ? String(ps.durationMinutes) : '');
  };

  const handleCloseEditDialog = () => {
    setEditingService(null);
  };

  const handleUpdateSubmit = async () => {
    if (!editingService || !editDurationMinutes) {
      showSnackbar('Please enter duration', 'error');
      return;
    }
    
    if (editIsOnline && !editOnlinePrice) {
      showSnackbar('Please enter online price', 'error');
      return;
    }
    if (editIsOffline && !editOfflinePrice) {
      showSnackbar('Please enter offline price', 'error');
      return;
    }
    if (!editIsOnline && !editIsOffline) {
      showSnackbar('At least one mode (online/offline) must be supported', 'error');
      return;
    }

    try {
      setIsUpdating(true);
      const payload = {
        onlinePrice: editIsOnline ? Number(editOnlinePrice) : null,
        offlinePrice: editIsOffline ? Number(editOfflinePrice) : null,
        isOnline: editIsOnline,
        isOffline: editIsOffline,
        durationMinutes: Number(editDurationMinutes)
      };

      const res = await updatePurohitServiceAPI(editingService.id, payload);
      if (res.success) {
        showSnackbar('Service updated successfully', 'success');
        handleCloseEditDialog();
        fetchMyServices();
      } else {
        showSnackbar(res.message || 'Failed to update service', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error updating service', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (ps: any) => {
    setServiceToDelete(ps);
  };

  const handleCloseDeleteDialog = () => {
    setServiceToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deletePurohitServiceAPI(serviceToDelete.id);
      if (res.success) {
        showSnackbar('Service removed successfully', 'success');
        handleCloseDeleteDialog();
        fetchMyServices();
      } else {
        showSnackbar(res.message || 'Failed to remove service', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error removing service', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  const filteredServices = services.filter((ps: any) => 
    ps.service?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          My Services
        </Typography>
        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
          View and manage the services you offer.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder="Search my services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              sx: { fontFamily: 'var(--font-outfit), sans-serif', bgcolor: 'white' }
            }
          }}
          sx={{ 
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&.Mui-focused fieldset': {
                borderColor: '#FF6200',
              },
            }
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/purohit/services')}
          sx={{ 
            textTransform: 'none', 
            borderRadius: '8px', 
            fontWeight: 600, 
            fontFamily: 'var(--font-outfit), sans-serif',
            background: '#FF6200 !important',
            color: '#fff !important',
            '&:hover': { background: '#E65800 !important' } 
          }}
        >
          Add Service
        </Button>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#FAFAFA' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#333' }}>Service Name</TableCell>
              <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#333' }}>Online Mode</TableCell>
              <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#333' }}>Offline Mode</TableCell>
              <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#333' }}>Duration (Mins)</TableCell>
              <TableCell align="right" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#333' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999' }}>
                    {services.length === 0 
                      ? "You haven't added any services yet. Go to \"Add Services\" to add some!"
                      : "No services found matching your search."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((ps: any, index: number) => (
                <TableRow key={ps.id || index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#FFFaf5' } }}>
                  <TableCell component="th" scope="row" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#1e293b' }}>
                    {ps.service?.name || 'Unknown Service'}
                  </TableCell>
                  <TableCell>
                    {ps.isOnline ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 600, color: '#2E7D32' }}>
                          ₹{ps.onlinePrice}
                        </Typography>
                      </Box>
                    ) : (
                      <CancelIcon sx={{ color: '#ccc', fontSize: 18 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {ps.isOffline ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 600, color: '#2E7D32' }}>
                          ₹{ps.offlinePrice}
                        </Typography>
                      </Box>
                    ) : (
                      <CancelIcon sx={{ color: '#ccc', fontSize: 18 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={`${ps.durationMinutes} mins`} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }} />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: '#64748b' }} onClick={() => handleEditClick(ps)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove">
                      <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => handleDeleteClick(ps)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalItems > 0 && (
          <TablePagination
            component="div"
            count={totalItems}
            page={page - 1}
            onPageChange={(e, newPage) => setPage(newPage + 1)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              borderTop: '1px solid #f1f5f9',
              fontFamily: 'var(--font-outfit), sans-serif',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontFamily: 'var(--font-outfit), sans-serif',
                color: '#64748b'
              }
            }}
          />
        )}
      </TableContainer>
      </Box>

      {/* Mobile View */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {filteredServices.length === 0 ? (
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', textAlign: 'center', py: 4 }}>
            {services.length === 0 
              ? "You haven't added any services yet. Go to \"Add Services\" to add some!"
              : "No services found matching your search."}
          </Typography>
        ) : (
          filteredServices.map((ps: any, index: number) => (
            <Card key={ps.id || index} variant="outlined" sx={{ borderRadius: '16px', p: 2, bgcolor: 'white', borderColor: '#e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                  {ps.service?.name || 'Unknown Service'}
                </Typography>
                <Chip label={`${ps.durationMinutes} mins`} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
              </Box>
              <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Online:</Typography>
                {ps.isOnline ? (
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#2E7D32' }}>₹{ps.onlinePrice}</Typography>
                ) : (
                  <CancelIcon sx={{ color: '#ccc', fontSize: 16 }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Offline:</Typography>
                {ps.isOffline ? (
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#2E7D32' }}>₹{ps.offlinePrice}</Typography>
                ) : (
                  <CancelIcon sx={{ color: '#ccc', fontSize: 16 }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button size="small" variant="outlined" color="primary" onClick={() => handleEditClick(ps)} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
                  Edit
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(ps)} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
                  Delete
                </Button>
              </Box>
            </Card>
          ))
        )}
      </Box>

      {/* Edit Service Dialog */}
      <Dialog 
        open={Boolean(editingService)} 
        onClose={handleCloseEditDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px', width: { xs: 'calc(100% - 32px)', sm: '450px' }, maxWidth: '100%', m: { xs: 2, sm: 'auto' }, p: { xs: 0.5, sm: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Edit {editingService?.service?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel 
                control={<Switch checked={editIsOnline} onChange={(e) => setEditIsOnline(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6200' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6200' } }} />}
                label={<Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#475569' }}>Supports Online</Typography>}
              />
              <FormControlLabel 
                control={<Switch checked={editIsOffline} onChange={(e) => setEditIsOffline(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6200' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6200' } }} />}
                label={<Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#475569' }}>Supports Offline</Typography>}
              />
            </Box>

            {editIsOnline && (
              <TextField
                variant="outlined"
                label="Online Price (₹)"
                type="number"
                fullWidth
                value={editOnlinePrice}
                onChange={(e) => setEditOnlinePrice(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-outfit), sans-serif' },
                  '& .MuiInputLabel-root': { fontFamily: 'var(--font-outfit), sans-serif' }
                }}
              />
            )}
            
            {editIsOffline && (
              <TextField
                variant="outlined"
                label="Offline Price (₹)"
                type="number"
                fullWidth
                value={editOfflinePrice}
                onChange={(e) => setEditOfflinePrice(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-outfit), sans-serif' },
                  '& .MuiInputLabel-root': { fontFamily: 'var(--font-outfit), sans-serif' }
                }}
              />
            )}
            <TextField
              variant="outlined"
              label="Duration (Minutes)"
              type="number"
              fullWidth
              value={editDurationMinutes}
              onChange={(e) => setEditDurationMinutes(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-outfit), sans-serif' },
                '& .MuiInputLabel-root': { fontFamily: 'var(--font-outfit), sans-serif' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseEditDialog}
            sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateSubmit} 
            disabled={isUpdating || (!editIsOnline && !editIsOffline) || !editDurationMinutes}
            variant="contained" 
            sx={{ 
              textTransform: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              fontFamily: 'var(--font-outfit), sans-serif',
              background: '#FF6200 !important',
              color: '#fff !important',
              '&:hover': { background: '#E65800 !important' } 
            }}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(serviceToDelete)}
        onClose={handleCloseDeleteDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px', width: { xs: 'calc(100% - 32px)', sm: '420px' }, maxWidth: '100%', m: { xs: 2, sm: 'auto' }, p: { xs: 0.5, sm: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Remove Service
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div" sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#475569' }}>
            Are you sure you want to remove <strong>{serviceToDelete?.service?.name}</strong> from your profile? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            disabled={isDeleting}
            variant="contained" 
            sx={{ 
              textTransform: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              fontFamily: 'var(--font-outfit), sans-serif',
              background: '#ef4444 !important',
              color: '#fff !important',
              '&:hover': { background: '#dc2626 !important' } 
            }}
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

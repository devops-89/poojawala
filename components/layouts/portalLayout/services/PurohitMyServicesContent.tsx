'use client';
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Switch, DialogContentText, InputAdornment, Pagination, Card, CardContent, Divider, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import { getPurohitServicesAPI, updatePurohitServiceAPI, deletePurohitServiceAPI } from '@/api/serviceControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { getPurohitPayoutRange } from '@/utils/payoutHelper';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

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

  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  const filteredServices = services.filter((ps: any) =>
    ps.service?.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <AppBreadcrumbs
          items={[
            { label: "Dashboard", href: "/purohit/dashboard" },
            { label: "My Services" },
          ]}
        />
        <Box>
          <Typography variant="h4" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: COLORS.SLATE_DARK }}>
            My Services
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: COLORS.SLATE_MUTED, mt: 0.5 }}>
            View and manage the services you offer.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder="Search my services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"

          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&.Mui-focused fieldset': {
                borderColor: COLORS.PRIMARY,
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
            fontFamily: FONTS.OUTFIT,
            background: `${COLORS.PRIMARY} !important`,
            color: `${COLORS.WHITE} !important`,
            '&:hover': { background: `${COLORS.PRIMARY_DARK} !important` }
          }}
        >
          Add Service
        </Button>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer component={Paper} sx={{ borderRadius: '12px', border: `1px solid ${COLORS.BORDER_LIGHT}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: COLORS.SURFACE_LIGHT }}>
              <TableRow>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: COLORS.DARK }}>Service Name</TableCell>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: COLORS.DARK }}>Service Payout</TableCell>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: COLORS.DARK }}>Duration (Mins)</TableCell>
                <TableCell align="right" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: COLORS.DARK }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, color: COLORS.MUTED_TEXT }}>
                      {services.length === 0
                        ? "You haven't added any services yet. Go to \"Add Services\" to add some!"
                        : "No services found matching your search."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((ps: any, index: number) => (
                  <TableRow key={ps.id || index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#FFFaf5' } }}>
                    <TableCell component="th" scope="row" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: COLORS.SLATE_DARK }}>
                      {ps.service?.name || 'Unknown Service'}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '15px', fontWeight: 800, color: '#16a34a' }}>
                        {getPurohitPayoutRange(ps)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={`${ps.durationMinutes || ps.service?.durationMinutes || 60} mins`} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, fontFamily: FONTS.OUTFIT }} />
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="View Service Details">
                        <IconButton
                          size="small"
                          sx={{ color: COLORS.PRIMARY, mr: 0.5 }}
                          onClick={() => router.push(`/purohit/services/${ps.serviceId || ps.service?.id || ps.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
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
                borderTop: '1px solid #f1f5f9',
                fontFamily: FONTS.OUTFIT,
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontFamily: FONTS.OUTFIT,
                  color: COLORS.SLATE_MUTED
                }
              }}
            />
          )}
        </TableContainer>
      </Box>

      {/* Mobile View */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {filteredServices.length === 0 ? (
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: COLORS.MUTED_TEXT, textAlign: 'center', py: 4 }}>
            {services.length === 0
              ? "You haven't added any services yet. Go to \"Add Services\" to add some!"
              : "No services found matching your search."}
          </Typography>
        ) : (
          filteredServices.map((ps: any, index: number) => (
            <Card key={ps.id || index} variant="outlined" sx={{ borderRadius: '16px', p: 2, bgcolor: COLORS.WHITE, borderColor: '#e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: COLORS.SLATE_DARK, fontSize: '1.1rem' }}>
                  {ps.service?.name || 'Unknown Service'}
                </Typography>
                <Chip label={`${ps.durationMinutes || ps.service?.durationMinutes || 60} mins`} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
              </Box>
              <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: COLORS.SLATE_MUTED, fontWeight: 600 }}>Service Payout:</Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>{getPurohitPayoutRange(ps)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => router.push(`/purohit/services/${ps.serviceId || ps.service?.id || ps.id}`)}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: FONTS.OUTFIT,
                    borderColor: COLORS.PRIMARY,
                    color: COLORS.PRIMARY,
                    '&:hover': {
                      borderColor: COLORS.PRIMARY_DARK,
                      bgcolor: '#fff5f0',
                    },
                  }}
                >
                  View
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
        <DialogTitle sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: COLORS.SLATE_DARK }}>
          Edit {editingService?.service?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={<Switch checked={editIsOnline} onChange={(e) => setEditIsOnline(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.PRIMARY }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.PRIMARY } }} />}
                label={<Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#475569' }}>Supports Online</Typography>}
              />
              <FormControlLabel
                control={<Switch checked={editIsOffline} onChange={(e) => setEditIsOffline(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.PRIMARY }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.PRIMARY } }} />}
                label={<Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#475569' }}>Supports Offline</Typography>}
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
                  '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: FONTS.OUTFIT },
                  '& .MuiInputLabel-root': { fontFamily: FONTS.OUTFIT }
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
                  '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: FONTS.OUTFIT },
                  '& .MuiInputLabel-root': { fontFamily: FONTS.OUTFIT }
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
                '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: FONTS.OUTFIT },
                '& .MuiInputLabel-root': { fontFamily: FONTS.OUTFIT }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{ color: COLORS.SLATE_MUTED, textTransform: 'none', fontWeight: 600, fontFamily: FONTS.OUTFIT }}
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
              fontFamily: FONTS.OUTFIT,
              background: `${COLORS.PRIMARY} !important`,
              color: `${COLORS.WHITE} !important`,
              '&:hover': { background: `${COLORS.PRIMARY_DARK} !important` }
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
        <DialogTitle sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: COLORS.SLATE_DARK }}>
          Remove Service
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div" sx={{ fontFamily: FONTS.OUTFIT, color: '#475569' }}>
            Are you sure you want to remove <strong>{serviceToDelete?.service?.name}</strong> from your profile? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{ color: COLORS.SLATE_MUTED, textTransform: 'none', fontWeight: 600, fontFamily: FONTS.OUTFIT }}
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
              fontFamily: FONTS.OUTFIT,
              background: '#ef4444 !important',
              color: `${COLORS.WHITE} !important`,
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

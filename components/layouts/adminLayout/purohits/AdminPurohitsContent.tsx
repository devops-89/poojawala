'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Button, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, Avatar, TablePagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPurohitsAPI, updatePurohitVerificationAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

const STATUS_TABS = [
  { id: 'All', label: 'All' },
  { id: 'Approved', label: 'Approved' },
  { id: 'Pending Approval', label: 'Pending Approval' },
  { id: 'Rejected', label: 'Rejected' },
];

export default function AdminPurohitsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';
  
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [purohits, setPurohits] = useState<any[]>([]);
  
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const fetchPurohits = React.useCallback(async () => {
    try {
      setLoading(true);
      let backendFilterStatus: string | undefined = undefined;
      if (statusFilter === 'Approved') backendFilterStatus = 'APPROVED';
      else if (statusFilter === 'Pending Approval') backendFilterStatus = 'PENDING';
      else if (statusFilter === 'Rejected') backendFilterStatus = 'REJECTED';

      const res = await getPurohitsAPI(page + 1, rowsPerPage, searchValue, backendFilterStatus);
      if (res.success) {
        const usersArray = res.data?.data || [];
        const pagination = res.data?.pagination || {};
        
        const mapped = usersArray.map((u: any) => {
          const profile = u.profile || u.purohitProfile || {};
          let uiStatus = 'No Profile';
          const verificationStatus = profile.verificationStatus || u.status;
          
          if (verificationStatus === 'APPROVED' || verificationStatus === 'ACTIVE') uiStatus = 'Approved';
          else if (verificationStatus === 'PENDING') uiStatus = 'Pending Approval';
          else if (verificationStatus === 'REJECTED') uiStatus = 'Rejected';

          const skillsArray = Array.isArray(profile.specializations) 
            ? profile.specializations 
            : (profile.specializations ? [profile.specializations] : []);

          return {
            id: u.id,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
            email: u.email || '-',
            city: profile.city || '-',
            experience: profile.experienceYears ? `${profile.experienceYears} Yrs` : '-',
            skills: skillsArray.length > 0 ? skillsArray.join(', ') : '-',
            status: uiStatus,
            phone: u.phone || '-',
            appliedAt: new Date(u.createdAt).toLocaleDateString(),
            rawStatus: verificationStatus
          };
        });
        setPurohits(mapped);
        setTotalCount(pagination.total || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPurohits();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPurohits]);

  const handleStatusChange = (id: number, newStatus: string) => {
    const purohit = purohits.find(p => p.id === id);
    if (!purohit) return;
    setStatusChangeTarget({ purohit, newStatus });
    setRejectionReason("");
  };

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    setIsSubmitting(true);
    try {
      const backendStatus = statusChangeTarget.newStatus === 'Approved' ? 'APPROVED' : statusChangeTarget.newStatus === 'Rejected' ? 'REJECTED' : 'PENDING';
      const reason = backendStatus === 'REJECTED' ? rejectionReason : undefined;
      
      const res = await updatePurohitVerificationAPI(statusChangeTarget.purohit.id, backendStatus, reason);
      if (res.success) {
        showSnackbar('Purohit status updated successfully', 'success');
        fetchPurohits();
      } else {
        showSnackbar(res.message || 'Failed to update status', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error updating status', 'error');
    } finally {
      setIsSubmitting(false);
      setStatusChangeTarget(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return { bg: '#d1fae5', text: '#059669' };
      case 'Rejected': return { bg: '#fee2e2', text: '#ef4444' };
      case 'Pending Approval': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Purohits
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
            Verify profiles, view documents, and manage approval status
          </Typography>
        </Box>
        <Button
          component={NextLink}
          href="/admin/purohits/add"
          variant="contained"
          sx={{
            background: '#FF6200',
            color: 'white',
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            py: 1,
            px: 3,
            boxShadow: 'none',
            '&:hover': { background: '#E65800', boxShadow: 'none' },
            alignSelf: { xs: 'flex-start', sm: 'auto' }
          }}
          startIcon={<AddIcon />}
        >
          Add Purohit
        </Button>
      </Box>

      {/* Tabs and Table */}
      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', px: 2, py: 1, gap: 2 }}>
          <Tabs 
            value={statusFilter} 
            onChange={(_, val) => setStatusFilter(val)}
            sx={{ 
              '& .MuiTabs-indicator': { backgroundColor: '#FF6200' },
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: '#64748b', minWidth: 100, fontFamily: 'var(--font-outfit), sans-serif' },
              '& .MuiTab-root.Mui-selected': { color: '#FF6200' },
            }}
          >
            {STATUS_TABS.map(tab => (
              <Tab key={tab.id} label={tab.label} value={tab.id} />
            ))}
          </Tabs>

          <TextField 
            placeholder="Search by name, email or phone..." 
            variant="outlined" 
            size="small" 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)} 
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }
            }}
            sx={{ 
              width: { xs: '100%', sm: 280, md: 320 }, 
              '& .MuiOutlinedInput-root': { borderRadius: '12px' } 
            }} 
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Purohit ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Purohit Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>City</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Applied On</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0', width: 60 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#64748b' }}>Loading...</TableCell>
                </TableRow>
              ) : purohits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#64748b' }}>No purohits found</TableCell>
                </TableRow>
              ) : (
                purohits.map((purohit, idx) => {
                  const statusStyle = getStatusStyle(purohit.status);
                  const pKey = purohit.id || purohit.userId || `purohit-${idx}`;
                  return (
                    <TableRow key={pKey} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#FF6200' }}>P-{purohit.id}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif' }}>
                          {purohit.name}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {purohit.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {purohit.city ? (
                          <Typography sx={{ color: '#1e293b', fontWeight: 500, fontSize: '0.9rem' }}>{purohit.city}</Typography>
                        ) : (
                          <Typography sx={{ color: '#64748b' }}>-</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {purohit.status === 'Approved' || purohit.status === 'Rejected' ? (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              bgcolor: statusStyle.bg,
                              color: statusStyle.text,
                              fontWeight: 600,
                              fontFamily: 'var(--font-outfit), sans-serif',
                              borderRadius: '6px',
                              px: 1.5,
                              py: 0.5,
                              fontSize: '0.85rem',
                            }}
                          >
                            {purohit.status}
                          </Box>
                        ) : purohit.status === 'No Profile' ? (
                          <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>No Profile</Typography>
                        ) : (
                          <Select
                            size="small"
                            value={purohit.status}
                            onChange={(e) => handleStatusChange(purohit.id, e.target.value)}
                            MenuProps={{
                              slotProps: { paper: { sx: { maxHeight: 300, mt: 1 } } },
                              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                              transformOrigin: { vertical: 'top', horizontal: 'left' }
                            }}
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.text,
                              fontWeight: 600,
                              fontFamily: 'var(--font-outfit), sans-serif',
                              borderRadius: '6px',
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '& .MuiSelect-select': { py: 0.5, px: 1.5, fontSize: '0.85rem' },
                              '& .MuiSvgIcon-root': { color: statusStyle.text }
                            }}
                          >
                            <MenuItem value="Pending Approval" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>Pending Approval</MenuItem>
                            <MenuItem value="Approved" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>Approved</MenuItem>
                            <MenuItem value="Rejected" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>Rejected</MenuItem>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>
                          {purohit.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {purohit.appliedAt}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton component={NextLink} href={`/admin/purohits/${purohit.id}`} sx={{ color: '#94a3b8', '&:hover': { color: '#FF6200', bgcolor: '#fff7ed' } }}>
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

      {/* Confirmation Dialog */}
      <Dialog open={!!statusChangeTarget} onClose={() => !isSubmitting && setStatusChangeTarget(null)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', minWidth: 400 } }}>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Change Verification Status
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mb: 2 }}>
            Are you sure you want to change the status of <strong>{statusChangeTarget?.purohit?.name}</strong> to <strong>{statusChangeTarget?.newStatus}</strong>?
          </DialogContentText>
          {statusChangeTarget?.newStatus === 'Rejected' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason"
              placeholder="e.g. Invalid documents uploaded"
              variant="outlined"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setStatusChangeTarget(null)} disabled={isSubmitting} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}>
            Cancel
          </Button>
          <Button onClick={confirmStatusChange} disabled={isSubmitting || (statusChangeTarget?.newStatus === 'Rejected' && !rejectionReason.trim())} variant="contained" sx={{ background: statusChangeTarget?.newStatus === 'Rejected' ? '#ef4444' : '#FF6200', color: 'white', textTransform: 'none', borderRadius: '8px', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', boxShadow: 'none', '&:hover': { background: statusChangeTarget?.newStatus === 'Rejected' ? '#dc2626' : '#F05A00', boxShadow: 'none' } }}>
            {isSubmitting ? 'Saving...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

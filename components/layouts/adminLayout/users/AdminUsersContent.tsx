'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip, Avatar, TextField, InputAdornment, Menu, MenuItem, TablePagination, CircularProgress, Select, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { getCustomersListAPI, updateUserStatusAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

const STATUS_TABS = [
  { id: 'All', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'BLOCKED', label: 'Blocked' },
];

export default function AdminUsersContent() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
        const backendStatus = statusFilter === 'All' ? undefined : statusFilter;
        const response = await getCustomersListAPI(page + 1, rowsPerPage, search, backendStatus);
        const data = response?.data?.data || response?.data || [];
        const fetchedUsers = Array.isArray(data) ? data : [];
        setUsers(fetchedUsers);
        
        const backendTotal = response?.data?.pagination?.total || response?.data?.total || response?.total || response?.data?.totalItems || fetchedUsers.length;
        setTotalUsers(backendTotal || (page * rowsPerPage + (fetchedUsers.length === rowsPerPage ? rowsPerPage + 1 : fetchedUsers.length)));
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    // Simple debounce for search
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [page, rowsPerPage, search, statusFilter]);

  const handleStatusChange = (userId: string | number, newStatus: string) => {
    const user = users.find(u => (u.userId || u.id) === userId);
    if (!user) return;
    setStatusChangeTarget({ user, newStatus });
  };

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    setIsSubmitting(true);
    try {
      const res = await updateUserStatusAPI(statusChangeTarget.user.userId || statusChangeTarget.user.id, statusChangeTarget.newStatus);
      if (res.success) {
        showSnackbar(`User status updated to ${statusChangeTarget.newStatus} successfully`, 'success');
        fetchCustomers();
      } else {
        showSnackbar(res.message || 'Failed to update user status', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error updating status', 'error');
    } finally {
      setIsSubmitting(false);
      setStatusChangeTarget(null);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A' }}>
          Customer Management
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
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

        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <TextField 
            placeholder="Search by name, email, or phone" 
            size="small"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ width: 300, bgcolor: 'white', borderRadius: '8px', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999' }} />
                  </InputAdornment>
                )
              }
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Customer ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>Loading...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>No customers found</TableCell>
                </TableRow>
              ) : users.map((row: any) => {
                const name = `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.username || 'Customer';
                return (
                  <TableRow key={row.userId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#FF6200' }}>C-{row.userId || row.id}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif' }}>
                        {name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.email ? (
                        <Typography sx={{ color: '#1e293b', fontWeight: 500, fontSize: '0.9rem' }}>{row.email}</Typography>
                      ) : (
                        <Typography sx={{ color: '#64748b' }}>-</Typography>
                      )}
                      <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                        {row.phone || row.mobileNumber || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.status || 'ACTIVE'}
                        size="small"
                        onChange={(e) => handleStatusChange(row.userId || row.id, e.target.value)}
                        sx={{ 
                          minWidth: 110,
                          height: 32,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          bgcolor: (row.status || 'ACTIVE') === 'ACTIVE' ? '#E8F5E9' : '#FFEBEE',
                          color: (row.status || 'ACTIVE') === 'ACTIVE' ? '#2E7D32' : '#C62828',
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiSelect-select': { py: 0.5 }
                        }}
                      >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="REJECTED">REJECTED</MenuItem>
                        <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalUsers}
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
      <Dialog 
        open={Boolean(statusChangeTarget)} 
        onClose={() => !isSubmitting && setStatusChangeTarget(null)}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', minWidth: '350px' } }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700 }}>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status of <strong>{statusChangeTarget?.user?.firstName || statusChangeTarget?.user?.username || 'this user'}</strong> to <strong>{statusChangeTarget?.newStatus}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setStatusChangeTarget(null)} 
            disabled={isSubmitting}
            sx={{ color: '#64748b', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmStatusChange}
            disabled={isSubmitting}
            variant="contained" 
            style={{ backgroundColor: '#FF6200', color: '#fff' }}
            sx={{ '&:hover': { backgroundColor: '#E65800' }, fontWeight: 600, boxShadow: 'none' }}
          >
            {isSubmitting ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

'use client';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, MenuItem, Paper, Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography, TablePagination } from '@mui/material';
import NextLink from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { getServicesAPI, updateServiceStatusAPI, deleteServiceAPI } from '@/api/serviceControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

// Helper for image placeholders (matching chandra-fe)
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M16 30 Q24 18 32 30' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' fill='%2394a3b8'/%3E%3C/svg%3E";

const STATUS_TABS = [
  { id: 'All Status', label: 'All' },
  { id: 'Active', label: 'Active' },
  { id: 'Inactive', label: 'Inactive' },
];

export default function AdminServicesContent() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [focused, setFocused] = useState(false);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const { showSnackbar } = useSnackbarStore();
  
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const isActiveParam = statusFilter === 'Active' ? true : statusFilter === 'Inactive' ? false : undefined;
      const res = await getServicesAPI(page + 1, rowsPerPage, searchValue, undefined, undefined, undefined, isActiveParam);
      if (res.success && res.data?.data) {
        setServices(res.data.data);
        setTotalCount(res.data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchServices]);

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    try {
      const res = await updateServiceStatusAPI(statusChangeTarget.service.id, statusChangeTarget.isActive);
      if (res.success) {
        showSnackbar('Status updated successfully', 'success');
        setServices(services.map(s => s.id === statusChangeTarget.service.id ? { ...s, isActive: statusChangeTarget.isActive } : s));
      } else {
        showSnackbar(res.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error(error);
      showSnackbar('Error updating status', 'error');
    }
    setStatusChangeTarget(null);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        const res = await deleteServiceAPI(deleteTarget);
        if (res.success) {
          showSnackbar('Service deleted successfully', 'success');
          setServices(services.filter(s => s.id !== deleteTarget));
        } else {
          showSnackbar(res.message || 'Failed to delete service', 'error');
        }
      } catch (error: any) {
        showSnackbar(error.response?.data?.message || 'Error deleting service', 'error');
      }
    }
    setDeleteTarget(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Services
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
            Manage categories and services
          </Typography>
        </Box>
        <Button
          component={NextLink}
          href="/admin/services/add"
          variant="contained"
          sx={{
            background: '#FF6200',
            color: 'white',
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            py: 1.5,
            px: 3,
            boxShadow: 'none',
            '&:hover': { background: '#E65800', boxShadow: 'none' },
            alignSelf: { xs: 'flex-start', sm: 'auto' }
          }}
          startIcon={<AddIcon />}
        >
          Create Service
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: 'none', bgcolor: 'white' }}>
        <TextField
          placeholder="Search services..."
          size="small"
          variant="outlined"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: focused ? '#FF6200' : '#94a3b8', transition: 'color 0.2s ease' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: "100%",
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              height: 44,
              backgroundColor: '#fff',
              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
              '& fieldset': { borderColor: '#cbd5e1' },
              '&:hover fieldset': { borderColor: '#FF6200' },
              '&.Mui-focused fieldset': { borderColor: '#FF6200', borderWidth: '1.5px' },
              '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(255,98,0,0.12)' },
            },
            '& .MuiInputBase-input': { fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.875rem' },
          }}
        />
      </Paper>

      {/* Table Area */}
      <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: '12px', overflow: "hidden", bgcolor: 'white' }}>
        <Tabs
          value={statusFilter}
          onChange={(_, newValue) => setStatusFilter(newValue)}
          sx={{
            minHeight: 48,
            '& .MuiTabs-indicator': { backgroundColor: '#FF6200', height: 3, borderRadius: '3px 3px 0 0' },
            borderBottom: '1px solid #e2e8f0',
            mb: 2,
            px: 2,
          }}
        >
          {STATUS_TABS.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={<Typography variant="body2" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: statusFilter === tab.id ? 700 : 500 }}>{tab.label}</Typography>}
              sx={{ textTransform: 'none', minWidth: 'auto', px: 3, color: '#64748b', '&.Mui-selected': { color: '#FF6200' } }}
            />
          ))}
        </Tabs>

        <TableContainer>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", py: 2 }}>Service Details</TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bookings</TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
                    Loading services...
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
                    No services found matching the criteria.
                  </TableCell>
                </TableRow>
              ) : services.map((service) => (
                <TableRow key={service.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 48, height: 48, position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                        <Image src={service.iconDownloadurl || service.iconUrl || PLACEHOLDER} alt={service.name || 'Service Icon'} fill style={{ objectFit: 'cover' }} unoptimized={true} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                          {service.name}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', fontSize: '0.8rem' }}>
                          Duration: {service.durationMinutes} Mins
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#0f172a' }}>₹{service.minPrice} - ₹{service.maxPrice}</TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>{service.totalBookings ?? service.bookings ?? 0}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={service.isActive ? 'active' : 'inactive'}
                      onChange={(e) => {
                        const isActive = e.target.value === 'active';
                        setStatusChangeTarget({ service, isActive });
                      }}
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-outfit), sans-serif',
                        height: 32,
                        borderRadius: '8px',
                        color: service.isActive ? '#059669' : '#94a3b8',
                        bgcolor: service.isActive ? '#d1fae5' : '#f1f5f9',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&:hover': { bgcolor: service.isActive ? '#a7f3d0' : '#e2e8f0' },
                        '& .MuiSelect-icon': { color: service.isActive ? '#059669' : '#94a3b8' }
                      }}
                    >
                      <MenuItem value="active" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.875rem', fontWeight: 600 }}>Active</MenuItem>
                      <MenuItem value="inactive" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.875rem', fontWeight: 600 }}>Inactive</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton component={NextLink} href={`/admin/services/${service.id}`} sx={{ color: '#64748b', bgcolor: '#f8fafc', '&:hover': { color: '#0ea5e9', bgcolor: '#e0f2fe' } }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton component={NextLink} href={`/admin/services/edit/${service.id}`} sx={{ color: '#64748b', bgcolor: '#f8fafc', '&:hover': { color: '#FF6200', bgcolor: '#FFF0E6' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => setDeleteTarget(service.id)} sx={{ color: '#64748b', bgcolor: '#f8fafc', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: "1px solid #e2e8f0", '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontFamily: 'var(--font-outfit), sans-serif' } }}
        />
      </Paper>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
            Are you sure you want to delete this service? This action cannot be undone and will permanently remove it from the platform.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', boxShadow: 'none' }}>
            Delete Service
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Confirmation Modal */}
      <Dialog open={!!statusChangeTarget} onClose={() => setStatusChangeTarget(null)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b' }}>Change Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
            Are you sure you want to {statusChangeTarget?.isActive ? 'activate' : 'deactivate'} {statusChangeTarget?.service.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setStatusChangeTarget(null)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}>Cancel</Button>
          <Button onClick={confirmStatusChange} variant="contained" sx={{ background: '#FF6200', color: 'white', textTransform: 'none', borderRadius: '8px', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', boxShadow: 'none', '&:hover': { background: '#F05A00', boxShadow: 'none' } }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

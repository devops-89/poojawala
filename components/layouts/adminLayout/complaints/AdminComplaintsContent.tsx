'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Chip, TablePagination, TextField, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { getAllComplaintsAPI, updateComplaintStatusAPI, getComplaintByIdAPI, deleteComplaintAPI } from '@/api/complaintControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

export enum COMPLAINT_CATEGORY {
  SERVICE_NOT_PROVIDED = 'SERVICE_NOT_PROVIDED',
  LATE_ARRIVAL = 'LATE_ARRIVAL',
  BEHAVIOR_ISSUE = 'BEHAVIOR_ISSUE',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  ACCOUNT_ISSUE = 'ACCOUNT_ISSUE',
  GENERAL_QUERY = 'GENERAL_QUERY',
  OTHER = 'OTHER',
}

export enum COMPLAINT_STATUS {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
}

const STATUS_TABS = [
  { id: 'All', label: 'All' },
  { id: COMPLAINT_STATUS.OPEN, label: 'Open' },
  { id: COMPLAINT_STATUS.UNDER_REVIEW, label: 'Under Review' },
  { id: COMPLAINT_STATUS.RESOLVED, label: 'Resolved' },
  { id: COMPLAINT_STATUS.REJECTED, label: 'Rejected' },
  { id: COMPLAINT_STATUS.CLOSED, label: 'Closed' },
];

export default function AdminComplaintsContent() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  
  const [complaints, setComplaints] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(null);
  const [statusUpdateTarget, setStatusUpdateTarget] = useState<{ id: string | number, newStatus: string } | null>(null);
  const [adminRemark, setAdminRemark] = useState('');

  const { showSnackbar } = useSnackbarStore();

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await getAllComplaintsAPI(page + 1, rowsPerPage, statusFilter);
      if (res.success && res.data?.data) {
        setComplaints(res.data.data);
        setTotalCount(res.data.meta?.total || res.data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
  }, [page, rowsPerPage, statusFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleStatusChangeInit = (id: string | number, newStatus: string) => {
    setStatusUpdateTarget({ id, newStatus });
    setAdminRemark('');
  };

  const confirmStatusChange = async () => {
    if (!statusUpdateTarget) return;
    
    if ((statusUpdateTarget.newStatus === COMPLAINT_STATUS.REJECTED || statusUpdateTarget.newStatus === COMPLAINT_STATUS.RESOLVED) && !adminRemark.trim()) {
      showSnackbar(`Resolution notes are required when marking a complaint as ${statusUpdateTarget.newStatus.replace(/_/g, ' ')}`, 'error');
      return;
    }

    try {
      const res = await updateComplaintStatusAPI(statusUpdateTarget.id, statusUpdateTarget.newStatus, adminRemark);
      if (res.success) {
        showSnackbar('Complaint status updated', 'success');
        fetchComplaints();
      } else {
        showSnackbar(res.message || 'Failed to update status', 'error');
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error updating status', 'error');
    } finally {
      setStatusUpdateTarget(null);
    }
  };

  const handleViewDetails = async (id: string | number) => {
    try {
      const res = await getComplaintByIdAPI(id);
      if (res.success && res.data) {
        setSelectedComplaint(res.data);
      } else {
        showSnackbar(res.message || 'Failed to fetch details', 'error');
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error fetching details', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteComplaintAPI(deleteTarget);
      if (res.success) {
        showSnackbar('Complaint deleted successfully', 'success');
        fetchComplaints();
      } else {
        showSnackbar(res.message || 'Failed to delete complaint', 'error');
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Error deleting complaint', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const getStatusStyle = (status: string) => {
    if (status.includes('RESOLVED') || status === 'CLOSED') return { bg: '#d1fae5', text: '#059669' };
    if (status === 'UNDER_REVIEW') return { bg: '#dbeafe', text: '#2563eb' };
    if (status === 'REJECTED') return { bg: '#fee2e2', text: '#dc2626' };
    return { bg: '#fef3c7', text: '#d97706' };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Complaints
        </Typography>
        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
          Track and resolve customer & purohit issues
        </Typography>
      </Box>

      {/* Tabs and Table */}
      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white', overflow: 'hidden' }}>
        <Tabs 
          value={statusFilter} 
          onChange={(_, val) => { setStatusFilter(val); setPage(0); }}
          variant="scrollable"
          scrollButtons="auto"
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
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>COMPLAINT ID</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>CATEGORY</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>USER</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>CREATED ON</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>STATUS</TableCell>
                <TableCell align="right" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((item: any) => {
                const statusStyle = getStatusStyle(item.status);
                const userObj = item.raisedBy;
                const userName = userObj ? `${userObj.firstName} ${userObj.lastName || ''}` : 'Unknown';
                const userRole = userObj?.role || 'UNKNOWN';

                return (
                  <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f8fafc' }, transition: 'background-color 0.2s' }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                        {`C-${item.id}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.category?.replace(/_/g, ' ')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem' }}>
                          {userName}
                        </Typography>
                        <Box sx={{ 
                          bgcolor: userRole === 'CUSTOMER' ? '#dbeafe' : '#f3e8ff', 
                          color: userRole === 'CUSTOMER' ? '#2563eb' : '#9333ea', 
                          fontSize: '0.65rem', fontWeight: 700, px: 0.8, py: 0.2, borderRadius: '4px', display: 'inline-block', mt: 0.5 
                        }}>
                          {userRole}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={item.status}
                        onChange={(e) => handleStatusChangeInit(item.id, e.target.value)}
                        sx={{
                          bgcolor: statusStyle.bg,
                          color: statusStyle.text,
                          fontWeight: 700,
                          fontFamily: 'var(--font-outfit), sans-serif',
                          borderRadius: '6px',
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiSelect-select': { py: 0.5, px: 1.5, fontSize: '0.8rem' },
                          '& .MuiSvgIcon-root': { color: statusStyle.text }
                        }}
                      >
                        {Object.values(COMPLAINT_STATUS).map(s => (
                          <MenuItem key={s} value={s} sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.85rem' }}>
                            {s.replace(/_/g, ' ')}
                          </MenuItem>
                        ))}
                        {!Object.values(COMPLAINT_STATUS).includes(item.status as any) && (
                          <MenuItem value={item.status} sx={{ display: 'none' }}>
                            {item.status.replace(/_/g, ' ')}
                          </MenuItem>
                        )}
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton onClick={() => handleViewDetails(item.id)} sx={{ color: '#10b981', '&:hover': { bgcolor: '#d1fae5' } }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => setDeleteTarget(item.id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {complaints.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#94a3b8', fontFamily: 'var(--font-outfit), sans-serif' }}>No complaints found.</Typography>
                  </TableCell>
                </TableRow>
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

      {/* Status Update Modal */}
      <Dialog open={Boolean(statusUpdateTarget)} onClose={() => setStatusUpdateTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700 }}>Update Complaint Status</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontFamily: 'var(--font-outfit), sans-serif', color: '#475569' }}>
            Are you sure you want to change the status to <strong style={{color: '#1e293b'}}>{statusUpdateTarget?.newStatus.replace(/_/g, ' ')}</strong>?
          </Typography>
          {(statusUpdateTarget?.newStatus === COMPLAINT_STATUS.REJECTED || statusUpdateTarget?.newStatus === COMPLAINT_STATUS.RESOLVED) && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Resolution Notes (Required)"
              variant="outlined"
              value={adminRemark}
              onChange={(e) => setAdminRemark(e.target.value)}
              error={adminRemark.trim() === ''}
              helperText={adminRemark.trim() === '' ? "Required" : ""}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setStatusUpdateTarget(null)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button onClick={confirmStatusChange} variant="contained" sx={{ background: '#FF6200 !important', color: '#fff !important', '&:hover': { background: '#E65800 !important', boxShadow: 'none' }, boxShadow: 'none' }}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700 }}>Delete Complaint</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#475569' }}>
            Are you sure you want to delete this complaint? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Complaint Details Modal */}
      <Dialog 
        open={Boolean(selectedComplaint)} 
        onClose={() => setSelectedComplaint(null)}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #e2e8f0' }}>
          <Typography component="div" variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Complaint Details
          </Typography>
          <IconButton onClick={() => setSelectedComplaint(null)} size="small" sx={{ color: '#64748b' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedComplaint && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 0.5 }}>
                    COMPLAINT NUMBER C-{selectedComplaint.id}
                  </Typography>
                  <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {selectedComplaint.category?.replace(/_/g, ' ')}
                  </Typography>
                  {selectedComplaint.subject && (
                    <Typography sx={{ color: '#475569', fontSize: '0.9rem', fontFamily: 'var(--font-outfit), sans-serif', mt: 0.5 }}>
                      Subject: {selectedComplaint.subject}
                    </Typography>
                  )}
                </Box>
                <Chip 
                  label={selectedComplaint.status?.replace(/_/g, ' ')} 
                  size="small"
                  sx={{ 
                    bgcolor: getStatusStyle(selectedComplaint.status).bg, 
                    color: getStatusStyle(selectedComplaint.status).text, 
                    fontWeight: 700, 
                    fontFamily: 'var(--font-outfit), sans-serif', 
                    borderRadius: '6px' 
                  }} 
                />
              </Box>

              <Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 1 }}>
                  DESCRIPTION
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#475569', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                    {selectedComplaint.description}
                  </Typography>
                </Paper>
              </Box>

              {(selectedComplaint.adminRemark || selectedComplaint.resolutionNotes) && (
                <Box>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 1 }}>
                    ADMIN REMARK
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px' }}>
                    <Typography sx={{ color: '#92400e', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                      {selectedComplaint.adminRemark || selectedComplaint.resolutionNotes}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 0.5 }}>
                    RAISED BY
                  </Typography>
                  <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {selectedComplaint.raisedBy ? `${selectedComplaint.raisedBy.firstName} ${selectedComplaint.raisedBy.lastName || ''}` : 'Unknown'}
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    Role: {selectedComplaint.raisedBy?.role || 'UNKNOWN'}
                  </Typography>
                </Grid>

                {selectedComplaint.raisedAgainst && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 0.5 }}>
                      RAISED AGAINST
                    </Typography>
                    <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                      {`${selectedComplaint.raisedAgainst.firstName} ${selectedComplaint.raisedAgainst.lastName || ''}`}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                      Role: {selectedComplaint.raisedAgainst.role || 'UNKNOWN'}
                    </Typography>
                  </Grid>
                )}
                
                {selectedComplaint.booking && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 0.5 }}>
                      BOOKING
                    </Typography>
                    <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                      {selectedComplaint.booking.bookingNumber}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                      Service: {selectedComplaint.booking.service?.name || 'Unknown'}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                      Status: {selectedComplaint.booking.status}
                    </Typography>
                  </Grid>
                )}

                {selectedComplaint.resolvedBy && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 0.5 }}>
                      RESOLVED BY
                    </Typography>
                    <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                      {`${selectedComplaint.resolvedBy.firstName} ${selectedComplaint.resolvedBy.lastName || ''}`}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                      Role: {selectedComplaint.resolvedBy.role || 'ADMIN'}
                    </Typography>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 0.5 }}>
                    CREATED AT
                  </Typography>
                  <Typography sx={{ color: '#1e293b', fontWeight: 500, fontSize: '0.9rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 0.5 }}>
                    UPDATED AT
                  </Typography>
                  <Typography sx={{ color: '#1e293b', fontWeight: 500, fontSize: '0.9rem', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {new Date(selectedComplaint.updatedAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>

              {selectedComplaint.evidenceUrls && selectedComplaint.evidenceUrls.length > 0 && (
                <Box>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-outfit), sans-serif', mb: 1 }}>
                    EVIDENCE FILES
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {selectedComplaint.evidenceUrls.map((url: string, index: number) => (
                      <Box 
                        key={index} 
                        component="img" 
                        src={url} 
                        alt="Evidence" 
                        sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setSelectedComplaint(null)} 
            variant="contained" 
            sx={{ 
              textTransform: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              fontFamily: 'var(--font-outfit), sans-serif', 
              boxShadow: 'none', 
              backgroundColor: '#FF6200 !important',
              color: '#fff !important',
              '&:hover': { backgroundColor: '#E65800 !important', boxShadow: 'none' } 
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

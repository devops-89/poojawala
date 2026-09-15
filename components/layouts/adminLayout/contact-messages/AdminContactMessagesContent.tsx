'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Pagination, TextField, InputAdornment, Select, MenuItem, Tabs, Tab
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { 
  getContactMessagesAPI, 
  getContactMessageByIdAPI,
  updateContactMessageStatusAPI, 
  deleteContactMessageAPI 
} from '@/api/contactControllers';
import moment from 'moment';

export default function AdminContactMessagesContent() {
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<{ id: number, status: string } | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [page, search, statusFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getContactMessagesAPI(page, 10, statusFilter === 'ALL' ? undefined : statusFilter, search);
      if (res.success) {
        setMessages(res.data?.data || []);
        setTotalPages(res.data?.totalPages || 1);
      } else {
        showSnackbar(res.message || 'Failed to fetch messages', 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageById = async (id: number) => {
    try {
      const res = await getContactMessageByIdAPI(id);
      if (res.success) {
        setSelectedMessage(res.data?.data || res.data);
        setViewModalOpen(true);
      } else {
        showSnackbar('Failed to fetch message details', 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching message details', 'error');
    }
  };

  const handleStatusChange = async () => {
    if (!statusToChange) return;
    try {
      const res = await updateContactMessageStatusAPI(statusToChange.id, statusToChange.status);
      if (res.success) {
        showSnackbar('Status updated successfully', 'success');
        fetchMessages();
      } else {
        showSnackbar('Failed to update status', 'error');
      }
    } catch (error) {
      showSnackbar('Error updating status', 'error');
    }
    setStatusModalOpen(false);
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    try {
      const res = await deleteContactMessageAPI(messageToDelete);
      if (res.success) {
        showSnackbar('Message deleted successfully', 'success');
        fetchMessages();
      } else {
        showSnackbar('Failed to delete message', 'error');
      }
    } catch (error) {
      showSnackbar('Error deleting message', 'error');
    }
    setDeleteModalOpen(false);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Contact Messages
        </Typography>
        <Typography sx={{ color: '#64748b', mt: 1, fontFamily: 'var(--font-outfit), sans-serif' }}>
          Manage and respond to user inquiries from the contact page.
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', px: 2, py: 1, gap: 2 }}>
          <Tabs 
            value={statusFilter} 
            onChange={(_, newValue) => { setStatusFilter(newValue); setPage(1); }}
            sx={{ 
              '& .MuiTab-root': { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, textTransform: 'none', fontSize: '1rem' },
              '& .Mui-selected': { color: '#FF6200 !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#FF6200' }
            }}
          >
            <Tab label="All Messages" value="ALL" />
            <Tab label="Unread (Draft)" value="DRAFT" />
            <Tab label="Read" value="READ" />
          </Tabs>

          <TextField
            placeholder="Search by name or email..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                sx: { bgcolor: 'white', borderRadius: '12px' }
              }
            }}
            sx={{ width: { xs: '100%', sm: 280, md: 320 } }}
          />
        </Box>

        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-outfit), sans-serif' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-outfit), sans-serif' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-outfit), sans-serif' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-outfit), sans-serif' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-outfit), sans-serif' }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-outfit), sans-serif' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-outfit), sans-serif' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
            ) : messages.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">No messages found.</TableCell></TableRow>
            ) : (
              messages.map((msg, idx) => (
                <TableRow key={msg.id || `msg-${idx}`} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell sx={{ fontWeight: 700, color: '#FF6200', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    CM-{msg.id}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
                    {moment(msg.createdAt).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b', fontFamily: 'var(--font-outfit), sans-serif' }}>
                    {msg.name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
                    {msg.email}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1e293b' }}>
                    {msg.subject}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={msg.status || 'DRAFT'}
                      onChange={(e) => { setStatusToChange({ id: msg.id, status: e.target.value }); setStatusModalOpen(true); }}
                      size="small"
                      sx={{
                        fontFamily: 'var(--font-outfit), sans-serif',
                        fontWeight: 700,
                        borderRadius: '6px',
                        bgcolor: msg.status === 'READ' ? '#dcfce7' : '#fef3c7',
                        color: msg.status === 'READ' ? '#166534' : '#b45309',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiSelect-select': { py: 0.5, px: 2 }
                      }}
                    >
                      <MenuItem value="DRAFT" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 }}>DRAFT</MenuItem>
                      <MenuItem value="READ" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 }}>READ</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Message">
                      <IconButton onClick={() => fetchMessageById(msg.id)} sx={{ color: '#3b82f6' }}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => { setMessageToDelete(msg.id); setDeleteModalOpen(true); }} sx={{ color: '#ef4444' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
        {selectedMessage && (
          <>
            <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b', borderBottom: '1px solid #e2e8f0', pb: 2 }}>
              Message Details
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#64748b', fontSize: '0.85rem', mb: 0.5 }}>From</Typography>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#1e293b', mb: 2 }}>
                {selectedMessage.name} ({selectedMessage.email})
              </Typography>
              
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#64748b', fontSize: '0.85rem', mb: 0.5 }}>Subject</Typography>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#1e293b', mb: 2 }}>
                {selectedMessage.subject}
              </Typography>
              
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#64748b', fontSize: '0.85rem', mb: 0.5 }}>Message</Typography>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </Typography>
              </Paper>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button onClick={() => setViewModalOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
            Are you sure you want to permanently delete this message? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteModalOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#ef4444', color: 'white', '&:hover': { bgcolor: '#dc2626' }, boxShadow: 'none' }}>
            Delete Message
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>Change Status</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
            Are you sure you want to change the status of this message to <b>{statusToChange?.status}</b>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setStatusModalOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained" sx={{ bgcolor: '#FF6200', color: 'white', '&:hover': { bgcolor: '#E65800' }, boxShadow: 'none' }}>
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

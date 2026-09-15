'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box,
  Card,
  Paper,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Grid,
  TablePagination
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ClassIcon from '@mui/icons-material/Class';
import SubjectIcon from '@mui/icons-material/Subject';
import DescriptionIcon from '@mui/icons-material/Description';
import BookIcon from '@mui/icons-material/Book';
import { getComplaintsAPI, getComplaintByIdAPI } from '@/api/bookingControllers';

export enum COMPLAINT_STATUS {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
}

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'OPEN':
      return 'bg-blue-100 text-blue-700';
    case 'UNDER_REVIEW':
      return 'bg-amber-100 text-amber-700';
    case 'RESOLVED':
    case 'CLOSED':
      return 'bg-emerald-100 text-emerald-700';
    case 'REJECTED':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

function ComplaintsTable() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewComplaint = async (id: number) => {
    try {
      setModalOpen(true);
      setLoadingDetails(true);
      const res = await getComplaintByIdAPI(id);
      if (res?.data) {
        // the response is { message: '...', data: { id: ..., ... } } or similar
        // Based on previous JSON, it's usually inside data, let's just handle it depending on structure
        setSelectedComplaint(res.data?.data || res.data);
      }
    } catch (error) {
      console.error('Failed to load complaint details', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getComplaintsAPI(page, limit, statusTab);
      
      if (res?.data?.data) {
        setComplaints(res.data.data);
        setTotalItems(res.data.meta?.total || res.data.data.length);
      } else {
        setComplaints([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusTab]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b', mb: 3 }}>
        Support Complaints
      </Typography>

      <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', boxShadow: 1, mb: 3 }}>
        <Box sx={{ borderBottom: '1px solid #e2e8f0', px: 3, pt: 1, width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
          <Tabs 
            value={statusTab} 
            onChange={(e, val) => { setStatusTab(val); setPage(1); }} 
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ 
              minHeight: '48px',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', minHeight: '48px' },
              '& .Mui-selected': { color: '#FF6200 !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#FF6200' }
            }}
          >
            <Tab label="All" value="ALL" />
            <Tab label="Open" value={COMPLAINT_STATUS.OPEN} />
            <Tab label="Under Review" value={COMPLAINT_STATUS.UNDER_REVIEW} />
            <Tab label="Resolved" value={COMPLAINT_STATUS.RESOLVED} />
            <Tab label="Closed" value={COMPLAINT_STATUS.CLOSED} />
            <Tab label="Rejected" value={COMPLAINT_STATUS.REJECTED} />
          </Tabs>
        </Box>

      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#FF6200' }} />
          </Box>
        ) : complaints.length > 0 ? (
          <>
            <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '24px', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>COMPLAINT ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>B-ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>SUBJECT</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>DATE</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>STATUS</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complaints.map((complaint) => {
                      const dateStr = complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                      
                      return (
                        <TableRow key={complaint.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                            C-{complaint.id}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, color: '#475569' }}>
                            B-{complaint.bookingId}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, color: '#475569' }}>
                            {complaint.subject || complaint.category || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, color: '#475569' }}>
                            {dateStr}
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                              {complaint.status || 'OPEN'}
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => handleViewComplaint(complaint.id)} sx={{ color: '#FF6200' }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Mobile View */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
              {complaints.map((complaint) => {
                const dateStr = complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                
                return (
                  <Card key={complaint.id} variant="outlined" sx={{ borderRadius: '24px', p: 3, bgcolor: 'white', borderColor: '#e2e8f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        C-{complaint.id}
                      </Typography>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status || 'OPEN'}
                      </span>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
                      B-{complaint.bookingId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Subject: {complaint.subject || complaint.category || 'N/A'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Date: {dateStr}
                      </Typography>
                      <Button size="small" onClick={() => handleViewComplaint(complaint.id)} sx={{ color: '#FF6200', textTransform: 'none', fontWeight: 600 }}>
                        View Details
                      </Button>
                    </Box>
                  </Card>
                );
              })}
            </Box>

            {totalItems > 0 && (
              <TablePagination
                component="div"
                count={totalItems}
                page={page - 1}
                onPageChange={(event, newPage) => setPage(newPage + 1)}
                rowsPerPage={limit}
                onRowsPerPageChange={(event) => {
                  setLimit(parseInt(event.target.value, 10));
                  setPage(1);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{ borderTop: '1px solid #e2e8f0', p: 1 }}
              />
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '24px' }}>
            No complaints found.
          </Box>
        )}
      </Box>
    </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Complaint Details
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#FF6200' }} />
            </Box>
          ) : selectedComplaint ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, bgcolor: '#f8fafc', p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>COMPLAINT ID</Typography>
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>
                    C-{selectedComplaint.id}
                  </Typography>
                </Box>
                <Chip label={selectedComplaint.status} size="small" sx={{ fontWeight: 600, ...getStatusColor(selectedComplaint.status).includes('blue') ? { bgcolor: '#dbeafe', color: '#1d4ed8' } : getStatusColor(selectedComplaint.status).includes('emerald') ? { bgcolor: '#d1fae5', color: '#047857' } : getStatusColor(selectedComplaint.status).includes('amber') ? { bgcolor: '#fef3c7', color: '#b45309' } : { bgcolor: '#ffe4e6', color: '#be123c' } }} />
              </Box>

              <Grid container spacing={3}>
                {/* Booking & Service details */}
                {selectedComplaint.booking && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BookIcon fontSize="small" sx={{ color: '#FF6200' }} /> Booking Details
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>BOOKING REF</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{selectedComplaint.booking.bookingNumber}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>SERVICE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {selectedComplaint.booking.service?.iconUrl && <img src={selectedComplaint.booking.service.iconUrl} alt="icon" style={{ width: 16, height: 16, borderRadius: '4px' }} />}
                          {selectedComplaint.booking.service?.name || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>DATE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {selectedComplaint.booking.scheduledAt ? new Date(selectedComplaint.booking.scheduledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>AMOUNT</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>₹{selectedComplaint.booking.finalAmount}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {/* Complaint details */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SubjectIcon fontSize="small" sx={{ color: '#FF6200' }} /> Issue Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 4 } }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ClassIcon sx={{ fontSize: 14 }} /> CATEGORY
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mt: 0.5 }}>
                          {selectedComplaint.category?.replace(/_/g, ' ') || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SubjectIcon sx={{ fontSize: 14 }} /> SUBJECT
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mt: 0.5 }}>
                          {selectedComplaint.subject || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <DescriptionIcon sx={{ fontSize: 14 }} /> DESCRIPTION
                      </Typography>
                      <Typography variant="body2" sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '8px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {selectedComplaint.description || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Evidence */}
                {selectedComplaint.evidenceUrls && selectedComplaint.evidenceUrls.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
                      Evidence Attachments
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {selectedComplaint.evidenceUrls.map((url: string, index: number) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Box
                            component="img"
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            sx={{ 
                              width: 88, 
                              height: 88, 
                              objectFit: 'cover', 
                              borderRadius: '8px', 
                              border: '1px solid #cbd5e1', 
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                              transition: 'all 0.2s',
                              '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' } 
                            }}
                          />
                        </a>
                      ))}
                    </Box>
                  </Grid>
                )}

                {/* Resolution Notes */}
                {selectedComplaint.resolutionNotes && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', p: 2, display: 'flex', gap: 1.5 }}>
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e' }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resolution Notes</Typography>
                        <Typography variant="body2" sx={{ color: '#15803d', mt: 0.5, whiteSpace: 'pre-wrap' }}>
                          {selectedComplaint.resolutionNotes}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No details available.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button onClick={() => setModalOpen(false)} sx={{ color: '#FF6200', textTransform: 'none', fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function SupportContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <ComplaintsTable />
    </Box>
  );
}

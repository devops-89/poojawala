'use client';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClassIcon from '@mui/icons-material/Class';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubjectIcon from '@mui/icons-material/Subject';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton, Pagination,
  Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs,
  Typography,
  Card,
  Chip,
  Tooltip
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import { getComplaintByIdAPI, getComplaintsAPI } from '@/api/bookingControllers';
import RaiseTicketModal from '@/components/widgets/RaiseTicketModal';

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

const getChipStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'OPEN':
      return { bg: '#dbeafe', text: '#1d4ed8' };
    case 'UNDER_REVIEW':
      return { bg: '#fef3c7', text: '#b45309' };
    case 'RESOLVED':
    case 'CLOSED':
      return { bg: '#d1fae5', text: '#047857' };
    case 'REJECTED':
      return { bg: '#fee2e2', text: '#b91c1c' };
    default:
      return { bg: '#f1f5f9', text: '#334155' };
  }
};

export default function CustomerSupportContent() {
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const faqs = [
    { q: 'How do I track my refund?', a: 'Refunds are processed within 3-5 business days. You can track the status in the "My Bookings" section under the specific cancelled puja.' },
    { q: 'Can I reschedule a puja?', a: 'Yes, you can reschedule your puja up to 24 hours before the scheduled time without any extra charges.' },
    { q: 'What if the purohit doesn\'t arrive?', a: 'In the rare event of a no-show, please raise a ticket immediately. We will arrange a replacement or process a full refund.' },
  ];

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getComplaintsAPI(page, limit, statusTab);
      
      const list = res?.data?.data || res?.data?.complaints || [];
      const total = res?.data?.meta?.total || list.length;
      
      if (list.length > 0) {
        setComplaints(list);
        setTotalItems(total);
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

  const handleViewComplaint = async (id: number) => {
    try {
      setModalOpen(true);
      setLoadingDetails(true);
      const res = await getComplaintByIdAPI(id);
      if (res?.data) {
        setSelectedComplaint(res.data?.data || res.data);
      }
    } catch (error) {
      console.error('Failed to load complaint details', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTicketModalClose = () => {
    setTicketModalOpen(false);
    fetchComplaints(); // Refresh tickets after creating one
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
            Support Tickets
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666' }}>
            Manage your issues and contact our support team.
          </Typography>
        </Box>
        <Box 
          component="button"
          onClick={() => setTicketModalOpen(true)}
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#1e293b', 
            color: '#ffffff',
            fontFamily: '"DM Sans", sans-serif',
            textTransform: 'none', 
            borderRadius: '30px',
            fontWeight: 700,
            fontSize: '14px',
            px: 3,
            py: 1.2,
            boxShadow: '0 4px 14px rgba(30, 41, 59, 0.3)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { backgroundColor: '#0f172a', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.4)' }
          }}
        >
          <AddIcon sx={{ fontSize: 20 }} />
          Raise Ticket
        </Box>
      </Box>

      {/* Tickets List */}
      <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 6, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, borderBottom: '1px solid #e2e8f0', px: 3, pt: 2, width: '100%' }}>
          <Box sx={{ maxWidth: '100%', width: '100%', overflowX: 'auto', mt: { xs: 1, sm: 0 }, borderTop: { xs: '1px solid #e2e8f0', sm: 'none' } }}>
            <Tabs 
              value={statusTab} 
              onChange={(e, val) => { setStatusTab(val); setPage(1); }} 
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ 
                minHeight: '48px',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', color: '#64748b', minHeight: '48px' },
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
        </Box>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#FF6200' }} />
            </Box>
          ) : complaints.length > 0 ? (
            <>
              {/* Desktop View (Table) */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>TICKET ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>B-ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>SUBJECT</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>DATE</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>STATUS</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {complaints.map((complaint) => {
                        const dateStr = complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                        
                        return (
                          <TableRow key={complaint.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                            <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>
                              C-{complaint.id}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, color: '#475569', fontFamily: '"DM Sans", sans-serif' }}>
                              B-{complaint.bookingId}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, color: '#475569', fontFamily: '"DM Sans", sans-serif' }}>
                              {complaint.subject || complaint.category || 'N/A'}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, color: '#475569', fontFamily: '"DM Sans", sans-serif' }}>
                              {dateStr}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                                {complaint.status?.replace('_', ' ') || 'UNKNOWN'}
                              </span>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                onClick={() => handleViewComplaint(complaint.id)}
                                sx={{ color: '#FF6200', bgcolor: '#fff5f0', '&:hover': { bgcolor: '#ffe4d6' }, width: 32, height: 32 }}
                              >
                                <VisibilityIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Mobile View (Cards) */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                {complaints.map((complaint) => {
                  const dateStr = complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                  const statusStyle = getChipStatusColor(complaint.status);

                  return (
                    <Card key={complaint.id} variant="outlined" sx={{ borderRadius: '16px', p: 2, bgcolor: 'white', borderColor: '#e2e8f0' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box>
                          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                            {complaint.subject || complaint.category || 'N/A'}
                          </Typography>
                          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '13px', mt: 0.5 }}>
                            Ticket ID: <span style={{ fontWeight: 600, color: '#1e293b' }}>C-{complaint.id}</span>
                          </Typography>
                        </Box>
                        <Chip 
                          label={complaint.status?.replace('_', ' ') || 'UNKNOWN'} 
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
                      </Box>
                      
                      <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Booking ID:</Typography>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>B-{complaint.bookingId}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Date:</Typography>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>{dateStr}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => handleViewComplaint(complaint.id)} size="small" sx={{ color: '#FF6200', bgcolor: '#FFF5F0', '&:hover': { bgcolor: '#FFE0D0' } }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  );
                })}
              </Box>

              {totalItems > limit && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={Math.ceil(totalItems / limit)} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#FF6200', color: '#fff' } }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography sx={{ color: '#64748b', fontSize: 15, fontFamily: '"DM Sans", sans-serif' }}>
                No complaints found for the selected status.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* FAQs Section */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 3 }}>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, idx) => (
            <Accordion key={idx} elevation={0} disableGutters sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#1e293b' }} />} sx={{ p: 2, bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' } }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#334155' }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, py: 3, bgcolor: '#ffffff' }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#475569', lineHeight: 1.6 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      {/* Raise Ticket Modal */}
      <RaiseTicketModal 
        open={ticketModalOpen} 
        onClose={handleTicketModalClose} 
        bookingId={0} 
      />

      {/* Complaint Details Dialog */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, pt: 3, px: 3 }}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', fontFamily: '"DM Sans", sans-serif' }}>
            Complaint Details
          </Typography>
          <IconButton onClick={() => setModalOpen(false)} size="small" sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#FF6200' }} />
            </Box>
          ) : selectedComplaint ? (
            <Grid container spacing={3}>
              <Grid size={{xs:12,md:6}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 0.5, fontFamily: '"DM Sans", sans-serif' }}>STATUS</Typography>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status?.replace('_', ' ') || 'UNKNOWN'}
                    </span>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 0.5, fontFamily: '"DM Sans", sans-serif' }}>COMPLAINT ID</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>
                      C-{selectedComplaint.id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 0.5, fontFamily: '"DM Sans", sans-serif' }}>BOOKING ID</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>
                      B-{selectedComplaint.bookingId}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{xs:12,md:6}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 0.5, fontFamily: '"DM Sans", sans-serif' }}>CATEGORY</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ClassIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                      <Typography sx={{ fontSize: 14, color: '#334155', fontFamily: '"DM Sans", sans-serif' }}>
                        {selectedComplaint.category?.replace('_', ' ') || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 0.5, fontFamily: '"DM Sans", sans-serif' }}>DATE RAISED</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                      <Typography sx={{ fontSize: 14, color: '#334155', fontFamily: '"DM Sans", sans-serif' }}>
                        {selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleString('en-GB') : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{xs:12,md:6}}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={{xs:12,md:6}}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 1, fontFamily: '"DM Sans", sans-serif' }}>SUBJECT</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, bgcolor: '#f8fafc', p: 2, borderRadius: 2 }}>
                  <SubjectIcon sx={{ fontSize: 20, color: '#64748b', mt: 0.2 }} />
                  <Typography sx={{ fontSize: 14, color: '#1e293b', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
                    {selectedComplaint.subject || 'No subject provided'}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{xs:12,md:6}}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 1, fontFamily: '"DM Sans", sans-serif' }}>DESCRIPTION</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, bgcolor: '#f8fafc', p: 2, borderRadius: 2 }}>
                  <DescriptionIcon sx={{ fontSize: 20, color: '#64748b', mt: 0.2 }} />
                  <Typography sx={{ fontSize: 14, color: '#334155', whiteSpace: 'pre-wrap', fontFamily: '"DM Sans", sans-serif' }}>
                    {selectedComplaint.description || 'No description provided'}
                  </Typography>
                </Box>
              </Grid>

              {selectedComplaint.evidenceUrls && selectedComplaint.evidenceUrls.length > 0 && (
                <Grid size={{xs:12,md:6}}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 1, fontFamily: '"DM Sans", sans-serif' }}>ATTACHED EVIDENCE</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                    {selectedComplaint.evidenceUrls.map((url: string, idx: number) => (
                      <Box 
                        key={idx} 
                        component="a" 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          display: 'block',
                          width: 100, 
                          height: 100, 
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          '&:hover': { opacity: 0.8 }
                        }}
                      >
                        <img src={url} alt={`Evidence ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          ) : (
            <Typography sx={{ textAlign: 'center', py: 4, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>
              Complaint details not available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setModalOpen(false)} variant="outlined" sx={{ color: '#475569', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

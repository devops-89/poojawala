'use client';
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";

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
  TablePagination,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ClassIcon from '@mui/icons-material/Class';
import SubjectIcon from '@mui/icons-material/Subject';
import DescriptionIcon from '@mui/icons-material/Description';
import BookIcon from '@mui/icons-material/Book';
import { getComplaintsAPI, getComplaintByIdAPI } from '@/api/bookingControllers';
import { useTicketModalStore } from '@/stores/ticketModalStore';
import { useUserStore } from '@/stores/userStore';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

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
  const [mounted, setMounted] = useState(false);
  const { profile } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAstrologer =
    profile?.role === 'ASTROLOGER' ||
    profile?.user?.role === 'ASTROLOGER' ||
    (mounted && (
      sessionStorage.getItem('role') === 'ASTROLOGER' ||
      sessionStorage.getItem('activeRole') === 'ASTROLOGER' ||
      (() => {
        try {
          return JSON.parse(sessionStorage.getItem('user') || '{}')?.role === 'ASTROLOGER';
        } catch (e) {
          return false;
        }
      })()
    ));

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { openModal } = useTicketModalStore();

  const handleViewComplaint = async (complaintItem: any) => {
    setSelectedComplaint(complaintItem);
    setModalOpen(true);
    setLoadingDetails(true);
    try {
      const res = await getComplaintByIdAPI(complaintItem.id);
      if (res?.data) {
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
      
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.complaints)
        ? res.data.complaints
        : [];
      const total = res?.data?.meta?.total ?? res?.meta?.total ?? list.length;

      setComplaints(list);
      setTotalItems(total);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusTab]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Top Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <AppBreadcrumbs
            items={[
              {
                label: isAstrologer ? "Astrology Bookings" : "Dashboard",
                href: isAstrologer ? "/partner/astrologybookings" : "/partner/dashboard",
              },
              { label: "Get Support" },
            ]}
          />
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: FONTS.OUTFIT_ONLY, 
              fontWeight: 800, 
              color: COLORS.SLATE_DARK, 
              mb: 0.5 
            }}
          >
            Support Complaints
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT_ONLY, color: '#64748b', fontSize: '14px' }}>
            Track your complaint status or raise a new ticket for quick resolution.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openModal(0, undefined, fetchComplaints)}
          sx={{
            backgroundColor: COLORS.PRIMARY,
            color: '#ffffff',
            fontFamily: FONTS.OUTFIT_ONLY,
            textTransform: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '14px',
            px: 2.5,
            py: 1.2,
            boxShadow: '0 4px 14px rgba(255, 98, 0, 0.25)',
            '&:hover': {
              backgroundColor: COLORS.PRIMARY_DARK,
              boxShadow: '0 6px 20px rgba(255, 98, 0, 0.35)',
            },
          }}
        >
          Raise Ticket
        </Button>
      </Box>

      {/* Complaints Box with Tabs */}
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
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontFamily: FONTS.OUTFIT_ONLY, color: COLORS.SLATE_MUTED, minHeight: '48px' },
              '& .Mui-selected': { color: `${COLORS.PRIMARY} !important` },
              '& .MuiTabs-indicator': { backgroundColor: COLORS.PRIMARY }
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
              <CircularProgress sx={{ color: COLORS.PRIMARY }} />
            </Box>
          ) : complaints.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>COMPLAINT ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>BOOKING ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>CATEGORY</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>DATE</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>STATUS</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {complaints.map((complaint) => {
                        const dateStr = complaint.createdAt 
                          ? new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                          : 'N/A';
                        
                        return (
                          <TableRow key={complaint.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                            <TableCell sx={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                              C-{complaint.id}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, color: '#475569' }}>
                              {complaint.bookingId ? (
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.PRIMARY }}>
                                  B-{complaint.bookingId}
                                </Typography>
                              ) : (
                                <Chip 
                                  label="General" 
                                  size="small" 
                                  sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 600, height: '22px' }} 
                                />
                              )}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13 }}>
                              <Chip
                                label={complaint.category?.replace(/_/g, ' ') || 'General Query'}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: '#cbd5e1',
                                  color: '#334155',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  height: '24px',
                                  bgcolor: '#f8fafc',
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, color: '#475569', whiteSpace: 'nowrap' }}>
                              {dateStr}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                                {complaint.status?.replace(/_/g, ' ') || 'OPEN'}
                              </span>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewComplaint(complaint)} 
                                  sx={{ 
                                    color: COLORS.PRIMARY,
                                    bgcolor: '#FFF0E6',
                                    '&:hover': { bgcolor: '#FFE0CC' },
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  <VisibilityIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Mobile View Cards */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                {complaints.map((complaint) => {
                  const dateStr = complaint.createdAt 
                    ? new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                    : 'N/A';
                  
                  return (
                    <Card key={complaint.id} variant="outlined" sx={{ borderRadius: '16px', p: 2.5, bgcolor: 'white', borderColor: '#e2e8f0' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
                          C-{complaint.id}
                        </Typography>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                          {complaint.status?.replace(/_/g, ' ') || 'OPEN'}
                        </span>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={complaint.category?.replace(/_/g, ' ') || 'General Query'}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '11px', height: '22px', fontWeight: 600, borderColor: '#cbd5e1' }}
                        />
                        {complaint.bookingId ? (
                          <Typography variant="caption" sx={{ color: COLORS.PRIMARY, fontWeight: 700 }}>
                            B-{complaint.bookingId}
                          </Typography>
                        ) : (
                          <Chip label="General" size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '11px', height: '22px' }} />
                        )}
                      </Box>

                      <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '14px', mb: 0.5 }}>
                        {complaint.subject || 'No Subject'}
                      </Typography>
                      {complaint.description && (
                        <Typography sx={{ color: '#64748b', fontSize: '13px', mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {complaint.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px solid #f1f5f9' }}>
                        <Typography variant="caption" color="text.secondary">
                          {dateStr}
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => handleViewComplaint(complaint)} 
                          startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                          sx={{ color: COLORS.PRIMARY, textTransform: 'none', fontWeight: 700 }}
                        >
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
                  sx={{ borderTop: '1px solid #e2e8f0', p: 1, mt: 2 }}
                />
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6, color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '16px' }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT_ONLY, fontSize: '16px', fontWeight: 600, color: '#334155', mb: 1 }}>
                No complaints found
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                You have not raised any complaints under this filter.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => openModal(0, undefined, fetchComplaints)}
                sx={{
                  color: COLORS.PRIMARY,
                  borderColor: COLORS.PRIMARY,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': {
                    borderColor: COLORS.PRIMARY_DARK,
                    bgcolor: '#FFF0E6',
                  },
                }}
              >
                Raise a Ticket
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Complaint Details Dialog */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontFamily: FONTS.OUTFIT_ONLY, fontWeight: 800, color: COLORS.SLATE_DARK, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Complaint Details
          <IconButton size="small" onClick={() => setModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails && !selectedComplaint ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: COLORS.PRIMARY }} />
            </Box>
          ) : selectedComplaint ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Header Info */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, bgcolor: '#f8fafc', p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: COLORS.SLATE_MUTED, fontWeight: 600, display: 'block', mb: 0.5 }}>COMPLAINT NUMBER</Typography>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT_ONLY, fontWeight: 700, fontSize: '16px', color: COLORS.SLATE_DARK }}>
                    {selectedComplaint.complaintNumber || `CMP-${selectedComplaint.id}`}
                  </Typography>
                </Box>
                <Chip 
                  label={selectedComplaint.status?.replace(/_/g, ' ') || 'OPEN'} 
                  size="small" 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: '12px',
                    ...(selectedComplaint.status === 'RESOLVED' || selectedComplaint.status === 'CLOSED'
                      ? { bgcolor: '#d1fae5', color: '#047857' }
                      : selectedComplaint.status === 'UNDER_REVIEW'
                      ? { bgcolor: '#fef3c7', color: '#b45309' }
                      : selectedComplaint.status === 'REJECTED'
                      ? { bgcolor: '#ffe4e6', color: '#be123c' }
                      : { bgcolor: '#dbeafe', color: '#1d4ed8' })
                  }} 
                />
              </Box>

              <Grid container spacing={2}>
                {/* Booking details if present */}
                {selectedComplaint.booking ? (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BookIcon fontSize="small" sx={{ color: COLORS.PRIMARY }} /> Booking Details
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>BOOKING REF</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {selectedComplaint.booking.bookingNumber}
                        </Typography>
                      </Box>
                      {selectedComplaint.booking.service && (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>SERVICE</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {selectedComplaint.booking.service?.iconUrl && (
                              <img src={selectedComplaint.booking.service.iconUrl} alt="icon" style={{ width: 16, height: 16, borderRadius: '4px' }} />
                            )}
                            {selectedComplaint.booking.service?.name || 'N/A'}
                          </Typography>
                        </Box>
                      )}
                      {selectedComplaint.booking.scheduledAt && (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>DATE</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {new Date(selectedComplaint.booking.scheduledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      )}
                      {selectedComplaint.booking.finalAmount != null && (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>AMOUNT</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>₹{selectedComplaint.booking.finalAmount}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ClassIcon sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                        General Support Ticket — Not associated with a specific booking.
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Complaint details */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SubjectIcon fontSize="small" sx={{ color: COLORS.PRIMARY }} /> Issue Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 4 } }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ClassIcon sx={{ fontSize: 14 }} /> CATEGORY
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mt: 0.5 }}>
                          {selectedComplaint.category?.replace(/_/g, ' ') || 'General Query'}
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
                      <Typography variant="body2" sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '8px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6, border: '1px solid #f1f5f9' }}>
                        {selectedComplaint.description || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Evidence Attachments */}
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
                {(selectedComplaint.resolutionNotes || selectedComplaint.status === 'RESOLVED') && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Resolution Notes
                        </Typography>
                        {selectedComplaint.resolvedAt && (
                          <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 600 }}>
                            Resolved on: {new Date(selectedComplaint.resolvedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: '#15803d', whiteSpace: 'pre-wrap', fontWeight: 500 }}>
                        {selectedComplaint.resolutionNotes || 'This issue has been marked resolved by the admin team.'}
                      </Typography>
                      {selectedComplaint.resolvedBy && (
                        <Typography variant="caption" sx={{ color: '#166534' }}>
                          Resolved By: {selectedComplaint.resolvedBy.firstName} {selectedComplaint.resolvedBy.lastName || ''} ({selectedComplaint.resolvedBy.email})
                        </Typography>
                      )}
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
          <Button onClick={() => setModalOpen(false)} sx={{ color: COLORS.PRIMARY, textTransform: 'none', fontWeight: 600 }}>
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

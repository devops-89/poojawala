'use client';

import React, { useState, useEffect } from 'react';
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";
import AppTablePagination from "@/components/widgets/AppTablePagination";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  DialogContentText,
  InputAdornment,
} from '@mui/material';
import {
  getPurohitServicesAPI,
  updatePurohitServiceAPI,
  deletePurohitServiceAPI,
} from '@/api/serviceControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { getPurohitPayoutRange } from '@/utils/payoutHelper';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpaIcon from '@mui/icons-material/Spa';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';
import {
  getTablePaginationState,
  syncTablePagination,
} from '@/utils/paginationHelper';

export default function PurohitMyServicesContent() {
  const router = useRouter();
  const initialPagination = getTablePaginationState('portal_my_services_pagination', {
    defaultLimit: 10,
  });

  const [services, setServices] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [editingService, setEditingService] = useState<any>(null);
  const [editOnlinePrice, setEditOnlinePrice] = useState('');
  const [editOfflinePrice, setEditOfflinePrice] = useState('');
  const [editIsOnline, setEditIsOnline] = useState(true);
  const [editIsOffline, setEditIsOffline] = useState(true);
  const [editDurationMinutes, setEditDurationMinutes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [serviceToDelete, setServiceToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(initialPagination.page + 1);
  const [limit, setLimit] = useState(initialPagination.rowsPerPage);
  const [totalItems, setTotalItems] = useState(0);

  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    syncTablePagination(
      'portal_my_services_pagination',
      { page: page - 1, rowsPerPage: limit },
      { defaultLimit: 10 }
    );
  }, [page, limit]);

  const fetchMyServices = async () => {
    try {
      setTableLoading(true);
      const res = await getPurohitServicesAPI(page, limit, debouncedQuery);
      if (res?.data?.data) {
        setServices(res.data.data);
        setTotalItems(res.data.pagination?.total ?? res.data.data.length);
      } else {
        setServices([]);
        setTotalItems(0);
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error loading your services', 'error');
      setServices([]);
      setTotalItems(0);
    } finally {
      setTableLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, [page, limit, debouncedQuery]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/partner/dashboard");
    }
  };

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

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const renderModeChip = (ps: any) => {
    const isOnline = Boolean(ps.service?.isOnline ?? ps.isOnline);
    const isOffline = Boolean(ps.service?.isOffline ?? ps.isOffline);

    if (isOnline && isOffline) {
      return (
        <Chip
          label="Online & Offline"
          size="small"
          sx={{
            bgcolor: "#F3E8FF",
            color: "#7E22CE",
            border: "1px solid #E9D5FF",
            fontWeight: 700,
            fontSize: "11px",
            height: 22,
            borderRadius: "6px",
          }}
        />
      );
    }
    if (isOnline) {
      return (
        <Chip
          label="Online"
          size="small"
          sx={{
            bgcolor: "#EFF6FF",
            color: "#1D4ED8",
            border: "1px solid #DBEAFE",
            fontWeight: 700,
            fontSize: "11px",
            height: 22,
            borderRadius: "6px",
          }}
        />
      );
    }
    if (isOffline) {
      return (
        <Chip
          label="Offline"
          size="small"
          sx={{
            bgcolor: "#FEF3C7",
            color: "#B45309",
            border: "1px solid #FDE68A",
            fontWeight: 700,
            fontSize: "11px",
            height: 22,
            borderRadius: "6px",
          }}
        />
      );
    }
    return (
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontSize: "13px",
          color: "#94A3B8",
        }}
      >
        -
      </Typography>
    );
  };

  const renderEmptyState = () => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, sm: 6 },
        borderRadius: "16px",
        textAlign: "center",
        bgcolor: "#FFFFFF",
        border: "1.5px dashed #CBD5E1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "rgba(255, 98, 0, 0.08)",
          color: COLORS.PRIMARY,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 0.5,
        }}
      >
        <SpaIcon sx={{ fontSize: 30 }} />
      </Box>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          color: "#1E293B",
          fontSize: { xs: "17px", sm: "19px" },
        }}
      >
        {debouncedQuery
          ? "No matching services found"
          : "You haven't added any services yet"}
      </Typography>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          color: "#64748B",
          fontSize: { xs: "13px", sm: "14.5px" },
          maxWidth: 440,
        }}
      >
        {debouncedQuery
          ? `We couldn't find any services matching "${debouncedQuery}". Try clearing your search or checking spelling.`
          : "Add the pujas, rituals, and ceremonies you perform to your profile so clients can find and book your services."}
      </Typography>
      <Button
        variant="contained"
        startIcon={debouncedQuery ? undefined : <AddIcon />}
        onClick={() => {
          if (debouncedQuery) {
            handleSearchChange("");
          } else {
            router.push("/partner/services");
          }
        }}
        sx={{
          mt: 1,
          borderRadius: "12px",
          px: 3,
          py: 0.9,
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          fontSize: "13.5px",
          textTransform: "none",
          bgcolor: `${COLORS.PRIMARY} !important`,
          color: "#FFFFFF !important",
          boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
          "&:hover": {
            bgcolor: `${COLORS.PRIMARY_DARK} !important`,
          },
        }}
      >
        {debouncedQuery ? "Clear Search" : "Browse & Add Services"}
      </Button>
    </Paper>
  );

  if (initialLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748B",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Loading your services...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3, md: 3.5 } }}>
      {/* Header with Breadcrumbs and Back Button */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <AppBreadcrumbs
          items={[
            { label: "Dashboard", href: "/partner/dashboard" },
            { label: "My Services" },
          ]}
          sx={{ mb: 0 }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1E293B",
                fontSize: { xs: "22px", sm: "28px", md: "32px" },
                lineHeight: 1.2,
              }}
            >
              My Services
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#64748B",
                fontSize: { xs: "13px", sm: "14.5px" },
                mt: 0.5,
              }}
            >
              View and manage the services and pujas you offer.
            </Typography>
          </Box>

          <Button
            onClick={handleBack}
            startIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "rgba(255, 98, 0, 0.12)",
                  color: COLORS.PRIMARY,
                  transition: "all 0.25s ease",
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 14 }} />
              </Box>
            }
            sx={{
              color: "#1F1A17",
              bgcolor: "#FFFFFF",
              border: "1.5px solid rgba(255, 98, 0, 0.28)",
              borderRadius: "32px",
              pl: 1.2,
              pr: 2.2,
              py: 0.6,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              boxShadow:
                "0 4px 14px -2px rgba(255, 98, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.04)",
              flexShrink: 0,
              alignSelf: { xs: "flex-start", sm: "auto" },
              transition: "all 0.25s ease",
              "& .MuiButton-startIcon": {
                mr: 1,
              },
              "&:hover": {
                bgcolor: "#FFFFFF",
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
                transform: "translateY(-1px)",
                boxShadow: "0 6px 18px -2px rgba(255, 98, 0, 0.25)",
                "& .MuiButton-startIcon > div": {
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  transform: "translateX(-2px)",
                },
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {/* Search and Action Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <TextField
          placeholder="Search my services..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: tableLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} sx={{ color: COLORS.PRIMARY }} />
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              fontFamily: FONTS.OUTFIT,
              fontSize: '14px',
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              '& fieldset': { border: 'none' },
              '&.Mui-focused': {
                boxShadow: '0 0 0 2px rgba(255, 98, 0, 0.2)',
              },
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/partner/services')}
          sx={{
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            fontFamily: FONTS.OUTFIT,
            px: { xs: 2, sm: 2.75 },
            py: 1,
            background: `${COLORS.PRIMARY} !important`,
            color: '#FFFFFF !important',
            boxShadow: '0 4px 14px rgba(255, 98, 0, 0.3)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            '&:hover': {
              background: `${COLORS.PRIMARY_DARK} !important`,
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 18px rgba(255, 98, 0, 0.4)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Add Service
        </Button>
      </Box>

      {/* Desktop View: Table */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        {tableLoading ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: '16px',
              textAlign: 'center',
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
            }}
          >
            <CircularProgress size={32} sx={{ color: COLORS.PRIMARY, mb: 1.5 }} />
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#64748B', fontWeight: 600 }}>
              Updating services list...
            </Typography>
          </Paper>
        ) : services.length === 0 ? (
          renderEmptyState()
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              overflow: 'hidden',
              bgcolor: '#FFFFFF',
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '12.5px',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      py: 2,
                    }}
                  >
                    Service Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '12.5px',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      py: 2,
                    }}
                  >
                    Mode
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '12.5px',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      py: 2,
                    }}
                  >
                    Service Payout
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '12.5px',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      py: 2,
                    }}
                  >
                    Duration
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '12.5px',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      py: 2,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((ps: any, index: number) => (
                  <TableRow
                    key={ps.id || index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: '#FFFBF7' },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 98, 0, 0.08)',
                            color: COLORS.PRIMARY,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <SpaIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT,
                              fontWeight: 700,
                              fontSize: '14.5px',
                              color: '#1E293B',
                              lineHeight: 1.3,
                            }}
                          >
                            {ps.service?.name || 'Unknown Service'}
                          </Typography>
                          {ps.service?.category?.name && (
                            <Typography
                              sx={{
                                fontFamily: FONTS.OUTFIT,
                                fontSize: '12px',
                                color: '#64748B',
                                mt: 0.25,
                              }}
                            >
                              {ps.service.category.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {renderModeChip(ps)}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: '15px',
                          fontWeight: 800,
                          color: '#16A34A',
                        }}
                      >
                        {getPurohitPayoutRange(ps)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: '14px !important', color: '#64748B !important' }} />}
                        label={`${ps.durationMinutes || ps.service?.durationMinutes || 60} mins`}
                        size="small"
                        sx={{
                          bgcolor: '#F1F5F9',
                          color: '#475569',
                          fontWeight: 600,
                          fontFamily: FONTS.OUTFIT,
                          fontSize: '12px',
                          height: '24px',
                          borderRadius: '8px',
                          '& .MuiChip-icon': { ml: 0.5 },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', py: 2 }}>
                      <Tooltip title="View Service Details">
                        <IconButton
                          size="small"
                          sx={{
                            color: COLORS.PRIMARY,
                            bgcolor: 'rgba(255, 98, 0, 0.08)',
                            mr: 1,
                            '&:hover': {
                              bgcolor: COLORS.PRIMARY,
                              color: '#FFFFFF',
                            },
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() =>
                            router.push(
                              `/partner/services/${
                                ps.service?.slug ||
                                ps.serviceSlug ||
                                ps.serviceId ||
                                ps.service?.id ||
                                ps.id
                              }`
                            )
                          }
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Service">
                        <IconButton
                          size="small"
                          sx={{
                            color: '#EF4444',
                            bgcolor: 'rgba(239, 68, 68, 0.08)',
                            '&:hover': {
                              bgcolor: '#EF4444',
                              color: '#FFFFFF',
                            },
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => handleDeleteClick(ps)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalItems > 0 && (
              <AppTablePagination
                count={totalItems}
                page={page - 1}
                rowsPerPage={limit}
                onPageChange={(newPage) => setPage(newPage + 1)}
                onRowsPerPageChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
                rowsPerPageOptions={[5, 10, 20, 50]}
                itemName="services"
                showRowsPerPage={true}
                sx={{
                  borderTop: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  borderBottomLeftRadius: '16px',
                  borderBottomRightRadius: '16px',
                }}
              />
            )}
          </TableContainer>
        )}
      </Box>

      {/* Mobile View: Cards */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {tableLoading ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: '16px',
              textAlign: 'center',
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
            }}
          >
            <CircularProgress size={32} sx={{ color: COLORS.PRIMARY, mb: 1.5 }} />
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#64748B', fontWeight: 600 }}>
              Updating services list...
            </Typography>
          </Paper>
        ) : services.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {services.map((ps: any, index: number) => (
              <Paper
                key={ps.id || index}
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  p: { xs: 2, sm: 2.5 },
                  bgcolor: '#FFFFFF',
                  border: '1.5px solid #F1F5F9',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(255, 98, 0, 0.3)',
                    boxShadow: '0 6px 20px rgba(255, 98, 0, 0.08)',
                  },
                }}
              >
                {/* Header row: Icon + Name + Duration */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        bgcolor: 'rgba(255, 98, 0, 0.08)',
                        color: COLORS.PRIMARY,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <SpaIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 700,
                          color: '#1E293B',
                          fontSize: '15.5px',
                          lineHeight: 1.3,
                        }}
                      >
                        {ps.service?.name || 'Unknown Service'}
                      </Typography>
                      {ps.service?.category?.name && (
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontSize: '12px',
                            color: '#64748B',
                          }}
                        >
                          {ps.service.category.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: '13px !important', color: '#64748B !important' }} />}
                    label={`${ps.durationMinutes || ps.service?.durationMinutes || 60}m`}
                    size="small"
                    sx={{
                      bgcolor: '#F1F5F9',
                      color: '#475569',
                      fontWeight: 600,
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '11px',
                      height: '24px',
                      flexShrink: 0,
                      borderRadius: '8px',
                      '& .MuiChip-icon': { ml: 0.5 },
                    }}
                  />
                </Box>

                {/* Badges row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {renderModeChip(ps)}
                </Box>

                {/* Payout box */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Est. Payout
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#16A34A',
                    }}
                  >
                    {getPurohitPayoutRange(ps)}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1.25, pt: 0.5 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                    onClick={() =>
                      router.push(
                        `/partner/services/${
                          ps.service?.slug ||
                          ps.serviceSlug ||
                          ps.serviceId ||
                          ps.service?.id ||
                          ps.id
                        }`
                      )
                    }
                    sx={{
                      borderRadius: '10px',
                      py: 0.8,
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '13px',
                      textTransform: 'none',
                      borderColor: 'rgba(255, 98, 0, 0.4)',
                      color: COLORS.PRIMARY,
                      '&:hover': {
                        borderColor: COLORS.PRIMARY,
                        bgcolor: 'rgba(255, 98, 0, 0.05)',
                      },
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(ps)}
                    sx={{
                      borderRadius: '10px',
                      px: 2,
                      py: 0.8,
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: '13px',
                      textTransform: 'none',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      color: '#EF4444',
                      '&:hover': {
                        borderColor: '#EF4444',
                        bgcolor: 'rgba(239, 68, 68, 0.05)',
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </Button>
                </Box>
              </Paper>
            ))}

            {/* Mobile Pagination */}
            {totalItems > 0 && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  bgcolor: '#FFFFFF',
                  mt: 0.5,
                }}
              >
                <AppTablePagination
                  count={totalItems}
                  page={page - 1}
                  rowsPerPage={limit}
                  onPageChange={(newPage) => setPage(newPage + 1)}
                  onRowsPerPageChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                  rowsPerPageOptions={[5, 10, 20]}
                  itemName="services"
                  showRowsPerPage={false}
                  sx={{
                    bgcolor: '#FFFFFF',
                    px: { xs: 1.5, sm: 2 },
                  }}
                />
              </Paper>
            )}
          </>
        )}
      </Box>

      {/* Edit Service Dialog */}
      <Dialog
        open={Boolean(editingService)}
        onClose={handleCloseEditDialog}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '18px',
            width: { xs: 'calc(100% - 32px)', sm: '460px' },
            maxWidth: '100%',
            m: { xs: 2, sm: 'auto' },
            p: { xs: 0.5, sm: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: '#1E293B', fontSize: '18px' }}>
          Edit {editingService?.service?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editIsOnline}
                    onChange={(e) => setEditIsOnline(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.PRIMARY },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: COLORS.PRIMARY,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#475569', fontSize: '14px' }}>
                    Supports Online
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editIsOffline}
                    onChange={(e) => setEditIsOffline(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.PRIMARY },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: COLORS.PRIMARY,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#475569', fontSize: '14px' }}>
                    Supports Offline
                  </Typography>
                }
              />
            </Box>

            {editIsOnline && (
              <TextField
                variant="outlined"
                label="Online Price (₹)"
                type="number"
                fullWidth
                size="small"
                value={editOnlinePrice}
                onChange={(e) => setEditOnlinePrice(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: FONTS.OUTFIT },
                  '& .MuiInputLabel-root': { fontFamily: FONTS.OUTFIT },
                }}
              />
            )}

            {editIsOffline && (
              <TextField
                variant="outlined"
                label="Offline Price (₹)"
                type="number"
                fullWidth
                size="small"
                value={editOfflinePrice}
                onChange={(e) => setEditOfflinePrice(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: FONTS.OUTFIT },
                  '& .MuiInputLabel-root': { fontFamily: FONTS.OUTFIT },
                }}
              />
            )}
            <TextField
              variant="outlined"
              label="Duration (Minutes)"
              type="number"
              fullWidth
              size="small"
              value={editDurationMinutes}
              onChange={(e) => setEditDurationMinutes(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: FONTS.OUTFIT },
                '& .MuiInputLabel-root': { fontFamily: FONTS.OUTFIT },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1, gap: 1 }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{
              color: '#64748B',
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: FONTS.OUTFIT,
              borderRadius: '10px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateSubmit}
            disabled={isUpdating || (!editIsOnline && !editIsOffline) || !editDurationMinutes}
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              px: 3,
              background: `${COLORS.PRIMARY} !important`,
              color: '#FFFFFF !important',
              '&:hover': { background: `${COLORS.PRIMARY_DARK} !important` },
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
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '18px',
            width: { xs: 'calc(100% - 32px)', sm: '420px' },
            maxWidth: '100%',
            m: { xs: 2, sm: 'auto' },
            p: { xs: 1, sm: 1.5 },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: '#1E293B', fontSize: '18px', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <DeleteIcon sx={{ fontSize: 20 }} />
            </Box>
            <span>Remove Service</span>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            component="div"
            sx={{ fontFamily: FONTS.OUTFIT, color: '#475569', fontSize: '14px', lineHeight: 1.5 }}
          >
            Are you sure you want to remove <strong>{serviceToDelete?.service?.name}</strong> from your services? This will remove it from your offerings and customers won't be able to book it from you.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: '#64748B',
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: FONTS.OUTFIT,
              borderRadius: '10px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              px: 3,
              background: '#EF4444 !important',
              color: '#FFFFFF !important',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
              '&:hover': { background: '#DC2626 !important' },
            }}
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
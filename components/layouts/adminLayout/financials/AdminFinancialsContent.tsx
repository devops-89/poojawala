'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TablePagination, CircularProgress, Skeleton } from '@mui/material';
import { getAdminPayoutsAPI, getAdminFinanceStatsAPI } from '@/api/paymentControllers';



import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminFinancialsContent() {
  const initialPagination = getTablePaginationState("admin_financials_state", {
    defaultLimit: 10,
  });

  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);

  const [payouts, setPayouts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    syncTablePagination(
      "admin_financials_state",
      { page, rowsPerPage },
      { defaultLimit: 10 }
    );
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      try {
        const res = await getAdminPayoutsAPI(page + 1, rowsPerPage);
        if (res.success && res.data?.data) {
          setPayouts(res.data.data);
          setTotalCount(res.data.meta?.total || 0);
        }
      } catch (error) {
        console.error('Error fetching admin payouts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await getAdminFinanceStatsAPI();
        const rawStats = res?.data?.data || res?.data;
        if (rawStats) {
          setStats(rawStats);
        }
      } catch (error) {
        console.error('Error fetching admin finance stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: '#1e293b' }}>
          Partner Payouts & Financials
        </Typography>
        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#64748b', mt: 0.5 }}>
          Manage and view all transaction ledger and automated partner payouts
        </Typography>
      </Box>

      {/* Finance Overview Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
        {[
          {
            title: 'Purohit Payout',
            value: statsLoading ? null : (stats?.purohitPayoutAmount != null ? `₹${Number(stats.purohitPayoutAmount).toLocaleString('en-IN')}` : '₹0'),
          },
          {
            title: 'Astrologer Payout',
            value: statsLoading ? null : (stats?.astrologerPayoutAmount != null ? `₹${Number(stats.astrologerPayoutAmount).toLocaleString('en-IN')}` : '₹0'),
          },
          {
            title: 'Pending Payouts',
            value: statsLoading ? null : (stats?.pendingPayoutsCount != null ? String(stats.pendingPayoutsCount) : '0'),
          },
          {
            title: 'Successful Payouts',
            value: statsLoading ? null : (stats?.successfulPayoutsCount != null ? String(stats.successfulPayoutsCount) : '0'),
          },
        ].map((card, idx) => (
          <Paper
            key={idx}
            elevation={0}
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              p: 3,
              cursor: 'default',
              transition: 'transform 0.2s ease-out',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '0.875rem', color: '#64748b' }}>
              {card.title}
            </Typography>
            {statsLoading ? (
              <Skeleton variant="text" width="60%" height={40} sx={{ mt: 1 }} />
            ) : (
              <Typography sx={{ fontFamily: FONTS.OUTFIT, mt: 1, fontSize: '1.875rem', fontWeight: 800, color: COLORS.PRIMARY }}>
                {card.value}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>

      {/* Payout Table */}
      <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", py: 2 }}>
                  Booking ID
                </TableCell>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Partner
                </TableCell>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Payout Date
                </TableCell>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Gross Amount
                </TableCell>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Net Payout
                </TableCell>
                <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from(new Array(5)).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={70} /></TableCell>
                    <TableCell><Skeleton variant="text" width={70} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                  </TableRow>
                ))
              ) : payouts.length > 0 ? (
                payouts.map((txn) => {
                  return (
                    <TableRow
                      key={txn.paymentId}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 }, cursor: "default" }}
                    >
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: 13, fontWeight: 700, color: COLORS.PRIMARY, py: 2 }}>
                        {txn.bookingId ? `B-${txn.bookingId}` : (txn.paymentId ? `B-${txn.paymentId}` : '-')}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={txn.bookingType || '-'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 11,
                            fontFamily: FONTS.OUTFIT,
                            backgroundColor: txn.bookingType === 'ASTROLOGY' ? '#F3E8FF' : '#E0F2FE',
                            color: txn.bookingType === 'ASTROLOGY' ? '#7E22CE' : '#0369A1',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                        {txn.partnerName || "-"}
                      </TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: 13, color: "#475569" }}>
                        {txn.partnerPayoutDate
                          ? new Date(txn.partnerPayoutDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                          : '-'}
                      </TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                        ₹{txn.finalAmount}
                      </TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: 13, fontWeight: 700, color: "#10b981" }}>
                        ₹{txn.payoutAmount}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={txn.partnerPayoutStatus || "-"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 11,
                            fontFamily: FONTS.OUTFIT,
                            backgroundColor:
                              txn.partnerPayoutStatus === 'PAID'
                                ? '#E8F5E9'
                                : txn.partnerPayoutStatus === 'PENDING'
                                  ? '#FFF3E0'
                                  : '#F1F5F9',
                            color:
                              txn.partnerPayoutStatus === 'PAID'
                                ? '#2E7D32'
                                : txn.partnerPayoutStatus === 'PENDING'
                                  ? '#E65100'
                                  : '#475569',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#64748b', fontFamily: FONTS.OUTFIT }}>
                    No payouts found matching your criteria.
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
          sx={{ borderTop: '1px solid #e2e8f0', '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontFamily: FONTS.OUTFIT } }}
        />
      </Paper>
    </Box>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TablePagination, CircularProgress, Skeleton } from '@mui/material';
import { getAdminPayoutsAPI, getAdminFinanceStatsAPI } from '@/api/paymentControllers';

const STATUS_CHIP: Record<string, { label: string; backgroundColor: string; color: string }> = {
  Completed: { label: 'Completed', backgroundColor: '#E8F5E9', color: '#2E7D32' },
  'Pending Payout': { label: 'Pending', backgroundColor: '#FFF3E0', color: '#E65100' },
  Refunded: { label: 'Refunded', backgroundColor: '#FFEBEE', color: '#C62828' }
};

export default function AdminFinancialsContent() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [payouts, setPayouts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

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
        if (res.success && res.data?.data) {
          setStats(res.data.data);
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
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Purohit Payouts & Financials
        </Typography>
        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
          Manage and view all transaction ledger and automated payouts
        </Typography>
      </Box>

      {/* Finance Overview Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
        {[
          { title: 'Total Revenue', value: statsLoading ? null : (stats?.totalRevenue ? `₹${stats.totalRevenue}` : '₹0') },
          { title: 'Purohit Payouts', value: statsLoading ? null : (stats?.purohitPayoutsAmount ? `₹${stats.purohitPayoutsAmount}` : '₹0') },
          { title: 'Pending Transactions', value: statsLoading ? null : (stats?.pendingPayoutsNumber || '0') },
          { title: 'Successful Payouts', value: statsLoading ? null : (stats?.successfulPayoutsNumber || '0') }
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
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.875rem', color: '#64748b' }}>
              {card.title}
            </Typography>
            {statsLoading ? (
              <Skeleton variant="text" width="60%" height={40} sx={{ mt: 1 }} />
            ) : (
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', mt: 1, fontSize: '1.875rem', fontWeight: 800, color: '#FF6200' }}>
                {card.value}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>

      {/* Payout Table */}
      <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", py: 2 }}>
                  TXN ID
                </TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Purohit
                </TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Gross Amount
                </TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Net Payout
                </TableCell>
                <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from(new Array(5)).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={70} /></TableCell>
                    <TableCell><Skeleton variant="text" width={70} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                  </TableRow>
                ))
              ) : payouts.length > 0 ? (
                payouts.map((txn) => {
                  const statusMap: Record<string, string> = {
                    'PAID': 'Completed',
                    'PENDING': 'Pending Payout',
                    'REFUNDED': 'Refunded'
                  };
                  const mappedStatus = statusMap[txn.purohitPayoutStatus] || txn.purohitPayoutStatus;
                  const statusConfig = STATUS_CHIP[mappedStatus] || { label: mappedStatus, backgroundColor: '#f1f5f9', color: '#475569' };

                  return (
                    <TableRow
                      key={txn.paymentId}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 }, cursor: "default" }}
                    >
                      <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 13, fontWeight: 700, color: "#FF6200", py: 2 }}>
                        TXN-{txn.paymentId}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                        {txn.purohitName}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 13, color: "#475569" }}>
                        {txn.purohitPayoutDate ? new Date(txn.purohitPayoutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                        ₹{txn.finalAmount}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 13, fontWeight: 700, color: "#10b981" }}>
                        ₹{txn.payoutAmount}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusConfig.label}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: 11,
                            fontFamily: 'var(--font-outfit), sans-serif',
                            backgroundColor: statusConfig.backgroundColor,
                            color: statusConfig.color,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif' }}>
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
          sx={{ borderTop: '1px solid #e2e8f0', '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontFamily: 'var(--font-outfit), sans-serif' } }}
        />
      </Paper>
    </Box>
  );
}

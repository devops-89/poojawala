'use client';

import { getPaymentsAPI, getPayoutStatsAPI } from '@/api/bookingControllers';
import {
  Box,
  Card,
  Pagination,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
    case 'CREDITED':
      return 'bg-emerald-100 text-emerald-700';
    case 'PENDING':
    case 'PROCESSING':
      return 'bg-amber-100 text-amber-700';
    case 'FAILED':
    case 'REVERSED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

function StatCard({ title, value, change }: { title: string, value: string, change: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 text-sm">{title}</p>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
          {change}
        </span>
      </div>
      <h3 className="mt-4 text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

function StatsGrid() {
  const [stats, setStats] = useState({
    totalEarning: 0,
    thisMonthPayout: 0,
    thisWeekPayout: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getPayoutStatsAPI();
        if (res?.data) {
          const statsData = res.data.data || res.data;
          setStats({
            totalEarning: statsData.totalEarnings || 0,
            thisMonthPayout: statsData.thisMonthEarnings || 0,
            thisWeekPayout: statsData.thisWeekEarnings || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching payout stats:', error);
      }
    };
    fetchStats();
  }, []);

  const displayStats = [
    { title: 'Total Earnings', value: `₹${stats.totalEarning}`, change: 'Overall' },
    { title: 'This Month', value: `₹${stats.thisMonthPayout}`, change: 'Monthly' },
    { title: 'This Week', value: `₹${stats.thisWeekPayout}`, change: 'Weekly' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayStats.map((stat) => (
        <StatCard key={stat.title} title={stat.title} value={stat.value} change={stat.change} />
      ))}
    </div>
  );
}

function TransactionsTable() {
  const [payments, setPayments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPaymentsAPI(page, limit, statusTab);
      
      if (res?.data?.items) {
        setPayments(res.data.items);
        setTotalItems(res.data.pagination?.total || res.data.items.length);
      } else {
        setPayments([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusTab]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm mb-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 px-6 pt-4">
        <h3 className="text-xl font-bold text-slate-900 pb-4 sm:pb-0">
          Transaction History
        </h3>
        <Tabs 
          value={statusTab} 
          onChange={(e, val) => { setStatusTab(val); setPage(1); }} 
          sx={{ 
            minHeight: '48px',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', minHeight: '48px' },
            '& .Mui-selected': { color: '#FF6200 !important' },
            '& .MuiTabs-indicator': { backgroundColor: '#FF6200' }
          }}
        >
          <Tab label="All" value="ALL" />
          <Tab label="Pending" value="PENDING" />
          <Tab label="Paid" value="PAID" />
        </Tabs>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#FF6200]" />
          </div>
        ) : payments.length > 0 ? (
          <>
            <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '24px', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>PAYMENT ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>B-ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>CUSTOMER</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>DATE</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>AMOUNT</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#64748b' }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment) => {
                      const dateStr = new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                      const customerName = payment.customerDetails ? `${payment.customerDetails.firstName} ${payment.customerDetails.lastName}` : 'N/A';
                      
                      return (
                        <TableRow key={payment.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                            PAY-{payment.id}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, color: '#475569' }}>
                            B-{payment.bookingId}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, color: '#475569' }}>
                            {customerName}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, color: '#475569' }}>
                            {dateStr}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                            ₹{payment.purohitPayoutAmount}
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.purohitPayoutStatus)}`}>
                              {payment.purohitPayoutStatus || 'PENDING'}
                            </span>
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
              {payments.map((payment) => {
                const dateStr = new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                const customerName = payment.customerDetails ? `${payment.customerDetails.firstName} ${payment.customerDetails.lastName}` : 'N/A';
                
                return (
                  <Card key={payment.id} variant="outlined" sx={{ borderRadius: '24px', p: 3, bgcolor: 'white', borderColor: '#e2e8f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        PAY-{payment.id}
                      </Typography>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.purohitPayoutStatus)}`}>
                        {payment.purohitPayoutStatus || 'PENDING'}
                      </span>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
                      ₹{payment.purohitPayoutAmount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Booking: B-{payment.bookingId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Customer: {customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Date: {dateStr}
                    </Typography>
                  </Card>
                );
              })}
            </Box>

            {totalItems > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, borderTop: '1px solid #e2e8f0' }}>
                <Pagination
                  count={Math.ceil(totalItems / limit)}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                  sx={{ 
                    '& .MuiPaginationItem-root': { fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600 },
                    '& .Mui-selected': { bgcolor: '#FF6200 !important', color: 'white' }
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-slate-500 border border-slate-200 rounded-[24px]">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}

export default function EarningsContent() {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <TransactionsTable />
    </div>
  );
}

'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";

import { getPaymentsAPI, getPayoutStatsAPI } from '@/api/bookingControllers';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
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
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

const getStatusStyle = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
    case 'CREDITED':
    case 'PAID':
      return { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' };
    case 'PENDING':
    case 'PROCESSING':
      return { bg: '#FFF8E1', text: '#F57C00', border: '#FFE082' };
    case 'FAILED':
    case 'REVERSED':
      return { bg: '#FFEBEE', text: '#D32F2F', border: '#FFCDD2' };
    default:
      return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
  }
};

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

  const statItems = [
    {
      title: 'Total Earnings',
      value: `₹${stats.totalEarning.toLocaleString('en-IN')}`,
      badge: 'Lifetime',
      badgeColor: '#E8F5E9',
      badgeText: '#2E7D32',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: { xs: 26, sm: 30 }, color: '#2E7D32' }} />,
      iconBg: '#E8F5E9',
      isHero: true,
      gridXs: 12,
      gridSm: 4,
    },
    {
      title: 'This Month',
      value: `₹${stats.thisMonthPayout.toLocaleString('en-IN')}`,
      badge: 'Monthly',
      badgeColor: '#E3F2FD',
      badgeText: '#1565C0',
      icon: <CalendarMonthIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: '#1976D2' }} />,
      iconBg: '#E3F2FD',
      isHero: false,
      gridXs: 6,
      gridSm: 4,
    },
    {
      title: 'This Week',
      value: `₹${stats.thisWeekPayout.toLocaleString('en-IN')}`,
      badge: 'Weekly',
      badgeColor: '#FFF3E0',
      badgeText: '#E65100',
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: '#FB8C00' }} />,
      iconBg: '#FFF3E0',
      isHero: false,
      gridXs: 6,
      gridSm: 4,
    },
  ];

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
      {statItems.map((stat, idx) => (
        <Grid size={{ xs: stat.gridXs, sm: stat.gridSm }} key={idx}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: { xs: '16px', sm: '20px' },
              border: stat.isHero ? '1.5px solid #C8E6C9' : '1px solid #E2E8F0',
              bgcolor: stat.isHero ? '#FAFDFB' : '#FFFFFF',
              boxShadow: stat.isHero ? '0 4px 20px rgba(46, 125, 50, 0.08)' : '0 4px 18px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              minHeight: { xs: stat.isHero ? 116 : 108, sm: 124 },
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.07)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  width: { xs: 42, sm: 48 },
                  height: { xs: 42, sm: 48 },
                  borderRadius: '12px',
                  bgcolor: stat.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </Box>
              <Chip
                label={stat.badge}
                size="small"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: '11px',
                  height: '22px',
                  bgcolor: stat.badgeColor,
                  color: stat.badgeText,
                  borderRadius: '6px',
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#64748B',
                  fontSize: { xs: '11.5px', sm: '13px' },
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  mb: 0.25,
                }}
              >
                {stat.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  fontSize: { xs: stat.isHero ? '24px' : '20px', sm: '26px', md: '28px' },
                  color: stat.isHero ? '#1B5E20' : '#1E293B',
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

function TransactionsTable() {
  const [payments, setPayments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
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
    <Paper
      elevation={0}
      sx={{
        borderRadius: { xs: '16px', sm: '22px' },
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        mt: 1,
      }}
    >
      {/* Header and Tabs */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          p: { xs: 2, sm: 2.5 },
          borderBottom: '1px solid #F1F5F9',
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            fontSize: { xs: '18px', sm: '20px' },
            color: '#1E293B',
          }}
        >
          Transaction History
        </Typography>
        <Tabs 
          value={statusTab} 
          onChange={(e, val) => { setStatusTab(val); setPage(1); }} 
          sx={{ 
            minHeight: '40px',
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 700, 
              fontFamily: FONTS.OUTFIT, 
              color: '#64748B', 
              minHeight: '40px',
              fontSize: { xs: '13px', sm: '14px' },
              px: { xs: 1.75, sm: 2.5 },
              py: 0.75,
            },
            '& .Mui-selected': { color: `${COLORS.PRIMARY} !important` },
            '& .MuiTabs-indicator': { backgroundColor: COLORS.PRIMARY, height: '3px', borderRadius: '3px' },
          }}
        >
          <Tab label="All Payouts" value="ALL" />
          <Tab label="Pending" value="PENDING" />
          <Tab label="Paid" value="PAID" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 1.5 }}>
            <CircularProgress sx={{ color: COLORS.PRIMARY }} size={36} />
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#64748B', fontSize: '14px', fontWeight: 500 }}>
              Loading transactions...
            </Typography>
          </Box>
        ) : payments.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '12px', color: '#64748B', letterSpacing: '0.5px' }}>PAYMENT ID</TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '12px', color: '#64748B', letterSpacing: '0.5px' }}>BOOKING ID</TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '12px', color: '#64748B', letterSpacing: '0.5px' }}>CUSTOMER</TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '12px', color: '#64748B', letterSpacing: '0.5px' }}>DATE</TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '12px', color: '#64748B', letterSpacing: '0.5px' }}>PAYOUT AMOUNT</TableCell>
                      <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '12px', color: '#64748B', letterSpacing: '0.5px' }} align="right">STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((payment) => {
                      const dateStr = new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                      const customerName = payment.customerDetails ? `${payment.customerDetails.firstName} ${payment.customerDetails.lastName || ''}`.trim() : 'N/A';
                      const pStatus = payment.partnerPayoutStatus || payment.purohitPayoutStatus || 'PENDING';
                      const statusStyle = getStatusStyle(pStatus);
                      const pAmt = payment.partnerPayoutAmount ?? payment.purohitPayoutAmount ?? 0;
                      
                      return (
                        <TableRow 
                          key={payment.id} 
                          hover 
                          sx={{ 
                            '&:last-child td': { borderBottom: 0 },
                            transition: 'background-color 0.2s',
                          }}
                        >
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13.5px', fontWeight: 700, color: '#1E293B' }}>
                            PAY-{payment.id}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13.5px', color: '#475569', fontWeight: 600 }}>
                            B-{payment.bookingId}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13.5px', color: '#334155', fontWeight: 500 }}>
                            {customerName}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px', color: '#64748B' }}>
                            {dateStr}
                          </TableCell>
                          <TableCell sx={{ fontFamily: FONTS.OUTFIT, fontSize: '15px', fontWeight: 800, color: '#1E293B' }}>
                            ₹{Number(pAmt).toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={pStatus}
                              size="small"
                              sx={{
                                fontFamily: FONTS.OUTFIT,
                                fontWeight: 700,
                                fontSize: '11px',
                                height: '24px',
                                borderRadius: '6px',
                                bgcolor: statusStyle.bg,
                                color: statusStyle.text,
                                border: `1px solid ${statusStyle.border}`,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Mobile Cards View */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
              {payments.map((payment) => {
                const dateStr = new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                const customerName = payment.customerDetails ? `${payment.customerDetails.firstName} ${payment.customerDetails.lastName || ''}`.trim() : 'N/A';
                const pStatus = payment.partnerPayoutStatus || payment.purohitPayoutStatus || 'PENDING';
                const statusStyle = getStatusStyle(pStatus);
                const pAmt = payment.partnerPayoutAmount ?? payment.purohitPayoutAmount ?? 0;
                
                return (
                  <Card 
                    key={payment.id} 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: '16px', 
                      p: 2, 
                      bgcolor: '#FFFFFF', 
                      borderColor: '#E2E8F0',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                      '&:active': { transform: 'scale(0.99)' }
                    }}
                  >
                    {/* Header: Payment ID + Status */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <ReceiptLongIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>
                          PAY-{payment.id}
                        </Typography>
                      </Box>
                      <Chip 
                        label={pStatus} 
                        size="small" 
                        sx={{ 
                          fontFamily: FONTS.OUTFIT, 
                          fontWeight: 700, 
                          fontSize: '11px', 
                          height: '24px', 
                          borderRadius: '8px',
                          bgcolor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`
                        }} 
                      />
                    </Box>

                    {/* Middle Amount Block */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', bgcolor: '#F8FAFC', p: 1.5, borderRadius: '12px', mb: 1.5 }}>
                      <Box>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Payout Amount
                        </Typography>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, fontSize: '20px', color: '#1E293B', lineHeight: 1.15 }}>
                          ₹{Number(pAmt).toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`B-${payment.bookingId}`} 
                        size="small" 
                        sx={{ 
                          fontFamily: FONTS.OUTFIT, 
                          fontWeight: 600, 
                          fontSize: '11.5px', 
                          bgcolor: '#FFFFFF', 
                          color: '#475569',
                          border: '1px solid #E2E8F0',
                          height: '24px',
                          borderRadius: '6px'
                        }} 
                      />
                    </Box>

                    {/* Footer: Customer Name & Date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.25 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, flex: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#94A3B8', flexShrink: 0 }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12.5px', fontWeight: 500, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {customerName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, ml: 1.5 }}>
                        <EventNoteIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12px', color: '#64748B' }}>
                          {dateStr}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>

            {/* Pagination */}
            {totalItems > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: { xs: 2.5, sm: 3 }, mt: { xs: 2, sm: 2.5 }, borderTop: '1px solid #F1F5F9' }}>
                <Pagination
                  count={Math.ceil(totalItems / limit)}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                  size="medium"
                  sx={{ 
                    '& .MuiPaginationItem-root': { fontFamily: FONTS.OUTFIT, fontWeight: 700, borderRadius: '8px' },
                    '& .Mui-selected': { bgcolor: `${COLORS.PRIMARY} !important`, color: 'white' },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 1.5 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1E293B', fontSize: '16px', fontWeight: 700 }}>
              No transactions found
            </Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#64748B', fontSize: '13.5px' }}>
              Completed booking payouts will appear here.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default function EarningsContent() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/partner/dashboard');
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
      <Box>
        <AppBreadcrumbs
          items={[
            { label: "Dashboard", href: "/partner/dashboard" },
            { label: "Payouts & Earnings" },
          ]}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            mt: 1,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1E293B",
                fontSize: { xs: '22px', sm: '28px', md: '32px' },
                lineHeight: 1.2,
              }}
            >
              Earnings & Payouts
            </Typography>
            <Typography
              sx={{ fontFamily: FONTS.OUTFIT, color: "#64748B", mt: 0.5, fontSize: { xs: '13px', sm: '14.5px' } }}
            >
              Track your completed booking payouts and transaction history.
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
              boxShadow: "0 4px 14px -2px rgba(255, 98, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.04)",
              flexShrink: 0,
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
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      <StatsGrid />
      <TransactionsTable />
    </Box>
  );
}
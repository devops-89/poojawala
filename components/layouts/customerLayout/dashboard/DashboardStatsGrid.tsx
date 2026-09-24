'use client';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import NextLink from 'next/link';

interface DashboardStatsGridProps {
  statsData: {
    totalBookings?: number;
    pendingBookings?: number;
    completedBookings?: number;
    totalOrderCount?: number;
    totalOrders?: number;
    totalPendingOrders?: number;
    totalDeliveredOrders?: number;
  };
}

export default function DashboardStatsGrid({ statsData }: DashboardStatsGridProps) {
  const stats = [
    // 1. Booking Stats
    {
      title: 'Total Bookings',
      value: statsData?.totalBookings || 0,
      icon: <EventAvailableIcon sx={{ fontSize: 32, color: '#1565C0' }} />,
      color: '#E3F2FD',
      borderColor: '#BBDEFB',
      valueColor: '#0D47A1',
      badgeText: 'Puja Services',
      badgeColor: '#1565C0',
      badgeBg: '#BBDEFB',
      link: '/customer/bookings',
    },
    {
      title: 'Pending Bookings',
      value: statsData?.pendingBookings || 0,
      icon: <EventIcon sx={{ fontSize: 32, color: '#E65100' }} />,
      color: '#FFF3E0',
      borderColor: '#FFE0B2',
      valueColor: '#BF360C',
      badgeText: 'Awaiting Puja',
      badgeColor: '#E65100',
      badgeBg: '#FFE0B2',
      link: '/customer/bookings',
    },
    {
      title: 'Completed Bookings',
      value: statsData?.completedBookings || 0,
      icon: <HistoryIcon sx={{ fontSize: 32, color: '#2E7D32' }} />,
      color: '#E8F5E9',
      borderColor: '#C8E6C9',
      valueColor: '#1B5E20',
      badgeText: 'Completed',
      badgeColor: '#2E7D32',
      badgeBg: '#C8E6C9',
      link: '/customer/bookings',
    },

    // 2. Product Order Stats
    {
      title: 'Total Orders',
      value: statsData?.totalOrderCount ?? statsData?.totalOrders ?? 0,
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: '#C84B16' }} />,
      color: '#FFF0E6',
      borderColor: '#FFE0D0',
      valueColor: '#9C330B',
      badgeText: 'Samagri Items',
      badgeColor: '#C84B16',
      badgeBg: '#FFDBC8',
      link: '/customer/orders',
    },
    {
      title: 'Pending Orders',
      value: statsData?.totalPendingOrders || 0,
      icon: <AutorenewIcon sx={{ fontSize: 32, color: '#ED6C02' }} />,
      color: '#FFF4E5',
      borderColor: '#FFE0B2',
      valueColor: '#B78103',
      badgeText: 'In Progress',
      badgeColor: '#ED6C02',
      badgeBg: '#FFE0B2',
      link: '/customer/orders',
    },
    {
      title: 'Delivered Orders',
      value: statsData?.totalDeliveredOrders || 0,
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 32, color: '#00838F' }} />,
      color: '#E0F7FA',
      borderColor: '#B2EBF2',
      valueColor: '#006064',
      badgeText: 'Delivered',
      badgeColor: '#00838F',
      badgeBg: '#B2EBF2',
      link: '/customer/orders',
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {stats.map((stat, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
          <NextLink href={stat.link} style={{ textDecoration: 'none' }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: '#FFFBF7',
                border: `1px solid ${stat.borderColor}`,
                boxShadow: '0 4px 18px rgba(44, 24, 16, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                transition: 'all 0.25s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(44, 24, 16, 0.08)',
                  borderColor: stat.badgeColor,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    bgcolor: stat.color,
                    border: `1px solid ${stat.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </Box>
                <Chip
                  label={stat.badgeText}
                  size="small"
                  sx={{
                    bgcolor: stat.badgeBg,
                    color: stat.badgeColor,
                    fontWeight: 800,
                    fontSize: '11px',
                    fontFamily: '"DM Sans", sans-serif',
                    height: 22,
                    borderRadius: '12px',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: '#8C7A70',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    mb: 0.3,
                  }}
                >
                  {stat.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontWeight: 800,
                    fontSize: { xs: '26px', sm: '30px' },
                    color: stat.valueColor,
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Paper>
          </NextLink>
        </Grid>
      ))}
    </Grid>
  );
}

'use client';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import { Box, Grid, Paper, Typography } from '@mui/material';
import NextLink from 'next/link';

interface DashboardStatsGridProps {
  statsData: {
    totalBookings?: number;
    pendingBookings?: number;
    completedBookings?: number;
  };
}

export default function DashboardStatsGrid({ statsData }: DashboardStatsGridProps) {
  const stats = [
    {
      title: 'Total Bookings',
      value: statsData.totalBookings || 0,
      icon: <EventAvailableIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      color: '#E8F5E9',
      link: '/customer/bookings',
    },
    {
      title: 'Pending Bookings',
      value: statsData.pendingBookings || 0,
      icon: <EventIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FFF3E0',
      link: '/customer/bookings',
    },
    {
      title: 'Completed Bookings',
      value: statsData.completedBookings || 0,
      icon: <HistoryIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
      color: '#E3F2FD',
      link: '/customer/bookings',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 5 }}>
      {stats.map((stat, idx) => (
        <Grid size={{ xs: 12, sm: 4, md: 4 }} key={idx}>
          <NextLink href={stat.link} style={{ textDecoration: 'none' }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                border: '1px solid #eee',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: 800,
                    fontSize: '28px',
                    color: '#1A1A1A',
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </NextLink>
        </Grid>
      ))}
    </Grid>
  );
}

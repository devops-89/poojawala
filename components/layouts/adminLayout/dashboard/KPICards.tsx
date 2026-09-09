'use client';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';

interface KPICardsProps {
  stats: any;
  loading: boolean;
}

export default function KPICards({ stats, loading }: KPICardsProps) {
  const kpis = [
    { 
      title: 'Total Revenue', 
      value: stats?.totalRevenue ? `₹ ${stats.totalRevenue.toLocaleString('en-IN')}` : '₹ 0', 
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#4CAF50' }} />, 
      color: '#E8F5E9' 
    },
    { 
      title: 'Total Bookings', 
      value: stats?.totalBookings || '0', 
      icon: <BookOnlineIcon sx={{ fontSize: 40, color: '#FF6200' }} />, 
      color: 'rgba(255, 98, 0, 0.1)' 
    },
    { 
      title: 'Active Purohits', 
      value: stats?.activePurohits || '0', 
      icon: <SupervisorAccountIcon sx={{ fontSize: 40, color: '#2196F3' }} />, 
      color: '#E3F2FD' 
    },
    { 
      title: 'Active Customers', 
      value: stats?.activeCustomers || '0', 
      icon: <PersonIcon sx={{ fontSize: 40, color: '#9C27B0' }} />, 
      color: '#F3E5F5' 
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((kpi, idx) => (
        <Grid size={{xs:12,sm:6,md:3}} key={idx}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: '16px', 
              border: '1px solid #eee', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
              }
            }}
          >
            <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {kpi.icon}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {kpi.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                {loading ? (
                  <Skeleton width="80%" height={32} />
                ) : (
                  <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A' }}>
                    {kpi.value}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

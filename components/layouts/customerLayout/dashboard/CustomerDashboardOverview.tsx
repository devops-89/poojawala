'use client';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Avatar, Box, Button, Card, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMeAPI } from '@/api/authControllers';
import { getCustomerBookingsAPI } from '@/api/bookingControllers';
import { getCustomerDashboardStatsAPI } from '@/api/userControllers';

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return { bg: '#d1fae5', text: '#059669' };
    case 'ACCEPTED': return { bg: '#dbeafe', text: '#2563eb' };
    case 'PENDING': return { bg: '#fef3c7', text: '#d97706' };
    case 'CANCELLED': return { bg: '#fee2e2', text: '#ef4444' };
    case 'ENROUTE': return { bg: '#e0e7ff', text: '#4f46e5' };
    case 'ARRIVED': return { bg: '#fce7f3', text: '#db2777' };
    case 'ONGOING': return { bg: '#e0f2fe', text: '#0284c7' };
    default: return { bg: '#f1f5f9', text: '#64748b' };
  }
};

export default function CustomerDashboardOverview() {
  const router = useRouter();
  const [statsData, setStatsData] = useState<any>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0
  });
  const [profile, setProfile] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    getCustomerDashboardStatsAPI().then(res => {
      if (res?.data) {
        setStatsData(res.data);
      }
    }).catch(console.error);

    getMeAPI().then(res => {
      if (res?.data) {
        setProfile(res.data);
      }
    }).catch(console.error);

    getCustomerBookingsAPI().then(res => {
      if (res?.data?.bookings) {
        // Just take the first 2 bookings for recent display
        setRecentBookings(res.data.bookings.slice(0, 2));
      }
    }).catch(console.error);
  }, []);

  const stats = [
    { title: 'Total Bookings', value: statsData.totalBookings || 0, icon: <EventAvailableIcon sx={{ fontSize: 40, color: '#4CAF50' }} />, color: '#E8F5E9', link: '/customer/bookings' },
    { title: 'Pending Bookings', value: statsData.pendingBookings || 0, icon: <EventIcon sx={{ fontSize: 40, color: '#FF9800' }} />, color: '#FFF3E0', link: '/customer/bookings' },
    { title: 'Completed Bookings', value: statsData.completedBookings || 0, icon: <HistoryIcon sx={{ fontSize: 40, color: '#2196F3' }} />, color: '#E3F2FD', link: '/customer/bookings' }
  ];

  return (
    <Box>
      {/* Profile Hero Card */}
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: '24px', 
          mb: 4, 
          background: 'linear-gradient(135deg, #FF6200 0%, #FF8A3D 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(255, 98, 0, 0.2)'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', textAlign: { xs: 'center', md: 'left' }, gap: { xs: 2, md: 4 } }}>
          <Avatar 
            src={profile?.profileImage || profile?.avatar || undefined} 
            sx={{ width: 100, height: 100, border: '4px solid rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.2)' }} 
          >
            {!profile?.profileImage && !profile?.avatar && <PersonIcon sx={{ fontSize: 70, color: 'white' }} />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mb: 1 }}>
              <Typography variant="h3" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, fontSize: { xs: '24px', md: '32px' } }}>
                Welcome, {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Customer'}!
              </Typography>
              <VerifiedIcon sx={{ color: '#4CAF50', bgcolor: 'white', borderRadius: '50%', fontSize: { xs: 24, md: 28 } }} />
            </Box>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', opacity: 0.9, fontSize: '16px', mb: 2 }}>
              Here is what's happening with your account today.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 3, flexWrap: 'wrap', opacity: 0.9 }}>
              {profile?.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" />
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 500 }}>{profile.email}</Typography>
                </Box>
              )}
              {profile?.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon fontSize="small" />
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', fontWeight: 500 }}>+91 {profile.phone}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {/* Decorative background circle */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '-50%', 
            right: '-5%', 
            width: '300px', 
            height: '300px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 0 
          }} 
        />
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {stats.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 4, md: 4 }} key={idx}>
            <NextLink href={stat.link} style={{ textDecoration: 'none' }}>
              <Paper sx={{ p: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 3, border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' } }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px', fontWeight: 600 }}>{stat.title}</Typography>
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, fontSize: '28px', color: '#1A1A1A' }}>{stat.value}</Typography>
                </Box>
              </Paper>
            </NextLink>
          </Grid>
        ))}
      </Grid>

      {/* Recent Bookings Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Recent Bookings
        </Typography>
        <Button 
          component={NextLink} 
          href="/customer/bookings" 
          endIcon={<ArrowForwardIcon />}
          sx={{ color: '#FF6200', textTransform: 'none', fontWeight: 700 }}
        >
          View All Bookings
        </Button>
      </Box>

      {recentBookings.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: '12px', textAlign: 'center', bgcolor: '#FFF', border: '1px dashed #ccc' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '16px', fontWeight: 600 }}>
            No recent bookings found.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {recentBookings.map((row) => {
            const statusLabel = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() : 'Pending';
            const amt = row.finalAmount ?? row.finalamount;
            const displayAmt = (amt && Number(amt) > 0) ? `₹${amt}` : '-';
            
            return (
              <Grid size={{ xs: 12, md: 6 }} key={row.id}>
                <Card variant="outlined" sx={{ borderRadius: '16px', p: 3, bgcolor: 'white', borderColor: '#e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1e293b', fontSize: '1.2rem' }}>
                      {row.service?.name || 'Puja Service'}
                    </Typography>
                    {(() => {
                      const statusStyle = getStatusColor(row.status);
                      return (
                      <Chip 
                        label={statusLabel} 
                        size="small" 
                        sx={{ 
                          fontWeight: 700, 
                          fontFamily: '"DM Sans", sans-serif',
                          fontSize: '11px',
                          height: '24px',
                          bgcolor: statusStyle.bg,
                          color: statusStyle.text
                        }} 
                      />
                      );
                    })()}
                  </Box>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px', mb: 2 }}>
                    Booking ID: <span style={{ fontWeight: 700, color: '#1e293b' }}>B-{row.id}</span>
                  </Typography>
                  
                  <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon sx={{ color: '#FF6200', fontSize: 18 }} />
                      <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Date:</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>
                      {row.scheduledAt ? new Date(row.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceWalletIcon sx={{ color: '#FF6200', fontSize: 18 }} />
                      <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Amount:</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#333' }}>
                      {displayAmt}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      onClick={() => router.push(`/customer/bookings/${row.id}`)} 
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: '#FF6200', 
                        borderColor: '#FF6200', 
                        textTransform: 'none', 
                        fontWeight: 700,
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#FFF5F0', borderColor: '#FF6200' } 
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

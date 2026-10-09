'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Box, Button, Chip, Grid, Paper, Typography } from '@mui/material';
import NextLink from 'next/link';
import React from 'react';

import { getMeAPI } from '@/api/authControllers';
import { getActiveBookingAPI, getPayoutStatsAPI } from '@/api/bookingControllers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import ErrorIcon from '@mui/icons-material/Error';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Avatar, Card, CardContent, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DashboardContent() {
  const router = useRouter();
  const [statsData, setStatsData] = React.useState<any>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    thisWeekEarnings: 0,
    totalActiveBookings: 0,
    totalCompletedBookings: 0,
    totalActiveServices: 0
  });
  const [profile, setProfile] = React.useState<any>(null);
  const [activeBookings, setActiveBookings] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        const localUser = JSON.parse(userStr);
        if (localUser && (localUser.role === "PUROHIT" || !localUser.role)) {
          setProfile(localUser);
        }
      }
    } catch (e) {}

    getPayoutStatsAPI().then(res => {
      if (res?.data) {
        setStatsData(res.data.data || res.data);
      }
    }).catch(console.error);

    getMeAPI().then(res => {
      if (res?.data) {
        const fetchedUser = res.data.user || res.data.data || res.data;
        if (fetchedUser && (fetchedUser.role === "PUROHIT" || !fetchedUser.role)) {
          setProfile(fetchedUser);
        }
      }
    }).catch(console.error);

    getActiveBookingAPI('ACCEPTED', 1, 4).then(res => {
      if (res?.data?.bookings) {
        setActiveBookings(res.data.bookings);
      }
    }).catch(console.error);
  }, []);

  const verificationStatus =
    profile?.profile?.verificationStatus ||
    profile?.verificationStatus ||
    "";
  const rejReason =
    profile?.profile?.rejectionReason ||
    profile?.rejectionReason ||
    "";
  const isRejected =
    verificationStatus === "REJECTED" || Boolean(rejReason);

  const stats = [
    { title: 'Total Earnings', value: `₹ ${statsData.totalEarnings}`, icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#4CAF50' }} />, color: '#E8F5E9', link: '/purohit/earnings' },
    { title: 'This Month Earnings', value: `₹ ${statsData.thisMonthEarnings}`, icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#4CAF50' }} />, color: '#E8F5E9', link: '/purohit/earnings' },
    { title: 'This Week Earnings', value: `₹ ${statsData.thisWeekEarnings}`, icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#4CAF50' }} />, color: '#E8F5E9', link: '/purohit/earnings' },
    { title: 'Active Bookings', value: statsData.totalActiveBookings, icon: <EventAvailableIcon sx={{ fontSize: 40, color: '#2196F3' }} />, color: '#E3F2FD', link: '/purohit/bookings' },
    { title: 'Completed Pujas', value: statsData.totalCompletedBookings, icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: '#FF9800' }} />, color: '#FFF3E0', link: '/purohit/bookings' },
    { title: 'Active Services', value: statsData.totalActiveServices, icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: '#9C27B0' }} />, color: '#F3E5F5', link: '/purohit/my-services' }
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
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Avatar 
            src={profile?.profileImage || profile?.avatar || undefined} 
            sx={{ width: 100, height: 100, border: '4px solid rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.2)' }} 
          >
            {!profile?.profileImage && !profile?.avatar && <PersonIcon sx={{ fontSize: 70, color: 'white' }} />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h3" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, fontSize: { xs: '24px', md: '32px' } }}>
                Welcome, {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : (profile?.name || 'Purohit')}!
              </Typography>
              {profile?.status === 'APPROVED' && <VerifiedIcon sx={{ color: '#4CAF50', bgcolor: 'white', borderRadius: '50%', fontSize: 28 }} />}
            </Box>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, opacity: 0.9, fontSize: '16px', mb: 2 }}>
              Here's what's happening with your pujas and bookings today.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', opacity: 0.9 }}>
              {profile?.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" />
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '14px', fontWeight: 500 }}>{profile.email}</Typography>
                </Box>
              )}
              {profile?.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon fontSize="small" />
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '14px', fontWeight: 500 }}>+91 {profile.phone}</Typography>
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

      {/* Verification Rejection Alert Card */}
      {isRejected && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: "20px",
            bgcolor: "#FFF0F0",
            border: "2px solid #FFD6D6",
            boxShadow: "0 6px 24px rgba(211, 47, 47, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, flexWrap: "wrap" }}>
            <Box
              sx={{
                bgcolor: "#FFE0E0",
                color: "#D32F2F",
                p: 1.5,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ErrorIcon sx={{ fontSize: 32 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 260 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: "18px",
                    color: "#D32F2F",
                  }}
                >
                  Verification Status: REJECTED
                </Typography>
                <Chip
                  label="Action Required"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: "20px" }}
                />
              </Box>

              {rejReason && (
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#991B1B",
                    mb: 1,
                  }}
                >
                  Rejection Reason: {rejReason}
                </Typography>
              )}

              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "14px",
                  color: "#4B5563",
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                Note: Your profile verification was rejected by Admin. Please update your identity & verification documents in Profile Settings and confirm them so Admin can re-verify your account.
              </Typography>

              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  sessionStorage.setItem("profileActiveTab", "documents");
                  router.push("/purohit/profile/edit");
                }}
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 14px rgba(211, 47, 47, 0.25)",
                  "&:hover": {
                    bgcolor: "#B91C1C",
                  },
                }}
              >
                Update Documents & Confirm
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 4 }} key={idx}>
            <NextLink href={stat.link} style={{ textDecoration: 'none' }}>
              <Paper sx={{ p: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 3, border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' } }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', fontSize: '14px', fontWeight: 600 }}>{stat.title}</Typography>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, fontSize: '28px', color: '#1A1A1A' }}>{stat.value}</Typography>
                </Box>
              </Paper>
            </NextLink>
          </Grid>
        ))}
      </Grid>

      {/* Active Bookings Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A' }}>
          Active Bookings
        </Typography>
        <Button component={NextLink} href="/purohit/bookings" sx={{ color: COLORS.PRIMARY, textTransform: 'none', fontWeight: 700 }}>
          View All Bookings
        </Button>
      </Box>

      {activeBookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px', border: '1px dashed #ccc', bgcolor: '#fafafa' }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666' }}>No active bookings at the moment.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {activeBookings.map((booking: any) => (
            <Grid size={{ xs: 12, md: 6 }} key={booking.id}>
              <Card sx={{ borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }, transition: 'all 0.2s' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, fontSize: '18px', color: '#1A1A1A' }}>
                      {booking.service?.name || 'Puja Service'}
                    </Typography>
                    <Chip label={booking.status || 'ACCEPTED'} size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: '11px', height: '24px', borderRadius: '6px' }} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ bgcolor: '#FFF0E6', p: 1, borderRadius: '8px', display: 'flex' }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                      </Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#444', fontSize: '14px', fontWeight: 500 }}>
                        {booking.scheduledAtIst ? booking.scheduledAtIst.split(',')[0] : (booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString() : 'N/A')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ bgcolor: '#FFF0E6', p: 1, borderRadius: '8px', display: 'flex' }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                      </Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#444', fontSize: '14px', fontWeight: 500 }}>
                        {booking.scheduledAtIst ? booking.scheduledAtIst.split(',')[1]?.trim() : (booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString() : 'N/A')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ bgcolor: '#FFF0E6', p: 1, borderRadius: '8px', display: 'flex' }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                      </Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#444', fontSize: '14px', fontWeight: 500 }} noWrap>
                        {booking.customerAddress?.fullAddress || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Payout</Typography>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontSize: '18px', fontWeight: 800 }}>₹{booking.purohitPayoutAmount || booking.agreedPrice || '0'}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Customer</Typography>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontSize: '14px', fontWeight: 600 }}>{booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim() : 'Customer'}</Typography>
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

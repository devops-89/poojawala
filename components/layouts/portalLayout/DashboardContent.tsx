'use client';
import { FONTS } from "@/utils/fonts";
import { formatScheduledDate, formatScheduledTime } from "@/utils/helpers";
import { COLORS, USER_ROLE } from "@/utils/enums";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Box, Button, Chip, Grid, Paper, Typography, Skeleton } from '@mui/material';
import NextLink from 'next/link';
import React from 'react';

import { getMeAPI } from '@/api/authControllers';
import { getActiveBookingAPI, getPayoutStatsAPI } from '@/api/bookingControllers';
import { useUserStore } from '@/stores/userStore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import ErrorIcon from '@mui/icons-material/Error';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VideocamIcon from '@mui/icons-material/Videocam';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Avatar, Card, CardContent, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DashboardContent() {
  const router = useRouter();
  const { profile: storeProfile, fetchProfile } = useUserStore();
  const [statsData, setStatsData] = React.useState<any>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    thisWeekEarnings: 0,
    totalActiveBookings: 0,
    totalCompletedBookings: 0,
    totalActiveServices: 0
  });

  const [localProfile, setLocalProfile] = React.useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
        if (userStr) {
          const parsed = JSON.parse(userStr);
          if (parsed && (parsed.firstName || parsed.name || parsed.id)) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    return null;
  });

  const profile = localProfile || storeProfile;
  const [isProfileLoading, setIsProfileLoading] = React.useState<boolean>(
    !Boolean(profile?.firstName || profile?.name)
  );
  const [isStatsLoading, setIsStatsLoading] = React.useState<boolean>(true);
  const [isBookingsLoading, setIsBookingsLoading] = React.useState<boolean>(true);
  const [activeBookings, setActiveBookings] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (userStr) {
        const parsed = JSON.parse(userStr);
        if (parsed && (parsed.firstName || parsed.name || parsed.id)) {
          setLocalProfile(parsed);
          setIsProfileLoading(false);
        }
      }
    } catch (e) {}

    fetchProfile()
      .then((res) => {
        if (res) {
          setLocalProfile(res);
          setIsProfileLoading(false);
        }
      })
      .catch(console.error);

    getPayoutStatsAPI()
      .then((res) => {
        const stats = res?.data?.data || res?.data || res?.stats || res;
        if (stats && typeof stats === "object") {
          setStatsData((prev: any) => ({ ...prev, ...stats }));
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsStatsLoading(false);
      });

    getMeAPI()
      .then((res) => {
        const fetchedUser =
          res?.user || res?.data?.user || res?.data?.data || res?.data || res;
        if (
          fetchedUser &&
          (fetchedUser.role === "PUROHIT" ||
            fetchedUser.role === "ASTROLOGER" ||
            !fetchedUser.role)
        ) {
          setLocalProfile(fetchedUser);
          setIsProfileLoading(false);
          try {
            const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
            const localUser = userStr ? JSON.parse(userStr) : {};
            const merged = { ...localUser, ...fetchedUser };
            sessionStorage.setItem("user", JSON.stringify(merged));
            localStorage.setItem("user", JSON.stringify(merged));
          } catch (e) {}
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsProfileLoading(false);
      });

    getActiveBookingAPI("ACCEPTED", 1, 4)
      .then((res) => {
        const bookings =
          res?.data?.bookings ||
          res?.bookings ||
          (Array.isArray(res?.data) ? res.data : []);
        if (bookings && Array.isArray(bookings)) {
          setActiveBookings(bookings);
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsBookingsLoading(false);
      });
  }, [fetchProfile]);

  const verificationStatus = (
    profile?.profile?.verificationStatus ||
    profile?.verificationStatus ||
    profile?.status ||
    ""
  ).toUpperCase();
  const rejReason =
    profile?.profile?.rejectionReason ||
    profile?.rejectionReason ||
    "";
  const isApproved = verificationStatus === "APPROVED" || verificationStatus === "ACTIVE";
  const isRejected =
    Boolean(profile) && (verificationStatus === "REJECTED" || (Boolean(rejReason) && !isApproved));
  const isPending = Boolean(profile) && !isApproved && !isRejected;

  const isAstrologer = profile?.role === USER_ROLE.ASTROLOGER;

  const rawIsAdminCreated =
    profile?.isAdminCreated !== undefined
      ? profile.isAdminCreated
      : profile?.is_admin_created !== undefined
      ? profile.is_admin_created
      : profile?.user?.isAdminCreated !== undefined
      ? profile.user.isAdminCreated
      : profile?.user?.is_admin_created !== undefined
      ? profile.user.is_admin_created
      : false;

  const isAdminCreated = Boolean(rawIsAdminCreated);

  const showIncompleteProfileCard =
    isAdminCreated && isPending && (!profile?.profile?.bio && !profile?.profile?.aadhaarNumber);

  const stats = [
    { title: 'Total Earnings', value: `₹ ${statsData.totalEarnings}`, icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#4CAF50' }} />, color: '#E8F5E9', link: '/partner/earnings' },
    { title: 'This Month Earnings', value: `₹ ${statsData.thisMonthEarnings}`, icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#4CAF50' }} />, color: '#E8F5E9', link: '/partner/earnings' },
    { title: 'This Week Earnings', value: `₹ ${statsData.thisWeekEarnings}`, icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#4CAF50' }} />, color: '#E8F5E9', link: '/partner/earnings' },
    { title: 'Active Bookings', value: statsData.totalActiveBookings, icon: <EventAvailableIcon sx={{ fontSize: 40, color: '#2196F3' }} />, color: '#E3F2FD', link: isAstrologer ? '/partner/astrologybookings?status=Accepted' : '/partner/bookings?tab=1&status=Accepted' },
    { title: isAstrologer ? 'Completed Consultations' : 'Completed Poojas', value: statsData.totalCompletedBookings, icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: '#FF9800' }} />, color: '#FFF3E0', link: isAstrologer ? '/partner/astrologybookings?status=Completed' : '/partner/bookings?tab=1&status=Completed' },
    ...(!isAstrologer
      ? [{ title: 'Active Services', value: statsData.totalActiveServices, icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: '#9C27B0' }} />, color: '#F3E5F5', link: '/partner/my-services' }]
      : [{ title: 'Consultation Rate', value: (profile?.astrologyPrice || profile?.ratePerMinute) ? `₹ ${profile.astrologyPrice || profile.ratePerMinute}` : 'N/A', icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: '#9C27B0' }} />, color: '#F3E5F5', link: '/partner/profile' }])
  ];

  return (
    <Box>
      {/* Profile Hero Card */}
      <Paper 
        sx={{ 
          p: { xs: 2.5, sm: 3, md: 4 }, 
          borderRadius: { xs: '18px', md: '24px' }, 
          mb: { xs: 3, md: 4 }, 
          background: 'linear-gradient(135deg, #FF6200 0%, #FF8A3D 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(255, 98, 0, 0.2)'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: { xs: 2.5, md: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 3 } }}>
            <Avatar 
              src={profile?.profileImage || profile?.avatar || undefined} 
              sx={{ 
                width: { xs: 72, sm: 84, md: 100 }, 
                height: { xs: 72, sm: 84, md: 100 }, 
                border: '3px solid rgba(255,255,255,0.4)', 
                bgcolor: 'rgba(255,255,255,0.2)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }} 
            >
              {!profile?.profileImage && !profile?.avatar && <PersonIcon sx={{ fontSize: { xs: 46, sm: 56, md: 70 }, color: 'white' }} />}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              {isProfileLoading && !profile?.firstName && !profile?.name ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Skeleton variant="rounded" width={220} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} />
                  <Skeleton variant="rounded" width={140} height={18} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25, flexWrap: 'wrap' }}>
                    <Typography variant="h3" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, fontSize: { xs: '20px', sm: '26px', md: '30px' }, lineHeight: 1.2 }}>
                      Welcome, {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : (profile?.name || (isAstrologer ? 'Astrologer' : 'Partner'))}!
                    </Typography>
                    {(isApproved || profile?.status === 'APPROVED') && (
                      <VerifiedIcon sx={{ color: '#4CAF50', bgcolor: 'white', borderRadius: '50%', fontSize: { xs: 22, md: 26 } }} />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 3 }, flexWrap: 'wrap', opacity: 0.95 }}>
                    {profile?.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <EmailIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: { xs: '12.5px', sm: '14px' }, fontWeight: 500 }}>{profile.email}</Typography>
                      </Box>
                    )}
                    {profile?.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <PhoneIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: { xs: '12.5px', sm: '14px' }, fontWeight: 500 }}>+91 {profile.phone}</Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>

          <Button
            component={NextLink}
            href="/partner/profile"
            startIcon={<PersonIcon />}
            sx={{
              alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' },
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: { xs: '13px', sm: '14px' },
              px: { xs: 2.5, md: 3 },
              py: { xs: 0.85, md: 1.1 },
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.28)',
                borderColor: 'white',
                transform: 'translateY(-1px)',
              }
            }}
          >
            My Profile
          </Button>
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
            zIndex: 0,
            pointerEvents: 'none'
          }} 
        />
      </Paper>

      {/* Complete Profile Card for Admin Created Partners */}
      {!isProfileLoading && showIncompleteProfileCard && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: "16px", sm: "20px" },
            bgcolor: "#FFF8E1",
            border: "2px solid #FFE082",
            boxShadow: "0 6px 24px rgba(255, 143, 0, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: { xs: 1.5, sm: 2.5 }, flexDirection: { xs: "column", sm: "row" } }}>
            <Box
              sx={{
                bgcolor: "#FFE8B6",
                color: "#E65100",
                p: { xs: 1.25, sm: 1.5 },
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <PendingActionsIcon sx={{ fontSize: { xs: 26, sm: 32 } }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: { xs: "16px", sm: "18px" },
                    color: "#E65100",
                  }}
                >
                  Action Required: Complete Your Profile
                </Typography>
                <Chip
                  label="Verification Pending"
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: "20px", bgcolor: "#FF9800", color: "#FFF", fontSize: "11px" }}
                />
              </Box>

              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: "13px", sm: "14px" },
                  color: "#4B5563",
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                Your account was created by Admin. Please complete your professional details, qualifications, {isAstrologer ? "astrology specializations, consultation rate" : "rituals, service areas, bank account"}, and upload your identity verification documents to submit your profile for admin approval.
              </Typography>

              <Button
                variant="contained"
                onClick={() => {
                  router.push("/partner/profile/edit");
                }}
                startIcon={<EditIcon />}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: "#FF6200",
                  color: "white",
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                  "&:hover": {
                    bgcolor: "#E05500",
                  },
                }}
              >
                Complete Profile
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Profile Verification Pending Banner */}
      {!isProfileLoading && isPending && !showIncompleteProfileCard && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: "16px", sm: "20px" },
            bgcolor: "#FFF8F1",
            border: "2px solid #FFD8BE",
            boxShadow: "0 6px 24px rgba(255, 98, 0, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: { xs: 1.5, sm: 2.5 }, flexDirection: { xs: "column", sm: "row" } }}>
            <Box
              sx={{
                bgcolor: "#FFE8B6",
                color: "#E65100",
                p: { xs: 1.25, sm: 1.5 },
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <PendingActionsIcon sx={{ fontSize: { xs: 26, sm: 32 } }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: { xs: "16px", sm: "18px" },
                    color: "#C2410C",
                  }}
                >
                  Profile Verification Pending
                </Typography>
                <Chip
                  label="Pending Approval"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: "20px",
                    bgcolor: "#FFEDD5",
                    color: "#C2410C",
                    border: "1px solid #FED7AA",
                    fontSize: "11px",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: "13px", sm: "14px" },
                  color: "#4B5563",
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                Your profile and verification documents are currently under review by our Admin team. Once approved by the Admin, you will start receiving booking requests and your profile will be visible to devotees.
              </Typography>

              <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, flexDirection: { xs: "column", sm: "row" } }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    router.push("/partner/profile");
                  }}
                  startIcon={<PersonIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    borderColor: "#FF6200",
                    color: "#FF6200",
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    borderRadius: "10px",
                    textTransform: "none",
                    px: 2.5,
                    py: 0.8,
                    "&:hover": {
                      borderColor: "#E05500",
                      bgcolor: "#FFF0E6",
                    },
                  }}
                >
                  View Profile
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push("/partner/profile/edit");
                  }}
                  startIcon={<EditIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    bgcolor: "#FF6200",
                    color: "white",
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    borderRadius: "10px",
                    textTransform: "none",
                    px: 2.5,
                    py: 0.8,
                    boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                    "&:hover": {
                      bgcolor: "#E05500",
                    },
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Verification Rejection Alert Card */}
      {!isProfileLoading && isRejected && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: "16px", sm: "20px" },
            bgcolor: "#FFF0F0",
            border: "2px solid #FFD6D6",
            boxShadow: "0 6px 24px rgba(211, 47, 47, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: { xs: 1.5, sm: 2.5 }, flexDirection: { xs: "column", sm: "row" } }}>
            <Box
              sx={{
                bgcolor: "#FFE0E0",
                color: "#D32F2F",
                p: { xs: 1.25, sm: 1.5 },
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ErrorIcon sx={{ fontSize: { xs: 26, sm: 32 } }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: { xs: "16px", sm: "18px" },
                    color: "#D32F2F",
                  }}
                >
                  Verification Status: REJECTED
                </Typography>
                <Chip
                  label="Action Required"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: "20px", fontSize: "11px" }}
                />
              </Box>

              {rejReason && (
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: { xs: "13px", sm: "14px" },
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
                  fontSize: { xs: "13px", sm: "14px" },
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
                  router.push("/partner/profile/edit");
                }}
                startIcon={<EditIcon />}
                sx={{
                  width: { xs: "100%", sm: "auto" },
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

      {/* Stats Cards: Responsive 2-column on mobile, 3-column on tablet/desktop */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {stats.map((stat, idx) => (
          <Grid size={{ xs: 6, sm: 6, md: 4 }} key={idx}>
            <NextLink href={stat.link} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 1.75, sm: 2.25, md: 2.5 }, 
                  borderRadius: { xs: '14px', sm: '16px' }, 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  gap: { xs: 1.25, sm: 2 }, 
                  border: '1px solid #eee', 
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)', 
                  transition: 'all 0.2s ease', 
                  height: '100%',
                  minHeight: { xs: 104, sm: 108 },
                  bgcolor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { 
                    transform: 'translateY(-3px)', 
                    boxShadow: '0 8px 24px rgba(255, 98, 0, 0.1)',
                    borderColor: '#FFD8BE'
                  },
                  '&:active': {
                    transform: 'scale(0.98)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: { xs: 44, sm: 54, md: 60 }, 
                    height: { xs: 44, sm: 54, md: 60 }, 
                    borderRadius: { xs: '12px', sm: '50%' }, 
                    bgcolor: stat.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {React.cloneElement(stat.icon, { 
                    sx: { 
                      fontSize: { xs: 24, sm: 28, md: 34 }, 
                      color: (stat.icon.props as any)?.sx?.color || 'inherit' 
                    } 
                  })}
                </Box>
                <Box sx={{ minWidth: 0, width: '100%', flex: 1 }}>
                  <Typography 
                    sx={{ 
                      fontFamily: FONTS.OUTFIT, 
                      color: '#666', 
                      fontSize: { xs: '11px', sm: '12.5px' }, 
                      fontWeight: 600,
                      lineHeight: 1.2,
                      mb: 0.5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }}
                    noWrap
                  >
                    {stat.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      fontFamily: FONTS.OUTFIT, 
                      fontWeight: 800, 
                      fontSize: { xs: '17px', sm: '22px', md: '26px' }, 
                      color: '#1A1A1A',
                      lineHeight: 1.1
                    }}
                    noWrap
                  >
                    {isStatsLoading ? (
                      <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: '6px', mt: 0.5 }} />
                    ) : (
                      stat.value
                    )}
                  </Typography>
                </Box>
                <ChevronRightIcon 
                  sx={{ 
                    display: { xs: 'none', md: 'block' }, 
                    color: '#ccc', 
                    fontSize: 20,
                    transition: 'all 0.2s',
                    mr: -0.5
                  }} 
                />
              </Paper>
            </NextLink>
          </Grid>
        ))}
      </Grid>

      {/* Active Bookings Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1.5, sm: 2 } }}>
        <Typography variant="h5" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A', fontSize: { xs: '18px', sm: '22px' } }}>
          Active Bookings
        </Typography>
        <Button 
          component={NextLink} 
          href={isAstrologer ? "/partner/astrologybookings" : "/partner/bookings"} 
          sx={{ color: COLORS.PRIMARY, textTransform: 'none', fontWeight: 700, fontFamily: FONTS.OUTFIT, fontSize: { xs: '13px', sm: '14px' }, px: 1 }}
        >
          View All Bookings
        </Button>
      </Box>

      {isBookingsLoading ? (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {[1, 2].map((k) => (
            <Grid size={{ xs: 12, md: 6 }} key={k}>
              <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: { xs: '14px', sm: '16px' }, border: '1px solid #eee' }}>
                <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="35%" height={20} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="rounded" width={110} height={32} sx={{ borderRadius: '8px' }} />
                  <Skeleton variant="rounded" width={110} height={32} sx={{ borderRadius: '8px' }} />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : activeBookings.length === 0 ? (
        <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', borderRadius: { xs: '14px', sm: '16px' }, border: '1px dashed #ccc', bgcolor: '#fafafa' }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', fontSize: { xs: '13.5px', sm: '15px' } }}>
            No active bookings at the moment.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {activeBookings.map((booking: any) => (
            <Grid size={{ xs: 12, md: 6 }} key={booking.id}>
              <Card 
                onClick={() => router.push(isAstrologer ? "/partner/astrologybookings" : "/partner/bookings")}
                sx={{ 
                  borderRadius: { xs: '14px', sm: '16px' }, 
                  border: '1px solid #eee', 
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)', 
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': { 
                    boxShadow: '0 10px 28px rgba(255, 98, 0, 0.1)', 
                    borderColor: '#FFD8BE',
                    transform: 'translateY(-2px)'
                  },
                  '&:active': {
                    transform: 'scale(0.99)'
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, fontSize: { xs: '16px', sm: '18px' }, color: '#1A1A1A', lineHeight: 1.25 }}>
                        {booking.service?.name || 'Pooja Service'}
                      </Typography>
                      {booking.id && (
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12px', color: '#888', fontWeight: 600, mt: 0.25 }}>
                          Booking #{booking.id}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      <Chip label={booking.status || 'ACCEPTED'} size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: '11px', height: '24px', borderRadius: '6px' }} />
                      <ChevronRightIcon sx={{ color: '#bbb', fontSize: 20 }} />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box sx={{ bgcolor: '#FFF0E6', p: 0.75, borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                      </Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#444', fontSize: { xs: '13px', sm: '14px' }, fontWeight: 500 }}>
                        {booking.scheduledAt ? formatScheduledDate(booking.scheduledAt) : 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box sx={{ bgcolor: '#FFF0E6', p: 0.75, borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                      </Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#444', fontSize: { xs: '13px', sm: '14px' }, fontWeight: 500 }}>
                        {booking.scheduledAt ? formatScheduledTime(booking.scheduledAt) : 'N/A'}
                      </Typography>
                    </Box>

                    {(() => {
                      const isBookingOnline = (booking.bookingMode || booking.service?.bookingMode || "").toUpperCase() === "ONLINE";
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                          <Box sx={{ bgcolor: isBookingOnline ? '#EFF6FF' : '#FFF0E6', p: 0.75, borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
                            {isBookingOnline ? (
                              <VideocamIcon sx={{ fontSize: 16, color: '#0284C7' }} />
                            ) : (
                              <LocationOnIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                            )}
                          </Box>
                          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#444', fontSize: { xs: '13px', sm: '14px' }, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {booking.customerAddress?.fullAddress || (isBookingOnline ? 'Online (Video Call)' : 'Address Pending')}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payout</Typography>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontSize: { xs: '16px', sm: '18px' }, fontWeight: 800 }}>₹{booking.purohitPayoutAmount || booking.agreedPrice || '0'}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</Typography>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontSize: { xs: '13px', sm: '14px' }, fontWeight: 600 }}>{booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName || ''}`.trim() : 'Customer'}</Typography>
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

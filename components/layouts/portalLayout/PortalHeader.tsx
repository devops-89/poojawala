'use client';
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Alert,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  ListItemIcon,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CloseIcon from '@mui/icons-material/Close';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useSocketStore } from '@/stores/socketStore';
import { useUserStore } from '@/stores/userStore';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { logoutAPI } from '@/api/authControllers';
import { clearRoleCsrfToken } from '@/api/config';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

interface PortalHeaderProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAstrologer?: boolean;
}

export default function PortalHeader({
  mobileOpen,
  setMobileOpen,
  isAstrologer = false,
}: PortalHeaderProps) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { unreadCount, notifications, clearNotifications } = useSocketStore();
  const { profile, fetchProfile } = useUserStore();

  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [transientAlert, setTransientAlert] = useState({ show: false, msg: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (notifications.length > 0) {
      setTransientAlert({ show: true, msg: notifications[0].message });
      const timer = setTimeout(() => {
        setTransientAlert({ show: false, msg: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications[0]?.id]);

  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleCloseNotif = () => {
    setNotifAnchorEl(null);
    if (unreadCount > 0) {
      clearNotifications();
    }
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (error: any) {
      console.error("Logout notice:", error);
    } finally {
      clearRoleCsrfToken();
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("activeRole");
        localStorage.removeItem("csrfToken");
      }
      useUserStore.getState().clearProfile();
      showSnackbar("Logout successful", "success");
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 300);
    }
  };

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : profile?.name || (isAstrologer ? 'Astrologer' : 'Purohit');

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isAstrologer ? '100%' : { md: `calc(100% - 260px)` },
        ml: isAstrologer ? 0 : { md: `260px` },
        bgcolor: 'white',
        borderBottom: '1px solid #eee',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        height: isAstrologer ? { xs: '62px', md: '72px' } : { xs: '64px', md: '80px' },
        justifyContent: 'center',
        zIndex: (theme) => (isAstrologer ? theme.zIndex.drawer + 1 : theme.zIndex.appBar),
      }}
    >
      <Toolbar
        disableGutters={isAstrologer}
        sx={{
          justifyContent: 'space-between',
          minHeight: isAstrologer
            ? { xs: '62px !important', md: '72px !important' }
            : { xs: '64px !important', md: '80px !important' },
          ...(isAstrologer && {
            width: '100%',
            maxWidth: '1400px',
            mx: 'auto',
            px: { xs: 2, sm: 2.5, md: 4 },
          }),
        }}
      >
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAstrologer ? (
            <Box
              component={NextLink}
              href="/partner/astrologybookings"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Box
                component="img"
                src="/images/1Poojalogo.webp"
                alt="1Pooja"
                sx={{
                  height: { xs: '34px', md: '44px' },
                  maxHeight: '44px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter:
                    'drop-shadow(0.35px 0 0 rgba(211,47,47,0.45)) drop-shadow(-0.35px 0 0 rgba(211,47,47,0.45)) contrast(1.1)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ display: { md: 'none' }, color: '#1A1A1A' }}
              >
                <MenuIcon />
              </IconButton>
              <Box
                component={NextLink}
                href="/partner/dashboard"
                sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', textDecoration: 'none' }}
              >
                <Box
                  component="img"
                  src="/images/1Poojalogo.webp"
                  alt="1Pooja"
                  sx={{
                    height: '32px',
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Right Side: Notifications & Profile Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', gap: 1 }} suppressHydrationWarning>
          <IconButton
            onClick={handleOpenNotif}
            sx={{
              color: '#64748b',
              bgcolor: '#f8fafc',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              invisible={unreadCount === 0}
              sx={{ '& .MuiBadge-badge': { bgcolor: COLORS.PRIMARY, color: 'white' } }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Profile Circle */}
          <Tooltip title="Account Options">
            <IconButton
              onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
              sx={{
                p: 0.5,
                border: '2px solid #FFF0E6',
                transition: 'all 0.2s ease',
                '&:hover': {
                  border: `2px solid ${COLORS.PRIMARY}`,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Avatar
                src={profile?.profileImage || profile?.avatar || undefined}
                sx={{
                  width: { xs: 34, sm: 38 },
                  height: { xs: 34, sm: 38 },
                  bgcolor: COLORS.PRIMARY,
                  cursor: 'pointer',
                }}
              >
                {!profile?.profileImage && !profile?.avatar && (
                  <PersonIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: 'white' }} />
                )}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Transient Alert */}
          {transientAlert.show && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                right: 0,
                mt: 1,
                width: 300,
                zIndex: 1200,
              }}
            >
              <Alert
                severity="info"
                onClose={() => setTransientAlert({ show: false, msg: '' })}
                sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderRadius: '8px' }}
              >
                {transientAlert.msg}
              </Alert>
            </Box>
          )}

          {/* Notifications Menu */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleCloseNotif}
            marginThreshold={12}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  width: { xs: 'calc(100vw - 24px)', sm: 360, md: 380 },
                  maxWidth: { xs: 'calc(100vw - 24px)', sm: 380 },
                  maxHeight: { xs: '80vh', sm: 460 },
                  mt: 1.2,
                  borderRadius: { xs: '14px', sm: '16px' },
                  border: '1px solid #EFE6D5',
                  boxShadow: '0 16px 40px rgba(44, 24, 16, 0.12)',
                  overflow: 'hidden',
                  p: 0,
                  '& .MuiList-root': {
                    p: 0,
                  },
                },
              },
            }}
          >
            <Box
              sx={{
                px: { xs: 2, sm: 2.2 },
                py: 1.5,
                bgcolor: '#FAF4EE',
                borderBottom: '1px solid #EFE6D5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon sx={{ fontSize: 20, color: COLORS.PRIMARY }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: { xs: '15px', sm: '16px' },
                    color: '#1A1A1A',
                  }}
                >
                  Notifications
                </Typography>
                {notifications.length > 0 && (
                  <Chip
                    label={`${notifications.length} New`}
                    size="small"
                    sx={{
                      height: '20px',
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: FONTS.OUTFIT,
                      bgcolor: '#FFEDE0',
                      color: COLORS.PRIMARY,
                      border: '1px solid #FFD4BC',
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                {notifications.length > 0 && (
                  <Button
                    size="small"
                    onClick={clearNotifications}
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '12px',
                      fontWeight: 700,
                      color: COLORS.PRIMARY,
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 1,
                      py: 0.25,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: '#FFEDE0' },
                    }}
                  >
                    Clear All
                  </Button>
                )}
                <IconButton
                  size="small"
                  onClick={handleCloseNotif}
                  sx={{
                    color: '#7A6858',
                    p: 0.5,
                    borderRadius: '6px',
                    '&:hover': { bgcolor: '#F0E6D8' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            {notifications.length === 0 ? (
              <Box
                sx={{
                  py: { xs: 4, sm: 4.5 },
                  px: 3,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 50, sm: 56 },
                    height: { xs: 50, sm: 56 },
                    borderRadius: '50%',
                    bgcolor: '#FFF7ED',
                    border: '1px solid #FFEDD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: '#EA580C' }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: { xs: '14.5px', sm: '15px' },
                    color: '#2C1810',
                    mb: 0.5,
                  }}
                >
                  No new notifications
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 500,
                    fontSize: { xs: '12px', sm: '12.5px' },
                    color: '#8A7A6D',
                    maxWidth: '240px',
                    lineHeight: 1.4,
                  }}
                >
                  Booking requests, reminders, and alerts will appear right here.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: { xs: '60vh', sm: '360px' }, overflowY: 'auto' }}>
                {notifications.map((notif) => (
                  <MenuItem
                    key={notif.id}
                    onClick={handleCloseNotif}
                    sx={{
                      py: 1.5,
                      px: { xs: 2, sm: 2.2 },
                      borderBottom: '1px solid #F5ECE0',
                      whiteSpace: 'normal',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      '&:hover': { bgcolor: '#FFFDF9' },
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: COLORS.PRIMARY,
                        mt: 0.8,
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: { xs: '13px', sm: '13.5px' },
                          fontWeight: 600,
                          color: '#1A1A1A',
                          lineHeight: 1.4,
                          wordBreak: 'break-word',
                        }}
                      >
                        {notif.message}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: '11.5px',
                          color: '#8A7A6D',
                          mt: 0.4,
                        }}
                      >
                        {notif.time}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Box>
            )}
          </Menu>

          {/* User Profile Menu for all Partners */}
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleCloseUserMenu}
            marginThreshold={12}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  width: { xs: 'calc(100vw - 24px)', sm: 260 },
                  maxWidth: { xs: 'calc(100vw - 24px)', sm: 270 },
                  borderRadius: { xs: '14px', sm: '16px' },
                  border: '1px solid #EFE6D5',
                  boxShadow: '0 16px 40px rgba(44, 24, 16, 0.12)',
                  p: 0.5,
                  mt: 1.2,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#1e293b',
                }}
              >
                {displayName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: '#64748b',
                  fontSize: '0.8rem',
                  wordBreak: 'break-all',
                }}
              >
                {profile?.email || ''}
              </Typography>
              <Chip
                label={isAstrologer ? "Astrologer" : "Verified Partner"}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: '#FFF0E6',
                  color: COLORS.PRIMARY,
                  fontWeight: 600,
                  fontSize: '11px',
                  height: '22px',
                }}
              />
            </Box>
            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              component={NextLink}
              href="/partner/profile"
              onClick={handleCloseUserMenu}
              sx={{
                borderRadius: '8px',
                py: 1.2,
                fontFamily: FONTS.OUTFIT,
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              <ListItemIcon sx={{ minWidth: '32px' }}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem
              component={NextLink}
              href="/partner/support"
              onClick={handleCloseUserMenu}
              sx={{
                borderRadius: '8px',
                py: 1.2,
                fontFamily: FONTS.OUTFIT,
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              <ListItemIcon sx={{ minWidth: '32px', color: COLORS.PRIMARY }}>
                <SupportAgentIcon fontSize="small" />
              </ListItemIcon>
              Get Support
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                handleLogout();
              }}
              sx={{
                borderRadius: '8px',
                py: 1.2,
                fontFamily: FONTS.OUTFIT,
                fontSize: '14px',
                fontWeight: 600,
                color: '#dc2626',
                '&:hover': { bgcolor: '#fef2f2' },
              }}
            >
              <ListItemIcon sx={{ minWidth: '32px', color: '#dc2626' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

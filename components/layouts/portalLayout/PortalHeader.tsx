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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useSocketStore } from '@/stores/socketStore';
import { useUserStore } from '@/stores/userStore';
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
  const { unreadCount, notifications, clearNotifications } = useSocketStore();
  const { profile, fetchProfile } = useUserStore();

  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [transientAlert, setTransientAlert] = useState({ show: false, msg: '' });

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
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearRoleCsrfToken();
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/sign-in';
      }
    }
  };

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : isAstrologer
    ? 'Astrologer'
    : 'Purohit';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isAstrologer ? '100%' : { md: `calc(100% - 260px)` },
        ml: isAstrologer ? 0 : { md: `260px` },
        bgcolor: 'white',
        borderBottom: '1px solid #e2e8f0',
        height: '80px',
        justifyContent: 'center',
        zIndex: (theme) => (isAstrologer ? theme.zIndex.drawer + 1 : theme.zIndex.appBar),
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px !important' }}>
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} suppressHydrationWarning>
          {!isAstrologer ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { md: 'none' }, color: '#1A1A1A' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box
              component={NextLink}
              href="/partner/astrologybookings"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Box
                component="img"
                src="/images/1Poojalogo.webp"
                alt="1Pooja"
                sx={{ height: { xs: '30px', md: '38px' }, objectFit: 'contain' }}
              />
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

          {/* Profile Circle (especially for Astrologer or any partner header) */}
          {isAstrologer && (
            <Tooltip title="Account Options">
              <IconButton
                onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
                sx={{
                  p: 0.5,
                  border: '2px solid #FFF0E6',
                  '&:hover': { border: `2px solid ${COLORS.PRIMARY}` },
                }}
              >
                <Avatar
                  src={profile?.profileImage || profile?.avatar || undefined}
                  sx={{ width: 38, height: 38, bgcolor: COLORS.PRIMARY }}
                >
                  {!profile?.profileImage && !profile?.avatar && (
                    <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
                  )}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}

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
            slotProps={{
              paper: {
                sx: {
                  width: 320,
                  maxHeight: 400,
                  mt: 1.5,
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, fontSize: '16px' }}
              >
                Notifications
              </Typography>
              {notifications.length > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: COLORS.PRIMARY, cursor: 'pointer', fontWeight: 600 }}
                  onClick={clearNotifications}
                >
                  Clear All
                </Typography>
              )}
            </Box>
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography sx={{ color: '#94a3b8', fontSize: '14px', fontFamily: FONTS.OUTFIT }}>
                  No new notifications
                </Typography>
              </Box>
            ) : (
              notifications.map((notif) => (
                <MenuItem
                  key={notif.id}
                  sx={{ py: 1.5, borderBottom: '1px solid #f8fafc', whiteSpace: 'normal' }}
                >
                  <ListItemText
                    primary={notif.message}
                    secondary={notif.time}
                    slotProps={{
                      primary: {
                        sx: { fontFamily: FONTS.OUTFIT, fontSize: '14px', color: '#1e293b' },
                      },
                      secondary: { sx: { fontSize: '12px', mt: 0.5 } },
                    }}
                  />
                </MenuItem>
              ))
            )}
          </Menu>

          {/* User Profile Menu for Astrologer */}
          {isAstrologer && (
            <Menu
              anchorEl={userMenuAnchorEl}
              open={Boolean(userMenuAnchorEl)}
              onClose={handleCloseUserMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  sx: {
                    width: 250,
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    p: 0.5,
                    mt: 1.5,
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
                  label="Astrologer"
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
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

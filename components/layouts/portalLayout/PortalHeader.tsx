'use client';
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge, Menu, MenuItem, ListItemText, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSocketStore } from '@/stores/socketStore';

interface PortalHeaderProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PortalHeader({ mobileOpen, setMobileOpen }: PortalHeaderProps) {
  const { unreadCount, notifications, clearNotifications } = useSocketStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [transientAlert, setTransientAlert] = React.useState({ show: false, msg: '' });

  React.useEffect(() => {
    if (notifications.length > 0) {
      setTransientAlert({ show: true, msg: notifications[0].message });
      const timer = setTimeout(() => {
        setTransientAlert({ show: false, msg: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications[0]?.id]);

  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotif = () => {
    setAnchorEl(null);
    if (unreadCount > 0) {
      clearNotifications(); // or at least clear unread count
    }
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        width: { md: `calc(100% - 260px)` },
        ml: { md: `260px` },
        bgcolor: 'white', 
        borderBottom: '1px solid #e2e8f0',
        height: '80px',
        justifyContent: 'center'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { md: 'none' }, color: '#1A1A1A' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ display: { md: 'none' }, color: '#FF6200', fontWeight: 800, fontFamily: 'var(--font-outfit), sans-serif' }}>
            Partner Portal
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <IconButton onClick={handleOpenNotif} sx={{ color: '#64748b', bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' } }}>
            <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0} sx={{ '& .MuiBadge-badge': { bgcolor: '#FF6200', color: 'white' } }}>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {transientAlert.show && (
            <Box sx={{ position: 'absolute', top: '100%', right: 0, mt: 1, width: 300, zIndex: 1200 }}>
              <Alert 
                severity="info" 
                onClose={() => setTransientAlert({ show: false, msg: '' })}
                sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderRadius: '8px' }}
              >
                {transientAlert.msg}
              </Alert>
            </Box>
          )}
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseNotif}
            slotProps={{
              paper: {
                sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: '16px' }}>
                Notifications
              </Typography>
              {notifications.length > 0 && (
                <Typography 
                  variant="caption" 
                  sx={{ color: '#FF6200', cursor: 'pointer', fontWeight: 600 }}
                  onClick={clearNotifications}
                >
                  Clear All
                </Typography>
              )}
            </Box>
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography sx={{ color: '#94a3b8', fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }}>
                  No new notifications
                </Typography>
              </Box>
            ) : (
              notifications.map((notif) => (
                <MenuItem key={notif.id} sx={{ py: 1.5, borderBottom: '1px solid #f8fafc', whiteSpace: 'normal' }}>
                  <ListItemText 
                    primary={notif.message} 
                    secondary={notif.time}
                    slotProps={{
                      primary: { sx: { fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#1e293b' } },
                      secondary: { sx: { fontSize: '12px', mt: 0.5 } }
                    }}
                  />
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

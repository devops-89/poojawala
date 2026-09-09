'use client';
import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PaymentIcon from '@mui/icons-material/Payment';
import { usePathname, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { logoutAPI } from '@/api/authControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useUserStore } from '@/stores/userStore';
interface CustomerSidebarProps {
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomerSidebar({ setMobileOpen }: CustomerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile, fetchProfile } = useUserStore();

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  const handleLogout = async () => {
    try {
      await logoutAPI();
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('csrfToken');
      showSnackbar('Logout successful', 'success');
      setTimeout(() => {
        router.push('/sign-in');
      }, 1000);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/customer/dashboard' },
    { text: 'Services', icon: <EventNoteIcon />, path: '/customer/services' },
    { text: 'My Bookings', icon: <EventNoteIcon />, path: '/customer/bookings' },
    { text: 'My Payments', icon: <PaymentIcon />, path: '/customer/payments' },
    { text: 'Get Support', icon: <SupportAgentIcon />, path: '/customer/get-support' },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff', color: '#1e293b', borderRight: '1px solid #e2e8f0' }}>
      <Box sx={{ height: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#FF6200', lineHeight: 1 }}>
          Poojawala
        </Typography>
        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '12px', color: '#64748b', mt: 0.5, lineHeight: 1 }}>
          Customer Portal
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 2, py: 3, '& .MuiListItemButton-root': { mb: 0.5, borderRadius: '12px' } }}>
        {menuItems.map((item: any) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={NextLink}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  backgroundColor: isActive ? '#FFF0E6' : 'transparent',
                  color: isActive ? '#FF6200' : '#475569',
                  '&:hover': {
                    backgroundColor: isActive ? '#FFF0E6' : '#FAFAFA',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  disableTypography
                  primary={
                    <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: isActive ? 600 : 500, fontSize: '0.95rem' }}>
                      {item.text}
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box 
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ 
          p: 2, 
          m: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          bgcolor: '#f8fafc', 
          borderRadius: '12px', 
          cursor: 'pointer', 
          border: '1px solid #e2e8f0',
          '&:hover': { bgcolor: '#f1f5f9' }, 
          transition: 'background-color 0.2s' 
        }}
      >
        <Avatar src={profile?.profileImage || profile?.avatar || undefined} sx={{ width: 40, height: 40, bgcolor: '#FF6200' }}>
          {!profile?.profileImage && !profile?.avatar && <PersonIcon sx={{ fontSize: 28, color: 'white' }} />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
            {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Customer'}
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', fontSize: '0.75rem' }}>View Options</Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        sx={{
          mt: -1,
          '& .MuiPaper-root': {
            bgcolor: '#ffffff',
            color: '#1e293b',
            width: '230px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0',
            '& .MuiMenuItem-root': { fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', py: 1.5, '&:hover': { bgcolor: '#f1f5f9' }, '& .MuiListItemIcon-root': { color: 'inherit', minWidth: '36px' } }
          }
        }}
      >
          <MenuItem component={NextLink} href="/customer/profile" onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            View Profile
          </MenuItem>
          <MenuItem 
            onClick={(e) => {
              e.preventDefault();
              setAnchorEl(null);
              handleLogout();
            }}
            sx={{ '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1) !important', color: '#F44336 !important' } }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
    </Box>
  );
}

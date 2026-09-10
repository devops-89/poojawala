'use client';
import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Menu, MenuItem, Collapse, Drawer, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EmailIcon from '@mui/icons-material/Email';
import { usePathname, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { logoutAPI } from '@/api/authControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DRAWER_WIDTH = 288;

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const { showSnackbar } = useSnackbarStore();

  const handleLogout = async () => {
    try {
      await logoutAPI();
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('csrfToken');
      showSnackbar('Logout successful', 'success');
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (error) {
      console.error('Logout error', error);
      showSnackbar('Logout failed', 'error');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Bookings', icon: <EventNoteIcon />, path: '/admin/bookings' },
    { text: 'Purohits', icon: <SupervisorAccountIcon />, path: '/admin/purohits' },
    { text: 'Customers', icon: <GroupsIcon />, path: '/admin/users' },
    { text: 'Services', icon: <BookOnlineIcon />, path: '/admin/services' },
    { 
      text: 'Finance', 
      icon: <LocalAtmIcon />, 
      path: '/admin/finance',
      children: [
        { text: 'Booking Settlements', path: '/admin/finance/bookings' },
        { text: 'Purohit Payouts', path: '/admin/finance/payouts' }
      ]
    },
    { text: 'Reviews', icon: <StarBorderIcon />, path: '/admin/reviews' },
    { text: 'Complaints', icon: <ReportProblemIcon />, path: '/admin/complaints' },
    { text: 'Contact Msgs', icon: <EmailIcon />, path: '/admin/contact-messages' },
  ];

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <List sx={{ p: 0, '& .MuiListItemButton-root': { mb: 0.5, borderRadius: '12px' } }}>
          {menuItems.map((item: any) => {
            const hasChildren = !!item.children && item.children.length > 0;
            const isExactActive = pathname === item.path;
            const isChildActive = hasChildren && pathname.startsWith(item.path);
            const active = isExactActive || isChildActive;
            const isExpanded = !!expandedItems[item.path];

            return (
              <Box key={item.path}>
                {hasChildren ? (
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => toggleExpand(item.path)}
                      sx={{
                        backgroundColor: active ? '#FFF0E6' : 'transparent',
                        color: active ? '#FF6200' : '#475569',
                        '&:hover': {
                          backgroundColor: active ? '#FFF0E6' : '#FAFAFA',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        disableTypography 
                        primary={
                          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: active ? 600 : 500, fontSize: '0.95rem' }}>
                            {item.text}
                          </Typography>
                        } 
                      />
                      {isExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                    </ListItemButton>
                  </ListItem>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={NextLink}
                      href={item.path}
                      onClick={onLinkClick}
                      sx={{
                        backgroundColor: active ? '#FFF0E6' : 'transparent',
                        color: active ? '#FF6200' : '#475569',
                        '&:hover': {
                          backgroundColor: active ? '#FFF0E6' : '#FAFAFA',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        disableTypography 
                        primary={
                          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: active ? 600 : 500, fontSize: '0.95rem' }}>
                            {item.text}
                          </Typography>
                        } 
                      />
                    </ListItemButton>
                  </ListItem>
                )}

                {hasChildren && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2.5, mt: 0.5, mb: 1 }}>
                      <Box sx={{ borderLeft: '2px solid #FFF0E6', pl: 1 }}>
                        {item.children?.map((child: any) => {
                          const childActive = pathname === child.path;
                          return (
                            <ListItem key={child.path} disablePadding>
                              <ListItemButton
                                component={NextLink}
                                href={child.path}
                                onClick={onLinkClick}
                                sx={{
                                  borderRadius: '8px',
                                  py: 1,
                                  px: 2,
                                  mb: 0.5,
                                  backgroundColor: childActive ? '#FF6200' : 'transparent',
                                  color: childActive ? '#ffffff' : '#64748b',
                                  boxShadow: childActive ? '0 4px 14px rgba(255, 98, 0, 0.2)' : 'none',
                                  '&:hover': {
                                    backgroundColor: childActive ? '#E65800' : '#FAFAFA',
                                    color: childActive ? '#ffffff' : '#FF6200',
                                  },
                                }}
                              >
                                <ListItemText 
                                  disableTypography 
                                  primary={
                                    <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: childActive ? 600 : 400, fontSize: '0.875rem' }}>
                                      {child.text}
                                    </Typography>
                                  } 
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </Box>
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      {/* Profile Section */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
        <Box 
          onClick={handleProfileClick}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            px: 1, 
            py: 1,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#f1f5f9'
            }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              backgroundColor: '#FF6200', 
              color: 'white', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 600,
              fontSize: '1rem',
              flexShrink: 0,
              fontFamily: 'var(--font-outfit), sans-serif'
            }}
          >
            SA
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }} noWrap>
              Super Admin
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '0.75rem', color: '#64748b' }}>
              System Control
            </Typography>
          </Box>
          <ChevronRightIcon fontSize="small" sx={{ color: '#94a3b8' }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '12px',
              mt: -1,
              width: anchorEl ? anchorEl.clientWidth : 240,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              border: '1px solid #e2e8f0'
            }
          }}
        >
          <MenuItem 
            onClick={(e) => {
              e.preventDefault();
              handleProfileClose();
              handleLogout();
            }}
            sx={{ 
              color: '#dc2626',
              fontWeight: 500,
              fontSize: '0.95rem',
              fontFamily: 'var(--font-outfit), sans-serif',
              display: 'flex',
              gap: 1.5,
              py: 1.5
            }}
          >
            <LogoutIcon fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            zIndex: 1000
          },
        }}
      >
        <Box sx={{ height: 80, px: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#FF6200', lineHeight: 1.2 }}>
            Poojawala
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
            Admin Portal
          </Typography>
        </Box>
        <SidebarContent />
      </Drawer>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          zIndex: 1300,
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            maxWidth: '85vw',
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#FF6200', lineHeight: 1.2 }}>
              Poojawala
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
              Admin Portal
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#FF6200', '&:hover': { backgroundColor: '#FFF0E6' } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <SidebarContent onLinkClick={onClose} />
      </Drawer>
    </>
  );
}

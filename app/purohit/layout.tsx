'use client';
import { Box, Drawer } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import PortalSidebar from '@/components/layouts/portalLayout/PortalSidebar';
import PortalHeader from '@/components/layouts/portalLayout/PortalHeader';
import SocketProvider from '@/components/providers/SocketProvider';

const drawerWidth = 260;

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    let isAuthorized = false;
    let userObj: any = null;

    if (userStr) {
      try {
        userObj = JSON.parse(userStr);
        if (userObj.role === 'PUROHIT') {
          isAuthorized = true;
        }
      } catch (e) {}
    }

    if (pathname === '/purohit' || pathname === '/purohit/register') {
      if (isAuthorized) {
        if (userObj?.isAdminCreated || userObj?.is_admin_created) {
          // If admin created, allow step 2 registration if on register route
          if (pathname !== '/purohit/register') {
            router.replace('/purohit/register?step=2');
          }
        } else {
          router.replace('/purohit/dashboard');
        }
      }
    } else {
      if (!isAuthorized) {
        router.replace('/sign-in');
      }
    }
  }, [pathname, router]);

  // Do not show sidebar on the login or registration page
  if (pathname === '/purohit' || pathname === '/purohit/register') {
    return <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh' }}>{children}</Box>;
  }

  return (
    <SocketProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
        <PortalHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Sidebar */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
            }}
          >
            <PortalSidebar setMobileOpen={setMobileOpen} />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
            }}
            open
          >
            <PortalSidebar setMobileOpen={setMobileOpen} />
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 5 }, 
          mt: { xs: 12, md: 12 }, 
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '100vw',
          overflowX: 'hidden'
        }}>
          {children}
        </Box>
      </Box>
    </SocketProvider>
  );
}

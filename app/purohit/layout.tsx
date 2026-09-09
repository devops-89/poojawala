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
    if (pathname !== '/purohit' && pathname !== '/purohit/register') {
      const userStr = sessionStorage.getItem('user');
      let isAuthorized = false;
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'PUROHIT') {
            isAuthorized = true;
          }
        } catch (e) {}
      }

      if (!isAuthorized) {
        router.push('/purohit');
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

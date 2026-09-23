'use client';
import React, { useState } from 'react';
import { Box, Drawer } from '@mui/material';
import CustomerSidebar from '@/components/layouts/customerLayout/CustomerSidebar';
import CustomerHeader from '@/components/layouts/customerLayout/CustomerHeader';
import SocketProvider from '@/components/providers/SocketProvider';
import CustomerCartDrawer from '@/components/widgets/CustomerCartDrawer';
import RaiseTicketModal from '@/components/widgets/RaiseTicketModal';

const drawerWidth = 260;

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SocketProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FFFDF9' }}>
        <CustomerHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

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
          <CustomerSidebar setMobileOpen={setMobileOpen} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
          }}
          open
        >
          <CustomerSidebar setMobileOpen={setMobileOpen} />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 2, sm: 3, md: 5 }, 
        mt: { xs: 10, md: 10 }, 
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        {children}
      </Box>
      <RaiseTicketModal />
      <CustomerCartDrawer />
    </Box>
    </SocketProvider>
  );
}

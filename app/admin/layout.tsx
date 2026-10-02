'use client';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/layouts/adminLayout/AdminSidebar';
import AdminHeader from '@/components/layouts/adminLayout/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    let isAuthorized = false;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'SUPERADMIN') {
          isAuthorized = true;
        }
      } catch (e) {}
    }

    if (pathname === '/admin') {
      if (isAuthorized) {
        router.replace('/admin/dashboard');
      }
    } else {
      if (!isAuthorized) {
        router.replace('/admin');
      } else {
        // Prevent back button from going back to login page
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
          window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      }
    }
  }, [pathname, router]);

  // Do not show sidebar on the login page
  if (pathname === '/admin') {
    return <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>{children}</Box>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <Box 
          onClick={() => setSidebarOpen(false)}
          sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: { lg: 'none' } }}
        />
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3, lg: 4 }, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

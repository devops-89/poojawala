'use client';
import { Box, Drawer } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import PortalSidebar from '@/components/layouts/portalLayout/PortalSidebar';
import PortalHeader from '@/components/layouts/portalLayout/PortalHeader';
import SocketProvider from '@/components/providers/SocketProvider';
import { useUserStore } from '@/stores/userStore';
import { USER_ROLE } from '@/utils/enums';

const drawerWidth = 260;

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Determine active role from store or session storage
  const activeRole =
    profile?.role ||
    profile?.user?.role ||
    (() => {
      if (typeof window !== 'undefined') {
        try {
          const u = JSON.parse(sessionStorage.getItem('user') || '{}');
          return u?.role;
        } catch (e) {
          return null;
        }
      }
      return null;
    })();

  const isAstrologer = activeRole === USER_ROLE.ASTROLOGER || activeRole === 'ASTROLOGER';

  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    let isAuthorized = false;
    let userObj: any = null;

    if (userStr) {
      try {
        userObj = JSON.parse(userStr);
        if (userObj.role === 'PUROHIT' || userObj.role === 'ASTROLOGER') {
          isAuthorized = true;
          const currentRole = userObj.role === 'ASTROLOGER' || isAstrologer ? 'ASTROLOGER' : 'PUROHIT';
          sessionStorage.setItem('activeRole', currentRole);
          sessionStorage.setItem('role', currentRole);
        }
      } catch (e) {}
    }

    if (pathname === '/partner' || pathname === '/partner/register') {
      if (isAuthorized) {
        if (userObj.role === 'ASTROLOGER' || isAstrologer) {
          router.replace('/partner/astrologybookings');
        } else {
          router.replace('/partner/dashboard');
        }
      }
    } else {
      if (!isAuthorized) {
        router.replace('/sign-in');
      } else if (userObj?.role === 'ASTROLOGER' || isAstrologer) {
        // If astrologer tries to go to any page other than astrologybookings or profile:
        const allowedAstrologerPaths = [
          '/partner/astrologybookings',
          '/partner/profile',
          '/partner/profile/edit',
        ];
        const isAllowed = allowedAstrologerPaths.some(
          (p) => pathname === p || pathname.startsWith(p + '/')
        );
        if (!isAllowed) {
          router.replace('/partner/astrologybookings');
        }
      }
    }
  }, [pathname, router, isAstrologer]);

  // Do not show sidebar on the login or registration page
  if (pathname === '/partner' || pathname === '/partner/register') {
    return <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh' }}>{children}</Box>;
  }

  return (
    <SocketProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
        <PortalHeader
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isAstrologer={isAstrologer}
        />

        {/* Sidebar ONLY for Purohit */}
        {!isAstrologer && (
          <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                  borderRight: 'none',
                },
              }}
            >
              <PortalSidebar setMobileOpen={setMobileOpen} />
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                  borderRight: 'none',
                },
              }}
              open
            >
              <PortalSidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            mt: { xs: 11, md: 11 },
            width: isAstrologer ? '100%' : { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            maxWidth: '100vw',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
    </SocketProvider>
  );
}

'use client';
import { Box, Drawer, CircularProgress } from '@mui/material';
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
  const [mounted, setMounted] = useState(false);
  const [storedRole, setStoredRole] = useState<string | null>(null);
  const { profile, fetchProfile } = useUserStore();

  const normalizedPath = (pathname || '').replace(/\/$/, '') || '/';
  const isPublicRegister = normalizedPath === '/partner' || normalizedPath === '/partner/register';
  const isAstrologyRoute = normalizedPath.startsWith('/partner/astrologybookings');

  useEffect(() => {
    setMounted(true);
    try {
      const u = JSON.parse(sessionStorage.getItem('user') || '{}');
      const r = u?.role || sessionStorage.getItem('role') || sessionStorage.getItem('activeRole');
      if (r) setStoredRole(r);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!isPublicRegister) {
      fetchProfile();
    }
  }, [fetchProfile, isPublicRegister]);

  // Determine active role safely without SSR hydration mismatch
  const effectiveRole =
    profile?.role ||
    profile?.user?.role ||
    storedRole ||
    (typeof window !== 'undefined'
      ? (() => {
          try {
            const u = JSON.parse(sessionStorage.getItem('user') || '{}');
            return u?.role || sessionStorage.getItem('role') || sessionStorage.getItem('activeRole');
          } catch (e) {
            return null;
          }
        })()
      : null);

  const isAstrologer =
    isAstrologyRoute ||
    effectiveRole === USER_ROLE.ASTROLOGER ||
    effectiveRole === 'ASTROLOGER';

  const allowedAstrologerPaths = [
    '/partner/astrologybookings',
    '/partner/profile',
    '/partner/profile/edit',
  ];

  const isAstrologerRestricted =
    isAstrologer &&
    !allowedAstrologerPaths.some(
      (p) => normalizedPath === p || normalizedPath.startsWith(p + '/')
    );

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

    if (isPublicRegister) {
      if (isAuthorized) {
        if (userObj?.role === 'ASTROLOGER' || isAstrologer) {
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
        const isAllowed = allowedAstrologerPaths.some(
          (p) => normalizedPath === p || normalizedPath.startsWith(p + '/')
        );
        if (!isAllowed) {
          router.replace('/partner/astrologybookings');
        }
      }
    }
  }, [normalizedPath, router, isAstrologer, isPublicRegister]);

  // Do not show sidebar on the login or registration page
  if (isPublicRegister) {
    return <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh' }}>{children}</Box>;
  }

  // If an astrologer is on a restricted Purohit page, show loader while redirecting
  if (isAstrologerRestricted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  return (
    <SocketProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
        <PortalHeader
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isAstrologer={isAstrologer}
        />

        {/* Sidebar ONLY for Purohit - Never rendered for Astrologer */}
        {mounted && !isAstrologer && (
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

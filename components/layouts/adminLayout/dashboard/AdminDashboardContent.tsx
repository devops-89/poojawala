'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Breadcrumbs, Grid, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

// Components
import AcceptedBookingsWidget from '@/components/layouts/adminLayout/dashboard/AcceptedBookingsWidget';
import KPICards from '@/components/layouts/adminLayout/dashboard/KPICards';
import PendingPurohitsWidget from '@/components/layouts/adminLayout/dashboard/PendingPurohitsWidget';

// API
import { getAdminDashboardStatsAPI } from '@/api/userControllers';

export default function AdminDashboardContent() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboardStatsAPI();
        if (res.success && res.data) {
          setStatsData(res.data);
        } else {
          setStatsData(res.data || res || null);
        }
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header & Breadcrumbs */}
      <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: '#1A1A1A',
            fontSize: { xs: '22px', sm: '26px', md: '30px' },
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          Marketplace Overview
        </Typography>

        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: '#999', fontSize: 16 }}/>} 
          aria-label="breadcrumb"
          sx={{ '& .MuiBreadcrumbs-li': { fontSize: '13px' } }}
        >
          <NextLink href="/admin/dashboard" style={{ color: '#666', textDecoration: 'none', fontFamily: FONTS.OUTFIT, fontSize: '13px', fontWeight: 500 }}>
            Control Centre
          </NextLink>
          <Typography sx={{ color: COLORS.PRIMARY, fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: '13px' }}>
            Admin Dashboard
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* KPI Stats Cards */}
      <KPICards stats={statsData} loading={loading} />

      {/* Widgets Grid */}
      <Grid container spacing={{ xs: 2.5, sm: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <AcceptedBookingsWidget />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <PendingPurohitsWidget />
        </Grid>
      </Grid>
    </Box>
  );
}

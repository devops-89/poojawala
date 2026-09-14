'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Chip, Breadcrumbs, Divider, Button, CircularProgress } from '@mui/material';
import NextLink from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EventIcon from '@mui/icons-material/Event';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StarIcon from '@mui/icons-material/Star';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PercentIcon from '@mui/icons-material/Percent';
import { useParams } from 'next/navigation';
import { getServiceByIdAPI } from '@/api/serviceControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import Image from 'next/image';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M16 30 Q24 18 32 30' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' fill='%2394a3b8'/%3E%3C/svg%3E";

export default function AdminServiceDetailsContent() {
  const params = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await getServiceByIdAPI(params.id as string);
        if (response.success) {
          setService(response.data?.data || response.data);
        } else {
          showSnackbar(response.message || 'Failed to fetch service details', 'error');
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        showSnackbar('Error fetching service details', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchServiceDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  if (!service) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" color="text.secondary">Service not found</Typography>
        <Button component={NextLink} href="/admin/services" sx={{ mt: 2, color: '#FF6200' }}>
          Back to Services
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
            <NextLink href="/admin/services" style={{ textDecoration: 'none', color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '14px' }}>
              Services
            </NextLink>
            <Typography sx={{ color: '#FF6200', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '14px' }}>
              Service Details
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Service Details
          </Typography>
        </Box>
        <Button
          component={NextLink}
          href={`/admin/services/edit/${params.id}`}
          variant="contained"
          sx={{
            background: '#FF6200',
            color: 'white',
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            py: 1.5,
            px: 3,
            boxShadow: '0 4px 14px 0 rgba(255, 98, 0, 0.39)',
            '&:hover': { background: '#E65800', boxShadow: '0 6px 20px rgba(255, 98, 0, 0.23)' }
          }}
          startIcon={<EditIcon />}
        >
          Edit Service
        </Button>
      </Box>

      {/* Hero Header Card */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #fff7f2 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <Box sx={{ width: 120, height: 120, position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', flexShrink: 0, border: '4px solid white' }}>
            <Image src={service.iconDownloadurl || service.iconUrl || PLACEHOLDER} alt={service.name} fill style={{ objectFit: 'cover' }} unoptimized={true} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
              <Typography variant="h3" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                {service.name}
              </Typography>
              <Chip 
                label={service.isActive ? "Active" : "Inactive"} 
                sx={{ 
                  bgcolor: service.isActive ? '#10b981' : '#f1f5f9', 
                  color: service.isActive ? '#ffffff' : '#94a3b8', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-outfit), sans-serif', 
                  borderRadius: '8px',
                  boxShadow: service.isActive ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : 'none'
                }} 
              />
              <Chip 
                label={service.isUpcomingFestival ? "Upcoming Festival" : "Regular Service"} 
                sx={{ 
                  bgcolor: service.isUpcomingFestival ? '#8b5cf6' : '#f1f5f9', 
                  color: service.isUpcomingFestival ? '#ffffff' : '#64748b', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-outfit), sans-serif', 
                  borderRadius: '8px',
                  boxShadow: service.isUpcomingFestival ? '0 4px 14px 0 rgba(139, 92, 246, 0.39)' : 'none'
                }} 
              />
              <Chip 
                icon={<AccessTimeIcon style={{ color: '#FF6200', fontSize: '1.1rem' }} />}
                label={`${service.durationMinutes} Mins`} 
                sx={{ 
                  bgcolor: '#FFF0E6', 
                  color: '#FF6200', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-outfit), sans-serif', 
                  borderRadius: '8px',
                  border: '1px solid #ffedd5'
                }} 
              />
            </Box>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#475569', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '800px' }}>
              {service.description}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Left Column - Core Info & Performance Stats */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white', height: '100%' }}>
            <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ width: 8, height: 24, bgcolor: '#FF6200', borderRadius: 4, display: 'inline-block' }} />
              Specifications & Availability
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 2, transition: 'all 0.2s', '&:hover': { borderColor: service.requiresVenue ? '#3b82f6' : '#94a3b8', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', bgcolor: '#fff' } }}>
                  <Box sx={{ p: 1.5, bgcolor: service.requiresVenue ? '#dbeafe' : '#f1f5f9', borderRadius: '12px', color: service.requiresVenue ? '#3b82f6' : '#64748b', display: 'flex' }}>
                    <LocationOnIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>Requires Venue</Typography>
                    <Typography sx={{ fontWeight: 800, color: service.requiresVenue ? '#3b82f6' : '#64748b', fontSize: '1.1rem' }}>
                      {service.requiresVenue ? 'Yes, Required' : 'Not Required'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Total Bookings */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 2, transition: 'all 0.2s', '&:hover': { borderColor: '#10b981', boxShadow: '0 4px 20px rgba(16,185,129,0.05)', bgcolor: '#fff' } }}>
                  <Box sx={{ p: 1.5, bgcolor: '#d1fae5', borderRadius: '12px', color: '#10b981', display: 'flex' }}>
                    <ConfirmationNumberIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>Total Bookings</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#10b981', fontSize: '1.1rem' }}>{service.totalBookings ?? service.bookings ?? 0}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Online Purohits */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 2, transition: 'all 0.2s', '&:hover': { borderColor: '#0284c7', boxShadow: '0 4px 20px rgba(2,132,199,0.05)', bgcolor: '#fff' } }}>
                  <Box sx={{ p: 1.5, bgcolor: '#e0f2fe', borderRadius: '12px', color: '#0284c7', display: 'flex' }}>
                    <WifiIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>Online Purohits</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#0284c7', fontSize: '1.1rem' }}>{service.onlinepurohitCount ?? 0}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Offline Purohits */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 2, transition: 'all 0.2s', '&:hover': { borderColor: '#9333ea', boxShadow: '0 4px 20px rgba(147,51,234,0.05)', bgcolor: '#fff' } }}>
                  <Box sx={{ p: 1.5, bgcolor: '#f3e8ff', borderRadius: '12px', color: '#9333ea', display: 'flex' }}>
                    <WifiOffIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>Offline Purohits</Typography>
                    <Typography sx={{ fontWeight: 800, color: '#9333ea', fontSize: '1.1rem' }}>{service.offlinepurohitCount ?? 0}</Typography>
                  </Box>
                </Box>
              </Grid>

              {service.isUpcomingFestival && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 2, transition: 'all 0.2s', '&:hover': { borderColor: '#8b5cf6', boxShadow: '0 4px 20px rgba(139,92,246,0.05)', bgcolor: '#fff' } }}>
                      <Box sx={{ p: 1.5, bgcolor: '#ede9fe', borderRadius: '12px', color: '#8b5cf6', display: 'flex' }}>
                        <EventIcon />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>Festival Start</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
                          {service.festivalStartDate ? new Date(service.festivalStartDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 2, transition: 'all 0.2s', '&:hover': { borderColor: '#8b5cf6', boxShadow: '0 4px 20px rgba(139,92,246,0.05)', bgcolor: '#fff' } }}>
                      <Box sx={{ p: 1.5, bgcolor: '#ede9fe', borderRadius: '12px', color: '#8b5cf6', display: 'flex' }}>
                        <EventIcon />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>Festival End</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
                          {service.festivalEndDate ? new Date(service.festivalEndDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Pricing Details */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white', height: '100%' }}>
            <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ width: 8, height: 24, bgcolor: '#FF6200', borderRadius: 4, display: 'inline-block' }} />
              Pricing Details
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: '#f8fafc', borderRadius: '12px', mb: 2, border: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: '#FFF0E6', borderRadius: '8px', color: '#FF6200', display: 'flex' }}>
                  <CurrencyRupeeIcon fontSize="small" />
                </Box>
                <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>Minimum Price</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>₹{service.minPrice}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: '#f8fafc', borderRadius: '12px', mb: 2, border: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: '#FFF0E6', borderRadius: '8px', color: '#FF6200', display: 'flex' }}>
                  <CurrencyRupeeIcon fontSize="small" />
                </Box>
                <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>Maximum Price</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>₹{service.maxPrice}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: '#FFF0E6', borderRadius: '8px', color: '#FF6200', display: 'flex' }}>
                  <PercentIcon fontSize="small" />
                </Box>
                <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>Commission</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>{service.commissionPercentage}%</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

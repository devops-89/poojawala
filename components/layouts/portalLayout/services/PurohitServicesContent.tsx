'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { getAllServicesAPI, getPurohitServicesAPI } from '@/api/serviceControllers';
import { getCustomerAddressesAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PurohitServicesContent() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [myServiceIds, setMyServiceIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSnackbar } = useSnackbarStore();
  const { fetchProfile } = useUserStore();

  const fetchServices = async () => {
    try {
      setLoading(true);

      // Get Purohit's profile and default service area for city and state filters
      const profileRes = await fetchProfile();
      const currentProfile = profileRes || useUserStore.getState().profile;
      const userObj = currentProfile?.data || currentProfile;

      // Extract serviceAreas (or addresses fallback)
      let serviceAreas: any[] =
        userObj?.serviceAreas ||
        currentProfile?.serviceAreas ||
        userObj?.addresses ||
        currentProfile?.addresses ||
        userObj?.user?.addresses ||
        [];

      if (!serviceAreas || serviceAreas.length === 0) {
        try {
          const addrRes = await getCustomerAddressesAPI();
          const d = addrRes?.data || addrRes;
          if (Array.isArray(d)) {
            serviceAreas = d;
          } else if (d?.data && Array.isArray(d.data)) {
            serviceAreas = d.data;
          }
        } catch (err) {
          console.error("Error fetching service areas / addresses:", err);
        }
      }

      let purohitCity = "";
      let purohitState = "";
      if (serviceAreas && serviceAreas.length > 0) {
        const defaultArea =
          serviceAreas.find((sa: any) => sa.isDefault === true || sa.isDefault === "true") || serviceAreas[0];
        if (defaultArea?.city) purohitCity = String(defaultArea.city).trim();
        if (defaultArea?.state) purohitState = String(defaultArea.state).trim();
      }

      if (!purohitCity) {
        purohitCity = userObj?.city || userObj?.profile?.city || userObj?.purohitProfile?.city || "";
      }
      if (!purohitState) {
        purohitState = userObj?.state || userObj?.profile?.state || userObj?.purohitProfile?.state || "";
      }

      const [res, myRes] = await Promise.all([
        getAllServicesAPI(page, 6, "", true, purohitCity, purohitState),
        getPurohitServicesAPI(1, 100)
      ]);
      
      if (res.success) {
        let addedIds: number[] = [];
        if (userObj?.purohitServices && Array.isArray(userObj.purohitServices)) {
          addedIds = userObj.purohitServices.map((ps: any) => ps.serviceId);
        } else if (myRes?.data?.data && Array.isArray(myRes.data.data)) {
          addedIds = myRes.data.data.map((ps: any) => ps.serviceId);
        } else if (myRes?.data && Array.isArray(myRes.data)) {
          addedIds = myRes.data.map((ps: any) => ps.serviceId);
        }
        setMyServiceIds(addedIds);

        const rawData = res.data;
        const allServices = rawData?.data || (Array.isArray(rawData) ? rawData : []);
        setServices(allServices);
        
        const total = rawData?.pagination?.total || allServices.length || 0;
        const calculatedPages = Math.ceil(total / 6) || 1;
        setTotalPages(rawData?.pagination?.totalPages || calculatedPages);
      } else {
        showSnackbar(res.message || 'Failed to load services', 'error');
      }
    } catch (error: any) {
      console.error("Error loading services:", error);
      showSnackbar(error.response?.data?.message || 'Error loading services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const handleCardClick = (serviceId: number, isAlreadyAdded: boolean) => {
    if (isAlreadyAdded) {
      router.push(`/purohit/services/${serviceId}`);
    } else {
      router.push(`/purohit/services/${serviceId}#purohit-add-form-section`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Button
          onClick={() => router.push('/purohit/my-services')}
          sx={{ 
            minWidth: 'auto', 
            p: 1, 
            color: '#64748b',
            bgcolor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            '&:hover': { bgcolor: '#f8fafc', color: '#1e293b' }
          }}
        >
          <ArrowBackIcon />
        </Button>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Available Services
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
            Browse all services and add them to your profile
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {services.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
                No services available at the moment.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          services.map((service: any) => {
            const isAlreadyAdded = myServiceIds.includes(service.id);
            return (
              <Grid size={{ xs: 12, lg: 6 }} key={service.id} sx={{ display: 'flex' }}>
                <Paper
                  elevation={0}
                  onClick={() => handleCardClick(service.id, isAlreadyAdded)}
                  sx={{
                    width: '100%',
                    p: 2.5,
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2.5,
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    cursor: 'pointer',
                    transition: 'all 0.25s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 28px -8px rgba(0,0,0,0.08)',
                      borderColor: '#cbd5e1',
                    },
                  }}
                >
                  {/* Left: Image with Breathing Space */}
                  <Box
                    sx={{
                      width: { xs: '100%', sm: 160, md: 180 },
                      height: { xs: 200, sm: 140 },
                      borderRadius: '14px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      bgcolor: '#FFF8F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        service.iconDownloadurl ||
                        service.iconUrl ||
                        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={service.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: { xs: 'contain', sm: 'cover' },
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' },
                      }}
                    />
                  </Box>

                  {/* Right: Details & Actions */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {/* Header info */}
                    <Box sx={{ mb: 1.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'flex-start',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: 'var(--font-outfit), sans-serif',
                            fontWeight: 800,
                            color: '#1e293b',
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {service.name}
                        </Typography>
                        {service.isUpcomingFestival && (
                          <Chip
                            label="Festival"
                            size="small"
                            sx={{
                              bgcolor: '#fff7ed',
                              color: '#FF6200',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              borderRadius: '12px',
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        sx={{
                          fontFamily: 'var(--font-outfit), sans-serif',
                          color: '#64748b',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {service.description || 'No description provided.'}
                      </Typography>
                    </Box>

                    {/* Footer stats & action */}
                    <Box
                      sx={{
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                        pt: 1.5,
                        borderTop: '1px solid #f1f5f9',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Price */}
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-outfit), sans-serif',
                              fontSize: '0.7rem',
                              color: '#94a3b8',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Price Range
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-outfit), sans-serif',
                              fontWeight: 800,
                              color: '#FF6200',
                              fontSize: '0.95rem',
                            }}
                          >
                            ₹{service.minPrice} - ₹{service.maxPrice}
                          </Typography>
                        </Box>

                        {/* Duration */}
                        <Box sx={{ borderLeft: '1px solid #e2e8f0', pl: 2 }}>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-outfit), sans-serif',
                              fontSize: '0.7rem',
                              color: '#94a3b8',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Duration
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-outfit), sans-serif',
                              fontWeight: 700,
                              color: '#475569',
                              fontSize: '0.9rem',
                            }}
                          >
                            {service.durationMinutes} mins
                          </Typography>
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Button
                        variant={isAlreadyAdded ? 'outlined' : 'contained'}
                        disabled={isAlreadyAdded}
                        size="medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAlreadyAdded) {
                            handleCardClick(service.id, isAlreadyAdded);
                          }
                        }}
                        sx={{
                          textTransform: 'none',
                          borderRadius: '10px',
                          fontWeight: 700,
                          px: 2.5,
                          py: 0.8,
                          fontFamily: 'var(--font-outfit), sans-serif',
                          ...(isAlreadyAdded
                            ? {
                                borderColor: '#e2e8f0',
                                color: '#94a3b8 !important',
                                backgroundColor: '#f1f5f9 !important',
                                cursor: 'not-allowed',
                              }
                            : {
                                background: '#FF6200 !important',
                                backgroundColor: '#FF6200 !important',
                                color: '#ffffff !important',
                                '&:hover': {
                                  background: '#E65800 !important',
                                  backgroundColor: '#E65800 !important',
                                },
                              }),
                        }}
                      >
                        {isAlreadyAdded ? 'Already Added' : 'Add to My Services'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })
        )}
      </Grid>

      {totalPages > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(e, newPage) => setPage(newPage)} 
            color="primary"
            sx={{ '& .MuiPaginationItem-root': { fontFamily: 'var(--font-outfit), sans-serif', '&.Mui-selected': { bgcolor: '#FF6200', color: 'white', '&:hover': { bgcolor: '#E65800' } } } }}
          />
        </Box>
      )}
    </Box>
  );
}

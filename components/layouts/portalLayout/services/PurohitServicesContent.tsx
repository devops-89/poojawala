'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Pagination, FormControlLabel, Switch } from '@mui/material';
import { getServicesAPI, addPurohitServiceAPI, getPurohitServicesAPI } from '@/api/serviceControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PurohitServicesContent() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [onlinePrice, setOnlinePrice] = useState('');
  const [offlinePrice, setOfflinePrice] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isOffline, setIsOffline] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSnackbar } = useSnackbarStore();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const [res, myRes] = await Promise.all([
        getServicesAPI(page, 6, "", undefined, undefined, undefined, true),
        getPurohitServicesAPI(1, 100)
      ]);
      
      if (res.success) {
        const myServiceIds = myRes?.data?.data?.map((ps: any) => ps.serviceId) || [];
        const allServices = res.data?.data || [];
        const unaddedServices = allServices.filter((s: any) => !myServiceIds.includes(s.id));
        
        setServices(unaddedServices);
        
        const total = res.data?.pagination?.total || allServices.length || 0;
        const calculatedPages = Math.ceil(total / 6) || 1;
        setTotalPages(res.data?.pagination?.totalPages > 1 ? res.data.pagination.totalPages : calculatedPages);
      } else {
        showSnackbar(res.message || 'Failed to load services', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error loading services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page]);

  const handleAddClick = (service: any) => {
    setSelectedService(service);
    setOnlinePrice(service.minPrice ? String(service.minPrice) : '');
    setOfflinePrice(service.minPrice ? String(service.minPrice) : '');
    setIsOnline(true);
    setIsOffline(true);
    setDurationMinutes(service.durationMinutes ? String(service.durationMinutes) : '60');
  };

  const handleCloseDialog = () => {
    setSelectedService(null);
    setOnlinePrice('');
    setOfflinePrice('');
    setIsOnline(true);
    setIsOffline(true);
    setDurationMinutes('');
  };

  const handleSubmit = async () => {
    if (!selectedService || !durationMinutes) {
      showSnackbar('Please enter duration', 'error');
      return;
    }
    
    if (isOnline && !onlinePrice) {
      showSnackbar('Please enter online price', 'error');
      return;
    }
    if (isOffline && !offlinePrice) {
      showSnackbar('Please enter offline price', 'error');
      return;
    }
    if (!isOnline && !isOffline) {
      showSnackbar('At least one mode (online/offline) must be supported', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = [{
        serviceId: selectedService.id,
        onlinePrice: isOnline ? Number(onlinePrice) : null,
        offlinePrice: isOffline ? Number(offlinePrice) : null,
        isOnline,
        isOffline,
        durationMinutes: Number(durationMinutes)
      }];

      const res = await addPurohitServiceAPI(payload);
      if (res.success) {
        showSnackbar('Service added to your profile successfully', 'success');
        handleCloseDialog();
      } else {
        showSnackbar(res.message || 'Failed to add service', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error adding service', 'error');
    } finally {
      setIsSubmitting(false);
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
          services.map((service: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id} sx={{ display: 'flex' }}>
              <Card sx={{ width: '100%', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                {(service.iconDownloadurl || service.iconUrl) && (
                  <CardMedia
                    component="img"
                    image={service.iconDownloadurl || service.iconUrl}
                    alt={service.name}
                    sx={{ height: 160, width: '100%', objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    {service.name}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      sx={{ 
                        fontFamily: 'var(--font-outfit), sans-serif', 
                        color: '#64748b', 
                        mb: 2, 
                        fontSize: '0.9rem', 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {service.description || 'No description provided.'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#FF6200' }}>
                      ₹{service.minPrice} - ₹{service.maxPrice}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', fontSize: '0.85rem' }}>
                      {service.durationMinutes} mins
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleAddClick(service)}
                    sx={{ 
                      textTransform: 'none', 
                      borderRadius: '8px', 
                      fontWeight: 600, 
                      fontFamily: 'var(--font-outfit), sans-serif',
                      background: '#FF6200 !important',
                      backgroundColor: '#FF6200 !important',
                      color: '#ffffff !important',
                      '&:hover': { 
                        background: '#E65800 !important',
                        backgroundColor: '#E65800 !important'
                      } 
                    }}
                  >
                    Add to My Services
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
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

      {/* Add Service Dialog */}
      <Dialog 
        open={Boolean(selectedService)} 
        onClose={handleCloseDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px', minWidth: 400, p: 1 } }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Add {selectedService?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel 
                control={<Switch checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6200' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6200' } }} />}
                label={<Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#475569' }}>Supports Online</Typography>}
              />
              <FormControlLabel 
                control={<Switch checked={isOffline} onChange={(e) => setIsOffline(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6200' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6200' } }} />}
                label={<Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, color: '#475569' }}>Supports Offline</Typography>}
              />
            </Box>

            {isOnline && (
              <TextField
                variant="outlined"
                label="Online Price (₹)"
                type="number"
                fullWidth
                value={onlinePrice}
                onChange={(e) => setOnlinePrice(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-outfit), sans-serif' },
                  '& .MuiInputLabel-root': { fontFamily: 'var(--font-outfit), sans-serif' }
                }}
                helperText={`Suggested range: ₹${selectedService?.minPrice} - ₹${selectedService?.maxPrice}`}
              />
            )}
            
            {isOffline && (
              <TextField
                variant="outlined"
                label="Offline Price (₹)"
                type="number"
                fullWidth
                value={offlinePrice}
                onChange={(e) => setOfflinePrice(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-outfit), sans-serif' },
                  '& .MuiInputLabel-root': { fontFamily: 'var(--font-outfit), sans-serif' }
                }}
                helperText={`Suggested range: ₹${selectedService?.minPrice} - ₹${selectedService?.maxPrice}`}
              />
            )}
            <TextField
              variant="outlined"
              label="Duration (Minutes)"
              type="number"
              fullWidth
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-outfit), sans-serif' },
                '& .MuiInputLabel-root': { fontFamily: 'var(--font-outfit), sans-serif' }
              }}
              helperText={`Standard duration: ${selectedService?.durationMinutes} mins`}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || (!isOnline && !isOffline) || !durationMinutes}
            variant="contained" 
            sx={{ 
              textTransform: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              fontFamily: 'var(--font-outfit), sans-serif',
              background: '#FF6200 !important',
              color: '#fff !important',
              '&:hover': { background: '#E65800 !important' } 
            }}
          >
            {isSubmitting ? 'Adding...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

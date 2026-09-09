'use client';
import { customerCreateBookingAPI } from '@/api/bookingControllers';
import { getAllServicesAPI } from '@/api/serviceControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useUserStore } from '@/stores/userStore';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, CircularProgress, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Modal, Pagination, Paper, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function CustomerServicesContent() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const profile = useUserStore((state) => state.profile);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState<{
    scheduledAt: string;
    specialInstructions: string;
    bookingMode: string;
    language: string;
    members: number | string;
  }>({
    scheduledAt: '',
    specialInstructions: '',
    bookingMode: 'OFFLINE',
    language: 'Hindi',
    members: 1
  });

  const handleOpenBooking = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
    setSelectedServiceId(null);
    setBookingForm({
      scheduledAt: '',
      specialInstructions: '',
      bookingMode: 'OFFLINE',
      language: 'Hindi',
      members: 1
    });
  };

  const handleBookNowSubmit = async () => {
    if (!bookingForm.scheduledAt) {
      showSnackbar('Please select a scheduled date and time', 'error');
      return;
    }
    setSubmittingBooking(true);
    try {
      let customerAddressId = null;
      if (profile?.addresses && profile.addresses.length > 0) {
        const defaultAddr = profile.addresses.find((a: any) => a.isDefault) || profile.addresses[0];
        customerAddressId = defaultAddr.id;
      }
      
      if (!customerAddressId && bookingForm.bookingMode === 'OFFLINE') {
        showSnackbar('No address found. Please add an address in your profile first.', 'error');
        setSubmittingBooking(false);
        return;
      }

      const payload = {
        serviceId: selectedServiceId,
        customerAddressId: customerAddressId,
        scheduledAt: new Date(bookingForm.scheduledAt).toISOString(),
        specialInstructions: bookingForm.specialInstructions,
        bookingMode: bookingForm.bookingMode,
        customFields: {
          language: bookingForm.language,
          members: Number(bookingForm.members)
        }
      };

      const res = await customerCreateBookingAPI(payload);
      if (res.success || res.statusCode === 201) {
        showSnackbar('Booking request created successfully!', 'success');
        handleCloseBooking();
      }
    } catch (error: any) {
      console.error('Booking failed:', error);
      showSnackbar(error.response?.data?.message || 'Failed to create booking request', 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await getAllServicesAPI(page, 6, debouncedSearch);
        if (res.success && res.data?.data) {
          setServices(res.data.data);
          if (res.data?.pagination?.totalPages) {
            setTotalPages(res.data.pagination.totalPages);
          }
        } else if (res.success && Array.isArray(res.data)) {
          setServices(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [page, debouncedSearch]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
        Explore Services
      </Typography>
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', mb: 4 }}>
        Browse and book verified purohits for your pujas.
      </Typography>

      <Box sx={{ mb: 4, width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search pujas or services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px', bgcolor: 'white', '& fieldset': { borderColor: '#E0E0E0' } }
            }
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      ) : services.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 5, color: '#666', fontFamily: '"DM Sans", sans-serif' }}>
          No services available right now. Please check back later.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {services.map((service, idx) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={service?.id || idx}>
              <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ bgcolor: '#FFF0E6', p: (service?.iconDownloadurl || service?.iconUrl) ? 0 : 1, borderRadius: '8px', display: 'flex', overflow: 'hidden' }}>
                    {service?.iconDownloadurl || service?.iconUrl ? (
                      <Box component="img" src={service.iconDownloadurl || service.iconUrl} alt={service?.name || 'Service Icon'} sx={{ width: 60, height: 60, objectFit: 'cover' }} />
                    ) : (
                      <SparklesIcon sx={{ color: '#FF6200', m: 1 }} />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#FF6200', fontSize: '16px', textAlign: 'right' }}>
                      {service?.minPrice && service?.maxPrice 
                        ? `₹${Number(service.minPrice)} - ₹${Number(service.maxPrice)}`
                        : service?.minPrice 
                          ? `₹${Number(service.minPrice)}`
                          : service?.price || service?.basePrice 
                            ? `₹${service.price || service.basePrice}` 
                            : 'Price on request'}
                    </Typography>
                    {service?.commissionPercentage && Number(service.commissionPercentage) > 0 && (
                      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '12px', mt: 0.5 }}>
                        {Number(service.commissionPercentage)}% Commission
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, mb: 1 }}>
                  {service?.title || service?.name || service?.serviceName || 'Unknown Service'}
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '14px', mb: 3, flex: 1 }}>
                  {service?.desc || service?.description || service?.shortDescription || 'No description available for this service.'}
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleOpenBooking(service.id)}
                  sx={{ 
                    background: '#FF6200', 
                    color: 'white', 
                    textTransform: 'none', 
                    borderRadius: '30px',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(255, 98, 0, 0.4)',
                    '&:hover': { background: '#F05A00', boxShadow: '0 4px 14px rgba(255, 98, 0, 0.4)' }
                  }}
                >
                  Book Now
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, value) => setPage(value)} 
            sx={{ 
              '& .MuiPaginationItem-root.Mui-selected': { bgcolor: '#FF6200', color: 'white', '&:hover': { bgcolor: '#F05A00' } } 
            }} 
          />
        </Box>
      )}

      {/* Booking Modal */}
      <Modal open={bookingModalOpen} onClose={handleCloseBooking}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 }, bgcolor: 'background.paper', borderRadius: '12px',
          boxShadow: 24, p: 4, maxHeight: '90vh', overflowY: 'auto',
          '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#FF6200' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#FF6200' }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700 }}>
              Book Service
            </Typography>
            <IconButton onClick={handleCloseBooking} size="small"><CloseIcon /></IconButton>
          </Box>
          
          <Grid container spacing={2}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Scheduled Date & Time"
                value={bookingForm.scheduledAt}
                onChange={(e) => setBookingForm({ ...bookingForm, scheduledAt: e.target.value })}
                slotProps={{ 
                  inputLabel: { shrink: true },
                  htmlInput: { min: new Date().toISOString().slice(0, 16) }
                }}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <FormControl fullWidth>
                <InputLabel>Booking Mode</InputLabel>
                <Select
                  value={bookingForm.bookingMode}
                  label="Booking Mode"
                  onChange={(e) => setBookingForm({ ...bookingForm, bookingMode: e.target.value })}
                >
                  <MenuItem value="OFFLINE">Offline (Purohit visits location)</MenuItem>
                  <MenuItem value="ONLINE">Online (Video Call)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Language"
                placeholder="e.g. Hindi, Sanskrit"
                value={bookingForm.language}
                onChange={(e) => setBookingForm({ ...bookingForm, language: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                type="number"
                label="Number of Members"
                value={bookingForm.members}
                onChange={(e) => setBookingForm({ ...bookingForm, members: e.target.value === '' ? '' : Number(e.target.value) })}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Special Instructions"
                placeholder="Any special requirements..."
                value={bookingForm.specialInstructions}
                onChange={(e) => setBookingForm({ ...bookingForm, specialInstructions: e.target.value })}
              />
            </Grid>
          </Grid>

          <Button 
            variant="contained" 
            fullWidth
            onClick={handleBookNowSubmit}
            disabled={submittingBooking}
            sx={{ 
              mt: 4,
              background: '#FF6200', 
              color: 'white', 
              textTransform: 'none', 
              borderRadius: '8px',
              fontWeight: 600,
              py: 1.5,
              '&:hover': { background: '#F05A00' }
            }}
          >
            {submittingBooking ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

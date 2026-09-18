'use client';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Breadcrumbs, Button, Divider, MenuItem, Paper, TextField, Typography, Card, Autocomplete, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FormikProvider, useFormik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

import { useEffect, useState } from 'react';
import { getCustomersListAPI, createCustomerByAdminAPI, getAvailablePurohitsForBookingAPI } from '@/api/userControllers';
import { getServicesAPI } from '@/api/serviceControllers';
import { createBookingByAdminAPI } from '@/api/bookingControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import { MuiTelInput } from 'mui-tel-input';

const validationSchema = Yup.object().shape({
  customerId: Yup.string().when('isNewCustomer', {
    is: false,
    then: (schema) => schema.required('Customer is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  newCustomerName: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Name is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  newCustomerMobile: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Mobile is required').matches(/^\d{10}$/, 'Must be exactly 10 digits'),
    otherwise: (schema) => schema.notRequired()
  }),
  newCustomerEmail: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Email is required').matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    otherwise: (schema) => schema.notRequired()
  }),
  newCustomerPassword: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Password is required').min(6, 'Min 6 chars'),
    otherwise: (schema) => schema.notRequired()
  }),
  newCustomerAddress: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Address is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  newCustomerCity: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('City is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  purohitId: Yup.string().required('Purohit is required'),
  serviceId: Yup.string().required('Service is required'),
  bookingDate: Yup.string().required('Booking date is required'),
  bookingMode: Yup.string().required('Booking mode is required')
});

export default function AddBookingForm() {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const [customers, setCustomers] = useState<any[]>([]);
  const [purohits, setPurohits] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [purohitSearchText, setPurohitSearchText] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          const custRes = await getCustomersListAPI(1, 100, customerSearchText, 'ACTIVE');
          if (custRes.success) {
            const list = Array.isArray(custRes.data?.data) ? custRes.data.data : Array.isArray(custRes.data) ? custRes.data : Array.isArray(custRes.users) ? custRes.users : [];
            setCustomers(list);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [customerSearchText]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServicesAPI(1, 100, '', undefined, undefined, undefined, true);
        if (res.success) {
          const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
          setAllServices(list);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const formik = useFormik({
    initialValues: {
      isNewCustomer: false,
      customerId: '',
      newCustomerName: '',
      newCustomerMobile: '',
      newCustomerEmail: '',
      newCustomerAddress: '',
      newCustomerCity: '',
      newCustomerPassword: '',
      bookingMode: '',
      purohitId: '',
      serviceId: '',
      bookingDate: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalCustomerId = values.customerId;
        let addressId = 1;
        
        if (values.isNewCustomer) {
          showSnackbar('Please click Create Customer button to save the new customer first', 'error');
          setIsSubmitting(false);
          return;
        } else {
          const selectedCustomer = customers.find(c => c.id === Number(values.customerId));
          addressId = selectedCustomer?.customerProfile?.addresses?.[0]?.id || selectedCustomer?.addresses?.[0]?.id || 1;
        }

        const res = await createBookingByAdminAPI({
          customerId: Number(finalCustomerId),
          purohitId: Number(values.purohitId),
          serviceId: Number(values.serviceId),
          customerAddressId: addressId,
          scheduledAt: new Date(values.bookingDate).toISOString(),
          bookingMode: values.bookingMode
        });
        
        if (res.success) {
          showSnackbar('Booking created successfully', 'success');
          router.push('/admin/bookings');
        } else {
          showSnackbar(res.message || 'Failed to create booking', 'error');
        }
      } catch (error: any) {
        showSnackbar(error.response?.data?.message || 'Error creating booking', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchPurohits = async () => {
        if (values.customerId && values.bookingMode && values.serviceId) {
          const selectedCustomer = customers.find(c => c.id === Number(values.customerId));
          const defaultAddress = selectedCustomer?.addresses?.find((a: any) => a.isDefault) || selectedCustomer?.addresses?.[0];
          const city = defaultAddress?.city || selectedCustomer?.city || values.newCustomerCity || '';
          try {
            const purRes = await getAvailablePurohitsForBookingAPI(city, values.bookingMode, purohitSearchText, values.serviceId);
            if (purRes.success) {
              const list = Array.isArray(purRes.data?.data) ? purRes.data.data : Array.isArray(purRes.data) ? purRes.data : Array.isArray(purRes.purohits) ? purRes.purohits : [];
              setPurohits(list);
            }
          } catch (error) {
            console.error('Error fetching purohits:', error);
          }
        } else {
          setPurohits([]);
        }
      };
      fetchPurohits();
    }, 500);
    return () => clearTimeout(timer);
  }, [values.customerId, values.bookingMode, customers, purohitSearchText, values.serviceId]);

  const handleCreateCustomer = async () => {
    const { newCustomerName, newCustomerMobile, newCustomerEmail, newCustomerAddress, newCustomerCity, newCustomerPassword } = values;
    if (!newCustomerName || !newCustomerMobile || !newCustomerEmail || !newCustomerAddress || !newCustomerCity || !newCustomerPassword) {
      showSnackbar('Please fill all new customer fields', 'error');
      formik.validateForm();
      Object.keys(formik.values).forEach(field => {
        if (field.startsWith('newCustomer')) formik.setFieldTouched(field, true);
      });
      return;
    }
    
    setIsCreatingCustomer(true);
    try {
      const res = await createCustomerByAdminAPI({
        firstName: newCustomerName.split(' ')[0],
        lastName: newCustomerName.split(' ').slice(1).join(' ') || '',
        phone: newCustomerMobile,
        email: newCustomerEmail,
        password: newCustomerPassword,
        address: newCustomerAddress,
        city: newCustomerCity,
      });

      if (res.success) {
        showSnackbar('Customer created successfully!', 'success');
        const newCustomer = res.data?.data || res.data;
        setCustomers(prev => [...prev, newCustomer]);
        setFieldValue('customerId', newCustomer.id);
        setFieldValue('isNewCustomer', false);
        setShowAddCustomer(false);
      } else {
        showSnackbar(res.message || 'Failed to create customer', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error creating customer', 'error');
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  const selectedP = purohits.find(p => p.id === Number(values.purohitId));
  const selectedProfile = selectedP?.purohitProfile || selectedP?.profile || selectedP?.purohit;
  const availableServices = selectedProfile?.purohitServices || [];

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormikProvider value={formik}>
        <FormikValidationSnackbar />
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
            <NextLink href="/admin/bookings" style={{ textDecoration: 'none', color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '14px' }}>
              Bookings
            </NextLink>
            <Typography sx={{ color: '#10b981', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '14px' }}>
              Add Booking
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Create New Booking
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', mt: 0.5 }}>
            Manually create a booking on behalf of a customer.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
          <Grid container spacing={3}>
            
            {/* Field 1: Select or Add Customer */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b' }}>
                  {showAddCustomer ? 'Add New Customer' : 'Select Customer'}
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => {
                    setShowAddCustomer(!showAddCustomer);
                    setFieldValue('isNewCustomer', !showAddCustomer);
                    setFieldValue('customerId', '');
                  }}
                  sx={{ textTransform: 'none', fontWeight: 600, color: '#FF6200' }}
                >
                  {showAddCustomer ? 'Use Existing Customer' : '+ Add New Customer'}
                </Button>
              </Box>

              {!showAddCustomer ? (
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName || ''} (${option.phone || option.email})`}
                  value={customers.find(c => c.id === Number(values.customerId)) || null}
                  filterOptions={(x) => x}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === 'input' || reason === 'clear') {
                      setCustomerSearchText(newInputValue);
                    }
                  }}
                  onChange={(_, newValue) => {
                    setFieldValue('customerId', newValue ? newValue.id : '');
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params}
                      variant="outlined"
                      placeholder="Search customer by name, email or phone"
                      error={touched.customerId && Boolean(errors.customerId)}
                      helperText={touched.customerId ? (errors.customerId as string) : undefined}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  )}
                />
              ) : (
                <Card elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '12px', bgcolor: '#f8fafc' }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth label="Full Name" name="newCustomerName" variant="outlined" 
                        value={values.newCustomerName} onChange={handleChange} onBlur={handleBlur}
                        error={touched.newCustomerName && Boolean(errors.newCustomerName)} 
                        helperText={touched.newCustomerName && errors.newCustomerName}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MuiTelInput 
                        fullWidth 
                        label="Mobile Number" 
                        name="newCustomerMobile" 
                        variant="outlined" 
                        defaultCountry="IN"
                        value={values.newCustomerMobile ? '+91' + values.newCustomerMobile : ''} 
                        onChange={(newValue, info) => {
                          const natNum = info.nationalNumber || '';
                          const cleanNum = natNum.replace(/\D/g, '').slice(0, 10);
                          formik.setFieldValue('newCustomerMobile', cleanNum);
                        }} 
                        onKeyDown={(e) => {
                          if (values.newCustomerMobile && values.newCustomerMobile.length >= 10) {
                            if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                              e.preventDefault();
                            }
                          }
                        }}
                        error={touched.newCustomerMobile && Boolean(errors.newCustomerMobile)} 
                        helperText={touched.newCustomerMobile && errors.newCustomerMobile as string} 
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }} 
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth label="Email" name="newCustomerEmail" variant="outlined" 
                        value={values.newCustomerEmail} onChange={handleChange} onBlur={handleBlur}
                        error={touched.newCustomerEmail && Boolean(errors.newCustomerEmail)} 
                        helperText={touched.newCustomerEmail && (errors.newCustomerEmail as string)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth label="Password" name="newCustomerPassword" type={showPassword ? "text" : "password"} variant="outlined" 
                        value={values.newCustomerPassword} onChange={handleChange} onBlur={handleBlur}
                        error={touched.newCustomerPassword && Boolean(errors.newCustomerPassword)} 
                        helperText={touched.newCustomerPassword && (errors.newCustomerPassword as string)}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth label="Address" name="newCustomerAddress" variant="outlined" 
                        value={values.newCustomerAddress} onChange={handleChange} onBlur={handleBlur}
                        error={touched.newCustomerAddress && Boolean(errors.newCustomerAddress)} 
                        helperText={touched.newCustomerAddress && (errors.newCustomerAddress as string)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth label="City" name="newCustomerCity" variant="outlined" 
                        value={values.newCustomerCity} onChange={handleChange} onBlur={handleBlur}
                        error={touched.newCustomerCity && Boolean(errors.newCustomerCity)} 
                        helperText={touched.newCustomerCity && (errors.newCustomerCity as string)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="contained" 
                      onClick={handleCreateCustomer} 
                      disabled={isCreatingCustomer}
                      sx={{ bgcolor: '#FF6200', color: 'white', '&:hover': { bgcolor: '#E65800' }, borderRadius: '8px', textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                    >
                      {isCreatingCustomer ? 'Creating...' : 'Create Customer'}
                    </Button>
                  </Box>
                </Card>
              )}
            </Grid>

            {/* Field 2: Booking Mode */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 1, color: '#1e293b' }}>Booking Mode</Typography>
              <TextField 
                fullWidth select name="bookingMode" variant="outlined" 
                value={values.bookingMode} 
                onChange={(e) => {
                  handleChange(e);
                  setFieldValue('purohitId', '');
                  setFieldValue('serviceId', '');
                }} 
                onBlur={handleBlur}
                error={touched.bookingMode && Boolean(errors.bookingMode)} 
                helperText={touched.bookingMode && errors.bookingMode}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              >
                <MenuItem value="ONLINE" sx={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Online</MenuItem>
                <MenuItem value="OFFLINE" sx={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Offline</MenuItem>
              </TextField>
            </Grid>

            {/* Field 3: Select Service */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 1, color: '#1e293b' }}>Select Service</Typography>
              <TextField 
                fullWidth select name="serviceId" variant="outlined" 
                value={values.serviceId} onChange={handleChange} onBlur={handleBlur}
                error={touched.serviceId && Boolean(errors.serviceId)} helperText={touched.serviceId && (errors.serviceId as string)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                slotProps={{
                  select: {
                    MenuProps: {
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      transformOrigin: { vertical: 'top', horizontal: 'left' },
                      sx: { maxHeight: 350 }
                    }
                  }
                }}
              >
                {allServices.length === 0 && (
                  <MenuItem disabled value="" sx={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Loading services...</MenuItem>
                )}
                {allServices.map((s: any) => (
                  <MenuItem key={s.id} value={s.id} sx={{ fontFamily: 'var(--font-outfit), sans-serif' }}>{s.name}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Field 4: Select Purohit */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 1, color: '#1e293b' }}>Select Purohit</Typography>
              <Autocomplete
                options={purohits}
                disabled={!values.bookingMode || !values.customerId || !values.serviceId}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName || ''} (${option.phone || option.email})`}
                value={purohits.find(p => p.id === Number(values.purohitId)) || null}
                filterOptions={(x) => x}
                onInputChange={(_, newInputValue, reason) => {
                  if (reason === 'input' || reason === 'clear') {
                    setPurohitSearchText(newInputValue);
                  }
                }}
                onChange={(_, newValue) => {
                  setFieldValue('purohitId', newValue ? newValue.id : '');
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params}
                    variant="outlined"
                    placeholder={(!values.bookingMode || !values.customerId || !values.serviceId) ? "Select Customer, Mode & Service first" : "Search purohit by name, email or phone"}
                    error={touched.purohitId && Boolean(errors.purohitId)}
                    helperText={touched.purohitId ? (errors.purohitId as string) : undefined}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                )}
              />
            </Grid>

            {/* Field 5: Booking Date & Time */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 1, color: '#1e293b' }}>Booking Date & Time</Typography>
              <DateTimePicker
                value={values.bookingDate ? moment(values.bookingDate) : null}
                onChange={(newValue) => {
                  formik.setFieldValue('bookingDate', newValue ? newValue.toISOString() : '');
                }}
                slotProps={{
                  textField: {
                    name: "bookingDate",
                    variant: "outlined",
                    error: touched.bookingDate && Boolean(errors.bookingDate),
                    helperText: touched.bookingDate ? (errors.bookingDate as string) : undefined,
                    fullWidth: true,
                    sx: { '& .MuiOutlinedInput-root': { borderRadius: '12px' } }
                  } as any
                }}
              />
            </Grid>

            {/* Dynamic Service Summary Details */}
            {values.serviceId && values.purohitId && (() => {
              const purohitService = availableServices.find((ps: any) => (ps.serviceId || ps.service?.id) === Number(values.serviceId));
              if (!purohitService || !purohitService.service) return null;
              
              const selectedService = purohitService.service;
              const displayPrice = purohitService.customPrice || purohitService.price || selectedService.minPrice || 0;
              const displayDuration = purohitService.durationMinutes || selectedService.durationMinutes || 60;
              const imageSrc = selectedService.iconDownloadurl || selectedService.iconUrl || selectedService.coverImage;

              return (
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, mb: 1, color: '#1e293b' }}>Service Details</Typography>
                  <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
                    {imageSrc ? (
                      <Box 
                        component="img" 
                        src={imageSrc} 
                        onError={(e: any) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }}
                        sx={{ width: 80, height: 80, borderRadius: '8px', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Box sx={{ width: 80, height: 80, borderRadius: '8px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#94a3b8', fontSize: '12px' }}>No Image</Typography>
                      </Box>
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                        {selectedService.name}
                      </Typography>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {selectedService.description || 'No description available.'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      {selectedService.minPrice && selectedService.maxPrice ? (
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#10b981', fontSize: '1.2rem' }}>
                          ₹{selectedService.minPrice} - ₹{selectedService.maxPrice}
                        </Typography>
                      ) : (
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#10b981', fontSize: '1.2rem' }}>
                          ₹{displayPrice}
                        </Typography>
                      )}
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b', fontSize: '0.85rem', mt: 0.5 }}>
                        {displayDuration} mins
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })()}
          </Grid>

          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button component={NextLink} href="/admin/bookings" sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ background: '#10b981', color: 'white', textTransform: 'none', borderRadius: '8px', fontWeight: 600, boxShadow: 'none', '&:hover': { background: '#059669', boxShadow: 'none' } }}>
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </Button>
          </Box>
        </Paper>
      </Box>
      </FormikProvider>
    </LocalizationProvider>
  );
}

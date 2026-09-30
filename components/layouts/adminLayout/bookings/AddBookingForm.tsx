'use client';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { FormikProvider, useFormik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

import { useEffect, useState } from 'react';
import { createBookingByAdminAPI } from '@/api/bookingControllers';
import { getServicesAPI } from '@/api/serviceControllers';
import {
  createCustomerByAdminAPI,
  getAvailablePurohitsForBookingAPI,
  getCustomersListAPI,
} from '@/api/userControllers';
import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';
import { useSnackbarStore } from '@/stores/snackbarStore';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import AddBookingCustomerSection from './AddBookingCustomerSection';
import AddBookingPurohitSection from './AddBookingPurohitSection';
import AddBookingServiceSection from './AddBookingServiceSection';

const validationSchema = Yup.object().shape({
  customerId: Yup.string().when('isNewCustomer', {
    is: false,
    then: (schema) => schema.required('Customer is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  newCustomerName: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  newCustomerMobile: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) =>
      schema
        .required('Mobile is required')
        .matches(/^\d{10}$/, 'Must be exactly 10 digits'),
    otherwise: (schema) => schema.notRequired(),
  }),
  newCustomerEmail: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) =>
      schema
        .required('Email is required')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Invalid email format'
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  newCustomerPassword: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) =>
      schema.required('Password is required').min(6, 'Min 6 chars'),
    otherwise: (schema) => schema.notRequired(),
  }),
  newCustomerAddress: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Address is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  newCustomerCity: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('City is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  purohitId: Yup.string().required('Purohit is required'),
  serviceId: Yup.string().required('Service is required'),
  plan: Yup.string().required('Plan is required'),
  bookingDate: Yup.string().required('Booking date is required'),
  bookingMode: Yup.string().required('Booking mode is required'),
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

  // Fetch Customers List
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          const custRes = await getCustomersListAPI(
            1,
            100,
            customerSearchText,
            'ACTIVE'
          );
          if (custRes.success) {
            const list = Array.isArray(custRes.data?.data)
              ? custRes.data.data
              : Array.isArray(custRes.data)
              ? custRes.data
              : Array.isArray(custRes.users)
              ? custRes.users
              : [];
            setCustomers(list);
          }
        } catch (error) {
          console.error('Error fetching customers:', error);
        }
      };
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [customerSearchText]);

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
      plan: 'basic',
      bookingDate: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalCustomerId = values.customerId;
        let addressId = 1;

        if (values.isNewCustomer) {
          showSnackbar(
            'Please click Create Customer button to save the new customer first',
            'error'
          );
          setIsSubmitting(false);
          return;
        } else {
          const selectedCustomer = customers.find(
            (c) => c.id === Number(values.customerId)
          );
          const defaultAddr =
            selectedCustomer?.addresses?.find(
              (a: any) =>
                a.isDefault === true ||
                a.isdefault === true ||
                a.is_default === true ||
                String(a.isDefault).toLowerCase() === 'true' ||
                String(a.isdefault).toLowerCase() === 'true'
            ) || selectedCustomer?.addresses?.[0];
          addressId =
            defaultAddr?.id ||
            selectedCustomer?.customerProfile?.addresses?.[0]?.id ||
            1;
        }

        const res = await createBookingByAdminAPI({
          customerId: Number(finalCustomerId),
          purohitId: Number(values.purohitId),
          serviceId: Number(values.serviceId),
          customerAddressId: addressId,
          scheduledAt: new Date(values.bookingDate).toISOString(),
          bookingMode: values.bookingMode,
          plan: (values.plan || 'basic').toUpperCase(),
        });

        if (res.success) {
          showSnackbar('Booking created successfully', 'success');
          router.push('/admin/bookings');
        } else {
          showSnackbar(res.message || 'Failed to create booking', 'error');
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || 'Error creating booking',
          'error'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  // Fetch Services filtered by Selected Customer's Default Address City
  useEffect(() => {
    const fetchServices = async () => {
      try {
        let customerCity = '';
        if (values.customerId) {
          const selectedCustomer = customers.find(
            (c) => c.id === Number(values.customerId)
          );
          const defaultAddress =
            selectedCustomer?.addresses?.find(
              (a: any) =>
                a.isDefault === true ||
                a.isdefault === true ||
                a.is_default === true ||
                String(a.isDefault).toLowerCase() === 'true' ||
                String(a.isdefault).toLowerCase() === 'true'
            ) || selectedCustomer?.addresses?.[0];
          customerCity =
            defaultAddress?.city || selectedCustomer?.city || '';
        } else if (values.isNewCustomer && values.newCustomerCity) {
          customerCity = values.newCustomerCity;
        }

        const res = await getServicesAPI(
          1,
          100,
          '',
          undefined,
          undefined,
          undefined,
          true,
          undefined,
          customerCity
        );
        if (res.success) {
          const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.services)
            ? res.services
            : [];
          setAllServices(list);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, [values.customerId, values.newCustomerCity, values.isNewCustomer, customers]);

  // Update Plan default selection when Service changes
  useEffect(() => {
    if (values.serviceId) {
      const selectedService = allServices.find(
        (s) => s.id === Number(values.serviceId)
      );
      const plansObj = selectedService?.plans || {};
      const planKeys = Object.keys(plansObj).filter(
        (key) => plansObj[key] && typeof plansObj[key] === 'object'
      );
      if (planKeys.length > 0 && !planKeys.includes(values.plan)) {
        setFieldValue('plan', planKeys[0]);
      }
    }
  }, [values.serviceId, allServices, values.plan, setFieldValue]);

  // Fetch Purohits filtered by City, BookingMode & ServiceId
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchPurohits = async () => {
        if (values.customerId && values.bookingMode && values.serviceId) {
          const selectedCustomer = customers.find(
            (c) => c.id === Number(values.customerId)
          );
          const defaultAddress =
            selectedCustomer?.addresses?.find(
              (a: any) =>
                a.isDefault === true ||
                a.isdefault === true ||
                a.is_default === true ||
                String(a.isDefault).toLowerCase() === 'true' ||
                String(a.isdefault).toLowerCase() === 'true'
            ) || selectedCustomer?.addresses?.[0];
          const city =
            defaultAddress?.city ||
            selectedCustomer?.city ||
            values.newCustomerCity ||
            '';
          try {
            const purRes = await getAvailablePurohitsForBookingAPI(
              city,
              values.bookingMode,
              purohitSearchText,
              values.serviceId
            );
            if (purRes.success) {
              const list = Array.isArray(purRes.data?.data)
                ? purRes.data.data
                : Array.isArray(purRes.data)
                ? purRes.data
                : Array.isArray(purRes.purohits)
                ? purRes.purohits
                : [];
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
  }, [
    values.customerId,
    values.bookingMode,
    customers,
    purohitSearchText,
    values.serviceId,
    values.newCustomerCity,
  ]);

  const handleCreateCustomer = async () => {
    const {
      newCustomerName,
      newCustomerMobile,
      newCustomerEmail,
      newCustomerAddress,
      newCustomerCity,
      newCustomerPassword,
    } = values;
    if (
      !newCustomerName ||
      !newCustomerMobile ||
      !newCustomerEmail ||
      !newCustomerAddress ||
      !newCustomerCity ||
      !newCustomerPassword
    ) {
      showSnackbar('Please fill all new customer fields', 'error');
      formik.validateForm();
      Object.keys(formik.values).forEach((field) => {
        if (field.startsWith('newCustomer'))
          formik.setFieldTouched(field, true);
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
        setCustomers((prev) => [...prev, newCustomer]);
        setFieldValue('customerId', newCustomer.id);
        setFieldValue('isNewCustomer', false);
        setShowAddCustomer(false);
      } else {
        showSnackbar(res.message || 'Failed to create customer', 'error');
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || 'Error creating customer',
        'error'
      );
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormikProvider value={formik}>
        <FormikValidationSnackbar />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 900,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {/* Page Header */}
          <Box>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{ mb: 2 }}
            >
              <NextLink
                href="/admin/bookings"
                style={{
                  textDecoration: 'none',
                  color: '#64748b',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Bookings
              </NextLink>
              <Typography
                sx={{
                  color: '#10b981',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                Add Booking
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'var(--font-outfit), sans-serif',
                fontWeight: 800,
                color: '#1e293b',
                fontSize: { xs: '1.8rem', md: '2.2rem' },
              }}
            >
              Create New Booking
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-outfit), sans-serif',
                color: '#64748b',
                mt: 0.5,
              }}
            >
              Manually create a booking on behalf of a customer.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              bgcolor: 'white',
            }}
          >
            <Grid container spacing={3}>
              {/* Row 1: Select Customer */}
              <AddBookingCustomerSection
                showAddCustomer={showAddCustomer}
                setShowAddCustomer={setShowAddCustomer}
                customers={customers}
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setCustomerSearchText={setCustomerSearchText}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleCreateCustomer={handleCreateCustomer}
                isCreatingCustomer={isCreatingCustomer}
              />

              {/* Row 2: Grid of Two: Booking Mode (Left) & Select Service (Right) */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: 700,
                    mb: 1,
                    color: '#1e293b',
                  }}
                >
                  Booking Mode *
                </Typography>
                <TextField
                  fullWidth
                  select
                  label="Select Booking Mode *"
                  name="bookingMode"
                  variant="outlined"
                  value={values.bookingMode}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue('purohitId', '');
                  }}
                  onBlur={handleBlur}
                  error={touched.bookingMode && Boolean(errors.bookingMode)}
                  helperText={
                    touched.bookingMode && (errors.bookingMode as string)
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                  }}
                >
                  <MenuItem
                    value=""
                    disabled
                    sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#94a3b8' }}
                  >
                    Select Booking Mode
                  </MenuItem>
                  <MenuItem
                    value="ONLINE"
                    sx={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                  >
                    Online
                  </MenuItem>
                  <MenuItem
                    value="OFFLINE"
                    sx={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                  >
                    Offline
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: 700,
                    mb: 1,
                    color: '#1e293b',
                  }}
                >
                  Select Service *
                </Typography>
                <TextField
                  fullWidth
                  select
                  label="Select Service *"
                  name="serviceId"
                  variant="outlined"
                  value={values.serviceId}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue('purohitId', '');
                  }}
                  onBlur={handleBlur}
                  error={touched.serviceId && Boolean(errors.serviceId)}
                  helperText={
                    touched.serviceId && (errors.serviceId as string)
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                  }}
                  slotProps={{
                    select: {
                      MenuProps: {
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left',
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                        sx: { maxHeight: 350 },
                      },
                    },
                  }}
                >
                  <MenuItem
                    value=""
                    disabled
                    sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#94a3b8' }}
                  >
                    Select Service
                  </MenuItem>
                  {allServices.length === 0 && (
                    <MenuItem
                      disabled
                      value=""
                      sx={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                      No services available for selected city
                    </MenuItem>
                  )}
                  {allServices.map((s: any) => (
                    <MenuItem
                      key={s.id}
                      value={s.id}
                      sx={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Row 3: Service Details Card & Package Plan Cards */}
              <AddBookingServiceSection
                allServices={allServices}
                values={values}
                setFieldValue={setFieldValue}
              />

              {/* Row 4: Grid of Two: Select Purohit (Left) & Booking Date & Time (Right) */}
              <AddBookingPurohitSection
                purohits={purohits}
                values={values}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setPurohitSearchText={setPurohitSearchText}
              />
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                component={NextLink}
                href="/admin/bookings"
                sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                sx={{
                  background: '#10b981',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    background: '#059669',
                    boxShadow: 'none',
                  },
                }}
              >
                {isSubmitting ? 'Creating...' : 'Create Booking'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </FormikProvider>
    </LocalizationProvider>
  );
}

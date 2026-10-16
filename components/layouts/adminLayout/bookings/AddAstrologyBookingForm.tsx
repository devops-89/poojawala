'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { FormikProvider, useFormik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

import { useEffect, useState } from 'react';
import { createAstrologyBookingByAdminAPI } from '@/api/bookingControllers';
import {
  createCustomerByAdminAPI,
  getAstrologersAPI,
  getCustomersListAPI,
} from '@/api/userControllers';
import FormikValidationSnackbar from '@/components/widgets/FormikValidationSnackbar';
import { useSnackbarStore } from '@/stores/snackbarStore';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';

import AddBookingCustomerSection from './AddBookingCustomerSection';
import AddBookingAstrologerSection from './AddBookingAstrologerSection';
import AddBookingScheduleSection from './AddBookingScheduleSection';

const validationSchema = Yup.object().shape({
  customerId: Yup.string().when('isNewCustomer', {
    is: false,
    then: (schema) => schema.required('Customer is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  newCustomerName: Yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) =>
      schema
        .trim()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .matches(/^[a-zA-Z\s.]+$/, 'Name should only contain letters and spaces'),
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
  astrologerId: Yup.string().required('Astrologer is required'),
  bookingDate: Yup.string().required('Booking date & time is required'),
});

export default function AddAstrologyBookingForm() {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const [customers, setCustomers] = useState<any[]>([]);
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [astrologerSearchText, setAstrologerSearchText] = useState('');
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

  // Fetch Astrologers List
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchAstrologers = async () => {
        try {
          const res = await getAstrologersAPI(
            1,
            100,
            astrologerSearchText,
            'APPROVED',
            'ACTIVE'
          );
          if (res.success) {
            const list = Array.isArray(res.data?.data)
              ? res.data.data
              : Array.isArray(res.data?.users)
              ? res.data.users
              : Array.isArray(res.data)
              ? res.data
              : [];
            setAstrologers(list);
          }
        } catch (error) {
          console.error('Error fetching astrologers:', error);
        }
      };
      fetchAstrologers();
    }, 400);
    return () => clearTimeout(timer);
  }, [astrologerSearchText]);

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
      astrologerId: '',
      bookingDate: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalCustomerId = values.customerId;

        if (values.isNewCustomer) {
          showSnackbar(
            'Please click Create Customer button to save the new customer first',
            'error'
          );
          setIsSubmitting(false);
          return;
        }

        const res = await createAstrologyBookingByAdminAPI({
          customerId: Number(finalCustomerId),
          astrologerId: Number(values.astrologerId),
          scheduledAt: moment(values.bookingDate).toISOString(true),
        });

        if (res.success) {
          showSnackbar('Astrology booking created successfully', 'success');
          router.push('/admin/astrology-bookings');
        } else {
          showSnackbar(res.message || 'Failed to create astrology booking', 'error');
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || 'Error creating astrology booking',
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
    setFieldTouched,
  } = formik;

  const handleCreateCustomer = async () => {
    const {
      newCustomerName,
      newCustomerMobile,
      newCustomerEmail,
      newCustomerPassword,
      newCustomerAddress,
      newCustomerCity,
    } = values;

    if (
      !newCustomerName ||
      !newCustomerMobile ||
      !newCustomerEmail ||
      !newCustomerPassword ||
      !newCustomerAddress ||
      !newCustomerCity
    ) {
      showSnackbar('Please fill all new customer fields', 'error');
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

        setFieldValue('newCustomerName', '');
        setFieldValue('newCustomerMobile', '');
        setFieldValue('newCustomerEmail', '');
        setFieldValue('newCustomerAddress', '');
        setFieldValue('newCustomerCity', '');
        setFieldValue('newCustomerPassword', '');
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
          autoComplete="off"
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
                href="/admin/astrology-bookings"
                style={{
                  textDecoration: 'none',
                  color: '#64748b',
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Astrology Bookings
              </NextLink>
              <Typography
                sx={{
                  color: '#1e293b',
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Add Booking
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1e293b',
                fontFamily: FONTS.OUTFIT,
              }}
            >
              Add Astrology Booking
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: '#64748b',
                mt: 0.5,
              }}
            >
              Manually schedule an astrology consultation on behalf of a customer.
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
              {/* Row 1: Select or Create Customer */}
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
                setFieldTouched={setFieldTouched}
                setCustomerSearchText={setCustomerSearchText}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleCreateCustomer={handleCreateCustomer}
                isCreatingCustomer={isCreatingCustomer}
              />

              {/* Row 2: Select Astrologer & Preview */}
              <AddBookingAstrologerSection
                astrologers={astrologers}
                values={values}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setAstrologerSearchText={setAstrologerSearchText}
              />

              {/* Row 3: Booking Schedule Date & Time */}
              <AddBookingScheduleSection
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
              />
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                component={NextLink}
                href="/admin/astrology-bookings"
                sx={{
                  color: '#64748b',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: FONTS.OUTFIT,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                sx={{
                  background: COLORS.PRIMARY,
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  px: 4,
                  py: 1.2,
                  boxShadow: 'none',
                  fontFamily: FONTS.OUTFIT,
                  '&:hover': {
                    background: COLORS.PRIMARY_DARK,
                    boxShadow: 'none',
                  },
                }}
              >
                {isSubmitting ? 'Creating...' : 'Create Astrology Booking'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </FormikProvider>
    </LocalizationProvider>
  );
}

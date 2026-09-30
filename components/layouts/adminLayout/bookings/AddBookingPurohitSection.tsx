'use client';

import {
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import React from 'react';

interface AddBookingPurohitSectionProps {
  purohits: any[];
  values: any;
  errors: any;
  touched: any;
  handleBlur: any;
  setFieldValue: any;
  setPurohitSearchText: (text: string) => void;
}

export default function AddBookingPurohitSection({
  purohits,
  values,
  errors,
  touched,
  handleBlur,
  setFieldValue,
  setPurohitSearchText,
}: AddBookingPurohitSectionProps) {
  return (
    <>
      {/* Select Purohit */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-outfit), sans-serif',
            fontWeight: 700,
            mb: 1,
            color: '#1e293b',
          }}
        >
          Select Purohit
        </Typography>
        <Autocomplete
          options={purohits}
          isOptionEqualToValue={(option: any, val: any) =>
            option?.id === val?.id
          }
          getOptionLabel={(option: any) => {
            if (!option) return '';
            const fName = option.firstName || option.user?.firstName || '';
            const lName = option.lastName || option.user?.lastName || '';
            const contact =
              option.phone ||
              option.user?.phone ||
              option.email ||
              option.user?.email ||
              '';
            const name = `${fName} ${lName}`.trim() || `Purohit #${option.id}`;
            return contact ? `${name} (${contact})` : name;
          }}
          renderOption={(props, option: any) => {
            const fName = option.firstName || option.user?.firstName || '';
            const lName = option.lastName || option.user?.lastName || '';
            const contact =
              option.phone ||
              option.user?.phone ||
              option.email ||
              option.user?.email ||
              '';
            const name = `${fName} ${lName}`.trim() || `Purohit #${option.id}`;
            const label = contact ? `${name} (${contact})` : name;
            return (
              <li {...props} key={option.id}>
                {label}
              </li>
            );
          }}
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
              placeholder={
                !values.bookingMode ||
                !values.customerId ||
                !values.serviceId
                  ? 'Select Customer, Mode & Service first'
                  : 'Search purohit by name, email or phone'
              }
              error={touched.purohitId && Boolean(errors.purohitId)}
              helperText={
                touched.purohitId ? (errors.purohitId as string) : undefined
              }
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
              }}
            />
          )}
        />
      </Grid>

      {/* Booking Date & Time */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-outfit), sans-serif',
            fontWeight: 700,
            mb: 1,
            color: '#1e293b',
          }}
        >
          Booking Date & Time *
        </Typography>
        <DateTimePicker
          value={values.bookingDate ? moment(values.bookingDate) : null}
          onChange={(newValue) => {
            setFieldValue(
              'bookingDate',
              newValue ? newValue.toISOString() : ''
            );
          }}
          slotProps={{
            textField: {
              name: 'bookingDate',
              variant: 'outlined',
              error: touched.bookingDate && Boolean(errors.bookingDate),
              helperText: touched.bookingDate
                ? (errors.bookingDate as string)
                : undefined,
              fullWidth: true,
              sx: {
                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
              },
            } as any,
          }}
        />
      </Grid>
    </>
  );
}

'use client';
import { FONTS } from "@/utils/fonts";

import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import React from 'react';

interface AddBookingScheduleSectionProps {
  values: any;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export default function AddBookingScheduleSection({
  values,
  errors,
  touched,
  setFieldValue,
}: AddBookingScheduleSectionProps) {
  return (
    <Grid size={{ xs: 12 }}>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          mb: 1,
          color: '#1e293b',
        }}
      >
        Booking Date & Time *
      </Typography>
      <DateTimePicker
        value={values.bookingDate ? moment(values.bookingDate) : null}
        disablePast
        minDateTime={moment()}
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
  );
}

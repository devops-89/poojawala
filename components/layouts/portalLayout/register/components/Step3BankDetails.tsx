'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { FormikProps } from 'formik';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';
import { allowOnlyLettersOnKeyDown, sanitizeLettersOnly } from '@/utils/helpers';

interface Step3Props {
  formik: FormikProps<any>;
}

export default function Step3BankDetails({ formik }: Step3Props) {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          mb: 3,
        }}
      >
        Bank or UPI Details
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            name="paymentMethod"
            value={formik.values.paymentMethod}
            onChange={formik.handleChange}
          >
            <FormControlLabel
              value="BANK"
              control={<Radio sx={{ '&.Mui-checked': { color: COLORS.PRIMARY } }} />}
              label={
                <Typography
                  sx={{
                    fontWeight:
                      formik.values.paymentMethod === 'BANK' ? 700 : 500,
                  }}
                >
                  Bank Account
                </Typography>
              }
            />
            <FormControlLabel
              value="UPI"
              control={<Radio sx={{ '&.Mui-checked': { color: COLORS.PRIMARY } }} />}
              label={
                <Typography
                  sx={{
                    fontWeight:
                      formik.values.paymentMethod === 'UPI' ? 700 : 500,
                  }}
                >
                  UPI ID
                </Typography>
              }
              sx={{ ml: 4 }}
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {formik.values.paymentMethod === 'UPI' ? (
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              name="upiId"
              label="UPI ID (e.g. 9876543210@ybl) *"
              variant="outlined"
              value={formik.values.upiId}
              onChange={(e) => {
                formik.setFieldValue('upiId', e.target.value.trim());
              }}
              error={formik.touched.upiId && Boolean(formik.errors.upiId)}
              helperText={formik.touched.upiId && (formik.errors.upiId as string)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="accountName"
              label="Account Holder Name *"
              variant="outlined"
              value={formik.values.accountName}
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                formik.setFieldValue('accountName', sanitizeLettersOnly(e.target.value));
              }}
              error={
                formik.touched.accountName &&
                Boolean(formik.errors.accountName)
              }
              helperText={
                formik.touched.accountName &&
                (formik.errors.accountName as string)
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="bankName"
              label="Bank Name *"
              variant="outlined"
              value={formik.values.bankName}
              onKeyDown={allowOnlyLettersOnKeyDown}
              onChange={(e) => {
                formik.setFieldValue('bankName', sanitizeLettersOnly(e.target.value));
              }}
              error={formik.touched.bankName && Boolean(formik.errors.bankName)}
              helperText={
                formik.touched.bankName && (formik.errors.bankName as string)
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="accountNumber"
              label="Account Number *"
              variant="outlined"
              value={formik.values.accountNumber}
              onKeyDown={(e) => {
                if (
                  !/\d/.test(e.key) &&
                  !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'].includes(e.key) &&
                  !e.ctrlKey &&
                  !e.metaKey
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                formik.setFieldValue('accountNumber', val);
              }}
              error={
                formik.touched.accountNumber &&
                Boolean(formik.errors.accountNumber)
              }
              helperText={
                formik.touched.accountNumber &&
                (formik.errors.accountNumber as string)
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="ifscCode"
              label="IFSC Code *"
              variant="outlined"
              value={formik.values.ifscCode}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
                formik.setFieldValue('ifscCode', val);
              }}
              error={formik.touched.ifscCode && Boolean(formik.errors.ifscCode)}
              helperText={
                formik.touched.ifscCode && (formik.errors.ifscCode as string)
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

'use client';

import React from 'react';
import { Box, Typography, TextField, Link as MuiLink } from '@mui/material';
import { FormikProps } from 'formik';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

interface Step1Props {
  formik: FormikProps<any>;
  resendTimer: number;
  handlePortalResendOtp: () => void;
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

export default function Step1OtpVerification({
  formik,
  resendTimer,
  handlePortalResendOtp,
  otpRefs,
}: Step1Props) {
  const handleOtpChange = (idx: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (value !== '' && !cleanVal) return;

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 6);
      const newOtp = [...formik.values.otp];
      for (let i = 0; i < digits.length && (idx + i) < 6; i++) {
        newOtp[idx + i] = digits[i];
      }
      formik.setFieldValue('otp', newOtp);
      const nextFocus = Math.min(5, idx + digits.length - 1);
      otpRefs.current[nextFocus]?.focus();
      return;
    }

    const newOtp = [...formik.values.otp];
    const char = cleanVal.slice(-1);
    newOtp[idx] = char;
    formik.setFieldValue('otp', newOtp);
    if (char && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedText) return;
    const newOtp = [...formik.values.otp];
    for (let i = 0; i < pastedText.length; i++) {
      newOtp[i] = pastedText[i];
    }
    formik.setFieldValue('otp', newOtp);
    const nextFocus = Math.min(5, pastedText.length - 1);
    otpRefs.current[nextFocus]?.focus();
  };

  const handleOtpKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === 'Backspace' && !formik.values.otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          mb: 2,
        }}
      >
        Verify your Identity
      </Typography>
      <Typography
        sx={{ fontFamily: FONTS.OUTFIT, color: COLORS.MUTED_TEXT, mb: 4 }}
      >
        We've sent a 6-digit OTP to {formik.values.email}{formik.values.mobileNumber ? ` and ${formik.values.countryCode} ${formik.values.mobileNumber}` : ''}.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        {formik.values.otp.map((val: string, idx: number) => (
          <TextField
            key={idx}
            variant="outlined"
            value={val}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
            onPaste={handleOtpPaste}
            inputRef={(el) => {
              otpRefs.current[idx] = el;
            }}
            slotProps={{ htmlInput: { maxLength: 6 } }}
            sx={{
              width: '50px',
              '& input': { textAlign: 'center', fontSize: '20px', fontWeight: 700, p: 1.5 },
              '& .MuiOutlinedInput-root': { borderRadius: '12px' },
            }}
          />
        ))}
      </Box>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          color: COLORS.MUTED_TEXT,
          textAlign: 'center',
          mt: 3,
          fontSize: '14px',
        }}
      >
        Didn't receive the OTP?{' '}
        {resendTimer > 0 ? (
          <span style={{ color: '#999', fontWeight: 600 }}>
            Resend in {resendTimer}s
          </span>
        ) : (
          <MuiLink
            component="button"
            type="button"
            onClick={handlePortalResendOtp}
            sx={{
              color: COLORS.PRIMARY,
              fontWeight: 700,
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: FONTS.OUTFIT,
              fontSize: '14px',
            }}
          >
            Resend
          </MuiLink>
        )}
      </Typography>
    </Box>
  );
}

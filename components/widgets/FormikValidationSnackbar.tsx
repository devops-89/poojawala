'use client';
import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';
import { useSnackbarStore } from '@/stores/snackbarStore';

export interface FormikValidationSnackbarProps {
  message?: string;
}

export default function FormikValidationSnackbar({
  message = 'Please fill in all mandatory fields',
}: FormikValidationSnackbarProps) {
  const { errors, submitCount } = useFormikContext<any>();
  const { showSnackbar } = useSnackbarStore();
  const prevSubmitCount = useRef(submitCount);

  useEffect(() => {
    if (submitCount > prevSubmitCount.current) {
      prevSubmitCount.current = submitCount;
      if (errors && Object.keys(errors).length > 0) {
        if (errors.standardPrice) {
          showSnackbar(
            typeof errors.standardPrice === 'string'
              ? errors.standardPrice
              : 'Please fill in all required Standard Plan details.',
            'error'
          );
        } else if (errors.basicPrice) {
          showSnackbar(
            typeof errors.basicPrice === 'string'
              ? errors.basicPrice
              : 'Please fill in all required Basic Plan details.',
            'error'
          );
        } else {
          const errorList = Object.values(errors);
          const firstStringError = errorList.find((err) => typeof err === 'string');
          showSnackbar(
            typeof firstStringError === 'string' ? firstStringError : message,
            'error'
          );
        }
      }
    }
  }, [submitCount, errors, showSnackbar, message]);

  return null;
}

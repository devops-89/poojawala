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
  const { errors, submitCount } = useFormikContext();
  const { showSnackbar } = useSnackbarStore();
  const prevSubmitCount = useRef(submitCount);

  useEffect(() => {
    if (submitCount > prevSubmitCount.current) {
      prevSubmitCount.current = submitCount;
      if (errors && Object.keys(errors).length > 0) {
        showSnackbar(message, 'error');
      }
    }
  }, [submitCount, errors, showSnackbar, message]);

  return null;
}

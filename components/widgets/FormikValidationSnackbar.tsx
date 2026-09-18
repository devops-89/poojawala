'use client';
import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';
import { useSnackbarStore } from '@/stores/snackbarStore';

export default function FormikValidationSnackbar() {
  const { errors, submitCount } = useFormikContext();
  const { showSnackbar } = useSnackbarStore();
  const prevSubmitCount = useRef(submitCount);

  useEffect(() => {
    if (submitCount > prevSubmitCount.current) {
      prevSubmitCount.current = submitCount;
      if (errors && Object.keys(errors).length > 0) {
        const extractErrors = (obj: any): string[] => {
          let msgs: string[] = [];
          Object.values(obj).forEach((val: any) => {
            if (typeof val === 'string') {
              msgs.push(val);
            } else if (typeof val === 'object' && val !== null) {
              msgs = msgs.concat(extractErrors(val));
            }
          });
          return msgs;
        };
        const errorMsgs = extractErrors(errors);
        const firstMsg = errorMsgs[0] || 'Please fill in all mandatory fields';
        showSnackbar(firstMsg, 'error');
      }
    }
  }, [submitCount, errors, showSnackbar]);

  return null;
}

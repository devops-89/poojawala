import React from 'react';

export const extractBackendErrorMessage = (error: any, fallback = 'Something went wrong'): string => {
  if (!error) return fallback;
  const data = error.response?.data;
  if (data) {
    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message.join(', ');
    }
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error;
    }
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
  }
  if (error.message && typeof error.message === 'string') {
    return error.message;
  }
  return fallback;
};

export const allowOnlyLettersOnKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'].includes(e.key)
  ) {
    return;
  }
  if (!/^[a-zA-Z\s.-]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeLettersOnly = (val: string): string => {
  return (val || '').replace(/[^a-zA-Z\s.-]/g, '');
};

export interface BankFormValues {
  paymentMethod: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
}

export const validateBankForm = (bankForm: BankFormValues): string | null => {
  if (bankForm.paymentMethod === 'UPI') {
    if (!bankForm.upiId || !bankForm.upiId.trim()) {
      return 'UPI ID is required';
    }
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(bankForm.upiId.trim())) {
      return 'Please enter a valid UPI ID (e.g. 9876543210@ybl or user@upi)';
    }
  } else {
    if (!bankForm.accountHolderName || !bankForm.accountHolderName.trim()) {
      return 'Account Holder Name is required';
    }
    if (!/^[a-zA-Z\s.-]+$/.test(bankForm.accountHolderName.trim())) {
      return 'Account Holder Name cannot contain numbers or special characters';
    }
    if (!bankForm.bankName || !bankForm.bankName.trim()) {
      return 'Bank Name is required';
    }
    if (!/^[a-zA-Z\s.-]+$/.test(bankForm.bankName.trim())) {
      return 'Bank Name cannot contain numbers or special characters';
    }
    if (!bankForm.accountNumber || !bankForm.accountNumber.trim()) {
      return 'Account Number is required';
    }
    if (!/^[0-9]{9,18}$/.test(bankForm.accountNumber.trim())) {
      return 'Account Number must be between 9 and 18 digits (numbers only)';
    }
    if (!bankForm.ifscCode || !bankForm.ifscCode.trim()) {
      return 'IFSC Code is required';
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(bankForm.ifscCode.trim().toUpperCase())) {
      return 'Please enter a valid 11-character IFSC Code (e.g. SBIN0001234)';
    }
  }
  return null;
};

export const formatPhoneNumber = (phone?: string, countryCode?: string): string => {
  if (!phone) return "N/A";
  const p = phone.trim();
  if (!p) return "N/A";
  if (!countryCode) {
    return p.startsWith("+") ? p : `+91 ${p}`;
  }
  const cleanCc = countryCode.trim();
  const formattedCc = cleanCc.startsWith("+") ? cleanCc : `+${cleanCc}`;
  if (p.startsWith(formattedCc) || p.startsWith(cleanCc)) {
    return p.startsWith("+") ? p : `+${p}`;
  }
  return `${formattedCc} ${p}`;
};

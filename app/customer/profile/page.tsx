import React from 'react';
import { Metadata } from 'next';
import CustomerProfileContent from '@/components/layouts/customerLayout/profile/CustomerProfileContent';

export const metadata: Metadata = {
  title: 'My Profile | Poojawala',
  description: 'View and manage your Poojawala customer profile',
};

export default function CustomerProfilePage() {
  return <CustomerProfileContent />;
}

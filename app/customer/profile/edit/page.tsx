import React from 'react';
import { Metadata } from 'next';
import CustomerEditProfileContent from '@/components/layouts/customerLayout/profile/CustomerEditProfileContent';

export const metadata: Metadata = {
  title: 'Edit Profile | 1Pooja Customer Portal',
  description: 'Edit your personal details and manage addresses.',
};

export default function CustomerEditProfilePage() {
  return <CustomerEditProfileContent />;
}

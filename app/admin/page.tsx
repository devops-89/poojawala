import { Metadata } from 'next';
import AdminLoginForm from '@/components/layouts/adminLayout/AdminLoginForm';

export default function AdminLogin() {
  return <AdminLoginForm />;
}

export const metadata: Metadata = {
  title: 'Admin Login | Poojawala Control Centre',
  description: 'Secure login for Poojawala administrators to access the control centre and dashboard.',
};

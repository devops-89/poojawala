import { Metadata } from 'next';
import ProfileContent from '@/components/layouts/portalLayout/ProfileContent';

export default function EditProfilePage() {
  return <ProfileContent />;
}

export const metadata: Metadata = {
  title: 'Edit Profile | Poojawala Partner Portal',
  description: 'Update your professional profile, biography, qualifications, and the languages you speak as a Poojawala Purohit.',
};

'use client';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { useEffect } from 'react';

export default function CustomerProfileContent() {
  const { profile, fetchProfile, loading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif' }}>Loading profile...</Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif' }}>No profile data found.</Typography>
      </Box>
    );
  }

  const defaultAddress = profile.addresses?.find((addr: any) => addr.isDefault) || profile.addresses?.[0];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 0 } }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
            My Profile
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666' }}>
            View and manage your personal details and addresses.
          </Typography>
        </Box>
        <Box 
          component="button"
          onClick={() => router.push('/customer/profile/edit')}
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#FF6200', 
            color: '#ffffff',
            fontFamily: '"DM Sans", sans-serif',
            textTransform: 'none', 
            borderRadius: '30px',
            fontWeight: 700,
            fontSize: '14px',
            px: 3,
            py: 1.2,
            boxShadow: '0 4px 14px rgba(255, 98, 0, 0.3)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { backgroundColor: '#F05A00', boxShadow: '0 4px 14px rgba(255, 98, 0, 0.4)' }
          }}
        >
          <EditIcon sx={{ fontSize: 18 }} />
          Edit Profile
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid size={{xs:12,md:4}}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              src={profile.profileImage || undefined} 
              sx={{ width: 120, height: 120, mb: 3, bgcolor: '#FF6200', fontSize: '3rem', boxShadow: '0 4px 14px rgba(255, 98, 0, 0.2)' }}
            >
              {!profile.profileImage && <PersonIcon sx={{ fontSize: 60, color: 'white' }} />}
            </Avatar>
            <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 1 }}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', mb: 2 }}>
              @{profile.username}
            </Typography>
            <Chip 
              icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />} 
              label={profile.status} 
              sx={{ bgcolor: '#e0f2fe', color: '#0284c7', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}
              size="small"
            />
          </Paper>

          {/* Account Info */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', mt: 4 }}>
            <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 3 }}>
              Account Details
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmailIcon sx={{ color: '#64748b', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', fontFamily: '"DM Sans", sans-serif' }}>EMAIL</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>{profile.email}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneIcon sx={{ color: '#64748b', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', fontFamily: '"DM Sans", sans-serif' }}>PHONE</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>{profile.phone || 'Not provided'}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarMonthIcon sx={{ color: '#64748b', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', fontFamily: '"DM Sans", sans-serif' }}>JOINED ON</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>
                  {new Date(profile.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Details & Address */}
        <Grid size={{xs:12,md:8}}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 4 }}>
            <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 3 }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{xs:12,md:6}}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BadgeIcon sx={{ fontSize: 16, color: '#64748b' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>FIRST NAME</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>
                    {profile.firstName || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{xs:12,md:6}}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BadgeIcon sx={{ fontSize: 16, color: '#64748b' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>LAST NAME</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>
                    {profile.lastName || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{xs:12,md:6}}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CakeIcon sx={{ fontSize: 16, color: '#64748b' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>DATE OF BIRTH</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif' }}>
                    {profile.dob ? new Date(profile.dob).toLocaleDateString('en-GB') : '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{xs:12,md:6}}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationCityIcon sx={{ fontSize: 16, color: '#64748b' }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: '"DM Sans", sans-serif' }}>BIRTH PLACE</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1e293b', fontFamily: '"DM Sans", sans-serif', textTransform: 'capitalize' }}>
                    {profile.birthPlace || '-'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 3 }}>
              Default Address
            </Typography>
            {defaultAddress ? (
              <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 3, bgcolor: '#f8fafc' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon sx={{ color: '#FF6200' }} />
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1e293b' }}>
                      {defaultAddress.addressLabel || 'Home'}
                    </Typography>
                  </Box>
                  <Chip label="Default" size="small" sx={{ bgcolor: '#FFF0E6', color: '#FF6200', fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }} />
                </Box>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#475569', mb: 1, lineHeight: 1.6 }}>
                  {defaultAddress.fullAddress}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '0.875rem' }}>
                    <strong>City:</strong> <span style={{ textTransform: 'capitalize' }}>{defaultAddress.city}</span>
                  </Typography>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '0.875rem' }}>
                    <strong>Pincode:</strong> {defaultAddress.pincode}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', mb: 2 }}>
                  No default address added yet.
                </Typography>
                <Box 
                  component="button"
                  onClick={() => router.push('/customer/profile/edit?tab=location')}
                  sx={{ 
                    bgcolor: '#FF6200', 
                    color: 'white', 
                    border: 'none',
                    cursor: 'pointer',
                    px: 3,
                    py: 1,
                    fontFamily: '"DM Sans", sans-serif', 
                    fontWeight: 600,
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: '#ea580c' }
                  }}
                >
                  Add Address
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

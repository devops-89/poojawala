'use client';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Avatar, Box, Paper, Typography } from '@mui/material';

interface DashboardHeroProfileProps {
  profile: any;
}

export default function DashboardHeroProfile({ profile }: DashboardHeroProfileProps) {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: '24px',
        mb: 4,
        background: 'linear-gradient(135deg, #FF6200 0%, #FF8A3D 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(255, 98, 0, 0.2)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          textAlign: { xs: 'center', md: 'left' },
          gap: { xs: 2, md: 4 },
        }}
      >
        <Avatar
          src={profile?.profileImage || profile?.avatar || undefined}
          sx={{
            width: 100,
            height: 100,
            border: '4px solid rgba(255,255,255,0.3)',
            bgcolor: 'rgba(255,255,255,0.2)',
          }}
        >
          {!profile?.profileImage && !profile?.avatar && (
            <PersonIcon sx={{ fontSize: 70, color: 'white' }} />
          )}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              gap: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'var(--font-outfit), sans-serif',
                fontWeight: 800,
                fontSize: { xs: '24px', md: '32px' },
              }}
            >
              Welcome, {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Customer'}!
            </Typography>
            <VerifiedIcon
              sx={{
                color: '#4CAF50',
                bgcolor: 'white',
                borderRadius: '50%',
                fontSize: { xs: 24, md: 28 },
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: 'var(--font-outfit), sans-serif',
              opacity: 0.9,
              fontSize: '16px',
              mb: 2,
            }}
          >
            Here is what's happening with your account today.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              gap: 3,
              flexWrap: 'wrap',
              opacity: 0.9,
            }}
          >
            {profile?.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {profile.email}
                </Typography>
              </Box>
            )}
            {profile?.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  +91 {profile.phone}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {/* Decorative background circle */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0,
        }}
      />
    </Paper>
  );
}

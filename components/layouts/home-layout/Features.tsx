'use client';
import { Box, Container, Typography } from '@mui/material';

const features = [
  {
    icon: '/images/home/hero/righttick.png',
    title: 'Trusted Purohit',
    subtitle: 'Verified & Experienced'
  },
  {
    icon: '/images/home/hero/lock.png',
    title: 'Secure Booking',
    subtitle: 'Safe & Reliable'
  },
  {
    icon: '/images/home/hero/headphone.png',
    title: '24/7 Support',
    subtitle: 'Here For You'
  }
];

export default function Features() {
  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, rgba(255, 225, 195, 0.95) 0%, rgba(255, 255, 255, 1) 100%)', 
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: { xs: 4, md: 2 }
        }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                component="img"
                src={feature.icon}
                alt={feature.title}
                sx={{ width: 40, height: 40, objectFit: 'contain' }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A1A1A', lineHeight: 1.2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {feature.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

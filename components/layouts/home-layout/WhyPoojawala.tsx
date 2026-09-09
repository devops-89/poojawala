'use client';

import { Box, Container, Typography } from '@mui/material';

export default function WhyPoojawala() {
  return (
    <Box sx={{ position: 'relative',overflow: 'hidden', bgcolor: '#ffffff', minHeight: { md: '850px' }, py: { xs: 8, md: 10 }, display: 'flex', alignItems: 'center' ,pb:10}}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '875px', pr: { md: 5 }, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: '"DM Sans", sans-serif', 
              fontWeight: 700, 
              fontSize: { xs: '32px', md: '48px' }, 
              color: '#141414',
              lineHeight: 'normal',
              mb: '4px', // Very tight spacing as per Figma
              mt:-4
            }}
          >
            Why Poojawala ?
          </Typography>
          
          <Box 
            component="img"
            src="/images/home/whyLine.png"
            alt="Decoration Line"
            sx={{ width: '390px', height: '34px', mb: '40px' }} 
          />

          <Typography 
            sx={{ 
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 400,
              fontSize: { xs: '16px', md: '24px' },
              color: '#141414',
              lineHeight: '130.6%',
              mb: '28px'
            }}
          >
            Poojawala is a trusted online platform that connects families with <span style={{ color: '#CC2E2E', fontStyle: 'italic' }}>verified pandits and purohits</span> for religious ceremonies across India.
          </Typography>
          
          <Typography 
            sx={{ 
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 400,
              fontSize: { xs: '16px', md: '24px' },
              color: '#141414',
              lineHeight: '130.6%'
            }}
          >
            From Griha Pravesh and Satyanarayan Puja to weddings and festivals, it offers convenient booking, transparent pricing, regional language support, and reliable spiritual services, making traditional rituals simple, accessible, and stress-free.
          </Typography>
        </Box>
      </Container>
      
      {/* Right Side Background Decorations */}
      <Box 
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          display: { xs: 'none', md: 'block' } // Hide on mobile for better text reading
        }}
      >
        {/* Chakra Right */}
        <Box 
          component="img"
          src="/images/home/chakraright.png"
          alt="Chakra Pattern"
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translate(30%, -50%)', // Mathematically bleeds exactly 50% regardless of screen size
            width: '700px',
            height: '700px',
            objectFit: 'contain'
          }}
        />
        
        {/* Thali Image */}
        <Box 
          component="img"
          src="/images/home/thali.png"
          alt="Pooja Thali"
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translate(30%, -50%)', // Mathematically bleeds exactly 50% regardless of screen size
            width: '650px',
            height: '650px',
            objectFit: 'contain'
          }}
        />
      </Box>
    </Box>
  );
}

'use client';

import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { FONTS } from '@/utils/fonts';

export default function WhyPoojawala() {
  return (
    <Box id="why-poojawala" sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#ffffff', minHeight: { xs: 'auto', md: '800px' }, py: { xs: 5, md: 9 }, display: 'flex', alignItems: 'center', scrollMarginTop: '90px' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '875px', pr: { md: 5 }, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: FONTS.OUTFIT, 
              fontWeight: 700, 
              fontSize: { xs: '28px', sm: '36px', md: '44px' }, 
              color: '#1A1A1A',
              lineHeight: 1.25,
              mb: 1.5,
              mt: { xs: 0, md: -2 }
            }}
          >
            Why 1Pooja ?
          </Typography>
          
          <Box sx={{ mb: { xs: '24px', md: '36px' } }}>
            <Image 
              src="/images/home/poojaPackages/dhanush.svg"
              alt="Decoration Line"
              width={340}
              height={22}
              loading="lazy"
              style={{ width: '100%', maxWidth: '340px', height: 'auto', objectFit: 'contain' }}
            />
          </Box>

          <Typography 
            sx={{ 
              fontFamily: FONTS.OUTFIT, 
              fontWeight: 400, 
              fontSize: { xs: '14px', md: '16px' }, 
              color: '#555555', 
              lineHeight: 1.65,
              mb: '20px'
            }}
          >
            1Pooja is a trusted online platform that connects families with <span style={{ color: '#CC2E2E', fontStyle: 'italic', fontWeight: 600 }}>verified pandits and purohits</span> for religious ceremonies across India.
          </Typography>
          
          <Typography 
            sx={{ 
              fontFamily: FONTS.OUTFIT, 
              fontWeight: 400, 
              fontSize: { xs: '14px', md: '16px' }, 
              color: '#555555', 
              lineHeight: 1.65
            }}
          >
            From Griha Pravesh and Satyanarayan Pooja to weddings and festivals, it offers convenient booking, transparent pricing, regional language support, and reliable spiritual services, making traditional rituals simple, accessible, and stress-free.
          </Typography>
        </Box>
      </Container>
      
      {/* Right Side Background Decorations (Hidden on mobile) */}
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
          display: { xs: 'none', md: 'block' }
        }}
      >
        {/* Chakra Right */}
        <Box 
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translate(30%, -50%)',
            width: '700px',
            height: '700px',
          }}
        >
          <Image 
            src="/images/home/chakraright.webp"
            alt="Chakra Pattern"
            width={700}
            height={700}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>
        
        {/* Thali Image */}
        <Box 
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translate(30%, -50%)',
            width: '650px',
            height: '650px',
          }}
        >
          <Image 
            src="/images/home/thali.webp"
            alt="Pooja Thali"
            width={650}
            height={650}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>
      </Box>
    </Box>
  );
}

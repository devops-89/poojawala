'use client';

import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

export default function WhyPoojawala() {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#ffffff', minHeight: { xs: 'auto', md: '850px' }, py: { xs: 8, md: 10 }, display: 'flex', alignItems: 'center', pb: 10 }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '875px', pr: { md: 5 }, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: FONTS.PRIMARY, 
              fontWeight: 700, 
              fontSize: { xs: '32px', md: '48px' }, 
              color: '#141414',
              lineHeight: 'normal',
              mb: '4px',
              mt: -4
            }}
          >
            Why 1Pooja ?
          </Typography>
          
          <Box sx={{ mb: '40px' }}>
            <Image 
              src="/images/home/whyLine.webp"
              alt="Decoration Line"
              width={390}
              height={34}
              loading="lazy"
              style={{ width: '100%', maxWidth: '390px', height: 'auto', objectFit: 'contain' }}
            />
          </Box>

          <Typography 
            sx={{ 
              fontFamily: FONTS.PRIMARY, 
              fontWeight: 400, 
              fontSize: { xs: '16px', md: '24px' }, 
              color: '#141414', 
              lineHeight: '130.6%',
              mb: '28px'
            }}
          >
            1Pooja is a trusted online platform that connects families with <span style={{ color: '#CC2E2E', fontStyle: 'italic' }}>verified pandits and purohits</span> for religious ceremonies across India.
          </Typography>
          
          <Typography 
            sx={{ 
              fontFamily: FONTS.PRIMARY, 
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

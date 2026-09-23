'use client';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface ServiceCardProps {
  title: string;
  image: string;
  description?: string;
  price?: string;
  duration?: string;
  category?: string;
  language?: string;
  experience?: string;
  rating?: string;
  availability?: string;
}

export default function ServiceCard({ title, image, description, price, duration, category, language = 'Hindi, English, Sanskrit', experience = '5+ Years', rating = '4.8', availability = 'Online' }: ServiceCardProps) {
  return (
    <Card sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      borderRadius: '16px',
      boxShadow: 'none',
      border: '1px solid rgba(20, 20, 20, 0.15)',
      mb: 3,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
      }
    }}>
      {/* Left Image Area */}
      <Box sx={{ width: { xs: '100%', sm: '200px' }, flexShrink: 0, position: 'relative', bgcolor: '#FFF8F2' }}>
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{ 
            height: '100%', 
            width: '100%', 
            minHeight: { xs: '200px', sm: '100%' },
            objectFit: { xs: 'contain', sm: 'cover' },
          }}
        />
        {availability && availability.toLowerCase() !== 'all' && (
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            left: 16, 
            bgcolor: availability === 'Online' ? '#4CAF50' : '#FF9800', 
            color: 'white',
            px: 1.5,
            py: 0.2,
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: '"DM Sans", sans-serif'
          }}>
            {availability}
          </Box>
        )}
      </Box>

      {/* Right Content Area */}
      <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header: Title and Duration */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 2 }}>
          <Typography component="h3" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '18px', color: '#1A1A1A', wordBreak: 'break-word', flex: 1 }}>
            {title}
          </Typography>
          {duration && (
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 500, color: '#666', whiteSpace: 'nowrap', flexShrink: 0, mt: 0.5 }}>
              {duration}
            </Typography>
          )}
        </Box>
        
        {/* Description */}
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#666', mb: 2, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
          {description || 'No description available for this service.'}
        </Typography>

        {/* Price Box pushed to the bottom */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: price && price.includes('-') ? '15px' : '18px', color: '#FF6200' }}>
            {(() => {
              if (!price || price === '0') return '';
              if (price.includes('-')) {
                const parts = price.split(' - ');
                const p1 = Number(parts[0]);
                const p2 = Number(parts[1]);
                const p1Str = !isNaN(p1) ? p1.toLocaleString('en-IN') : parts[0];
                const p2Str = !isNaN(p2) ? p2.toLocaleString('en-IN') : parts[1];
                return `₹${p1Str} - ₹${p2Str}`;
              }
              const p = Number(price);
              return !isNaN(p) ? `₹${p.toLocaleString('en-IN')}` : `₹${price}`;
            })()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

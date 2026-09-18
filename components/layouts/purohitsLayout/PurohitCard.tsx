'use client';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Button, Card, CardContent, IconButton, Typography, Avatar } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PurohitCardProps {
  id: number | string;
  title: string;
  image: string;
  price?: string;
  duration?: string;
  category?: string;
  language?: string;
  experience?: string;
  rating?: string;
  availability?: string;
  bio?: string;
  specialization?: string;
}

export default function PurohitCard({ id, title, image, price, duration, category, language = 'Hindi, English, Sanskrit', experience = '5+ Years', rating = '4.8', availability = 'Online', bio, specialization }: PurohitCardProps) {
  const router = useRouter();
  
  return (
    <Card sx={{ 
      width: '100%',
      height: '100%',
      minHeight: '440px',
      boxSizing: 'border-box',
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px',
      boxShadow: 'none',
      border: '1px solid rgba(20, 20, 20, 0.15)',
      mb: 3,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
      }
    }}>
      {/* Top Right Rating (Replaced Heart Icon) */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.9)', px: 1, py: 0.5, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <StarIcon sx={{ fontSize: '16px', color: '#FFB400' }} />
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: '#333' }}>
          {rating}
        </Typography>
      </Box>

      {/* Top Image Area */}
      <Box sx={{ width: '100%', p: 3, pb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Avatar
          src={image}
          alt={title}
          sx={{ 
            height: '120px', 
            width: '120px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        />
      </Box>

      {/* Content Area */}
      <CardContent sx={{ flexGrow: 1, p: 3, pt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography component="h3" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '18px', color: '#1A1A1A' }}>
            {title}
          </Typography>
          <VerifiedIcon sx={{ color: '#1976d2', fontSize: '18px' }} />
        </Box>
        
        {/* Category / Qualification */}
        {category && (
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#FF6200', fontSize: '13px', fontWeight: 500, mb: 1 }}>
            {category}
          </Typography>
        )}

        {/* Bio */}
        {bio && (
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '13px', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {bio}
          </Typography>
        )}

        {/* Specialization */}
        {specialization && (
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#444', fontSize: '12px', mb: 2, fontStyle: 'italic' }}>
            Spec: {specialization}
          </Typography>
        )}
        
        {/* Availability Tag */}
        <Box sx={{ 
          bgcolor: availability.includes('Online') ? '#E8F5E9' : '#FFF3E0', 
          color: availability.includes('Online') ? '#2E7D32' : '#E65100',
          px: 1.5,
          py: 0.3,
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: '"DM Sans", sans-serif',
          mb: 2,
          display: 'inline-block'
        }}>
          {availability}
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, color: '#555', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LanguageIcon sx={{ fontSize: '14px' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', textTransform: 'capitalize' }}>{language}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PersonOutlinedIcon sx={{ fontSize: '14px' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px' }}>{experience}</Typography>
          </Box>
        </Box>

        {/* Action Area (Price Removed) */}
        <Box sx={{ width: '100%', mt: 'auto', borderTop: '1px solid #eee', pt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={(e) => {
              e.preventDefault();
              router.push('/sign-in');
            }}
            sx={{
              width: '100%',
              background: '#FF6200',
              color: 'white',
              borderRadius: '31px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              height: '38px',
              fontSize: '14px',
              boxShadow: 'none',
              '&:hover': {
                background: '#E65800',
                boxShadow: 'none',
              }
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

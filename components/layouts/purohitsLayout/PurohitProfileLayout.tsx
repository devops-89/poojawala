'use client';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Avatar, Box, Button, Chip, Container, Divider, Grid, ImageList, ImageListItem, Paper, ToggleButton, ToggleButtonGroup, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getPurohitByIdAPI } from '@/api/userControllers';
import { useEffect } from 'react';

interface PurohitProfileLayoutProps {
  id?: string;
}

export default function PurohitProfileLayout({ id }: PurohitProfileLayoutProps) {
  const router = useRouter();
  const [bookingMode, setBookingMode] = useState('online');
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState('morning');
  const [showAllExpertise, setShowAllExpertise] = useState(false);
  const [purohit, setPurohit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPurohit = async () => {
      try {
        const response = await getPurohitByIdAPI(id);
        const p = response?.data;
        if (p) {
          setPurohit({
            id: p.userId,
            title: `${p.purohitFirstName || ''} ${p.lastName || ''}`.trim() || p.username || 'Purohit',
            image: p.profileImage || '/images/purohits/pandit1.webp',
            education: (p.qualification || 'Purohit') + ' in Vedic Astrology',
            language: Array.isArray(p.languages) ? p.languages.join(', ') : (p.languages || 'Not specified'),
            experience: p.experienceYears ? `${p.experienceYears}+ Years` : '',
            rating: parseFloat(p.averageRating || 0) > 0 ? parseFloat(p.averageRating).toFixed(1) : 'New',
            reviews: '125', 
            price: p.purohitService?.[0]?.isOnlinePrice || '501',
            availability: 'Online & Offline',
            bio: p.bio || `${p.purohitFirstName || 'Purohit'} is a highly respected and experienced Vedic scholar.`,
            expertise: Array.isArray(p.specialization) ? p.specialization : (p.specialization ? [p.specialization] : []),
            services: p.purohitService || [],
          });
        }
      } catch (error) {
        console.error('Error fetching purohit profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurohit();
  }, [id]);

  if (loading || !purohit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, bgcolor: '#fff' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#FFFDF9', minHeight: '100vh', pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          bgcolor: '#FFF5F0',
          position: 'relative',
          overflow: 'hidden',
          pt: 10,
          pb: 8,
          mb: 6,
          borderBottom: '1px solid #FFE0D0'
        }}
      >


        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            {/* Avatar */}
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={purohit.image}
                alt={purohit.title}
                sx={{ 
                  height: { xs: '180px', md: '220px' }, 
                  width: { xs: '180px', md: '220px' }, 
                  boxShadow: '0 8px 30px rgba(255, 98, 0, 0.2)',
                  border: '6px solid white'
                }}
              />
            </Box>

            {/* Profile Info */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'center' }, gap: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography component="h1" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: { xs: '28px', md: '36px' }, color: '#1A1A1A' }}>
                    {purohit.title}
                  </Typography>
                  <VerifiedIcon sx={{ color: '#1976d2', fontSize: '28px' }} />
                </Box>
                <Chip label={purohit.availability} size="small" sx={{ bgcolor: '#4CAF50', color: 'white', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', height: '24px' }} />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 3, color: '#555', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon sx={{ fontSize: '18px', color: '#FF6200' }} />
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px' }}>{purohit.education}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon sx={{ fontSize: '18px', color: '#FF6200' }} />
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px' }}>{purohit.language}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonOutlinedIcon sx={{ fontSize: '18px', color: '#FF6200' }} />
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px' }}>{purohit.experience}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mb: 3 }}>
                {(showAllExpertise ? purohit.expertise : purohit.expertise.slice(0, 4)).map((item: any, idx: number) => (
                  <Chip key={idx} label={item} size="small" sx={{ bgcolor: 'white', border: '1px solid #FFE0D0', color: '#FF6200', fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }} />
                ))}
                {!showAllExpertise && purohit.expertise.length > 4 && (
                  <Chip 
                    label={`+${purohit.expertise.length - 4} more`} 
                    size="small" 
                    onClick={() => setShowAllExpertise(true)}
                    sx={{ bgcolor: 'transparent', color: '#777', fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }} 
                  />
                )}
                {showAllExpertise && purohit.expertise.length > 4 && (
                  <Chip 
                    label="Show less" 
                    size="small" 
                    onClick={() => setShowAllExpertise(false)}
                    sx={{ bgcolor: 'transparent', color: '#777', fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }} 
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ fontSize: '24px', color: '#FFB400' }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', fontWeight: 700, color: '#333', lineHeight: 1.2 }}>
                      {purohit.rating}
                    </Typography>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#777' }}>
                      {purohit.reviews} Reviews
                    </Typography>
                  </Box>
                </Box>
                
                <Divider orientation="vertical" flexItem sx={{ height: '30px', my: 'auto', display: { xs: 'none', md: 'block' } }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleOutlined sx={{ fontSize: '24px', color: '#FF6200' }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', fontWeight: 700, color: '#333', lineHeight: 1.2 }}>
                      1,200+
                    </Typography>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#777' }}>
                      Consultations
                    </Typography>
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ height: '30px', my: 'auto', display: { xs: 'none', md: 'block' } }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon sx={{ color: '#4CAF50', fontSize: '20px' }} />
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '13px', color: '#2e7d32' }}>ID Verified</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkspacePremiumIcon sx={{ color: '#FFB400', fontSize: '20px' }} />
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '13px', color: '#f57f17' }}>Certified Scholar</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column - Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            

            <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', mb: 4, border: '1px solid #f0f0f0' }}>
              <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 0.5 }}>
                About Pandit Ji
              </Typography>
              <Box component="img" src="/images/home/poojaPackages/dhanush.webp" alt="Decoration" sx={{ height: '12px', width: '180px', mb: 2, display: 'block', opacity: 0.8 }} />
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', color: '#555', lineHeight: 1.8 }}>
                {purohit.bio}
              </Typography>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', mb: 4, border: '1px solid #f0f0f0' }}>
              <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 0.5 }}>
                Expertise & Services
              </Typography>
              <Box component="img" src="/images/home/poojaPackages/dhanush.webp" alt="Decoration" sx={{ height: '12px', width: '230px', mb: 2.5, display: 'block', opacity: 0.8 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {purohit.expertise.map((item: any, index: number) => (
                  <Chip 
                    key={index} 
                    label={item} 
                    sx={{ 
                      fontFamily: '"DM Sans", sans-serif', 
                      bgcolor: '#FFF5F0', 
                      color: '#FF6200',
                      fontWeight: 600,
                      px: 1,
                      py: 2,
                      borderRadius: '8px'
                    }} 
                  />
                ))}
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', mb: 4, border: '1px solid #f0f0f0' }}>
              <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 0.5 }}>
                Client Reviews
              </Typography>
              <Box component="img" src="/images/home/poojaPackages/dhanush.webp" alt="Decoration" sx={{ height: '12px', width: '175px', mb: 2.5, display: 'block', opacity: 0.8 }} />
              {/* Dummy Review 1 */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#FF6200' }}>R</Avatar>
                  <Box>
                    <Typography component="div" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: 1 }}>
                      Rakesh Sharma
                      <Chip label="Verified User" size="small" icon={<VerifiedIcon sx={{ fontSize: '14px !important' }}/>} sx={{ height: '20px', fontSize: '10px', bgcolor: '#E8F5E9', color: '#2E7D32' }} />
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ fontSize: '14px', color: '#FFB400' }} />)}
                    </Box>
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#555', ml: 7 }}>
                  "Very knowledgeable and punctual. The puja was conducted very peacefully and properly."
                </Typography>
              </Box>
              <Divider sx={{ mb: 4 }} />
              {/* Dummy Review 2 */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ bgcolor: '#4CAF50' }}>A</Avatar>
                  <Box>
                    <Typography component="div" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: 1 }}>
                      Anjali Gupta
                      <Chip label="Verified User" size="small" icon={<VerifiedIcon sx={{ fontSize: '14px !important' }}/>} sx={{ height: '20px', fontSize: '10px', bgcolor: '#E8F5E9', color: '#2E7D32' }} />
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ fontSize: '14px', color: '#FFB400' }} />)}
                    </Box>
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#555', ml: 7 }}>
                  "Pandit ji explained the meaning of all mantras clearly. Great experience."
                </Typography>
              </Box>
            </Paper>

            {/* Visual Gallery */}
            <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
              <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 0.5 }}>
                Gallery of Past Pujas
              </Typography>
              <Box component="img" src="/images/home/poojaPackages/dhanush.webp" alt="Decoration" sx={{ height: '12px', width: '235px', mb: 2.5, display: 'block', opacity: 0.8 }} />
              <ImageList sx={{ width: '100%', height: 'auto', overflow: 'hidden', m: 0 }} cols={3} gap={12}>
                {['/images/home/poojaPackages/satyanarayan.webp', '/images/home/poojaPackages/ganesh.webp', '/images/home/poojaPackages/havan.webp', '/images/home/poojaPackages/laxmi.webp', '/images/home/poojaPackages/grahpravesh.webp', '/images/home/poojaPackages/satyanarayan.webp'].map((item, index) => (
                  <ImageListItem 
                    key={index} 
                    sx={{ 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      cursor: 'pointer',
                      '&:hover img': { transform: 'scale(1.1)' },
                      '&:hover .overlay': { opacity: 1 }
                    }}
                  >
                    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                      <img
                        srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item}?w=164&h=164&fit=crop&auto=format`}
                        alt={`Gallery image ${index + 1}`}
                        loading="lazy"
                        style={{ objectFit: 'cover', height: '140px', width: '100%', transition: 'transform 0.4s ease' }}
                      />
                      <Box 
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: 'linear-gradient(to top, rgba(255,98,0,0.4) 0%, rgba(255,98,0,0) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                    </Box>
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>

          {/* Right Column - Booking Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Paper 
                sx={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 8px 40px rgba(255, 98, 0, 0.08)',
                  border: '1px solid #FFCBA4',
                  bgcolor: '#FFF0E6'
                }}
              >
                {/* Header with Cardline style */}
                <Box sx={{ 
                  bgcolor: '#FFE0C2', 
                  p: 3, 
                  textAlign: 'center',
                  borderBottom: '1px solid #FFCBA4',
                  position: 'relative'
                }}>
                  <Box 
                    component="img"
                    src="/images/home/cardline.webp"
                    sx={{ width: '100%', mb: 2, height: 'auto' }}
                  />
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#777', fontSize: '14px', mb: 1 }}>
                    Consultation Starting From
                  </Typography>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#D32F2F', fontSize: '32px' }}>
                    ₹{purohit.price}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Removed Mode, Date, and Time selectors as they are now handled in the dedicated Booking Flow */}

                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => router.push('/sign-in')}
                    sx={{
                      background: '#FF6200',
                      color: 'white',
                      borderRadius: '30px',
                      textTransform: 'none',
                      fontWeight: 700,
                      py: 1.5,
                      fontSize: '16px',
                      boxShadow: '0 8px 20px rgba(255, 98, 0, 0.3)',
                      '&:hover': {
                        background: '#E65800',
                        boxShadow: '0 8px 25px rgba(255, 98, 0, 0.4)',
                      }
                    }}
                  >
                    Book Appointment
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{
                      mt: 2,
                      borderColor: '#FF6200',
                      color: '#FF6200',
                      borderRadius: '30px',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.2,
                      fontSize: '15px',
                      '&:hover': {
                        borderColor: '#E65800',
                        bgcolor: 'rgba(255, 98, 0, 0.05)',
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

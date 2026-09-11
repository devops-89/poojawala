'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Link, Typography, CircularProgress } from '@mui/material';
import { getServicesAPI } from '@/api/serviceControllers';

const fallbackPackages = [
  {
    id: 1,
    title: 'Griha Pravesh',
    duration: '2-3 hrs',
    price: '3,999',
    image: '/images/home/poojaPackages/grahpravesh.webp'
  },
  {
    id: 2,
    title: 'Satyanarayan Puja',
    duration: '2-3 hrs',
    price: '3,999',
    image: '/images/home/poojaPackages/satyanarayan.webp'
  },
  {
    id: 3,
    title: 'Ganesh Puja',
    duration: '2-3 hrs',
    price: '3,999',
    image: '/images/home/poojaPackages/ganesh.webp'
  },
  {
    id: 4,
    title: 'Havan/Yagya',
    duration: '2-3 hrs',
    price: '3,999',
    image: '/images/home/poojaPackages/havan.webp'
  },
  {
    id: 5,
    title: 'Laxmi Puja',
    duration: '2-3 hrs',
    price: '3,999',
    image: '/images/home/poojaPackages/laxmi.webp'
  }
];

const formatDuration = (mins: number) => {
  if (!mins) return '2-3 hrs';
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) {
    if (mins % 60 === 0) return `${hrs} hrs`;
    return `${hrs}-${hrs + 1} hrs`;
  }
  return `${mins} mins`;
};

export default function PopularPackages() {
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServicesAPI(1, 5); // Fetch top 5 services
        if (response?.success && response?.data?.data && Array.isArray(response.data.data)) {
          const apiPackages = response.data.data.slice(0, 5).map((item: any) => ({
            id: item.id,
            title: item.name,
            duration: formatDuration(item.durationMinutes),
            price: item.minPrice ? Math.floor(parseFloat(item.minPrice)).toLocaleString('en-IN') : '3,999',
            image: item.iconDownloadurl || item.iconUrl || '/images/home/poojaPackages/satyanarayan.webp'
          }));
          setPackages(apiPackages.length > 0 ? apiPackages : fallbackPackages);
        } else {
          setPackages(fallbackPackages);
        }
      } catch (error) {
        console.error("Failed to fetch popular packages:", error);
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const displayPackages = packages.length > 0 ? packages : fallbackPackages;

  return (
    <Box sx={{ py: 8, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6, position: 'relative' }}>
          <Typography variant="h3" component="h2" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: { xs: '28px', sm: '36px', md: '48px' }, color: '#1A1A1A', mb: 2 }}>
            Popular Pooja Packages
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center',pb:5 }}>
            <Box 
              component="img"
              src="/images/home/poojaPackages/dhanush.webp"
              alt="Decorative Arch"
              sx={{ width: { xs: '90%', sm: '80%', md: '750px' }, height: { xs: 'auto', md: '47px' }, maxWidth: '100%', objectFit: 'contain'}}
            />
          </Box>
          <Box sx={{ position: 'absolute', right: 0, bottom: 0, display: { xs: 'none', md: 'block' } }}>
            <Button 
              endIcon={<ArrowForwardIcon fontSize="small" />}
              onClick={() => router.push('/services')}
              sx={{ 
                color: '#D32F2F', 
                background: 'transparent',
                border: 'none',
                borderRadius: '31px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                transition: 'all 0.3s ease', 
                '&:hover': { 
                  background: '#FF6200',
                  color: '#FFFFFF',
                } 
              }}
            >
              View all
            </Button>
          </Box>
        </Box>

        {/* Mobile View All Link */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', mb: 3 }}>
          <Button 
            endIcon={<ArrowForwardIcon fontSize="small" />}
            onClick={() => router.push('/services')}
            sx={{ 
              color: '#D32F2F', 
              background: 'transparent',
              border: 'none',
              borderRadius: '31px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              transition: 'all 0.3s ease', 
              '&:hover': { 
                background: '#FF6200',
                color: '#FFFFFF',
              } 
            }}
          >
            View all
          </Button>
        </Box>

        {/* Packages Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress sx={{ color: '#FF6200' }} />
          </Box>
        ) : (
        <Grid container spacing={3} sx={{justifyContent:'center'}}>
          {displayPackages.map((pkg) => (
            <Grid size={{xs:12,sm:6,md:4,lg:2.4}} key={pkg.id}>
              <Card sx={{ 
                width: '100%',
                maxWidth: { xs: '280px', sm: '213px' },
                height: '100%',
                margin: '0 auto',
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '41.71px',
                boxShadow: 'none',
                border: '1px solid rgba(20, 20, 20, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }
              }}>
                <Box
                  component="img"
                  src={pkg.image}
                  alt={pkg.title}
                  sx={{ 
                    height: '125px', 
                    width: '100%', 
                    objectFit: 'cover', 
                    pt: 0, 
                    px: 0, 
                    pb: 0 
                  }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 1, pb: '12px !important', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography gutterBottom component="h3" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '1.306', color: '#1A1A1A', mb: 0.2 }}>
                    {pkg.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', mb: 0.5, gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: '13px' }} />
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', lineHeight: '1.306' }}>{pkg.duration}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#D32F2F', mb: 1, fontSize: '16px', lineHeight: '1.306' }}>
                    ₹ {pkg.price} <Typography component="span" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontWeight: 400, fontSize: '11px' }}>onwards</Typography>
                  </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => router.push('/sign-in')}
                      sx={{
                        background: '#FF6200',
                        color: 'white',
                        borderRadius: '31px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2,
                        py: 1,
                        minWidth: '101px',
                        height: '34px',
                        fontSize: '13px',
                        boxShadow: 'none',
                        '&:hover': {
                          background: '#E65800',
                          boxShadow: 'none',
                        }
                      }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}
      </Container>
    </Box>
  );
}

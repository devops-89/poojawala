'use client';

import React, { useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { Avatar, Box, Container, Typography, CircularProgress } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getAllReviewsAPI } from '@/api/userControllers';

const fallbackTestimonials = [
  {
    id: 1,
    text: '"Pandit ji arrived on time and the puja was performed so beautifully. Everything was well organized. Highly recommended!"',
    name: 'Neha Sharma',
    location: 'Mumbai',
    image: '/images/home/usericon.webp',
    rating: 5
  },
  {
    id: 2,
    text: '"Pandit ji arrived on time and the puja was performed so beautifully. Everything was well organized. Highly recommended!"',
    name: 'Neha Sharma',
    location: 'Mumbai',
    image: '/images/home/usericon.webp',
    rating: 5
  },
  {
    id: 3,
    text: '"Pandit ji arrived on time and the puja was performed so beautifully. Everything was well organized. Highly recommended!"',
    name: 'Neha Sharma',
    location: 'Mumbai',
    image: '/images/home/usericon.webp',
    rating: 5
  },
  {
    id: 4,
    text: '"Pandit ji arrived on time and the puja was performed so beautifully. Everything was well organized. Highly recommended!"',
    name: 'Neha Sharma',
    location: 'Mumbai',
    image: '/images/home/usericon.webp',
    rating: 5
  }
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviewsAPI('PUBLISHED');
        if (response?.success && response?.data?.data) {
          const apiReviews = response.data.data.map((item: any) => ({
            id: item.id,
            text: `"${item.customerReview}"`,
            name: `${item.customer?.firstName || ''} ${item.customer?.lastName || ''}`.trim() || 'Anonymous',
            location: item.purohit?.city || 'India',
            image: item.customer?.profileImage || '/images/home/usericon.webp',
            rating: Math.round(parseFloat(item.customerRating || '5'))
          }));
          setReviews(apiReviews.length > 0 ? apiReviews : fallbackTestimonials);
        } else {
          setReviews(fallbackTestimonials);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const displayReviews = reviews.length > 0 
    ? [...reviews, ...reviews, ...reviews, ...reviews] 
    : [...fallbackTestimonials, ...fallbackTestimonials];

  return (
    <Box sx={{ py: 10, bgcolor: '#ffffff', overflow: 'hidden',pt:4}}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: '54px' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: '"DM Sans", sans-serif', 
              fontWeight: 700, 
              fontSize: { xs: '28px', sm: '36px', md: '48px' }, 
              color: '#C82E2E', 
              mb: '15px' 
            }}
          >
            What Families Say About Us
          </Typography>
          <Typography 
            sx={{ 
              fontFamily: '"DM Sans", sans-serif', 
              fontWeight: 500, 
              fontSize: { xs: '16px', md: '24px' },
              lineHeight: '130.6%', 
              color: '#141414' 
            }}
          >
            Every review reflects our commitment to trust, tradition, and a seamless booking experience.
          </Typography>
        </Box>
      </Container>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress sx={{ color: '#CC2E2E' }} />
        </Box>
      ) : (
        <Box 
          sx={{ 
            width: '100%',
            overflow: 'hidden',
            '.swiper-pagination': {
              position: 'relative',
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px'
            },
            '.swiper-pagination-bullet': {
              width: '10px',
              height: '10px',
              bgcolor: '#CC2E2E',
              opacity: 0.4,
              transition: 'all 0.3s ease',
              margin: '0 !important'
            },
            '.swiper-pagination-bullet-active': {
              width: '12px',
              height: '12px',
              opacity: 1,
            }
          }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            loop={true}
            centeredSlides={false}
            slidesPerView="auto"
            spaceBetween={32}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            style={{ width: '100%', maxWidth: '1152px', overflow: 'visible', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px', boxSizing: 'border-box' }}
          >
            {displayReviews.map((review, index) => (
              <SwiperSlide key={`${review.id}-${index}`} style={{ width: '100%', maxWidth: '560px', minWidth: '280px', boxSizing: 'border-box' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 'auto', md: '280px' },
                    minHeight: '240px',
                    bgcolor: '#ffffff',
                    border: '1.26px solid rgba(20, 20, 20, 0.15)',
                    borderRadius: '39.1px',
                    padding: { xs: '28px 20px 24px', md: '43px 33px 35px 33px' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: '18px' }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: i < (review.rating || 5) ? '#FFCD29' : '#e2e8f0', fontSize: '22.83px' }} />
                    ))}
                  </Box>
                  
                  <Typography 
                    sx={{ 
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 400,
                      fontSize: { xs: '16px', md: '20px' },
                      color: '#141414',
                      lineHeight: '130.6%',
                      flexGrow: 1,
                      mt: 2
                    }}
                  >
                    {review.text}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <Avatar 
                      src={review.image} 
                      alt={review.name}
                      sx={{ width: { xs: '50px', md: '69px' }, height: { xs: '50px', md: '69px' } }}
                    />
                    <Box>
                      <Typography 
                        sx={{ 
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '20px',
                          lineHeight: '130.6%',
                          color: '#1A1A1A'
                        }}
                      >
                        {review.name}
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '20px',
                          lineHeight: '130.6%',
                          color: '#888888'
                        }}
                      >
                        {review.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
}

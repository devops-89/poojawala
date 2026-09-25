'use client';

import React, { useEffect, useState } from 'react';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import StarIcon from '@mui/icons-material/Star';
import { Avatar, Box, Container, Typography, CircularProgress } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getAllReviewsAPI } from '@/api/userControllers';
import EmptyStateCard from '@/components/widgets/EmptyStateCard';

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
          setReviews(apiReviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const displayReviews =
    reviews.length > 0
      ? reviews.length < 4
        ? [...reviews, ...reviews, ...reviews, ...reviews]
        : reviews
      : [];

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
      ) : reviews.length === 0 ? (
        <EmptyStateCard
          icon={<RateReviewOutlinedIcon sx={{ fontSize: 32 }} />}
          title="No Customer Reviews Yet"
          description="Every review reflects our commitment to trust & tradition. Be the first to share your sacred experience!"
          actionText="Book a Pooja"
          actionHref="/sign-in"
        />
      ) : (
        <Container maxWidth="xl">
          <Box
            sx={{
              width: '100%',
              '.swiper-pagination': {
                position: 'relative',
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
              },
              '.swiper-pagination-bullet': {
                width: '10px',
                height: '10px',
                bgcolor: '#CC2E2E',
                opacity: 0.4,
                transition: 'all 0.3s ease',
                margin: '0 !important',
              },
              '.swiper-pagination-bullet-active': {
                width: '12px',
                height: '12px',
                opacity: 1,
              },
            }}
          >
            <Swiper
              modules={[Pagination, Autoplay]}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 16,
                },
                600: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                960: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              style={{ width: '100%', padding: '10px 4px 30px 4px' }}
            >
              {displayReviews.map((review, index) => (
                <SwiperSlide key={`${review.id}-${index}`} style={{ height: 'auto' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight: { xs: '200px', md: '250px' },
                      bgcolor: '#ffffff',
                      border: '1.26px solid rgba(20, 20, 20, 0.15)',
                      borderRadius: { xs: '20px', md: '30px' },
                      padding: { xs: '20px 16px', md: '28px 24px' },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', gap: '8px', mb: 1.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} sx={{ color: i < (review.rating || 5) ? '#FFCD29' : '#e2e8f0', fontSize: '20px' }} />
                        ))}
                      </Box>

                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 500,
                          fontSize: { xs: '14px', md: '16px' },
                          color: '#141414',
                          lineHeight: '1.4',
                          mb: 2,
                        }}
                      >
                        {review.text}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mt: 'auto' }}>
                      <Avatar
                        src={review.image}
                        alt={review.name}
                        sx={{ width: { xs: '45px', md: '56px' }, height: { xs: '45px', md: '56px' } }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '15px', md: '17px' },
                            lineHeight: '1.2',
                            color: '#1A1A1A',
                          }}
                        >
                          {review.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 400,
                            fontSize: { xs: '13px', md: '14px' },
                            color: '#888888',
                            mt: 0.3,
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
        </Container>
      )}
    </Box>
  );
}

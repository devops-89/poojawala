'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import StarIcon from '@mui/icons-material/Star';
import TranslateIcon from '@mui/icons-material/Translate';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { Box, Button, Container, Typography } from '@mui/material';

import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import CircularProgress from '@mui/material/CircularProgress';
import { getPublicPurohitsListAPI } from '@/api/userControllers';

const fallbackPurohits = [
  {
    id: 1,
    name: 'Pandit Ankita Sharma',
    languages: 'Hindi, English & Sanskrit',
    experience: '2 Years',
    speciality: 'Vedic & Tantra',
    rating: '4.5',
    reviews: 91,
    image: '/images/home/usericon.webp',
  },
  {
    id: 2,
    name: 'Pandit Ankita Sharma',
    languages: 'Hindi, English & Sanskrit',
    experience: '2 Years',
    speciality: 'Vedic & Tantra',
    rating: '4.5',
    reviews: 91,
    image: '/images/home/usericon.webp',
  },
  {
    id: 3,
    name: 'Pandit Ankita Sharma',
    languages: 'Hindi, English & Sanskrit',
    experience: '2 Years',
    speciality: 'Vedic & Tantra',
    rating: '4.5',
    reviews: 91,
    image: '/images/home/usericon.webp',
  },
  {
    id: 4,
    name: 'Pandit Ankita Sharma',
    languages: 'Hindi, English & Sanskrit',
    experience: '2 Years',
    speciality: 'Vedic & Tantra',
    rating: '4.5',
    reviews: 91,
    image: '/images/home/usericon.webp',
  },
  {
    id: 5,
    name: 'Pandit Ankita Sharma',
    languages: 'Hindi, English & Sanskrit',
    experience: '2 Years',
    speciality: 'Vedic & Tantra',
    rating: '4.5',
    reviews: 91,
    image: '/images/home/usericon.webp',
  },
];

export default function VerifiedPurohits() {
  const router = useRouter();
  const [purohits, setPurohits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurohits = async () => {
      try {
        const response = await getPublicPurohitsListAPI(1, 20, '');
        let fetchedPurohits = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          fetchedPurohits = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          fetchedPurohits = response.data;
        }

        if (fetchedPurohits.length > 0) {
          const formatted = fetchedPurohits.map((p: any) => ({
            id: p.userId || p.id,
            name: `${p.purohitFirstName || ''} ${p.lastName || ''}`.trim() || p.username || 'Purohit',
            image: p.profileImage || '/images/home/usericon.webp',
            languages: Array.isArray(p.languages) ? p.languages.join(', ') : (p.languages || null),
            experience: p.experienceYears ? `${p.experienceYears} Years` : null,
            rating: parseFloat(p.averageRating || 0) > 0 ? parseFloat(p.averageRating).toFixed(1) : 'New',
            speciality: Array.isArray(p.specialization) ? p.specialization.join(', ') : (p.specialization || null),
            reviews: p.reviewsCount || 0
          }));
          setPurohits(formatted);
        } else {
          setPurohits(fallbackPurohits);
        }
      } catch (error) {
        console.error("Error fetching purohits:", error);
        setPurohits(fallbackPurohits);
      } finally {
        setLoading(false);
      }
    };
    fetchPurohits();
  }, []);

  const displayPurohits = purohits.length > 0 ? purohits : fallbackPurohits;
  // Ensure enough items for smooth infinite looping
  const loopedPurohits =
    displayPurohits.length > 0 && displayPurohits.length < 9
      ? [...displayPurohits, ...displayPurohits, ...displayPurohits]
      : displayPurohits;

  return (
    <Box
      sx={{
        py: { xs: '50px', md: '100px' },
        bgcolor: '#fff',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        {/* Heading */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: '40px', md: '60px' },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '26px', sm: '36px', md: '48px' },
              lineHeight: '130.6%',
              color: '#C92B2B',
            }}
          >
            Who Are You Looking For ?
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              fontSize: { xs: '16px', md: '24px' },
              lineHeight: '130.6%',
              color: '#1B1B1B',
            }}
          >
            Meet Our Verified Purohits
          </Typography>
        </Box>

        <Box
          sx={{
            '& .swiper-slide': {
              zIndex: 1,
              opacity: 0,
              visibility: 'hidden',
              transition: 'opacity 0.3s ease, visibility 0.3s ease',
            },
            '& .swiper-slide-active, & .swiper-slide-prev, & .swiper-slide-next': {
              opacity: 1,
              visibility: 'visible',
            },
            '& .swiper-slide-active': {
              zIndex: 2,
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#FF6200' }} />
            </Box>
          ) : (
            <Swiper
              modules={[Autoplay]}
              centeredSlides={true}
              loop={true}
              slidesPerView="auto"
              spaceBetween={16}
              breakpoints={{
                640: {
                  spaceBetween: -30,
                },
                900: {
                  spaceBetween: -50,
                },
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              style={{
                padding: '25px 0 50px',
              }}
            >
              {loopedPurohits.map((item: any, index: number) => (
                <SwiperSlide
                  key={`${item.id}-${index}`}
                  style={{
                    width: '420px',
                    maxWidth: '88vw',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {({ isActive }) => (
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: '480px',
                        minHeight: { xs: 'auto', md: '220px' },
                        borderRadius: { xs: '28px', md: '36px' },
                        background: '#FFF',
                        border: '1.35px solid rgba(20,20,20,.12)',
                        boxShadow: isActive
                          ? '0px 14px 40px rgba(0,0,0,.1)'
                          : '0px 4px 16px rgba(0,0,0,.04)',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        padding: { xs: '24px 20px', sm: '24px 24px', md: '28px 32px' },
                        gap: { xs: '16px', sm: '20px', md: '24px' },
                        transition: 'transform .35s ease, box-shadow .35s ease, opacity .35s ease',
                        transform: isActive
                          ? 'scale(1)'
                          : 'scale(.92)',
                        opacity: isActive ? 1 : 0.75,
                        zIndex: isActive ? 2 : 1,
                        position: 'relative',
                      }}
                    >
                      {/* Left Section (Avatar + Rating) */}
                      <Box
                        sx={{
                          width: { xs: '100%', sm: '130px' },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: '96px', sm: '120px' },
                            height: { xs: '96px', sm: '120px' },
                            borderRadius: '50%',
                            bgcolor: '#F5F5F5',
                            border: '3px solid #FFF',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>

                        {parseFloat(item.rating) > 0 && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              mt: '10px',
                            }}
                          >
                            <StarIcon
                              sx={{
                                color: '#FFB300',
                                fontSize: '18px',
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontWeight: 700,
                                fontSize: '16px',
                                color: '#1A1A1A',
                              }}
                            >
                              {item.rating}
                              <Typography
                                component="span"
                                sx={{
                                  ml: 0.5,
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: '#666',
                                }}
                              >
                                ({item.reviews})
                              </Typography>
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Right Section (Details & Action) */}
                      <Box
                        sx={{
                          flex: 1,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: { xs: 'center', sm: 'flex-start' },
                          textAlign: { xs: 'center', sm: 'left' },
                          justifyContent: 'space-between',
                          height: '100%',
                          minWidth: 0,
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Typography
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontWeight: 700,
                              fontSize: { xs: '18px', sm: '18px', md: '20px' },
                              lineHeight: '1.25',
                              color: '#1A1A1A',
                              mb: '12px',
                              textAlign: { xs: 'center', sm: 'left' },
                              textTransform: 'capitalize',
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: { xs: 'center', sm: 'flex-start' },
                              gap: '8px',
                              width: '100%',
                            }}
                          >
                            {item.languages && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: { xs: 'center', sm: 'flex-start' },
                                  gap: '8px',
                                  width: '100%',
                                }}
                              >
                                <TranslateIcon
                                  sx={{
                                    fontSize: '16px',
                                    color: '#FF6200',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontWeight: 500,
                                    fontSize: { xs: '13px', sm: '13px', md: '14px' },
                                    color: '#4A4A4A',
                                  }}
                                >
                                  {item.languages}
                                </Typography>
                              </Box>
                            )}

                            {item.experience && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: { xs: 'center', sm: 'flex-start' },
                                  gap: '8px',
                                  width: '100%',
                                }}
                              >
                                <PersonOutlinedIcon
                                  sx={{
                                    fontSize: '16px',
                                    color: '#FF6200',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontWeight: 500,
                                    fontSize: { xs: '13px', sm: '13px', md: '14px' },
                                    color: '#4A4A4A',
                                  }}
                                >
                                  {item.experience}
                                </Typography>
                              </Box>
                            )}

                            {item.speciality && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: { xs: 'center', sm: 'flex-start' },
                                  gap: '8px',
                                  width: '100%',
                                }}
                              >
                                <WorkspacePremiumOutlinedIcon
                                  sx={{
                                    fontSize: '16px',
                                    color: '#FF6200',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontWeight: 500,
                                    fontSize: { xs: '13px', sm: '13px', md: '14px' },
                                    color: '#4A4A4A',
                                  }}
                                >
                                  {item.speciality}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'flex-end' },
                            width: '100%',
                            pt: { xs: '16px', sm: '18px' },
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => router.push('/sign-in')}
                            sx={{
                              width: { xs: '120px', md: '135px' },
                              height: { xs: '38px', md: '42px' },
                              borderRadius: '31px',
                              background: '#FF6200',
                              color: '#FFFFFF',
                              textTransform: 'none',
                              fontFamily: '"DM Sans", sans-serif',
                              fontWeight: 600,
                              fontSize: { xs: '14px', md: '15px' },
                              lineHeight: 'normal',
                              letterSpacing: '-0.01em',
                              boxShadow: '0px 4px 14px rgba(255,98,0,.35)',
                              '&:hover': {
                                background: '#E65800',
                                boxShadow: '0px 6px 18px rgba(255,98,0,.45)',
                              },
                            }}
                          >
                            Book Now
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Box>
      </Container>
    </Box>
  );
}

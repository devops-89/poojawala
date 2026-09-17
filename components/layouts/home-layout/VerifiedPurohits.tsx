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
              spaceBetween={-60}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              style={{
                padding: '35px 0 55px',
              }}
            >
              {loopedPurohits.map((item: any, index: number) => (
                <SwiperSlide
                  key={`${item.id}-${index}`}
                  style={{
                    width: '400px',
                    maxWidth: '90vw',
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
                        borderRadius: { xs: '24px', md: '41.71px' },
                        background: '#FFF',
                        border: '1.35px solid rgba(20,20,20,.15)',
                        boxShadow: isActive
                          ? '0px 12px 35px rgba(0,0,0,.08)'
                          : 'none',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        padding: { xs: '20px 16px', sm: '24px 24px', md: '28px 32px' },
                        gap: { xs: '16px', md: '24px' },
                        transition: '.35s',
                        transform: isActive
                          ? 'scale(1)'
                          : 'scale(.9)',
                        opacity: isActive ? 1 : 0.8,
                        zIndex: isActive ? 2 : 1,
                        position: 'relative',
                      }}
                    >
                      {/* Left Section */}
                      <Box
                        sx={{
                          width: { xs: '100px', sm: '165px' },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: '90px', sm: '130px' },
                            height: { xs: '90px', sm: '130px' },
                            borderRadius: '50%',
                            bgcolor: '#D9D9D9',
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
                              borderRadius: '50%',
                            }}
                          />
                        </Box>

                        {parseFloat(item.rating) > 0 && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              mt: '12px',
                            }}
                          >
                            <StarIcon
                              sx={{
                                color: '#FFC107',
                                fontSize: '20px',
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: 'DM Sans',
                                fontWeight: 700,
                                fontSize: '18px',
                                color: '#222',
                              }}
                            >
                              {item.rating}
                              <Typography
                                component="span"
                                sx={{
                                  ml: 0.5,
                                  fontWeight: 400,
                                  fontSize: '18px',
                                  color: '#666',
                                }}
                              >
                                ({item.reviews})
                              </Typography>
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Right Section */}
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%',
                          minWidth: 0,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontWeight: 700,
                              fontSize: { xs: '16px', sm: '18px', md: '20px' },
                              lineHeight: '1.2',
                              color: '#1A1A1A',
                              mb: '12px',
                              textTransform: 'capitalize',
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            {item.languages && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                }}
                              >
                                <TranslateIcon
                                  sx={{
                                    fontSize: '16px',
                                    color: '#707070',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontWeight: 600,
                                    fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                    lineHeight: '1.3',
                                    color: '#444',
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
                                  gap: '10px',
                                }}
                              >
                                <PersonOutlinedIcon
                                  sx={{
                                    fontSize: '16px',
                                    color: '#707070',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontWeight: 600,
                                    fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                    lineHeight: '1.3',
                                    color: '#444',
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
                                  gap: '10px',
                                }}
                              >
                                <WorkspacePremiumOutlinedIcon
                                  sx={{
                                    fontSize: '16px',
                                    color: '#707070',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontWeight: 600,
                                    fontSize: { xs: '12px', sm: '13px', md: '14px' },
                                    lineHeight: '1.3',
                                    color: '#444',
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
                            justifyContent: 'flex-end',
                            pt: '18px',
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => router.push('/sign-in')}
                            sx={{
                              width: { xs: '110px', md: '135px' },
                              height: { xs: '38px', md: '44px' },
                              borderRadius: '41.71px',
                              background: '#FF6200',
                              color: '#FFFFFF',
                              textTransform: 'none',
                              fontFamily: '"DM Sans", sans-serif',
                              fontWeight: 600,
                              fontSize: { xs: '14px', md: '16px' },
                              lineHeight: 'normal',
                              letterSpacing: '-0.01em',
                              boxShadow: '0px 4px 12px rgba(255,98,0,.35)',
                              '&:hover': {
                                background: '#F05A00',
                                boxShadow: '0px 4px 12px rgba(255,98,0,.35)',
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

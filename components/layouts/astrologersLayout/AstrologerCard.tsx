'use client';
import React from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Card, CardContent, Typography, Avatar, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

export interface AstrologerCardProps {
  id: number | string;
  title: string;
  image?: string;
  category?: string;
  specification?: string;
  specializations?: string[];
  specialization?: string;
  language?: string;
  experience?: string;
  rating?: string | number;
  ratePerMinute?: string | number;
  astrologyPrice?: string | number;
  bio?: string;
  city?: string;
  state?: string;
}

export default function AstrologerCard({
  id,
  title,
  image,
  category = '',
  specification = '',
  specializations = [],
  specialization = '',
  language = '',
  experience = '',
  rating = '',
  ratePerMinute,
  astrologyPrice,
  bio = '',
  city = '',
  state = '',
}: AstrologerCardProps) {
  const router = useRouter();

  // Combine specializations
  const specList =
    Array.isArray(specializations) && specializations.length > 0
      ? specializations
      : specialization
      ? specialization.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  const handleCardClick = () => {
    const targetUrl = `/customer/astrologers/${id}`;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('post_login_redirect', targetUrl);
      const token =
        sessionStorage.getItem('token') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('customercsrftoken');
      const user = sessionStorage.getItem('user');
      if (token || user) {
        router.push(targetUrl);
        return;
      }
    }
    router.push(`/sign-in?redirect=${encodeURIComponent(targetUrl)}`);
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCardClick();
  };

  // Price logic: prominent in card body, no static fallback
  const rawPrice =
    astrologyPrice !== undefined && astrologyPrice !== null && astrologyPrice !== ''
      ? astrologyPrice
      : ratePerMinute;
  const numPrice = Number(rawPrice);
  const hasPrice = rawPrice != null && rawPrice !== '' && !isNaN(numPrice) && numPrice > 0;

  // Rating logic: only show if rating > 0, do not show 'New' badge
  const numRating = Number(rating);
  const hasRating = !isNaN(numRating) && numRating > 0 && String(rating).toLowerCase() !== 'new';
  const displayRating = hasRating ? numRating.toFixed(1) : null;

  // Initials for avatar when profileImage is null
  const initials =
    title
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'A';

  const locationText = [city, state].filter(Boolean).join(', ');

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1.5px solid #F1E5D8',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        p: { xs: 2.2, sm: 2.5 },
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 16px 36px rgba(255, 98, 0, 0.14)',
          borderColor: '#FFC8A2',
        },
      }}
    >
      {/* Top Header: Avatar & Rating Badge */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pt: 1,
          pb: 1.5,
        }}
      >
        {/* Rating Badge (Top Right) */}
        {displayRating && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 0.4,
              bgcolor: '#FFFDF0',
              border: '1px solid #FEE588',
              px: 1,
              py: 0.3,
              borderRadius: '14px',
              zIndex: 2,
            }}
          >
            <StarIcon sx={{ fontSize: '13px', color: '#F59E0B' }} />
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#78350F',
              }}
            >
              {displayRating}
            </Typography>
          </Box>
        )}

        {/* Profile Avatar */}
        <Avatar
          src={image || undefined}
          alt={title}
          sx={{
            height: '84px',
            width: '84px',
            border: '3px solid #FFF5EB',
            boxShadow: '0 6px 20px rgba(255, 98, 0, 0.14)',
            background: 'linear-gradient(135deg, #FF6200 0%, #D32F2F 100%)',
            color: '#fff',
            fontSize: '26px',
            fontWeight: 800,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          {initials}
        </Avatar>
      </Box>

      {/* Card Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {/* Name with Verified Badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.6,
            mb: 0.6,
            width: '100%',
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: { xs: '17px', sm: '18px' },
              color: '#1E293B',
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
          <VerifiedIcon sx={{ color: '#0284C7', fontSize: '17px', flexShrink: 0 }} />
        </Box>

        {/* Qualification / Category Badge */}
        {category && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: '#FFF0E6',
              color: '#D94E00',
              border: '1px solid #FFD0B8',
              px: 1.5,
              py: 0.3,
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              mb: 1.2,
            }}
          >
            {category}
          </Box>
        )}

        {/* Bio */}
        {bio ? (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: '#64748B',
              fontSize: '12.5px',
              lineHeight: 1.5,
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              px: 0.5,
            }}
          >
            {bio}
          </Typography>
        ) : (
          <Box sx={{ mb: 1 }} />
        )}

        {/* Specialization Chips (Max 3 on single balanced line) */}
        {specList.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.6,
              justifyContent: 'center',
              mb: 1.8,
              width: '100%',
            }}
          >
            {specList.slice(0, 2).map((spec, i) => (
              <Chip
                key={i}
                label={spec}
                size="small"
                sx={{
                  bgcolor: '#FFF7ED',
                  color: '#C2410C',
                  border: '1px solid #FFEDD5',
                  fontFamily: FONTS.OUTFIT,
                  fontSize: '11px',
                  fontWeight: 600,
                  height: '24px',
                }}
              />
            ))}
            {specList.length > 2 && (
              <Chip
                label={`+${specList.length - 2} more`}
                size="small"
                sx={{
                  bgcolor: '#F8FAFC',
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  fontFamily: FONTS.OUTFIT,
                  fontSize: '11px',
                  fontWeight: 600,
                  height: '24px',
                }}
              />
            )}
          </Box>
        )}

        {/* Contained Info Strip: Experience, Language, Location */}
        {(experience || language || locationText) && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              color: '#475569',
              bgcolor: '#FFFDF9',
              borderRadius: '12px',
              border: '1px solid #F1E5D8',
              py: 0.8,
              px: 1.2,
              width: '100%',
              mt: 'auto',
              mb: 2,
            }}
          >
            {experience && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <WorkspacePremiumIcon sx={{ fontSize: '14px', color: COLORS.PRIMARY }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>
                  {experience}
                </Typography>
              </Box>
            )}
            {language && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <LanguageIcon sx={{ fontSize: '14px', color: COLORS.PRIMARY }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>
                  {language}
                </Typography>
              </Box>
            )}
            {locationText && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <LocationOnIcon sx={{ fontSize: '14px', color: COLORS.PRIMARY }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>
                  {locationText}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Bottom Price & Action Row */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: hasPrice ? 'space-between' : 'center',
            gap: 1.5,
            pt: 1.5,
            borderTop: '1px solid #F1E5D8',
          }}
        >
          {hasPrice && (
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                CONSULTATION FEE
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.3, mt: 0.3 }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#1A0B05',
                    lineHeight: 1,
                  }}
                >
                  ₹{numPrice.toLocaleString('en-IN')}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#64748B',
                  }}
                >
                  /session
                </Typography>
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleBook}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
            sx={{
              flexGrow: hasPrice ? 0 : 1,
              background: 'linear-gradient(135deg, #FF6200 0%, #E64A00 100%)',
              color: '#FFFFFF',
              borderRadius: '24px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.8,
              py: 0.9,
              height: '40px',
              fontSize: '13.5px',
              fontFamily: FONTS.OUTFIT,
              boxShadow: '0 4px 14px rgba(255, 98, 0, 0.28)',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #E65500 0%, #CC3E00 100%)',
                boxShadow: '0 6px 20px rgba(255, 98, 0, 0.4)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Consult Now
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

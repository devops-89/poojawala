'use client';
import React from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
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
        minHeight: '460px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '22px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1.5px solid #F1E5D8',
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        bgcolor: '#ffffff',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 16px 36px rgba(255, 98, 0, 0.14)',
          borderColor: '#FFC8A2',
        },
      }}
    >
      {/* Top Area: Optional Top-Right Rating Badge & Centered Avatar */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          pt: 3,
          pb: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Rating Badge (Only shown if rating > 0) */}
        {displayRating && (
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: '#FFFDF0',
              border: '1px solid #FEE588',
              px: 1.2,
              py: 0.35,
              borderRadius: '16px',
              zIndex: 2,
            }}
          >
            <StarIcon sx={{ fontSize: '14px', color: '#F59E0B' }} />
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: '12px',
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
            height: '110px',
            width: '110px',
            border: '3px solid #FFF5EB',
            boxShadow: '0 8px 24px rgba(255, 98, 0, 0.12)',
            background: 'linear-gradient(135deg, #FF6200 0%, #D32F2F 100%)',
            color: '#fff',
            fontSize: '30px',
            fontWeight: 800,
            fontFamily: FONTS.PRIMARY,
          }}
        >
          {initials}
        </Avatar>
      </Box>

      {/* Content Area */}
      <CardContent
        sx={{
          flexGrow: 1,
          px: 2.5,
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Name with Verified Badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.6,
            mb: 0.4,
            width: '100%',
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: '18px',
              color: '#1e293b',
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
          <VerifiedIcon sx={{ color: '#0284C7', fontSize: '18px' }} />
        </Box>

        {/* Qualification / Category */}
        {category && (
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: COLORS.PRIMARY,
              fontSize: '13px',
              fontWeight: 700,
              mb: 0.3,
            }}
          >
            {category}
          </Typography>
        )}

        {/* Specification */}
        {specification && specification !== category && (
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              mb: 1,
            }}
          >
            {specification}
          </Typography>
        )}

        {/* Bio */}
        {bio && (
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: '#64748b',
              fontSize: '12.5px',
              lineHeight: 1.45,
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
        )}

        {/* Specialization Chips */}
        {specList.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.6,
              justifyContent: 'center',
              mb: 2,
              maxHeight: '56px',
              overflow: 'hidden',
            }}
          >
            {specList.slice(0, 3).map((spec, i) => (
              <Chip
                key={i}
                label={spec}
                size="small"
                sx={{
                  bgcolor: '#FFF7ED',
                  color: '#C2410C',
                  border: '1px solid #FFEDD5',
                  fontFamily: FONTS.PRIMARY,
                  fontSize: '11px',
                  fontWeight: 600,
                  height: '24px',
                }}
              />
            ))}
            {specList.length > 3 && (
              <Chip
                label={`+${specList.length - 3} more`}
                size="small"
                sx={{
                  bgcolor: '#F8FAFC',
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  fontFamily: FONTS.PRIMARY,
                  fontSize: '11px',
                  fontWeight: 600,
                  height: '24px',
                }}
              />
            )}
          </Box>
        )}

        {/* Details Row: Language, Experience, Location */}
        {(experience || language || locationText) && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1.6,
              color: '#64748b',
              mb: 2,
              mt: 'auto',
              pt: 1.2,
              borderTop: '1px dashed #F1E5D8',
              width: '100%',
            }}
          >
            {experience && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WorkspacePremiumIcon sx={{ fontSize: '15px', color: '#FF6200' }} />
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontSize: '11.5px', fontWeight: 600 }}>
                  {experience}
                </Typography>
              </Box>
            )}
            {language && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LanguageIcon sx={{ fontSize: '14px', color: '#FF6200' }} />
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontSize: '11.5px', fontWeight: 600 }}>
                  {language}
                </Typography>
              </Box>
            )}
            {locationText && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: '14px', color: '#FF6200' }} />
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontSize: '11.5px', fontWeight: 600 }}>
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
            pt: 0.5,
            mt: (experience || language || locationText) ? 0 : 'auto',
          }}
        >
          {hasPrice && (
            <Box sx={{ textAlign: 'left', minWidth: '95px' }}>
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#94A3B8',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Fee
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#E65100',
                  lineHeight: 1.2,
                }}
              >
                ₹{numPrice.toLocaleString('en-IN')}
                <Typography
                  component="span"
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#64748B',
                    ml: 0.4,
                  }}
                >
                  /session
                </Typography>
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleBook}
            sx={{
              flexGrow: 1,
              maxWidth: hasPrice ? '170px' : '100%',
              background: 'linear-gradient(135deg, #FF6200 0%, #E65100 100%)',
              color: 'white',
              borderRadius: '24px',
              textTransform: 'none',
              fontWeight: 700,
              py: 1,
              height: '42px',
              fontSize: '14px',
              fontFamily: FONTS.PRIMARY,
              boxShadow: '0 4px 14px rgba(255, 98, 0, 0.28)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #E65100 0%, #CC3E00 100%)',
                boxShadow: '0 6px 20px rgba(255, 98, 0, 0.4)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Consult Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

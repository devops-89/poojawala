'use client';
import { useUserStore } from '@/stores/userStore';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ServiceCardProps {
  id?: number | string;
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

export default function ServiceCard({
  id,
  title,
  image,
  description,
  price,
  duration,
}: ServiceCardProps) {
  const router = useRouter();
  const { profile } = useUserStore();

  const handleBookNow = () => {
    const hasToken =
      typeof window !== "undefined" &&
      (!!localStorage.getItem("accessToken") ||
        !!localStorage.getItem("token"));
    if ((profile || hasToken) && id) {
      router.push(`/customer/services/${id}`);
    } else {
      router.push("/sign-in");
    }
  };

  const formattedPrice = (() => {
    if (!price || price === '0') return 'Price on Request';
    if (price.includes('-')) {
      const parts = price.split('-');
      const p1 = Number(parts[0].trim());
      const p2 = Number(parts[1].trim());
      const p1Str = !isNaN(p1) ? `₹${p1.toLocaleString('en-IN')}` : parts[0].trim();
      const p2Str = !isNaN(p2) ? `₹${p2.toLocaleString('en-IN')}` : parts[1].trim();
      return `${p1Str} - ${p2Str}`;
    }
    const p = Number(price);
    return !isNaN(p) ? `₹${p.toLocaleString('en-IN')}` : `₹${price}`;
  })();

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        border: '1.5px solid #EFE6D5',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 32px rgba(184, 134, 11, 0.12)',
          borderColor: '#D4B076',
        },
      }}
    >
      {/* Top Image Container - Centered and Full Image Display */}
      <Box
        sx={{
          bgcolor: '#FAF4E8',
          p: 2.5,
          borderBottom: '1px solid #EFE6D5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          width: '100%',
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
          }}
        />
        {duration && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid #EFE6D5',
              px: 1.2,
              py: 0.3,
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#5C4A40',
              fontFamily: '"DM Sans", sans-serif',
              backdropFilter: 'blur(4px)',
            }}
          >
            {duration}
          </Box>
        )}
      </Box>

      {/* Card Content Section */}
      <CardContent
        sx={{
          p: { xs: 2.5, sm: 3 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: '#FFFDF9',
        }}
      >
        <Box sx={{ mb: 2 }}>
          {/* Title */}
          <Typography
            component="h3"
            sx={{
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '18px', sm: '20px' },
              color: '#2C1810',
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              fontSize: '13.5px',
              color: '#5C4A40',
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
            }}
          >
            {description || 'Traditional Vedic pooja performed by an experienced Purohit.'}
          </Typography>
        </Box>

        {/* Bottom Section - Price Range & Button aligned at card bottom */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          {/* Price Range */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#B8860B',
                textTransform: 'uppercase',
                mb: 0.5,
              }}
            >
              PRICE RANGE
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '20px', sm: '22px' },
                color: '#C84B16',
              }}
            >
              {formattedPrice}
            </Typography>
          </Box>

          {/* Book Now Button */}
          <Button
            variant="contained"
            onClick={handleBookNow}
            sx={{
              width: '100%',
              bgcolor: '#C84B16',
              color: '#FFFFFF',
              borderRadius: '12px',
              py: 1.3,
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(200, 75, 22, 0.25)',
              transition: 'all 0.25s ease-in-out',
              '&:hover': {
                bgcolor: '#FF6200',
                boxShadow: '0 6px 18px rgba(255, 98, 0, 0.35)',
              },
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

'use client';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Container, InputBase, Paper, Typography } from '@mui/material';

export default function HeroSection() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: '600px', md: '777px' },
        backgroundImage: 'linear-gradient(90deg, #FFFDF9 0%, rgba(255, 253, 249, 0.55) 40%, transparent 60%), url(/images/home/hero/heroSectionHome.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
          <Paper
            component="form"
            sx={{
              p: '2px 16px',
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: '80%', md: '60%' },
              borderRadius: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, py: 1 }}
              placeholder="Search for Puja, Rituals or Purohit..."
              inputProps={{ 'aria-label': 'search for puja' }}
            />
            <SearchIcon sx={{ color: '#D32F2F' }} />
          </Paper>
        </Box>

        {/* Content */}
        <Box sx={{ maxWidth: '600px', mt: 'auto', mb: 'auto' }}>
          <Typography variant="h2" component="h1" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1A1A1A', mb: 1, fontSize: { xs: '2.5rem', md: '48px' }, letterSpacing: '-0.04em' }}>
            Sacred Rituals,
          </Typography>
          <Typography variant="h2" component="h1" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1A1A1A', mb: 1, fontSize: { xs: '2.5rem', md: '48px' }, letterSpacing: '-0.04em' }}>
            Trusted Pandits,
          </Typography>
          <Typography variant="h2" component="h1" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#D32F2F', mb: 3, fontSize: { xs: '2.5rem', md: '48px' }, letterSpacing: '-0.04em' }}>
            One Booking Away
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: '"DM Sans", sans-serif', color: '#555', mb: 4, fontSize: '16px', lineHeight: '1.306', maxWidth: '420px', letterSpacing: '0em' }}>
            Book verified Pandits for Puja, Astrology, and Vastu — at home, at a temple, or online — in under 5 minutes.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            '&:has(.talk-to:hover) .book-now': {
              background: 'transparent',
              color: '#FF6200',
              borderColor: '#FF6200',
              border: '2px solid #FF6200',
              boxShadow: 'none',
            }
          }}>
            <Button
              className="book-now"
              variant="contained"
              href="/purohits#top-purohits"
              sx={{
                background: '#FF6200',
                border: '2px solid #FF6200',
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: '30px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(255, 98, 0, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#F05A00',
                  borderColor: '#F05A00',
                  boxShadow: '0 4px 14px rgba(255, 98, 0, 0.4)',
                }
              }}
            >
              Book Now
            </Button>
            <Button
              className="talk-to"
              variant="outlined"
              sx={{
                borderColor: '#4B5563',
                color: '#1F2937',
                px: 4,
                py: 1.5,
                borderRadius: '30px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                borderWidth: '2px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#FF6200',
                  background: '#FF6200',
                  color: '#FFFFFF',
                  borderWidth: '2px',
                }
              }}
            >
              Talk to an Astrologer
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

'use client';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  Slider,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface PurohitFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export default function PurohitFilters({ onApplyFilters }: PurohitFiltersProps) {
  const [language, setLanguage] = useState('all');
  const [experience, setExperience] = useState('all');
  const [rituals, setRituals] = useState('all');
  const [priceRange, setPriceRange] = useState<number[]>([500, 10000]);
  const [rating, setRating] = useState('All');
  const [availability, setAvailability] = useState('All');

  useEffect(() => {
    onApplyFilters({ language, experience, rituals, priceRange, rating, availability });
  }, [language, experience, rituals, priceRange, rating, availability, onApplyFilters]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '16px', overflow: 'hidden', position: 'sticky', top: 100, height: 'fit-content', pb: 3 }}>
      {/* Header */}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '18px', color: '#1A1A1A' }}>
        Filters
        </Typography>
        <TuneIcon sx={{ color: '#FF6200', fontSize: '20px' }} />
      </Box>

      <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        {/* Language */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <LanguageIcon sx={{ fontSize: '18px', color: '#666' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333' }}>Language</Typography>
          </Box>
          <Select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            size="small" 
            fullWidth 
            sx={{ borderRadius: '8px', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#555', '.MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' } }}
          >
            <MenuItem value="all">All Languages</MenuItem>
            <MenuItem value="hindi">Hindi</MenuItem>
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="sanskrit">Sanskrit</MenuItem>
            <MenuItem value="marathi">Marathi</MenuItem>
            <MenuItem value="telugu">Telugu</MenuItem>
          </Select>
        </Box>

        {/* Experience */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <PersonOutlinedIcon sx={{ fontSize: '18px', color: '#666' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333' }}>Experience</Typography>
          </Box>
          <Select 
            value={experience} 
            onChange={(e) => setExperience(e.target.value)}
            size="small" 
            fullWidth 
            sx={{ borderRadius: '8px', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#555', '.MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' } }}
          >
            <MenuItem value="all">Any Experience</MenuItem>
            <MenuItem value="1">1+ Years</MenuItem>
            <MenuItem value="2">2+ Years</MenuItem>
            <MenuItem value="5">5+ Years</MenuItem>
            <MenuItem value="10">10+ Years</MenuItem>
          </Select>
        </Box>

        {/* Price Range */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <CurrencyRupeeIcon sx={{ fontSize: '18px', color: '#666' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333' }}>Price Range</Typography>
          </Box>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={0}
              max={15000}
              step={500}
              sx={{
                color: '#FF6200',
                '& .MuiSlider-thumb': { bgcolor: '#fff', border: '2px solid #FF6200' },
                '& .MuiSlider-track': { height: 4 },
                '& .MuiSlider-rail': { height: 4, bgcolor: '#E5E7EB' }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
              <Typography sx={{ fontSize: '12px', color: '#888', fontFamily: '"DM Sans", sans-serif' }}>₹{priceRange[0]}</Typography>
              <Typography sx={{ fontSize: '12px', color: '#888', fontFamily: '"DM Sans", sans-serif' }}>₹{priceRange[1]}{priceRange[1] === 15000 ? '+' : ''}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Ratings */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <StarBorderIcon sx={{ fontSize: '18px', color: '#666' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333' }}>Ratings</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['5 ★', '4 ★', '3 ★', '2 ★', '1 ★'].map((r) => (
              <Button 
                key={r}
                onClick={() => setRating(rating === r ? 'All' : r)}
                variant="outlined" 
                sx={{ 
                  borderRadius: '8px', 
                  minWidth: 0, 
                  px: 1.5, 
                  py: 0.5, 
                  fontFamily: '"DM Sans", sans-serif', 
                  fontSize: '13px',
                  borderColor: rating === r ? '#FF6200' : '#E5E7EB',
                  color: rating === r ? '#FF6200' : '#666',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#FF6200',
                    bgcolor: 'transparent'
                  }
                }}
              >
                {r}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Availability */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <DesktopWindowsOutlinedIcon sx={{ fontSize: '18px', color: '#666' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333' }}>Online/Offline Availability</Typography>
          </Box>
          <ButtonGroup fullWidth sx={{ borderRadius: '8px', overflow: 'hidden' }}>
            {['All', 'Online', 'Offline'].map((avail) => (
              <Button 
                key={avail}
                onClick={() => setAvailability(avail)}
                sx={{ 
                  bgcolor: availability === avail ? '#FF6200' : 'transparent', 
                  color: availability === avail ? 'white' : '#666', 
                  borderColor: availability === avail ? '#FF6200 !important' : '#E5E7EB !important', 
                  textTransform: 'none', 
                  fontFamily: '"DM Sans", sans-serif',
                  '&:hover': { 
                    bgcolor: availability === avail ? '#E65800' : 'rgba(0,0,0,0.02)' 
                  }
                }}
              >
                {avail}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {/* Specialized Rituals */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <SpaOutlinedIcon sx={{ fontSize: '18px', color: '#666' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '14px', color: '#333' }}>Specialized Rituals</Typography>
          </Box>
          <Select 
            value={rituals} 
            onChange={(e) => setRituals(e.target.value)}
            size="small" 
            fullWidth 
            sx={{ borderRadius: '8px', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#555', '.MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' } }}
          >
            <MenuItem value="all">All Rituals</MenuItem>
            <MenuItem value="navagraha">Navagraha Shanti</MenuItem>
            <MenuItem value="kalsarp">Kalsarp Dosh</MenuItem>
            <MenuItem value="manglik">Manglik Dosh</MenuItem>
            <MenuItem value="rudrabhishek">Rudrabhishek</MenuItem>
          </Select>
        </Box>

      </Box>
    </Box>
  );
}

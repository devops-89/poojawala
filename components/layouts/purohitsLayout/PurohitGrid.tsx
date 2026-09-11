'use client';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Grid, InputBase, Pagination, Paper, Typography, CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import PurohitCard from './PurohitCard';

import { getPublicPurohitsListAPI } from '@/api/userControllers';

export default function PurohitGrid() {
  const [purohits, setPurohits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPurohits, setTotalPurohits] = useState(0);
  const itemsPerPage = 6;
  const gridTopRef = useRef<HTMLDivElement>(null);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    const fetchPurohits = async () => {
      try {
        setLoading(true);
        const response = await getPublicPurohitsListAPI(page, itemsPerPage, searchQuery);
        
        let fetchedPurohits = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          fetchedPurohits = response.data.data;
          // You might have pagination details in response.data.total etc.
          // Fallback to array length if not present
        } else if (response?.data && Array.isArray(response.data)) {
          fetchedPurohits = response.data;
        }

        const formatted = fetchedPurohits.map((p: any) => {
          // Calculate price and availability from services
          let prices: number[] = [];
          let hasOnline = false;
          let hasOffline = false;

          if (p.purohitService && Array.isArray(p.purohitService)) {
            p.purohitService.forEach((s: any) => {
              if (s.isOnlineAvailable) hasOnline = true;
              if (s.isOfflineAvailable) hasOffline = true;
              
              if (s.isOnlinePrice && !isNaN(parseFloat(s.isOnlinePrice))) {
                prices.push(parseFloat(s.isOnlinePrice));
              }
              if (s.isOfflinePrice && !isNaN(parseFloat(s.isOfflinePrice))) {
                prices.push(parseFloat(s.isOfflinePrice));
              }
            });
          }

          let priceStr = 'Price on Request';
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            if (minPrice === maxPrice) {
              priceStr = `₹${minPrice}`;
            } else {
              priceStr = `₹${minPrice} - ₹${maxPrice}`;
            }
          }

          let availStr = 'Contact for details';
          if (hasOnline && hasOffline) availStr = 'Online & Offline';
          else if (hasOnline) availStr = 'Online';
          else if (hasOffline) availStr = 'Offline';

          const languageStr = Array.isArray(p.languages) 
            ? p.languages.join(', ') 
            : (p.languages || 'Not specified');

          return {
            id: p.userId || p.id,
            title: `${p.purohitFirstName || ''} ${p.lastName || ''}`.trim() || p.username || 'Purohit',
            image: p.profileImage || '/images/purohits/pandit1.webp',
            price: priceStr,
            category: p.qualification || 'Purohit',
            language: languageStr,
            experience: p.experienceYears ? `${p.experienceYears}+ Years` : '',
            rating: parseFloat(p.averageRating || 0) > 0 ? parseFloat(p.averageRating).toFixed(1) : 'New',
            availability: availStr,
            duration: '', // Removed static duration
            bio: p.bio || '',
            specialization: Array.isArray(p.specialization) ? p.specialization.join(', ') : (p.specialization || ''),
          };
        });

        setPurohits(formatted);
        const backendTotal = response?.data?.data?.total || response?.data?.total || response?.data?.data?.totalItems || response?.data?.totalItems;
        setTotalPurohits(backendTotal || (page * itemsPerPage + (formatted.length === itemsPerPage ? 1 : 0)));
      } catch (error) {
        console.error("Error fetching purohits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurohits();
  }, [page, searchQuery]);

  // Reset page to 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    if (gridTopRef.current) {
      const y = gridTopRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const totalPages = Math.ceil(totalPurohits / itemsPerPage) || 1;

  return (
    <Box ref={gridTopRef} id="top-purohits">
      {/* Header Row */}
      {/* Top Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A', mr: 2 }}>
          Top Purohits for You
        </Typography>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#666', mr: 3 }}>
          {totalPurohits} Purohits available
        </Typography>
        
        {/* Search Bar (Hero Style) */}
        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            p: '2px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '750px',
            borderRadius: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #eaeaea',
          }}
        >
          <SearchIcon sx={{ color: '#999', fontSize: '20px' }} />
          <InputBase
            sx={{ ml: 1, flex: 1, py: 0.5, fontFamily: '"DM Sans", sans-serif', fontSize: '14px' }}
            placeholder="Search by name or language..."
            inputProps={{ 'aria-label': 'search for purohits' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Paper>
      </Box>

      {/* List Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      ) : purohits.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666' }}>No purohits found matching your search.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {purohits.map(Purohit => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={Purohit.id}>
              <PurohitCard
                id={Purohit.id}
                title={Purohit.title}
                image={Purohit.image}
                price={Purohit.price.toLocaleString('en-IN')}
                category={Purohit.category}
                language={Purohit.language}
                experience={Purohit.experience}
                rating={Purohit.rating}
                availability={Purohit.availability}
                bio={Purohit.bio}
                specialization={Purohit.specialization}
              />
            </Grid>

        ))}
        </Grid>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page}
            onChange={handlePageChange}
            shape="rounded" 
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: '"DM Sans", sans-serif',
                '&.Mui-selected': {
                  bgcolor: '#FF6200',
                  color: 'white',
                  '&:hover': { bgcolor: '#E65800' }
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}

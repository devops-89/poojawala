'use client';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import AstrologerCard from './AstrologerCard';
import { getPublicAstrologersListAPI } from '@/api/userControllers';
import EmptyStateCard from '@/components/widgets/EmptyStateCard';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

const parseList = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
      .filter(Boolean);
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((s) => String(s).trim()).filter(Boolean);
      }
    } catch {
      return val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [val.trim()];
  }
  return [];
};

export default function AstrologerGrid() {
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [totalAstrologers, setTotalAstrologers] = useState(0);

  const itemsPerPage = 6;
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);
        const response = await getPublicAstrologersListAPI(page, itemsPerPage, debouncedQuery);

        let fetchedList: any[] = [];
        const d = response?.data;
        if (Array.isArray(d?.data)) {
          fetchedList = d.data;
        } else if (Array.isArray(d?.users)) {
          fetchedList = d.users;
        } else if (Array.isArray(d?.astrologers)) {
          fetchedList = d.astrologers;
        } else if (Array.isArray(d)) {
          fetchedList = d;
        } else if (Array.isArray(response?.users)) {
          fetchedList = response.users;
        } else if (Array.isArray(response)) {
          fetchedList = response;
        }

        const formatted = fetchedList.map((item: any) => {
          const profile = item.astrologerProfile || item.profile || {};

          // 1. Name
          const fullName =
            `${item.firstName || ''} ${item.lastName || ''}`.trim() ||
            item.username ||
            'Vedic Astrologer';

          // 2. Specializations
          const specs = parseList(
            profile.specializations || profile.specialization || item.specialization
          );
          const specification = profile.specification || item.specification || '';
          const specStr = specs.length > 0 ? specs.join(', ') : specification;

          // 3. Languages
          const langs = parseList(
            profile.languages || profile.language || item.languages
          );
          const langStr = langs.length > 0 ? langs.join(', ') : 'Hindi, English';

          // 4. Qualifications
          const quals = parseList(profile.qualification || profile.qualifications || item.qualification);
          const category =
            quals.length > 0
              ? quals[0]
              : (specification || 'Vedic Astrologer');

          // 5. Experience
          const expYears =
            profile.experienceYears ?? profile.experience ?? item.experienceYears;
          const experience = expYears ? `${expYears}+ Years` : '5+ Years';

          // 6. Rating
          const rawRating = item.avgRating ?? profile.avgRating ?? item.averageRating;
          const numRating = Number(rawRating || 0);
          const rating = numRating > 0 ? numRating.toFixed(1) : 'New';

          // 7. Rate per minute
          const ratePerMinute = profile.ratePerMinute ?? item.ratePerMinute;

          // 8. City
          const city = profile.city || item.city || '';

          // 9. Bio
          const bio = profile.bio || item.bio || '';

          // 10. Image
          const numId = Number(item.id) || 1;
          const fallbackImg = `/images/purohits/pandit${(numId % 6) + 1}.webp`;
          const image =
            item.profileImage ||
            profile.profileImage ||
            profile.avatar ||
            fallbackImg;

          return {
            id: item.userId || item.id,
            title: fullName,
            image,
            category,
            specification,
            specializations: specs,
            specialization: specStr,
            language: langStr,
            experience,
            rating,
            ratePerMinute,
            bio,
            city,
          };
        });

        setAstrologers(formatted);

        const backendTotal =
          response?.data?.pagination?.total ||
          response?.data?.total ||
          response?.data?.data?.length ||
          response?.pagination?.total;

        setTotalAstrologers(backendTotal || formatted.length);
      } catch (error) {
        console.error('Error fetching astrologers:', error);
        setAstrologers([]);
        setTotalAstrologers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, [page, debouncedQuery]);

  return (
    <Box ref={gridTopRef} sx={{ position: 'relative' }}>
      {/* Header and Search Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              color: '#1e293b',
              fontSize: { xs: '24px', md: '30px' },
              mb: 0.5,
            }}
          >
            Top Astrologers for You
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: '#64748b',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {totalAstrologers} Astrologers available
          </Typography>
        </Box>

        {/* Search Box (Matching Temples & Purohits) */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            setDebouncedQuery(searchQuery);
            setPage(1);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#FFFFFF",
            borderRadius: "14px",
            p: "4px 6px 4px 14px",
            border: "1.5px solid #E2E8F0",
            width: { xs: "100%", sm: "360px", md: "400px" },
            transition: "all 0.25s ease",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            "&:focus-within": {
              borderColor: COLORS.PRIMARY,
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.15)",
            },
          }}
        >
          <SearchIcon sx={{ color: "#94a3b8", fontSize: 20, mr: 1 }} />
          <TextField
            variant="standard"
            placeholder="Search astrologers by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "14px",
                  color: "#1e293b",
                  "&::placeholder": { color: "#94a3b8" },
                },
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchQuery("");
                        setDebouncedQuery("");
                        setPage(1);
                      }}
                      aria-label="clear search"
                      sx={{ p: 0.5, mr: 0.5 }}
                    >
                      <ClearIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "#FFFFFF",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              borderRadius: "10px",
              px: 2,
              py: 0.8,
              minWidth: "auto",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#E05600",
                boxShadow: "none",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Grid Content */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
          }}
        >
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : astrologers.length === 0 ? (
        <EmptyStateCard
          icon={<AutoAwesomeIcon sx={{ fontSize: 32 }} />}
          title="No Astrologers Found"
          description={
            debouncedQuery
              ? `No astrologers matching "${debouncedQuery}". Try another keyword.`
              : 'No verified astrologers are currently available. Please check back soon.'
          }
        />
      ) : (
        <>
          <Grid container spacing={3}>
            {astrologers.map((item) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
                <AstrologerCard {...item} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalAstrologers > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <Pagination
                count={Math.ceil(totalAstrologers / itemsPerPage)}
                page={page}
                onChange={(_, value) => {
                  setPage(value);
                  gridTopRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 600,
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    bgcolor: COLORS.PRIMARY,
                    color: 'white',
                    '&:hover': { bgcolor: COLORS.PRIMARY_DARK },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

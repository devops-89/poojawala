'use client';
import { getServicesAPI } from '@/api/serviceControllers';
import { Box, Grid, MenuItem, Pagination, Select, Typography, CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ServiceCard from './ServiceCard';

interface ServiceGridProps {
  activeCategory: string;
  activeFilters?: any;
  searchQuery?: string;
}

export default function ServiceGrid({ activeCategory, activeFilters, searchQuery }: ServiceGridProps) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular');
  const [location, setLocation] = useState('all');
  const itemsPerPage = 6;
  const gridTopRef = useRef<HTMLDivElement>(null);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Using getServicesAPI from serviceControllers which uses userPublicApi (no roleguard)
        // Passes page, limit, and searchQuery
        const response = await getServicesAPI(1, 100, searchQuery || "");
        
        // Postman showed nested data for some endpoints, trying to handle that safely.
        let fetchedServices = [];
        const rawData = response;
        
        if (Array.isArray(rawData)) {
          fetchedServices = rawData;
        } else if (rawData?.data && Array.isArray(rawData.data)) {
          fetchedServices = rawData.data;
        } else if (rawData?.data?.data && Array.isArray(rawData.data.data)) {
          fetchedServices = rawData.data.data;
        } else if (rawData?.data?.data?.data && Array.isArray(rawData.data.data.data)) {
          fetchedServices = rawData.data.data.data;
        } else if (rawData?.services && Array.isArray(rawData.services)) {
          fetchedServices = rawData.services;
        } else if (rawData?.data?.services && Array.isArray(rawData.data.services)) {
          fetchedServices = rawData.data.services;
        }


        // Map the backend data to match the UI requirements
        const formattedServices = fetchedServices.map((s: any) => ({
          id: s.id || s._id,
          title: s.name || s.title || 'Service',
          category: s.category?.name || s.category || 'All',
          description: s.description || '',
          duration: s.durationMinutes ? `${Math.round(s.durationMinutes/60)} hr` : (s.duration || '1 hr'),
          price: (s.minPrice && s.maxPrice) ? `${s.minPrice} - ${s.maxPrice}` : (s.minPrice?.toString() || s.basePrice?.toString() || s.price?.toString() || '0'),
          image: s.iconDownloadurl  || '/images/home/poojaPackages/satyanarayan.png',
          language: s.language || 'all', // Changed to 'all' so language filter doesn't hide it if filter is on
          experience: s.experience || 'all',
          location: s.location || 'all',
          availability: s.availability || s.serviceMode || 'All',
          rituals: s.rituals || 'all'
        }));
        

        setServices(formattedServices.length > 0 ? formattedServices : []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [searchQuery]);

  // Reset page to 1 when category changes and scroll to top
  useEffect(() => {
    setPage(1);
    
    // Prevent scrolling during the initial page load (including React StrictMode double mounts)
    if (Date.now() - mountTime.current < 1500) {
      return;
    }

    if (gridTopRef.current) {
      // Offset by ~100px so it clears the sticky navbar
      const y = gridTopRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeCategory, activeFilters, location]);

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(service => {
        if (activeCategory === 'Home Puja & Grah Pravesh') {
          return service.category === 'Home Puja' || service.category === 'Grah Pravesh';
        }
        return service.category === activeCategory;
      });

  // Apply Sidebar Filters
  let completelyFiltered = filteredServices;
  if (activeFilters) {
    completelyFiltered = completelyFiltered.filter(service => {
      // 1. Price
      const priceStr = service.price ? service.price.toString().replace(/,/g, '') : '0';
      const price = parseFloat(priceStr);
      if (!isNaN(price) && (price < activeFilters.priceRange[0] || price > activeFilters.priceRange[1])) {
        // TEMPORARY: Don't return false so we can see all data
        // return false; 
      }
      
      // 2. Language
      if (activeFilters.language !== 'all' && service.language !== activeFilters.language) {
        // return false;
      }
      
      // 3. Experience
      if (activeFilters.experience !== 'all' && service.experience !== activeFilters.experience) {
        // return false;
      }

      // 5. Rituals
      if (activeFilters.rituals !== 'all' && service.rituals !== activeFilters.rituals) {
        // return false;
      }

      // 6. Availability
      if (activeFilters.availability !== 'All' && service.availability !== activeFilters.availability) {
        // return false;
      }

      return true;
    });
  }

  if (location !== 'all') {
    // completelyFiltered = completelyFiltered.filter(service => service.location === location);
  }

  // Apply Sorting
  const sortedServices = [...completelyFiltered].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/,/g, ''));
    const priceB = parseInt(b.price.replace(/,/g, ''));
    
    if (sortBy === 'price_low') {
      return priceA - priceB;
    } else if (sortBy === 'price_high') {
      return priceB - priceA;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const paginatedServices = sortedServices.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Also scroll to top on pagination change
    if (gridTopRef.current) {
      const y = gridTopRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  return (
    <Box ref={gridTopRef}>
      {/* Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#1A1A1A' }}>
            Top Services for You
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#666' }}>
            {sortedServices.length} services available
          </Typography>
        </Box>

      </Box>

      {/* List Content */}
      <Grid container spacing={3}>
        {paginatedServices.map(service => (
          <Grid size={{ xs: 12, md: 6 }} key={service.id}>
            <ServiceCard
              key={service.id}
              title={service.title}
              image={service.image}
              description={service.description}
              price={service.price}
              duration={service.duration}
              category={service.category}
              language={service.language}
              experience={service.experience + (service.experience !== 'all' ? '+ Years' : '')}
              rating={service.rating}
              availability={service.availability}
            />
          </Grid>
        ))}
      </Grid>

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

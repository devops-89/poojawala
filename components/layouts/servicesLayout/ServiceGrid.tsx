import { getAllServicesAPI } from '@/api/serviceControllers';
import EmptyStateCard from '@/components/widgets/EmptyStateCard';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { Box, CircularProgress, Grid, Pagination, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ServiceCard from './ServiceCard';

interface ServiceGridProps {
  activeCategory: string;
  selectedCategoryId?: string | number;
  activeFilters?: any;
  searchQuery?: string;
  selectedCity?: string;
}

export default function ServiceGrid({
  activeCategory,
  selectedCategoryId,
  activeFilters,
  searchQuery,
  selectedCity,
}: ServiceGridProps) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 6;
  const gridTopRef = useRef<HTMLDivElement>(null);
  const mountTime = useRef(Date.now());

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCity, selectedCategoryId, activeCategory]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const cityParam =
          selectedCity && selectedCity !== 'All' && selectedCity !== 'All Cities'
            ? selectedCity
            : undefined;

        const response = await getAllServicesAPI(
          page,
          itemsPerPage,
          searchQuery || "",
          true,
          cityParam,
          undefined,
          selectedCategoryId || undefined
        );

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

        const pagination = rawData?.data?.pagination || rawData?.pagination || rawData?.data || {};
        const total = pagination?.total || pagination?.totalCount || rawData?.total || fetchedServices.length;
        const calcTotalPages = pagination?.totalPages || pagination?.pageCount || Math.ceil(total / itemsPerPage) || 1;

        setTotalCount(total);
        setTotalPages(calcTotalPages);

        const activeOnly = fetchedServices.filter((s: any) => s.isActive !== false);

        const formattedServices = activeOnly.map((s: any) => {
          let minP: number | null = s.minPrice != null ? Number(s.minPrice) : null;
          let maxP: number | null = s.maxPrice != null ? Number(s.maxPrice) : null;

          if ((minP == null || isNaN(minP)) && s.plans && typeof s.plans === "object") {
            const prices: number[] = [];
            const planList = Array.isArray(s.plans) ? s.plans : Object.values(s.plans);
            planList.forEach((p: any) => {
              if (p && p.price != null && !isNaN(Number(p.price))) {
                prices.push(Number(p.price));
              }
            });
            if (prices.length > 0) {
              minP = Math.min(...prices);
              maxP = Math.max(...prices);
            }
          }

          let computedPriceStr = '0';
          if (minP != null && !isNaN(minP)) {
            if (maxP != null && !isNaN(maxP) && maxP > minP) {
              computedPriceStr = `${minP} - ${maxP}`;
            } else {
              computedPriceStr = `${minP}`;
            }
          } else if (s.priceWithoutSamagri != null && s.priceWithSamagri != null) {
            computedPriceStr = `${s.priceWithoutSamagri} - ${s.priceWithSamagri}`;
          } else if (s.priceWithoutSamagri != null) {
            computedPriceStr = `${s.priceWithoutSamagri}`;
          } else if (s.basePrice != null || s.price != null) {
            computedPriceStr = `${s.basePrice ?? s.price}`;
          }

          return {
            id: s.id || s._id,
            title: s.name || s.title || 'Service',
            categoryId: s.categoryId || s.category?.id || (typeof s.category === "object" ? s.category?.id : ""),
            category: s.category?.name || (typeof s.category === "string" ? s.category : "") || 'All',
            description: s.description || '',
            duration: s.durationMinutes ? `${Math.round(s.durationMinutes / 60)} hr` : (s.duration || '1 hr'),
            price: computedPriceStr,
            image: s.iconDownloadurl || s.iconUrl || s.imageUrl || '/images/home/poojaPackages/satyanarayan.webp',
            language: s.language || 'all',
            experience: s.experience || 'all',
            location: s.location || 'all',
            availability: s.availability || s.serviceMode || 'All',
            rituals: s.rituals || 'all'
          };
        });

        setServices(formattedServices.length > 0 ? formattedServices : []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, searchQuery, selectedCity, selectedCategoryId]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
            {totalCount || services.length} services available
          </Typography>
        </Box>
      </Box>

      {/* List Content */}
      {services.length === 0 ? (
        <EmptyStateCard
          icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 32 }} />}
          title="No Services Found"
          description="No pooja services are currently available matching your search or selected category/city filter. Try adjusting your filters!"
        />
      ) : (
        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          {services.map(service => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id} sx={{ display: 'flex' }}>
              <ServiceCard
                id={service.id}
                title={service.title}
                image={service.image}
                description={service.description}
                price={service.price}
                duration={service.duration}
                category={service.category}
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

'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import NextLink from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DescriptionIcon from '@mui/icons-material/Description';
import { useParams } from 'next/navigation';
import { getProductByIdAPI } from '@/api/productControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import Image from 'next/image';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M16 30 Q24 18 32 30' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' fill='%2394a3b8'/%3E%3C/svg%3E";

export default function AdminProductDetailsContent() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!params.id) return;
      try {
        setLoading(true);
        const res = await getProductByIdAPI(params.id as string);
        const data = res?.data?.data || res?.data || res;
        if (data) {
          setProduct(data);
        } else {
          showSnackbar('Failed to load product details', 'error');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        showSnackbar('Error fetching product details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [params.id, showSnackbar]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" color="text.secondary">
          Product not found
        </Typography>
        <Button component={NextLink} href="/admin/products" sx={{ mt: 2, color: '#FF6200' }}>
          Back to Products
        </Button>
      </Box>
    );
  }

  const imgUrl = product.imageUrl || product.iconUrl || product.imageDownloadUrl || product.iconDownloadurl || PLACEHOLDER;
  const price = product.price ?? product.minPrice ?? 0;
  const pricingUnit = product.pricingUnit || 'N/A';
  const isActive = product.isActive !== false;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
            <NextLink href="/admin/products" style={{ textDecoration: 'none', color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '14px' }}>
              Products
            </NextLink>
            <Typography sx={{ color: '#FF6200', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '14px' }}>
              Product Details
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Product Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={NextLink}
            href="/admin/products"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
            }}
          >
            Back
          </Button>
          <Button
            component={NextLink}
            href={`/admin/products/edit/${product.id}`}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              bgcolor: '#FF6200',
              color: 'white',
              textTransform: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              py: 1.2,
              px: 3,
              '&:hover': { bgcolor: '#E65800' },
            }}
          >
            Edit Product
          </Button>
        </Box>
      </Box>

      {/* Hero Header Card */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #fff7f2 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <Box sx={{ width: 120, height: 120, position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '4px solid white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)', flexShrink: 0 }}>
            <Image src={imgUrl} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized={true} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`P-${product.id}`}
                sx={{
                  bgcolor: '#FFF0E6',
                  color: '#FF6200',
                  fontWeight: 800,
                  fontFamily: 'var(--font-outfit), sans-serif',
                  borderRadius: '8px',
                }}
              />
              <Chip
                label={isActive ? 'Available' : 'Unavailable'}
                sx={{
                  bgcolor: isActive ? '#d1fae5' : '#fee2e2',
                  color: isActive ? '#065f46' : '#991b1b',
                  fontWeight: 700,
                  fontFamily: 'var(--font-outfit), sans-serif',
                  borderRadius: '8px',
                }}
              />
            </Box>
            <Typography variant="h3" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
              {product.name}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Single Unified Card for Pricing & Description */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
        {/* Pricing Info Rows */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
            <Box sx={{ p: 1.5, bgcolor: '#FFF0E6', borderRadius: '12px', color: '#FF6200', display: 'flex' }}>
              <CurrencyRupeeIcon />
            </Box>
            <Box>
              <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Price</Typography>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.25rem', fontFamily: 'var(--font-outfit), sans-serif' }}>₹{price}</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
            <Box sx={{ p: 1.5, bgcolor: '#FFF0E6', borderRadius: '12px', color: '#FF6200', display: 'flex' }}>
              <ShoppingBagIcon />
            </Box>
            <Box>
              <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Pricing Unit</Typography>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem', fontFamily: 'var(--font-outfit), sans-serif' }}>{pricingUnit}</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
            <Box sx={{ p: 1.5, bgcolor: '#FFF0E6', borderRadius: '12px', color: '#FF6200', display: 'flex' }}>
              <InventoryIcon />
            </Box>
            <Box>
              <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Quantity</Typography>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem', fontFamily: 'var(--font-outfit), sans-serif' }}>{product.quantity ?? 0}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Description Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{ p: 1, bgcolor: '#fff7ed', borderRadius: '8px', color: '#FF6200', display: 'flex' }}>
              <DescriptionIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
              Description
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#475569', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {product.description || 'No description available for this product.'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

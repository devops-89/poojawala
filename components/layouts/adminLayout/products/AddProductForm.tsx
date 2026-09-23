'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { addProductAPI, PRODUCT_PRICING_UNIT } from '@/api/productControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import ProductForm from './ProductForm';

export default function AddProductForm() {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await addProductAPI(formData);
      if (res?.success !== false) {
        showSnackbar('Product created successfully', 'success');
        router.push('/admin/products');
      } else {
        showSnackbar(res?.message || 'Failed to create product', 'error');
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      showSnackbar(
        error?.response?.data?.message || 'Error creating product',
        'error',
      );
    }
  };

  return (
    <ProductForm
      title="Create New Product"
      submitButtonText="Create Product"
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
        description: '',
        price: '',
        pricingUnit: PRODUCT_PRICING_UNIT.PIECE,
        quantity: '',
      }}
    />
  );
}

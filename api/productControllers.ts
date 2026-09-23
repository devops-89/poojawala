import { userSecuredApi, userPublicApi } from "./config";

export enum PRODUCT_PRICING_UNIT {
  PIECE = 'PIECE',   // Sold per individual piece (diya, idol, etc.)
  PACK  = 'PACK',    // Sold per pack/bundle (cotton batti, agarbatti, etc.)
  KG    = 'KG',      // Sold per kilogram (ghee, atta, etc.)
  GRAM  = 'GRAM',    // Sold per gram (saffron, chandan powder, etc.)
  LITER = 'LITER',   // Sold per litre (oil, gangajal, etc.)
  ML    = 'ML',      // Sold per millilitre (essential oils, etc.)
}

export const getAllProductsAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  category?: string,
  isActive?: boolean | string
) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (isActive !== undefined && isActive !== null && isActive !== '') {
      params.append('isActive', String(isActive));
    }

    const response = await userSecuredApi.get("/products/all", { params });
    return response.data;
  } catch (error) {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', String(page));
      if (limit) params.append('limit', String(limit));
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (isActive !== undefined && isActive !== null && isActive !== '') {
        params.append('isActive', String(isActive));
      }

      const response = await userPublicApi.get("/products/all", { params });
      return response.data;
    } catch (err) {
      throw error;
    }
  }
};

export const getProductByIdAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    try {
      const response = await userPublicApi.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      throw error;
    }
  }
};

export const addProductAPI = async (data: any) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await userSecuredApi.post("/products/add", data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProductStatusAPI = async (id: number | string, isActive: boolean) => {
  try {
    const response = await userSecuredApi.patch(`/products/${id}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProductAPI = async (id: number | string, data: any) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await userSecuredApi.patch(`/products/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProductAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

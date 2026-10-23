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
  isActive?: boolean | string,
  categoryId?: string | number
) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    if (search) params.append('search', search);
    const catId = categoryId || category;
    if (catId) params.append('categoryId', String(catId));
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
      const catId = categoryId || category;
      if (catId) params.append('categoryId', String(catId));
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

export const resolveProductId = (id: number | string): number | string => {
  if (!id) return id;
  const isNumeric = /^\d+$/.test(String(id).trim());
  if (isNumeric) return id;

  if (typeof window !== "undefined") {
    try {
      const lower = String(id).trim().toLowerCase();
      const cached =
        localStorage.getItem(`slug_to_id_${lower}`) ||
        sessionStorage.getItem(`slug_to_id_${lower}`) ||
        localStorage.getItem(`product_slug_${lower}`) ||
        sessionStorage.getItem(`product_slug_${lower}`) ||
        localStorage.getItem(`slug_to_id_${id}`) ||
        sessionStorage.getItem(`slug_to_id_${id}`) ||
        localStorage.getItem(`product_slug_${id}`) ||
        sessionStorage.getItem(`product_slug_${id}`) ||
        localStorage.getItem("last_product_id") ||
        sessionStorage.getItem("last_product_id");

      if (cached && /^\d+$/.test(cached)) {
        return cached;
      }
    } catch (e) {}
  }

  return id;
};

export const getProductByIdAPI = async (id: number | string) => {
  try {
    const numericId = resolveProductId(id);

    // STRICT SAFETY: NEVER call /products/:id with non-numeric string to avoid 400 Validation Error
    if (!/^\d+$/.test(String(numericId).trim())) {
      console.warn(`[getProductByIdAPI] Could not resolve numeric ID for slug: ${id}`);
      return {
        success: false,
        message: "Product not found",
        data: null,
      };
    }

    const response = await userSecuredApi.get(`/products/${numericId}`);
    if (typeof window !== "undefined" && response?.data) {
      const data = response.data?.data || response.data?.product || response.data;
      if (data?.id) {
        localStorage.setItem("last_product_id", String(data.id));
        sessionStorage.setItem("last_product_id", String(data.id));
        if (data.slug) {
          const s = String(data.slug).toLowerCase();
          localStorage.setItem(`slug_to_id_${s}`, String(data.id));
          sessionStorage.setItem(`slug_to_id_${s}`, String(data.id));
          localStorage.setItem(`product_slug_${s}`, String(data.id));
          sessionStorage.setItem(`product_slug_${s}`, String(data.id));
        }
      }
    }
    return response.data;
  } catch (error) {
    try {
      const numericId = resolveProductId(id);
      if (!/^\d+$/.test(String(numericId).trim())) {
        return {
          success: false,
          message: "Product not found",
          data: null,
        };
      }
      const response = await userPublicApi.get(`/products/${numericId}`);
      if (typeof window !== "undefined" && response?.data) {
        const data = response.data?.data || response.data?.product || response.data;
        if (data?.id) {
          localStorage.setItem("last_product_id", String(data.id));
          sessionStorage.setItem("last_product_id", String(data.id));
          if (data.slug) {
            const s = String(data.slug).toLowerCase();
            localStorage.setItem(`slug_to_id_${s}`, String(data.id));
            sessionStorage.setItem(`slug_to_id_${s}`, String(data.id));
            localStorage.setItem(`product_slug_${s}`, String(data.id));
            sessionStorage.setItem(`product_slug_${s}`, String(data.id));
          }
        }
      }
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
    const numericId = resolveProductId(id);
    const response = await userSecuredApi.patch(`/products/${numericId}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProductAPI = async (id: number | string, data: any) => {
  try {
    const numericId = resolveProductId(id);
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await userSecuredApi.patch(`/products/${numericId}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProductAPI = async (id: number | string) => {
  try {
    const numericId = resolveProductId(id);
    const response = await userSecuredApi.delete(`/products/${numericId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


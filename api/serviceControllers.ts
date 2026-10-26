import { userPublicApi, userSecuredApi } from "./config";

export const addServiceAPI = async (formData: FormData) => {
  try {
    const response = await userSecuredApi.post("/service", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPurohitServiceAPI = async (services: any[]) => {
  try {
    const response = await userSecuredApi.post("/service/purohit-service", { services });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurohitServicesAPI = async (page: number = 1, limit: number = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    const response = await userSecuredApi.get("/service/purohit-service", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePurohitServiceAPI = async (id: number | string, data: any) => {
  try {
    const response = await userSecuredApi.patch(`/service/purohit-service/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePurohitServiceAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.delete(`/service/purohit-service/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicesAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  commissionPercentage?: string,
  minPrice?: string,
  maxPrice?: string,
  isActive?: boolean,
  isUpcomingFestival?: boolean,
  city?: string,
  templeId?: string | number,
  categoryId?: string | number,
  includeTemple?: boolean,
  isOnline?: boolean,
  isOffline?: boolean
) => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) {
      params.append('search', search);
    }
    if (commissionPercentage) {
      params.append('commissionPercentage', commissionPercentage);
    }
    if (minPrice) {
      params.append('minPrice', minPrice);
    }
    if (maxPrice) {
      params.append('maxPrice', maxPrice);
    }
    if (isActive !== undefined) {
      params.append('isActive', String(isActive));
    }
    if (isUpcomingFestival !== undefined) {
      params.append('isUpcomingFestival', String(isUpcomingFestival));
    }
    if (city && city !== 'All') {
      params.append('city', city);
    }
    if (templeId && templeId !== 'All') {
      params.append('templeId', String(templeId));
    }
    if (categoryId && categoryId !== 'All') {
      params.append('categoryId', String(categoryId));
    }
    if (includeTemple !== undefined) {
      params.append('includeTemple', String(includeTemple));
    }
    if (isOnline !== undefined) {
      params.append('isOnline', String(isOnline));
    }
    if (isOffline !== undefined) {
      params.append('isOffline', String(isOffline));
    }
    const response = await userPublicApi.get(`/service`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resolveServiceId = (id: string | number): string | number => {
  if (!id) return id;
  const isNumeric = /^\d+$/.test(String(id).trim());
  if (isNumeric) return id;

  if (typeof window !== "undefined") {
    try {
      const lower = String(id).trim().toLowerCase();
      const cached =
        localStorage.getItem(`slug_to_id_${lower}`) ||
        sessionStorage.getItem(`slug_to_id_${lower}`) ||
        localStorage.getItem(`service_slug_${lower}`) ||
        sessionStorage.getItem(`service_slug_${lower}`) ||
        localStorage.getItem(`slug_to_id_${id}`) ||
        sessionStorage.getItem(`slug_to_id_${id}`) ||
        localStorage.getItem(`service_slug_${id}`) ||
        sessionStorage.getItem(`service_slug_${id}`);

      if (cached && /^\d+$/.test(cached)) {
        return cached;
      }
    } catch (e) {}
  }

  return id;
};

export const getServiceByIdAPI = async (id: string | number) => {
  try {
    let numericId = resolveServiceId(id);

    // If non-numeric (slug), dynamically find the service by slug from public services API
    if (!/^\d+$/.test(String(numericId).trim())) {
      try {
        const searchKeyword = String(id).replace(/-/g, ' ');
        const searchRes = await userPublicApi.get('/service', { params: { search: searchKeyword } });
        const rawItems =
          searchRes?.data?.data?.data && Array.isArray(searchRes.data.data.data)
            ? searchRes.data.data.data
            : searchRes?.data?.data && Array.isArray(searchRes.data.data)
            ? searchRes.data.data
            : searchRes?.data && Array.isArray(searchRes.data)
            ? searchRes.data
            : [];
        let match = rawItems.find((item: any) => 
          String(item.slug || '').toLowerCase() === String(id).toLowerCase() ||
          item.slug === id ||
          String(item.id) === String(id)
        );

        if (!match) {
          const allRes = await userPublicApi.get('/service', { params: { limit: 100 } });
          const allRaw =
            allRes?.data?.data?.data && Array.isArray(allRes.data.data.data)
              ? allRes.data.data.data
              : allRes?.data?.data && Array.isArray(allRes.data.data)
              ? allRes.data.data
              : allRes?.data && Array.isArray(allRes.data)
              ? allRes.data
              : [];
          match = allRaw.find((item: any) => 
            String(item.slug || '').toLowerCase() === String(id).toLowerCase() ||
            item.slug === id
          );
        }

        if (match?.id) {
          numericId = match.id;
          if (typeof window !== "undefined") {
            const s = String(id).toLowerCase();
            localStorage.setItem(`slug_to_id_${s}`, String(match.id));
            sessionStorage.setItem(`slug_to_id_${s}`, String(match.id));
            if (match.slug) {
              const ms = String(match.slug).toLowerCase();
              localStorage.setItem(`slug_to_id_${ms}`, String(match.id));
              sessionStorage.setItem(`slug_to_id_${ms}`, String(match.id));
            }
          }
        }
      } catch (err) {
        console.warn(`[getServiceByIdAPI] Failed searching service by slug ${id}:`, err);
      }
    }

    // STRICT SAFETY: NEVER call /service/:id with non-numeric string to avoid 400 Validation Error
    if (!/^\d+$/.test(String(numericId).trim())) {
      console.warn(`[getServiceByIdAPI] Could not resolve numeric ID for slug: ${id}`);
      return {
        success: false,
        message: "Service not found",
        data: null,
      };
    }

    const response = await userPublicApi.get(`/service/${numericId}`);
    if (typeof window !== "undefined" && response?.data) {
      const data = response.data?.data?.data || response.data?.data || response.data;
      if (data?.id && data?.slug) {
        const s = String(data.slug).toLowerCase();
        localStorage.setItem(`slug_to_id_${s}`, String(data.id));
        sessionStorage.setItem(`slug_to_id_${s}`, String(data.id));
      }
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editServiceAPI = async (id: string | number, formData: FormData) => {
  try {
    const numericId = resolveServiceId(id);
    const response = await userSecuredApi.patch(`/service/${numericId}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateServiceStatusAPI = async (id: string | number, isActive: boolean) => {
  try {
    const numericId = resolveServiceId(id);
    const response = await userSecuredApi.patch(`/service/${numericId}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteServiceAPI = async (id: string | number) => {
  try {
    const numericId = resolveServiceId(id);
    const response = await userSecuredApi.delete(`/service/${numericId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getPurohitServiceByIdAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.get('/service/purohit-service/' + id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllServicesAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  isActive?: boolean,
  city?: string,
  state?: string,
  categoryId?: string | number,
  templeId?: string | number,
  includeTemple?: boolean,
  isOnline?: boolean,
  isOffline?: boolean
) => {
  try {
    const params: Record<string, any> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search && search.trim()) params.search = search.trim();
    if (isActive !== undefined) params.isActive = isActive;
    if (city && city !== 'All' && city !== 'All Cities') params.city = city;
    if (state && state !== 'All' && state !== 'All States') params.state = state;
    if (categoryId && categoryId !== 'All') params.categoryId = categoryId;
    if (templeId && templeId !== 'All') params.templeId = templeId;
    if (includeTemple !== undefined) params.includeTemple = includeTemple;
    if (isOnline !== undefined) params.isOnline = isOnline;
    if (isOffline !== undefined) params.isOffline = isOffline;

    const response = await userPublicApi.get('/service', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceCategoriesAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  isActive?: boolean,
  categoryType?: string
) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (isActive !== undefined) params.append('isActive', String(isActive));
    if (categoryType) params.append('categoryType', categoryType);

    const response = await userPublicApi.get('/service/categories', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceCategoryByIdAPI = async (id: string | number) => {
  try {
    const response = await userPublicApi.get(`/service/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createServiceCategoryAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post('/service/categories', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateServiceCategoryAPI = async (id: string | number, data: any) => {
  try {
    const response = await userSecuredApi.patch(`/service/categories/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteServiceCategoryAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.delete(`/service/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


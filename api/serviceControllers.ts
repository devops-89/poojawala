import { userPublicApi, userSecuredApi } from "./config";
import { createSlug } from "@/utils/helpers";

const serviceSlugToIdMap = new Map<string, string | number>();

export const registerServiceSlugMapping = (slug: string, id: string | number) => {
  if (!slug || !id) return;
  const lower = String(slug).trim().toLowerCase();
  const sid = String(id).trim();
  serviceSlugToIdMap.set(lower, sid);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`slug_to_id_${lower}`, sid);
      sessionStorage.setItem(`slug_to_id_${lower}`, sid);
      localStorage.setItem(`service_slug_${lower}`, sid);
      sessionStorage.setItem(`service_slug_${lower}`, sid);
    } catch (e) {}
  }
};

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
    if (response?.data) {
      const rawList =
        response.data?.data?.data && Array.isArray(response.data.data.data)
          ? response.data.data.data
          : response.data?.data && Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
      rawList.forEach((item: any) => {
        if (item?.id) {
          if (item?.slug) {
            registerServiceSlugMapping(item.slug, item.id);
          }
          if (item?.name) {
            registerServiceSlugMapping(createSlug(item.name), item.id);
          }
        }
      });
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const extractServicesArray = (resData: any): any[] => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData?.data?.data?.data)) return resData.data.data.data;
  if (Array.isArray(resData?.data?.data)) return resData.data.data;
  if (Array.isArray(resData?.data)) return resData.data;
  if (Array.isArray(resData?.services)) return resData.services;
  if (Array.isArray(resData?.data?.services)) return resData.data.services;
  return [];
};

export const resolveServiceId = (id: string | number): string | number => {
  if (!id) return id;
  const isNumeric = /^\d+$/.test(String(id).trim());
  if (isNumeric) return id;

  const lower = String(id).trim().toLowerCase();
  if (serviceSlugToIdMap.has(lower)) {
    return serviceSlugToIdMap.get(lower)!;
  }

  if (typeof window !== "undefined") {
    try {
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
        serviceSlugToIdMap.set(lower, cached);
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
      const targetSlug = String(id).trim().toLowerCase();
      try {
        let allItems: any[] = [];
        let totalPages = 1;

        // 1. Fetch initial listing (try limit 100 first, fallback to default)
        try {
          const res1 = await userPublicApi.get('/service', { params: { limit: 100, page: 1 } });
          allItems = extractServicesArray(res1?.data);
          const pagination = res1?.data?.data?.pagination || res1?.data?.pagination;
          if (pagination?.totalPages && Number(pagination.totalPages) > 1) {
            totalPages = Number(pagination.totalPages);
          }
        } catch (e1) {
          const fallbackRes = await userPublicApi.get('/service');
          allItems = extractServicesArray(fallbackRes?.data);
          const pagination = fallbackRes?.data?.data?.pagination || fallbackRes?.data?.pagination;
          if (pagination?.totalPages && Number(pagination.totalPages) > 1) {
            totalPages = Number(pagination.totalPages);
          }
        }

        // Cache all items from first page
        allItems.forEach((item: any) => {
          if (item?.id) {
            if (item?.slug) registerServiceSlugMapping(item.slug, item.id);
            if (item?.name) registerServiceSlugMapping(createSlug(item.name), item.id);
          }
        });

        // Check if item is in first batch
        let match = allItems.find((item: any) =>
          String(item.slug || '').trim().toLowerCase() === targetSlug ||
          createSlug(item.name || item.title || '').trim().toLowerCase() === targetSlug ||
          String(item.id) === targetSlug
        );

        // If not found and there are more pages, fetch next pages
        if (!match && totalPages > 1) {
          for (let p = 2; p <= Math.min(totalPages, 15); p++) {
            try {
              const nextRes = await userPublicApi.get('/service', { params: { page: p, limit: 100 } });
              const pageItems = extractServicesArray(nextRes?.data);
              pageItems.forEach((item: any) => {
                if (item?.id) {
                  if (item?.slug) registerServiceSlugMapping(item.slug, item.id);
                  if (item?.name) registerServiceSlugMapping(createSlug(item.name), item.id);
                }
              });
              match = pageItems.find((item: any) =>
                String(item.slug || '').trim().toLowerCase() === targetSlug ||
                createSlug(item.name || item.title || '').trim().toLowerCase() === targetSlug ||
                String(item.id) === targetSlug
              );
              if (match) break;
            } catch (errPage) {
              break;
            }
          }
        }

        if (match?.id) {
          numericId = match.id;
          registerServiceSlugMapping(targetSlug, match.id);
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
    if (response?.data) {
      let data = response.data?.data;
      while (data?.data && !data?.id) {
        data = data.data;
      }
      if (data?.id) {
        if (data.slug) {
          registerServiceSlugMapping(data.slug, data.id);
        }
        if (data.name) {
          registerServiceSlugMapping(createSlug(data.name), data.id);
        }
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
    if (categoryId && categoryId !== 'All' && categoryId !== 'All Categories') params.categoryId = categoryId;
    if (templeId && templeId !== 'All' && templeId !== 'All Temples') params.templeId = templeId;
    if (includeTemple !== undefined) params.includeTemple = includeTemple;
    if (isOnline !== undefined) params.isOnline = isOnline;
    if (isOffline !== undefined) params.isOffline = isOffline;

    const response = await userPublicApi.get('/service', { params });
    if (response?.data) {
      const rawList = extractServicesArray(response.data);
      rawList.forEach((item: any) => {
        if (item?.id) {
          if (item?.slug) {
            registerServiceSlugMapping(item.slug, item.id);
          }
          if (item?.name) {
            registerServiceSlugMapping(createSlug(item.name), item.id);
          }
        }
      });
    }
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


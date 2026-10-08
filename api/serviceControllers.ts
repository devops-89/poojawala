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
  categoryId?: string | number
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
    const response = await userPublicApi.get(`/service`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceByIdAPI = async (id: string | number) => {
  try {
    const response = await userPublicApi.get(`/service/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editServiceAPI = async (id: string | number, formData: FormData) => {
  try {
    const response = await userSecuredApi.patch(`/service/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateServiceStatusAPI = async (id: string | number, isActive: boolean) => {
  try {
    const response = await userSecuredApi.patch(`/service/${id}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteServiceAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.delete(`/service/${id}`);
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
  templeId?: string | number
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


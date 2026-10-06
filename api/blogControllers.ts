import { userPublicApi, userSecuredApi } from "./config";

export const getAllBlogsAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  status?: string
) => {
  try {
    const params: Record<string, any> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search && search.trim()) params.search = search.trim();
    if (status) params.status = status;

    const response = await userPublicApi.get('/blogs/all', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogByIdAPI = async (id: string | number) => {
  try {
    const response = await userPublicApi.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    try {
      const adminRes = await userSecuredApi.get(`/blogs/admin/posts/${id}`);
      return adminRes.data;
    } catch (e) {
      throw error;
    }
  }
};

export const createBlogAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post('/blogs/admin/posts', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editBlogAPI = async (id: string | number, data: any) => {
  const response = await userSecuredApi.patch(`/blogs/admin/posts/${id}`, data);
  return response.data;
};

export const updateBlogStatusAPI = async (id: string | number, status: string) => {
  try {
    const response = await userSecuredApi.patch(`/blogs/admin/posts/${id}`, { status });
    return response.data;
  } catch (error) {
    try {
      const fallbackRes = await userSecuredApi.patch(`/blogs/${id}/status`, { status });
      return fallbackRes.data;
    } catch (e) {
      throw error;
    }
  }
};

export const deleteBlogAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    try {
      const adminRes = await userSecuredApi.delete(`/blogs/admin/posts/${id}`);
      return adminRes.data;
    } catch (e) {
      throw error;
    }
  }
};

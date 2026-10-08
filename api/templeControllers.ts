import { userPublicApi, userSecuredApi } from "./config";

export const getTemplesAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  isActive?: boolean,
  city?: string,
  state?: string
) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    if (search && search.trim()) params.append("search", search.trim());
    if (isActive !== undefined) params.append("isActive", String(isActive));
    if (city && city !== "All" && city !== "All Cities") params.append("city", city);
    if (state && state !== "All" && state !== "All States") params.append("state", state);

    const response = await userPublicApi.get("/temples/all", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTempleByIdAPI = async (id: string | number) => {
  try {
    const response = await userPublicApi.get(`/temples/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTempleAPI = async (formData: FormData) => {
  try {
    const response = await userSecuredApi.post("/temples/add", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTempleAPI = async (id: string | number, formData: FormData | any) => {
  try {
    const response = await userSecuredApi.patch(`/temples/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTempleStatusAPI = async (id: string | number, isActive: boolean) => {
  try {
    const response = await userSecuredApi.patch(`/temples/${id}`, { isActive });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTempleAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.delete(`/temples/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

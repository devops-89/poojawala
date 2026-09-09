import { userSecuredApi } from "./config";

export const getAllComplaintsAPI = async (
  page: number = 1,
  limit: number = 10,
  status?: string
) => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (status && status !== 'All') {
      params.append('status', status);
    }
    const response = await userSecuredApi.get("/complaints/all", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateComplaintStatusAPI = async (id: string | number, status: string, remark?: string) => {
  try {
    const payload: any = { status };
    if (remark) {
      payload.resolutionNotes = remark;
    }
    const response = await userSecuredApi.patch(`/complaints/${id}/status`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getComplaintByIdAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.get(`/complaints/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteComplaintAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.delete(`/complaints/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

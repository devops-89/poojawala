import { userSecuredApi } from "./config";

export const getContactMessagesAPI = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await userSecuredApi.get(`/contact-us/all?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContactMessageByIdAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.get(`/contact-us/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContactMessageStatusAPI = async (
  id: string | number,
  status: string,
  message?: string
) => {
  try {
    const payload: any = { status };
    if (message) {
      payload.message = message;
      payload.replyMessage = message;
    }
    const response = await userSecuredApi.patch(`/contact-us/${id}/status`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContactMessageAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.delete(`/contact-us/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

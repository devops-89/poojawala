import { userPublicApi, userSecuredApi } from "./config";

export const getAllUsersAPI = async (
  role: string,
  page: number = 1,
  limit: number = 100,
  status?: string,
  verificationStatus?: string
) => {
  try {
    const params = new URLSearchParams({
      role: role,
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);
    if (verificationStatus) params.append('verificationStatus', verificationStatus);

    const response = await userSecuredApi.get(`/users/get?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitContactFormAPI = async (data: any) => {
  try {
    const response = await userPublicApi.post("/contact-us/add", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPurohitByAdminAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post("/users/admin/add-purohit", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCustomerByAdminAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post("/users/admin/create-customer", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurohitsAPI = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  verificationStatus?: string,
  status?: string
) => {
  try {
    const params = new URLSearchParams({
      role: 'PUROHIT',
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);
    if (verificationStatus) params.append('verificationStatus', verificationStatus);
    if (status) params.append('status', status);

    const response = await userSecuredApi.get(`/users/get?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurohitByIdAPI = async (id: string | number) => {
  try {
    const response = await userSecuredApi.get(`/users/get/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPublicPurohitsListAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) {
      params.append('search', search);
    }
    const response = await userPublicApi.get(`/users/purohits`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomersListAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  status?: string
) => {
  try {
    const params = new URLSearchParams();
    params.append('role', 'CUSTOMER');
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) {
      params.append('search', search);
    }
    if (status) {
      params.append('status', status);
    }
    const response = await userPublicApi.get(`/users/get`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailablePurohitsForBookingAPI = async (city: string, bookingMode: string, search?: string) => {
  try {
    const params = new URLSearchParams();
    params.append('role', 'PUROHIT');
    params.append('verificationStatus', 'APPROVED');
    params.append('page', '1');
    params.append('limit', '100');
    
    if (search) params.append('search', search);

    if (bookingMode === 'ONLINE') {
      params.append('isOnlineAvailable', 'true');
    } else if (bookingMode === 'OFFLINE') {
      params.append('isOfflineAvailable', 'true');
      if (city) params.append('city', city);
    }

    const response = await userPublicApi.get(`/users/get`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatusAPI = async (
  id: string | number,
  status: string
) => {
  try {
    const response = await userSecuredApi.patch(`/users/admin/status/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePurohitVerificationAPI = async (
  id: string | number,
  status: 'APPROVED' | 'REJECTED' | 'PENDING',
  rejectionReason?: string
) => {
  try {
    const payload: any = { status: status };
    if (status === 'REJECTED' && rejectionReason) {
      payload.rejectionReason = rejectionReason;
    }
    const response = await userSecuredApi.patch(`/users/purohits/${id}/verification`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendOtpAPI = async (payload: { phone?: string, email?: string, role: string, countryCode?: string }) => {
  try {
    const response = await userPublicApi.post("/users/generate-otp", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtpAPI = async (payload: { phone?: string, email?: string, otp: string, role: string, countryCode?: string }) => {
  try {
    const response = await userPublicApi.post("/users/verify-otp", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerPurohitAPI = async (formData: FormData) => {
  try {
    const response = await userPublicApi.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfileAPI = async (formData: FormData) => {
  try {
    const response = await userSecuredApi.patch("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addServiceAreaAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post("/users/purohit/service-area", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateServiceAreaAPI = async (id: number | string, data: any) => {
  try {
    const response = await userSecuredApi.patch(`/users/purohit/service-area/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteServiceAreaAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.delete(`/users/purohit/service-area/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBankAccountAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post("/users/purohit/bank-account", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBankAccountAPI = async (id: number | string, data: any) => {
  try {
    const response = await userSecuredApi.patch(`/users/purohit/bank-account/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBankAccountAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.delete(`/users/purohit/bank-account/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerAddressesAPI = async () => {
  try {
    const response = await userSecuredApi.get('/users/addresses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCustomerAddressAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post('/users/addresses', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomerAddressAPI = async (id: number | string, data: any) => {
  try {
    const response = await userSecuredApi.patch(`/users/addresses/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCustomerAddressAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.delete(`/users/addresses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getCustomerDashboardStatsAPI = async () => {
  try {
    const response = await userSecuredApi.get('/users/customer/dashboard-stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllReviewsAPI = async (status?: string) => {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'All') {
      params.append('status', status.toUpperCase());
    }
    const response = await userSecuredApi.get(`/review?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReviewByBookingIdAPI = async (bookingId: string | number) => {
  try {
    const response = await userSecuredApi.get(`/review/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReviewStatusAPI = async (bookingId: string | number, status: string) => {
  try {
    const response = await userSecuredApi.patch(`/review/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReviewAPI = async (bookingId: string | number) => {
  try {
    const response = await userSecuredApi.delete(`/review/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAdminDashboardStatsAPI = async () => {
  try {
    const response = await userSecuredApi.get('/users/admin/dashboard-stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

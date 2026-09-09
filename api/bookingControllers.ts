import { paymentSecuredApi, userSecuredApi } from "./config";

export const createBookingByAdminAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post('/bookings/admin/add', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const customerCreateBookingAPI = async (data: any) => {
  try {
    const response = await userSecuredApi.post('/bookings/add', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerBookingsAPI = async (status?: string, page: number = 1, limit: number = 10) => {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'All Bookings') {
      params.append('status', status.toUpperCase());
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    const response = await userSecuredApi.get(`/bookings/all?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingDetailsAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBookingsByAdminAPI = async (
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
    if (status && status !== 'All Bookings') params.append('status', status.toUpperCase());
    if (search) params.append('search', search);

    const response = await userSecuredApi.get(`/bookings/all?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompletedBookingsAPI = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await userSecuredApi.get(`/bookings/all?page=${page}&limit=${limit}&status=COMPLETED`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBookingStatusAPI = async (id: number | string, status: string) => {
  try {
    const response = await userSecuredApi.patch(`/bookings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignBookingAPI = async (id: number | string, purohitId: number | string) => {
  try {
    const response = await userSecuredApi.patch(`/bookings/${id}/assign`, { purohitId: Number(purohitId) });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableBookingsAPI = async () => {
  try {
    const response = await userSecuredApi.get('/bookings/available');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const respondBookingAPI = async (id: number | string, action: 'ACCEPT' | 'DISMISS') => {
  try {
    const response = await userSecuredApi.patch(`/bookings/${id}/respond`, { action });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveBookingAPI = async (status?: string, page: number = 1, limit: number = 10) => {
  try {
    let url = status ? `/bookings/all?status=${status.toUpperCase()}&page=${page}&limit=${limit}` : `/bookings/active?page=${page}&limit=${limit}`;
    const response = await userSecuredApi.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const sendBookingStartOtpAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.post(`/bookings/${id}/start-otp`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendBookingStartOtpAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.post(`/bookings/${id}/resend-start-otp`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyBookingOtpAPI = async (id: number | string, otp: string) => {
  try {
    const response = await userSecuredApi.post(`/bookings/${id}/verify-start-otp`, { otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadCompletionProofAPI = async (id: number | string, data: FormData) => {
  try {
    const response = await userSecuredApi.post(`/bookings/${id}/completion-proof`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addReviewAPI = async (bookingId: number | string, rating: number, reviewText: string) => {
  try {
    const response = await userSecuredApi.post(`/review/${bookingId}`, {
      rating,
      review: reviewText,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelBookingAPI = async (id: number | string, reason?: string) => {
  try {
    const response = await userSecuredApi.patch(`/bookings/${id}/cancel`, { cancellationReason: reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rescheduleBookingAPI = async (id: number | string, scheduledAt: string, customerAddressId: number | string, reason: string) => {
  try {
    const response = await userSecuredApi.patch(`/bookings/${id}/reschedule`, {
      scheduledAt,
      customerAddressId: Number(customerAddressId),
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentsAPI = async (page: number = 1, limit: number = 10, status?: string) => {
  try {
    let url = `/payments/my?page=${page}&limit=${limit}`;
    if (status && status !== 'ALL') {
      url += `&purohitPayoutStatus=${status.toUpperCase()}`;
    }
    const response = await paymentSecuredApi.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPayoutStatsAPI = async () => {
  try {
    const response = await userSecuredApi.get('/users/purohit/dashboard-stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getComplaintsAPI = async (page: number = 1, limit: number = 10, status?: string) => {
  try {
    let url = `/complaints/all?page=${page}&limit=${limit}`;
    if (status && status !== 'ALL') {
      url += `&status=${status.toUpperCase()}`;
    }
    const response = await userSecuredApi.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getComplaintsAgainstMeAPI = async () => {
  try {
    const url = `/complaints/against-me`;
    const response = await userSecuredApi.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getComplaintByIdAPI = async (id: number | string) => {
  try {
    const response = await userSecuredApi.get(`/complaints/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addComplaintAPI = async (formData: FormData) => {
  try {
    const response = await userSecuredApi.post('/complaints/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const initiateManualPayoutAPI = async (payload: { bookingId: number | string }) => {
  try {
    const response = await paymentSecuredApi.post('/payments/admin/payout/manual', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

import { paymentSecuredApi } from "./config";

export const getMyPaymentsAPI = async (page: number = 1, limit: number = 10) => {
  try {
    const res = await paymentSecuredApi.get(`/payments/my?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const getAdminPayoutsAPI = async (page: number = 1, limit: number = 10) => {
  try {
    const route = '/payments/admin/payouts';
    const res = await paymentSecuredApi.get(`${route}?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const getAdminFinanceStatsAPI = async () => {
  try {
    const route = '/payments/admin/payouts/finance-stats';
    const res = await paymentSecuredApi.get(route);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const getPaymentLinkAPI = async (bookingId: string | number, callbackUrl: string) => {
  try {
    const route = `/payments/booking/payment-link?bookingId=${bookingId}&callbackUrl=${callbackUrl}`;
    const res = await paymentSecuredApi.get(route);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const settleBookingPaymentAPI = async (bookingId: string | number) => {
  try {
    let res;
    try {
      res = await paymentSecuredApi.post(`/bookings/${bookingId}/settle`);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        try {
          res = await paymentSecuredApi.post(`/payments/bookings/${bookingId}/settle`);
        } catch (err2: any) {
          if (err2?.response?.status === 404 || err2?.response?.status === 405) {
            res = await paymentSecuredApi.get(`/bookings/${bookingId}/settle`);
          } else {
            throw err2;
          }
        }
      } else {
        throw err;
      }
    }
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error.message || error;
  }
};

export const downloadInvoiceAPI = async (bookingId: string | number) => {
  try {
    const cleanId = String(bookingId).replace(/[^0-9]/g, '');
    const idToUse = cleanId || bookingId;
    let res;
    try {
      res = await paymentSecuredApi.get(`/payments/booking/${idToUse}/invoice`, { responseType: 'blob' });
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.status === 404) {
        try {
          res = await paymentSecuredApi.get(`/payments/${idToUse}/invoice`, { responseType: 'blob' });
        } catch (err2: any) {
          res = await paymentSecuredApi.get(`/payments/order/${idToUse}/invoice`, { responseType: 'blob' });
        }
      } else {
        throw err;
      }
    }
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const downloadOrderInvoiceAPI = async (orderId: string | number) => {
  try {
    const cleanId = String(orderId).replace(/[^0-9]/g, '');
    const idToUse = cleanId || orderId;
    let res = await paymentSecuredApi.get(`/payments/order/${idToUse}/invoice`, { responseType: 'blob' });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const payOrderPaymentAPI = async (orderId: string | number) => {
  try {
    const route = `/payments/order/${orderId}/pay`;
    try {
      const res = await paymentSecuredApi.post(route);
      return res.data;
    } catch (err: any) {
      if (err?.response?.status === 405) {
        const res = await paymentSecuredApi.get(route);
        return res.data;
      }
      throw err;
    }
  } catch (error: any) {
    throw error?.response?.data || error.message || error;
  }
};


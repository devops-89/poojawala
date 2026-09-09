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

export const downloadInvoiceAPI = async (bookingId: string | number) => {
  try {
    const route = `/payments/booking/${bookingId}/invoice`;
    const res = await paymentSecuredApi.get(route, { responseType: 'blob' });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

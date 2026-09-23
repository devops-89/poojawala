import { userSecuredApi } from "./config";

export const getCustomerOrdersAPI = async (
  page: number = 1,
  limit: number = 6,
  orderStatus?: string
) => {
  try {
    const csrfToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("csrfToken")
        : null;
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      headers["csrftoken"] = csrfToken;
    }

    const params: Record<string, any> = {
      page,
      limit,
    };
    if (orderStatus && orderStatus !== "ALL") {
      params.orderStatus = orderStatus;
    }

    const response = await userSecuredApi.get("/orders/all", {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerOrderByIdAPI = async (id: string | number) => {
  try {
    const csrfToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("csrfToken")
        : null;
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      headers["csrftoken"] = csrfToken;
    }

    const response = await userSecuredApi.get(`/orders/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

import { userSecuredApi } from "./config";
import { ORDER_STATUS } from "@/utils/enums";

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
      let statusToPass = orderStatus;
      if (statusToPass.toUpperCase() === "PENDING") {
        statusToPass = "PENDING_PAYMENT";
      }
      params.orderStatus = statusToPass;
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

export const getAllOrdersAPI = async (
  page: number = 1,
  limit: number = 10,
  orderStatus?: string,
  search?: string
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
    if (orderStatus && orderStatus !== "ALL" && orderStatus !== "All Orders") {
      let validStatus = orderStatus.toUpperCase();
      if (validStatus === "PENDING") validStatus = "PENDING_PAYMENT";
      params.orderStatus = validStatus;
    }
    if (search) {
      params.search = search;
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

export const updateOrderStatusAPI = async (
  id: string | number,
  orderStatus: string
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

    let validStatus = orderStatus.toUpperCase();
    if (validStatus === "PENDING") validStatus = ORDER_STATUS.PENDING_PAYMENT;

    const response = await userSecuredApi.patch(
      `/orders/${id}/status`,
      { status: validStatus },
      { headers }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

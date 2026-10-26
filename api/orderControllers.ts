import { attachCsrfHeaders, userSecuredApi } from "./config";
import { ORDER_STATUS } from "@/utils/enums";

export const getCustomerOrdersAPI = async (
  page: number = 1,
  limit: number = 6,
  orderStatus?: string
) => {
  try {
    const headers: Record<string, string> = {};
    attachCsrfHeaders(headers, undefined, "CUSTOMER");

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
    const headers: Record<string, string> = {};
    attachCsrfHeaders(headers, undefined, "ADMIN");

    const params: Record<string, any> = {
      page,
      limit,
    };
    if (orderStatus && orderStatus !== "ALL" && orderStatus !== "All Orders") {
      let validStatus = orderStatus.toUpperCase();
      if (validStatus === "PENDING") validStatus = "PENDING_PAYMENT";
      params.orderStatus = validStatus;
    }
    if (search && search.trim()) {
      const trimmed = search.trim();
      params.search = trimmed;
      const cleanNumericId = trimmed.replace(/^ORD-?/i, "").trim();
      if (/^\d+$/.test(cleanNumericId)) {
        params.search = cleanNumericId;
        params.orderId = cleanNumericId;
        params.id = cleanNumericId;
      }
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
    const headers: Record<string, string> = {};
    attachCsrfHeaders(headers, undefined, "CUSTOMER");

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
    const headers: Record<string, string> = {};
    attachCsrfHeaders(headers, undefined, "ADMIN");

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

import { userSecuredApi } from "./config";

export interface AddToCartPayload {
  productId: number | string;
  quantity: number;
}

export const addToCartAPI = async (productId: number | string, quantity: number = 1) => {
  try {
    const parsedProductId = typeof productId === "string" && !isNaN(Number(productId)) ? Number(productId) : productId;
    const csrfToken = typeof window !== "undefined" ? sessionStorage.getItem("csrfToken") : null;
    
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      headers["csrftoken"] = csrfToken;
    }

    const response = await userSecuredApi.post(
      "/cart/items",
      {
        productId: parsedProductId,
        quantity,
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCartAPI = async () => {
  try {
    const csrfToken = typeof window !== "undefined" ? sessionStorage.getItem("csrfToken") : null;
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      headers["csrftoken"] = csrfToken;
    }

    const response = await userSecuredApi.get("/cart", { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCartItemQuantityAPI = async (itemId: number | string, quantity: number) => {
  try {
    const csrfToken = typeof window !== "undefined" ? sessionStorage.getItem("csrfToken") : null;
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      headers["csrftoken"] = csrfToken;
    }

    const parsedItemId = typeof itemId === "string" && !isNaN(Number(itemId)) ? Number(itemId) : itemId;
    const response = await userSecuredApi.patch(
      `/cart/items/${parsedItemId}`,
      { quantity },
      { headers }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCartItemAPI = async (itemId: number | string) => {
  try {
    const csrfToken = typeof window !== "undefined" ? sessionStorage.getItem("csrfToken") : null;
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      headers["csrftoken"] = csrfToken;
    }

    const parsedItemId = typeof itemId === "string" && !isNaN(Number(itemId)) ? Number(itemId) : itemId;
    const response = await userSecuredApi.delete(`/cart/items/${parsedItemId}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearCartAPI = async () => {
  try {
    const csrfToken = typeof window !== "undefined" ? sessionStorage.getItem("csrfToken") : null;
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      headers["csrftoken"] = csrfToken;
    }

    const response = await userSecuredApi.delete("/cart/clear-all", { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkoutCartAPI = async (addressId: string | number) => {
  try {
    const csrfToken = typeof window !== "undefined" ? sessionStorage.getItem("csrfToken") : null;
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      headers["csrftoken"] = csrfToken;
    }

    const payload = {
      paymentMethod: "ONLINE",
      addressId: String(addressId),
    };

    const response = await userSecuredApi.post("/cart/checkout", payload, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

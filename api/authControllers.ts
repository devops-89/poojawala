import { authPublicApi, authSecuredApi } from "./config";

export const loginAPI = async (data: any) => {
  try {
    const res = await authPublicApi.post("auth/login", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordAPI = async (data: { email: string }) => {
  try {
    const res = await authPublicApi.post("auth/forgot-password", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const resetPasswordAPI = async (data: { email: string; otp: string; password: string }) => {
  try {
    const res = await authPublicApi.patch("auth/reset-password", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtpAPI = async (data: { email?: string; phone?: string; otpType: string; countryCode?: string }) => {
  try {
    const res = await authPublicApi.post("auth/resend-otp", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const logoutAPI = async () => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const res = await authSecuredApi.post("auth/logout", {}, {
      headers: {
        'x-csrf-token': csrfToken
      }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const refreshTokenAPI = async () => {
  try {
    const csrfToken = sessionStorage.getItem("csrfToken");
    const res = await authSecuredApi.post("auth/refresh-token", {}, {
      headers: {
        'x-csrf-token': csrfToken
      }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getMeAPI = async (accessToken?: string) => {
  try {
    const config: any = {};
    if (accessToken) {
      config.headers = { Authorization: `Bearer ${accessToken}` };
    }
    const res = await authSecuredApi.get("auth/me", config);
    return res.data;
  } catch (error) {
    throw error;
  }
};

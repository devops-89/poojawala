import { authPublicApi, authSecuredApi, attachCsrfHeaders, getCsrfToken, getActiveRole } from "./config";

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
    const role = getActiveRole();
    const csrfToken = getCsrfToken(role);
    const headers: any = {};
    if (role) {
      headers["X-Role"] = role;
      headers["role"] = role;
      headers["x-role"] = role;
      headers["Poojawala-Role"] = role;
    }
    if (csrfToken) {
      attachCsrfHeaders(headers, csrfToken, role);
    }
    const res = await authSecuredApi.post("auth/logout", {}, { headers });
    return res.data;
  } catch (error: any) {
    // Gracefully handle 401 on logout (e.g. token already expired/invalid on server)
    console.warn("Logout notice (session may already be expired on server):", error?.message);
    return null;
  }
};

export const refreshTokenAPI = async () => {
  try {
    const role = getActiveRole();
    const csrfToken = getCsrfToken(role);
    const headers: any = {};
    if (role) {
      headers["X-Role"] = role;
      headers["role"] = role;
      headers["x-role"] = role;
      headers["Poojawala-Role"] = role;
    }
    if (csrfToken) {
      attachCsrfHeaders(headers, csrfToken, role);
    }
    const res = await authPublicApi.post("auth/refresh-token", {}, { headers });
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

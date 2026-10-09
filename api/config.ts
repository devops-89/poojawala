import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { SERVER_ENDPOINTS } from "./serverConstant";

const authSecuredApi = axios.create({
  baseURL: SERVER_ENDPOINTS.AUTH_BASEURL,
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export const getActiveRole = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.role) return String(user.role).toUpperCase();
    }
  } catch (e) {}

  const path = window.location.pathname;
  if (path.startsWith("/admin")) return "ADMIN";
  if (path.startsWith("/purohit")) return "PUROHIT";
  if (path.startsWith("/customer")) return "CUSTOMER";

  return null;
};

export const saveRoleCsrfToken = (token: string | null, roleHint?: string | null) => {
  if (typeof window === "undefined" || !token) return;
  const role = (roleHint || getActiveRole() || "").toUpperCase();

  sessionStorage.setItem("csrfToken", token);

  if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    sessionStorage.setItem("poojawala-admin-csrf-token", token);
  } else if (role === "PUROHIT") {
    sessionStorage.setItem("poojawala-purohit-csrf-token", token);
  } else if (role === "CUSTOMER") {
    sessionStorage.setItem("poojawala-customer-csrf-token", token);
  }
};

export const clearRoleCsrfToken = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("csrfToken");
  sessionStorage.removeItem("poojawala-admin-csrf-token");
  sessionStorage.removeItem("poojawala-purohit-csrf-token");
  sessionStorage.removeItem("poojawala-customer-csrf-token");
};

export const getCsrfToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const role = getActiveRole();
  let tokenFromCookie: string | null = null;

  if (typeof document !== "undefined" && document.cookie) {
    const cookies = document.cookie.split(";");
    const cookieMap: Record<string, string> = {};
    for (let cookie of cookies) {
      const parts = cookie.trim().split("=");
      if (parts.length >= 2) {
        const key = parts[0];
        const val = parts.slice(1).join("=");
        if (key && val) {
          cookieMap[key] = decodeURIComponent(val);
        }
      }
    }

    if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
      tokenFromCookie = cookieMap["poojawala-admin-csrf-token"] || cookieMap["poojawalaAdminCsrfToken"] || null;
    } else if (role === "PUROHIT") {
      tokenFromCookie = cookieMap["poojawala-purohit-csrf-token"] || cookieMap["poojawalaPurohitCsrfToken"] || null;
    } else if (role === "CUSTOMER") {
      tokenFromCookie = cookieMap["poojawala-customer-csrf-token"] || cookieMap["poojawalaCustomerCsrfToken"] || null;
    }

    if (!tokenFromCookie) {
      const path = window.location.pathname;
      if (path.startsWith("/purohit")) {
        tokenFromCookie = cookieMap["poojawala-purohit-csrf-token"] || cookieMap["poojawalaPurohitCsrfToken"] || null;
      } else if (path.startsWith("/admin")) {
        tokenFromCookie = cookieMap["poojawala-admin-csrf-token"] || cookieMap["poojawalaAdminCsrfToken"] || null;
      } else if (path.startsWith("/customer")) {
        tokenFromCookie = cookieMap["poojawala-customer-csrf-token"] || cookieMap["poojawalaCustomerCsrfToken"] || null;
      }
    }

    if (!tokenFromCookie) {
      tokenFromCookie =
        cookieMap["poojawala-admin-csrf-token"] ||
        cookieMap["poojawalaAdminCsrfToken"] ||
        cookieMap["poojawala-purohit-csrf-token"] ||
        cookieMap["poojawalaPurohitCsrfToken"] ||
        cookieMap["poojawala-customer-csrf-token"] ||
        cookieMap["poojawalaCustomerCsrfToken"] ||
        cookieMap["csrfToken"] ||
        cookieMap["csrftoken"] ||
        cookieMap["_csrf"] ||
        cookieMap["XSRF-TOKEN"] ||
        null;
    }
  }

  if (tokenFromCookie) {
    saveRoleCsrfToken(tokenFromCookie, role);
    return tokenFromCookie;
  }

  if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    const adminToken = sessionStorage.getItem("poojawala-admin-csrf-token");
    if (adminToken) return adminToken;
  } else if (role === "PUROHIT") {
    const purohitToken = sessionStorage.getItem("poojawala-purohit-csrf-token");
    if (purohitToken) return purohitToken;
  } else if (role === "CUSTOMER") {
    const customerToken = sessionStorage.getItem("poojawala-customer-csrf-token");
    if (customerToken) return customerToken;
  }

  return (
    sessionStorage.getItem("poojawala-admin-csrf-token") ||
    sessionStorage.getItem("poojawala-purohit-csrf-token") ||
    sessionStorage.getItem("poojawala-customer-csrf-token") ||
    sessionStorage.getItem("csrfToken")
  );
};

export const extractRoleCsrfToken = (res: any, roleHint?: string | null): string | null => {
  const role = (roleHint || getActiveRole() || "").toUpperCase();

  if (typeof document !== "undefined" && document.cookie) {
    const cookies = document.cookie.split(";");
    const cookieMap: Record<string, string> = {};
    for (let cookie of cookies) {
      const parts = cookie.trim().split("=");
      if (parts.length >= 2) {
        const key = parts[0];
        const val = parts.slice(1).join("=");
        if (key && val) {
          cookieMap[key] = decodeURIComponent(val);
        }
      }
    }

    if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
      if (cookieMap["poojawala-admin-csrf-token"]) return cookieMap["poojawala-admin-csrf-token"];
      if (cookieMap["poojawalaAdminCsrfToken"]) return cookieMap["poojawalaAdminCsrfToken"];
    } else if (role === "PUROHIT") {
      if (cookieMap["poojawala-purohit-csrf-token"]) return cookieMap["poojawala-purohit-csrf-token"];
      if (cookieMap["poojawalaPurohitCsrfToken"]) return cookieMap["poojawalaPurohitCsrfToken"];
    } else if (role === "CUSTOMER") {
      if (cookieMap["poojawala-customer-csrf-token"]) return cookieMap["poojawala-customer-csrf-token"];
      if (cookieMap["poojawalaCustomerCsrfToken"]) return cookieMap["poojawalaCustomerCsrfToken"];
    }
  }

  if (!res) return null;
  const target = res.data || res;

  if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    if (target.poojawalaAdminCsrfToken || res.poojawalaAdminCsrfToken) {
      return target.poojawalaAdminCsrfToken || res.poojawalaAdminCsrfToken;
    }
  } else if (role === "PUROHIT") {
    if (target.poojawalaPurohitCsrfToken || res.poojawalaPurohitCsrfToken) {
      return target.poojawalaPurohitCsrfToken || res.poojawalaPurohitCsrfToken;
    }
  } else if (role === "CUSTOMER") {
    if (target.poojawalaCustomerCsrfToken || res.poojawalaCustomerCsrfToken) {
      return target.poojawalaCustomerCsrfToken || res.poojawalaCustomerCsrfToken;
    }
  }

  return (
    target.poojawalaPurohitCsrfToken ||
    target.poojawalaAdminCsrfToken ||
    target.poojawalaCustomerCsrfToken ||
    target.csrfToken ||
    res.poojawalaPurohitCsrfToken ||
    res.poojawalaAdminCsrfToken ||
    res.poojawalaCustomerCsrfToken ||
    res.csrfToken ||
    null
  );
};

export const attachCsrfHeaders = (headers: any, token?: string | null) => {
  const activeToken = token || getCsrfToken();
  if (!headers || !activeToken) return;

  const setHeader = (key: string, val: string) => {
    if (typeof headers.set === "function") {
      headers.set(key, val);
    }
    headers[key] = val;
  };

  setHeader("X-CSRF-Token", activeToken);
  setHeader("x-csrf-token", activeToken);
  setHeader("csrftoken", activeToken);

  setHeader("poojawala-admin-csrf-token", activeToken);
  setHeader("poojawalaAdminCsrfToken", activeToken);
  setHeader("poojawala-purohit-csrf-token", activeToken);
  setHeader("poojawalaPurohitCsrfToken", activeToken);
  setHeader("poojawala-customer-csrf-token", activeToken);
  setHeader("poojawalaCustomerCsrfToken", activeToken);
};

const attachRoleAndCsrfHeader = (config: InternalAxiosRequestConfig) => {
  const role = getActiveRole();
  if (role) {
    const setHeader = (key: string, val: string) => {
      if (typeof config.headers.set === "function") {
        config.headers.set(key, val);
      }
      (config.headers as any)[key] = val;
    };
    setHeader("X-Role", role);
    setHeader("role", role);
    setHeader("x-role", role);
    setHeader("Poojawala-Role", role);
  }

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    attachCsrfHeaders(config.headers, csrfToken);
  }
};

authSecuredApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    attachRoleAndCsrfHeader(config);
    return config;
  },
  (error) => Promise.reject(error)
);

const authPublicApi = axios.create({
  baseURL: SERVER_ENDPOINTS.AUTH_BASEURL,
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

const userSecuredApi = axios.create({
  baseURL: SERVER_ENDPOINTS.USER_BASEURL,
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

userSecuredApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    attachRoleAndCsrfHeader(config);
    return config;
  },
  (error) => Promise.reject(error)
);

const userPublicApi = axios.create({
  baseURL: SERVER_ENDPOINTS.USER_BASEURL,
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

const paymentSecuredApi = axios.create({
  baseURL: SERVER_ENDPOINTS.PAYMENT_BASEURL,
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

paymentSecuredApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    attachRoleAndCsrfHeader(config);
    return config;
  },
  (error) => Promise.reject(error)
);

export { authPublicApi, authSecuredApi, paymentSecuredApi, userPublicApi, userSecuredApi };

let isRefreshing = false;

interface FailedQueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: AxiosError | Error) => void;
}

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: AxiosError | Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const setupResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (!originalRequest) return Promise.reject(error);

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (
          originalRequest.url?.includes("auth/login") ||
          originalRequest.url?.includes("auth/logout") ||
          originalRequest.url?.includes("auth/register") ||
          originalRequest.url?.includes("auth/refresh-token")
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string | null>(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.method && ["POST", "PUT", "PATCH", "DELETE"].includes(originalRequest.method.toUpperCase())) {
                originalRequest.headers["X-CSRF-Token"] = token;
              }
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const csrfToken = getCsrfToken();
          const refreshHeaders: any = {};
          if (csrfToken) {
            attachCsrfHeaders(refreshHeaders, csrfToken);
          }
          const response = await authPublicApi.post("auth/refresh-token", {}, { headers: refreshHeaders });
          const resBody = response.data;
          const userData = resBody?.user || resBody?.data?.user;
          const activeRole = userData?.role || getActiveRole();
          const newCsrfToken = extractRoleCsrfToken(resBody, activeRole);

          if (newCsrfToken) {
            saveRoleCsrfToken(newCsrfToken, activeRole);
          }

          if (userData) {
            sessionStorage.setItem("user", JSON.stringify(userData));
          }

          processQueue(null, newCsrfToken);

          if (originalRequest.method && ["POST", "PUT", "PATCH", "DELETE"].includes(originalRequest.method.toUpperCase())) {
            attachCsrfHeaders(originalRequest.headers, newCsrfToken);
          }

          return instance(originalRequest);
        } catch (refreshError) {
          const typedError = refreshError as AxiosError | Error;
          processQueue(typedError, null);
          clearRoleCsrfToken();
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
          return Promise.reject(typedError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
};

setupResponseInterceptor(authSecuredApi);
setupResponseInterceptor(userSecuredApi);
setupResponseInterceptor(paymentSecuredApi);

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

  try {
    sessionStorage.setItem("csrfToken", token);
    localStorage.setItem("csrfToken", token);
  } catch (e) {}

  if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    try {
      sessionStorage.setItem("admincsrftoken", token);
      sessionStorage.setItem("adminCsrfToken", token);
      sessionStorage.setItem("poojawala-admin-csrf-token", token);
      sessionStorage.setItem("poojawalaAdminCsrfToken", token);
      localStorage.setItem("admincsrftoken", token);
      localStorage.setItem("adminCsrfToken", token);
      localStorage.setItem("poojawala-admin-csrf-token", token);
      localStorage.setItem("poojawalaAdminCsrfToken", token);
    } catch (e) {}
  } else if (role === "PUROHIT") {
    try {
      sessionStorage.setItem("purohitcsrftoken", token);
      sessionStorage.setItem("purohitCsrfToken", token);
      sessionStorage.setItem("poojawala-purohit-csrf-token", token);
      sessionStorage.setItem("poojawalaPurohitCsrfToken", token);
      localStorage.setItem("purohitcsrftoken", token);
      localStorage.setItem("purohitCsrfToken", token);
      localStorage.setItem("poojawala-purohit-csrf-token", token);
      localStorage.setItem("poojawalaPurohitCsrfToken", token);
    } catch (e) {}
  } else if (role === "CUSTOMER") {
    try {
      sessionStorage.setItem("customercsrftoken", token);
      sessionStorage.setItem("customerCsrfToken", token);
      sessionStorage.setItem("poojawala-customer-csrf-token", token);
      sessionStorage.setItem("poojawalaCustomerCsrfToken", token);
      localStorage.setItem("customercsrftoken", token);
      localStorage.setItem("customerCsrfToken", token);
      localStorage.setItem("poojawala-customer-csrf-token", token);
      localStorage.setItem("poojawalaCustomerCsrfToken", token);
    } catch (e) {}
  }
};

export const clearRoleCsrfToken = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("csrfToken");
    sessionStorage.removeItem("customercsrftoken");
    sessionStorage.removeItem("customerCsrfToken");
    sessionStorage.removeItem("poojawala-customer-csrf-token");
    sessionStorage.removeItem("poojawalaCustomerCsrfToken");
    sessionStorage.removeItem("admincsrftoken");
    sessionStorage.removeItem("adminCsrfToken");
    sessionStorage.removeItem("poojawala-admin-csrf-token");
    sessionStorage.removeItem("poojawalaAdminCsrfToken");
    sessionStorage.removeItem("purohitcsrftoken");
    sessionStorage.removeItem("purohitCsrfToken");
    sessionStorage.removeItem("poojawala-purohit-csrf-token");
    sessionStorage.removeItem("poojawalaPurohitCsrfToken");

    localStorage.removeItem("csrfToken");
    localStorage.removeItem("customercsrftoken");
    localStorage.removeItem("customerCsrfToken");
    localStorage.removeItem("poojawala-customer-csrf-token");
    localStorage.removeItem("poojawalaCustomerCsrfToken");
    localStorage.removeItem("admincsrftoken");
    localStorage.removeItem("adminCsrfToken");
    localStorage.removeItem("poojawala-admin-csrf-token");
    localStorage.removeItem("poojawalaAdminCsrfToken");
    localStorage.removeItem("purohitcsrftoken");
    localStorage.removeItem("purohitCsrfToken");
    localStorage.removeItem("poojawala-purohit-csrf-token");
    localStorage.removeItem("poojawalaPurohitCsrfToken");
  } catch (e) {}
};

export const parseAllCookies = (): { map: Record<string, string>; lowerMap: Record<string, string> } => {
  const map: Record<string, string> = {};
  const lowerMap: Record<string, string> = {};
  if (typeof document !== "undefined" && document.cookie) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const parts = cookie.trim().split("=");
      if (parts.length >= 2) {
        const key = parts[0];
        const val = parts.slice(1).join("=");
        if (key && val) {
          const decoded = decodeURIComponent(val);
          map[key] = decoded;
          lowerMap[key.toLowerCase()] = decoded;
        }
      }
    }
  }
  return { map, lowerMap };
};

export const getCsrfToken = (roleHint?: string | null): string | null => {
  if (typeof window === "undefined") return null;

  const role = (roleHint || getActiveRole() || "").toUpperCase();
  const { map, lowerMap } = parseAllCookies();
  let tokenFromCookie: string | null = null;

  if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    tokenFromCookie =
      map["admincsrftoken"] ||
      map["adminCsrfToken"] ||
      lowerMap["admincsrftoken"] ||
      map["poojawala-admin-csrf-token"] ||
      map["poojawalaAdminCsrfToken"] ||
      lowerMap["poojawalaadmincsrftoken"] ||
      lowerMap["poojawala-admin-csrf-token"] ||
      null;
  } else if (role === "PUROHIT") {
    tokenFromCookie =
      map["purohitcsrftoken"] ||
      map["purohitCsrfToken"] ||
      lowerMap["purohitcsrftoken"] ||
      map["poojawala-purohit-csrf-token"] ||
      map["poojawalaPurohitCsrfToken"] ||
      lowerMap["poojawalapurohitcsrftoken"] ||
      lowerMap["poojawala-purohit-csrf-token"] ||
      null;
  } else if (role === "CUSTOMER") {
    tokenFromCookie =
      map["customercsrftoken"] ||
      map["customerCsrfToken"] ||
      lowerMap["customercsrftoken"] ||
      map["poojawala-customer-csrf-token"] ||
      map["poojawalaCustomerCsrfToken"] ||
      lowerMap["poojawalacustomercsrftoken"] ||
      lowerMap["poojawala-customer-csrf-token"] ||
      null;
  }

  // Path-based fallback
  if (!tokenFromCookie) {
    const path = window.location.pathname;
    if (path.startsWith("/customer")) {
      tokenFromCookie =
        map["customercsrftoken"] ||
        map["customerCsrfToken"] ||
        lowerMap["customercsrftoken"] ||
        map["poojawala-customer-csrf-token"] ||
        map["poojawalaCustomerCsrfToken"] ||
        lowerMap["poojawalacustomercsrftoken"] ||
        null;
    } else if (path.startsWith("/admin")) {
      tokenFromCookie =
        map["admincsrftoken"] ||
        map["adminCsrfToken"] ||
        lowerMap["admincsrftoken"] ||
        map["poojawala-admin-csrf-token"] ||
        map["poojawalaAdminCsrfToken"] ||
        lowerMap["poojawalaadmincsrftoken"] ||
        null;
    } else if (path.startsWith("/purohit")) {
      tokenFromCookie =
        map["purohitcsrftoken"] ||
        map["purohitCsrfToken"] ||
        lowerMap["purohitcsrftoken"] ||
        map["poojawala-purohit-csrf-token"] ||
        map["poojawalaPurohitCsrfToken"] ||
        lowerMap["poojawalapurohitcsrftoken"] ||
        null;
    }
  }

  // Any role-specific cookie fallback
  if (!tokenFromCookie) {
    tokenFromCookie =
      map["customercsrftoken"] ||
      map["customerCsrfToken"] ||
      lowerMap["customercsrftoken"] ||
      map["poojawala-customer-csrf-token"] ||
      map["poojawalaCustomerCsrfToken"] ||
      map["admincsrftoken"] ||
      map["adminCsrfToken"] ||
      lowerMap["admincsrftoken"] ||
      map["poojawala-admin-csrf-token"] ||
      map["poojawalaAdminCsrfToken"] ||
      map["purohitcsrftoken"] ||
      map["purohitCsrfToken"] ||
      lowerMap["purohitcsrftoken"] ||
      map["poojawala-purohit-csrf-token"] ||
      map["poojawalaPurohitCsrfToken"] ||
      map["csrfToken"] ||
      map["csrftoken"] ||
      lowerMap["csrftoken"] ||
      map["_csrf"] ||
      map["XSRF-TOKEN"] ||
      null;
  }

  if (tokenFromCookie) {
    saveRoleCsrfToken(tokenFromCookie, role);
    return tokenFromCookie;
  }

  // Storage fallback
  const getStored = (key: string) => {
    try {
      const val = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (val) return val;
    } catch (e) {}
    return null;
  };

  if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    const adminToken =
      getStored("admincsrftoken") ||
      getStored("adminCsrfToken") ||
      getStored("poojawala-admin-csrf-token") ||
      getStored("poojawalaAdminCsrfToken");
    if (adminToken) return adminToken;
  } else if (role === "PUROHIT") {
    const purohitToken =
      getStored("purohitcsrftoken") ||
      getStored("purohitCsrfToken") ||
      getStored("poojawala-purohit-csrf-token") ||
      getStored("poojawalaPurohitCsrfToken");
    if (purohitToken) return purohitToken;
  } else if (role === "CUSTOMER") {
    const customerToken =
      getStored("customercsrftoken") ||
      getStored("customerCsrfToken") ||
      getStored("poojawala-customer-csrf-token") ||
      getStored("poojawalaCustomerCsrfToken");
    if (customerToken) return customerToken;
  }

  return (
    getStored("customercsrftoken") ||
    getStored("customerCsrfToken") ||
    getStored("poojawala-customer-csrf-token") ||
    getStored("poojawalaCustomerCsrfToken") ||
    getStored("admincsrftoken") ||
    getStored("adminCsrfToken") ||
    getStored("poojawala-admin-csrf-token") ||
    getStored("poojawalaAdminCsrfToken") ||
    getStored("purohitcsrftoken") ||
    getStored("purohitCsrfToken") ||
    getStored("poojawala-purohit-csrf-token") ||
    getStored("poojawalaPurohitCsrfToken") ||
    getStored("csrfToken")
  );
};

export const extractRoleCsrfToken = (res: any, roleHint?: string | null): string | null => {
  const role = (roleHint || getActiveRole() || "").toUpperCase();
  const { map, lowerMap } = parseAllCookies();

  if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    if (map["admincsrftoken"]) return map["admincsrftoken"];
    if (map["adminCsrfToken"]) return map["adminCsrfToken"];
    if (lowerMap["admincsrftoken"]) return lowerMap["admincsrftoken"];
    if (map["poojawala-admin-csrf-token"]) return map["poojawala-admin-csrf-token"];
    if (map["poojawalaAdminCsrfToken"]) return map["poojawalaAdminCsrfToken"];
  } else if (role === "PUROHIT") {
    if (map["purohitcsrftoken"]) return map["purohitcsrftoken"];
    if (map["purohitCsrfToken"]) return map["purohitCsrfToken"];
    if (lowerMap["purohitcsrftoken"]) return lowerMap["purohitcsrftoken"];
    if (map["poojawala-purohit-csrf-token"]) return map["poojawala-purohit-csrf-token"];
    if (map["poojawalaPurohitCsrfToken"]) return map["poojawalaPurohitCsrfToken"];
  } else if (role === "CUSTOMER") {
    if (map["customercsrftoken"]) return map["customercsrftoken"];
    if (map["customerCsrfToken"]) return map["customerCsrfToken"];
    if (lowerMap["customercsrftoken"]) return lowerMap["customercsrftoken"];
    if (map["poojawala-customer-csrf-token"]) return map["poojawala-customer-csrf-token"];
    if (map["poojawalaCustomerCsrfToken"]) return map["poojawalaCustomerCsrfToken"];
  }

  if (!res) return null;
  const target = res.data || res;

  if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    const val =
      target.admincsrftoken ||
      target.adminCsrfToken ||
      target.poojawalaAdminCsrfToken ||
      target["poojawala-admin-csrf-token"] ||
      res.admincsrftoken ||
      res.adminCsrfToken ||
      res.poojawalaAdminCsrfToken ||
      res["poojawala-admin-csrf-token"];
    if (val) return val;
  } else if (role === "PUROHIT") {
    const val =
      target.purohitcsrftoken ||
      target.purohitCsrfToken ||
      target.poojawalaPurohitCsrfToken ||
      target["poojawala-purohit-csrf-token"] ||
      res.purohitcsrftoken ||
      res.purohitCsrfToken ||
      res.poojawalaPurohitCsrfToken ||
      res["poojawala-purohit-csrf-token"];
    if (val) return val;
  } else if (role === "CUSTOMER") {
    const val =
      target.customercsrftoken ||
      target.customerCsrfToken ||
      target.poojawalaCustomerCsrfToken ||
      target["poojawala-customer-csrf-token"] ||
      res.customercsrftoken ||
      res.customerCsrfToken ||
      res.poojawalaCustomerCsrfToken ||
      res["poojawala-customer-csrf-token"];
    if (val) return val;
  }

  return (
    target.customercsrftoken ||
    target.customerCsrfToken ||
    target.poojawalaCustomerCsrfToken ||
    target.admincsrftoken ||
    target.adminCsrfToken ||
    target.poojawalaAdminCsrfToken ||
    target.purohitcsrftoken ||
    target.purohitCsrfToken ||
    target.poojawalaPurohitCsrfToken ||
    target.csrfToken ||
    res.customercsrftoken ||
    res.customerCsrfToken ||
    res.poojawalaCustomerCsrfToken ||
    res.admincsrftoken ||
    res.adminCsrfToken ||
    res.poojawalaAdminCsrfToken ||
    res.purohitcsrftoken ||
    res.purohitCsrfToken ||
    res.poojawalaPurohitCsrfToken ||
    res.csrfToken ||
    null
  );
};

export const attachCsrfHeaders = (headers: any, token?: string | null, roleHint?: string | null) => {
  const role = (roleHint || getActiveRole() || "").toUpperCase();
  const activeToken = token || getCsrfToken(role);
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
  setHeader("csrf-token", activeToken);

  if (role === "CUSTOMER") {
    setHeader("customercsrftoken", activeToken);
    setHeader("customerCsrfToken", activeToken);
    setHeader("CustomerCsrfToken", activeToken);
    setHeader("poojawala-customer-csrf-token", activeToken);
    setHeader("poojawalaCustomerCsrfToken", activeToken);
    setHeader("x-customer-csrf-token", activeToken);
  } else if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
    setHeader("admincsrftoken", activeToken);
    setHeader("adminCsrfToken", activeToken);
    setHeader("AdminCsrfToken", activeToken);
    setHeader("poojawala-admin-csrf-token", activeToken);
    setHeader("poojawalaAdminCsrfToken", activeToken);
    setHeader("x-admin-csrf-token", activeToken);
  } else if (role === "PUROHIT") {
    setHeader("purohitcsrftoken", activeToken);
    setHeader("purohitCsrfToken", activeToken);
    setHeader("PurohitCsrfToken", activeToken);
    setHeader("poojawala-purohit-csrf-token", activeToken);
    setHeader("poojawalaPurohitCsrfToken", activeToken);
    setHeader("x-purohit-csrf-token", activeToken);
  } else {
    setHeader("customercsrftoken", activeToken);
    setHeader("poojawala-customer-csrf-token", activeToken);
    setHeader("admincsrftoken", activeToken);
    setHeader("poojawala-admin-csrf-token", activeToken);
    setHeader("purohitcsrftoken", activeToken);
    setHeader("poojawala-purohit-csrf-token", activeToken);
  }
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

  const csrfToken = getCsrfToken(role);
  if (csrfToken) {
    attachCsrfHeaders(config.headers, csrfToken, role);
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
    (response: AxiosResponse) => {
      try {
        const role = getActiveRole();
        const extracted =
          extractRoleCsrfToken(response.data, role) ||
          extractRoleCsrfToken(response, role);
        if (extracted) {
          saveRoleCsrfToken(extracted, role);
        }
      } catch (e) {}
      return response;
    },
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
                const currentRole = getActiveRole();
                attachCsrfHeaders(originalRequest.headers, token, currentRole);
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
          const currentRole = getActiveRole();
          const csrfToken = getCsrfToken(currentRole);
          const refreshHeaders: any = {};
          if (csrfToken) {
            attachCsrfHeaders(refreshHeaders, csrfToken, currentRole);
          }
          const response = await authPublicApi.post("auth/refresh-token", {}, { headers: refreshHeaders });
          const resBody = response.data;
          const userData = resBody?.user || resBody?.data?.user;
          const activeRole = userData?.role || currentRole;
          const newCsrfToken = extractRoleCsrfToken(resBody, activeRole);

          if (newCsrfToken) {
            saveRoleCsrfToken(newCsrfToken, activeRole);
          }

          if (userData) {
            sessionStorage.setItem("user", JSON.stringify(userData));
          }

          processQueue(null, newCsrfToken);

          if (originalRequest.method && ["POST", "PUT", "PATCH", "DELETE"].includes(originalRequest.method.toUpperCase())) {
            attachCsrfHeaders(originalRequest.headers, newCsrfToken, activeRole);
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

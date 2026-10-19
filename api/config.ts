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
    const activeRole = sessionStorage.getItem("activeRole");
    if (activeRole) return activeRole.toUpperCase();
  } catch (e) {}

  try {
    const roleStored = sessionStorage.getItem("role");
    if (roleStored) return roleStored.toUpperCase();
  } catch (e) {}

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
  if (path.startsWith("/partner")) {
    if (path.startsWith("/partner/astrologybookings")) return "ASTROLOGER";
    try {
      const u = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (u?.role) return String(u.role).toUpperCase();
    } catch (e) {}
    return "PUROHIT";
  }
  if (path.startsWith("/astrologer")) return "ASTROLOGER";
  if (path.startsWith("/customer")) return "CUSTOMER";

  try {
    if (sessionStorage.getItem("purohitcsrftoken") || localStorage.getItem("purohitcsrftoken") || sessionStorage.getItem("poojawala-purohit-csrf-token")) {
      return "PUROHIT";
    }
    if (sessionStorage.getItem("astrologercsrftoken") || localStorage.getItem("astrologercsrftoken") || sessionStorage.getItem("poojawala-astrologer-csrf-token")) {
      return "ASTROLOGER";
    }
    if (sessionStorage.getItem("admincsrftoken") || localStorage.getItem("admincsrftoken") || sessionStorage.getItem("poojawala-admin-csrf-token")) {
      return "ADMIN";
    }
    if (sessionStorage.getItem("customercsrftoken") || localStorage.getItem("customercsrftoken") || sessionStorage.getItem("poojawala-customer-csrf-token")) {
      return "CUSTOMER";
    }
  } catch (e) {}

  return null;
};

export const syncCsrfToCookie = (token: string | null, roleHint?: string | null) => {
  if (typeof document === "undefined" || !token) return;
  const role = (roleHint || getActiveRole() || "").toUpperCase();

  try {
    const encoded = encodeURIComponent(token);
    document.cookie = `csrftoken=${encoded}; path=/; SameSite=Lax`;
    document.cookie = `csrf-token=${encoded}; path=/; SameSite=Lax`;

    if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
      document.cookie = `poojawala-admin-csrf-token=${encoded}; path=/; SameSite=Lax`;
      document.cookie = `admincsrftoken=${encoded}; path=/; SameSite=Lax`;
    } else if (role === "CUSTOMER") {
      document.cookie = `poojawala-customer-csrf-token=${encoded}; path=/; SameSite=Lax`;
      document.cookie = `customercsrftoken=${encoded}; path=/; SameSite=Lax`;
    } else if (role === "PUROHIT") {
      document.cookie = `poojawala-purohit-csrf-token=${encoded}; path=/; SameSite=Lax`;
      document.cookie = `purohitcsrftoken=${encoded}; path=/; SameSite=Lax`;
    } else if (role === "ASTROLOGER") {
      document.cookie = `poojawala-astrologer-csrf-token=${encoded}; path=/; SameSite=Lax`;
      document.cookie = `astrologercsrftoken=${encoded}; path=/; SameSite=Lax`;
    }
  } catch (e) {}
};

export const clearCsrfTokensOnly = () => {
  if (typeof window === "undefined") return;
  try {
    const cookieNames = [
      "csrftoken",
      "csrf-token",
      "admincsrftoken",
      "adminCsrfToken",
      "poojawala-admin-csrf-token",
      "poojawalaAdminCsrfToken",
      "customercsrftoken",
      "customerCsrfToken",
      "poojawala-customer-csrf-token",
      "poojawalaCustomerCsrfToken",
      "purohitcsrftoken",
      "purohitCsrfToken",
      "poojawala-purohit-csrf-token",
      "poojawalaPurohitCsrfToken",
      "astrologercsrftoken",
      "astrologerCsrfToken",
      "poojawala-astrologer-csrf-token",
      "poojawalaAstrologerCsrfToken",
      "csrfToken",
      "_csrf",
      "XSRF-TOKEN",
    ];
    cookieNames.forEach((name) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    });

    const storageKeys = [
      "csrfToken",
      "customercsrftoken",
      "customerCsrfToken",
      "poojawala-customer-csrf-token",
      "poojawalaCustomerCsrfToken",
      "admincsrftoken",
      "adminCsrfToken",
      "poojawala-admin-csrf-token",
      "poojawalaAdminCsrfToken",
      "purohitcsrftoken",
      "purohitCsrfToken",
      "poojawala-purohit-csrf-token",
      "poojawalaPurohitCsrfToken",
      "astrologercsrftoken",
      "astrologerCsrfToken",
      "poojawala-astrologer-csrf-token",
      "poojawalaAstrologerCsrfToken",
    ];

    storageKeys.forEach((key) => {
      try {
        sessionStorage.removeItem(key);
      } catch (e) {}
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    });
  } catch (e) {}
};

export const replaceCsrfToken = (token: string | null, roleHint?: string | null) => {
  if (typeof window === "undefined" || !token) return;
  const role = (roleHint || getActiveRole() || "").toUpperCase();
  clearCsrfTokensOnly();
  saveRoleCsrfToken(token, role);
};

export const saveRoleCsrfToken = (token: string | null, roleHint?: string | null) => {
  if (typeof window === "undefined" || !token) return;
  const role = (roleHint || getActiveRole() || "").toUpperCase();

  // Clear previous CSRF tokens so stale/different role tokens do not linger
  clearCsrfTokensOnly();

  syncCsrfToCookie(token, role);

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
  } else if (role === "ASTROLOGER") {
    try {
      sessionStorage.setItem("astrologercsrftoken", token);
      sessionStorage.setItem("astrologerCsrfToken", token);
      sessionStorage.setItem("poojawala-astrologer-csrf-token", token);
      sessionStorage.setItem("poojawalaAstrologerCsrfToken", token);
      localStorage.setItem("astrologercsrftoken", token);
      localStorage.setItem("astrologerCsrfToken", token);
      localStorage.setItem("poojawala-astrologer-csrf-token", token);
      localStorage.setItem("poojawalaAstrologerCsrfToken", token);
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
    clearCsrfTokensOnly();

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("activeRole");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("activeRole");
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
  } else if (role === "ASTROLOGER") {
    tokenFromCookie =
      map["astrologercsrftoken"] ||
      map["astrologerCsrfToken"] ||
      lowerMap["astrologercsrftoken"] ||
      map["poojawala-astrologer-csrf-token"] ||
      map["poojawalaAstrologerCsrfToken"] ||
      lowerMap["poojawalaastrologercsrftoken"] ||
      lowerMap["poojawala-astrologer-csrf-token"] ||
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
    } else if (path.startsWith("/purohit") || path.startsWith("/partner")) {
      tokenFromCookie =
        map["purohitcsrftoken"] ||
        map["purohitCsrfToken"] ||
        lowerMap["purohitcsrftoken"] ||
        map["poojawala-purohit-csrf-token"] ||
        map["poojawalaPurohitCsrfToken"] ||
        lowerMap["poojawalapurohitcsrftoken"] ||
        null;
    } else if (path.startsWith("/astrologer")) {
      tokenFromCookie =
        map["astrologercsrftoken"] ||
        map["astrologerCsrfToken"] ||
        lowerMap["astrologercsrftoken"] ||
        map["poojawala-astrologer-csrf-token"] ||
        map["poojawalaAstrologerCsrfToken"] ||
        lowerMap["poojawalaastrologercsrftoken"] ||
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
      map["astrologercsrftoken"] ||
      map["astrologerCsrfToken"] ||
      lowerMap["astrologercsrftoken"] ||
      map["poojawala-astrologer-csrf-token"] ||
      map["poojawalaAstrologerCsrfToken"] ||
      lowerMap["poojawalaastrologercsrftoken"] ||
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
  } else if (role === "ASTROLOGER") {
    const astrologerToken =
      getStored("astrologercsrftoken") ||
      getStored("astrologerCsrfToken") ||
      getStored("poojawala-astrologer-csrf-token") ||
      getStored("poojawalaAstrologerCsrfToken");
    if (astrologerToken) return astrologerToken;
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
    getStored("astrologercsrftoken") ||
    getStored("astrologerCsrfToken") ||
    getStored("poojawala-astrologer-csrf-token") ||
    getStored("poojawalaAstrologerCsrfToken") ||
    getStored("csrfToken")
  );
};

// Immediately sync CSRF to cookies on client load if user is logged in
if (typeof window !== "undefined") {
  try {
    const initialRole = getActiveRole();
    const initialToken = getCsrfToken(initialRole);
    if (initialToken) {
      syncCsrfToCookie(initialToken, initialRole);
    }
  } catch (e) {}
}

export const extractRoleCsrfToken = (res: any, roleHint?: string | null): string | null => {
  const role = (roleHint || getActiveRole() || "").toUpperCase();

  // 1. First extract from response object/body/headers if provided
  if (res) {
    const target = res.data || res;
    const headers = res.headers || {};
    const innerData = target.data || {};
    const innerTokens = target.tokens || {};

    // Check response headers first
    const headerToken =
      headers["x-csrf-token"] ||
      headers["X-CSRF-Token"] ||
      headers["csrf-token"] ||
      headers["CSRF-Token"] ||
      headers["csrftoken"] ||
      headers["x-admin-csrf-token"] ||
      headers["x-customer-csrf-token"] ||
      headers["x-purohit-csrf-token"] ||
      headers["x-astrologer-csrf-token"] ||
      headers.admincsrftoken ||
      headers.customercsrftoken ||
      headers.purohitcsrftoken ||
      headers.astrologercsrftoken;
    if (headerToken) return headerToken;

    // Role-specific field checks in target, target.data, target.tokens, res
    if (role === "ADMIN" || role === "SUPERADMIN" || role === "SUPER_ADMIN") {
      const val =
        target.poojawalaAdminCsrfToken ||
        target["poojawala-admin-csrf-token"] ||
        target.admincsrftoken ||
        target.adminCsrfToken ||
        innerData.poojawalaAdminCsrfToken ||
        innerData["poojawala-admin-csrf-token"] ||
        innerData.admincsrftoken ||
        innerData.adminCsrfToken ||
        innerTokens.poojawalaAdminCsrfToken ||
        res.poojawalaAdminCsrfToken ||
        res["poojawala-admin-csrf-token"] ||
        res.admincsrftoken ||
        res.adminCsrfToken;
      if (val) return val;
    } else if (role === "PUROHIT") {
      const val =
        target.poojawalaPurohitCsrfToken ||
        target["poojawala-purohit-csrf-token"] ||
        target.purohitcsrftoken ||
        target.purohitCsrfToken ||
        innerData.poojawalaPurohitCsrfToken ||
        innerData["poojawala-purohit-csrf-token"] ||
        innerData.purohitcsrftoken ||
        innerData.purohitCsrfToken ||
        innerTokens.poojawalaPurohitCsrfToken ||
        res.poojawalaPurohitCsrfToken ||
        res["poojawala-purohit-csrf-token"] ||
        res.purohitcsrftoken ||
        res.purohitCsrfToken;
      if (val) return val;
    } else if (role === "ASTROLOGER") {
      const val =
        target.poojawalaAstrologerCsrfToken ||
        target["poojawala-astrologer-csrf-token"] ||
        target.astrologercsrftoken ||
        target.astrologerCsrfToken ||
        innerData.poojawalaAstrologerCsrfToken ||
        innerData["poojawala-astrologer-csrf-token"] ||
        innerData.astrologercsrftoken ||
        innerData.astrologerCsrfToken ||
        innerTokens.poojawalaAstrologerCsrfToken ||
        res.poojawalaAstrologerCsrfToken ||
        res["poojawala-astrologer-csrf-token"] ||
        res.astrologercsrftoken ||
        res.astrologerCsrfToken;
      if (val) return val;
    } else if (role === "CUSTOMER") {
      const val =
        target.poojawalaCustomerCsrfToken ||
        target["poojawala-customer-csrf-token"] ||
        target.customercsrftoken ||
        target.customerCsrfToken ||
        innerData.poojawalaCustomerCsrfToken ||
        innerData["poojawala-customer-csrf-token"] ||
        innerData.customercsrftoken ||
        innerData.customerCsrfToken ||
        innerTokens.poojawalaCustomerCsrfToken ||
        res.poojawalaCustomerCsrfToken ||
        res["poojawala-customer-csrf-token"] ||
        res.customercsrftoken ||
        res.customerCsrfToken;
      if (val) return val;
    }

    // Generic field checks
    const genericVal =
      target.csrfToken ||
      target.csrf ||
      target.csrftoken ||
      target["csrf-token"] ||
      innerTokens.csrf ||
      innerTokens.csrfToken ||
      innerData.csrfToken ||
      innerData.csrf ||
      res.csrfToken ||
      res.csrf;
    if (genericVal) return genericVal;

    // Cross-role checks
    const anyRoleVal =
      target.customercsrftoken ||
      target.customerCsrfToken ||
      target.poojawalaCustomerCsrfToken ||
      target.admincsrftoken ||
      target.adminCsrfToken ||
      target.poojawalaAdminCsrfToken ||
      target.purohitcsrftoken ||
      target.purohitCsrfToken ||
      target.poojawalaPurohitCsrfToken ||
      target.astrologercsrftoken ||
      target.astrologerCsrfToken ||
      target.poojawalaAstrologerCsrfToken ||
      res.customercsrftoken ||
      res.customerCsrfToken ||
      res.poojawalaCustomerCsrfToken ||
      res.admincsrftoken ||
      res.adminCsrfToken ||
      res.poojawalaAdminCsrfToken ||
      res.purohitcsrftoken ||
      res.purohitCsrfToken ||
      res.poojawalaPurohitCsrfToken ||
      res.astrologercsrftoken ||
      res.astrologerCsrfToken ||
      res.poojawalaAstrologerCsrfToken;
    if (anyRoleVal) return anyRoleVal;
  }

  // 2. Fallback: only if NOT in response, check cookies
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
  } else if (role === "ASTROLOGER") {
    if (map["astrologercsrftoken"]) return map["astrologercsrftoken"];
    if (map["astrologerCsrfToken"]) return map["astrologerCsrfToken"];
    if (lowerMap["astrologercsrftoken"]) return lowerMap["astrologercsrftoken"];
    if (map["poojawala-astrologer-csrf-token"]) return map["poojawala-astrologer-csrf-token"];
    if (map["poojawalaAstrologerCsrfToken"]) return map["poojawalaAstrologerCsrfToken"];
  } else if (role === "CUSTOMER") {
    if (map["customercsrftoken"]) return map["customercsrftoken"];
    if (map["customerCsrfToken"]) return map["customerCsrfToken"];
    if (lowerMap["customercsrftoken"]) return lowerMap["customercsrftoken"];
    if (map["poojawala-customer-csrf-token"]) return map["poojawala-customer-csrf-token"];
    if (map["poojawalaCustomerCsrfToken"]) return map["poojawalaCustomerCsrfToken"];
  }

  return (
    map["csrftoken"] ||
    map["csrf-token"] ||
    lowerMap["csrftoken"] ||
    map["_csrf"] ||
    map["XSRF-TOKEN"] ||
    null
  );
};

export const attachCsrfHeaders = (headers: any, token?: string | null, roleHint?: string | null) => {
  const role = (roleHint || getActiveRole() || "").toUpperCase();
  const activeToken = token || getCsrfToken(role);
  if (!headers || !activeToken) return;

  // Always ensure csrftoken & role cookie are synced to document.cookie so browser sends them with cookies
  syncCsrfToCookie(activeToken, role);

  const keysToDelete = [
    "X-CSRF-Token",
    "x-csrf-token",
    "csrftoken",
    "csrf-token",
    "Csrf-Token",
    "Csrftoken",
    "admincsrftoken",
    "adminCsrfToken",
    "AdminCsrfToken",
    "poojawala-admin-csrf-token",
    "poojawalaAdminCsrfToken",
    "Poojawala-Admin-Csrf-Token",
    "Poojawalaadmincsrftoken",
    "x-admin-csrf-token",
    "X-Admin-Csrf-Token",
    "customercsrftoken",
    "customerCsrfToken",
    "CustomerCsrfToken",
    "poojawala-customer-csrf-token",
    "poojawalaCustomerCsrfToken",
    "x-customer-csrf-token",
    "purohitcsrftoken",
    "purohitCsrfToken",
    "PurohitCsrfToken",
    "poojawala-purohit-csrf-token",
    "poojawalaPurohitCsrfToken",
    "x-purohit-csrf-token",
    "astrologercsrftoken",
    "astrologerCsrfToken",
    "AstrologerCsrfToken",
    "poojawala-astrologer-csrf-token",
    "poojawalaAstrologerCsrfToken",
    "x-astrologer-csrf-token",
  ];

  for (const k of keysToDelete) {
    if (typeof headers.delete === "function") {
      headers.delete(k);
    }
    delete headers[k];
  }

  // Send CSRF token exactly once in request headers
  if (typeof headers.set === "function") {
    headers.set("x-csrf-token", activeToken);
  }
  headers["x-csrf-token"] = activeToken;
};

const attachRoleAndCsrfHeader = (config: InternalAxiosRequestConfig) => {
  const role = getActiveRole();
  if (role) {
    const roleKeysToDelete = ["X-Role", "x-role", "role", "Role", "Poojawala-Role", "poojawala-role"];
    for (const k of roleKeysToDelete) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete(k);
      }
      delete (config.headers as any)[k];
    }
    // Send role exactly once in request headers
    if (typeof config.headers.set === "function") {
      config.headers.set("x-role", role);
    }
    (config.headers as any)["x-role"] = role;
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

authPublicApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    attachRoleAndCsrfHeader(config);
    return config;
  },
  (error) => Promise.reject(error)
);

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

userPublicApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    attachRoleAndCsrfHeader(config);
    return config;
  },
  (error) => Promise.reject(error)
);

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
          const oldCsrfToken = getCsrfToken(currentRole);
          const refreshHeaders: any = {};
          if (currentRole) {
            refreshHeaders["x-role"] = currentRole;
          }
          if (oldCsrfToken) {
            attachCsrfHeaders(refreshHeaders, oldCsrfToken, currentRole);
          }
          const response = await authPublicApi.post("auth/refresh-token", {}, { headers: refreshHeaders });
          const resBody = response.data;
          const userData = resBody?.user || resBody?.data?.user;
          const activeRole = userData?.role || currentRole;

          // Naye waale CSRF token ko extract karo response object ya body se
          let newCsrfToken =
            extractRoleCsrfToken(response, activeRole) ||
            extractRoleCsrfToken(resBody, activeRole);

          // Fallback: Agar cookie update hui ho jo puraane token se alag ho
          if (!newCsrfToken) {
            const { map, lowerMap } = parseAllCookies();
            const candidate =
              map["csrftoken"] ||
              map["csrf-token"] ||
              lowerMap["csrftoken"] ||
              map["poojawala-customer-csrf-token"] ||
              map["poojawala-admin-csrf-token"] ||
              map["poojawala-purohit-csrf-token"] ||
              map["poojawala-astrologer-csrf-token"];
            if (candidate && candidate !== oldCsrfToken) {
              newCsrfToken = candidate;
            }
          }

          if (newCsrfToken) {
            // Naye waale csrf token ko store kr puraane waale ko hataakr
            replaceCsrfToken(newCsrfToken, activeRole);
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
          if (typeof window !== "undefined") {
            const path = window.location.pathname;
            const isProtected =
              path.startsWith("/admin") ||
              path.startsWith("/partner") ||
              path.startsWith("/customer");
            if (isProtected) {
              clearRoleCsrfToken();
              window.location.href = path.startsWith("/admin") ? "/admin" : "/sign-in";
            }
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
setupResponseInterceptor(authPublicApi);
setupResponseInterceptor(userPublicApi);

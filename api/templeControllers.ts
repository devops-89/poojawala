import { userPublicApi, userSecuredApi } from "./config";

export const getTemplesAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  isActive?: boolean,
  city?: string,
  state?: string
) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    if (search && search.trim()) params.append("search", search.trim());
    if (isActive !== undefined) params.append("isActive", String(isActive));
    if (city && city !== "All" && city !== "All Cities") params.append("city", city);
    if (state && state !== "All" && state !== "All States") params.append("state", state);

    const response = await userPublicApi.get("/temples/all", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resolveTempleId = (id: string | number): string | number => {
  if (!id) return id;
  const isNumeric = /^\d+$/.test(String(id).trim());
  if (isNumeric) return id;

  if (typeof window !== "undefined") {
    try {
      const lower = String(id).trim().toLowerCase();
      const cached =
        localStorage.getItem(`slug_to_id_${lower}`) ||
        sessionStorage.getItem(`slug_to_id_${lower}`) ||
        localStorage.getItem(`temple_slug_${lower}`) ||
        sessionStorage.getItem(`temple_slug_${lower}`) ||
        localStorage.getItem(`slug_to_id_${id}`) ||
        sessionStorage.getItem(`slug_to_id_${id}`) ||
        localStorage.getItem(`temple_slug_${id}`) ||
        sessionStorage.getItem(`temple_slug_${id}`) ||
        localStorage.getItem("last_temple_id") ||
        sessionStorage.getItem("last_temple_id");

      if (cached && /^\d+$/.test(cached)) {
        return cached;
      }
    } catch (e) {}
  }

  return id;
};

export const getTempleByIdAPI = async (id: string | number) => {
  try {
    const numericId = resolveTempleId(id);

    // STRICT SAFETY: NEVER call /temples/:id with non-numeric string to avoid 400 Validation Error
    if (!/^\d+$/.test(String(numericId).trim())) {
      console.warn(`[getTempleByIdAPI] Could not resolve numeric ID for slug: ${id}`);
      return {
        success: false,
        message: "Temple not found",
        data: null,
      };
    }

    const response = await userPublicApi.get(`/temples/${numericId}`);
    if (typeof window !== "undefined" && response?.data) {
      const data = response.data?.data || response.data;
      if (data?.id) {
        localStorage.setItem("last_temple_id", String(data.id));
        sessionStorage.setItem("last_temple_id", String(data.id));
        if (data.slug) {
          const s = String(data.slug).toLowerCase();
          localStorage.setItem(`slug_to_id_${s}`, String(data.id));
          sessionStorage.setItem(`slug_to_id_${s}`, String(data.id));
          localStorage.setItem(`temple_slug_${s}`, String(data.id));
          sessionStorage.setItem(`temple_slug_${s}`, String(data.id));
        }
      }
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTempleAPI = async (formData: FormData) => {
  try {
    const response = await userSecuredApi.post("/temples/add", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTempleAPI = async (id: string | number, formData: FormData | any) => {
  try {
    const numericId = resolveTempleId(id);
    const response = await userSecuredApi.patch(`/temples/${numericId}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTempleStatusAPI = async (id: string | number, isActive: boolean) => {
  try {
    const numericId = resolveTempleId(id);
    const response = await userSecuredApi.patch(`/temples/${numericId}`, { isActive });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTempleAPI = async (id: string | number) => {
  try {
    const numericId = resolveTempleId(id);
    const response = await userSecuredApi.delete(`/temples/${numericId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

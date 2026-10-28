import { userPublicApi, userSecuredApi } from "./config";
import { createSlug } from "@/utils/helpers";

const templeSlugToIdMap = new Map<string, string | number>();

export const registerTempleSlugMapping = (slug: string, id: string | number) => {
  if (!slug || !id) return;
  const lower = String(slug).trim().toLowerCase();
  const tid = String(id).trim();
  templeSlugToIdMap.set(lower, tid);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`slug_to_id_${lower}`, tid);
      sessionStorage.setItem(`slug_to_id_${lower}`, tid);
      localStorage.setItem(`temple_slug_${lower}`, tid);
      sessionStorage.setItem(`temple_slug_${lower}`, tid);
    } catch (e) {}
  }
};

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
    if (response?.data) {
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.data?.data)
        ? response.data.data.data
        : [];
      list.forEach((t: any) => {
        if (t?.id) {
          if (t?.slug) registerTempleSlugMapping(t.slug, t.id);
          if (t?.name) registerTempleSlugMapping(createSlug(t.name), t.id);
        }
      });
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resolveTempleId = (id: string | number): string | number => {
  if (!id) return id;
  const isNumeric = /^\d+$/.test(String(id).trim());
  if (isNumeric) return id;

  const lower = String(id).trim().toLowerCase();
  if (templeSlugToIdMap.has(lower)) {
    return templeSlugToIdMap.get(lower)!;
  }

  if (typeof window !== "undefined") {
    try {
      const cached =
        localStorage.getItem(`slug_to_id_${lower}`) ||
        sessionStorage.getItem(`slug_to_id_${lower}`) ||
        localStorage.getItem(`temple_slug_${lower}`) ||
        sessionStorage.getItem(`temple_slug_${lower}`) ||
        localStorage.getItem(`slug_to_id_${id}`) ||
        sessionStorage.getItem(`slug_to_id_${id}`) ||
        localStorage.getItem(`temple_slug_${id}`) ||
        sessionStorage.getItem(`temple_slug_${id}`);

      if (cached && /^\d+$/.test(cached)) {
        templeSlugToIdMap.set(lower, cached);
        return cached;
      }
    } catch (e) {}
  }

  return id;
};

export const getTempleByIdAPI = async (id: string | number) => {
  try {
    let numericId = resolveTempleId(id);

    // If non-numeric (slug), dynamically find the temple by slug from /temples/all API
    if (!/^\d+$/.test(String(numericId).trim())) {
      const targetSlug = String(id).trim().toLowerCase();
      try {
        const res = await userPublicApi.get("/temples/all", { params: { limit: 100, page: 1 } });
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.data?.data)
          ? res.data.data.data
          : [];

        list.forEach((t: any) => {
          if (t?.id) {
            if (t?.slug) registerTempleSlugMapping(t.slug, t.id);
            if (t?.name) registerTempleSlugMapping(createSlug(t.name), t.id);
          }
        });

        const match = list.find((t: any) =>
          String(t.slug || '').trim().toLowerCase() === targetSlug ||
          createSlug(t.name || '').trim().toLowerCase() === targetSlug ||
          String(t.id) === targetSlug
        );

        if (match?.id) {
          numericId = match.id;
          registerTempleSlugMapping(targetSlug, match.id);
        }
      } catch (err) {
        console.warn(`[getTempleByIdAPI] Failed searching temple by slug ${id}:`, err);
      }
    }

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
    if (response?.data) {
      let data = response.data?.data;
      while (data?.data && !data?.id) {
        data = data.data;
      }
      if (data?.id) {
        if (data.slug) {
          registerTempleSlugMapping(data.slug, data.id);
        }
        if (data.name) {
          registerTempleSlugMapping(createSlug(data.name), data.id);
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

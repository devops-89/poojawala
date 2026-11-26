import { formatServicePriceRange, normalizePoojaText, stripHtml } from "@/utils/helpers";

export const formatTempleTime = (timeStr?: string | null): string => {
  if (!timeStr) return "";
  const parts = String(timeStr).split(":");
  if (parts.length >= 2) {
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    if (isNaN(h)) return timeStr;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h < 10 ? "0" + h : h}:${m} ${ampm}`;
  }
  return timeStr;
};

export const parseTempleAartis = (aartisRaw: unknown): any[] => {
  let list: any[] = [];
  if (Array.isArray(aartisRaw)) {
    list = aartisRaw;
  } else if (typeof aartisRaw === "string") {
    try {
      const parsed = JSON.parse(aartisRaw);
      if (Array.isArray(parsed)) list = parsed;
    } catch {}
  }
  return list.filter((a: any) => a && !a.isDeleted && (a.name || a.time));
};

export const formatTempleLocation = (temple: any): string => {
  const address = (temple?.address || "").trim();
  const city = (temple?.city || "").trim();
  const state = (temple?.state || "").trim();

  if (!address) {
    return [city, state].filter(Boolean).join(", ");
  }

  const lowerAddr = address.toLowerCase();
  const parts = [address];
  if (city && !lowerAddr.includes(city.toLowerCase())) {
    parts.push(city);
  }
  if (state && !lowerAddr.includes(state.toLowerCase())) {
    parts.push(state);
  }
  return parts.filter(Boolean).join(", ");
};

export const formatTempleServiceList = (rawList: any[], temple: any) => {
  const filtered = rawList
    .filter((s: any) => s && s.isActive !== false)
    .map((s: any) => {
      const serviceImg =
        s.iconDownloadurl ||
        s.iconUrl ||
        s.imageUrl ||
        s.image ||
        temple?.downloadUrl ||
        temple?.imageUrl ||
        "/images/home/poojaPackages/satyanarayan.webp";

      return {
        id: s.id || s._id,
        title: normalizePoojaText(s.name || s.title || "Vedic Service"),
        image: serviceImg,
        description: normalizePoojaText(stripHtml(s.description || "")),
        price: formatServicePriceRange(s, ""),
        duration: "",
        category: normalizePoojaText(s.category?.name || "Temple Pooja"),
        isOnline: Boolean(s.isOnline),
        isOffline: Boolean(s.isOffline),
        slug: s.slug || null,
      };
    });

  if (typeof window !== "undefined" && filtered.length > 0) {
    filtered.forEach((s: any) => {
      if (s.id && s.slug) {
        const lower = String(s.slug).toLowerCase();
        localStorage.setItem(`slug_to_id_${lower}`, String(s.id));
        sessionStorage.setItem(`slug_to_id_${lower}`, String(s.id));
      }
    });
  }

  return filtered;
};

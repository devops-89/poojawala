export const formatKeyName = (key: string): string => {
  if (!key) return "";
  const formatMap: Record<string, string> = {
    kalashSthapana: "Kalash Sthapana",
    durgaSaptashatiPath: "Durga Saptashati Path",
    decorativeKalash: "Decorative Kalash",
    specialNaivedyam: "Special Naivedyam",
    additionalMantraChanting: "Additional Mantra Chanting",
    fruits: "Fruits",
    flowers: "Flowers",
    prasad: "Prasad",
    havan: "Havan",
    aarti: "Aarti",
    durgaPuja: "Durga Puja",
    abhishekam: "Abhishekam",
    pujaSamagri: "Puja Samagri",
    durationMinutes: "Duration",
    numberOfPurohits: "Number of Purohits",
  };
  if (formatMap[key]) return formatMap[key];
  if (key.includes(" ")) return key;
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const formatFeatureKey = (key: string, value: any): string | null => {
  const lowerKey = key.toLowerCase();
  if (
    lowerKey === "price" ||
    lowerKey === "tokenamount" ||
    lowerKey === "features" ||
    lowerKey.includes("payout")
  ) {
    return null;
  }
  if (value === false || value === "false" || value == null) return null;
  if (typeof value === "object") return null;

  if (typeof value === "boolean" || value === "true" || value === true) {
    const formatMap: Record<string, string> = {
      kalashSthapana: "Kalash Sthapana",
      durgaSaptashatiPath: "Durga Saptashati Path",
      decorativeKalash: "Decorative Kalash",
      specialNaivedyam: "Special Naivedyam",
      additionalMantraChanting: "Additional Mantra Chanting",
      fruits: "Fruits",
      flowers: "Flowers",
      prasad: "Prasad",
      havan: "Havan",
      aarti: "Aarti",
      durgaPuja: "Durga Puja",
      abhishekam: "Abhishekam",
      lakshmiPuja: "Lakshmi Puja",
      kumkumArchana: "Kumkum Archana",
      varalakshmiVratam: "Varalakshmi Vratam",
      ashtalakshmiArchana: "Ashtalakshmi Archana",
      vastuShanti: "Vastu Shanti",
      ganapatiPuja: "Ganapati Puja",
      navagrahaPuja: "Navagraha Puja",
      grihaPraveshAarti: "Griha Pravesh Aarti",
      vastuMantraChanting: "Vastu Mantra Chanting",
      specialPrasad: "Special Prasad",
      premiumFlowerArrangement: "Premium Flower Arrangement",
    };
    if (formatMap[key]) return formatMap[key];

    if (key.includes(" ")) {
      return key
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  const keyLabel = key.includes(" ")
    ? key
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();

  if (typeof value === "number") {
    if (key.toLowerCase().includes("duration")) return `${keyLabel}: ${value} Mins`;
    return `${keyLabel}: ${value}`;
  }

  return `${keyLabel}: ${value}`;
};

export const normalizeCity = (cityName: string): string => {
  if (!cityName) return "";
  let s = cityName.toLowerCase().trim();
  s = s.replace(/\b(urban|rural|district)\b/gi, "").trim();
  if (s.replace(/\bcity\b/gi, "").trim()) {
    s = s.replace(/\bcity\b/gi, "").trim();
  }
  if (s === "bangalore" || s === "bengaluru") return "bengaluru";
  if (s === "gurgaon" || s === "gurugram") return "gurugram";
  if (s === "delhi" || s === "new delhi") return "delhi";
  if (s === "bombay" || s === "mumbai") return "mumbai";
  if (s === "calcutta" || s === "kolkata") return "kolkata";
  if (s === "madras" || s === "chennai") return "chennai";
  if (s === "prayagraj" || s === "allahabad") return "prayagraj";
  if (s === "varanasi" || s === "banaras" || s === "kashi") return "varanasi";
  if (s === "mysore" || s === "mysuru") return "mysuru";
  if (s === "mangalore" || s === "mangaluru") return "mangaluru";
  if (s === "belgaum" || s === "belagavi") return "belagavi";
  if (s === "hubli" || s === "hubballi") return "hubballi";
  if (s === "pondicherry" || s === "puducherry") return "puducherry";
  if (s === "cochin" || s === "kochi") return "kochi";
  if (s === "trivandrum" || s === "thiruvananthapuram") return "thiruvananthapuram";
  if (s === "baroda" || s === "vadodara") return "vadodara";
  return s.replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
};

export const checkCityMatch = (addr: any, serviceCity: { name: string; state?: string }): boolean => {
  if (!serviceCity?.name) return false;
  const sNorm = normalizeCity(serviceCity.name);
  if (!sNorm) return false;

  if (addr?.city) {
    const aNorm = normalizeCity(addr.city);
    if (aNorm === sNorm) return true;
    if (aNorm.length >= 4 && sNorm.length >= 4) {
      if (aNorm.includes(sNorm) || sNorm.includes(aNorm)) return true;
    }
  }

  if (addr?.fullAddress && typeof addr.fullAddress === "string") {
    const fullLower = addr.fullAddress.toLowerCase();
    const rawLower = serviceCity.name.toLowerCase().trim();
    if (fullLower.includes(rawLower) || (sNorm.length >= 4 && fullLower.includes(sNorm))) {
      return true;
    }
  }

  return false;
};

export const parsePlanFeatures = (
  planKey: string,
  plan: any,
  service: any,
  showAddons: boolean,
  selectedFeatureIds: number[]
) => {
  const isOnlineService = Boolean(service?.isOnline && !service?.isOffline);
  const planTitle = isOnlineService
    ? "Online Pooja Package"
    : planKey === "basic"
      ? "Basic Plan"
      : "Standard Plan";

  const rawFeatures =
    plan?.features ||
    (service?.serviceFeatures
      ? service.serviceFeatures.filter(
          (sf: any) => sf.plan === planKey.toUpperCase()
        )
      : null);

  const normalFeatures: string[] = [];
  const priceFeatures: Array<{ id: number; title: string; price: number; plan: string }> = [];

  if (Array.isArray(rawFeatures)) {
    rawFeatures.forEach((f: any, idx: number) => {
      if (f && f.isActive !== false) {
        const title = formatKeyName(f.title || f.name || f.key || "");
        if (f.type === "PRICE") {
          const matchedSf = service?.serviceFeatures?.find(
            (sf: any) =>
              sf.id === f.id ||
              (sf.plan === planKey.toUpperCase() &&
                (sf.title || "").trim().toLowerCase() ===
                  (f.title || f.name || "").trim().toLowerCase())
          );
          const resolvedId =
            f.id != null
              ? Number(f.id)
              : matchedSf?.id != null
                ? Number(matchedSf.id)
                : idx + 1;
          priceFeatures.push({
            id: resolvedId,
            title: title || f.title || "Add-on",
            price: Number(f.value || f.price || 0),
            plan: planKey,
          });
        } else if (title) {
          normalFeatures.push(title);
        }
      }
    });
  } else if (plan?.features && typeof plan.features === "object") {
    const targetObj = plan.features;
    Object.entries(targetObj).forEach(([k, v]) => {
      const formatted = formatFeatureKey(k, v);
      if (formatted) normalFeatures.push(formatted);
    });
  }

  const planAddonTotal = showAddons
    ? priceFeatures
        .filter((pf) => selectedFeatureIds.includes(pf.id))
        .reduce((sum, pf) => sum + Number(pf.price || 0), 0)
    : 0;

  const totalCardPrice = Number(plan?.price || 0) + planAddonTotal;

  return {
    isOnlineService,
    planTitle,
    normalFeatures,
    priceFeatures,
    planAddonTotal,
    totalCardPrice,
  };
};

export const ALL_INDIAN_LANGUAGES = [
  "Hindi",
  "English",
  "Sanskrit",
  "Assamese",
  "Awadhi",
  "Bengali",
  "Bhojpuri",
  "Bodo",
  "Braj Bhasha",
  "Bundeli",
  "Chhattisgarhi",
  "Dogri",
  "Garhwali",
  "Gujarati",
  "Haryanvi",
  "Kannada",
  "Kashmiri",
  "Kodava",
  "Konkani",
  "Kumaoni",
  "Magahi",
  "Maithili",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Marwari",
  "Nepali",
  "Odia",
  "Punjabi",
  "Rajasthani",
  "Sambalpuri",
  "Santhali",
  "Sindhi",
  "Tamil",
  "Telugu",
  "Tulu",
  "Urdu",
];

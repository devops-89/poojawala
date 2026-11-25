import moment from "moment";
import React from "react";

export const createSlug = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Normalizes any text (especially from API / DB responses) so that
 * 'puja' / 'pujas' are standardized to 'pooja' / 'poojas' while preserving casing.
 */
export const normalizePoojaText = (text: string): string => {
  if (!text || typeof text !== "string") return text || "";
  return text.replace(/\bpujas?(['’]s)?\b/gi, (match) => {
    const hasApostrophe = /['’]s$/i.test(match);
    const cleanWord = hasApostrophe ? match.slice(0, -2) : match;
    const isPlural = cleanWord.toLowerCase().endsWith("s");
    let result = "";
    if (cleanWord === cleanWord.toUpperCase()) {
      result = isPlural ? "POOJAS" : "POOJA";
    } else if (cleanWord[0] === cleanWord[0].toUpperCase()) {
      result = isPlural ? "Poojas" : "Pooja";
    } else {
      result = isPlural ? "poojas" : "pooja";
    }
    return hasApostrophe ? `${result}'s` : result;
  });
};

export const extractBackendErrorMessage = (
  error: any,
  fallback = "Something went wrong",
): string => {
  if (!error) return fallback;
  const data = error.response?.data;
  if (data) {
    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message.join(", ");
    }
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
    if (typeof data === "string" && data.trim()) {
      return data;
    }
  }
  if (error.message && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
};

export const allowOnlyLettersOnKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Home",
      "End",
    ].includes(e.key)
  ) {
    return;
  }
  if (!/^[a-zA-Z\s.-]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeLettersOnly = (val: string): string => {
  return (val || "").replace(/[^a-zA-Z\s.-]/g, "");
};

/**
 * Strict Email validation regex and helpers:
 * Strictly allows letters, digits, and special characters only '.' and '@'
 */
export const EMAIL_STRICT_REGEX =
  /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
export const EMAIL_STRICT_MESSAGE =
  "Invalid email format. Only letters, numbers, '.' and '@' are allowed";

export const allowOnlyEmailCharsOnKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Home",
      "End",
    ].includes(e.key)
  ) {
    return;
  }
  // Disallow any character other than alphanumeric, '.' or '@'
  if (!/^[a-zA-Z0-9.@]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeEmailInput = (val: string): string => {
  return (val || "").replace(/[^a-zA-Z0-9.@]/g, "");
};

/**
 * Strict Address validation regex and helpers:
 * Strictly allows letters, digits, whitespace, and standard address punctuation (,, ., -, /, #, ', :, (, ), &)
 */
export const ADDRESS_STRICT_REGEX = /^[\p{L}\p{N}\s,.\-/#':()&]+$/u;
export const ADDRESS_STRICT_MESSAGE =
  "Address can only contain letters, numbers, spaces, and standard punctuation (, . - / # ' : () &)";

export const allowOnlyAddressCharsOnKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Home",
      "End",
    ].includes(e.key)
  ) {
    return;
  }
  // Allow alphanumeric, whitespace, and standard address characters
  if (!/^[\p{L}\p{N}\s,.\-/#':()&]$/u.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeAddressInput = (val: string): string => {
  return (val || "").replace(/[^\p{L}\p{N}\s,.-/#':()&]/gu, "");
};

/**
 * Strict Indian Pincode validation:
 * 6 digits starting with 1-9 (never 0)
 */
export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
export const PINCODE_MESSAGE =
  "Please enter a valid 6-digit Indian Pincode starting with 1-9 (e.g. 110001)";

export const VALID_INDIAN_PINCODE_PREFIXES = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "20", "21", "22", "23", "24", "25", "26", "27", "28",
  "30", "31", "32", "33", "34", "36", "37", "38", "39",
  "40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
  "50", "51", "52", "53", "56", "57", "58", "59",
  "60", "61", "62", "63", "64", "67", "68", "69",
  "70", "71", "72", "73", "74", "75", "76", "77", "78", "79",
  "80", "81", "82", "83", "84", "85",
]);

export const isValidIndianPincodeFormat = (val: string): boolean => {
  const pin = (val || "").trim();
  if (!PINCODE_REGEX.test(pin)) return false;
  return VALID_INDIAN_PINCODE_PREFIXES.has(pin.slice(0, 2));
};

export const sanitizePincodeInput = (val: string): string => {
  return (val || "").replace(/\D/g, "").slice(0, 6);
};

/**
 * Strict Address Label validation (e.g., Home, Office, Temple, Flat 4B):
 * Allows letters, numbers, spaces, and simple punctuation (- ' . ( ) /)
 * Disallows quotes, colons, braces, angle brackets, and complex symbols.
 */
export const ADDRESS_LABEL_REGEX = /^[\p{L}\p{N}\s\-'.()\/]{2,50}$/u;
export const ADDRESS_LABEL_MESSAGE =
  "Address label can only contain letters, numbers, spaces, and simple punctuation (- ' . ( ) /)";

export const allowOnlyAddressLabelCharsOnKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Home",
      "End",
    ].includes(e.key)
  ) {
    return;
  }
  if (!/^[\p{L}\p{N}\s\-'.()\/]$/u.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeAddressLabelInput = (val: string): string => {
  return (val || "").replace(/[^\p{L}\p{N}\s\-'.()\/]/gu, "").slice(0, 50);
};

export const isValidAddressLabel = (val: string): boolean => {
  const trimmed = (val || "").trim();
  return (
    trimmed.length >= 2 &&
    ADDRESS_LABEL_REGEX.test(trimmed) &&
    /[\p{L}\p{N}]/u.test(trimmed)
  );
};

/**
 * Strict City/State validation:
 * Allows letters, spaces, and basic name punctuation (. - ')
 * Disallows numbers, quotes, colons, braces, symbols
 */
export const CITY_STATE_REGEX = /^[\p{L}\s.'-]{2,60}$/u;
export const CITY_MESSAGE =
  "City can only contain letters and spaces (min 2 characters)";
export const STATE_MESSAGE =
  "State can only contain letters and spaces (min 2 characters)";

export const isValidCityOrState = (val: string): boolean => {
  const trimmed = (val || "").trim();
  return (
    trimmed.length >= 2 &&
    CITY_STATE_REGEX.test(trimmed) &&
    /[\p{L}].*[\p{L}]/u.test(trimmed)
  );
};

export const isValidAddress = (val: string): boolean => {
  const trimmed = (val || "").trim();
  return (
    trimmed.length >= 3 &&
    ADDRESS_STRICT_REGEX.test(trimmed) &&
    /[\p{L}\p{N}]/u.test(trimmed)
  );
};

export interface AddressValidationErrors {
  pincode?: string;
  addressLabel?: string;
  fullAddress?: string;
  streetName?: string;
  city?: string;
  state?: string;
}

export const validateAddressPayload = (data: {
  pincode?: string;
  addressLabel?: string;
  fullAddress?: string;
  streetName?: string;
  city?: string;
  state?: string;
}): { isValid: boolean; errors: AddressValidationErrors; firstError?: string } => {
  const errors: AddressValidationErrors = {};
  const pin = (data.pincode || "").trim();
  const label = (data.addressLabel || "").trim();
  const full = (data.fullAddress || "").trim();
  const street = (data.streetName || "").trim();
  const city = (data.city || "").trim();
  const state = (data.state || "").trim();

  // Pincode validation
  if (!pin) {
    errors.pincode = "Pincode is required";
  } else if (!isValidIndianPincodeFormat(pin)) {
    errors.pincode = PINCODE_MESSAGE;
  }

  // Address Label validation
  if (!label) {
    errors.addressLabel = "Address label is required";
  } else if (!isValidAddressLabel(label)) {
    errors.addressLabel = ADDRESS_LABEL_MESSAGE;
  }

  // Full Address validation
  if (!full) {
    errors.fullAddress = "Full address is required";
  } else if (!isValidAddress(full)) {
    errors.fullAddress = ADDRESS_STRICT_MESSAGE;
  }

  // Street Name validation (if provided)
  if (street) {
    if (!ADDRESS_STRICT_REGEX.test(street) || !/[\p{L}\p{N}]/u.test(street)) {
      errors.streetName =
        "Street Name / Area can only contain letters, numbers, spaces, and standard punctuation (, . - / # ' : () &)";
    }
  }

  // City validation
  if (!city) {
    errors.city = "City is required";
  } else if (!isValidCityOrState(city)) {
    errors.city = CITY_MESSAGE;
  }

  // State validation
  if (!state) {
    errors.state = "State is required";
  } else if (!isValidCityOrState(state)) {
    errors.state = STATE_MESSAGE;
  }

  const firstError = Object.values(errors)[0];
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError,
  };
};

/**
 * Strict Title/Name validation regex and helpers:
 * Allows letters, numbers, spaces, and standard punctuation (, . - & ' : () /)
 * Disallows symbols like @ # $ % ^ * < > { } [ ] _ = + | ~ `
 */
export const TITLE_STRICT_REGEX = /^[a-zA-Z0-9\s,&.\-':()\/]+$/;
export const TITLE_STRICT_MESSAGE =
  "Title can only contain letters, numbers, spaces, and standard punctuation (, . - & ' : () /)";

export const allowOnlyTitleCharsOnKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Home",
      "End",
    ].includes(e.key)
  ) {
    return;
  }
  if (!/^[a-zA-Z0-9\s,&.\-':()\/]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeTitleInput = (val: string): string => {
  return (val || "").replace(/[^a-zA-Z0-9\s,&.\-':()\/]/g, "");
};

/**
 * Strict Description validation regex and helpers:
 * Allows letters, numbers, spaces, newlines, and standard text punctuation (., ! ? ' " : ; () & / % -)
 * Disallows symbols like @ # $ ^ * < > { } [ ] _ = + | ~ `
 */
export const DESCRIPTION_STRICT_REGEX = /^[^<>]+$/;
export const DESCRIPTION_STRICT_MESSAGE =
  "Description cannot contain < or > characters";

export const allowOnlyDescriptionCharsOnKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
      "Home",
      "End",
    ].includes(e.key)
  ) {
    return;
  }
  if (e.key === "<" || e.key === ">") {
    e.preventDefault();
  }
};

export const sanitizeDescriptionInput = (val: string): string => {
  return (val || "").replace(/[<>]/g, "");
};

export interface BankFormValues {
  paymentMethod: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
}

export const validateBankForm = (bankForm: BankFormValues): string | null => {
  if (bankForm.paymentMethod === "UPI") {
    if (!bankForm.upiId || !bankForm.upiId.trim()) {
      return "UPI ID is required";
    }
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(bankForm.upiId.trim())) {
      return "Please enter a valid UPI ID (e.g. 9876543210@ybl or user@upi)";
    }
  } else {
    if (!bankForm.accountHolderName || !bankForm.accountHolderName.trim()) {
      return "Account Holder Name is required";
    }
    if (!/^[a-zA-Z\s.-]+$/.test(bankForm.accountHolderName.trim())) {
      return "Account Holder Name cannot contain numbers or special characters";
    }
    if (!bankForm.bankName || !bankForm.bankName.trim()) {
      return "Bank Name is required";
    }
    if (!/^[a-zA-Z\s.-]+$/.test(bankForm.bankName.trim())) {
      return "Bank Name cannot contain numbers or special characters";
    }
    if (!bankForm.accountNumber || !bankForm.accountNumber.trim()) {
      return "Account Number is required";
    }
    if (!/^[0-9]{9,18}$/.test(bankForm.accountNumber.trim())) {
      return "Account Number must be between 9 and 18 digits (numbers only)";
    }
    if (!bankForm.ifscCode || !bankForm.ifscCode.trim()) {
      return "IFSC Code is required";
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(bankForm.ifscCode.trim().toUpperCase())) {
      return "Please enter a valid 11-character IFSC Code (e.g. SBIN0001234)";
    }
  }
  return null;
};

export const formatPhoneNumber = (
  phone?: string,
  countryCode?: string,
): string => {
  if (!phone) return "N/A";
  const p = phone.trim();
  if (!countryCode) {
    return p.startsWith("+") ? p : `+91 ${p}`;
  }
  const cleanCc = countryCode.trim();
  const formattedCc = cleanCc.startsWith("+") ? cleanCc : `+${cleanCc}`;
  if (p.startsWith(formattedCc) || p.startsWith(cleanCc)) {
    return p.startsWith("+") ? p : `+${p}`;
  }
  return `${formattedCc} ${p}`;
};

export const stripHtml = (html?: string | null): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

export const formatServicePriceRange = (service: any, prefix = "₹"): string => {
  if (!service) return `${prefix}0`;

  const isOnline = Boolean(
    service.isOnline === true ||
    String(service.isOnline).toLowerCase() === "true" ||
    service.isOnline === 1 ||
    String(service.isOnline) === "1",
  );

  let basicPrice: number | null = null;
  let standardPrice: number | null = null;

  if (service.plans && typeof service.plans === "object") {
    const b = service.plans.basic?.price;
    if (b != null && !isNaN(Number(b)) && Number(b) > 0) {
      basicPrice = Number(b);
    }
    const s = service.plans.standard?.price;
    if (s != null && !isNaN(Number(s)) && Number(s) > 0) {
      standardPrice = Number(s);
    }
  }

  if (basicPrice == null) {
    const rawMin =
      service.priceWithoutSamagri ??
      service.minPrice ??
      service.price ??
      service.basePrice;
    if (rawMin != null && !isNaN(Number(rawMin)) && Number(rawMin) > 0) {
      basicPrice = Number(rawMin);
    }
  }

  if (standardPrice == null && !isOnline) {
    const rawMax = service.priceWithSamagri ?? service.maxPrice;
    if (rawMax != null && !isNaN(Number(rawMax)) && Number(rawMax) > 0) {
      standardPrice = Number(rawMax);
    }
  }

  // Online services always have a single price
  if (isOnline) {
    const single = basicPrice || standardPrice;
    return single ? `${prefix}${single.toLocaleString("en-IN")}` : `${prefix}0`;
  }

  // Offline services display range only if standard plan is higher than basic
  if (
    basicPrice != null &&
    standardPrice != null &&
    standardPrice > basicPrice
  ) {
    return `${prefix}${basicPrice.toLocaleString("en-IN")} - ${prefix}${standardPrice.toLocaleString("en-IN")}`;
  }

  if (basicPrice != null) {
    return `${prefix}${basicPrice.toLocaleString("en-IN")}`;
  }

  if (standardPrice != null) {
    return `${prefix}${standardPrice.toLocaleString("en-IN")}`;
  }

  return `${prefix}0`;
};
  

export const sanitizeAdminSearchTerm = (term?: string | null): string => {
  if (!term) return "";
  const trimmed = String(term).trim();
  const knownPrefixMatch = trimmed.match(
    /^[#\s]*(?:b|pay|ast|p|ord|comp|c|usr|u|tmp|t|srv|s|rev)[-_\s]*(\d+)$/i
  );
  if (knownPrefixMatch) {
    return knownPrefixMatch[1];
  }
  const genericHyphenMatch = trimmed.match(/^[#\s]*[a-zA-Z]{1,4}[-_]+(\d+)$/);
  if (genericHyphenMatch) {
    return genericHyphenMatch[1];
  }
  return trimmed;
};

/**
 * Check if the currently logged-in user is a CUSTOMER
 */
export const isCustomerLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    const role = String(
      user?.role ||
        sessionStorage.getItem("role") ||
        sessionStorage.getItem("activeRole") ||
        ""
    ).toUpperCase();
    return role === "CUSTOMER";
  } catch (e) {
    return false;
  }
};

/**
 * Return appropriate destination URL for a service based on whether customer is logged in.
 * - Logged-in Customer: /customer/services/[slug]
 * - Unauthenticated / Public: /services/[slug]
 */
export const getServiceNavigationUrl = (slugOrId: string | number): string => {
  if (!slugOrId) return "/services";
  const isCust = isCustomerLoggedIn();
  return isCust ? `/customer/services/${slugOrId}` : `/services/${slugOrId}`;
};


/**
 * Format scheduledAt ISO string (e.g. 2026-11-14T09:00:00.000Z).
 * When time is present in ISO string, parse as UTC so that the user's selected time (09:00)
 * is preserved without unwanted timezone offsets (e.g. +5:30 turning 9:00 AM into 2:30 PM).
 */
export const formatScheduledDateTime = (
  dateVal: any,
  format = "DD MMM YYYY, hh:mm A"
): string => {
  if (!dateVal) return "N/A";
  try {
    const str = String(dateVal).trim();
    if (!str) return "N/A";
    const m = str.includes("T") ? moment.utc(str) : moment(str);
    if (m.isValid()) {
      return m.format(format);
    }
  } catch (e) {}
  return String(dateVal);
};

export const formatScheduledDate = (
  dateVal: any,
  format = "DD MMM YYYY"
): string => {
  if (!dateVal) return "N/A";
  try {
    const str = String(dateVal).trim();
    if (!str) return "N/A";
    const m = str.includes("T") ? moment.utc(str) : moment(str);
    if (m.isValid()) {
      return m.format(format);
    }
  } catch (e) {}
  return String(dateVal);
};

export const formatScheduledTime = (
  dateVal: any,
  format = "hh:mm A"
): string => {
  if (!dateVal) return "N/A";
  try {
    const str = String(dateVal).trim();
    if (!str) return "N/A";
    const m = str.includes("T") ? moment.utc(str) : moment(str);
    if (m.isValid()) {
      return m.format(format);
    }
  } catch (e) {}
  return String(dateVal);
};

export const getProductInitials = (name: string): string => {
  if (!name || typeof name !== "string") return "P";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return (words[0] ? words[0].slice(0, 1) : "P").toUpperCase();
};

export const getProductFallbackImage = (titleOrCategory: string = ""): string => {
  const text = (titleOrCategory || "").toLowerCase();
  if (
    text.includes("diya") ||
    text.includes("lamp") ||
    text.includes("batti") ||
    text.includes("deepak") ||
    text.includes("clay")
  ) {
    return "/images/festivals/diwali.webp";
  }
  if (
    text.includes("havan") ||
    text.includes("samagri") ||
    text.includes("dhoop") ||
    text.includes("camphor") ||
    text.includes("kapoor") ||
    text.includes("agarbatti") ||
    text.includes("incense") ||
    text.includes("loban") ||
    text.includes("chandan") ||
    text.includes("roli") ||
    text.includes("sindoor")
  ) {
    return "/images/home/poojaPackages/havan.webp";
  }
  if (
    text.includes("thali") ||
    text.includes("plate") ||
    text.includes("kalash") ||
    text.includes("brass") ||
    text.includes("bell") ||
    text.includes("ghanti") ||
    text.includes("lota")
  ) {
    return "/images/home/thali.webp";
  }
  if (text.includes("ganesh") || text.includes("ganpati")) {
    return "/images/home/poojaPackages/ganesh.webp";
  }
  if (text.includes("laxmi") || text.includes("lakshmi")) {
    return "/images/home/poojaPackages/laxmi.webp";
  }
  return "/images/productsHero.webp";
};

export const extractProductImage = (p: any): string => {
  if (!p) return "";

  let candidate =
    p.imageUrl ||
    p.imageDownloadUrl ||
    p.imageDownloadurl ||
    p.bannerDownloadUrl ||
    p.bannerDownloadurl ||
    p.bannerUrl ||
    p.banner ||
    p.image ||
    p.thumbnail ||
    p.iconUrl ||
    p.iconDownloadurl ||
    p.iconDownloadUrl ||
    "";

  if (Array.isArray(candidate) && candidate.length > 0) {
    const first = candidate[0];
    candidate = typeof first === "string" ? first : first?.url || first?.downloadUrl || "";
  }

  if (!candidate && Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0];
    candidate = typeof first === "string" ? first : first?.url || first?.downloadUrl || first?.imageUrl || "";
  }

  if (
    typeof candidate !== "string" ||
    !candidate.trim() ||
    candidate === "null" ||
    candidate === "undefined"
  ) {
    return "";
  }

  candidate = candidate.trim();

  // If candidate is a dead ephemeral ngrok tunnel, return empty so initials placeholder shows
  if (
    candidate.includes("ngrok-free.dev") ||
    candidate.includes("localhost:3000") ||
    candidate.includes("localhost:5000")
  ) {
    return "";
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://1pooja.com/api";
  const serverHost = apiBase.replace(/\/api\/?$/, "");

  if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
    return candidate;
  }

  if (candidate.startsWith("/")) {
    if (candidate.startsWith("/images/")) {
      return candidate;
    }
    return `${serverHost}${candidate}`;
  }

  return `${serverHost}/${candidate}`;
};

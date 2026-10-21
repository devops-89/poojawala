"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { customerCreateBookingAPI } from "@/api/bookingControllers";
import { getCustomerAddressesAPI } from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddAddressModal from "@/components/widgets/AddAddressModal";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const formatKeyName = (key: string) => {
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

interface Props {
  serviceId: number;
  service?: any;
}

const formatFeatureKey = (key: string, value: any): string | null => {
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

  // If value is a number: Show Key first, then Value
  if (typeof value === "number") {
    if (key.toLowerCase().includes("duration")) return `${keyLabel}: ${value} Mins`;
    return `${keyLabel}: ${value}`;
  }

  return `${keyLabel}: ${value}`;
};

const normalizeCity = (cityName: string): string => {
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

const checkCityMatch = (addr: any, serviceCity: { name: string; state?: string }): boolean => {
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

export default function ServiceDetailsBookingForm({ serviceId, service }: Props) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile, fetchProfile } = useUserStore();

  const todayStr = new Date().toISOString().split("T")[0];

  const plans = service?.plans;
  const [selectedPlan, setSelectedPlan] = useState<string>("basic");
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<number[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const toggleFeatureId = (id: number, planKey: string) => {
    if (selectedPlan !== planKey) {
      setSelectedPlan(planKey);
      setSelectedFeatureIds([id]);
    } else {
      setSelectedFeatureIds((prev) =>
        prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
      );
    }
  };

  const handleSelectPlan = (planKey: string) => {
    if (selectedPlan !== planKey) {
      setSelectedPlan(planKey);
      setSelectedFeatureIds([]);
    }
  };

  const handleAddressAdded = async (newAddrResponse?: any) => {
    let addrList: any[] = [];
    try {
      const res = await getCustomerAddressesAPI();
      if (res?.data?.data && Array.isArray(res.data.data)) addrList = res.data.data;
      else if (res?.data && Array.isArray(res.data)) addrList = res.data;
      else if (Array.isArray(res)) addrList = res;
    } catch (e) {
      console.error("Failed to fetch customer addresses after add:", e);
    }

    if (addrList.length === 0) {
      await fetchProfile(true);
      const userObj = profile?.data || profile;
      if (userObj?.addresses && Array.isArray(userObj.addresses)) {
        addrList = userObj.addresses;
      }
    }

    setAddresses(addrList);

    const createdId = newAddrResponse?.id || newAddrResponse?.data?.id;
    if (createdId) {
      setSelectedAddressId(createdId);
    } else if (addrList.length > 0) {
      const sorted = [...addrList].sort((a: any, b: any) => (Number(b.id) || 0) - (Number(a.id) || 0));
      if (sorted[0]?.id) {
        setSelectedAddressId(sorted[0].id);
      }
    }
  };

  const serviceCities = useMemo(() => {
    const raw = service?.cities;
    if (!raw) return [];
    let list = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [];
      }
    }
    if (!Array.isArray(list)) return [];
    return list
      .map((c: any) => {
        if (typeof c === "string") return { name: c.trim(), state: "" };
        return {
          name: (c?.name || c?.city || c?.cityName || "").trim(),
          state: (c?.state || "").trim(),
        };
      })
      .filter((c) => Boolean(c.name));
  }, [service?.cities]);

  const serviceCityNamesText = useMemo(() => {
    if (!serviceCities || serviceCities.length === 0) return "";
    return serviceCities.map((c) => c.name).join(", ");
  }, [serviceCities]);

  const selectedAddress = useMemo(() => {
    if (!addresses || addresses.length === 0) return null;
    if (selectedAddressId) {
      const found = addresses.find((a: any) => String(a.id) === String(selectedAddressId));
      if (found) return found;
    }
    return (
      addresses.find(
        (a: any) =>
          a.isDefault === true ||
          String(a.isDefault).toLowerCase() === "true" ||
          a.isdefault === true ||
          a.is_default === true
      ) ||
      addresses[0] ||
      null
    );
  }, [addresses, selectedAddressId]);

  const isGlobal =
    service?.isGlobal === true ||
    !serviceCities ||
    serviceCities.length === 0;

  const isAddressCityCoveredForOffline = useMemo(() => {
    // If no specific cities listed or isGlobal is true, service is globally available everywhere
    if (isGlobal) return true;
    if (!service?.isOffline) return false;
    // If user has not selected an address or has no address yet, default to true so OFFLINE is default
    if (!selectedAddress) return true;
    // Check if the selected address matches any of the service cities
    return serviceCities.some((sc) => checkCityMatch(selectedAddress, sc));
  }, [isGlobal, service?.isOffline, serviceCities, selectedAddress]);

  const isOnlineAllowed = isGlobal || service?.isOnline !== false;
  const isOfflineAllowed =
    isGlobal || (service?.isOffline === true && isAddressCityCoveredForOffline);
  const isBothAllowed = isOnlineAllowed && isOfflineAllowed;
  const isSingleMode = !isBothAllowed;

  const [bookingForm, setBookingForm] = useState({
    scheduledDate: "",
    scheduledTime: "",
    bookingMode: "OFFLINE",
    paymentOption: "TOKEN",
    language: "Hindi",
    specialInstructions: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const activeBookingMode = useMemo(() => {
    if (isSingleMode) {
      if (isOfflineAllowed && !isOnlineAllowed) return "OFFLINE";
      if (isOnlineAllowed && !isOfflineAllowed) return "ONLINE";
      return isOfflineAllowed ? "OFFLINE" : "ONLINE";
    }
    return bookingForm.bookingMode === "ONLINE" ? "ONLINE" : "OFFLINE";
  }, [isSingleMode, isOfflineAllowed, isOnlineAllowed, bookingForm.bookingMode]);

  const showAddons = activeBookingMode === "OFFLINE";

  // When online mode is active, clear any selected add-ons
  useEffect(() => {
    if (!showAddons && selectedFeatureIds.length > 0) {
      setSelectedFeatureIds([]);
    }
  }, [showAddons, selectedFeatureIds.length]);

  // Sync booking mode whenever allowed modes or address selection changes
  useEffect(() => {
    if (!isOfflineAllowed && isOnlineAllowed) {
      setBookingForm((prev) =>
        prev.bookingMode !== "ONLINE" ? { ...prev, bookingMode: "ONLINE" } : prev
      );
    } else if (isOfflineAllowed && !isOnlineAllowed) {
      setBookingForm((prev) =>
        prev.bookingMode !== "OFFLINE" ? { ...prev, bookingMode: "OFFLINE" } : prev
      );
    }
  }, [isOfflineAllowed, isOnlineAllowed]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Check for return from payment redirect (sessionStorage flag or payment params)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const pendingBooking = sessionStorage.getItem("booking_payment_pending");
      const hasPaymentParams =
        urlParams.get("razorpay_payment_id") ||
        urlParams.get("razorpay_payment_link_status") ||
        urlParams.get("payment_id");

      if (pendingBooking || hasPaymentParams) {
        sessionStorage.removeItem("booking_payment_pending");
        showSnackbar("Booking request created successfully!", "success");

        if (hasPaymentParams) {
          const url = new URL(window.location.href);
          url.searchParams.delete("razorpay_payment_id");
          url.searchParams.delete("razorpay_payment_link_id");
          url.searchParams.delete("razorpay_payment_link_reference_id");
          url.searchParams.delete("razorpay_payment_link_status");
          url.searchParams.delete("razorpay_signature");
          url.searchParams.delete("payment_id");
          window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
        }
      }
    }
  }, [showSnackbar]);

  // Generate time options between 8:00 AM and 8:00 PM (08:00 to 20:00)
  const timeOptions = useMemo(() => {
    const options: { value: string; label: string; disabled: boolean }[] = [];
    const isToday = bookingForm.scheduledDate === todayStr;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // From 08:00 (8:00 AM) to 20:00 (8:00 PM) in 30-min intervals
    for (let h = 8; h <= 20; h++) {
      for (const m of [0, 30]) {
        if (h === 20 && m === 30) continue; // 20:00 (8:00 PM) is the last option

        const timeVal = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const period = h >= 12 ? "PM" : "AM";
        const label = `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;

        // Disable past slots if scheduled date is today
        const isPast =
          isToday && (h < currentHour || (h === currentHour && m <= currentMinute));

        options.push({ value: timeVal, label, disabled: isPast });
      }
    }
    return options;
  }, [bookingForm.scheduledDate, todayStr]);

  const isAllSlotsPassedToday = useMemo(() => {
    if (bookingForm.scheduledDate !== todayStr) return false;
    return timeOptions.length > 0 && timeOptions.every((opt) => opt.disabled);
  }, [bookingForm.scheduledDate, todayStr, timeOptions]);

  // Reset selected time if it becomes disabled on date change
  useEffect(() => {
    if (bookingForm.scheduledTime) {
      const selectedOpt = timeOptions.find((o) => o.value === bookingForm.scheduledTime);
      if (selectedOpt && selectedOpt.disabled) {
        setBookingForm((prev) => ({ ...prev, scheduledTime: "" }));
      }
    }
  }, [timeOptions, bookingForm.scheduledTime]);

  useEffect(() => {
    const loadAddresses = async () => {
      let addrList: any[] = [];
      try {
        const res = await getCustomerAddressesAPI();
        if (res?.data?.data && Array.isArray(res.data.data)) addrList = res.data.data;
        else if (res?.data && Array.isArray(res.data)) addrList = res.data;
        else if (Array.isArray(res)) addrList = res;
      } catch (e) {
        console.error("Failed to fetch customer addresses:", e);
      }

      if (addrList.length === 0) {
        const userObj = profile?.data || profile;
        if (userObj?.addresses && Array.isArray(userObj.addresses)) {
          addrList = userObj.addresses;
        }
      }

      setAddresses(addrList);
      if (addrList.length > 0) {
        const defaultAddr =
          addrList.find(
            (a: any) =>
              a.isDefault === true ||
              String(a.isDefault).toLowerCase() === "true" ||
              a.isdefault === true ||
              a.is_default === true
          ) || addrList[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      }
    };
    loadAddresses();
  }, [profile]);

  const handleInputChange = (field: string, value: any) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingForm.scheduledDate || !bookingForm.scheduledTime) {
      showSnackbar("Please select both scheduled date and time", "error");
      return;
    }

    const [hStr, mStr] = bookingForm.scheduledTime.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || h < 8 || h > 20 || (h === 20 && m > 0)) {
      showSnackbar("Please select a time between 08:00 AM and 08:00 PM", "error");
      return;
    }

    let customerAddressId = selectedAddressId ? Number(selectedAddressId) : null;

    if (activeBookingMode === "OFFLINE") {
      if (!customerAddressId) {
        showSnackbar(
          "No address found. Please add an address in your profile first.",
          "error"
        );
        return;
      }
      if (!isGlobal && !isAddressCityCoveredForOffline) {
        showSnackbar(
          `Offline service is only available in: ${serviceCityNamesText}. Please select a supported address or book Online.`,
          "error"
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const timeFormatted =
        bookingForm.scheduledTime.length === 5
          ? `${bookingForm.scheduledTime}:00`
          : bookingForm.scheduledTime;
      const scheduledAtIso = `${bookingForm.scheduledDate}T${timeFormatted}.000Z`;

      const finalFeatureIds = showAddons
        ? selectedFeatureIds.map((id) => Number(id)).filter((id) => !isNaN(id))
        : [];

      const payload: any = {
        serviceId: Number(serviceId),
        bookingMode: activeBookingMode,
        scheduledAt: scheduledAtIso,
        plan: selectedPlan ? selectedPlan.toUpperCase() : "BASIC",
        paymentOption: bookingForm.paymentOption || "TOKEN",
        featureIds: finalFeatureIds,
        specialInstructions: bookingForm.specialInstructions || "",
        customFields: {
          language: bookingForm.language || "Hindi",
          ...(profile?.gotra ? { gotra: profile.gotra } : {}),
        },
      };

      if (customerAddressId) {
        payload.customerAddressId = Number(customerAddressId);
      }

      if (selectedAddress) {
        payload.address = {
          venueType: selectedAddress.venueType || selectedAddress.addressType || "HOME",
          addressLabel: selectedAddress.addressLabel || selectedAddress.label || "Home",
          fullAddress:
            selectedAddress.fullAddress ||
            [selectedAddress.addressLine1 || selectedAddress.street, selectedAddress.city, selectedAddress.state, selectedAddress.pincode || selectedAddress.postalCode]
              .filter(Boolean)
              .join(", "),
          city: selectedAddress.city || "",
          state: selectedAddress.state || "",
          pincode: String(selectedAddress.pincode || selectedAddress.postalCode || ""),
          latitude: selectedAddress.latitude != null ? Number(selectedAddress.latitude) : 0,
          longitude: selectedAddress.longitude != null ? Number(selectedAddress.longitude) : 0,
          isDefault: Boolean(selectedAddress.isDefault),
        };
      }

      const res = await customerCreateBookingAPI(payload);
      if (res.success || res.statusCode === 201 || res.statusCode === 200) {
        setBookingForm({
          scheduledDate: "",
          scheduledTime: "",
          bookingMode: !isOfflineAllowed && isOnlineAllowed ? "ONLINE" : "OFFLINE",
          paymentOption: "TOKEN",
          language: "Hindi",
          specialInstructions: "",
        });

        const resData = res.data?.data || res.data || res;
        const paymentUrl =
          resData?.payment?.paymentUrl ||
          resData?.paymentUrl ||
          resData?.razorpayPaymentLinkId ||
          resData?.paymentLink ||
          resData?.razorpayPaymentLink ||
          resData?.short_url ||
          res?.data?.payment?.paymentUrl ||
          res?.payment?.paymentUrl;

        if (
          paymentUrl &&
          typeof paymentUrl === "string" &&
          (paymentUrl.startsWith("http://") || paymentUrl.startsWith("https://"))
        ) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("booking_payment_pending", "true");
          }
          showSnackbar("Redirecting to payment...", "info");
          window.location.href = paymentUrl;
        } else {
          showSnackbar("Booking request created successfully!", "success");
          router.push("/customer/bookings");
        }
      } else {
        showSnackbar(res.message || "Failed to create booking request", "error");
      }
    } catch (error: any) {
      console.error("Booking failed:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to create booking request",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      id="booking-form-section"
      elevation={0}
      sx={{
        bgcolor: "#FAF4EE",
        border: "1px solid #EADCCF",
        borderRadius: "24px",
        p: { xs: 3, sm: 4, md: 5 },
        mt: 4,
        mb: 6,
        scrollMarginTop: "100px",
      }}
    >
      {/* Plan Selection Cards (If Plans Exist) */}
      {plans && (plans.basic || plans.standard) && (
        <Box sx={{ mb: 5 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: COLORS.PRIMARY,
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            SELECT YOUR PLAN
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "22px", sm: "28px" },
              mb: 3,
            }}
          >
            Choose the package that suits your ritual requirements
          </Typography>

          <Grid container spacing={3}>
            {["basic", "standard"].map((planKey) => {
              const plan = plans[planKey];
              if (!plan) return null;
              const isSelected = selectedPlan === planKey;
              const planTitle =
                planKey === "basic" ? "Basic Plan" : "Standard Plan";

              const rawFeatures =
                plan.features ||
                (service?.serviceFeatures
                  ? service.serviceFeatures.filter(
                      (sf: any) => sf.plan === planKey.toUpperCase(),
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
              } else if (plan.features && typeof plan.features === "object") {
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

              const totalCardPrice = Number(plan.price || 0) + planAddonTotal;

              return (
                <Grid size={{ xs: 12, sm: 6 }} key={planKey} sx={{ display: "flex" }}>
                  <Paper
                    elevation={0}
                    onClick={() => handleSelectPlan(planKey)}
                    sx={{
                      width: "100%",
                      p: 3,
                      borderRadius: "18px",
                      border: isSelected
                        ? "2px solid #C84B16"
                        : "1px solid #EADCCF",
                      bgcolor: isSelected ? "#FFFBF7" : "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: isSelected
                        ? "0 8px 24px rgba(200, 75, 22, 0.12)"
                        : "0 2px 8px rgba(0,0,0,0.02)",
                      transition: "all 0.25s ease",
                      position: "relative",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(200, 75, 22, 0.15)",
                        borderColor: COLORS.PRIMARY,
                      },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 800,
                            color: "#2C1810",
                            fontSize: "20px",
                          }}
                        >
                          {planTitle}
                        </Typography>
                        {isSelected && (
                          <Chip
                            label="SELECTED"
                            size="small"
                            sx={{
                              bgcolor: COLORS.PRIMARY,
                              color: "#FFF",
                              fontWeight: 700,
                              fontSize: "11px",
                              height: "22px",
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 800,
                          color: COLORS.PRIMARY,
                          mb: 2.5,
                        }}
                      >
                        ₹{totalCardPrice.toLocaleString("en-IN")}
                      </Typography>

                      {/* Normal Features (Title only) */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.2,
                        }}
                      >
                        {normalFeatures.map((feat, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.2,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{
                                color: COLORS.PRIMARY,
                                fontSize: 18,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontSize: "14px",
                                color: "#5C4A40",
                                fontWeight: 500,
                              }}
                            >
                              {feat}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Price Features with Right-Tick Checkboxes (Only in OFFLINE mode) */}
                      {showAddons && priceFeatures.length > 0 && (
                        <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px dashed #EADCCF" }}>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#8C7A6B",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              mb: 1.2,
                            }}
                          >
                            Optional Add-ons
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {priceFeatures.map((pf) => {
                              const isChecked = selectedFeatureIds.includes(pf.id);

                              return (
                                <Box
                                  key={pf.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFeatureId(pf.id, planKey);
                                  }}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: "8px 12px",
                                    borderRadius: "10px",
                                    bgcolor: isChecked ? "#FFF7ED" : "#F8FAFC",
                                    border: `1.5px solid ${
                                      isChecked ? COLORS.PRIMARY : "#E2E8F0"
                                    }`,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                      borderColor: COLORS.PRIMARY,
                                      bgcolor: "#FFF7ED",
                                    },
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                    <Checkbox
                                      checked={isChecked}
                                      onChange={() => toggleFeatureId(pf.id, planKey)}
                                      onClick={(e) => e.stopPropagation()}
                                      size="small"
                                      sx={{
                                        p: 0,
                                        color: "#94A3B8",
                                        "&.Mui-checked": {
                                          color: COLORS.PRIMARY,
                                        },
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontFamily: FONTS.PRIMARY,
                                        fontSize: "13.5px",
                                        color: isChecked ? "#2C1810" : "#475569",
                                        fontWeight: isChecked ? 700 : 500,
                                      }}
                                    >
                                      {pf.title}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontFamily: FONTS.OUTFIT,
                                      fontSize: "13.5px",
                                      fontWeight: 700,
                                      color: COLORS.PRIMARY,
                                    }}
                                  >
                                    +₹{Number(pf.price || 0).toLocaleString("en-IN")}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <Button
                      variant={isSelected ? "contained" : "outlined"}
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(planKey);
                      }}
                      sx={{
                        mt: 3,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                        py: 1,
                        ...(isSelected
                          ? {
                              bgcolor: "#C84B16 !important",
                              color: "white !important",
                            }
                          : {
                              borderColor: COLORS.PRIMARY,
                              color: COLORS.PRIMARY,
                              "&:hover": { bgcolor: "#FFFBF7" },
                            }),
                      }}
                    >
                      {isSelected ? "Selected Plan" : "Select Plan"}
                    </Button>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      <Grid container spacing={5} sx={{ alignItems: "flex-start" }}>
        {/* Left Column: Heading & Description */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: COLORS.PRIMARY,
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            BOOK YOUR POOJA
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "28px", sm: "36px", md: "40px" },
              lineHeight: 1.2,
              mb: 2.5,
            }}
          >
            Fill in your details to reserve
          </Typography>

          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: "#64534A",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: 440,
            }}
          >
            Share your preferred date, time, and requirements. We'll confirm your
            booking within 24 hours — no advance payment needed.
          </Typography>
        </Grid>

        {/* Right Column: Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            component="form"
            onSubmit={handleConfirmBooking}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Row 1: Scheduled Date & Preferred Time */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Scheduled Date"
                  type="date"
                  value={bookingForm.scheduledDate}
                  onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: todayStr },
                  }}
                  required
                  sx={{
                    bgcolor: "#FFFBF7",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: FONTS.PRIMARY,
                      color: "#64534A",
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  required
                  sx={{
                    bgcolor: "#FFFBF7",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: FONTS.PRIMARY,
                      color: "#64534A",
                    },
                  }}
                >
                  <InputLabel id="preferred-time-label" shrink>
                    Preferred Time
                  </InputLabel>
                  <Select
                    labelId="preferred-time-label"
                    value={bookingForm.scheduledTime}
                    label="Preferred Time"
                    displayEmpty
                    onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                    required
                    MenuProps={{
                      disableScrollLock: true,
                      slotProps: {
                        paper: {
                          sx: {
                            maxHeight: 280,
                            borderRadius: "10px",
                          },
                        },
                      },
                    }}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: "#9E9E9E", fontFamily: FONTS.PRIMARY }}>Select Time (08:00 AM - 08:00 PM)</span>;
                      }
                      const match = timeOptions.find((t) => t.value === selected);
                      return match ? match.label : selected;
                    }}
                    sx={{
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                    }}
                  >
                    <MenuItem value="" disabled sx={{ fontFamily: FONTS.PRIMARY, color: "#8C7A6B" }}>
                      Select Time (08:00 AM - 08:00 PM)
                    </MenuItem>
                    {timeOptions.map((opt) => (
                      <MenuItem
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          color: opt.disabled ? "#BDBDBD" : "inherit",
                        }}
                      >
                        {opt.label} {opt.disabled ? "(Passed)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                  {isAllSlotsPassedToday && (
                    <FormHelperText sx={{ color: "#d97706", fontFamily: FONTS.PRIMARY, mt: 0.5 }}>
                      Slots for today are closed (8:00 AM - 8:00 PM). Please choose another date.
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Row 2: Booking Mode & Preferred Language */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  disabled={isSingleMode}
                  sx={{
                    bgcolor: isSingleMode ? "#F5EFE9" : "#FFFBF7",
                    borderRadius: "10px",
                  }}
                >
                  <InputLabel
                    id="booking-mode-label"
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      color: "#64534A",
                      "&.Mui-disabled": {
                        color: "#8C7A6B",
                      },
                    }}
                  >
                    Booking Mode
                  </InputLabel>
                  <Select
                    labelId="booking-mode-label"
                    label="Booking Mode"
                    disabled={isSingleMode}
                    value={activeBookingMode}
                    onChange={(e) => handleInputChange("bookingMode", e.target.value)}
                    sx={{
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                      "&.Mui-disabled": {
                        color: "#2C2013",
                        WebkitTextFillColor: "#2C2013",
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    {isOnlineAllowed && (
                      <MenuItem value="ONLINE">Online</MenuItem>
                    )}
                    {isOfflineAllowed && (
                      <MenuItem value="OFFLINE">Offline</MenuItem>
                    )}
                  </Select>
                  {isSingleMode && (
                    <FormHelperText sx={{ fontFamily: FONTS.PRIMARY, color: "#8C7A6B" }}>
                      {service?.isOffline && !isAddressCityCoveredForOffline
                        ? "Only online mode is available in your city"
                        : `This service is available in ${isOnlineAllowed ? "Online" : "Offline"} mode only`}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Preferred Language"
                  placeholder="e.g. Hindi, Sanskrit, English"
                  value={bookingForm.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  sx={{
                    bgcolor: "#FFFBF7",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: FONTS.PRIMARY,
                      color: "#64534A",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Row 3: Customer Address (Select Address & Add Address) */}
            <Box sx={{ width: "100%" }}>
              {addresses.length > 0 ? (
                <Box sx={{ width: "100%" }}>
                  {/* Top Right Responsive Add Address Button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      mb: 1,
                      width: "100%",
                    }}
                  >
                    <Button
                      type="button"
                      variant="contained"
                      onClick={() => setAddressModalOpen(true)}
                      startIcon={<AddIcon sx={{ fontSize: { xs: "16px", sm: "18px" } }} />}
                      sx={{
                        bgcolor: COLORS.PRIMARY,
                        color: "#ffffff",
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 700,
                        fontSize: { xs: "12px", sm: "13px" },
                        textTransform: "none",
                        px: { xs: 1.8, sm: 2.2 },
                        py: { xs: 0.6, sm: 0.8 },
                        borderRadius: "8px",
                        boxShadow: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          bgcolor: "#ea580c",
                          boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
                        },
                      }}
                    >
                      Add Address
                    </Button>
                  </Box>

                  {/* Full Width Select Dropdown */}
                  <FormControl fullWidth sx={{ bgcolor: "#FFFBF7", borderRadius: "10px" }}>
                    <InputLabel
                      id="customer-address-label"
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        color: "#64534A",
                      }}
                    >
                      Select Delivery / Pooja Address
                    </InputLabel>
                    <Select
                      labelId="customer-address-label"
                      label="Select Delivery / Pooja Address"
                      value={selectedAddressId}
                      onChange={(e) => {
                        if (e.target.value === "ADD_NEW") {
                          setAddressModalOpen(true);
                        } else {
                          setSelectedAddressId(e.target.value);
                        }
                      }}
                      MenuProps={{
                        slotProps: {
                          paper: {
                            sx: {
                              maxHeight: 320,
                              maxWidth: { xs: "90vw", sm: "600px" },
                              borderRadius: "14px",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                            },
                          },
                        },
                      }}
                      sx={{
                        borderRadius: "10px",
                        fontFamily: FONTS.PRIMARY,
                        "& .MuiSelect-select": {
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          py: 1.5,
                          lineHeight: 1.4,
                        },
                      }}
                    >
                      {addresses.map((addr: any) => {
                        const labelPrefix = addr.addressLabel ? `${addr.addressLabel}: ` : "";
                        const displayAddress =
                          addr.fullAddress ||
                          [addr.addressLine1 || addr.street, addr.city, addr.state, addr.pincode || addr.postalCode]
                            .filter(Boolean)
                            .join(", ");
                        const isDef =
                          addr.isDefault === true ||
                          String(addr.isDefault).toLowerCase() === "true" ||
                          addr.isdefault === true ||
                          addr.is_default === true;

                        return (
                          <MenuItem
                            key={addr.id}
                            value={addr.id}
                            sx={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              py: 1.5,
                              px: 2,
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "14px",
                              lineHeight: 1.5,
                              borderBottom: "1px solid #F5ECE3",
                              "&:last-child": { borderBottom: "none" },
                            }}
                          >
                            {labelPrefix}{displayAddress}{isDef ? " (Default)" : ""}
                          </MenuItem>
                        );
                      })}
                      <MenuItem
                        value="ADD_NEW"
                        sx={{
                          py: 1.5,
                          px: 2,
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "14px",
                          fontWeight: 700,
                          color: COLORS.PRIMARY,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          borderTop: "1px dashed #FF6200",
                          bgcolor: "#FFF8F2",
                          "&:hover": { bgcolor: "#FFEFE2" },
                        }}
                      >
                        <AddIcon sx={{ fontSize: "18px", color: COLORS.PRIMARY }} />
                        + Add New Address
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "10px",
                    border: "1px dashed #FF6200",
                    bgcolor: "#FFFBF7",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, fontSize: "14px", color: "#2C1810" }}>
                      No Saved Address Found
                    </Typography>
                    <Typography sx={{ fontFamily: FONTS.PRIMARY, fontSize: "13px", color: "#64534A" }}>
                      Please add a delivery / pooja address to complete your booking.
                    </Typography>
                  </Box>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => setAddressModalOpen(true)}
                    startIcon={<AddIcon />}
                    sx={{
                      bgcolor: "#FF6200 !important",
                      color: "white !important",
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      fontSize: "13px",
                      textTransform: "none",
                      borderRadius: "8px",
                      boxShadow: "none",
                      px: 2,
                      py: 0.8,
                      whiteSpace: "nowrap",
                      "&:hover": { bgcolor: "#ea580c !important" },
                    }}
                  >
                    + Add Address
                  </Button>
                </Box>
              )}
            </Box>

            {(() => {
              const currentPlanObj = plans?.[selectedPlan];
              const basePrice = Number(currentPlanObj?.price || 0);

              let currentPlanAddonTotal = 0;
              if (showAddons) {
                const currentRawFeats =
                  currentPlanObj?.features ||
                  (service?.serviceFeatures
                    ? service.serviceFeatures.filter(
                        (sf: any) => sf.plan === selectedPlan.toUpperCase(),
                      )
                    : null);

                if (Array.isArray(currentRawFeats)) {
                  currentRawFeats.forEach((f: any, idx: number) => {
                    if (f && f.isActive !== false && f.type === "PRICE") {
                      const matchedSf = service?.serviceFeatures?.find(
                        (sf: any) =>
                          sf.id === f.id ||
                          (sf.plan === selectedPlan.toUpperCase() &&
                            (sf.title || "").trim().toLowerCase() ===
                              (f.title || f.name || "").trim().toLowerCase())
                      );
                      const fId =
                        f.id != null
                          ? Number(f.id)
                          : matchedSf?.id != null
                            ? Number(matchedSf.id)
                            : idx + 1;
                      if (selectedFeatureIds.includes(fId)) {
                        currentPlanAddonTotal += Number(f.value || f.price || 0);
                      }
                    }
                  });
                }
              }

              const totalPrice = basePrice + currentPlanAddonTotal;

              const tokenPercent = Number(
                service?.tokenPercentage ||
                  (basePrice > 0 && currentPlanObj?.tokenAmount
                    ? Math.round((Number(currentPlanObj.tokenAmount) / basePrice) * 100)
                    : 40)
              );

              const tokenAmt = Math.round((totalPrice * tokenPercent) / 100);

              const tokenLabelText =
                tokenAmt > 0
                  ? `Token Amount (Advance - ₹${Number(tokenAmt).toLocaleString("en-IN")})`
                  : "Token Amount (Advance)";
              const fullLabelText =
                totalPrice > 0
                  ? `Full Payment (₹${Number(totalPrice).toLocaleString("en-IN")})`
                  : "Full Payment";

              return (
                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#2C1810",
                      mb: 0.5,
                      "&.Mui-focused": { color: COLORS.PRIMARY },
                    }}
                  >
                    Payment Option
                  </FormLabel>
                  <RadioGroup
                    row
                    name="paymentOption"
                    value={bookingForm.paymentOption}
                    onChange={(e) => handleInputChange("paymentOption", e.target.value)}
                  >
                    <FormControlLabel
                      value="TOKEN"
                      control={
                        <Radio
                          sx={{
                            color: COLORS.PRIMARY,
                            "&.Mui-checked": { color: COLORS.PRIMARY },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2C1810",
                          }}
                        >
                          {tokenLabelText}
                        </Typography>
                      }
                      sx={{ mr: 4 }}
                    />
                    <FormControlLabel
                      value="FULL"
                      control={
                        <Radio
                          sx={{
                            color: COLORS.PRIMARY,
                            "&.Mui-checked": { color: COLORS.PRIMARY },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2C1810",
                          }}
                        >
                          {fullLabelText}
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              );
            })()}

            {/* Row 5: Special Instructions */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Instructions"
              placeholder="Any specific requirements, dietary preferences for Prasad, accessibility needs, or other details..."
              value={bookingForm.specialInstructions}
              onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
              sx={{
                bgcolor: "#FFFBF7",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontFamily: FONTS.PRIMARY,
                },
                "& .MuiInputLabel-root": {
                  fontFamily: FONTS.PRIMARY,
                  color: "#64534A",
                },
              }}
            />

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <CalendarMonthIcon />
                  )
                }
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: COLORS.PRIMARY,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(200, 75, 22, 0.3)",
                  "&:hover": {
                    bgcolor: COLORS.PRIMARY,
                    boxShadow: "0 8px 25px rgba(200, 75, 22, 0.4)",
                  },
                }}
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* REUSABLE ADD ADDRESS MODAL */}
      <AddAddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSuccess={handleAddressAdded}
      />
    </Paper>
  );
}


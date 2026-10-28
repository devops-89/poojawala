"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { customerCreateBookingAPI } from "@/api/bookingControllers";
import { getCustomerAddressesAPI } from "@/api/userControllers";
import { checkCityMatch, ALL_INDIAN_LANGUAGES } from "@/utils/serviceDetailsUtils";

interface UseServiceBookingProps {
  serviceId: number;
  service?: any;
}

export function useServiceBooking({ serviceId, service }: UseServiceBookingProps) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile, fetchProfile } = useUserStore();

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const plans = service?.plans;
  const availablePlanKeys = useMemo(
    () => ["basic", "standard"].filter((k) => Boolean(plans?.[k])),
    [plans]
  );
  const isSinglePlan = availablePlanKeys.length === 1;

  const [selectedPlan, setSelectedPlan] = useState<string>("basic");

  useEffect(() => {
    if (plans) {
      if (plans[selectedPlan]) return;
      if (plans.basic) setSelectedPlan("basic");
      else if (plans.standard) setSelectedPlan("standard");
    }
  }, [plans, selectedPlan]);

  const [selectedFeatureIds, setSelectedFeatureIds] = useState<number[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

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

  const isGlobal = useMemo(() => {
    if (
      service?.isGlobal === true ||
      String(service?.isGlobal).toLowerCase() === "true" ||
      service?.isGlobal === 1
    ) {
      return true;
    }
    if (!serviceCities || serviceCities.length === 0) {
      return true;
    }
    return false;
  }, [service?.isGlobal, serviceCities]);

  const isOnlineService = Boolean(
    service?.isOnline === true ||
    String(service?.isOnline).toLowerCase() === "true" ||
    service?.isOnline === 1 ||
    String(service?.isOnline) === "1" ||
    (service as any)?.bookingMode === "ONLINE"
  );

  const activeBookingMode = useMemo(() => {
    return isOnlineService ? "ONLINE" : "OFFLINE";
  }, [isOnlineService]);

  const matchingAddresses = useMemo(() => {
    if (isGlobal || isOnlineService) return addresses;
    if (!addresses || addresses.length === 0) return [];
    return addresses.filter((addr) =>
      serviceCities.some((sc) => checkCityMatch(addr, sc))
    );
  }, [isGlobal, isOnlineService, addresses, serviceCities]);

  const isBookingAllowedForUser = useMemo(() => {
    if (isGlobal || isOnlineService) return true;
    return matchingAddresses.length > 0;
  }, [isGlobal, isOnlineService, matchingAddresses.length]);

  const userCitiesText = useMemo(() => {
    const list = Array.from(new Set(addresses.map((a: any) => a?.city).filter(Boolean)));
    return list.join(", ");
  }, [addresses]);

  const selectedAddress = useMemo(() => {
    const pool = isGlobal || isOnlineService ? addresses : matchingAddresses;
    if (!pool || pool.length === 0) return null;
    if (selectedAddressId) {
      const found = pool.find((a: any) => String(a.id) === String(selectedAddressId));
      if (found) return found;
    }
    return (
      pool.find(
        (a: any) =>
          a.isDefault === true ||
          String(a.isDefault).toLowerCase() === "true" ||
          a.isdefault === true ||
          a.is_default === true
      ) ||
      pool[0] ||
      null
    );
  }, [addresses, matchingAddresses, selectedAddressId, isGlobal, isOnlineService]);

  const handleAddressAdded = async (newAddrResponse?: any) => {
    if (activeBookingMode === "ONLINE" || isOnlineService) return;
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
      const eligible = isGlobal || isOnlineService
        ? addrList
        : addrList.filter((addr) => serviceCities.some((sc) => checkCityMatch(addr, sc)));
      if (eligible.length > 0) {
        const sorted = [...eligible].sort((a: any, b: any) => (Number(b.id) || 0) - (Number(a.id) || 0));
        if (sorted[0]?.id) {
          setSelectedAddressId(sorted[0].id);
        }
      }
    }
  };

  const availableLanguages = useMemo(() => {
    let list: string[] = [];
    if (service?.languages) {
      const raw = service.languages;
      if (Array.isArray(raw)) {
        list = raw
          .map((l: any) => (typeof l === "string" ? l.trim() : (l?.name || "").trim()))
          .filter(Boolean);
      } else if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            list = parsed
              .map((l: any) => (typeof l === "string" ? l.trim() : (l?.name || "").trim()))
              .filter(Boolean);
          }
        } catch {
          list = raw.split(",").map((s: string) => s.trim()).filter(Boolean);
        }
      }
    }
    // Combine any service-specific languages first, then all languages used in India
    const combined = [...list, ...ALL_INDIAN_LANGUAGES];
    return Array.from(new Set(combined));
  }, [service?.languages]);

  const [bookingForm, setBookingForm] = useState({
    scheduledDate: "",
    scheduledTime: "",
    paymentOption: "TOKEN",
    language: "Hindi",
    specialInstructions: "",
  });

  useEffect(() => {
    if (availableLanguages.length > 0) {
      setBookingForm((prev) => {
        if (!prev.language || !availableLanguages.includes(prev.language)) {
          const defaultLang = availableLanguages.includes("Hindi") ? "Hindi" : availableLanguages[0];
          return { ...prev, language: defaultLang };
        }
        return prev;
      });
    }
  }, [availableLanguages]);

  const [submitting, setSubmitting] = useState(false);

  const showAddons = activeBookingMode === "OFFLINE";

  useEffect(() => {
    if (!showAddons && selectedFeatureIds.length > 0) {
      setSelectedFeatureIds([]);
    }
  }, [showAddons, selectedFeatureIds.length]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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

  const timeOptions = useMemo(() => {
    const options: { value: string; label: string; disabled: boolean }[] = [];
    const isToday = bookingForm.scheduledDate === todayStr;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let h = 8; h <= 20; h++) {
      for (const m of [0, 30]) {
        if (h === 20 && m === 30) continue;

        const timeVal = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const period = h >= 12 ? "PM" : "AM";
        const label = `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;

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

  useEffect(() => {
    if (bookingForm.scheduledTime) {
      const selectedOpt = timeOptions.find((o) => o.value === bookingForm.scheduledTime);
      if (selectedOpt && selectedOpt.disabled) {
        setBookingForm((prev) => ({ ...prev, scheduledTime: "" }));
      }
    }
  }, [timeOptions, bookingForm.scheduledTime]);

  useEffect(() => {
    if (activeBookingMode === "ONLINE" || isOnlineService) {
      setAddresses([]);
      setAddressesLoading(false);
      return;
    }

    const loadAddresses = async () => {
      setAddressesLoading(true);
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
        const eligible = isGlobal || isOnlineService
          ? addrList
          : addrList.filter((addr) => serviceCities.some((sc) => checkCityMatch(addr, sc)));
        if (eligible.length > 0) {
          const defaultAddr =
            eligible.find(
              (a: any) =>
                a.isDefault === true ||
                String(a.isDefault).toLowerCase() === "true" ||
                a.isdefault === true ||
                a.is_default === true
            ) || eligible[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        } else {
          setSelectedAddressId("");
        }
      }
      setAddressesLoading(false);
    };
    loadAddresses();
  }, [profile, activeBookingMode, isOnlineService, isGlobal, serviceCities]);

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
        plan: isOnlineService ? "BASIC" : (selectedPlan ? selectedPlan.toUpperCase() : "BASIC"),
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

  return {
    plans,
    isSinglePlan,
    isOnlineService,
    activeBookingMode,
    selectedPlan,
    selectedFeatureIds,
    showAddons,
    addressesLoading,
    isBookingAllowedForUser,
    serviceCityNamesText,
    userCitiesText,
    matchingAddresses,
    selectedAddressId,
    bookingForm,
    availableLanguages,
    timeOptions,
    isAllSlotsPassedToday,
    submitting,
    todayStr,
    addressModalOpen,
    inquiryModalOpen,
    setSelectedAddressId,
    setAddressModalOpen,
    setInquiryModalOpen,
    handleSelectPlan,
    toggleFeatureId,
    handleInputChange,
    handleConfirmBooking,
    handleAddressAdded,
  };
}

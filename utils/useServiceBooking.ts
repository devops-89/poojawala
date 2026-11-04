"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { customerCreateBookingAPI } from "@/api/bookingControllers";
import { getCustomerAddressesAPI } from "@/api/userControllers";
import { checkCityMatch, ALL_INDIAN_LANGUAGES, extractServiceLanguages } from "@/utils/serviceDetailsUtils";

interface UseServiceBookingProps {
  serviceId: number;
  service?: any;
}

export const getBookingValidationSchema = (
  activeBookingMode: string,
  todayStr: string,
  availableLanguages: string[]
) =>
  Yup.object().shape({
    scheduledDate: Yup.string()
      .trim()
      .required("Scheduled date is required")
      .test("not-in-past", "Date cannot be in the past", (value) => {
        if (!value) return false;
        return moment(value, "YYYY-MM-DD").isSameOrAfter(moment(todayStr, "YYYY-MM-DD"), "day");
      })
      .test("max-3-months", "Booking is allowed up to 3 months in advance only", (value) => {
        if (!value) return false;
        const maxDate = moment().add(3, "months").endOf("day");
        return moment(value, "YYYY-MM-DD").isSameOrBefore(maxDate, "day");
      }),
    scheduledTime: Yup.string()
      .trim()
      .required("Preferred time slot is required")
      .test("valid-time-range", "Please select a time between 08:00 AM and 08:00 PM", (value) => {
        if (!value) return false;
        const [hStr, mStr] = value.split(":");
        const h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        if (isNaN(h)) return false;
        return (h >= 8 && h < 20) || (h === 20 && m === 0);
      })
      .test("advance-notice", "Same-day bookings require at least 2 hours advance notice", function (value) {
        if (!value) return false;
        const { scheduledDate } = this.parent;
        if (scheduledDate === todayStr) {
          const [hStr, mStr] = value.split(":");
          const h = parseInt(hStr, 10);
          const m = parseInt(mStr, 10);
          const now = new Date();
          const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
          const slotTotalMinutes = h * 60 + m;
          if (slotTotalMinutes <= currentTotalMinutes) {
            return this.createError({ message: "The selected time slot has already passed" });
          }
          if (slotTotalMinutes < currentTotalMinutes + 120) {
            return this.createError({
              message: "Same-day bookings require at least 2 hours advance notice",
            });
          }
        }
        return true;
      }),
    paymentOption: Yup.string()
      .trim()
      .required("Please select a payment option (Token Amount or Full Payment)")
      .oneOf(["TOKEN", "FULL"], "Please select a valid payment option"),
    language: Yup.string().optional(),
    customerAddressId: Yup.mixed().test(
      "address-required",
      "Please select or add a pooja delivery address",
      function (value) {
        if (activeBookingMode === "OFFLINE") {
          return Boolean(value);
        }
        return true;
      }
    ),
    specialInstructions: Yup.string().max(500, "Special instructions must be under 500 characters"),
  });

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

  const updateSelectedAddressId = (id: number | string) => {
    setSelectedAddressId(id);
    formik.setFieldValue("customerAddressId", id ? String(id) : "");
    if (formik.errors.customerAddressId) {
      formik.setFieldError("customerAddressId", undefined);
    }
  };
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
    const mode = (service?.bookingMode || "").toUpperCase();
    if (mode === "ONLINE") return true;
    return false;
  }, [service?.isGlobal, service?.bookingMode]);

  const activeBookingMode = useMemo(() => {
    const mode = (service?.bookingMode || "").toUpperCase();
    if (mode === "BOTH") {
      return selectedPlan === "standard" ? "ONLINE" : "OFFLINE";
    }
    if (mode === "ONLINE") return "ONLINE";
    return "OFFLINE";
  }, [service?.bookingMode, selectedPlan]);

  const isOnlineService = activeBookingMode === "ONLINE";

  const matchingAddresses = useMemo(() => {
    if (isGlobal || isOnlineService) return addresses;
    if (!serviceCities || serviceCities.length === 0) return [];
    return addresses.filter((addr) =>
      serviceCities.some((sc) => checkCityMatch(addr, sc))
    );
  }, [addresses, serviceCities, isGlobal, isOnlineService]);

  const isBookingAllowedForUser = useMemo(() => {
    if (isGlobal || isOnlineService) return true;
    if (!serviceCities || serviceCities.length === 0) return true;
    if (addressesLoading) return true;
    if (!addresses || addresses.length === 0) return false;
    return matchingAddresses.length > 0;
  }, [isGlobal, isOnlineService, serviceCities, addressesLoading, addresses, matchingAddresses]);

  const userCitiesText = useMemo(() => {
    if (!addresses || addresses.length === 0) return "";
    const names = Array.from(
      new Set(
        addresses
          .map((a) => (a?.city || a?.state || "").trim())
          .filter(Boolean)
      )
    );
    return names.join(", ");
  }, [addresses]);

  const selectedAddress = useMemo(() => {
    if (!selectedAddressId) return null;
    return addresses.find((a) => String(a.id) === String(selectedAddressId)) || null;
  }, [addresses, selectedAddressId]);

  const handleAddressAdded = async (newAddress?: any) => {
    let addrList: any[] = [];
    try {
      const res = await getCustomerAddressesAPI();
      if (res?.data?.data && Array.isArray(res.data.data)) addrList = res.data.data;
      else if (res?.data && Array.isArray(res.data)) addrList = res.data;
      else if (Array.isArray(res)) addrList = res;
    } catch (e) {
      console.error("Failed to re-fetch addresses:", e);
    }
    setAddresses(addrList);
    const createdId = newAddress?.id || newAddress?.data?.id;
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
    const list = extractServiceLanguages(service?.languages);
    if (list.length > 0) {
      return list;
    }
    return ["Hindi"];
  }, [service?.languages]);

  const initialDefaultLang = useMemo(() => {
    const list = extractServiceLanguages(service?.languages);
    const languages = list.length > 0 ? list : ["Hindi"];
    return languages.includes("Hindi") ? "Hindi" : languages[0] || "Hindi";
  }, [service?.languages]);

  const [submitting, setSubmitting] = useState(false);

  const executeBooking = async (values: {
    scheduledDate: string;
    scheduledTime: string;
    paymentOption: string;
    language: string;
    specialInstructions: string;
    customerAddressId?: any;
  }) => {
    let customerAddressId = values.customerAddressId || selectedAddressId;
    if (activeBookingMode === "OFFLINE" && !customerAddressId) {
      showSnackbar(
        "No address found. Please add an address in your profile first.",
        "error"
      );
      return;
    }

    setSubmitting(true);
    try {
      const timeFormatted =
        values.scheduledTime.length === 5
          ? `${values.scheduledTime}:00`
          : values.scheduledTime;
      const scheduledAtIso = `${values.scheduledDate}T${timeFormatted}.000Z`;

      const finalFeatureIds = showAddons
        ? selectedFeatureIds.map((id) => Number(id)).filter((id) => !isNaN(id))
        : [];

      const payload: any = {
        serviceId: Number(serviceId),
        bookingMode: activeBookingMode,
        scheduledAt: scheduledAtIso,
        plan: isOnlineService ? "BASIC" : (selectedPlan ? selectedPlan.toUpperCase() : "BASIC"),
        paymentOption: values.paymentOption,
        featureIds: finalFeatureIds,
        specialInstructions: values.specialInstructions || "",
        customFields: {
          language: values.language || (availableLanguages[0] || "Hindi"),
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
        formik.resetForm();

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

  const formik = useFormik({
    initialValues: {
      scheduledDate: "",
      scheduledTime: "",
      paymentOption: "",
      language: initialDefaultLang,
      specialInstructions: "",
      customerAddressId: selectedAddressId ? String(selectedAddressId) : "",
    },
    enableReinitialize: false,
    validationSchema: getBookingValidationSchema(activeBookingMode, todayStr, availableLanguages),
    onSubmit: async (values) => {
      await executeBooking(values);
    },
  });

  useEffect(() => {
    formik.setFieldValue("customerAddressId", selectedAddressId ? String(selectedAddressId) : "");
  }, [selectedAddressId]);

  useEffect(() => {
    if (availableLanguages.length > 0) {
      if (!formik.values.language || !availableLanguages.includes(formik.values.language)) {
        const defaultLang = availableLanguages.includes("Hindi") ? "Hindi" : availableLanguages[0];
        formik.setFieldValue("language", defaultLang);
      }
    }
  }, [availableLanguages]);

  const bookingForm = formik.values;

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

  const [currentTimeTick, setCurrentTimeTick] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeTick(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const timeOptions = useMemo(() => {
    const options: { value: string; label: string; disabled: boolean }[] = [];
    const isToday = bookingForm.scheduledDate === todayStr;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const MIN_ADVANCE_MINUTES = 120; // 2 hours advance booking for today

    for (let h = 8; h <= 20; h++) {
      for (const m of [0, 30]) {
        if (h === 20 && m === 30) continue;

        const timeVal = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const period = h >= 12 ? "PM" : "AM";
        const label = `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;

        const slotTotalMinutes = h * 60 + m;
        const isPastOrTooSoon =
          isToday && slotTotalMinutes < currentTotalMinutes + MIN_ADVANCE_MINUTES;

        options.push({ value: timeVal, label, disabled: isPastOrTooSoon });
      }
    }
    return options;
  }, [bookingForm.scheduledDate, todayStr, currentTimeTick]);

  const isAllSlotsPassedToday = useMemo(() => {
    if (bookingForm.scheduledDate !== todayStr) return false;
    return timeOptions.length > 0 && timeOptions.every((opt) => opt.disabled);
  }, [bookingForm.scheduledDate, todayStr, timeOptions]);

  useEffect(() => {
    if (bookingForm.scheduledTime) {
      const selectedOpt = timeOptions.find((o) => o.value === bookingForm.scheduledTime);
      if (selectedOpt && selectedOpt.disabled) {
        formik.setFieldValue("scheduledTime", "");
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
          if (defaultAddr) updateSelectedAddressId(defaultAddr.id);
        } else {
          updateSelectedAddressId("");
        }
      }
      setAddressesLoading(false);
    };
    loadAddresses();
  }, [profile, activeBookingMode, isOnlineService, isGlobal, serviceCities]);

  const handleInputChange = (field: string, value: any) => {
    formik.setFieldValue(field, value);
    if (formik.errors[field as keyof typeof formik.errors]) {
      formik.setFieldError(field, undefined);
    }
  };

  const handleConfirmBooking = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const currentValues = {
      ...formik.values,
      customerAddressId: selectedAddressId
        ? String(selectedAddressId)
        : formik.values.customerAddressId,
    };
    if (selectedAddressId && formik.values.customerAddressId !== String(selectedAddressId)) {
      formik.setFieldValue("customerAddressId", String(selectedAddressId));
    }
    const errors = await formik.validateForm(currentValues);
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        scheduledDate: true,
        scheduledTime: true,
        paymentOption: true,
        language: true,
        customerAddressId: true,
        specialInstructions: true,
      });
      // Show validation errors cleanly only below inputs; do not show duplicate snackbar
      return;
    }
    formik.handleSubmit();
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
    formik,
    availableLanguages,
    timeOptions,
    isAllSlotsPassedToday,
    submitting,
    todayStr,
    addressModalOpen,
    inquiryModalOpen,
    setSelectedAddressId: updateSelectedAddressId,
    setAddressModalOpen,
    setInquiryModalOpen,
    handleSelectPlan,
    toggleFeatureId,
    handleInputChange,
    handleConfirmBooking,
    handleAddressAdded,
  };
}

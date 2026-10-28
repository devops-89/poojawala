"use client";
import { COLORS } from "@/utils/enums";
import { customerCreateBookingAPI } from "@/api/bookingControllers";
import { getAllServicesAPI } from "@/api/serviceControllers";
import { getCustomerAddressesAPI } from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { Box, CircularProgress, Grid, Pagination } from "@mui/material";
import { City, State } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomerServiceCard from "./CustomerServiceCard";
import CustomerServicesBookingModal from "./CustomerServicesBookingModal";
import CustomerServicesEmptyState from "./CustomerServicesEmptyState";
import CustomerServicesFilters from "./CustomerServicesFilters";
import CustomerServicesHeader from "./CustomerServicesHeader";

export const ServicesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOffline = searchParams.get("isOffline") === "true";
  const isOnline = searchParams.get("isOnline") === "true";
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All Categories");
  const [userDefaultCity, setUserDefaultCity] = useState<string>("");
  const [userDefaultState, setUserDefaultState] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile, fetchProfile } = useUserStore();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState<{
    scheduledAt: string;
    specialInstructions: string;
    bookingMode: string;
    paymentOption: string;
    language: string;
  }>({
    scheduledAt: "",
    specialInstructions: "",
    bookingMode: "OFFLINE",
    paymentOption: "TOKEN",
    language: "Hindi",
  });

  useEffect(() => {
    let isMounted = true;

    // Online services do not need address or location lookup
    if (isOnline) {
      setSelectedCity("All");
      setSelectedState("All");
      const urlSearch = searchParams.get("search");
      const urlCategoryId = searchParams.get("categoryId");
      const urlCategory = searchParams.get("category");
      const urlPage = searchParams.get("page");
      if (urlSearch) setSearchTerm(urlSearch);
      if (urlCategoryId) setSelectedCategoryId(urlCategoryId);
      if (urlCategory) setSelectedCategoryName(urlCategory);
      if (urlPage && !isNaN(Number(urlPage))) setPage(Number(urlPage));
      setIsInitialized(true);
      return;
    }

    const urlState = searchParams.get("state");
    const urlCity = searchParams.get("city");
    const urlSearch = searchParams.get("search");
    const urlCategoryId = searchParams.get("categoryId");
    const urlCategory = searchParams.get("category");
    const urlPage = searchParams.get("page");

    if (urlState || urlCity || urlSearch || urlCategoryId || urlCategory || urlPage) {
      if (urlState) setSelectedState(urlState);
      if (urlCity) setSelectedCity(urlCity);
      else if (urlState) setSelectedCity("All");
      if (urlSearch) setSearchTerm(urlSearch);
      if (urlCategoryId) setSelectedCategoryId(urlCategoryId);
      if (urlCategory) setSelectedCategoryName(urlCategory);
      if (urlPage && !isNaN(Number(urlPage))) setPage(Number(urlPage));
      setIsInitialized(true);
      return;
    }

    const initLocation = async () => {
      const extractAddressList = (resObj: any) => {
        if (!resObj) return [];
        if (Array.isArray(resObj)) return resObj;
        if (Array.isArray(resObj?.data?.data)) return resObj.data.data;
        if (Array.isArray(resObj?.data?.addresses)) return resObj.data.addresses;
        if (Array.isArray(resObj?.data)) return resObj.data;
        if (Array.isArray(resObj?.addresses)) return resObj.addresses;
        return [];
      };

      const findDefaultAddress = (list: any[]) => {
        if (!Array.isArray(list) || list.length === 0) return null;
        const found = list.find((a: any) =>
          a?.isDefault === true ||
          a?.isdefault === true ||
          a?.is_default === true ||
          String(a?.isDefault).toLowerCase() === 'true' ||
          String(a?.isdefault).toLowerCase() === 'true' ||
          String(a?.is_default).toLowerCase() === 'true' ||
          a?.isDefault === 1 ||
          a?.isdefault === 1 ||
          a?.is_default === 1
        );
        return found || list[0];
      };

      let addresses: any[] = [];
      try {
        const addrRes = await getCustomerAddressesAPI();
        addresses = extractAddressList(addrRes);
      } catch (e) {
        console.error("Failed to fetch customer addresses:", e);
      }

      if (addresses.length === 0) {
        const profileRes = await fetchProfile();
        if (!isMounted) return;
        const currentProfile = profileRes || useUserStore.getState().profile;
        const userObj = currentProfile?.data || currentProfile;
        addresses = extractAddressList(currentProfile).concat(extractAddressList(userObj));
      }

      const defaultAddr = findDefaultAddress(addresses);
      if (!isOnline) {
        if (defaultAddr?.city) {
          const city = String(defaultAddr.city).trim();
          setUserDefaultCity(city);
          setSelectedCity(city);
        }
        if (defaultAddr?.state) {
          const state = String(defaultAddr.state).trim();
          setUserDefaultState(state);
          setSelectedState(state);
        }
      } else {
        setSelectedCity("All");
        setSelectedState("All");
      }
      setIsInitialized(true);
    };

    initLocation();
    return () => {
      isMounted = false;
    };
  }, [searchParams, isOnline, isOffline]);

  useEffect(() => {
    if (isOnline) {
      setSelectedCity("All");
      setSelectedState("All");
    }
  }, [isOnline]);

  const handleOpenBooking = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    const targetService = filteredServices.find((s) => s.id === serviceId);
    const defaultMode = targetService?.isOnline ? "ONLINE" : "OFFLINE";
    setBookingForm((prev) => ({
      ...prev,
      bookingMode: defaultMode,
    }));
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
    setSelectedServiceId(null);
    setBookingForm({
      scheduledAt: "",
      specialInstructions: "",
      bookingMode: "ONLINE",
      paymentOption: "TOKEN",
      language: "Hindi",
    });
  };

  const handleBookNowSubmit = async () => {
    if (!bookingForm.scheduledAt) {
      showSnackbar("Please select a scheduled date and time", "error");
      return;
    }
    setSubmittingBooking(true);
    try {
      let customerAddressId = null;
      let defaultAddr: any = null;
      const currentProfile = useUserStore.getState().profile;
      const userObj = currentProfile?.data || currentProfile;
      const addresses = userObj?.addresses || profile?.addresses;
      if (addresses && addresses.length > 0) {
        defaultAddr =
          addresses.find((a: any) => a.isDefault === true) ||
          addresses[0];
        customerAddressId = defaultAddr.id;
      }

      const targetService = filteredServices.find((s) => s.id === selectedServiceId);
      const finalBookingMode = targetService?.isOnline ? "ONLINE" : "OFFLINE";

      if (!customerAddressId && finalBookingMode === "OFFLINE") {
        showSnackbar(
          "No address found. Please add an address in your profile first.",
          "error",
        );
        setSubmittingBooking(false);
        return;
      }

      const payload = {
        serviceId: Number(selectedServiceId),
        scheduledAt: new Date(bookingForm.scheduledAt).toISOString(),
        customerAddressId: customerAddressId ? Number(customerAddressId) : null,
        specialInstructions: bookingForm.specialInstructions || "",
        plan: "BASIC",
        paymentOption: bookingForm.paymentOption || "TOKEN",
        bookingMode: finalBookingMode,
        customFields: {
          language: bookingForm.language || "Hindi",
        },
      };

      const res = await customerCreateBookingAPI(payload);
      if (res.success || res.statusCode === 201 || res.statusCode === 200) {
        handleCloseBooking();

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
      }
    } catch (error: any) {
      console.error("Booking failed:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to create booking request",
        "error",
      );
    } finally {
      setSubmittingBooking(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleStateChange = useCallback((val: string) => {
    setSelectedState(val);
    setSelectedCity("All");
    setPage(1);
  }, []);

  const handleCityChange = useCallback((val: string) => {
    setSelectedCity(val);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((catId: string, catName: string) => {
    setSelectedCategoryId(catId);
    setSelectedCategoryName(catName);
    setPage(1);
  }, []);


  useEffect(() => {
    if (!isInitialized) return;

    const fetchServices = async () => {
      setLoading(true);
      try {
        const cityParam =
          !isOnline && selectedCity && selectedCity !== "All" && selectedCity !== "All Cities" ? selectedCity : undefined;
        const stateParam =
          !isOnline && selectedState && selectedState !== "All" && selectedState !== "All States" ? selectedState : undefined;
        const catIdParam =
          selectedCategoryId && selectedCategoryId !== "All" && selectedCategoryId !== "All Categories"
            ? selectedCategoryId
            : undefined;

        const res = await getAllServicesAPI(
          page,
          6,
          debouncedSearch,
          true,
          cityParam,
          stateParam,
          catIdParam,
          undefined,
          false,
          isOnline ? true : undefined,
          isOffline ? true : undefined
        );
        let rawList: any[] = [];
        if (res.success) {
          const d = res.data;
          if (d?.data && Array.isArray(d.data)) {
            rawList = d.data;
          } else if (Array.isArray(d)) {
            rawList = d;
          } else if (Array.isArray(res.services)) {
            rawList = res.services;
          }

          const pagination = d?.pagination || res.pagination || d;
          const total =
            pagination?.total ||
            pagination?.totalCount ||
            d?.total ||
            rawList.length;
          const tPages =
            pagination?.totalPages ||
            pagination?.pageCount ||
            Math.ceil(total / 6) ||
            1;
          setTotalPages(tPages);
        }

        // Filter only active services (isActive: true)
        const activeServices = rawList.filter(
          (item: any) => item.isActive !== false,
        );
        setServices(activeServices);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [page, debouncedSearch, selectedCity, selectedState, selectedCategoryId, isInitialized, isOffline, isOnline]);

  // All Indian States from country-state-city
  const indianStates = useMemo(() => State.getStatesOfCountry("IN") || [], []);
  const stateOptions = useMemo(
    () => indianStates.map((s) => s.name).sort((a, b) => a.localeCompare(b)),
    [indianStates]
  );

  // Selected State object
  const selectedStateObj = useMemo(() => {
    if (!selectedState || selectedState === "All") return null;
    return indianStates.find(
      (s) => s.name.toLowerCase().trim() === selectedState.toLowerCase().trim()
    );
  }, [selectedState, indianStates]);

  // City options for the selected state
  const cityOptions = useMemo(() => {
    const rawCities = selectedStateObj
      ? City.getCitiesOfState("IN", selectedStateObj.isoCode) || []
      : [];
    const names = rawCities.map((c) => c.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [selectedStateObj]);

  // Display services returned directly by the paginated API (6 per page)
  const filteredServices = services;

  return (
    <Box>
      <CustomerServicesHeader isOffline={isOffline} isOnline={isOnline} />

      <CustomerServicesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        hideLocationFilters={isOnline}
        stateOptions={isOnline ? undefined : stateOptions}
        selectedState={isOnline ? undefined : selectedState}
        onStateChange={isOnline ? undefined : handleStateChange}
        selectedCategory={selectedCategoryName || selectedCategoryId}
        onCategoryChange={handleCategoryChange}
        cityOptions={isOnline ? undefined : cityOptions}
        selectedCity={isOnline ? undefined : selectedCity}
        onCityChange={isOnline ? undefined : handleCityChange}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : filteredServices.length === 0 ? (
        <CustomerServicesEmptyState
          selectedCity={isOnline ? "All" : selectedCity}
          selectedState={isOnline ? "All" : selectedState}
          onReset={() => {
            if (!isOnline) {
              setSelectedState("All");
              setSelectedCity("All");
            }
            setSelectedCategoryId("");
            setSelectedCategoryName("All Categories");
            setSearchTerm("");
            setPage(1);
          }}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredServices.map((service, idx) => (
            <CustomerServiceCard
              key={service?.id || idx}
              service={service}
              onBookNow={handleOpenBooking}
            />
          ))}
        </Grid>
      )}

      {!loading && filteredServices.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={(_, value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: COLORS.PRIMARY,
                color: "white",
                "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
              },
            }}
          />
        </Box>
      )}

      <CustomerServicesBookingModal
        open={bookingModalOpen}
        onClose={handleCloseBooking}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        onSubmit={handleBookNowSubmit}
        submitting={submittingBooking}
        service={filteredServices.find((s) => s.id === selectedServiceId)}
      />
    </Box>
  );
};

export default ServicesPage;

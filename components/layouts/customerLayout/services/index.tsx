"use client";
import { customerCreateBookingAPI } from "@/api/bookingControllers";
import { getAllServicesAPI } from "@/api/serviceControllers";
import { getCustomerAddressesAPI } from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { Box, CircularProgress, Grid, Pagination } from "@mui/material";
import { City, State } from "country-state-city";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomerServiceCard from "./CustomerServiceCard";
import CustomerServicesBookingModal from "./CustomerServicesBookingModal";
import CustomerServicesEmptyState from "./CustomerServicesEmptyState";
import CustomerServicesFilters from "./CustomerServicesFilters";
import CustomerServicesHeader from "./CustomerServicesHeader";

export const ServicesPage = () => {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
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
    language: string;
    members: number | string;
  }>({
    scheduledAt: "",
    specialInstructions: "",
    bookingMode: "OFFLINE",
    language: "Hindi",
    members: 1,
  });

  useEffect(() => {
    let isMounted = true;
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
      setIsInitialized(true);
    };

    initLocation();
    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  const handleOpenBooking = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
    setSelectedServiceId(null);
    setBookingForm({
      scheduledAt: "",
      specialInstructions: "",
      bookingMode: "OFFLINE",
      language: "Hindi",
      members: 1,
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
      const currentProfile = useUserStore.getState().profile;
      const userObj = currentProfile?.data || currentProfile;
      const addresses = userObj?.addresses || profile?.addresses;
      if (addresses && addresses.length > 0) {
        const defaultAddr =
          addresses.find((a: any) => a.isDefault === true) ||
          addresses[0];
        customerAddressId = defaultAddr.id;
      }

      if (!customerAddressId && bookingForm.bookingMode === "OFFLINE") {
        showSnackbar(
          "No address found. Please add an address in your profile first.",
          "error",
        );
        setSubmittingBooking(false);
        return;
      }

      const payload = {
        serviceId: selectedServiceId,
        customerAddressId: customerAddressId,
        scheduledAt: new Date(bookingForm.scheduledAt).toISOString(),
        specialInstructions: bookingForm.specialInstructions,
        bookingMode: bookingForm.bookingMode,
        customFields: {
          language: bookingForm.language,
          members: Number(bookingForm.members),
        },
      };

      const res = await customerCreateBookingAPI(payload);
      if (res.success || res.statusCode === 201) {
        showSnackbar("Booking request created successfully!", "success");
        handleCloseBooking();
        router.push("/customer/bookings");
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

  useEffect(() => {
    if (!isInitialized) return;

    const fetchServices = async () => {
      setLoading(true);
      try {
        const cityParam =
          selectedCity && selectedCity !== "All" ? selectedCity : undefined;
        const stateParam =
          selectedState && selectedState !== "All" ? selectedState : undefined;
        const res = await getAllServicesAPI(
          page,
          6,
          debouncedSearch,
          true,
          cityParam,
          stateParam,
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
  }, [page, debouncedSearch, selectedCity, selectedState, isInitialized]);

  // All Indian States from country-state-city
  const indianStates = State.getStatesOfCountry("IN") || [];
  const stateOptions = indianStates.map((s) => s.name).sort();

  // Selected State object
  const selectedStateObj =
    selectedState && selectedState !== "All"
      ? indianStates.find(
          (s) =>
            s.name.toLowerCase().trim() === selectedState.toLowerCase().trim(),
        )
      : null;

  // City options for the selected state (or all country cities if no state selected)
  const rawCities = selectedStateObj
    ? City.getCitiesOfState("IN", selectedStateObj.isoCode) || []
    : City.getCitiesOfCountry("IN") || [];

  // Deduplicate and sort city names
  const cityOptions = Array.from(new Set(rawCities.map((c) => c.name))).sort();

  // Secondary safety filter on services by selected state and city
  const filteredServices = services.filter((service: any) => {
    if (
      !service.cities ||
      !Array.isArray(service.cities) ||
      service.cities.length === 0
    )
      return true;

    const matchState =
      !selectedState ||
      selectedState === "All" ||
      service.cities.some((c: any) => {
        const stateName = (typeof c === "string" ? "" : c.state || "")
          .toLowerCase()
          .trim();
        return !stateName || stateName === selectedState.toLowerCase().trim();
      });

    const matchCity =
      !selectedCity ||
      selectedCity === "All" ||
      service.cities.some((c: any) => {
        const cityName = (typeof c === "string" ? c : c.name || "")
          .toLowerCase()
          .trim();
        return cityName === selectedCity.toLowerCase().trim();
      });

    return matchState && matchCity;
  });

  return (
    <Box>
      <CustomerServicesHeader />

      <CustomerServicesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        stateOptions={stateOptions}
        selectedState={selectedState}
        onStateChange={(val) => {
          setSelectedState(val);
          setSelectedCity("All");
          setPage(1);
        }}
        cityOptions={cityOptions}
        selectedCity={selectedCity}
        onCityChange={(val) => {
          setSelectedCity(val);
          setPage(1);
        }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#FF6200" }} />
        </Box>
      ) : filteredServices.length === 0 ? (
        <CustomerServicesEmptyState
          selectedCity={selectedCity}
          selectedState={selectedState}
          onReset={() => {
            setSelectedState("All");
            setSelectedCity("All");
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
                bgcolor: "#FF6200",
                color: "white",
                "&:hover": { bgcolor: "#F05A00" },
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
      />
    </Box>
  );
};

export default ServicesPage;

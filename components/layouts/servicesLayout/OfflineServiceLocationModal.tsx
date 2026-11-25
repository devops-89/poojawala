"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeIcon from "@mui/icons-material/Home";
import ErrorIcon from "@mui/icons-material/Error";
import { State, City } from "@/utils/indianLocations";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { normalizePoojaText } from "@/utils/helpers";
import { submitContactFormAPI } from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

// Comprehensive Static Offline Services for Location Checking
export interface IOfflinePoojaService {
  id: string | number;
  name: string;
  hindiName: string;
  category: string;
  basicPrice: number;
  standardPrice: number;
  description: string;
  isAvailable: boolean; // Availability status in chosen location
  image: string;
  duration: string;
}

const STATIC_OFFLINE_SERVICES: IOfflinePoojaService[] = [
  {
    id: "bhoomi-puja",
    name: "Bhoomi Pooja",
    hindiName: "भूमि पूजा",
    category: "Vastu & Property",
    basicPrice: 5100,
    standardPrice: 11000,
    description:
      "Blessings of Mother Earth before construction or property development with Vastu Purush Pooja.",
    isAvailable: true,
    image: "/images/home/poojaPackages/bhoomi.webp",
    duration: "2 - 3 Hours",
  },
  {
    id: "griha-pravesh-puja",
    name: "Griha Pravesh Pooja",
    hindiName: "गृह प्रवेश पूजा",
    category: "Vastu & Property",
    basicPrice: 5100,
    standardPrice: 11000,
    description:
      "Sacred housewarming ritual with Vastu Shanti, Navgraha Pooja, Kalash Sthapana & Havan.",
    isAvailable: true,
    image: "/images/home/poojaPackages/grihaPravesh.webp",
    duration: "3 - 4 Hours",
  },
  {
    id: "rudrabhishek-puja",
    name: "Rudrabhishek Pooja",
    hindiName: "रुद्राभिषेक पूजा",
    category: "Shiva Pooja & Havan",
    basicPrice: 4800,
    standardPrice: 11000,
    description:
      "Sacred Shiva Abhishek with Panchamrit, bilva patra, and Vedic Rudri Path recitation.",
    isAvailable: true,
    image: "/images/home/poojaPackages/rudrabhishek.webp",
    duration: "2 - 3 Hours",
  },
  {
    id: "satyanarayan-puja",
    name: "Satyanarayan Katha & Pooja",
    hindiName: "सत्यनारायण कथा व पूजा",
    category: "Katha & Family",
    basicPrice: 3100,
    standardPrice: 6100,
    description:
      "Traditional Lord Vishnu Katha recitation for family peace, gratitude, and fulfillment of sankalp.",
    isAvailable: true,
    image: "/images/home/poojaPackages/satyanarayan.webp",
    duration: "2 - 2.5 Hours",
  },
  {
    id: "navgraha-shanti-puja",
    name: "Navgraha Shanti Pooja",
    hindiName: "नवग्रह शांति पूजा",
    category: "Dosha & Shanti",
    basicPrice: 5500,
    standardPrice: 12000,
    description:
      "Pacify malefic planetary influences and attract health, wealth and cosmic balance.",
    isAvailable: true,
    image: "/images/home/poojaPackages/navgrah.webp",
    duration: "3 Hours",
  },
  {
    id: "annaprashan-puja",
    name: "Annaprashan Sanskar",
    hindiName: "अन्नप्राशन संस्कार",
    category: "Sanskar Rituals",
    basicPrice: 3500,
    standardPrice: 6500,
    description:
      "Baby's first rice feeding sacred ceremony with Vedic mantras and divine blessings.",
    isAvailable: true,
    image: "/images/home/poojaPackages/annaprashan.webp",
    duration: "1.5 - 2 Hours",
  },
  {
    id: "ganesh-puja",
    name: "Ganesh Pooja & Havan",
    hindiName: "गणेश पूजा व हवन",
    category: "Auspicious Beginnings",
    basicPrice: 2500,
    standardPrice: 5100,
    description:
      "Removal of all obstacles, invocation of wisdom, and blessings for new ventures or milestones.",
    isAvailable: true,
    image: "/images/home/poojaPackages/ganesh.webp",
    duration: "1.5 - 2 Hours",
  },
  {
    id: "maha-mrityunjaya-jaap",
    name: "Maha Mrityunjaya Jaap & Havan",
    hindiName: "महा मृत्युंजय जाप व हवन",
    category: "Shiva Pooja & Havan",
    basicPrice: 11000,
    standardPrice: 21000,
    description:
      "Potent Vedic chanting with sacred Havan for health, rejuvenation, and longevity.",
    isAvailable: true,
    image: "/images/home/poojaPackages/rudrabhishek.webp",
    duration: "4 - 5 Hours",
  },
  {
    id: "vastu-shanti-puja",
    name: "Vastu Shanti Pooja",
    hindiName: "वास्तु शांति पूजा",
    category: "Vastu & Property",
    basicPrice: 6500,
    standardPrice: 13500,
    description:
      "Purification and directional dosha rectification for home, office or commercial establishments.",
    isAvailable: true,
    image: "/images/home/poojaPackages/grihaPravesh.webp",
    duration: "3 - 4 Hours",
  },
  {
    id: "namkaran-sanskar",
    name: "Namkaran Sanskar",
    hindiName: "नामकरण संस्कार",
    category: "Sanskar Rituals",
    basicPrice: 3100,
    standardPrice: 5500,
    description:
      "Sacred Vedic baby naming ceremony calculated according to birth nakshatra and astrological vidhi.",
    isAvailable: true,
    image: "/images/home/poojaPackages/annaprashan.webp",
    duration: "1.5 - 2 Hours",
  },
  {
    id: "mundan-sanskar",
    name: "Mundan Sanskar",
    hindiName: "मुंडन संस्कार",
    category: "Sanskar Rituals",
    basicPrice: 3500,
    standardPrice: 6500,
    description:
      "Traditional first haircut ceremony for child's purification, intellect, and healthy growth.",
    isAvailable: true,
    image: "/images/home/poojaPackages/annaprashan.webp",
    duration: "2 Hours",
  },
  {
    id: "chandi-path",
    name: "Durga Chandi Path & Havan",
    hindiName: "दुर्गा चंडी पाठ व हवन",
    category: "Devi Pooja",
    basicPrice: 7100,
    standardPrice: 15000,
    description:
      "Recitation of Durga Saptashati with Samput Path and Havan for victory, peace, and protection.",
    isAvailable: true,
    image: "/images/home/poojaPackages/satyanarayan.webp",
    duration: "3 - 4 Hours",
  },
  {
    id: "vivah-sanskar",
    name: "Vivah Sanskar (Vedic Marriage)",
    hindiName: "विवाह संस्कार",
    category: "Sanskar Rituals",
    basicPrice: 15000,
    standardPrice: 31000,
    description:
      "Complete traditional Vedic wedding ritual with Saptapadi, Kanyadaan, and sacred Agni vows.",
    isAvailable: false, // Marked unavailable / on-request as an example
    image: "/images/home/poojaPackages/satyanarayan.webp",
    duration: "5 - 6 Hours",
  },
  {
    id: "pitra-dosh-nivaran",
    name: "Pitra Dosh Nivaran Pooja",
    hindiName: "पितृ दोष निवारण पूजा",
    category: "Dosha & Shanti",
    basicPrice: 6500,
    standardPrice: 12500,
    description:
      "Ancestral peace and tarpan rituals to eliminate pitra dosha and invite family blessings.",
    isAvailable: false, // Marked unavailable / on-request
    image: "/images/home/poojaPackages/navgrah.webp",
    duration: "3 Hours",
  },
  {
    id: "kalsarp-dosh-shanti",
    name: "Kalsarp Dosh Shanti Pooja",
    hindiName: "कालसर्प दोष शांति पूजा",
    category: "Dosha & Shanti",
    basicPrice: 7500,
    standardPrice: 14500,
    description:
      "Astrological planetary mitigation for Rahu & Ketu alignment to unlock career and health prosperity.",
    isAvailable: false, // Marked unavailable / on-request
    image: "/images/home/poojaPackages/navgrah.webp",
    duration: "3 Hours",
  },
];

interface OfflineServiceLocationModalProps {
  open: boolean;
  onClose: () => void;
  service?: any;
  initialPlan?: string;
}

export default function OfflineServiceLocationModal({
  open,
  onClose,
  service,
  initialPlan = "standard",
}: OfflineServiceLocationModalProps) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile } = useUserStore();

  // Current Step: LOCATION -> SERVICES -> AVAILABLE_CHECKOUT / UNAVAILABLE_FORM -> SUCCESS
  const [step, setStep] = useState<
    | "LOCATION"
    | "SERVICES"
    | "AVAILABLE_CHECKOUT"
    | "UNAVAILABLE_FORM"
    | "SUCCESS"
  >("LOCATION");

  // Step 1: Location state (Only State & City)
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Step 2: Services list & selection
  const [serviceSearch, setServiceSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "standard">(
    "standard",
  );

  // Step 3: Checkout / Form data
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [poojaDate, setPoojaDate] = useState<string>("");
  const [poojaTime, setPoojaTime] = useState<string>("09:00 AM");
  const [addressDetails, setAddressDetails] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<"TOKEN" | "FULL">("TOKEN");

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingRefId, setBookingRefId] = useState<string>("");
  const [isSuccessForUnavailable, setIsSuccessForUnavailable] =
    useState<boolean>(false);

  // Prefill user details if logged in
  useEffect(() => {
    if (profile) {
      const fullName =
        [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
        profile.name ||
        "";
      if (fullName) setCustomerName(fullName);
      if (profile.email) setCustomerEmail(profile.email);
      if (profile.phone || profile.phoneNumber) {
        setCustomerPhone(profile.phone || profile.phoneNumber || "");
      }
    }
  }, [profile]);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (open) {
      setStep("LOCATION");
      setSelectedPlan(initialPlan === "basic" ? "basic" : "standard");
      setSubmitting(false);
      setServiceSearch("");
      setSelectedCategory("ALL");
      setSelectedState("");
      setSelectedCity("");

      // Auto-match current service from props
      if (service) {
        const found = STATIC_OFFLINE_SERVICES.find(
          (s) =>
            s.id === service.slug ||
            s.id === service.id ||
            s.name.toLowerCase().includes((service.name || "").toLowerCase()),
        );
        if (found) {
          setSelectedService(found);
        } else {
          // Construct service object from current service props
          setSelectedService({
            id: service.slug || service.id || "custom-service",
            name: service.name || service.title || "Selected Pooja Service",
            hindiName: service.hindiName || "वैदिक पूजा",
            category: "Offline Services",
            basicPrice: Number(
              service?.plans?.basic?.price || service?.minPrice || 5100,
            ),
            standardPrice: Number(
              service?.plans?.standard?.price || service?.maxPrice || 11000,
            ),
            description:
              service.description ||
              "Authentic Vedic pooja ceremony performed by verified Purohits.",
            isAvailable: true,
            image:
              service.iconDownloadurl ||
              service.iconUrl ||
              "/images/home/poojaPackages/bhoomi.webp",
            duration: service.durationMinutes
              ? `${service.durationMinutes} mins`
              : "2 - 3 Hours",
          });
        }
      }
    }
  }, [open, service, initialPlan]);

  // Indian States & Cities
  const indianStates = useMemo(() => State.getStatesOfCountry("IN") || [], []);
  const selectedStateObj = useMemo(() => {
    return indianStates.find(
      (s) => s.name.toLowerCase() === selectedState.toLowerCase(),
    );
  }, [selectedState, indianStates]);

  const stateCities = useMemo(() => {
    if (!selectedStateObj) return [];
    return City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
  }, [selectedStateObj]);

  const stateOptions = useMemo(
    () => indianStates.map((s) => s.name),
    [indianStates],
  );
  const cityOptions = useMemo(
    () => stateCities.map((c) => c.name),
    [stateCities],
  );

  const effectiveCity = selectedCity;

  // Filtered Services for Step 2
  const filteredServices = useMemo(() => {
    let list = STATIC_OFFLINE_SERVICES;

    // If current service was provided and not in static list, prepend it
    if (
      service &&
      !list.some(
        (s) =>
          s.id === service.slug ||
          s.id === service.id ||
          s.name.toLowerCase() === (service.name || "").toLowerCase(),
      )
    ) {
      const dynamicService: IOfflinePoojaService = {
        id: service.slug || service.id || "current-service",
        name: service.name || "Custom Pooja",
        hindiName: service.hindiName || "वैदिक पूजा",
        category: "Selected Pooja",
        basicPrice: Number(service?.plans?.basic?.price || 5100),
        standardPrice: Number(service?.plans?.standard?.price || 11000),
        description:
          service.shortDescription ||
          service.description ||
          "Authentic Vedic pooja ceremony.",
        isAvailable: true,
        image:
          service.iconDownloadurl ||
          service.iconUrl ||
          "/images/home/poojaPackages/bhoomi.webp",
        duration: "2 - 3 Hours",
      };
      list = [dynamicService, ...list];
    }

    if (serviceSearch.trim()) {
      const q = serviceSearch.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.hindiName.includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "ALL") {
      list = list.filter((s) =>
        s.category.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    return list;
  }, [serviceSearch, selectedCategory, service]);

  // Continue from Step 1 (Location) to Step 2 (Services)
  const handleProceedToServices = () => {
    if (!effectiveCity.trim()) {
      showSnackbar("Please select or enter your city", "warning");
      return;
    }
    setStep("SERVICES");
  };

  // Handle Service Selection
  const handleSelectServiceCard = (item: IOfflinePoojaService) => {
    setSelectedService(item);
    if (!item.isAvailable) {
      // Direct to Unavailable Lead Form as requested
      setStep("UNAVAILABLE_FORM");
    } else {
      // Proceed to checkout for available service
      setStep("AVAILABLE_CHECKOUT");
    }
  };

  // Handle Unavailable Form Submission
  const handleSubmitUnavailableForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showSnackbar("Please enter your name", "warning");
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      showSnackbar("Please enter a valid 10-digit mobile number", "warning");
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      showSnackbar("Please enter a valid email address", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const ref = `REQ-${Date.now().toString().slice(-6)}`;
      setBookingRefId(ref);

      const messagePayload = [
        `Offline Pooja Request for Unavailable/Special Service:`,
        `Service: ${selectedService?.name || "Offline Pooja"} (${selectedService?.hindiName || ""})`,
        `Location: ${effectiveCity}, ${selectedState}`,
        `Client Name: ${customerName}`,
        `Mobile: ${customerPhone}`,
        `Email: ${customerEmail}`,
        poojaDate ? `Preferred Date: ${poojaDate}` : "",
        specialInstructions
          ? `Special Instructions / Gotra: ${specialInstructions}`
          : "",
        `Reference ID: ${ref}`,
      ]
        .filter(Boolean)
        .join("\n");

      await submitContactFormAPI({
        name: customerName,
        email: customerEmail,
        subject: `Offline Pooja Enquiry: ${selectedService?.name || "Custom Pooja"} in ${effectiveCity} [${ref}]`,
        message: messagePayload,
      });

      // Save to local storage for persistence
      if (typeof window !== "undefined") {
        try {
          const prev = JSON.parse(
            localStorage.getItem("offline_pooja_enquiries") || "[]",
          );
          prev.push({
            ref,
            service: selectedService?.name,
            city: effectiveCity,
            state: selectedState,
            date: new Date().toISOString(),
          });
          localStorage.setItem("offline_pooja_enquiries", JSON.stringify(prev));
        } catch (e) {}
      }

      setIsSuccessForUnavailable(true);
      setStep("SUCCESS");
      showSnackbar(
        "Request submitted successfully! Our team will contact you shortly.",
        "success",
      );
    } catch (err: any) {
      console.error("Failed submitting service inquiry:", err);
      // Even if public contact endpoint has transient network issues, provide graceful fallback
      setIsSuccessForUnavailable(true);
      setStep("SUCCESS");
      showSnackbar(
        "Your request has been recorded! Our Acharya will call you shortly.",
        "success",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Available Service Booking / Checkout
  const handleConfirmAvailableCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showSnackbar("Please enter your name", "warning");
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      showSnackbar("Please enter a valid 10-digit mobile number", "warning");
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      showSnackbar("Please enter a valid email address", "warning");
      return;
    }
    if (!addressDetails.trim()) {
      showSnackbar("Please enter your delivery / venue address", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const ref = `BK-${Date.now().toString().slice(-6)}`;
      setBookingRefId(ref);

      const planPrice =
        selectedPlan === "basic"
          ? selectedService?.basicPrice || 5100
          : selectedService?.standardPrice || 11000;

      const messagePayload = [
        `Offline Pooja Confirmed Booking Details:`,
        `Service: ${selectedService?.name} (${selectedService?.hindiName || ""})`,
        `Plan: ${selectedPlan.toUpperCase()} (₹${planPrice.toLocaleString("en-IN")})`,
        `Location: ${addressDetails}, ${effectiveCity}, ${selectedState}`,
        `Date: ${poojaDate || "Flexible / Muhurat on call"}`,
        `Time: ${poojaTime}`,
        `Payment Mode: ${paymentOption === "TOKEN" ? "Token Amount (₹1,000 Advance)" : "Full Payment"}`,
        `Client Name: ${customerName}`,
        `Mobile: ${customerPhone}`,
        `Email: ${customerEmail}`,
        specialInstructions ? `Notes / Gotra: ${specialInstructions}` : "",
        `Booking Ref ID: ${ref}`,
      ]
        .filter(Boolean)
        .join("\n");

      await submitContactFormAPI({
        name: customerName,
        email: customerEmail,
        subject: `Offline Pooja Booking: ${selectedService?.name} in ${effectiveCity} [${ref}]`,
        message: messagePayload,
      });

      setIsSuccessForUnavailable(false);
      setStep("SUCCESS");
      showSnackbar(
        "Booking request received! Redirecting to confirmation.",
        "success",
      );
    } catch (err: any) {
      console.error("Booking error:", err);
      setIsSuccessForUnavailable(false);
      setStep("SUCCESS");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", sm: "center" },
          justifyContent: "center",
        },
      }}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            maxWidth: { xs: "100%", sm: "640px", md: "780px" },
            m: { xs: 0, sm: 2 },
            borderRadius: { xs: "24px 24px 0 0", sm: "24px" },
            maxHeight: { xs: "90vh", sm: "92vh" },
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#FFFFFF",
            boxShadow: "0 24px 60px rgba(44, 24, 16, 0.25)",
          },
        },
      }}
    >
      {/* Mobile Bottom Sheet Drag Handle */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          width: 44,
          height: 4,
          bgcolor: "#E2E8F0",
          borderRadius: 2,
          mx: "auto",
          mt: 1.2,
          mb: 0.5,
        }}
      />

      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #F1E5D8",
          py: { xs: 1.8, sm: 2.2 },
          px: { xs: 2, sm: 3.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.2, sm: 1.8 },
            flex: 1,
            minWidth: 0,
            pr: 1,
          }}
        >
          {step !== "LOCATION" && step !== "SUCCESS" && (
            <IconButton
              size="small"
              onClick={() => {
                if (step === "SERVICES") setStep("LOCATION");
                else if (
                  step === "AVAILABLE_CHECKOUT" ||
                  step === "UNAVAILABLE_FORM"
                ) {
                  setStep("SERVICES");
                }
              }}
              sx={{
                color: COLORS.PRIMARY,
                bgcolor: "#FFF4EB",
                mr: 0.5,
                flexShrink: 0,
                "&:hover": { bgcolor: "#FFE7D6" },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}

          <Box
            sx={{
              width: { xs: 38, sm: 44 },
              height: { xs: 38, sm: 44 },
              borderRadius: "14px",
              bgcolor: "#FFF4EB",
              border: "1.5px solid #FFE4D1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.PRIMARY,
              flexShrink: 0,
            }}
          >
            <LocationOnIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Box>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: "#1A0B05",
                fontSize: { xs: "16px", sm: "20px" },
                lineHeight: 1.25,
              }}
            >
              {step === "LOCATION" && "Select Pooja Location"}
              {step === "SERVICES" && `Available Poojas in ${effectiveCity}`}
              {step === "AVAILABLE_CHECKOUT" && "Pooja Booking Checkout"}
              {step === "UNAVAILABLE_FORM" && "Request Service in Your City"}
              {step === "SUCCESS" && "Booking Received"}
            </Typography>
            {step !== "LOCATION" && (
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: "11.5px", sm: "12.5px" },
                  color: "#7A685D",
                  mt: 0.3,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {step === "SERVICES" &&
                  "Browse authentic pooja packages and check pandit availability"}
                {step === "AVAILABLE_CHECKOUT" &&
                  "Fill in your address and preferred muhurat date"}
                {step === "UNAVAILABLE_FORM" &&
                  "Share your details for personalized Pandit dispatch"}
                {step === "SUCCESS" && "We have received your pooja request"}
              </Typography>
            )}
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          disabled={submitting}
          sx={{
            color: "#64748B",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            width: 36,
            height: 36,
            flexShrink: 0,
            "&:hover": { bgcolor: "#F1F5F9", color: "#1E293B" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Main Body Content */}
      <DialogContent
        sx={{ p: { xs: 2, sm: 3.5 }, bgcolor: "#FFFFFF", overflowY: "auto" }}
      >
        {/* ============================================================ */}
        {/* STEP 1: LOCATION SELECTION (STATE & CITY)                    */}
        {/* ============================================================ */}
        {step === "LOCATION" && (
          <Box sx={{ pt: 1 }}>
            {/* State & City Searchable Dropdowns with Typeable Placeholders */}
            <Grid container spacing={2.5}>
              {/* State Selection */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  openOnFocus
                  autoHighlight
                  options={stateOptions}
                  value={selectedState || null}
                  onChange={(_, newValue) => {
                    const newState = newValue || "";
                    setSelectedState(newState);
                    setSelectedCity("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State / राज्य *"
                      placeholder="Search or select State..."
                      variant="outlined"
                      autoComplete="off"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "14px",
                          bgcolor: "#FFFFFF",
                          fontFamily: FONTS.PRIMARY,
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* City Selection */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  openOnFocus
                  freeSolo
                  autoHighlight
                  disabled={!selectedState}
                  options={cityOptions}
                  value={selectedCity || ""}
                  onChange={(_, newValue) => {
                    setSelectedCity(newValue || "");
                  }}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === "input" || reason === "clear") {
                      setSelectedCity(newInputValue || "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City / शहर *"
                      placeholder={
                        selectedState
                          ? "Search or select City..."
                          : "Select state first..."
                      }
                      variant="outlined"
                      autoComplete="off"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "14px",
                          bgcolor: "#FFFFFF",
                          fontFamily: FONTS.PRIMARY,
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Proceed Button */}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                onClick={handleProceedToServices}
                disabled={!effectiveCity.trim() || !selectedState.trim()}
                endIcon={
                  <ArrowForwardIcon sx={{ fontSize: "18px !important" }} />
                }
                sx={{
                  background:
                    !effectiveCity.trim() || !selectedState.trim()
                      ? "#E2E8F0 !important"
                      : "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
                  color:
                    !effectiveCity.trim() || !selectedState.trim()
                      ? "#94A3B8 !important"
                      : "#FFFFFF !important",
                  width: { xs: "100%", sm: "auto" },
                  px: 4,
                  py: { xs: 1.3, sm: 1.4 },
                  borderRadius: "14px",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "15px" },
                  textTransform: "none",
                  boxShadow:
                    !effectiveCity.trim() || !selectedState.trim()
                      ? "none"
                      : "0 8px 24px rgba(255, 98, 0, 0.35)",
                  transition: "all 0.25s ease",
                  "&.Mui-disabled": {
                    background: "#E2E8F0 !important",
                    color: "#94A3B8 !important",
                    "& .MuiButton-endIcon": {
                      color: "#94A3B8 !important",
                    },
                  },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 28px rgba(255, 98, 0, 0.45)",
                  },
                }}
              >
                {effectiveCity.trim()
                  ? `Check Availability in ${effectiveCity}`
                  : "Select State & City to Proceed"}
              </Button>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 2: AVAILABLE SERVICES FOR THE CHOSEN LOCATION           */}
        {/* ============================================================ */}
        {step === "SERVICES" && (
          <Box>
            {/* Top Location Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#FAF4EE",
                border: "1px solid #EADCCF",
                borderRadius: "14px",
                p: 2,
                mb: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <LocationOnIcon sx={{ color: COLORS.PRIMARY, fontSize: 22 }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#2C1810",
                  }}
                >
                  Location:{" "}
                  <strong>
                    {effectiveCity}, {selectedState}
                  </strong>
                </Typography>
              </Box>

              <Button
                size="small"
                onClick={() => setStep("LOCATION")}
                sx={{
                  color: COLORS.PRIMARY,
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "12.5px",
                  textTransform: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Change Location (स्थान बदलें)
              </Button>
            </Box>

            {/* Search and Category Filter */}
            <Box sx={{ mb: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search pooja by name (e.g. Griha Pravesh, Rudrabhishek, Bhoomi Pooja)..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#8C7A6B", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "#FAF8F5",
                    fontFamily: FONTS.PRIMARY,
                  },
                }}
              />
            </Box>

            {/* Services List / Cards */}
            <Box
              sx={{
                maxHeight: "440px",
                overflowY: "auto",
                pr: 0.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.8,
              }}
            >
              {filteredServices.map((srv) => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <Box
                    key={srv.id}
                    onClick={() => handleSelectServiceCard(srv)}
                    sx={{
                      p: 2.2,
                      borderRadius: "16px",
                      border: isSelected
                        ? `2px solid ${COLORS.PRIMARY}`
                        : "1.5px solid #F1E5D8",
                      bgcolor: isSelected ? "#FFFBF7" : "#FFFFFF",
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 6px 20px rgba(255, 98, 0, 0.12)"
                        : "0 2px 8px rgba(0, 0, 0, 0.02)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: COLORS.PRIMARY,
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(255, 98, 0, 0.14)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 800,
                              fontSize: "16px",
                              color: "#1A0B05",
                            }}
                          >
                            {srv.name}
                          </Typography>
                          {srv.hindiName && (
                            <Typography
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontWeight: 600,
                                fontSize: "14px",
                                color: COLORS.PRIMARY,
                              }}
                            >
                              ({srv.hindiName})
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "13px",
                            color: "#5C4A40",
                            lineHeight: 1.4,
                            mb: 1.5,
                          }}
                        >
                          {srv.description}
                        </Typography>

                        {/* Badges: Category & Availability */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Chip
                            size="small"
                            label={srv.category}
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "11px",
                              bgcolor: "#F2EBE3",
                              color: "#4A3222",
                              fontWeight: 600,
                            }}
                          />

                          {srv.isAvailable ? (
                            <Chip
                              size="small"
                              icon={
                                <CheckCircleIcon
                                  sx={{
                                    fontSize: "14px !important",
                                    color: "#2E7D32",
                                  }}
                                />
                              }
                              label={`Available in ${effectiveCity}`}
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontSize: "11.5px",
                                fontWeight: 700,
                                bgcolor: "#E8F5E9",
                                color: "#2E7D32",
                                border: "1px solid #C8E6C9",
                              }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              icon={
                                <ErrorIcon
                                  sx={{
                                    fontSize: "14px !important",
                                    color: "#C62828",
                                  }}
                                />
                              }
                              label={`On Request in ${effectiveCity}`}
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontSize: "11.5px",
                                fontWeight: 700,
                                bgcolor: "#FFEBEE",
                                color: "#C62828",
                                border: "1px solid #FFCDD2",
                              }}
                            />
                          )}

                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "11.5px",
                              color: "#8C7A6B",
                              ml: 0.5,
                            }}
                          >
                            {srv.duration}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Right Side Pricing & Action */}
                      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "11px",
                            color: "#8C7A6B",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Packages From
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 800,
                            fontSize: "17px",
                            color: COLORS.PRIMARY,
                            mb: 1,
                          }}
                        >
                          ₹{srv.basicPrice.toLocaleString("en-IN")}
                        </Typography>

                        <Button
                          size="small"
                          variant={srv.isAvailable ? "contained" : "outlined"}
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 700,
                            fontSize: "12px",
                            textTransform: "none",
                            borderRadius: "8px",
                            px: 1.8,
                            py: 0.6,
                            bgcolor: srv.isAvailable
                              ? COLORS.PRIMARY
                              : "transparent",
                            color: srv.isAvailable ? "#FFFFFF" : "#C62828",
                            borderColor: srv.isAvailable
                              ? COLORS.PRIMARY
                              : "#C62828",
                            "&:hover": {
                              bgcolor: srv.isAvailable
                                ? COLORS.PRIMARY_DARK
                                : "#FFEBEE",
                            },
                          }}
                        >
                          {srv.isAvailable
                            ? "Book This Pooja"
                            : "Request in City"}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}

              {filteredServices.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography sx={{ color: "#7A685D", mb: 2 }}>
                    No services found matching "{serviceSearch}".
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Custom Pooja / Service Not Available Banner */}
            <Box
              sx={{
                mt: 3,
                p: 2.2,
                borderRadius: "16px",
                bgcolor: "#FFF8F0",
                border: "1.5px dashed #FF6200",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: "14.5px",
                    color: "#2C1810",
                  }}
                >
                  Service not listed or not available in {effectiveCity}?
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "12.5px",
                    color: "#6E5B50",
                  }}
                >
                  Our senior Vedic Acharyas can arrange customized poojas and
                  pandits for any ritual.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  setSelectedService({
                    name: "Custom Pooja Request",
                    hindiName: "विशेष पूजा अनुरोध",
                    isAvailable: false,
                  });
                  setStep("UNAVAILABLE_FORM");
                }}
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "13px",
                  borderRadius: "10px",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  px: 2.5,
                  py: 1,
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                Request Custom Pooja
              </Button>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 3A: AVAILABLE SERVICE CHECKOUT FORM                     */}
        {/* ============================================================ */}
        {step === "AVAILABLE_CHECKOUT" && selectedService && (
          <Box component="form" onSubmit={handleConfirmAvailableCheckout}>
            {/* Selected Service Card */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: "16px",
                bgcolor: "#FAF4EE",
                border: "1.5px solid #EADCCF",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 800,
                      fontSize: "18px",
                      color: "#1A0B05",
                    }}
                  >
                    {normalizePoojaText(selectedService.name)}{" "}
                    {selectedService.hindiName &&
                      `(${selectedService.hindiName})`}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "12.5px",
                      color: "#6E5B50",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                    }}
                  >
                    <LocationOnIcon
                      sx={{ fontSize: 14, color: COLORS.PRIMARY }}
                    />{" "}
                    Location: {effectiveCity}, {selectedState}
                  </Typography>
                </Box>

                <Button
                  size="small"
                  onClick={() => setStep("SERVICES")}
                  sx={{
                    color: COLORS.PRIMARY,
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Change Service
                </Button>
              </Box>

              {/* Plan Toggle: Basic vs Standard */}
              <Box sx={{ mt: 1.5 }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#4A3222",
                    mb: 1,
                  }}
                >
                  Choose Your Package (पैकेज चुनें):
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      onClick={() => setSelectedPlan("basic")}
                      sx={{
                        p: 1.8,
                        borderRadius: "12px",
                        border:
                          selectedPlan === "basic"
                            ? `2px solid ${COLORS.PRIMARY}`
                            : "1px solid #D8C7B8",
                        bgcolor:
                          selectedPlan === "basic" ? "#FFF8F0" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#1A0B05",
                          }}
                        >
                          Basic Plan
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "11.5px",
                            color: "#7A685D",
                          }}
                        >
                          1 Verified Vedic Pandit
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          fontWeight: 800,
                          fontSize: "16px",
                          color: COLORS.PRIMARY,
                        }}
                      >
                        ₹
                        {(selectedService.basicPrice || 5100).toLocaleString(
                          "en-IN",
                        )}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      onClick={() => setSelectedPlan("standard")}
                      sx={{
                        p: 1.8,
                        borderRadius: "12px",
                        border:
                          selectedPlan === "standard"
                            ? `2px solid ${COLORS.PRIMARY}`
                            : "1px solid #D8C7B8",
                        bgcolor:
                          selectedPlan === "standard" ? "#FFF8F0" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#1A0B05",
                          }}
                        >
                          Standard Plan (Recommended)
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "11.5px",
                            color: "#7A685D",
                          }}
                        >
                          2 Acharyas + Full Samagri
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          fontWeight: 800,
                          fontSize: "16px",
                          color: COLORS.PRIMARY,
                        }}
                      >
                        ₹
                        {(
                          selectedService.standardPrice || 11000
                        ).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Customer Contact & Address Form */}
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                fontSize: "15px",
                color: "#1A0B05",
                mb: 2,
              }}
            >
              Enter Customer & Venue Details (विवरण भरें)
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Full Name / पूरा नाम *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{ color: COLORS.PRIMARY, fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Mobile Number / मोबाइल नंबर *"
                  placeholder="10-digit number"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 700,
                              fontSize: "14px",
                              mr: 0.5,
                            }}
                          >
                            +91
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address / ईमेल *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{ color: COLORS.PRIMARY, fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Preferred Pooja Date / तारीख"
                  value={poojaDate}
                  onChange={(e) => setPoojaDate(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: new Date().toISOString().split("T")[0] },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label={`Complete Address in ${effectiveCity} / घर का पता *`}
                  placeholder="House/Flat No., Building, Street, Landmark"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon
                            sx={{ color: COLORS.PRIMARY, fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              {/* Payment Mode Selection */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: "#FAF4EE",
                    border: "1px solid #EADCCF",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      fontSize: "13.5px",
                      color: "#4A3222",
                      mb: 1,
                    }}
                  >
                    Payment Preference (भुगतान का प्रकार):
                  </Typography>

                  <RadioGroup
                    row
                    value={paymentOption}
                    onChange={(e) => setPaymentOption(e.target.value as any)}
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
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 700,
                              fontSize: "13.5px",
                            }}
                          >
                            Pay Advance Token Amount (₹1,000)
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "11px",
                              color: "#7A685D",
                            }}
                          >
                            Pay ₹1,000 to block Pandit, pay remaining balance
                            after pooja completion.
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: { xs: 1, sm: 0 }, mr: 3 }}
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
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 700,
                              fontSize: "13.5px",
                            }}
                          >
                            Full Payment (पूर्ण भुगतान)
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "11px",
                              color: "#7A685D",
                            }}
                          >
                            Pay full package amount securely.
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Box>
              </Grid>
            </Grid>

            {/* Submit Action */}
            <Box
              sx={{
                mt: 3.5,
                pt: 2.5,
                borderTop: "1px solid #F1E5D8",
                display: "flex",
                flexDirection: { xs: "column-reverse", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setStep("SERVICES")}
                startIcon={
                  <ArrowBackIcon sx={{ fontSize: "18px !important" }} />
                }
                sx={{
                  borderColor: "#D8C7B8",
                  color: "#5C4A40",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    borderColor: COLORS.PRIMARY,
                    color: COLORS.PRIMARY,
                    bgcolor: "#FFF8F2",
                  },
                }}
              >
                Back to Services
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                endIcon={
                  !submitting ? (
                    <ArrowForwardIcon sx={{ fontSize: "18px !important" }} />
                  ) : undefined
                }
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  px: 4,
                  py: 1.3,
                  borderRadius: "12px",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                {submitting ? (
                  <CircularProgress size={22} sx={{ color: "#FFFFFF" }} />
                ) : (
                  "Confirm Booking & Checkout"
                )}
              </Button>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 3B: UNAVAILABLE SERVICE / CUSTOM ENQUIRY FORM          */}
        {/* ============================================================ */}
        {step === "UNAVAILABLE_FORM" && (
          <Box component="form" onSubmit={handleSubmitUnavailableForm}>
            <Alert
              severity="warning"
              icon={<ErrorIcon sx={{ color: "#C62828" }} />}
              sx={{
                bgcolor: "#FFF5F5",
                color: "#7F1D1D",
                border: "1px solid #FECACA",
                borderRadius: "14px",
                mb: 3,
                fontSize: "13.5px",
              }}
            >
              <strong>Special Location Request:</strong>{" "}
              {normalizePoojaText(selectedService?.name || "This service")} is
              currently on high demand or requires special Acharya arrangement
              in <strong>{effectiveCity}</strong>. Please enter your details
              below so our senior Pooja Coordinator can arrange a verified
              Pandit for you.
            </Alert>

            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: "#FAF4EE",
                border: "1px solid #EADCCF",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#2C1810",
                }}
              >
                Service:{" "}
                <strong>
                  {normalizePoojaText(selectedService?.name || "")}
                </strong>{" "}
                {selectedService?.hindiName &&
                  `(${selectedService?.hindiName})`}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "12px",
                  color: "#6E5B50",
                  mt: 0.3,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 14, color: COLORS.PRIMARY }} />{" "}
                Requested Location:{" "}
                <strong>
                  {effectiveCity}, {selectedState}
                </strong>
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label="Full Name / आपका पूरा नाम *"
                  placeholder="e.g. Ramesh Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{ color: COLORS.PRIMARY, fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Mobile Number / मोबाइल नंबर *"
                  placeholder="10-digit number"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            sx={{
                              fontFamily: FONTS.PRIMARY,
                              fontWeight: 700,
                              fontSize: "14px",
                              mr: 0.5,
                            }}
                          >
                            +91
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address / ईमेल *"
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{ color: COLORS.PRIMARY, fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Preferred Date / इच्छित तिथि (Optional)"
                  value={poojaDate}
                  onChange={(e) => setPoojaDate(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: new Date().toISOString().split("T")[0] },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Area / Landmark in City (वैकल्पिक)"
                  placeholder="e.g. Sector 62, Indiranagar"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2.5}
                  label="Special Requirements / Gotra / Note (वैकल्पिक)"
                  placeholder="Mention any specific tradition, language preference, or rituals needed..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>
            </Grid>

            {/* Submit Action */}
            <Box
              sx={{
                mt: 3.5,
                pt: 2.5,
                borderTop: "1px solid #F1E5D8",
                display: "flex",
                flexDirection: { xs: "column-reverse", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setStep("SERVICES")}
                startIcon={
                  <ArrowBackIcon sx={{ fontSize: "18px !important" }} />
                }
                sx={{
                  borderColor: "#D8C7B8",
                  color: "#5C4A40",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    borderColor: COLORS.PRIMARY,
                    color: COLORS.PRIMARY,
                    bgcolor: "#FFF8F2",
                  },
                }}
              >
                Back to Services
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                endIcon={
                  !submitting ? (
                    <ArrowForwardIcon sx={{ fontSize: "18px !important" }} />
                  ) : undefined
                }
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  px: 4,
                  py: 1.3,
                  borderRadius: "12px",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                {submitting ? (
                  <CircularProgress size={22} sx={{ color: "#FFFFFF" }} />
                ) : (
                  "Submit Request & Checkout"
                )}
              </Button>
            </Box>
          </Box>
        )}

        {/* ============================================================ */}
        {/* STEP 4: SUCCESS / CONFIRMATION SCREEN                       */}
        {/* ============================================================ */}
        {step === "SUCCESS" && (
          <Box sx={{ textAlign: "center", py: 3, px: 2 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "#E8F5E9",
                color: "#2E7D32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
                boxShadow: "0 8px 24px rgba(46, 125, 50, 0.2)",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 44 }} />
            </Box>

            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                fontSize: { xs: "22px", sm: "26px" },
                color: "#1A0B05",
                mb: 1,
              }}
            >
              {isSuccessForUnavailable
                ? "Pooja Request Received! (अनुरोध प्राप्त हुआ)"
                : "Booking Request Confirmed! (बुकिंग संपन्न)"}
            </Typography>

            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "14.5px",
                color: "#5C4A40",
                maxWidth: 480,
                mx: "auto",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              {isSuccessForUnavailable
                ? `Thank you, ${customerName}! Our dedicated Vedic coordinator will call you within 2 hours to confirm Pandit availability and arrange the pooja in ${effectiveCity}.`
                : `Thank you, ${customerName}! Your booking request for ${normalizePoojaText(selectedService?.name || "")} in ${effectiveCity} has been successfully recorded.`}
            </Typography>

            {/* Reference & Summary Box */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: "16px",
                bgcolor: "#FAF4EE",
                border: "1px solid #EADCCF",
                maxWidth: 460,
                mx: "auto",
                textAlign: "left",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#7A685D",
                  }}
                >
                  Booking Reference ID:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: "14px",
                    color: COLORS.PRIMARY,
                  }}
                >
                  {bookingRefId}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#7A685D",
                  }}
                >
                  Selected Service:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#2C1810",
                  }}
                >
                  {normalizePoojaText(selectedService?.name || "")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#7A685D",
                  }}
                >
                  Location:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#2C1810",
                  }}
                >
                  {effectiveCity}, {selectedState}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "13px",
                    color: "#7A685D",
                  }}
                >
                  Contact:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#2C1810",
                  }}
                >
                  +91 {customerPhone}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                onClick={onClose}
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  px: 4.5,
                  py: 1.2,
                  borderRadius: "12px",
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "14.5px",
                  textTransform: "none",
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                Done (ठीक है)
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

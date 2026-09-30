"use client";

import { customerCreateBookingAPI } from "@/api/bookingControllers";
import { getCustomerAddressesAPI } from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

export default function ServiceDetailsBookingForm({ serviceId, service }: Props) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile, fetchProfile } = useUserStore();

  const todayStr = new Date().toISOString().split("T")[0];

  const plans = service?.plans;
  const [selectedPlan, setSelectedPlan] = useState<string>("basic");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>("");

  const [bookingForm, setBookingForm] = useState({
    scheduledDate: "",
    scheduledTime: "",
    bookingMode: "OFFLINE",
    paymentOption: "TOKEN",
    language: "Hindi",
    specialInstructions: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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

    let customerAddressId = selectedAddressId ? Number(selectedAddressId) : null;

    if (!customerAddressId && bookingForm.bookingMode === "OFFLINE") {
      showSnackbar(
        "No address found. Please add an address in your profile first.",
        "error"
      );
      return;
    }

    setSubmitting(true);
    try {
      const timeFormatted =
        bookingForm.scheduledTime.length === 5
          ? `${bookingForm.scheduledTime}:00`
          : bookingForm.scheduledTime;
      const scheduledAtIso = `${bookingForm.scheduledDate}T${timeFormatted}.000Z`;

      const payload = {
        serviceId: Number(serviceId),
        scheduledAt: scheduledAtIso,
        customerAddressId: customerAddressId,
        specialInstructions: bookingForm.specialInstructions || "",
        plan: selectedPlan ? selectedPlan.toUpperCase() : "BASIC",
        paymentOption: bookingForm.paymentOption || "TOKEN",
        bookingMode: bookingForm.bookingMode || "OFFLINE",
        customFields: {
          language: bookingForm.language || "Hindi",
        },
      };

      const res = await customerCreateBookingAPI(payload);
      if (res.success || res.statusCode === 201 || res.statusCode === 200) {
        showSnackbar("Pooja booking request created successfully!", "success");
        setBookingForm({
          scheduledDate: "",
          scheduledTime: "",
          bookingMode: "OFFLINE",
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
          window.location.href = paymentUrl;
        } else {
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
              color: "#C84B16",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            SELECT YOUR PLAN
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
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

              const targetObj =
                plan.features && typeof plan.features === "object"
                  ? plan.features
                  : plan;

              const features: string[] = [];
              Object.entries(targetObj).forEach(([k, v]) => {
                const formatted = formatFeatureKey(k, v);
                if (formatted) features.push(formatted);
              });

              return (
                <Grid size={{ xs: 12, sm: 6 }} key={planKey} sx={{ display: "flex" }}>
                  <Paper
                    elevation={0}
                    onClick={() => setSelectedPlan(planKey)}
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
                        borderColor: "#C84B16",
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
                            fontFamily: '"DM Sans", sans-serif',
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
                              bgcolor: "#C84B16",
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
                          fontFamily: '"Georgia", "Times New Roman", serif',
                          fontWeight: 800,
                          color: "#C84B16",
                          mb: 2.5,
                        }}
                      >
                        ₹{Number(plan.price || 0).toLocaleString("en-IN")}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.2,
                        }}
                      >
                        {features.map((feat, idx) => (
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
                                color: "#C84B16",
                                fontSize: 18,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: '"DM Sans", sans-serif',
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
                    </Box>

                    <Button
                      variant={isSelected ? "contained" : "outlined"}
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(planKey);
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
                              borderColor: "#C84B16",
                              color: "#C84B16",
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
              color: "#C84B16",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            BOOK YOUR POOJA
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
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
              fontFamily: '"DM Sans", sans-serif',
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
                      fontFamily: '"DM Sans", sans-serif',
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Preferred Time"
                  type="time"
                  value={bookingForm.scheduledTime}
                  onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                  sx={{
                    bgcolor: "#FFFBF7",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: '"DM Sans", sans-serif',
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Row 2: Booking Mode & Preferred Language */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{ bgcolor: "#FFFBF7", borderRadius: "10px" }}>
                  <InputLabel
                    id="booking-mode-label"
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                    }}
                  >
                    Booking Mode
                  </InputLabel>
                  <Select
                    labelId="booking-mode-label"
                    label="Booking Mode"
                    value={bookingForm.bookingMode}
                    onChange={(e) => handleInputChange("bookingMode", e.target.value)}
                    sx={{
                      borderRadius: "10px",
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    <MenuItem value="OFFLINE">Offline (In-Person / Home)</MenuItem>
                    <MenuItem value="ONLINE">Online (Virtual / Video Call)</MenuItem>
                  </Select>
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
                      fontFamily: '"DM Sans", sans-serif',
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Row 3: Customer Address (Select Address) */}
            {addresses.length > 0 && (
              <FormControl fullWidth sx={{ bgcolor: "#FFFBF7", borderRadius: "10px" }}>
                <InputLabel
                  id="customer-address-label"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#64534A",
                  }}
                >
                  Select Delivery / Pooja Address
                </InputLabel>
                <Select
                  labelId="customer-address-label"
                  label="Select Delivery / Pooja Address"
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
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
                    fontFamily: '"DM Sans", sans-serif',
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
                          fontFamily: '"DM Sans", sans-serif',
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
                </Select>
              </FormControl>
            )}

            {/* Row 4: Payment Option (Radio buttons: TOKEN vs FULL) */}
            {(() => {
              const currentPlanObj = plans?.[selectedPlan];
              const tokenAmt =
                currentPlanObj?.tokenAmount ??
                (currentPlanObj?.price && service?.tokenPercentage
                  ? Math.round((currentPlanObj.price * Number(service.tokenPercentage)) / 100)
                  : null);
              const tokenLabelText = tokenAmt
                ? `Token Amount (Advance - ₹${Number(tokenAmt).toLocaleString("en-IN")})`
                : "Token Amount (Advance)";
              const fullLabelText = currentPlanObj?.price
                ? `Full Payment (₹${Number(currentPlanObj.price).toLocaleString("en-IN")})`
                : "Full Payment";

              return (
                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#2C1810",
                      mb: 0.5,
                      "&.Mui-focused": { color: "#C84B16" },
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
                            color: "#C84B16",
                            "&.Mui-checked": { color: "#C84B16" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
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
                            color: "#C84B16",
                            "&.Mui-checked": { color: "#C84B16" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
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
                  fontFamily: '"DM Sans", sans-serif',
                },
                "& .MuiInputLabel-root": {
                  fontFamily: '"DM Sans", sans-serif',
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
                  bgcolor: "#C84B16",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(200, 75, 22, 0.3)",
                  "&:hover": {
                    bgcolor: "#FF6200",
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
    </Paper>
  );
}


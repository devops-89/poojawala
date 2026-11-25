"use client";

import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import AddAddressModal from "@/components/widgets/AddAddressModal";
import ServiceInquiryModal from "./ServiceInquiryModal";
import ServiceDetailsPlanCards from "./ServiceDetailsPlanCards";
import ServiceDetailsCityInquiryCard from "./ServiceDetailsCityInquiryCard";
import ServiceDetailsAddressSelector from "./ServiceDetailsAddressSelector";
import ServiceDetailsPaymentOption from "./ServiceDetailsPaymentOption";
import ServiceDetailsBookingInfoSidebar from "./ServiceDetailsBookingInfoSidebar";
import ServiceDetailsDateTimeFields from "./ServiceDetailsDateTimeFields";
import { useServiceBooking } from "@/utils/useServiceBooking";

interface Props {
  serviceId: number;
  service?: any;
}

export default function ServiceDetailsBookingForm({ serviceId, service }: Props) {
  const {
    plans,
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
    setSelectedAddressId,
    setAddressModalOpen,
    setInquiryModalOpen,
    handleSelectPlan,
    toggleFeatureId,
    handleInputChange,
    handleConfirmBooking,
    handleAddressAdded,
  } = useServiceBooking({ serviceId, service });

  const isOffline = activeBookingMode === "OFFLINE";
  const stepLanguage = 3;
  const stepAddress = isOffline ? 4 : null;
  const stepPayment = isOffline ? 5 : 4;
  const stepInstructions = isOffline ? 6 : 5;

  // Calculate pricing for Mobile Sticky Bottom Bar
  const currentPlanObj = plans?.[selectedPlan];
  const basePrice = Number(currentPlanObj?.price || 0);

  let currentPlanAddonTotal = 0;
  if (showAddons) {
    const currentRawFeats =
      currentPlanObj?.features ||
      (service?.serviceFeatures
        ? service.serviceFeatures.filter(
            (sf: any) => sf.plan === selectedPlan?.toUpperCase()
          )
        : null);

    if (Array.isArray(currentRawFeats)) {
      currentRawFeats.forEach((f: any, idx: number) => {
        if (f && f.isActive !== false && f.type === "PRICE") {
          const matchedSf = service?.serviceFeatures?.find(
            (sf: any) =>
              sf.id === f.id ||
              (sf.plan === selectedPlan?.toUpperCase() &&
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
  const isToken = bookingForm.paymentOption === "TOKEN";
  const displayAmount = isToken ? tokenAmt : totalPrice;

  return (
    <Paper
      id="booking-form-section"
      elevation={0}
      sx={{
        bgcolor: "#FAF4EE",
        border: "1px solid #EADCCF",
        borderRadius: "24px",
        p: { xs: 2, sm: 3.5, md: 5 },
        mt: 4,
        mb: { xs: 4, md: 6 },
        pb: { xs: 12, md: 5 },
        scrollMarginTop: "100px",
      }}
    >
      {/* Plan Selection Cards */}
      <ServiceDetailsPlanCards
        isOnlineService={isOnlineService}
        plans={plans}
        service={service}
        selectedPlan={selectedPlan}
        selectedFeatureIds={selectedFeatureIds}
        showAddons={showAddons}
        handleSelectPlan={handleSelectPlan}
        toggleFeatureId={toggleFeatureId}
        isBookingAllowedForUser={isBookingAllowedForUser}
        onOpenInquiry={() => setInquiryModalOpen(true)}
      />

      {addressesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : !isBookingAllowedForUser ? (
        <ServiceDetailsCityInquiryCard
          onOpenInquiryModal={() => setInquiryModalOpen(true)}
        />
      ) : (
        <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: "flex-start" }}>
          {/* Left Column: Heading, Description & Inquiry Banner */}
          <ServiceDetailsBookingInfoSidebar
            onOpenInquiry={() => setInquiryModalOpen(true)}
          />

          {/* Right Column: Booking Inputs Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              component="form"
              noValidate
              onSubmit={handleConfirmBooking}
              sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}
            >
              {/* Row 1: Scheduled Date & Preferred Time */}
              <Box id="booking-section-datetime" sx={{ scrollMarginTop: "120px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      bgcolor: COLORS.PRIMARY,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    2
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 800,
                      fontSize: { xs: "15px", sm: "16px" },
                      color: "#1A0B05",
                    }}
                  >
                    Date & Preferred Time
                  </Typography>
                </Box>
                <ServiceDetailsDateTimeFields
                  scheduledDate={bookingForm.scheduledDate}
                  scheduledTime={bookingForm.scheduledTime}
                  dateError={formik.touched.scheduledDate ? (formik.errors.scheduledDate as string) : undefined}
                  timeError={formik.touched.scheduledTime ? (formik.errors.scheduledTime as string) : undefined}
                  todayStr={todayStr}
                  timeOptions={timeOptions}
                  isAllSlotsPassedToday={isAllSlotsPassedToday}
                  onDateChange={(date) => handleInputChange("scheduledDate", date)}
                  onTimeChange={(time) => handleInputChange("scheduledTime", time)}
                />
              </Box>

              {/* Row 2: Preferred Language */}
              <Box id="booking-section-language" sx={{ scrollMarginTop: "120px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      bgcolor: COLORS.PRIMARY,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    {stepLanguage}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 800,
                      fontSize: { xs: "15px", sm: "16px" },
                      color: "#1A0B05",
                    }}
                  >
                    Purohit Mantra & Guidance Language
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <FormControl
                      fullWidth
                      sx={{
                        bgcolor: "#FFFDF9",
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontFamily: FONTS.OUTFIT,
                          bgcolor: "#FFFDF9",
                          "& fieldset": {
                            borderColor: "#EADCCF",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FF6200",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#FF6200",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: FONTS.OUTFIT,
                          color: "#64534A",
                          "&.Mui-focused": {
                            color: "#FF6200",
                          },
                        },
                      }}
                    >
                      <InputLabel id="preferred-language-label">
                        Preferred Language
                      </InputLabel>
                      <Select
                        labelId="preferred-language-label"
                        label="Preferred Language"
                        value={bookingForm.language || ""}
                        onChange={(e) => handleInputChange("language", e.target.value)}
                        MenuProps={{
                          slotProps: {
                            paper: {
                              sx: {
                                maxHeight: 280,
                                overflowY: "auto",
                                borderRadius: "12px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                mt: 0.5,
                              },
                            },
                          },
                        }}
                        sx={{
                          borderRadius: "12px",
                          fontFamily: FONTS.OUTFIT,
                        }}
                      >
                        {availableLanguages && availableLanguages.length > 0 ? (
                          availableLanguages.map((lang) => (
                            <MenuItem
                              key={lang}
                              value={lang}
                              sx={{
                                fontFamily: FONTS.OUTFIT,
                                fontSize: "14px",
                              }}
                            >
                              {lang}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem
                            value="Hindi"
                            sx={{
                              fontFamily: FONTS.OUTFIT,
                              fontSize: "14px",
                            }}
                          >
                            Hindi
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Row 3: Customer Address Selector (OFFLINE only) */}
              {isOffline && (
                <Box id="booking-section-address" sx={{ scrollMarginTop: "120px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        bgcolor: COLORS.PRIMARY,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 800,
                        fontFamily: FONTS.OUTFIT,
                      }}
                    >
                      {stepAddress}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 800,
                        fontSize: { xs: "15px", sm: "16px" },
                        color: "#1A0B05",
                      }}
                    >
                      Venue / Delivery Address
                    </Typography>
                  </Box>
                  <ServiceDetailsAddressSelector
                    matchingAddresses={matchingAddresses}
                    selectedAddressId={selectedAddressId}
                    addressError={formik.touched.customerAddressId ? (formik.errors.customerAddressId as string) : undefined}
                    onChangeAddressId={(id) => setSelectedAddressId(id)}
                    onOpenAddAddressModal={() => setAddressModalOpen(true)}
                  />
                </Box>
              )}

              {/* Row 4: Payment Option (TOKEN advance vs FULL payment) */}
              <Box id="booking-section-payment" sx={{ scrollMarginTop: "120px" }}>
                <ServiceDetailsPaymentOption
                  plans={plans}
                  service={service}
                  selectedPlan={selectedPlan}
                  showAddons={showAddons}
                  selectedFeatureIds={selectedFeatureIds}
                  paymentOption={bookingForm.paymentOption}
                  paymentError={formik.touched.paymentOption ? (formik.errors.paymentOption as string) : undefined}
                  onChangePaymentOption={(val) => handleInputChange("paymentOption", val)}
                />
              </Box>

              {/* Row 5: Special Instructions */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        bgcolor: COLORS.PRIMARY,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 800,
                        fontFamily: FONTS.OUTFIT,
                      }}
                    >
                      {stepInstructions}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 800,
                        fontSize: { xs: "15px", sm: "16px" },
                        color: "#1A0B05",
                      }}
                    >
                      Special Instructions
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#8C7A6B",
                      bgcolor: "rgba(140, 122, 107, 0.1)",
                      px: 1.2,
                      py: 0.3,
                      borderRadius: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Optional
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Any specific requirements, dietary preferences for Prasad, accessibility needs, or other details..."
                  value={bookingForm.specialInstructions}
                  onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                  sx={{
                    bgcolor: "#FFFDF9",
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: FONTS.OUTFIT,
                      bgcolor: "#FFFDF9",
                      "& fieldset": {
                        borderColor: "#EADCCF",
                      },
                      "&:hover fieldset": {
                        borderColor: "#FF6200",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#FF6200",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: FONTS.OUTFIT,
                      color: "#64534A",
                    },
                  }}
                />
              </Box>

              {/* Desktop Submit Button (Hidden on Mobile) */}
              <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "flex-start", mt: 1 }}>
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
                    width: "auto",
                    background: "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "15px",
                    textTransform: "none",
                    boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)",
                      boxShadow: "0 8px 25px rgba(255, 98, 0, 0.4)",
                    },
                  }}
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* MOBILE STICKY BOTTOM ACTION BAR (Matching Prototype) */}
      {isBookingAllowedForUser && (
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            bgcolor: "#FFFFFF",
            borderTop: "1px solid #EFE6D5",
            boxShadow: "0 -4px 20px rgba(44, 24, 16, 0.08)",
            px: 2,
            py: 1.5,
          }}
        >
          <Box
            sx={{
              maxWidth: 600,
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Price display */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: "18px",
                    color: "#1A0B05",
                    lineHeight: 1.2,
                  }}
                >
                  ₹{displayAmount.toLocaleString("en-IN")}
                </Typography>
                <Box
                  sx={{
                    bgcolor: isToken ? "#FFF0E6" : "#EDFDF2",
                    border: isToken ? "1px solid #FFD4BC" : "1px solid #C6F6D5",
                    borderRadius: "6px",
                    px: 0.8,
                    py: 0.2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "10px",
                      fontWeight: 700,
                      color: isToken ? COLORS.PRIMARY : "#22543D",
                    }}
                  >
                    {isToken ? `${tokenPercent}% Advance` : "Full Pay"}
                  </Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "11px",
                  color: "#8C7A6B",
                  fontWeight: 500,
                  mt: 0.2,
                }}
              >
                {isToken
                  ? `Rest ₹${(totalPrice - tokenAmt).toLocaleString("en-IN")} post-puja`
                  : "Complete Dakshina"}
              </Typography>
            </Box>

            {/* Booking CTA Button */}
            <Button
              type="button"
              onClick={handleConfirmBooking}
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} sx={{ color: "white" }} />
                ) : (
                  <CalendarMonthIcon sx={{ fontSize: "18px" }} />
                )
              }
              sx={{
                flex: 1,
                maxWidth: 220,
                background: "linear-gradient(135deg, #FF6200 0%, #E64A00 100%)",
                color: "white",
                py: 1.4,
                px: 2.5,
                borderRadius: "12px",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
                fontSize: "14px",
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.3)",
                whiteSpace: "nowrap",
                "&:hover": {
                  background: "linear-gradient(135deg, #E65500 0%, #CC3E00 100%)",
                },
              }}
            >
              {submitting ? "Booking..." : "Confirm & Book"}
            </Button>
          </Box>
        </Box>
      )}

      {/* REUSABLE ADD ADDRESS MODAL */}
      <AddAddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSuccess={handleAddressAdded}
      />

      {/* SERVICE INQUIRY MODAL */}
      <ServiceInquiryModal
        open={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        serviceId={service?.id || serviceId}
        serviceName={service?.name || service?.title}
        planName={selectedPlan}
      />
    </Paper>
  );
}

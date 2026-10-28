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
        <Grid container spacing={5} sx={{ alignItems: "flex-start" }}>
          {/* Left Column: Heading, Description & Inquiry Banner */}
          <ServiceDetailsBookingInfoSidebar
            onOpenInquiry={() => setInquiryModalOpen(true)}
          />

          {/* Right Column: Booking Inputs Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              component="form"
              onSubmit={handleConfirmBooking}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* Row 1: Scheduled Date & Preferred Time */}
              <ServiceDetailsDateTimeFields
                scheduledDate={bookingForm.scheduledDate}
                scheduledTime={bookingForm.scheduledTime}
                todayStr={todayStr}
                timeOptions={timeOptions}
                isAllSlotsPassedToday={isAllSlotsPassedToday}
                onDateChange={(date) => handleInputChange("scheduledDate", date)}
                onTimeChange={(time) => handleInputChange("scheduledTime", time)}
              />

              {/* Row 2: Preferred Language */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <FormControl
                    fullWidth
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
                    <InputLabel id="preferred-language-label">
                      Preferred Language
                    </InputLabel>
                    <Select
                      labelId="preferred-language-label"
                      label="Preferred Language"
                      value={bookingForm.language || ""}
                      onChange={(e) => handleInputChange("language", e.target.value)}
                      MenuProps={{
                        disableScrollLock: true,
                        slotProps: {
                          paper: {
                            sx: {
                              maxHeight: 280,
                              borderRadius: "10px",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                            },
                          },
                        },
                      }}
                      sx={{
                        borderRadius: "10px",
                        fontFamily: FONTS.PRIMARY,
                      }}
                    >
                      {availableLanguages && availableLanguages.length > 0 ? (
                        availableLanguages.map((lang) => (
                          <MenuItem
                            key={lang}
                            value={lang}
                            sx={{
                              fontFamily: FONTS.PRIMARY,
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
                            fontFamily: FONTS.PRIMARY,
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

              {/* Row 3: Customer Address Selector (OFFLINE only) */}
              {activeBookingMode === "OFFLINE" && (
                <ServiceDetailsAddressSelector
                  matchingAddresses={matchingAddresses}
                  selectedAddressId={selectedAddressId}
                  onChangeAddressId={(id) => setSelectedAddressId(id)}
                  onOpenAddAddressModal={() => setAddressModalOpen(true)}
                />
              )}

              {/* Row 4: Payment Option (TOKEN advance vs FULL payment) */}
              <ServiceDetailsPaymentOption
                plans={plans}
                service={service}
                selectedPlan={selectedPlan}
                showAddons={showAddons}
                selectedFeatureIds={selectedFeatureIds}
                paymentOption={bookingForm.paymentOption}
                onChangePaymentOption={(val) => handleInputChange("paymentOption", val)}
              />

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

"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EventIcon from "@mui/icons-material/Event";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { BOOKING_STATUS } from "@/utils/enums";

interface BookingActiveCardProps {
  job: {
    id: number | string;
    customer: string;
    ritual: string;
    date: string;
    time: string;
    location: string;
    price: string;
    status: string;
    plan?: string;
    bookingMode?: string;
    originalData?: any;
  };
  statuses: string[];
  onUpdateStatusClick: (
    event: React.MouseEvent<HTMLElement>,
    jobId: number,
  ) => void;
  onVerifyOtpClick: (jobId: number) => void;
  onMakePaymentClick: (jobId: number) => void;
  onProofClick: (jobId: number) => void;
  onReviewClick: (jobId: number) => void;
  onComplaintClick: (jobId: number) => void;
}

export const checkBookingPaymentState = (booking: any) => {
  if (!booking) {
    return { isFullyPaid: false, isTokenPaid: false, shouldShowMakePayment: false };
  }

  const payments = Array.isArray(booking.payments) ? booking.payments : [];

  const tokenPayment = payments.find(
    (p: any) => p.remark === "BOOKING_TOKEN_PAYMENT" && p.status === "SUCCESS"
  );
  const settlementPayment = payments.find(
    (p: any) => p.remark === "BOOKING_SETTLEMENT" && p.status === "SUCCESS"
  );
  const fullPayment = payments.find(
    (p: any) => p.remark === "BOOKING_FULL_PAYMENT" && p.status === "SUCCESS"
  );

  const remainingAmt = Number(
    booking.remainingAmount !== undefined && booking.remainingAmount !== null
      ? booking.remainingAmount
      : booking.finalAmount && booking.tokenAmount
      ? Number(booking.finalAmount) - Number(booking.tokenAmount)
      : 0
  );

  const isSettlementOrFullPaid = Boolean(settlementPayment) || Boolean(fullPayment);

  const isFullyPaid =
    booking.paymentStatus === "PAID" ||
    remainingAmt === 0 ||
    isSettlementOrFullPaid;

  const isTokenPaid =
    Boolean(tokenPayment) ||
    booking.paymentType === "TOKEN" ||
    Number(booking.tokenAmount) > 0 ||
    Number(booking.paidAmount) > 0;

  const shouldShowMakePayment = isTokenPaid && !isFullyPaid && remainingAmt > 0;

  return {
    isFullyPaid,
    isTokenPaid,
    shouldShowMakePayment,
  };
};

export const BookingActiveCard: React.FC<BookingActiveCardProps> = ({
  job,
  statuses,
  onUpdateStatusClick,
  onVerifyOtpClick,
  onMakePaymentClick,
  onProofClick,
  onReviewClick,
  onComplaintClick,
}) => {
  const jobId = job.originalData?.id || job.id;
  const rawData = job.originalData || job;
  const { isFullyPaid, shouldShowMakePayment } = checkBookingPaymentState(rawData);

  const statusUpper = job.status?.toUpperCase() || "";
  const isStatusUpdatable =
    statusUpper === BOOKING_STATUS.ACCEPTED ||
    statusUpper === BOOKING_STATUS.ENROUTE ||
    statusUpper === BOOKING_STATUS.ONGOING;

  const rawPlan = (job.plan || job.originalData?.plan || "").toString().toUpperCase();
  const isStandard = rawPlan.includes("STANDARD");
  const planLabel = rawPlan ? (isStandard ? "STANDARD PLAN" : "BASIC PLAN") : null;
  const bookingMode = (job.bookingMode || rawData?.bookingMode || "").toString().toUpperCase();
  const isOnline = bookingMode === "ONLINE" || (Boolean(job.location) && job.location.toLowerCase().includes("online"));

  // Extract selected add-on features (no price shown to purohit)
  const selectedAddons: string[] = [];
  if (Array.isArray(rawData?.priceBreakDown?.selectedFeatures)) {
    rawData.priceBreakDown.selectedFeatures.forEach((f: any) => {
      const t = f?.title || f?.name;
      if (t && !selectedAddons.includes(t)) selectedAddons.push(t);
    });
  }
  if (Array.isArray(rawData?.customFields?.selectedAddons)) {
    rawData.customFields.selectedAddons.forEach((t: any) => {
      const title = typeof t === "string" ? t : t?.title || t?.name;
      if (title && !selectedAddons.includes(title)) selectedAddons.push(title);
    });
  }
  if (Array.isArray(rawData?.selectedFeatures)) {
    rawData.selectedFeatures.forEach((f: any) => {
      const t = typeof f === "string" ? f : f?.title || f?.name;
      if (t && !selectedAddons.includes(t)) selectedAddons.push(t);
    });
  }
  if (Array.isArray(rawData?.features)) {
    rawData.features.forEach((f: any) => {
      const t = typeof f === "string" ? f : f?.title || f?.name;
      if (t && !selectedAddons.includes(t)) selectedAddons.push(t);
    });
  }

  // Extract standard carry items
  const carryItems: string[] = [];
  if (Array.isArray(rawData?.service?.purohitCarryItems)) {
    rawData.service.purohitCarryItems.forEach((item: any) => {
      if (typeof item === "string" && item.trim() && !carryItems.includes(item.trim())) {
        carryItems.push(item.trim());
      }
    });
  }

  const renderStatusChip = () => (
    <Chip
      label={
        job.status
          ? job.status.charAt(0).toUpperCase() +
            job.status.slice(1).toLowerCase()
          : "Status"
      }
      size="small"
      deleteIcon={
        isStatusUpdatable ? <KeyboardArrowDownIcon /> : undefined
      }
      onDelete={
        isStatusUpdatable
          ? (e) => onUpdateStatusClick(e as any, jobId)
          : undefined
      }
      onClick={
        isStatusUpdatable
          ? (e) => onUpdateStatusClick(e, jobId)
          : undefined
      }
      sx={{
        bgcolor: "#E8F5E9",
        color: "#2E7D32",
        fontWeight: 700,
        fontSize: "11px",
        height: "22px",
        borderRadius: "6px",
        cursor: isStatusUpdatable ? "pointer" : "default",
        border: "1px solid #C8E6C9",
        "& .MuiChip-deleteIcon": {
          color: "#2E7D32",
          fontSize: "16px",
          "&:hover": { color: "#1B5E20" },
        },
        "&:hover": {
          bgcolor: isStatusUpdatable ? "#C8E6C9" : "#E8F5E9",
        },
      }}
    />
  );

  const renderPlanChip = () =>
    planLabel ? (
      <Chip
        label={planLabel}
        size="small"
        sx={{
          bgcolor: isStandard ? "#F0FDF4" : "#FFF8F5",
          color: isStandard ? "#16A34A" : COLORS.PRIMARY,
          border: isStandard ? "1px solid #BBF7D0" : "1px solid #FFD8C2",
          fontWeight: 700,
          fontSize: "11px",
          height: "22px",
          borderRadius: "6px",
        }}
      />
    ) : null;

  const renderModeChip = () =>
    bookingMode && bookingMode !== "ONLINE" ? (
      <Chip
        label={bookingMode}
        size="small"
        sx={{
          bgcolor: bookingMode === "OFFLINE" ? "#FEF3C7" : "#E0F2FE",
          color: bookingMode === "OFFLINE" ? "#92400E" : "#0369A1",
          border:
            bookingMode === "OFFLINE"
              ? "1px solid #FDE68A"
              : "1px solid #BAE6FD",
          fontWeight: 700,
          fontSize: "11px",
          height: "22px",
          borderRadius: "6px",
          letterSpacing: "0.5px",
        }}
      />
    ) : null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: { xs: "16px", sm: "20px" },
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        mb: { xs: 2, sm: 2.5, md: 3 },
        boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          borderColor: "#CBD5E1",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0, width: { xs: "100%", md: "auto" } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              mb: 0.75,
              flexWrap: { sm: "wrap" },
            }}
          >
            {/* Title */}
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: { xs: "18px", sm: "19px", md: "20px" },
                color: "#1E293B",
                lineHeight: 1.25,
              }}
            >
              {job.ritual}
            </Typography>

            {/* Badges Bar (On Mobile: unified row right below title; On Desktop: inline with title) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ order: { xs: 1, sm: 3 } }}>
                {renderStatusChip()}
              </Box>
              {planLabel && (
                <Box sx={{ order: { xs: 2, sm: 1 } }}>
                  {renderPlanChip()}
                </Box>
              )}
              {bookingMode && bookingMode !== "ONLINE" && (
                <Box sx={{ order: { xs: 3, sm: 2 } }}>
                  {renderModeChip()}
                </Box>
              )}
            </Box>
          </Box>

          {/* Client & Booking ID Row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#64748B",
                fontSize: "13.5px",
              }}
            >
              Client: <span style={{ fontWeight: 700, color: "#1E293B" }}>{job.customer}</span>
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: "6px",
                bgcolor: "#F1F5F9",
                border: "1px solid #E2E8F0",
                fontSize: "11.5px",
                fontWeight: 700,
                color: "#475569",
                fontFamily: "monospace",
              }}
            >
              #B-{jobId}
            </Box>
          </Box>
        </Box>

        {/* Action Buttons Row */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            width: { xs: "100%", md: "auto" },
            mt: { xs: 0.5, md: 0 },
            alignItems: "center",
          }}
        >
          {job.status?.toUpperCase() === BOOKING_STATUS.ARRIVED && (
            <Button
              variant="contained"
              size="small"
              onClick={() => onVerifyOtpClick(jobId)}
              sx={{
                background: COLORS.PRIMARY,
                color: "white",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                borderRadius: "10px",
                px: 2,
                py: { xs: 0.8, sm: 0.6 },
                minHeight: { xs: 38, sm: 36 },
                flex: { xs: "1 1 100%", sm: "0 0 auto" },
                "&:hover": {
                  background: COLORS.PRIMARY_DARK,
                  boxShadow: "none",
                },
                boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
              }}
            >
              Verify OTP
            </Button>
          )}
          {job.status?.toUpperCase() === BOOKING_STATUS.ONGOING && shouldShowMakePayment && (
            <Button
              variant="contained"
              size="small"
              onClick={() => onMakePaymentClick(jobId)}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{
                background: "#10b981",
                color: "white",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                borderRadius: "10px",
                px: 2,
                py: { xs: 0.8, sm: 0.6 },
                minHeight: { xs: 38, sm: 36 },
                flex: { xs: "1 1 100%", sm: "0 0 auto" },
                "&:hover": {
                  background: "#059669",
                  boxShadow: "none",
                },
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
              }}
            >
              Make Payment
            </Button>
          )}
          {job.status?.toUpperCase() === BOOKING_STATUS.COMPLETED && (
            <>
              <Button
                variant="contained"
                size="small"
                onClick={() => onProofClick(jobId)}
                startIcon={<PhotoCameraIcon />}
                sx={{
                  background: "#16A34A",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  borderRadius: "10px",
                  px: 1.8,
                  py: { xs: 0.8, sm: 0.6 },
                  minHeight: { xs: 38, sm: 36 },
                  flex: { xs: "1 1 calc(50% - 6px)", sm: "0 0 auto" },
                  "&:hover": {
                    background: "#15803D",
                    boxShadow: "none",
                  },
                  boxShadow: "none",
                }}
              >
                Add Proof
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => onReviewClick(jobId)}
                startIcon={<RateReviewIcon />}
                sx={{
                  background: "#0284C7",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  borderRadius: "10px",
                  px: 1.8,
                  py: { xs: 0.8, sm: 0.6 },
                  minHeight: { xs: 38, sm: 36 },
                  flex: { xs: "1 1 calc(50% - 6px)", sm: "0 0 auto" },
                  "&:hover": {
                    background: "#0369A1",
                    boxShadow: "none",
                  },
                  boxShadow: "none",
                }}
              >
                Add Review
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => onComplaintClick(jobId)}
                startIcon={<ReportProblemIcon />}
                sx={{
                  background: "#EF4444",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  borderRadius: "10px",
                  px: 1.8,
                  py: { xs: 0.8, sm: 0.6 },
                  minHeight: { xs: 38, sm: 36 },
                  flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  "&:hover": {
                    background: "#DC2626",
                    boxShadow: "none",
                  },
                  boxShadow: "none",
                }}
              >
                Write Complaint
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            size="small"
            href={
              job.originalData?.customer?.phone
                ? `tel:${job.originalData.customer.phone}`
                : undefined
            }
            sx={{
              color: "#334155",
              borderColor: "#CBD5E1",
              bgcolor: "#FFFFFF",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              borderRadius: "10px",
              px: 2,
              py: { xs: 0.8, sm: 0.6 },
              minHeight: { xs: 38, sm: 36 },
              flex: { xs: "1 1 100%", md: "0 0 auto" },
              "&:hover": {
                bgcolor: "#F8FAFC",
                borderColor: "#94A3B8",
              },
            }}
          >
            Contact Client{" "}
            {job.originalData?.customer?.phone
              ? `- ${job.originalData.customer.phone}`
              : ""}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: "#F1F5F9" }} />

      {/* Details 3-Box Grid: Schedule, Est. Payout, Location */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        {/* Box 1: Schedule */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "rgba(255, 98, 0, 0.1)",
              color: COLORS.PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <EventIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#64748B",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              Schedule
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#1E293B",
                lineHeight: 1.3,
              }}
            >
              {job.date}, {job.time}
            </Typography>
          </Box>
        </Box>

        {/* Box 2: Est. Payout */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "#FAFDFB",
            border: "1px solid #C8E6C9",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "#E8F5E9",
              color: "#2E7D32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#2E7D32",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              Est. Payout
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "16px",
                fontWeight: 800,
                color: "#1B5E20",
                lineHeight: 1.3,
              }}
            >
              {job.price}
            </Typography>
          </Box>
        </Box>

        {/* Box 3: Location */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            gridColumn: { xs: "1", sm: "span 2", md: "span 1" },
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: isOnline ? "#EFF6FF" : "#EFF6FF",
              color: "#0284C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isOnline ? (
              <VideocamIcon sx={{ fontSize: 20 }} />
            ) : (
              <LocationOnIcon sx={{ fontSize: 20 }} />
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#64748B",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {isOnline ? "Mode" : "Location"}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "13px",
                fontWeight: 600,
                color: "#1E293B",
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {job.location && job.location !== "N/A"
                ? job.location
                : isOnline
                ? "Online (Video Call)"
                : "Address Pending"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {(selectedAddons.length > 0 || carryItems.length > 0) && (
        <Box
          sx={{
            mb: 2.5,
            p: { xs: 1.5, sm: 2 },
            bgcolor: "#FFFDF5",
            borderRadius: "14px",
            border: "1px dashed #FCD34D",
          }}
        >
          {selectedAddons.length > 0 && (
            <Box sx={{ mb: carryItems.length > 0 ? 1.5 : 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}>
                <InventoryIcon sx={{ fontSize: 16, color: "#D97706" }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#92400E",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Customer Selected Add-ons (Bring with you):
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedAddons.map((addon, idx) => (
                  <Chip
                    key={idx}
                    label={addon}
                    size="small"
                    sx={{
                      bgcolor: "#FEF3C7",
                      color: "#92400E",
                      border: "1px solid #FDE68A",
                      fontWeight: 700,
                      fontSize: "12px",
                      height: "26px",
                      borderRadius: "6px",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {carryItems.length > 0 && (
            <Box sx={{ mt: selectedAddons.length > 0 ? 1.5 : 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}>
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: "#4B5563" }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#4B5563",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Standard Samagri to Carry:
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {carryItems.map((item, idx) => (
                  <Chip
                    key={idx}
                    label={item}
                    size="small"
                    sx={{
                      bgcolor: "#F3F4F6",
                      color: "#374151",
                      border: "1px solid #E5E7EB",
                      fontWeight: 600,
                      fontSize: "12px",
                      height: "26px",
                      borderRadius: "6px",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      <Divider sx={{ my: { xs: 2, sm: 2.5 }, borderStyle: "dashed", borderColor: "#E2E8F0" }} />

      <Box sx={{ width: "100%", mb: { xs: 1, sm: 2 } }}>
        {(() => {
          const isOnline = bookingMode === "ONLINE";
          const displayStatuses = isOnline
            ? ["Accepted", "Ongoing", "Completed"]
            : statuses.filter((s) => s !== "Cancelled");

          return (
            <Stepper
              activeStep={
                job.status?.toUpperCase() === "CANCELLED"
                  ? -1
                  : displayStatuses.findIndex(
                      (s) => s.toUpperCase() === job.status?.toUpperCase(),
                    )
              }
              alternativeLabel
              sx={{
                width: "100%",
                p: 0,
                m: 0,
                "& .MuiStep-root": {
                  p: 0,
                  flex: 1,
                },
                "& .MuiStepIcon-root": {
                  fontSize: { xs: "22px", sm: "24px" },
                },
                "& .MuiStepIcon-root.Mui-active": {
                  color: COLORS.PRIMARY,
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: COLORS.PRIMARY,
                },
                "& .MuiStepConnector-root": {
                  top: { xs: 11, sm: 12 },
                  left: "calc(-50% + 14px)",
                  right: "calc(50% + 14px)",
                },
                "& .MuiStepConnector-line": {
                  borderColor: "#E2E8F0",
                },
                "& .MuiStepLabel-label": {
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: { xs: "11px", sm: "12.5px" },
                  color: "#64748B",
                  mt: 0.75,
                  textAlign: "center",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: `${COLORS.PRIMARY} !important`,
                  fontWeight: 800,
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  color: "#1E293B",
                  fontWeight: 700,
                },
              }}
            >
              {displayStatuses.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          );
        })()}
      </Box>
    </Paper>
  );
};

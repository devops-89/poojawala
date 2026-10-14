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

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "12px",
        border: "1px solid #eee",
        bgcolor: "#FFF",
        mb: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "18px",
                color: "#1A1A1A",
              }}
            >
              {job.ritual}
            </Typography>
            {planLabel && (
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
            )}
            {bookingMode && (
              <Chip
                label={bookingMode}
                size="small"
                sx={{
                  bgcolor: bookingMode === "OFFLINE" ? "#FEF3C7" : "#E0F2FE",
                  color: bookingMode === "OFFLINE" ? "#92400E" : "#0369A1",
                  border: bookingMode === "OFFLINE" ? "1px solid #FDE68A" : "1px solid #BAE6FD",
                  fontWeight: 700,
                  fontSize: "11px",
                  height: "22px",
                  borderRadius: "6px",
                  letterSpacing: "0.5px",
                }}
              />
            )}
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
                cursor: isStatusUpdatable ? "pointer" : "default",
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
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#666",
              fontSize: "14px",
            }}
          >
            Client: <span style={{ fontWeight: 600 }}>{job.customer}</span> • B-
            {jobId}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: { xs: 1, md: 0 },
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
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": {
                  background: "#E55000",
                  boxShadow: "none",
                },
                boxShadow: "none",
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
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": {
                  background: "#059669",
                  boxShadow: "none",
                },
                boxShadow: "none",
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
                  background: "#4CAF50",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": {
                    background: "#388E3C",
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
                  background: "#2196F3",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": {
                    background: "#1976D2",
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
                  background: "#F44336",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": {
                    background: "#D32F2F",
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
              color: "#333",
              borderColor: "#ccc",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            Contact Client{" "}
            {job.originalData?.customer?.phone
              ? `- ${job.originalData.customer.phone}`
              : ""}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventIcon sx={{ color: "#2E7D32", fontSize: 18 }} />
          <Box>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#999",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Schedule
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "14px",
                fontWeight: 600,
                color: "#333",
              }}
            >
              {job.date}, {job.time}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalanceWalletIcon sx={{ color: "#2E7D32", fontSize: 18 }} />
          <Box>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#999",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Est. Payout
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "14px",
                fontWeight: 800,
                color: "#333",
              }}
            >
              {job.price}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            minWidth: 0,
          }}
        >
          <LocationOnIcon
            sx={{
              color: "#2E7D32",
              fontSize: 18,
              flexShrink: 0,
              mt: 0.2,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#999",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Location
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "14px",
                fontWeight: 600,
                color: "#333",
                wordBreak: "break-word",
              }}
            >
              {job.location}
            </Typography>
          </Box>
        </Box>
      </Box>

      {(selectedAddons.length > 0 || carryItems.length > 0) && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "#FFFDF5",
            borderRadius: "10px",
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
                      fontWeight: 500,
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

      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Box sx={{ mb: 4 }}>
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
                "& .MuiStepIcon-root.Mui-active": {
                  color: COLORS.PRIMARY,
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: COLORS.PRIMARY,
                },
              }}
            >
              {displayStatuses.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          );
        })()}
      </Box>
    </Paper>
  );
};

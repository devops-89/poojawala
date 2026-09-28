"use client";

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
  const isStatusUpdatable = (
    [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.ENROUTE] as string[]
  ).includes(job.status?.toUpperCase() || "");

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
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                color: "#1A1A1A",
              }}
            >
              {job.ritual}
            </Typography>
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
              fontFamily: "var(--font-outfit), sans-serif",
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
                background: "#FF6200",
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
          {job.status?.toUpperCase() === BOOKING_STATUS.ONGOING && (
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
                fontFamily: "var(--font-outfit), sans-serif",
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
                fontFamily: "var(--font-outfit), sans-serif",
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
                fontFamily: "var(--font-outfit), sans-serif",
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
      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Box sx={{ mb: 4 }}>
        <Stepper
          activeStep={
            job.status?.toUpperCase() === "CANCELLED"
              ? -1
              : statuses.findIndex(
                  (s) => s.toUpperCase() === job.status?.toUpperCase(),
                )
          }
          alternativeLabel
          sx={{
            "& .MuiStepIcon-root.Mui-active": {
              color: "#FF6200",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "#FF6200",
            },
          }}
        >
          {statuses
            .filter((s) => s !== "Cancelled")
            .map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
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
      </Box>
    </Paper>
  );
};

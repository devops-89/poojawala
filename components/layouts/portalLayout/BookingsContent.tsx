"use client";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";
import AppTablePagination from "@/components/widgets/AppTablePagination";

import React from "react";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { BookingActiveCard } from "./bookings/BookingActiveCard";
import { BookingCancelModal } from "./bookings/BookingCancelModal";
import { BookingComplaintModal } from "./bookings/BookingComplaintModal";
import { BookingNewRequestCard } from "./bookings/BookingNewRequestCard";
import { BookingProofModal } from "./bookings/BookingProofModal";
import { BookingReviewModal } from "./bookings/BookingReviewModal";
import { BookingStartOtpModal } from "./bookings/BookingStartOtpModal";
import { useBookings } from "./bookings/useBookings";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bookings-tabpanel-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ pt: { xs: 2, sm: 2.5 } }}>{children}</Box>}
    </div>
  );
}

export default function BookingsContent() {
  const b = useBookings();
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/partner/dashboard");
    }
  };

  return (
    <Box>
      <AppBreadcrumbs
        items={[
          { label: "Dashboard", href: "/partner/dashboard" },
          { label: "Bookings" },
        ]}
      />

      {/* Header with Title and Standard Branded Back Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
          mt: 1,
          mb: { xs: 2.5, md: 3.5 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1E293B",
              fontSize: { xs: "22px", sm: "28px", md: "32px" },
              lineHeight: 1.2,
            }}
          >
            Pooja Bookings
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: { xs: "13px", sm: "14.5px" },
              mt: 0.5,
            }}
          >
            Manage your incoming requests and active jobs.
          </Typography>
        </Box>

        <Button
          onClick={handleBack}
          startIcon={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "rgba(255, 98, 0, 0.12)",
                color: COLORS.PRIMARY,
                transition: "all 0.25s ease",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 14 }} />
            </Box>
          }
          sx={{
            color: "#1F1A17",
            bgcolor: "#FFFFFF",
            border: "1.5px solid rgba(255, 98, 0, 0.28)",
            borderRadius: "32px",
            pl: 1.2,
            pr: 2.2,
            py: 0.6,
            fontFamily: FONTS.OUTFIT,
            fontWeight: 600,
            fontSize: "13px",
            textTransform: "none",
            boxShadow:
              "0 4px 14px -2px rgba(255, 98, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.04)",
            flexShrink: 0,
            alignSelf: { xs: "flex-start", sm: "auto" },
            transition: "all 0.25s ease",
            "& .MuiButton-startIcon": {
              mr: 1,
            },
            "&:hover": {
              bgcolor: "#FFFFFF",
              borderColor: COLORS.PRIMARY,
              color: COLORS.PRIMARY,
              transform: "translateY(-1px)",
              boxShadow: "0 6px 18px -2px rgba(255, 98, 0, 0.25)",
              "& .MuiButton-startIcon > div": {
                bgcolor: COLORS.PRIMARY,
                color: "#FFFFFF",
                transform: "translateX(-2px)",
              },
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Job List Container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: "16px", sm: "22px" },
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          overflow: "hidden",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid #E2E8F0",
            bgcolor: "#FAFAFA",
            px: { xs: 1, sm: 2 },
          }}
        >
          <Tabs
            value={b.tabValue}
            onChange={(e, val) => {
              b.setTabValue(val);
              localStorage.setItem("bookingsTab", val.toString());
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 48, sm: 54 },
              "& .MuiTab-root": {
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                textTransform: "none",
                fontSize: { xs: "14px", sm: "15px" },
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 3 },
                minHeight: { xs: 48, sm: 54 },
                color: "#64748B",
              },
              "& .Mui-selected": {
                color: `${COLORS.PRIMARY} !important`,
                fontWeight: 700,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: COLORS.PRIMARY,
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>New Requests</span>
                  {b.newRequests.length > 0 && (
                    <Chip
                      label={b.newRequests.length}
                      size="small"
                      sx={{
                        bgcolor: COLORS.PRIMARY,
                        color: "#FFFFFF",
                        fontWeight: 800,
                        fontSize: "11px",
                        height: "20px",
                        minWidth: "20px",
                        px: 0.5,
                        borderRadius: "10px",
                      }}
                    />
                  )}
                </Box>
              }
            />
            <Tab label="Active Bookings" />
          </Tabs>
        </Box>

        <Box
          sx={{
            p: { xs: 1.5, sm: 2.5, md: 3 },
            minHeight: "500px",
            bgcolor: "#F8FAFC",
          }}
        >
          {/* --- TAB 0: New Requests --- */}
          <CustomTabPanel value={b.tabValue} index={0}>
            {b.isFetchingBookings ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, sm: 6 },
                  borderRadius: "16px",
                  textAlign: "center",
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#64748B",
                    fontSize: { xs: "14px", sm: "16px" },
                    fontWeight: 600,
                  }}
                >
                  Loading new requests...
                </Typography>
              </Paper>
            ) : b.newRequests.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, sm: 6 },
                  borderRadius: "16px",
                  textAlign: "center",
                  bgcolor: "#FFFFFF",
                  border: "1.5px dashed #CBD5E1",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#64748B",
                    fontSize: { xs: "15px", sm: "16px" },
                    fontWeight: 600,
                  }}
                >
                  No new bookings available at the moment.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#94A3B8",
                    fontSize: { xs: "13px", sm: "14px" },
                    mt: 0.5,
                  }}
                >
                  New customer pooja requests will appear here in real-time.
                </Typography>
              </Paper>
            ) : (
              b.newRequests.map((req) => (
                <BookingNewRequestCard
                  key={req.id}
                  req={req}
                  onRespond={b.handleRespondBooking}
                />
              ))
            )}
          </CustomTabPanel>

          {/* --- TAB 1: Active Bookings --- */}
          <CustomTabPanel value={b.tabValue} index={1}>
            {/* Status Filter Chips Row (Horizontal Scroll on Mobile, Flex Wrap on Desktop) */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 2.5,
                overflowX: { xs: "auto", md: "visible" },
                flexWrap: { xs: "nowrap", md: "wrap" },
                pb: { xs: 1, md: 0 },
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                WebkitOverflowScrolling: "touch",
              }}
            >
              {b.statuses.map((status) => {
                const isSelected = b.activeStatus === status;
                const count = b.activeBookings.filter(
                  (j) => j.status?.toUpperCase() === status.toUpperCase()
                ).length;

                return (
                  <Chip
                    key={status}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <span>{status}</span>
                        {count > 0 && (
                          <span
                            style={{
                              fontSize: "11px",
                              opacity: isSelected ? 0.95 : 0.8,
                              background: isSelected
                                ? "rgba(255,255,255,0.25)"
                                : "#E2E8F0",
                              color: isSelected ? "#fff" : "#475569",
                              padding: "1px 6px",
                              borderRadius: "10px",
                              fontWeight: 700,
                            }}
                          >
                            {count}
                          </span>
                        )}
                      </Box>
                    }
                    clickable
                    onClick={() => {
                      b.setActiveStatus(status);
                      b.setActivePage(1);
                    }}
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 600,
                      fontSize: "13px",
                      height: "34px",
                      px: 0.5,
                      flexShrink: 0,
                      borderRadius: "20px",
                      bgcolor: isSelected ? COLORS.PRIMARY : "#FFFFFF",
                      color: isSelected ? "#FFFFFF" : "#475569",
                      border: isSelected
                        ? `1.5px solid ${COLORS.PRIMARY}`
                        : "1px solid #E2E8F0",
                      boxShadow: "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: isSelected
                          ? COLORS.PRIMARY_DARK
                          : "#F1F5F9",
                        borderColor: isSelected
                          ? COLORS.PRIMARY_DARK
                          : "#CBD5E1",
                        boxShadow: "none",
                      },
                    }}
                  />
                );
              })}
            </Box>

            {b.isFetchingBookings ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, sm: 6 },
                  borderRadius: "16px",
                  textAlign: "center",
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#64748B",
                    fontSize: { xs: "14px", sm: "16px" },
                    fontWeight: 600,
                  }}
                >
                  Loading bookings...
                </Typography>
              </Paper>
            ) : b.activeBookings.filter(
                (job) =>
                  job.status?.toUpperCase() === b.activeStatus.toUpperCase()
              ).length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, sm: 6 },
                  borderRadius: "16px",
                  textAlign: "center",
                  bgcolor: "#FFFFFF",
                  border: "1.5px dashed #CBD5E1",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#64748B",
                    fontSize: { xs: "15px", sm: "16px" },
                    fontWeight: 600,
                  }}
                >
                  No {b.activeStatus.toLowerCase()} bookings found.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#94A3B8",
                    fontSize: { xs: "13px", sm: "14px" },
                    mt: 0.5,
                  }}
                >
                  Check other tabs or statuses to view active or upcoming jobs.
                </Typography>
              </Paper>
            ) : (
              b.activeBookings
                .filter(
                  (job) =>
                    job.status?.toUpperCase() === b.activeStatus.toUpperCase()
                )
                .map((job: any) => (
                  <BookingActiveCard
                    key={job.id}
                    job={job}
                    statuses={b.statuses}
                    onUpdateStatusClick={b.handleUpdateStatusClick}
                    onVerifyOtpClick={b.handleVerifyOtpClick}
                    onMakePaymentClick={b.handleMakePaymentClick}
                    onProofClick={b.handleProofButtonClick}
                    onReviewClick={b.handleOpenReviewModal}
                    onComplaintClick={b.handleOpenComplaintModal}
                  />
                ))
            )}

            {b.activeTotalPages > 0 &&
              b.activeBookings.filter(
                (job) =>
                  job.status?.toUpperCase() === b.activeStatus.toUpperCase()
              ).length > 0 && (
                <Box
                  sx={{
                    mt: { xs: 3, sm: 4 },
                    mx: { xs: -1.5, sm: -2.5, md: -3 },
                    mb: { xs: -1.5, sm: -2.5, md: -3 },
                  }}
                >
                  <AppTablePagination
                    count={b.activeTotalCount || (b.activeTotalPages * 10)}
                    page={b.activePage - 1}
                    rowsPerPage={10}
                    onPageChange={(newPage) => b.setActivePage(newPage + 1)}
                    itemName="bookings"
                    showRowsPerPage={false}
                    sx={{
                      bgcolor: "#FFFFFF",
                      borderTop: "1px solid #E2E8F0",
                      borderBottomLeftRadius: { xs: "16px", sm: "22px" },
                      borderBottomRightRadius: { xs: "16px", sm: "22px" },
                      px: { xs: 2, sm: 3 },
                    }}
                  />
                </Box>
              )}
          </CustomTabPanel>
        </Box>
      </Paper>

      {/* Update Status Dropdown Menu */}
      <Menu
        anchorEl={b.statusMenuAnchorEl}
        open={Boolean(b.statusMenuAnchorEl)}
        onClose={b.handleStatusMenuClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "14px",
            minWidth: "160px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            border: "1px solid #E2E8F0",
            py: 0.5,
          },
        }}
      >
        {(() => {
          if (!b.updatingJobId) return null;
          const target = b.activeBookings.find(
            (j) => (j.originalData?.id || j.id) === b.updatingJobId
          );
          const currentStatus = target?.status || "";
          const mode =
            target?.bookingMode || target?.originalData?.bookingMode || "";
          const transitions = b.getValidTransitions(currentStatus, mode);

          return transitions.map((status) => (
            <MenuItem
              key={status}
              onClick={() => b.handleStatusChange(status)}
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "14px",
                fontWeight: 600,
                py: 1,
                "&:hover": {
                  bgcolor: "rgba(255, 98, 0, 0.08)",
                  color: COLORS.PRIMARY,
                },
              }}
            >
              {status}
            </MenuItem>
          ));
        })()}
      </Menu>

      {/* OTP Verification Modal */}
      <BookingStartOtpModal
        open={b.otpModalOpen}
        onClose={() => b.setOtpModalOpen(false)}
        otpValue={b.otpValue}
        onOtpChange={b.handleOtpChange}
        onOtpKeyDown={b.handleOtpKeyDown}
        onOtpPaste={b.handleOtpPaste}
        onResendOtp={b.handleResendOtp}
        isResendingOtp={b.isResendingOtp}
        onVerifyOtp={b.handleVerifyOtp}
      />

      {/* Completion Proof Upload Modal */}
      <BookingProofModal
        proofPreview={b.proofPreview}
        onClose={() => {
          b.setProofPreview(null);
          b.setProofFile(null);
        }}
        onUploadProof={b.handleUploadProof}
        isUploadingProof={b.isUploadingProof}
        fileInputRef={b.fileInputRef}
        handleFileChange={b.handleFileChange}
      />

      {/* Review Modal */}
      <BookingReviewModal
        open={b.reviewModalOpen}
        onClose={() => b.setReviewModalOpen(false)}
        rating={b.rating}
        setRating={b.setRating}
        reviewText={b.reviewText}
        setReviewText={b.setReviewText}
        onSubmitReview={b.handleSubmitReview}
        isSubmittingReview={b.isSubmittingReview}
      />

      {/* Cancel Booking Modal */}
      <BookingCancelModal
        open={b.cancelModalOpen}
        onClose={() => {
          b.setCancelModalOpen(false);
          b.setCancelReason("");
        }}
        cancelReason={b.cancelReason}
        setCancelReason={b.setCancelReason}
        onConfirmCancel={b.handleConfirmCancel}
        isCancelling={b.isCancelling}
      />

      {/* Complaint Modal */}
      <BookingComplaintModal
        open={b.complaintModalOpen}
        onClose={() => b.setComplaintModalOpen(false)}
        complaintCategory={b.complaintCategory}
        setComplaintCategory={b.setComplaintCategory}
        complaintSubject={b.complaintSubject}
        setComplaintSubject={b.setComplaintSubject}
        complaintDescription={b.complaintDescription}
        setComplaintDescription={b.setComplaintDescription}
        complaintFiles={b.complaintFiles}
        onFileChange={b.handleComplaintFileChange}
        onRemoveFile={b.handleRemoveComplaintFile}
        onSubmitComplaint={b.handleSubmitComplaint}
        isSubmittingComplaint={b.isSubmittingComplaint}
        fileInputRef={b.complaintFileInputRef}
      />
    </Box>
  );
}

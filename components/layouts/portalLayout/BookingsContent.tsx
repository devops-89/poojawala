"use client";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";

import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Breadcrumbs,
  Chip,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BookingsContent() {
  const b = useBookings();

  return (
    <Box>
      <AppBreadcrumbs
        items={[
          { label: "Dashboard", href: "/purohit/dashboard" },
          { label: "Bookings" },
        ]}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: COLORS.DARK,
              mb: 1,
            }}
          >
            Pooja Bookings
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: COLORS.MUTED_TEXT,
            }}
          >
            Manage your incoming requests and active jobs.
          </Typography>
        </Box>
      </Box>

      {/* Job List Container */}
      <Paper
        sx={{
          borderRadius: "12px",
          border: `1px solid ${COLORS.BORDER_LIGHT}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: COLORS.SURFACE_LIGHT }}
        >
          <Tabs
            value={b.tabValue}
            onChange={(e, val) => {
              b.setTabValue(val);
              localStorage.setItem("bookingsTab", val.toString());
            }}
            sx={{
              px: 2,
              "& .MuiTab-root": {
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "15px",
                py: 2,
              },
              "& .Mui-selected": { color: COLORS.PRIMARY },
              "& .MuiTabs-indicator": { backgroundColor: COLORS.PRIMARY },
            }}
          >
            <Tab label="New Requests" />
            <Tab label="Active Bookings" />
          </Tabs>
        </Box>

        <Box
          sx={{ p: { xs: 2, md: 3 }, minHeight: "500px", bgcolor: COLORS.BG_MUTED }}
        >
          {/* --- TAB 0: New Requests --- */}
          <CustomTabPanel value={b.tabValue} index={0}>
            {b.isFetchingBookings ? (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  textAlign: "center",
                  bgcolor: COLORS.WHITE,
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: COLORS.MUTED_TEXT,
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Loading new requests...
                </Typography>
              </Paper>
            ) : b.newRequests.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  textAlign: "center",
                  bgcolor: COLORS.WHITE,
                  border: "1px dashed #ccc",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: COLORS.MUTED_TEXT,
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  No new bookings available at the moment.
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
            <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
              {b.statuses.map((status) => (
                <Chip
                  key={status}
                  label={status}
                  clickable
                  onClick={() => {
                    b.setActiveStatus(status);
                    b.setActivePage(1);
                  }}
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 600,
                    fontSize: "13px",
                    height: "32px",
                    bgcolor: b.activeStatus === status ? COLORS.PRIMARY : COLORS.WHITE,
                    color: b.activeStatus === status ? COLORS.WHITE : COLORS.MUTED_TEXT,
                    border:
                      b.activeStatus === status
                        ? `1px solid ${COLORS.PRIMARY}`
                        : "1px solid #ddd",
                    "&:hover": {
                      bgcolor: b.activeStatus === status ? COLORS.PRIMARY_DARK : "#f5f5f5",
                    },
                  }}
                />
              ))}
            </Box>

            {b.isFetchingBookings ? (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  textAlign: "center",
                  bgcolor: COLORS.WHITE,
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: COLORS.MUTED_TEXT,
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Loading bookings...
                </Typography>
              </Paper>
            ) : b.activeBookings.filter(
                (job) =>
                  job.status?.toUpperCase() === b.activeStatus.toUpperCase(),
              ).length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  textAlign: "center",
                  bgcolor: COLORS.WHITE,
                  border: "1px dashed #ccc",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: COLORS.MUTED_TEXT,
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  No active bookings found.
                </Typography>
              </Paper>
            ) : (
              b.activeBookings
                .filter(
                  (job) =>
                    job.status?.toUpperCase() === b.activeStatus.toUpperCase(),
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
                  job.status?.toUpperCase() === b.activeStatus.toUpperCase(),
              ).length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={b.activeTotalPages}
                    page={b.activePage}
                    onChange={(event, value) => b.setActivePage(value)}
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontFamily: FONTS.OUTFIT,
                      },
                      "& .Mui-selected": {
                        backgroundColor: `${COLORS.PRIMARY} !important`,
                        color: COLORS.WHITE,
                      },
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
            borderRadius: "12px",
            minWidth: "150px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          },
        }}
      >
        {(b.updatingJobId
          ? b.getValidTransitions(
              b.activeBookings.find(
                (j) => (j.originalData?.id || j.id) === b.updatingJobId,
              )?.status || "",
            )
          : []
        ).map((status) => (
          <MenuItem
            key={status}
            onClick={() => b.handleStatusChange(status)}
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>

      {/* OTP Verification Modal */}
      <BookingStartOtpModal
        open={b.otpModalOpen}
        onClose={() => b.setOtpModalOpen(false)}
        otpValue={b.otpValue}
        onOtpChange={b.handleOtpChange}
        onOtpKeyDown={b.handleOtpKeyDown}
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

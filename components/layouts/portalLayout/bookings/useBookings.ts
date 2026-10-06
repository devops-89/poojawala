"use client";

import { useEffect, useRef, useState } from "react";
import {
  addComplaintAPI,
  addReviewAPI,
  cancelBookingAPI,
  getActiveBookingAPI,
  getAvailableBookingsAPI,
  resendBookingStartOtpAPI,
  respondBookingAPI,
  sendBookingStartOtpAPI,
  updateBookingStatusAPI,
  uploadCompletionProofAPI,
  verifyBookingOtpAPI,
} from "@/api/bookingControllers";
import { getPaymentLinkAPI } from "@/api/paymentControllers";
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useSocketStore } from "@/stores/socketStore";
import { checkBookingPaymentState } from "./BookingActiveCard";
import { convertImageToWebP } from "@/utils/imageHelper";

export function useBookings() {
  const { showSnackbar } = useSnackbarStore();
  const { showLoader, hideLoader } = useLoaderStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const [tabValue, setTabValue] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [activeStatus, setActiveStatus] = useState("Accepted");
  const [newRequests, setNewRequests] = useState<any[]>([]);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [activeTotalPages, setActiveTotalPages] = useState(1);
  const [isFetchingBookings, setIsFetchingBookings] = useState(true);

  const statuses = ["Accepted", "Enroute", "Arrived", "Ongoing", "Completed"];

  // OTP Modal states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpJobId, setOtpJobId] = useState<number | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Status Menu states
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [updatingJobId, setUpdatingJobId] = useState<number | null>(null);

  // Review states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewJobId, setReviewJobId] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Complaint states
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [complaintJobId, setComplaintJobId] = useState<number | null>(null);
  const [complaintCategory, setComplaintCategory] = useState("");
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [complaintFiles, setComplaintFiles] = useState<File[]>([]);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const complaintFileInputRef = useRef<HTMLInputElement>(null);

  // Cancel states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Proof upload states
  const [proofJobId, setProofJobId] = useState<number | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenReviewModal = (jobId: number) => {
    setReviewJobId(jobId);
    setRating(0);
    setReviewText("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewJobId || !rating) {
      showSnackbar("Please provide a rating", "error");
      return;
    }
    setIsSubmittingReview(true);
    try {
      await addReviewAPI(reviewJobId, rating, reviewText);
      showSnackbar("Review submitted successfully", "success");
      setReviewModalOpen(false);
      setReviewJobId(null);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to submit review", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleOpenComplaintModal = (id: number) => {
    setComplaintJobId(id);
    setComplaintModalOpen(true);
  };

  const handleComplaintFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setComplaintFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    if (complaintFileInputRef.current) complaintFileInputRef.current.value = "";
  };

  const handleRemoveComplaintFile = (indexToRemove: number) => {
    setComplaintFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitComplaint = async () => {
    if (!complaintJobId || !complaintCategory || !complaintSubject || !complaintDescription)
      return;
    setIsSubmittingComplaint(true);
    try {
      const formData = new FormData();
      formData.append("bookingId", complaintJobId.toString());
      formData.append("category", complaintCategory);
      formData.append("subject", complaintSubject);
      formData.append("description", complaintDescription);
      for (const file of complaintFiles) {
        const webpFile = await convertImageToWebP(file);
        formData.append("evidence", webpFile);
      }

      await addComplaintAPI(formData);
      showSnackbar("Complaint created successfully", "success");
      setComplaintModalOpen(false);
      setComplaintCategory("");
      setComplaintSubject("");
      setComplaintDescription("");
      setComplaintFiles([]);
      setComplaintJobId(null);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to submit complaint", "error");
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const handleProofButtonClick = (jobId: number) => {
    setProofJobId(jobId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const webpFile = await convertImageToWebP(file);
      setProofFile(webpFile);
      setProofPreview(URL.createObjectURL(webpFile));
    }
  };

  const handleUploadProof = async () => {
    if (!proofJobId || !proofFile) return;
    setIsUploadingProof(true);
    try {
      const webpFile = await convertImageToWebP(proofFile);
      const formData = new FormData();
      formData.append("files", webpFile);
      await uploadCompletionProofAPI(proofJobId, formData);
      showSnackbar("Completion proof uploaded successfully", "success");
      setProofFile(null);
      setProofPreview(null);
      setProofJobId(null);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to upload proof", "error");
    } finally {
      setIsUploadingProof(false);
    }
  };

  const getValidTransitions = (currentStatus: string) => {
    switch (currentStatus.toUpperCase()) {
      case "ACCEPTED":
        return ["Enroute", "Cancelled"];
      case "ENROUTE":
        return ["Arrived", "Cancelled"];
      case "ONGOING":
        return ["Completed"];
      default:
        return [];
    }
  };

  const handleUpdateStatusClick = (event: React.MouseEvent<HTMLElement>, jobId: number) => {
    setStatusMenuAnchorEl(event.currentTarget);
    setUpdatingJobId(jobId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchorEl(null);
    setUpdatingJobId(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!updatingJobId) return;

    if (newStatus.toUpperCase() === "CANCELLED") {
      setCancelModalOpen(true);
      setStatusMenuAnchorEl(null);
      return;
    }

    const targetJob = activeBookings.find(
      (j) => (j.originalData?.id || j.id) === updatingJobId,
    );
    const rawData = targetJob?.originalData || targetJob;

    if (newStatus.toUpperCase() === "COMPLETED") {
      const { isFullyPaid } = checkBookingPaymentState(rawData);
      if (!isFullyPaid) {
        showSnackbar(
          "Please complete full payment (settlement) before marking job as completed.",
          "error",
        );
        setStatusMenuAnchorEl(null);
        setUpdatingJobId(null);
        return;
      }
    }

    try {
      showLoader(`Updating status to ${newStatus}...`);
      await updateBookingStatusAPI(updatingJobId, newStatus.toUpperCase());
      setActiveBookings((prev) =>
        prev.map((job) =>
          (job.originalData?.id || job.id) === updatingJobId
            ? { ...job, status: newStatus.toUpperCase() }
            : job,
        ),
      );
      setIsFetchingBookings(true);
      setActiveStatus(newStatus);
      showSnackbar(`Booking status updated to ${newStatus}`, "success");
    } catch (error: any) {
      console.error("Error updating status:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to update status",
        "error",
      );
    } finally {
      hideLoader();
    }
    handleStatusMenuClose();
  };

  const handleConfirmCancel = async () => {
    if (!updatingJobId) return;
    if (!cancelReason.trim()) {
      showSnackbar("Please provide a reason for cancellation", "error");
      return;
    }
    setIsCancelling(true);
    try {
      await cancelBookingAPI(updatingJobId, cancelReason);
      setActiveBookings((prev) =>
        prev.filter((job) => (job.originalData?.id || job.id) !== updatingJobId),
      );
      useSocketStore.getState().triggerRefresh();
      showSnackbar("Booking cancelled successfully", "success");
      setCancelModalOpen(false);
      setCancelReason("");
      setUpdatingJobId(null);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to cancel booking", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    let newOtp = otpValue.split("");
    while (newOtp.length < 6) newOtp.push("");
    newOtp[index] = val.slice(-1);
    setOtpValue(newOtp.join(""));
    if (val && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && (!otpValue[index] || otpValue[index] === "") && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length === 6 && otpJobId) {
      try {
        await verifyBookingOtpAPI(otpJobId, otpValue);
        setOtpModalOpen(false);
        setOtpValue("");
        setActiveStatus("Ongoing");
        showSnackbar("OTP verified successfully! Job started.", "success");
      } catch (e) {
        console.error(e);
        showSnackbar("Invalid OTP or failed to verify", "error");
      }
    }
  };

  const handleResendOtp = async () => {
    if (otpJobId) {
      try {
        setIsResendingOtp(true);
        await resendBookingStartOtpAPI(otpJobId);
        showSnackbar("OTP resent successfully", "success");
      } catch (e) {
        console.error(e);
        showSnackbar("Failed to resend OTP", "error");
      } finally {
        setIsResendingOtp(false);
      }
    }
  };

  const handleVerifyOtpClick = async (jobId: number) => {
    try {
      setOtpJobId(jobId);
      await sendBookingStartOtpAPI(jobId);
      setOtpModalOpen(true);
      showSnackbar("OTP sent successfully", "success");
    } catch (error) {
      console.error("Error sending OTP:", error);
      showSnackbar("Failed to send OTP to client.", "error");
    }
  };

  const handleMakePaymentClick = async (jobId: number) => {
    try {
      showLoader("Redirecting to payment...");
      const callbackUrl = "https://poojawala.com/purohit/bookings";
      const res = await getPaymentLinkAPI(jobId, callbackUrl);
      if (res.success && res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        showSnackbar(res.message || "Failed to generate payment link", "error");
        hideLoader();
      }
    } catch (error: any) {
      console.error(error);
      showSnackbar(
        error.response?.data?.message || error.message || "Error generating payment link",
        "error",
      );
      hideLoader();
    }
  };

  useEffect(() => {
    const savedTab = localStorage.getItem("bookingsTab");
    if (savedTab) {
      setTabValue(Number(savedTab));
    }
    setIsClient(true);
  }, []);

  const handleRespondBooking = async (
    bookingId: number | string,
    action: "ACCEPT" | "DISMISS",
  ) => {
    try {
      showLoader(action === "ACCEPT" ? "Accepting Booking..." : "Declining Booking...");
      const response = await respondBookingAPI(bookingId, action);
      if (response.success) {
        showSnackbar(
          `Booking ${action === "ACCEPT" ? "accepted" : "declined"} successfully!`,
          "success",
        );
        const store = useSocketStore.getState();
        store.triggerRefresh();
      } else {
        showSnackbar(response.message || `Failed to ${action.toLowerCase()} booking`, "error");
      }
    } catch (error: any) {
      console.error(`Error responding to booking (Action: ${action}):`, error);
      showSnackbar(error?.response?.data?.message || "Something went wrong", "error");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (!isClient) return;
    let isMounted = true;

    const fetchAvailableBookings = async () => {
      setIsFetchingBookings(true);
      try {
        const response = await getAvailableBookingsAPI();
        if (!isMounted) return;
        if (response?.data?.bookings) {
          const getPriceDisplay = (booking: any) => {
            if (booking.purohitPayoutAmount && Number(booking.purohitPayoutAmount) > 0)
              return `₹${booking.purohitPayoutAmount}`;
            if (booking.agreedPrice && Number(booking.agreedPrice) > 0)
              return `₹${booking.agreedPrice}`;
            const pWithout = booking.service?.priceWithoutSamagri ?? booking.service?.minPrice;
            const pWith = booking.service?.priceWithSamagri ?? booking.service?.maxPrice;
            if (pWithout != null && pWith != null) {
              return `₹${Math.round(Number(pWithout))} - ₹${Math.round(Number(pWith))}`;
            }
            return "₹0";
          };

          const mappedBookings = response.data.bookings.map((booking: any) => ({
            id: booking.bookingNumber || booking.id,
            customer: booking.customer
              ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim()
              : "Customer",
            ritual: booking.service?.name || "Puja Service",
            date: booking.scheduledAt
              ? new Date(booking.scheduledAt).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A",
            time: booking.scheduledAt
              ? new Date(booking.scheduledAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            location: booking.customerAddress?.fullAddress || "N/A",
            distance: "N/A",
            duration: booking.service?.durationMinutes
              ? `${booking.service.durationMinutes} Mins`
              : "N/A",
            urgency: "Normal",
            price: getPriceDisplay(booking),
            plan: booking.plan,
            originalData: booking,
          }));
          setNewRequests(mappedBookings);
        }
      } catch (error) {
        console.error("Error fetching available bookings:", error);
      } finally {
        if (isMounted) setIsFetchingBookings(false);
      }
    };

    const fetchActiveBookings = async () => {
      setIsFetchingBookings(true);
      try {
        const response = await getActiveBookingAPI(activeStatus, activePage, 10);
        if (!isMounted) return;
        if (response?.data?.bookings) {
          const getPriceDisplay = (booking: any) => {
            if (booking.purohitPayoutAmount && Number(booking.purohitPayoutAmount) > 0)
              return `₹${booking.purohitPayoutAmount}`;
            if (booking.agreedPrice && Number(booking.agreedPrice) > 0)
              return `₹${booking.agreedPrice}`;
            const pWithout = booking.service?.priceWithoutSamagri ?? booking.service?.minPrice;
            const pWith = booking.service?.priceWithSamagri ?? booking.service?.maxPrice;
            if (pWithout != null && pWith != null) {
              return `₹${Math.round(Number(pWithout))} - ₹${Math.round(Number(pWith))}`;
            }
            return "₹0";
          };

          const mappedBookings = response.data.bookings.map((booking: any) => ({
            id: booking.bookingNumber || booking.id,
            customer: booking.customer
              ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim()
              : "Customer",
            ritual: booking.service?.name || "Puja Service",
            date: booking.scheduledAtIst
              ? booking.scheduledAtIst.split(",")[0]
              : booking.scheduledAt
                ? new Date(booking.scheduledAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A",
            time: booking.scheduledAtIst
              ? booking.scheduledAtIst.split(",")[1]?.trim()
              : booking.scheduledAt
                ? new Date(booking.scheduledAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A",
            location: booking.customerAddress?.fullAddress || "N/A",
            distance: "N/A",
            duration: booking.service?.durationMinutes
              ? `${booking.service.durationMinutes} Mins`
              : "N/A",
            price: getPriceDisplay(booking),
            status: activeStatus.toUpperCase(),
            plan: booking.plan,
            originalData: booking,
          }));
          setActiveBookings(mappedBookings);
          setActiveTotalPages(response.data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching active bookings:", error);
      } finally {
        if (isMounted) setIsFetchingBookings(false);
      }
    };

    if (tabValue === 0) {
      fetchAvailableBookings();
    } else if (tabValue === 1) {
      fetchActiveBookings();
    }

    return () => {
      isMounted = false;
    };
  }, [tabValue, isClient, activeStatus, activePage, refreshTrigger]);

  return {
    tabValue,
    setTabValue,
    activeStatus,
    setActiveStatus,
    newRequests,
    activeBookings,
    activePage,
    setActivePage,
    activeTotalPages,
    isFetchingBookings,
    statuses,

    // OTP
    otpModalOpen,
    setOtpModalOpen,
    otpValue,
    isResendingOtp,
    handleOtpChange,
    handleOtpKeyDown,
    handleVerifyOtp,
    handleResendOtp,
    handleVerifyOtpClick,

    // Status menu
    statusMenuAnchorEl,
    updatingJobId,
    getValidTransitions,
    handleUpdateStatusClick,
    handleStatusMenuClose,
    handleStatusChange,

    // Review
    reviewModalOpen,
    setReviewModalOpen,
    rating,
    setRating,
    reviewText,
    setReviewText,
    isSubmittingReview,
    handleOpenReviewModal,
    handleSubmitReview,

    // Complaint
    complaintModalOpen,
    setComplaintModalOpen,
    complaintCategory,
    setComplaintCategory,
    complaintSubject,
    setComplaintSubject,
    complaintDescription,
    setComplaintDescription,
    complaintFiles,
    isSubmittingComplaint,
    complaintFileInputRef,
    handleOpenComplaintModal,
    handleComplaintFileChange,
    handleRemoveComplaintFile,
    handleSubmitComplaint,

    // Cancel
    cancelModalOpen,
    setCancelModalOpen,
    cancelReason,
    setCancelReason,
    isCancelling,
    handleConfirmCancel,

    // Proof
    proofPreview,
    setProofPreview,
    setProofFile,
    isUploadingProof,
    fileInputRef,
    handleProofButtonClick,
    handleFileChange,
    handleUploadProof,

    // Payment & respond
    handleMakePaymentClick,
    handleRespondBooking,
  };
}

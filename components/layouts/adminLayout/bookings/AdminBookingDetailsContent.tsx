"use client";

import {
  getBookingDetailsAPI,
  initiateManualPayoutAPI,
} from "@/api/bookingControllers";
import BookingCustomerCard from "@/components/layouts/adminLayout/bookings/components/BookingCustomerCard";
import BookingPaymentMatrix from "@/components/layouts/adminLayout/bookings/components/BookingPaymentMatrix";
import BookingPurohitCard from "@/components/layouts/adminLayout/bookings/components/BookingPurohitCard";
import BookingServiceCard from "@/components/layouts/adminLayout/bookings/components/BookingServiceCard";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import { useSnackbarStore } from "@/stores/snackbarStore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useSocketStore } from "@/stores/socketStore";

export default function AdminBookingDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await getBookingDetailsAPI(id);
        if (res.success && res.data) {
          setBooking(res.data);
        } else {
          showSnackbar(
            res.message || "Failed to fetch booking details",
            "error"
          );
        }
      } catch (err: any) {
        showSnackbar(
          err.response?.data?.message || "Error fetching details",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id, showSnackbar, refreshTrigger]);

  const handleInitiatePayout = async () => {
    try {
      setIsPaying(true);
      const res = await initiateManualPayoutAPI({ bookingId: booking.id });
      if (res.success) {
        showSnackbar(
          res.message || "Payout initiated successfully",
          "success"
        );
        setBooking({ ...booking, purohitPayoutStatus: "PAID" });
      } else {
        showSnackbar(res.message || "Failed to initiate payout", "error");
      }
    } catch (err: any) {
      showSnackbar(
        err.response?.data?.message || "Error initiating payout",
        "error"
      );
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#FF6200" }} />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Booking not found or could not be loaded.
        </Typography>
      </Box>
    );
  }

  const customerName = booking.customer
    ? `${booking.customer.firstName} ${booking.customer.lastName || ""}`.trim()
    : "N/A";
  const technicianName = booking.purohit
    ? booking.purohit.user
      ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ""}`.trim()
      : `${booking.purohit.firstName} ${booking.purohit.lastName || ""}`.trim()
    : "Not Assigned";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        pb: 6,
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <AdminDetailsHeader title="Booking Details" onBack={() => router.back()}>
        <AdminStatusSelect value={booking.status || "PENDING"} readOnly />
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.875rem",
            width: "100%",
            mt: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 16 }} />
          Scheduled for{" "}
          {new Date(booking.scheduledAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </Typography>
      </AdminDetailsHeader>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BookingCustomerCard
            booking={booking}
            customerName={customerName}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <BookingPurohitCard
            booking={booking}
            technicianName={technicianName}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <BookingServiceCard booking={booking} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <BookingPaymentMatrix
            booking={booking}
            isPaying={isPaying}
            onInitiatePayout={handleInitiatePayout}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

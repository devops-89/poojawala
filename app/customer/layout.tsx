"use client";
import CustomerHeader from "@/components/layouts/customerLayout/CustomerHeader";
import SocketProvider from "@/components/providers/SocketProvider";
import CustomerCartDrawer from "@/components/widgets/CustomerCartDrawer";
import RaiseTicketModal from "@/components/widgets/RaiseTicketModal";
import { Box } from "@mui/material";
import React from "react";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#ffffff",
        }}
      >
        <CustomerHeader />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            mt: "80px",
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
        <RaiseTicketModal />
        <CustomerCartDrawer />
      </Box>
    </SocketProvider>
  );
}

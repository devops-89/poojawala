"use client";
import CustomerHeader from "@/components/layouts/customerLayout/CustomerHeader";
import SocketProvider from "@/components/providers/SocketProvider";
import CustomerCartDrawer from "@/components/widgets/CustomerCartDrawer";
import RaiseTicketModal from "@/components/widgets/RaiseTicketModal";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    let isAuthorized = false;

    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.role === "CUSTOMER") {
          isAuthorized = true;
        }
      } catch (e) {}
    }

    if (!isAuthorized) {
      router.replace("/sign-in");
    }
  }, [pathname, router]);
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
            p: { xs: 1.5, sm: 3, md: 4 },
            mt: { xs: "60px", md: "80px" },
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

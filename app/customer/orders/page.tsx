import CustomerOrdersContent from "@/components/layouts/customerLayout/orders/CustomerOrdersContent";
import { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

export const metadata: Metadata = {
  title: "My Orders | Poojawala",
  description: "View and track your sacred purchases, puja samagri orders, and reorder with ease.",
};

export default function CustomerOrdersPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress sx={{ color: "#FF6200" }} />
        </Box>
      }
    >
      <CustomerOrdersContent />
    </Suspense>
  );
}

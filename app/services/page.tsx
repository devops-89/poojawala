import ServicesLayout from "@/components/layouts/servicesLayout/ServicesLayout";
import { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

export const metadata: Metadata = {
  title: "Our Services | 1Pooja",
  description: "Discover and book verified Pandits and Purohits for a wide range of religious ceremonies.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#FF6200" }} />
        </Box>
      }
    >
      <ServicesLayout />
    </Suspense>
  );
}

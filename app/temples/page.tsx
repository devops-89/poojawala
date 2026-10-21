import TemplesLayout from "@/components/layouts/templesLayout/TemplesLayout";
import { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

export const metadata: Metadata = {
  title: "Sacred Temples & Dhams | 1Pooja",
  description:
    "Explore sacred temples and divine pilgrimage sites across India. Discover consecrated rituals and book authenticated temple pooja services directly.",
  alternates: {
    canonical: "/temples",
  },
  openGraph: {
    url: "/temples",
  },
};

export default function TemplesPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: "#FF6200" }} />
        </Box>
      }
    >
      <TemplesLayout />
    </Suspense>
  );
}

"use client";

import dynamic from "next/dynamic";
import LazyMountContainer from "@/components/widgets/LazyMountContainer";

const TemplesSection = dynamic(
  () => import("@/components/layouts/home-layout/TemplesSection"),
  { ssr: false }
);

export default function LazyTemples() {
  return (
    <LazyMountContainer id="temples-section" minHeight="420px">
      <TemplesSection />
    </LazyMountContainer>
  );
}

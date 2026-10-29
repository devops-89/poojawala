"use client";

import dynamic from "next/dynamic";
import LazyMountContainer from "@/components/widgets/LazyMountContainer";

const ServiceCategoriesSection = dynamic(
  () => import("@/components/layouts/home-layout/ServiceCategoriesSection"),
  { ssr: false }
);

export default function LazyServiceCategories() {
  return (
    <LazyMountContainer id="pooja-by-category" minHeight="420px">
      <ServiceCategoriesSection />
    </LazyMountContainer>
  );
}

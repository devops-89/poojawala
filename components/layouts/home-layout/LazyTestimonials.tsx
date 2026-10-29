"use client";

import dynamic from "next/dynamic";
import LazyMountContainer from "@/components/widgets/LazyMountContainer";

const Testimonials = dynamic(
  () => import("@/components/layouts/home-layout/Testimonials"),
  { ssr: false }
);

export default function LazyTestimonials() {
  return (
    <LazyMountContainer id="testimonials-section" minHeight="360px">
      <Testimonials />
    </LazyMountContainer>
  );
}

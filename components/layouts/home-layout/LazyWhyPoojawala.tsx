"use client";

import dynamic from "next/dynamic";
import LazyMountContainer from "@/components/widgets/LazyMountContainer";

const WhyPoojawala = dynamic(
  () => import("@/components/layouts/home-layout/WhyPoojawala"),
  { ssr: false }
);

export default function LazyWhyPoojawala() {
  return (
    <LazyMountContainer id="why-poojawala" minHeight="300px">
      <WhyPoojawala />
    </LazyMountContainer>
  );
}

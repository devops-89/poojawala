"use client";

import dynamic from "next/dynamic";
import LazyMountContainer from "@/components/widgets/LazyMountContainer";

const PoojaProcessSection = dynamic(
  () => import("@/components/layouts/home-layout/PoojaProcessSection"),
  { ssr: false }
);

export default function LazyPoojaProcess() {
  return (
    <LazyMountContainer id="pooja-process" minHeight="450px">
      <PoojaProcessSection />
    </LazyMountContainer>
  );
}

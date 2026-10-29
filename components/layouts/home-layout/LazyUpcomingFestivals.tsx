"use client";

import dynamic from "next/dynamic";
import LazyMountContainer from "@/components/widgets/LazyMountContainer";

const UpcomingFestivals = dynamic(
  () => import("@/components/layouts/home-layout/UpcomingFestivals"),
  { ssr: false }
);

export default function LazyUpcomingFestivals() {
  return (
    <LazyMountContainer id="upcoming-festivals" minHeight="360px">
      <UpcomingFestivals />
    </LazyMountContainer>
  );
}

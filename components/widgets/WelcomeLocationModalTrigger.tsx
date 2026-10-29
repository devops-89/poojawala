"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WelcomeLocationModal = dynamic(
  () => import("@/components/widgets/WelcomeLocationModal"),
  { ssr: false }
);

export default function WelcomeLocationModalTrigger() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user has already seen or closed the modal in this session
    const alreadyShown =
      sessionStorage.getItem("1pooja_welcome_modal_shown") ||
      sessionStorage.getItem("poojawala_welcome_modal_shown");
    if (alreadyShown) return;

    // Only load the heavy modal (Autocomplete + 49KB Indian locations database) after 10 seconds
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;
  return <WelcomeLocationModal />;
}

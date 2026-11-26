"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useUserStore } from "@/stores/userStore";

const WelcomeLocationModal = dynamic(
  () => import("@/components/widgets/WelcomeLocationModal"),
  { ssr: false }
);

export default function WelcomeLocationModalTrigger() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const { profile } = useUserStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If user is already logged in, do NOT load or display the modal
    const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");
    const userStr =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    const role =
      sessionStorage.getItem("role") ||
      sessionStorage.getItem("activeRole") ||
      localStorage.getItem("role");

    if (profile || token || userStr || role) {
      setShouldLoad(false);
      return;
    }

    // Check if user has already submitted the modal in this session
    const alreadyFilled =
      sessionStorage.getItem("1pooja_welcome_modal_shown") ||
      sessionStorage.getItem("poojawala_welcome_modal_shown");
    if (alreadyFilled) return;

    // Load shortly after home page render for fresh visitors
    const timer = setTimeout(() => {
      const currentToken =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");
      if (!currentToken && !useUserStore.getState().profile) {
        setShouldLoad(true);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [profile]);

  if (!shouldLoad || profile) return null;
  return <WelcomeLocationModal />;
}

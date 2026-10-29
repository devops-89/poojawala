"use client";

import { useEffect } from "react";

export default function HomeScrollRestoration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const targetSection = sessionStorage.getItem("home_restore_section");
    if (!targetSection) return;
    sessionStorage.removeItem("home_restore_section");

    const doScroll = () => {
      const el = document.getElementById(targetSection);
      if (el) {
        el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
        return true;
      }
      return false;
    };

    if (!doScroll()) {
      requestAnimationFrame(doScroll);
    }
  }, []);

  return null;
}

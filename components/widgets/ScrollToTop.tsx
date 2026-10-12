"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Scroll immediately on pathname change
    scrollToTop();

    // Re-apply across animation frames & async rendering ticks
    const rAF = requestAnimationFrame(scrollToTop);
    const timers = [
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 150),
      setTimeout(scrollToTop, 300),
      setTimeout(scrollToTop, 600),
    ];

    return () => {
      cancelAnimationFrame(rAF);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pathname]);

  return null;
}

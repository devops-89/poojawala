"use client";

import { useEffect } from "react";

/**
 * Global component that guarantees the background screen/window/HTML
 * cannot scroll whenever any modal or dialog is open anywhere in the application.
 */
export default function GlobalModalScrollLock() {
  useEffect(() => {
    if (typeof window === "undefined" || !document.body) return;

    const syncScrollLock = () => {
      const isBodyHidden = document.body.style.overflow === "hidden";
      const hasOpenDialog = Boolean(
        document.querySelector(".MuiDialog-root:not([aria-hidden='true'])") ||
        document.querySelector(".MuiModal-root:not(.MuiMenu-root):not(.MuiPopover-root):not([aria-hidden='true'])")
      );

      if (isBodyHidden || hasOpenDialog) {
        if (document.documentElement.style.overflow !== "hidden") {
          document.documentElement.style.overflow = "hidden";
        }
      } else {
        if (document.documentElement.style.overflow === "hidden") {
          document.documentElement.style.overflow = "";
        }
      }
    };

    const observer = new MutationObserver(() => {
      syncScrollLock();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
      childList: true,
      subtree: false,
    });

    syncScrollLock();

    return () => {
      observer.disconnect();
      if (document.documentElement.style.overflow === "hidden") {
        document.documentElement.style.overflow = "";
      }
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

/**
 * Global component that ensures any open Autocomplete popper, Select menu,
 * or Popover closes immediately when the user scrolls the page.
 *
 * If the user scrolls inside the dropdown options list itself, it does NOT close,
 * allowing comfortable scrolling through items.
 */
export default function GlobalDropdownScrollClose() {
  useEffect(() => {
    if (typeof window === "undefined" || !document) return;

    // Checks if an element is inside an active dropdown/listbox
    const isInsideDropdownElement = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      return Boolean(
        el.closest?.(".MuiAutocomplete-popper") ||
        el.closest?.(".MuiAutocomplete-listbox") ||
        el.closest?.(".MuiMenu-paper") ||
        el.closest?.(".MuiPopover-paper") ||
        el.closest?.(".MuiMenu-list") ||
        el.closest?.("[role='listbox']") ||
        el.closest?.(".MuiSelect-select")
      );
    };

    const closeAllOpenDropdowns = () => {
      const activeEl = document.activeElement as HTMLElement | null;

      // 1. Close any Autocomplete poppers
      const hasAutocompletePopper = Boolean(
        document.querySelector(".MuiAutocomplete-popper")
      );
      if (hasAutocompletePopper) {
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.getAttribute?.("role") === "combobox" ||
            activeEl.classList?.contains("MuiAutocomplete-input") ||
            activeEl.closest?.(".MuiAutocomplete-root"))
        ) {
          activeEl.blur();
        }
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            code: "Escape",
            bubbles: true,
          })
        );
      }

      // 2. Close any open Select / Menu / Popover (excluding Dialogs)
      const openPopovers = document.querySelectorAll(
        ".MuiPopover-root:not(.MuiDialog-root), .MuiMenu-root:not(.MuiDialog-root)"
      );
      if (openPopovers.length > 0) {
        openPopovers.forEach((popover) => {
          const backdrop = popover.querySelector(
            ".MuiBackdrop-root"
          ) as HTMLElement | null;
          if (backdrop) {
            backdrop.click();
          }
        });
        if (
          activeEl &&
          (activeEl.classList?.contains("MuiSelect-select") ||
            activeEl.getAttribute?.("role") === "combobox")
        ) {
          activeEl.blur();
        }
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            code: "Escape",
            bubbles: true,
          })
        );
      }
    };

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (isInsideDropdownElement(target)) return;

      const hasDropdown = Boolean(
        document.querySelector(".MuiAutocomplete-popper") ||
        document.querySelector(".MuiPopover-root:not(.MuiDialog-root), .MuiMenu-root:not(.MuiDialog-root)")
      );

      if (hasDropdown) {
        closeAllOpenDropdowns();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (isInsideDropdownElement(target)) return;

      const hasDropdown = Boolean(
        document.querySelector(".MuiAutocomplete-popper") ||
        document.querySelector(".MuiPopover-root:not(.MuiDialog-root), .MuiMenu-root:not(.MuiDialog-root)")
      );

      if (hasDropdown) {
        closeAllOpenDropdowns();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("wheel", handleWheel, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("wheel", handleWheel, true);
    };
  }, []);

  return null;
}

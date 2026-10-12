"use client";

if (
  typeof window !== "undefined" &&
  typeof Array.prototype.toSorted !== "function"
) {
  (Array.prototype as any).toSorted = function (
    compareFn?: (a: any, b: any) => number,
  ) {
    return Array.from(this).sort(compareFn);
  };
}
import { refreshTokenAPI } from "@/api/authControllers";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import theme from "./theme";

import { extractRoleCsrfToken, saveRoleCsrfToken } from "@/api/config";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT") {
        const input = target as HTMLInputElement;
        if (input.type === "number") {
          if (e.key === "-" || e.key === "e" || e.key === "E") {
            e.preventDefault();
          }
          const nameLower = (input.name || "").toLowerCase();
          const isPercentage =
            nameLower.includes("percentage") ||
            nameLower.includes("percent") ||
            input.getAttribute("max") === "100";
          if (isPercentage && e.key === "ArrowUp" && Number(input.value) >= 100) {
            e.preventDefault();
          }
        }
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.tagName === "INPUT" && target.type === "number") {
        if (target.value && (target.value.includes("-") || Number(target.value) < 0)) {
          target.value = target.value.replace(/-/g, "");
        }
        const nameLower = (target.name || "").toLowerCase();
        const placeholderLower = (target.placeholder || "").toLowerCase();
        const labelLower = (target.getAttribute("aria-label") || "").toLowerCase();
        if (
          nameLower.includes("percentage") ||
          nameLower.includes("percent") ||
          placeholderLower.includes("percentage") ||
          labelLower.includes("percentage") ||
          target.getAttribute("max") === "100"
        ) {
          if (Number(target.value) > 100) {
            target.value = "100";
            target.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "INPUT" && (target as HTMLInputElement).type === "number") {
        (target as HTMLInputElement).blur();
      }
      if (
        document.activeElement &&
        document.activeElement.tagName === "INPUT" &&
        (document.activeElement as HTMLInputElement).type === "number"
      ) {
        (document.activeElement as HTMLInputElement).blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("input", handleInput, true);
    window.addEventListener("wheel", handleWheel, { passive: true, capture: true });

    const interval = setInterval(async () => {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const res = await refreshTokenAPI();
          const csrf = extractRoleCsrfToken(res, user?.role);

          if (csrf) {
            saveRoleCsrfToken(csrf, user?.role);
          }
        } catch (error) {
          console.error("Failed to refresh token periodically", error);
        }
      }
    }, 600000); // 10 minutes

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("input", handleInput, true);
      window.removeEventListener("wheel", handleWheel, true);
      clearInterval(interval);
    };
  }, []);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

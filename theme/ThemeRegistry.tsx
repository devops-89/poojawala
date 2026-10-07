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
        }
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.tagName === "INPUT" && target.type === "number") {
        if (target.value && (target.value.includes("-") || Number(target.value) < 0)) {
          target.value = target.value.replace(/-/g, "");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("input", handleInput, true);

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

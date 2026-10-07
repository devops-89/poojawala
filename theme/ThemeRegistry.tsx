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

    return () => clearInterval(interval);
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

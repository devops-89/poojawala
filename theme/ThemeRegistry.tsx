"use client";

import { refreshTokenAPI } from "@/api/authControllers";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import theme from "./theme";

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
          const res = await refreshTokenAPI();
          if (res.csrfToken) {
            sessionStorage.setItem("csrfToken", res.csrfToken);
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

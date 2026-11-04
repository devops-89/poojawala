"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Portal routes and authentication routes that are NOT public website pages
const NON_WEBSITE_ROUTE_PREFIXES = [
  "/admin",
  "/customer",
  "/partner",
  "/purohit",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

export default function PublicRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    const normalized = pathname.toLowerCase().replace(/\/$/, "") || "/";

    // Skip check if currently on an auth workflow or dedicated portal route
    const isNonWebsiteRoute = NON_WEBSITE_ROUTE_PREFIXES.some(
      (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
    );

    if (isNonWebsiteRoute) {
      return;
    }

    // User is on a public website route (e.g. /, /services, /temples, /astrologers, /products, /blogs, etc.)
    // Check if an Admin, Purohit, or Astrologer is currently logged in:
    try {
      const userStr =
        sessionStorage.getItem("user") || localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      if (!user || typeof user !== "object") return;

      const rawRole = String(
        user.role ||
          sessionStorage.getItem("role") ||
          sessionStorage.getItem("activeRole") ||
          ""
      ).toUpperCase();

      // If user has role ADMIN, PUROHIT, or ASTROLOGER, they cannot access website pages
      if (
        rawRole === "ADMIN" ||
        rawRole === "SUPER_ADMIN" ||
        rawRole === "SUPERADMIN"
      ) {
        router.replace("/admin/dashboard");
      } else if (rawRole === "PUROHIT") {
        router.replace("/partner/dashboard");
      } else if (rawRole === "ASTROLOGER") {
        router.replace("/partner/astrologybookings");
      }
      // Note: role === "CUSTOMER" is explicitly allowed to browse the public website!
    } catch (e) {
      // JSON parse error or unauthenticated
    }
  }, [pathname, router]);

  return null;
}

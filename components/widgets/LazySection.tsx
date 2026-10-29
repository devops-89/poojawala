"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: string | number;
  rootMargin?: string;
  id?: string;
}

export default function LazySection({
  children,
  minHeight = "280px",
  rootMargin = "250px",
  id,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user is navigating directly to this section via hash or restore key
    const restoreSection = sessionStorage.getItem("home_restore_section");
    if (restoreSection && id && (restoreSection === id || restoreSection.includes(id))) {
      setIsVisible(true);
      return;
    }

    if (window.location.hash && id && window.location.hash.includes(id)) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [id, rootMargin]);

  return (
    <Box
      ref={containerRef}
      id={id}
      sx={{
        width: "100%",
        minHeight: isVisible ? undefined : minHeight,
      }}
    >
      {isVisible ? children : null}
    </Box>
  );
}

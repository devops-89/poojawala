"use client";

import React, { useEffect, useRef, useState } from "react";

interface LazyMountContainerProps {
  children: React.ReactNode;
  id: string;
  minHeight: string;
  rootMargin?: string;
}

export default function LazyMountContainer({
  children,
  id,
  minHeight,
  rootMargin = "250px",
}: LazyMountContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreSection = sessionStorage.getItem("home_restore_section");
    const isDirectTarget =
      (restoreSection && restoreSection.includes(id)) ||
      (window.location.hash && window.location.hash.includes(id));

    if (isDirectTarget || !("IntersectionObserver" in window)) {
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
    <div
      ref={containerRef}
      id={id}
      style={{
        width: "100%",
        minHeight: isVisible ? undefined : minHeight,
      }}
    >
      {isVisible ? children : null}
    </div>
  );
}

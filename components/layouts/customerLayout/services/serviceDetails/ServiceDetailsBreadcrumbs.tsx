"use client";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Breadcrumbs, Typography } from "@mui/material";
import NextLink from "next/link";

interface Props {
  serviceName: string;
  service?: any;
  servicesHref?: string;
  servicesLabel?: string;
}

export default function ServiceDetailsBreadcrumbs({
  serviceName,
  service,
  servicesHref,
  servicesLabel,
}: Props) {
  const isOnline = Boolean(
    service?.isOnline === true ||
    String(service?.isOnline).toLowerCase() === "true" ||
    service?.isOnline === 1 ||
    String(service?.isOnline) === "1"
  );
  const isOffline = Boolean(
    service?.isOffline === true ||
    String(service?.isOffline).toLowerCase() === "true" ||
    service?.isOffline === 1 ||
    String(service?.isOffline) === "1"
  );

  const resolvedLabel =
    servicesLabel ||
    (isOnline ? "Online Services" : isOffline ? "Offline Services" : "Explore Services");

  const resolvedHref =
    servicesHref ||
    (isOnline
      ? "/customer/services?isOnline=true"
      : isOffline
      ? "/customer/services?isOffline=true"
      : "/customer/services");

  return (
    <Breadcrumbs
      separator={<ChevronRightIcon fontSize="small" sx={{ color: "#A39288" }} />}
      sx={{ mb: 3 }}
    >
      <NextLink
        href={resolvedHref}
        style={{ textDecoration: "none", color: "#64534A", fontWeight: 600, fontSize: "14px" }}
      >
        {resolvedLabel}
      </NextLink>
      <Typography
        sx={{
          color: "#2C1810",
          fontWeight: 700,
          fontSize: "14px",
          wordBreak: "break-word",
        }}
      >
        {serviceName}
      </Typography>
    </Breadcrumbs>
  );
}

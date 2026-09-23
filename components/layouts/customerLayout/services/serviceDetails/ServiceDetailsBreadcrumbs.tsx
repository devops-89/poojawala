"use client";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Breadcrumbs, Typography } from "@mui/material";
import NextLink from "next/link";

interface Props {
  serviceName: string;
  servicesHref?: string;
  servicesLabel?: string;
}

export default function ServiceDetailsBreadcrumbs({
  serviceName,
  servicesHref = "/customer/services",
  servicesLabel = "Explore Services",
}: Props) {
  return (
    <Breadcrumbs
      separator={<ChevronRightIcon fontSize="small" sx={{ color: "#A39288" }} />}
      sx={{ mb: 3 }}
    >
      <NextLink
        href={servicesHref}
        style={{ textDecoration: "none", color: "#64534A", fontWeight: 600, fontSize: "14px" }}
      >
        {servicesLabel}
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

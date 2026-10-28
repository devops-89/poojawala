"use client";
import { COLORS } from "@/utils/enums";

import { getServiceByIdAPI, registerServiceSlugMapping } from "@/api/serviceControllers";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import ServiceCitiesCard from "@/components/layouts/adminLayout/services/ServiceCitiesCard";
import ServiceDescriptionCard from "@/components/layouts/adminLayout/services/ServiceDescriptionCard";
import ServiceHeaderCard from "@/components/layouts/adminLayout/services/ServiceHeaderCard";
import ServiceSpecsPricingCard from "@/components/layouts/adminLayout/services/ServiceSpecsPricingCard";
import { useSnackbarStore } from "@/stores/snackbarStore";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const parseJsonIfNeeded = (val: any) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

export default function AdminServiceDetailsContent() {
  const params = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const identifier = (params.slug || params.id) as string;
    if (!identifier) return;

    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const response = await getServiceByIdAPI(identifier);
        let data = response?.data;
        while (data?.data && !data?.id) {
          data = data.data;
        }

        if (data?.id) {
          setService(data);
          if (data?.slug) {
            registerServiceSlugMapping(data.slug, data.id);
            if (/^\d+$/.test(String(identifier))) {
              window.history.replaceState(null, "", `/admin/services/${data.slug}`);
            }
          }
        } else {
          showSnackbar(
            response?.message || "Failed to fetch service details",
            "error"
          );
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        showSnackbar("Error fetching service details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [params.id, params.slug, showSnackbar]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  if (!service) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="text.secondary">
          Service not found
        </Typography>
        <Button
          component={NextLink}
          href="/admin/services"
          sx={{ mt: 2, color: COLORS.PRIMARY }}
        >
          Back to Services
        </Button>
      </Box>
    );
  }

  const benefitsList = parseJsonIfNeeded(service.benefits);
  const citiesList = parseJsonIfNeeded(service.cities);
  const languagesList = parseJsonIfNeeded(service.languages);
  const languagesText = languagesList
    .map((lang: any) =>
      typeof lang === "string" ? lang : lang.name || lang.code || ""
    )
    .filter(Boolean)
    .join(", ");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <AdminDetailsHeader
        title="Service Details"
        breadcrumbs={[
          { label: "Services", href: "/admin/services" },
          { label: service.name || "Service Details" },
        ]}
        actionButton={
          <Button
            component={NextLink}
            href={`/admin/services/edit/${service?.slug || service?.id || params.id}`}
            variant="contained"
            sx={{
              background: COLORS.PRIMARY,
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              py: 1.5,
              px: 3,
              boxShadow: "0 4px 14px 0 rgba(255, 98, 0, 0.39)",
              "&:hover": {
                background: COLORS.PRIMARY_DARK,
                boxShadow: "0 6px 20px rgba(255, 98, 0, 0.23)",
              },
            }}
            startIcon={<EditIcon />}
          >
            Edit Service
          </Button>
        }
      />

      <ServiceHeaderCard
        service={service}
        languagesList={languagesList}
        languagesText={languagesText}
      />

      <ServiceDescriptionCard
        description={service.description}
        benefitsList={benefitsList}
      />

      <ServiceCitiesCard citiesList={citiesList} />

      <ServiceSpecsPricingCard service={service} />
    </Box>
  );
}

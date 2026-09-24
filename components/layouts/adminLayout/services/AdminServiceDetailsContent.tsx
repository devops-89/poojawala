"use client";

import { getServiceByIdAPI } from "@/api/serviceControllers";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import ServiceCitiesCard from "@/components/layouts/adminLayout/services/components/ServiceCitiesCard";
import ServiceDescriptionCard from "@/components/layouts/adminLayout/services/components/ServiceDescriptionCard";
import ServiceHeaderCard from "@/components/layouts/adminLayout/services/components/ServiceHeaderCard";
import ServiceSpecsPricingCard from "@/components/layouts/adminLayout/services/components/ServiceSpecsPricingCard";
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
    const fetchServiceDetails = async () => {
      try {
        const response = await getServiceByIdAPI(params.id as string);
        if (response.success) {
          setService(response.data?.data || response.data);
        } else {
          showSnackbar(
            response.message || "Failed to fetch service details",
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
    if (params.id) {
      fetchServiceDetails();
    }
  }, [params.id, showSnackbar]);

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
        <CircularProgress sx={{ color: "#FF6200" }} />
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
          sx={{ mt: 2, color: "#FF6200" }}
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
          { label: "Service Details" },
        ]}
        actionButton={
          <Button
            component={NextLink}
            href={`/admin/services/edit/${params.id}`}
            variant="contained"
            sx={{
              background: "#FF6200",
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              py: 1.5,
              px: 3,
              boxShadow: "0 4px 14px 0 rgba(255, 98, 0, 0.39)",
              "&:hover": {
                background: "#E65800",
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

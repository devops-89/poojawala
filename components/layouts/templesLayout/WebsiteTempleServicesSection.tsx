"use client";

import { getAllServicesAPI } from "@/api/serviceControllers";
import ServiceCard from "@/components/layouts/servicesLayout/ServiceCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { formatServicePriceRange } from "@/utils/helpers";

interface WebsiteTempleServicesSectionProps {
  temple: any;
}

export default function WebsiteTempleServicesSection({
  temple,
}: WebsiteTempleServicesSectionProps) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTempleServices = async () => {
      if (!temple?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Use services directly if provided in temple response
        if (Array.isArray(temple.services) && temple.services.length > 0) {
          setServices(formatServiceList(temple.services));
          setLoading(false);
          return;
        }

        const res = await getAllServicesAPI(
          1,
          6,
          "",
          true,
          undefined,
          undefined,
          undefined,
          temple.id
        );

        let list: any[] = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.services)) list = res.services;

        setServices(formatServiceList(list));
      } catch (err) {
        console.error("Failed to load services for temple", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTempleServices();
  }, [temple?.id, temple?.services]);

  const formatServiceList = (rawList: any[]) => {
    const filtered = rawList
      .filter((s: any) => s && s.isActive !== false)
      .map((s: any) => {
        const computedPriceStr = formatServicePriceRange(s, "");

        const serviceImg =
          s.iconDownloadurl ||
          s.iconUrl ||
          s.imageUrl ||
          s.image ||
          temple?.downloadUrl ||
          temple?.imageUrl ||
          "/images/home/poojaPackages/satyanarayan.webp";

        return {
          id: s.id || s._id,
          title: s.name || s.title || "Vedic Service",
          image: serviceImg,
          description: s.description || "",
          price: computedPriceStr,
          duration: s.durationMinutes
            ? `${Math.round(s.durationMinutes / 60)} hr`
            : s.duration || "2 hrs",
          category: s.category?.name || "Temple Pooja",
          isOnline: Boolean(s.isOnline),
          isOffline: Boolean(s.isOffline),
          slug: s.slug || null,
        };
      });

    if (typeof window !== "undefined" && filtered.length > 0) {
      filtered.forEach((s: any) => {
        if (s.id && s.slug) {
          const lower = String(s.slug).toLowerCase();
          localStorage.setItem(`slug_to_id_${lower}`, String(s.id));
          sessionStorage.setItem(`slug_to_id_${lower}`, String(s.id));
        }
      });
    }

    return filtered;
  };

  const bookUrl = `/services?templeId=${temple?.id}`;

  return (
    <Box id="temple-services-section" sx={{ py: { xs: 5, md: 7 }, borderTop: "1px solid #F3E8DB" }}>
      {/* Section Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: { xs: "24px", md: "30px" },
              color: "#2C1810",
              mb: 0.8,
            }}
          >
            Temple Poojas & Ceremonies
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "14px",
              color: "#8C7A6B",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Sacred Rituals performed at {temple?.name}
          </Typography>
        </Box>

        <Button
          component={NextLink}
          href={bookUrl}
          variant="contained"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{
            background: COLORS.PRIMARY,
            color: "#FFFFFF",
            borderRadius: "28px",
            px: 3,
            py: 1,
            fontWeight: 700,
            fontSize: "13.5px",
            fontFamily: FONTS.OUTFIT,
            textTransform: "none",
            boxShadow: "0 4px 14px rgba(255, 98, 0, 0.2)",
            "&:hover": {
              background: "#E05500",
            },
          }}
        >
          View All Associated Poojas
        </Button>
      </Box>

      {/* Services List / Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : services.length > 0 ? (
        <Grid container spacing={3}>
          {services.map((srv) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={srv.id} sx={{ display: "flex" }}>
              <ServiceCard
                id={srv.id}
                slug={srv.slug}
                title={srv.title}
                image={srv.image}
                description={srv.description}
                price={srv.price}
                duration={srv.duration}
                category={srv.category}
                isOnline={srv.isOnline}
                isOffline={srv.isOffline}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Empty State / Booking Callout */
        <Box
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: "20px",
            bgcolor: "#FFFDF9",
            border: "1.5px dashed #FED7AA",
            textAlign: "center",
            maxWidth: "700px",
            mx: "auto",
          }}
        >
          <TempleHinduIcon sx={{ fontSize: 44, color: COLORS.PRIMARY, mb: 1.5 }} />
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              fontSize: "20px",
              color: "#2C1810",
              mb: 1,
            }}
          >
            Book a Consecrated Pooja at {temple?.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "14px",
              color: "#64748b",
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            Looking to perform an Archana, Rudrabhishek, or customized Vedic
            havan at this temple? Browse all authentic pooja packages and
            schedule a verified Pandit.
          </Typography>
          <Button
            component={NextLink}
            href={bookUrl}
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              background: COLORS.PRIMARY,
              color: "#FFFFFF",
              borderRadius: "30px",
              px: 3.5,
              py: 1.2,
              fontWeight: 700,
              fontSize: "14px",
              fontFamily: FONTS.OUTFIT,
              textTransform: "none",
            }}
          >
            Explore & Book Temple Pooja
          </Button>
        </Box>
      )}
    </Box>
  );
}

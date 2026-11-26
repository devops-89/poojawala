"use client";

import { getAllServicesAPI } from "@/api/serviceControllers";
import MobileServiceCard from "@/components/layouts/servicesLayout/mobile/MobileServiceCard";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { normalizePoojaText } from "@/utils/helpers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { formatTempleServiceList } from "./templeDetailsHelpers";

interface MobileTempleServicesProps {
  temple: any;
}

const extractServices = (res: any): any[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.services)) return res.services;
  return [];
};

const MobileTempleServices = ({ temple }: MobileTempleServicesProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTempleServices = async () => {
      if (!temple?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (Array.isArray(temple.services) && temple.services.length > 0) {
          if (isMounted) {
            setServices(formatTempleServiceList(temple.services, temple));
          }
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
          temple.id,
        );

        if (isMounted) {
          setServices(formatTempleServiceList(extractServices(res), temple));
        }
      } catch (err) {
        console.error("Failed to load services for mobile temple details", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTempleServices();
    return () => {
      isMounted = false;
    };
  }, [temple]);

  const bookUrl = `/services?templeId=${temple?.id}`;

  return (
    <Box
      id="temple-services-section"
      sx={{
        px: 2,
        py: 2.5,
        borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          fontSize: "19px",
          color: COLORS.TEXT_DARK,
          mb: 0.4,
        }}
      >
        Temple Poojas & Ceremonies
      </Typography>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontSize: "12.5px",
          fontWeight: 500,
          color: COLORS.TEXT_MUTED,
          mb: 2,
        }}
      >
        Sacred rituals performed at{" "}
        {normalizePoojaText(temple?.name || "this temple")}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress size={30} sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : services.length > 0 ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {services.map((srv) => (
              <MobileServiceCard
                key={srv.id}
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
            ))}
          </Box>

          <Button
            component={NextLink}
            href={bookUrl}
            fullWidth
            variant="outlined"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              mt: 2.25,
              borderRadius: "14px",
              borderColor: COLORS.PRIMARY,
              color: COLORS.PRIMARY,
              bgcolor: COLORS.BG_CREAM,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "13.5px",
              textTransform: "none",
              py: 1.1,
              "&:hover": {
                bgcolor: COLORS.LIGHT_BG_HOVER,
                borderColor: COLORS.PRIMARY_HOVER,
              },
            }}
          >
            View All Associated Poojas
          </Button>
        </>
      ) : (
        <Box
          sx={{
            p: 3,
            borderRadius: "18px",
            bgcolor: COLORS.WHITE,
            border: `1.5px dashed ${COLORS.LIGHT_BORDER}`,
            textAlign: "center",
          }}
        >
          <TempleHinduIcon sx={{ fontSize: 36, color: COLORS.PRIMARY, mb: 1 }} />
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "16px",
              color: COLORS.TEXT_DARK,
              mb: 0.75,
            }}
          >
            Book a Consecrated Pooja
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "13px",
              color: COLORS.TEXT_SECONDARY,
              lineHeight: 1.5,
              mb: 2,
            }}
          >
            Browse authentic pooja packages and schedule a verified Pandit at{" "}
            {normalizePoojaText(temple?.name || "this temple")}.
          </Typography>
          <Button
            component={NextLink}
            href={bookUrl}
            fullWidth
            variant="contained"
            disableElevation
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: COLORS.WHITE,
              borderRadius: "14px",
              py: 1.1,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "13.5px",
              textTransform: "none",
              "&:hover": { bgcolor: COLORS.PRIMARY_HOVER },
            }}
          >
            Explore & Book Temple Pooja
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(MobileTempleServices);

"use client";

import EmptyStateCard from "@/components/widgets/EmptyStateCard";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { Box, Button, Container, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import PopularPackageCard from "./popularPackages/PopularPackageCard";
import PopularPackagesHeader from "./popularPackages/PopularPackagesHeader";
import PopularPackagesSkeleton from "./popularPackages/PopularPackagesSkeleton";
import { getPackageTargetUrl, PackageItem } from "./popularPackages/constants";
import { usePopularPackages } from "./popularPackages/usePopularPackages";

export default function PopularPackages() {
  const router = useRouter();
  const { packages, loading } = usePopularPackages();

  const handleViewAll = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("home_restore_section", "popular-packages");
    }
    router.push("/services");
  }, [router]);

  const handleSelectPackage = useCallback(
    (pkg: PackageItem) => {
      router.push(getPackageTargetUrl(pkg));
    },
    [router],
  );

  return (
    <Box
      id="popular-packages"
      sx={{ py: { xs: 5, md: 9 }, bgcolor: "#FFF", scrollMarginTop: "90px" }}
    >
      <Container maxWidth="lg">
        <PopularPackagesHeader
          hasPackages={packages.length > 0}
          onViewAll={handleViewAll}
        />

        {loading && packages.length === 0 ? (
          <PopularPackagesSkeleton />
        ) : packages.length === 0 ? (
          <EmptyStateCard
            icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 32 }} />}
            title="No Pooja Packages Available"
            description="Currently, there are no active pooja packages available. Check back soon or request a custom ceremony!"
            actionText="Request Custom Pooja"
            actionHref="/sign-in"
          />
        ) : (
          <Grid
            container
            spacing={{ xs: 3, sm: 3, md: 3.5 }}
            sx={{ justifyContent: "center", alignItems: "stretch" }}
          >
            {packages.map((pkg) => (
              <Grid
                key={pkg.id}
                size={{ xs: 12, sm: 6, md: packages.length === 3 ? 4 : 3 }}
                sx={{ display: "flex" }}
              >
                <PopularPackageCard pkg={pkg} onSelect={handleSelectPackage} />
              </Grid>
            ))}
          </Grid>
        )}

        {packages.length > 0 && (
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              mt: { xs: 4, sm: 5 },
            }}
          >
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              onClick={handleViewAll}
              sx={{
                color: "#D32F2F",
                borderColor: "#D32F2F",
                borderRadius: "31px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: FONTS.OUTFIT,
                px: 3.5,
                py: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: COLORS.PRIMARY,
                  borderColor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                },
              }}
            >
              View All Pooja Packages
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

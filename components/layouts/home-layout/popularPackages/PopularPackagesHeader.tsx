import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface PopularPackagesHeaderProps {
  hasPackages: boolean;
  onViewAll: () => void;
}

const PopularPackagesHeader = ({
  hasPackages,
  onViewAll,
}: PopularPackagesHeaderProps) => (
  <Box
    sx={{
      textAlign: "center",
      mb: { xs: 4, md: 6 },
      position: "relative",
    }}
  >
    <Typography
      variant="h3"
      component="h2"
      sx={{
        fontFamily: FONTS.OUTFIT,
        fontWeight: 700,
        fontSize: { xs: "28px", sm: "36px", md: "44px" },
        color: "#1A1A1A",
        mb: 1.5,
      }}
    >
      Popular Pooja Packages
    </Typography>

    <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
      <Image
        src="/images/home/poojaPackages/dhanush.svg"
        alt="Decorative Arch"
        width={650}
        height={40}
        loading="lazy"
        style={{
          width: "90%",
          maxWidth: "650px",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </Box>

    {hasPackages && (
      <Box
        sx={{
          position: "absolute",
          right: 0,
          bottom: 10,
          display: { xs: "none", md: "block" },
        }}
      >
        <Button
          endIcon={<ArrowForwardIcon fontSize="small" />}
          onClick={onViewAll}
          sx={{
            color: "#D32F2F",
            background: "transparent",
            borderRadius: "31px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              background: COLORS.PRIMARY,
              color: "#FFFFFF",
            },
          }}
        >
          View all
        </Button>
      </Box>
    )}
  </Box>
);

export default React.memo(PopularPackagesHeader);

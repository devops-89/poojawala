import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Card, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import {
  cleanPackageText,
  formatDisplayPrice,
  PackageItem,
} from "./constants";

interface PopularPackageCardProps {
  pkg: PackageItem;
  onSelect: (pkg: PackageItem) => void;
}

const getPriceFontSize = (price: string) => {
  if (price.length > 13) return { xs: "15px", sm: "16px" };
  if (price.length > 9) return { xs: "17px", sm: "18px" };
  return { xs: "19px", sm: "21px" };
};

const HangingBells = ({ flip = false }: { flip?: boolean }) => {
  const gradientId = React.useId();
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        top: 0,
        ...(flip ? { right: 14 } : { left: 14 }),
        transform: flip ? "scaleX(-1)" : "none",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <svg width="34" height="58" viewBox="0 0 34 58" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5CE62" />
            <stop offset="55%" stopColor="#D4942A" />
            <stop offset="100%" stopColor="#9E6212" />
          </linearGradient>
        </defs>
        {/* Outer longer bell chain */}
        <line
          x1="9"
          y1="0"
          x2="9"
          y2="37"
          stroke="#C89336"
          strokeWidth="1.2"
          strokeDasharray="1.8 1.6"
        />
        <path
          d="M9 36C6.2 36 4.8 38.5 4.5 42L3 45.5H15L13.5 42C13.2 38.5 11.8 36 9 36Z"
          fill={`url(#${gradientId})`}
        />
        <circle cx="9" cy="46.5" r="1.3" fill="#9E6212" />

        {/* Inner shorter bell chain */}
        <line
          x1="24"
          y1="0"
          x2="24"
          y2="24"
          stroke="#C89336"
          strokeWidth="1"
          strokeDasharray="1.6 1.5"
        />
        <path
          d="M24 23.5C22 23.5 21 25.3 20.8 27.8L19.7 30.2H28.3L27.2 27.8C27 25.3 26 23.5 24 23.5Z"
          fill={`url(#${gradientId})`}
        />
        <circle cx="24" cy="31" r="1" fill="#9E6212" />
      </svg>
    </Box>
  );
};

const LotusDivider = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.25,
      mt: 1,
      mb: 1.75,
      width: "100%",
    }}
  >
    <Box
      sx={{
        flex: 1,
        maxWidth: 56,
        height: "1px",
        background: "linear-gradient(90deg, transparent, #D8B46A)",
      }}
    />
    <svg
      width="24"
      height="15"
      viewBox="0 0 24 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2C10.5 5.2 10.5 8.5 12 12C13.5 8.5 13.5 5.2 12 2Z"
        stroke="#C68B2C"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M12 12C9 11 6.5 8.5 6 5C8.5 5.5 10.5 7.5 12 12Z"
        stroke="#C68B2C"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M12 12C15 11 17.5 8.5 18 5C15.5 5.5 13.5 7.5 12 12Z"
        stroke="#C68B2C"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.5C8.2 12.8 5 11.5 3.5 9C6 8.8 9 10 12 12.5Z"
        stroke="#C68B2C"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.5C15.8 12.8 19 11.5 20.5 9C18 8.8 15 10 12 12.5Z"
        stroke="#C68B2C"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
    <Box
      sx={{
        flex: 1,
        maxWidth: 56,
        height: "1px",
        background: "linear-gradient(90deg, #D8B46A, transparent)",
      }}
    />
  </Box>
);

const PopularPackageCard = ({ pkg, onSelect }: PopularPackageCardProps) => {
  const displayPrice = formatDisplayPrice(pkg.price);
  const displayTitle = cleanPackageText(pkg.title);
  const displayDescription = cleanPackageText(pkg.description);

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSelect(pkg);
  };

  return (
    <Card
      elevation={0}
      onClick={() => onSelect(pkg)}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "24px",
        border: "1.5px solid #D9B779",
        background:
          "linear-gradient(180deg, #FFF7E8 0%, #FFFDF8 48%, #FFFDF8 100%)",
        overflow: "hidden",
        cursor: "pointer",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 14px 34px rgba(184, 134, 11, 0.18)",
          borderColor: "#C68B2C",
        },
      }}
    >
      <HangingBells />
      <HangingBells flip />

      {/* Top Centered Artwork with Mandala Watermark & Title */}
      <Box
        sx={{
          position: "relative",
          pt: 2.5,
          px: { xs: 2, sm: 2.25 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "165px",
            borderRadius: "16px",
            overflow: "hidden",
            mb: 1.5,
            bgcolor: "#FAF4EE",
          }}
        >
          <Image
            src={pkg.image}
            alt={displayTitle}
            fill
            unoptimized={
              typeof pkg.image === "string" && pkg.image.startsWith("http")
            }
            sizes="(max-width: 600px) 380px, (max-width: 960px) 45vw, 280px"
            style={{ objectFit: "cover" }}
          />
        </Box>

        <Typography
          component="h3"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            fontSize: { xs: "19px", sm: "20px" },
            color: "#2C1810",
            textAlign: "center",
            lineHeight: 1.25,
            minHeight: "50px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            alignContent: "center",
          }}
        >
          {displayTitle}
        </Typography>

        <LotusDivider />
      </Box>

      {/* Card Body */}
      <Box
        sx={{
          px: { xs: 2, sm: 2.25 },
          pb: { xs: 2.25, sm: 2.5 },
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#C68B2C",
              textTransform: "uppercase",
              mb: 0.4,
            }}
          >
            {pkg.price.includes("-") ? "PRICE RANGE" : "STARTING FROM"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              flexWrap: "nowrap",
              gap: 0.6,
              mb: 1.25,
              height: "28px",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: getPriceFontSize(pkg.price),
                color: "#2C1810",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {displayPrice}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12px",
                fontWeight: 500,
                color: "#7A6353",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {pkg.unit || "/ ceremony"}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "13px",
              color: "#3D2E25",
              lineHeight: 1.55,
              height: "60px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 2.25,
            }}
          >
            {displayDescription}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={
              <InfoOutlinedIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
            }
            onClick={handleActionClick}
            sx={{
              flex: 1,
              minWidth: 0,
              border: `1.5px solid ${COLORS.PRIMARY}`,
              color: COLORS.PRIMARY,
              bgcolor: COLORS.BG_CREAM,
              borderRadius: "16px",
              px: 1,
              py: 1.05,
              fontSize: "12.5px",
              fontWeight: 600,
              fontFamily: FONTS.OUTFIT,
              textTransform: "none",
              whiteSpace: "nowrap",
              transition: "all 0.25s ease",
              "& .MuiButton-startIcon": { mr: 0.5 },
              "&:hover": {
                bgcolor: COLORS.LIGHT_BG_HOVER,
                borderColor: COLORS.PRIMARY_HOVER,
              },
            }}
          >
            View Details
          </Button>

          <Button
            variant="contained"
            disableElevation
            startIcon={<CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={handleActionClick}
            sx={{
              flex: 1,
              minWidth: 0,
              bgcolor: COLORS.PRIMARY,
              color: COLORS.WHITE,
              borderRadius: "16px",
              px: 1,
              py: 1.05,
              fontSize: "12.5px",
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              textTransform: "none",
              whiteSpace: "nowrap",
              boxShadow: `0 4px 14px ${COLORS.PRIMARY_SHADOW}`,
              transition: "all 0.25s ease",
              "& .MuiButton-startIcon": { mr: 0.5 },
              "&:hover": {
                bgcolor: COLORS.PRIMARY_HOVER,
              },
            }}
          >
            Book Pooja
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default React.memo(PopularPackageCard);

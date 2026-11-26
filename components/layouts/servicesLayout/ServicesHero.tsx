import ListingBackButton from "@/components/widgets/ListingBackButton";
import { FONTS } from "@/utils/fonts";
import { Box, Container, Typography } from "@mui/material";
import React from "react";

export type ServicesMode = "online" | "offline" | "default";

interface HeroContentItem {
  highlight: string;
  description: string;
}

const HERO_CONTENT: Record<ServicesMode, HeroContentItem> = {
  online: {
    highlight: "Online Pooja Services",
    description:
      "Experience authentic sacred rituals performed live via interactive digital video by experienced Purohits from anywhere.",
  },
  offline: {
    highlight: "Offline Pooja Services",
    description:
      "Discover and book verified Pandits and Purohits for a wide range of religious ceremonies, tailored to your language and local traditions.",
  },
  default: {
    highlight: "Sacred Pooja Services",
    description:
      "Discover and book verified Pandits and Purohits for a wide range of religious ceremonies, tailored to your language and local traditions.",
  },
};

interface ServicesHeroProps {
  mode: ServicesMode;
}

const ServicesHero = ({ mode }: ServicesHeroProps) => {
  const { highlight, description } = HERO_CONTENT[mode];

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "auto", md: "calc(100vh - 80px)" },
        minHeight: { xs: "380px", sm: "460px", md: "calc(100vh - 80px)" },
        maxHeight: { md: "calc(100vh - 80px)" },
        backgroundImage: {
          xs: "linear-gradient(180deg, rgba(12, 6, 2, 0.78) 0%, rgba(12, 6, 2, 0.52) 60%, rgba(12, 6, 2, 0.18) 100%), url(/images/servicesHero-mobile.webp)",
          sm: "linear-gradient(90deg, rgba(12, 6, 2, 0.82) 0%, rgba(12, 6, 2, 0.55) 55%, rgba(12, 6, 2, 0.12) 80%, transparent 100%), url(/images/servicesHero.webp)",
          md: "linear-gradient(90deg, rgba(12, 6, 2, 0.84) 0%, rgba(12, 6, 2, 0.55) 42%, rgba(12, 6, 2, 0.15) 68%, transparent 85%), url(/images/servicesHero.webp)",
        },
        backgroundSize: "cover",
        backgroundPosition: { xs: "top right", md: "center" },
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        pt: { xs: 3.5, sm: 4, md: 4 },
        pb: { xs: 4, sm: 5, md: 6 },
        mb: { xs: 4, md: 6 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "620px" },
            my: "auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          <ListingBackButton variant="hero" />
          <Typography
            component="h1"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#FFFFFF",
              mb: { xs: 1.5, md: 3 },
              fontSize: { xs: "1.85rem", sm: "2.4rem", md: "48px" },
              lineHeight: { xs: 1.2, md: 1.22 },
              letterSpacing: "-0.03em",
              textShadow:
                "0 2px 10px rgba(0, 0, 0, 0.85), 0 4px 20px rgba(0, 0, 0, 0.7)",
            }}
          >
            Explore Our{" "}
            <Box
              component="span"
              sx={{
                display: { xs: "inline", sm: "block" },
                fontWeight: 800,
                color: "#FFB300",
                textShadow:
                  "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 179, 0, 0.5)",
              }}
            >
              {highlight}
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#F1F5F9",
              fontWeight: 500,
              fontSize: { xs: "14.5px", sm: "15px", md: "16px" },
              lineHeight: 1.6,
              maxWidth: "520px",
              letterSpacing: "0em",
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.9)",
            }}
          >
            {description}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default React.memo(ServicesHero);

"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import NextLink from "next/link";

export default function BlogCtaBanner() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#1E1711",
        color: "white",
        py: { xs: 6, md: 8 },
        mt: 8,
        mb: 0,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          {/* Left Text Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Georgia", serif',
                fontWeight: 700,
                color: "white",
                fontSize: { xs: "1.75rem", sm: "2.35rem", md: "2.75rem" },
                lineHeight: 1.25,
                mb: 2,
                letterSpacing: "-0.015em",
              }}
            >
              Your{" "}
              <span style={{ fontStyle: "italic", color: "#FF6200" }}>
                home&apos;s blessings
              </span>{" "}
              are one booking away.
            </Typography>

            <Typography
              sx={{
                fontFamily: '"DM Sans", var(--font-outfit), sans-serif',
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                color: "#D1C7BD",
                lineHeight: 1.65,
                maxWidth: "620px",
              }}
            >
              Poojawala connects you with verified, experienced purohits for
              every ceremony &mdash; from Griha Pravesh to Satyanarayan Katha.
            </Typography>
          </Grid>

          {/* Right Button & Subtitle Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <Button
                component={NextLink}
                href="/services"
                variant="contained"
                sx={{
                  bgcolor: "#FF6200",
                  color: "white",
                  borderRadius: "30px",
                  px: { xs: 4, sm: 5 },
                  py: 1.5,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  fontFamily: '"DM Sans", var(--font-outfit), sans-serif',
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(255, 98, 0, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#E65800",
                    boxShadow: "0 8px 26px rgba(255, 98, 0, 0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Book a Purohit Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

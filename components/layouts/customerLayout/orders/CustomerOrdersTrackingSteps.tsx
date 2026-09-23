"use client";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const trackingSteps = [
  {
    step: 1,
    title: "Order Confirmed",
    description: "Your order is received and blessed for dispatch.",
  },
  {
    step: 2,
    title: "Items Packed with Care",
    description: "Every item is quality-checked and packed reverently.",
  },
  {
    step: 3,
    title: "On Its Way to You",
    description: "Track live updates once your order is dispatched.",
  },
  {
    step: 4,
    title: "Delivered at Your Door",
    description: "Ready for your next sacred ritual — right on time.",
  },
];

export default function CustomerOrdersTrackingSteps() {
  return (
    <Box
      sx={{
        mt: { xs: 5, sm: 8 },
        mb: 0,
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        bgcolor: "#FAF4EE",
        color: "#2C1810",
        py: { xs: 4, sm: 6, md: 7 },
        px: { xs: 2.5, sm: 5, md: 8 },
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ alignItems: "center" }}>
          {/* Left Column: Heading & Description */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                fontSize: { xs: "11px", sm: "12px" },
                letterSpacing: "1.5px",
                color: "#C84B16",
                textTransform: "uppercase",
                mb: 1.2,
              }}
            >
              ALWAYS IN THE KNOW
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 800,
                color: "#2C1810",
                fontSize: { xs: "24px", sm: "36px", md: "42px" },
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              Your pooja items,{" "}
              <Box
                component="span"
                sx={{
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
              >
                every step of the way
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "13.5px", sm: "15px" },
                lineHeight: 1.6,
                maxWidth: 480,
              }}
            >
              We know your rituals can't wait. That's why we keep you updated from
              our altar to your doorstep — with love and care at every stage.
            </Typography>
          </Grid>

          {/* Right Column: 4-Step Process */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
              {trackingSteps.map((item) => (
                <Box
                  key={item.step}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: { xs: 2, sm: 2.5 },
                  }}
                >
                  {/* Number Badge */}
                  <Box
                    sx={{
                      width: { xs: 34, sm: 38 },
                      height: { xs: 34, sm: 38 },
                      borderRadius: "50%",
                      bgcolor: "#FCECE0",
                      color: "#C84B16",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: { xs: "13.5px", sm: "15px" },
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    {item.step}
                  </Box>

                  {/* Step Text */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 800,
                        color: "#2C1810",
                        fontSize: { xs: "14.5px", sm: "16px" },
                        mb: 0.2,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        color: "#64534A",
                        fontSize: { xs: "13px", sm: "14px" },
                        lineHeight: 1.4,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

"use client";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const steps = [
  {
    number: "1",
    title: "Choose Your Package",
    description:
      "Select the pooja that fits your occasion — from our curated packages or request a custom ceremony.",
  },
  {
    number: "2",
    title: "Pick an Auspicious Date",
    description:
      "Our pandits consult your Panchang to recommend the most favorable tithi and muhurat for your ceremony.",
  },
  {
    number: "3",
    title: "Verified Purohit at Your Doorstep",
    description:
      "Our expert Purohit arrives on time to perform your ritual. Need samagri & puja items? Easily order complete kits separately on our app!",
  },
  {
    number: "4",
    title: "Receive Divine Blessings",
    description:
      "The ceremony unfolds as tradition prescribes. You participate, pray, and leave with blessings and a grateful heart.",
  },
];

const promises = [
  {
    icon: <VerifiedUserOutlinedIcon sx={{ color: "#B8860B", fontSize: 24 }} />,
    title: "Verified Vedic Pandits",
    description:
      "Every pandit is background-verified, Sanskrit-trained, and has completed a minimum 5-year practice.",
  },
  {
    icon: <LocalMallOutlinedIcon sx={{ color: "#B8860B", fontSize: 24 }} />,
    title: "Pure Samagri Delivery",
    description:
      "Order 100% pure, organic, and certified puja samagri kits separately directly from our app whenever required.",
  },
  {
    icon: <AccessTimeOutlinedIcon sx={{ color: "#B8860B", fontSize: 24 }} />,
    title: "On Time, Every Time",
    description:
      "Muhurat is sacred. We are always at your door 30 minutes before the ceremony start time.",
  },
];

export default function PoojaProcessSection() {
  const router = useRouter();

  return (
    <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: "#FFF" }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 5, md: 6 }}
          sx={{ alignItems: "center" }}
        >
          {/* Left Column: The Process */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ pr: { md: 3 } }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#B8860B",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                THE PROCESS
              </Typography>

              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: "28px", sm: "36px", md: "40px" },
                  color: "#2C1810",
                  lineHeight: 1.2,
                  mb: 5,
                }}
              >
                From booking to blessings in four steps
              </Typography>

              {/* Steps Vertical Container */}
              <Box sx={{ position: "relative", pl: 1 }}>
                {steps.map((step, idx) => (
                  <Box
                    key={step.number}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 3,
                      mb: idx === steps.length - 1 ? 0 : 4,
                      position: "relative",
                    }}
                  >
                    {/* Vertical Connecting Line */}
                    {idx < steps.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: "21px",
                          top: "44px",
                          bottom: "-32px",
                          width: "2px",
                          bgcolor: "#EFE6D5",
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Step Number Circle */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        border: "1.5px solid #D4B076",
                        bgcolor: "#FFFDF9",
                        color: "#B8860B",
                        fontWeight: 700,
                        fontSize: "16px",
                        fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        zIndex: 2,
                        boxShadow: "0 2px 8px rgba(184, 134, 11, 0.08)",
                      }}
                    >
                      {step.number}
                    </Box>

                    {/* Step Text Content */}
                    <Box sx={{ pt: 0.5 }}>
                      <Typography
                        component="h3"
                        sx={{
                          fontFamily:
                            'var(--font-outfit), "DM Sans", sans-serif',
                          fontWeight: 700,
                          fontSize: { xs: "18px", sm: "20px" },
                          color: "#2C1810",
                          mb: 0.8,
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily:
                            'var(--font-outfit), "DM Sans", sans-serif',
                          fontSize: "14.5px",
                          color: "#64748b",
                          lineHeight: 1.6,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Our Promise to You Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                bgcolor: "#FAF4E8",
                borderRadius: "24px",
                border: "1.5px solid #EFE6D5",
                p: { xs: 3, sm: 4.5 },
                boxShadow: "0 8px 30px rgba(184, 134, 11, 0.06)",
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: "22px", sm: "24px" },
                  color: "#2C1810",
                  mb: 4,
                }}
              >
                Our Promise to You
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
                {promises.map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "12px",
                        bgcolor: "#FFF8ED",
                        border: "1px solid #EFE6D5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily:
                            'var(--font-outfit), "DM Sans", sans-serif',
                          fontWeight: 700,
                          fontSize: "16.5px",
                          color: "#2C1810",
                          mb: 0.5,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily:
                            'var(--font-outfit), "DM Sans", sans-serif',
                          fontSize: "14px",
                          color: "#64748b",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 3.5, borderColor: "#E5D9C5" }} />

              <Button
                variant="contained"
                onClick={() => router.push("/sign-in")}
                sx={{
                  width: "100%",
                  bgcolor: "#FF6200",
                  color: "#FFFFFF",
                  borderRadius: "14px",
                  py: 1.4,
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                  textTransform: "none",
                  boxShadow: "none",
                  transition: "all 0.25s ease-in-out",
                  "&:hover": {
                    bgcolor: "#E65800",
                    boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                  },
                }}
              >
                Schedule a Pooja
              </Button>

              <Typography
                sx={{
                  fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                  fontSize: "12.5px",
                  color: "#8C6D53",
                  textAlign: "center",
                  mt: 2,
                }}
              >
                Available 7 days a week — Including festivals and auspicious
                days
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

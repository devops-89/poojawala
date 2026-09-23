"use client";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SpaIcon from "@mui/icons-material/Spa";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box, Grid, Paper, Typography } from "@mui/material";

interface Props {
  benefitsList: any[];
}

export default function ServiceDetailsIncludedSection({ benefitsList }: Props) {
  const cardIcons = [
    <SpaIcon key="1" sx={{ color: "#C84B16", fontSize: 20 }} />,
    <MenuBookIcon key="2" sx={{ color: "#C84B16", fontSize: 20 }} />,
    <PersonOutlinedIcon key="3" sx={{ color: "#C84B16", fontSize: 20 }} />,
    <StarBorderIcon key="4" sx={{ color: "#C84B16", fontSize: 20 }} />,
  ];

  return (
    <Box sx={{ py: 3, mb: 4 }}>
      <Grid container spacing={5} sx={{ alignItems: "flex-start" }}>
        {/* Left Header Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "#C84B16",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            WHAT'S INCLUDED
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "28px", sm: "34px", md: "38px" },
              lineHeight: 1.2,
              mb: 2.5,
            }}
          >
            Everything your pooja needs — nothing left to arrange
          </Typography>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            Our Purohit arrives fully prepared. You simply provide the venue,
            and we handle every ritual from Sankalp to Prasad.
          </Typography>
        </Grid>

        {/* Right Benefits Cards Grid */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={3}>
            {benefitsList.map((item: any, idx: number) => {
              const title =
                typeof item === "string"
                  ? item
                  : item.title || item.name || item.text || "";
              const desc =
                typeof item === "object" && item !== null
                  ? item.description
                  : "";

              const icon = cardIcons[idx % cardIcons.length];

              if (!title && !desc) return null;

              return (
                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#FAF4EE",
                      border: "1px solid #EADCCF",
                      borderRadius: "16px",
                      p: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Square Soft Icon Box */}
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "10px",
                        bgcolor: "#F5E6D8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      {icon}
                    </Box>

                    {title && (
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Georgia", "Times New Roman", serif',
                          fontWeight: 700,
                          color: "#2C1810",
                          fontSize: "17px",
                          mb: desc ? 1 : 0,
                        }}
                      >
                        {title}
                      </Typography>
                    )}

                    {desc && (
                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: "#64534A",
                          fontSize: "13px",
                          lineHeight: 1.6,
                        }}
                      >
                        {desc}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

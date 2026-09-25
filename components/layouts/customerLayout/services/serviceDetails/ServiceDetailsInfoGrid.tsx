import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import { Box, Grid, Paper, Typography } from "@mui/material";

interface Props {
  service: any;
  durationText: string;
  priceDisplay: string;
  languagesList: any[];
  displayCities: any[];
  getFormattedFestivalDate: () => string;
}

export default function ServiceDetailsInfoGrid({
  service,
  durationText,
  priceDisplay,
  languagesList,
  displayCities,
  getFormattedFestivalDate,
}: Props) {
  const isGlobalPooja = !displayCities || displayCities.length === 0;

  return (
    <Box sx={{ py: 3, mb: 4 }}>
      <Grid container spacing={5} sx={{ alignItems: "stretch" }}>
        {/* Left Column: SERVICE DETAILS */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column" }}>
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
            SERVICE DETAILS
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "26px", sm: "32px" },
              lineHeight: 1.2,
              mb: 3,
              minHeight: { md: "76px" },
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            Everything you need to know before booking
          </Typography>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#FFFBF7",
              border: "1px solid #EADCCF",
              borderRadius: "16px",
              overflow: "hidden",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
              {/* DURATION */}
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #EADCCF",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#64534A",
                    textTransform: "uppercase",
                  }}
                >
                  DURATION
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#2C1810",
                  }}
                >
                  {service.durationMinutes ? `${service.durationMinutes} minutes` : durationText}
                </Typography>
              </Box>

              {/* PRICE RANGE */}
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #EADCCF",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#64534A",
                    textTransform: "uppercase",
                  }}
                >
                  PRICE RANGE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 800,
                    fontSize: "16px",
                    color: "#2C1810",
                  }}
                >
                  {priceDisplay}
                </Typography>
              </Box>

              {/* VENUE */}
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom:
                    languagesList && languagesList.length > 0
                      ? "1px solid #EADCCF"
                      : service.isUpcomingFestival
                        ? "1px solid #EADCCF"
                        : "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#64534A",
                    textTransform: "uppercase",
                  }}
                >
                  VENUE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#2C1810",
                    textAlign: "right",
                  }}
                >
                  {service.requiresVenue ? "Pooja at Customer's Home" : "Venue Not Required"}
                </Typography>
              </Box>

              {/* LANGUAGES (Rendered ONLY if languagesList is non-empty) */}
              {languagesList && languagesList.length > 0 && (
                <Box
                  sx={{
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: service.isUpcomingFestival ? "1px solid #EADCCF" : "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "#64534A",
                      textTransform: "uppercase",
                    }}
                  >
                    LANGUAGES
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {languagesList.map((langItem: any, idx: number) => {
                      const langName = typeof langItem === "string" ? langItem : langItem?.name || "";
                      if (!langName) return null;
                      return (
                        <Box
                          key={idx}
                          sx={{
                            bgcolor: "#F9EBE0",
                            color: "#C84B16",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "13px",
                          }}
                        >
                          {langName}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* FESTIVAL DATE (Rendered ONLY if service.isUpcomingFestival === true) */}
              {service.isUpcomingFestival && (
                <Box
                  sx={{
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "#64534A",
                      textTransform: "uppercase",
                    }}
                  >
                    FESTIVAL DATE
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#2C1810",
                    }}
                  >
                    {getFormattedFestivalDate()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: SERVICE AREAS */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column" }}>
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
            SERVICE AREAS
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "26px", sm: "32px" },
              lineHeight: 1.2,
              mb: 3,
              minHeight: { md: "76px" },
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            {isGlobalPooja ? "Available in All Cities" : "Available in these cities"}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#FAF4EE",
              border: "1px solid #EADCCF",
              borderRadius: "16px",
              p: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Region Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
              <LocationOnIcon sx={{ color: "#C84B16", fontSize: 20 }} />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  color: "#2C1810",
                  fontSize: "16px",
                }}
              >
                Region Coverage
              </Typography>
            </Box>

            {/* Cities Grid or Global Pooja Card */}
            {isGlobalPooja ? (
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "#FFFBF7",
                  border: "1px solid #EADCCF",
                  borderRadius: "12px",
                  p: 3,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  my: "auto",
                }}
              >
                <PublicIcon sx={{ color: "#C84B16", fontSize: 36 }} />
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 800,
                    color: "#2C1810",
                    fontSize: "16px",
                  }}
                >
                  Global Pooja (All Cities & States)
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "13.5px",
                    color: "#64534A",
                    lineHeight: 1.5,
                  }}
                >
                  This sacred pooja service is available nationwide across all cities and states in India for at-home booking.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {displayCities.map((cityObj: any, idx: number) => {
                  const cityName = typeof cityObj === "string" ? cityObj : cityObj?.name || "";
                  const stateName = (typeof cityObj === "object" && cityObj?.state ? cityObj.state : "INDIA").toUpperCase();

                  if (!cityName) return null;

                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: "#FFFBF7",
                          border: "1px solid #EADCCF",
                          borderRadius: "12px",
                          p: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: "#2C1810",
                            fontSize: "15px",
                          }}
                        >
                          {cityName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.8px",
                            color: "#8C7A70",
                            mt: 0.5,
                          }}
                        >
                          {stateName}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

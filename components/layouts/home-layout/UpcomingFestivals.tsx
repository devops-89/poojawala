"use client";
import { getServicesAPI } from "@/api/serviceControllers";
import EmptyStateCard from "@/components/widgets/EmptyStateCard";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpcomingFestivals() {
  const router = useRouter();
  const [festivalsData, setFestivalsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await getServicesAPI(
          1,
          2,
          "",
          undefined,
          undefined,
          undefined,
          true,
          true,
        );
        if (
          response?.success &&
          response?.data?.data &&
          Array.isArray(response.data.data)
        ) {
          const apiFestivals = response.data.data
            .slice(0, 2)
            .map((item: any) => {
              const startDate = item.festivalStartDate
                ? new Date(item.festivalStartDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "";
              const endDate = item.festivalEndDate
                ? new Date(item.festivalEndDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "";
              const dateString =
                startDate && endDate
                  ? `${startDate} - ${endDate}`
                  : startDate || "Upcoming";

              return {
                id: item.id,
                title: item.name,
                date: dateString,
                description: item.description || "",
                image:
                  item.iconDownloadurl ||
                  item.iconUrl ||
                  "/images/home/navratri.webp",
              };
            });
          setFestivalsData(apiFestivals);
        } else {
          setFestivalsData([]);
        }
      } catch (error) {
        console.error("Failed to fetch upcoming festivals:", error);
        setFestivalsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFestivals();
  }, []);

  return (
    <Box
      sx={{ position: "relative", py: 8, bgcolor: "#fff", overflow: "hidden" }}
    >
      {/* Left Chakra Decoration */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: "55%",
          transform: "translateY(-50%)",
          width: "559px",
          height: "559px",
          backgroundImage: "url(/images/home/chakra.webp)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Right Chakra Decoration */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: "55%",
          transform: "translateY(-50%)",
          width: "559px",
          height: "559px",
          backgroundImage: "url(/images/home/chakraright.webp)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "28px", sm: "36px", md: "48px" },
              lineHeight: { xs: "36px", md: "62px" },
              color: "#141414",
              mb: "9px",
            }}
          >
            Upcoming Festivals and Offers
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              src="/images/home/poojaPackages/dhanush.webp"
              alt="Decorative Arch"
              sx={{
                width: "750px",
                height: "47px",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>

        {/* Cards Section */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress sx={{ color: "#FF6200" }} />
          </Box>
        ) : festivalsData.length === 0 ? (
          <EmptyStateCard
            icon={<EventAvailableOutlinedIcon sx={{ fontSize: 32 }} />}
            title="No Upcoming Festivals Currently"
            description="Currently, there are no upcoming festival packages listed. Explore our regular pooja packages or check back soon!"
            actionText="Explore All Pooja's"
            actionHref="/services"
          />
        ) : (
          <Box
            sx={{
              maxWidth: "1158px",
              margin: "0 auto",
              display: "flex",
              gap: { xs: "20px", md: "42px" },
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {festivalsData.map((fest) => (
              <Box
                key={fest.id}
                sx={{
                  width: { xs: "100%", md: "calc(50% - 21px)" },
                  maxWidth: "558px",
                  height: { xs: "auto", sm: "322px" },
                  minHeight: { xs: "260px", sm: "322px" },
                  borderRadius: { xs: "24px", md: "42px" },
                  backgroundImage: `url(${fest.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1.35px solid rgba(20,20,20,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: { xs: "30px 20px 24px", md: "48px 26px 36px 26px" },
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(90deg, #261500 0%, rgba(38,21,0,0.6) 55%, transparent 100%)",
                    zIndex: 1,
                    borderRadius: { xs: "24px", md: "42px" },
                  },
                }}
              >
                <Box sx={{ position: "relative", zIndex: 2 }}>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 600,
                      fontSize: { xs: "24px", md: "32px" },
                      lineHeight: "130.6%",
                      color: "#fff",
                      mb: "6px",
                    }}
                  >
                    {fest.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 400,
                      fontSize: "20px",
                      lineHeight: "130.6%",
                      color: "rgba(255,255,255,0.8)",
                      fontStyle: "italic",
                      mb: "15px",
                    }}
                  >
                    {fest.date}
                  </Typography>
                  <Box
                    component="img"
                    src="/images/home/cardline.webp"
                    alt="divider line"
                    sx={{ display: "block", width: "139px", height: "12px" }}
                  />
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: "140%",
                      color: "rgba(255,255,255,0.9)",
                      mb: "16px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {fest.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => router.push("/sign-in")}
                    sx={{
                      background: "#FF6200",
                      color: "#FFFFFF",
                      width: "117.82px",
                      height: "34px",
                      borderRadius: "41.71px",
                      textTransform: "none",
                      fontWeight: 400,
                      fontSize: "14px",
                      letterSpacing: "-0.01em",
                      padding: "8px 26.91px",
                      transition: "all 0.3s ease",
                      boxShadow: "none",
                      "&:hover": {
                        background: "#F05A00",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

"use client";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import PurohitCard from "./PurohitCard";

import { getPublicPurohitsListAPI } from "@/api/userControllers";
import EmptyStateCard from "@/components/widgets/EmptyStateCard";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export default function PurohitGrid() {
  const [purohits, setPurohits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const [totalPurohits, setTotalPurohits] = useState(0);
  const itemsPerPage = 6;
  const gridTopRef = useRef<HTMLDivElement>(null);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    const fetchPurohits = async () => {
      try {
        setLoading(true);
        const response = await getPublicPurohitsListAPI(
          page,
          itemsPerPage,
          debouncedQuery,
        );

        let fetchedPurohits = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          fetchedPurohits = response.data.data;
          // You might have pagination details in response.data.total etc.
          // Fallback to array length if not present
        } else if (response?.data && Array.isArray(response.data)) {
          fetchedPurohits = response.data;
        }

        const formatted = fetchedPurohits.map((p: any) => {
          // Calculate availability from top-level fields and services
          let hasOnline = p.isOnlineAvailable === true;
          let hasOffline = p.isOfflineAvailable === true;

          if (p.purohitService && Array.isArray(p.purohitService)) {
            p.purohitService.forEach((s: any) => {
              if (s.isOnlineAvailable) hasOnline = true;
              if (s.isOfflineAvailable) hasOffline = true;
            });
          }

          let availStr = "Contact for details";
          if (hasOnline && hasOffline) availStr = "Online & Offline";
          else if (hasOnline) availStr = "Online";
          else if (hasOffline) availStr = "Offline";

          let languageStr = "Not specified";
          if (Array.isArray(p.languages)) {
            languageStr = p.languages.join(", ");
          } else if (typeof p.languages === "string") {
            languageStr = p.languages
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
              .join(", ");
          }

          let specStr = "";
          if (Array.isArray(p.specialization)) {
            specStr = p.specialization.join(", ");
          } else if (typeof p.specialization === "string") {
            specStr = p.specialization
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
              .join(", ");
          }

          return {
            id: p.userId || p.id,
            title:
              `${p.purohitFirstName || ""} ${p.lastName || ""}`.trim() ||
              p.username ||
              "Purohit",
            image: p.profileImage || "/images/purohits/pandit1.webp",
            category: p.qualification || "Purohit",
            language: languageStr,
            experience: p.experienceYears ? `${p.experienceYears}+ Years` : "",
            rating:
              parseFloat(p.averageRating || 0) > 0
                ? parseFloat(p.averageRating).toFixed(1)
                : "New",
            availability: availStr,
            duration: "", // Removed static duration
            bio: p.bio || "",
            specialization: specStr,
          };
        });

        setPurohits(formatted);
        const backendTotal =
          response?.data?.data?.total ||
          response?.data?.total ||
          response?.data?.data?.totalItems ||
          response?.data?.totalItems;
        setTotalPurohits(
          backendTotal ||
            page * itemsPerPage + (formatted.length === itemsPerPage ? 1 : 0),
        );
      } catch (error) {
        console.error("Error fetching purohits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurohits();
  }, [page, debouncedQuery]);

  // Reset page to 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    if (gridTopRef.current) {
      const y =
        gridTopRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const totalPages = Math.ceil(totalPurohits / itemsPerPage) || 1;

  return (
    <Box ref={gridTopRef} id="top-purohits">
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              color: "#1A1A1A",
              fontSize: { xs: "20px", sm: "24px" },
              mb: 0.5,
            }}
          >
            Top Purohits for You
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: "#64748b",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {totalPurohits} Purohits available
          </Typography>
        </Box>

        {/* Search Bar (Matching Temples & Astrologers) */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            setDebouncedQuery(searchQuery);
            setPage(1);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#FFFFFF",
            borderRadius: "14px",
            p: "4px 6px 4px 14px",
            border: "1.5px solid #E2E8F0",
            width: { xs: "100%", sm: "360px", md: "400px" },
            transition: "all 0.25s ease",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            "&:focus-within": {
              borderColor: COLORS.PRIMARY,
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.15)",
            },
          }}
        >
          <SearchIcon sx={{ color: "#94a3b8", fontSize: 20, mr: 1 }} />
          <TextField
            variant="standard"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "14px",
                  color: "#1e293b",
                  "&::placeholder": { color: "#94a3b8" },
                },
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchQuery("");
                        setDebouncedQuery("");
                        setPage(1);
                      }}
                      aria-label="clear search"
                      sx={{ p: 0.5, mr: 0.5 }}
                    >
                      <ClearIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "#FFFFFF",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              borderRadius: "10px",
              px: 2,
              py: 0.8,
              minWidth: "auto",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#E05600",
                boxShadow: "none",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* List Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : purohits.length === 0 ? (
        <EmptyStateCard
          icon={<PersonOutlinedIcon sx={{ fontSize: 32 }} />}
          title="No Purohits Found"
          description="No verified purohits were found matching your search term. Try searching for another name or language!"
        />
      ) : (
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          {purohits.map((Purohit) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={Purohit.id}
              sx={{ display: "flex" }}
            >
              <PurohitCard
                id={Purohit.id}
                title={Purohit.title}
                image={Purohit.image}
                category={Purohit.category}
                language={Purohit.language}
                experience={Purohit.experience}
                rating={Purohit.rating}
                availability={Purohit.availability}
                bio={Purohit.bio}
                specialization={Purohit.specialization}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: FONTS.PRIMARY,
                "&.Mui-selected": {
                  bgcolor: COLORS.PRIMARY,
                  color: "white",
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

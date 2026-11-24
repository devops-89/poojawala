"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { getTemplesAPI } from "@/api/templeControllers";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import CustomerTempleCard from "./CustomerTempleCard";

export default function CustomerTemplesContent() {
  const [temples, setTemples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search state with debouncing
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const itemsPerPage = 6;

  // Debouncing effect: updates debouncedSearch 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search term
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleResetSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setPage(1);
  };

  // Fetch temples via API whenever page or debouncedSearch changes
  useEffect(() => {
    let isCancelled = false;

    const fetchTemples = async () => {
      try {
        setLoading(true);

        const res = await getTemplesAPI(
          page,
          itemsPerPage,
          debouncedSearch.trim(),
          true
        );

        if (isCancelled) return;

        let list: any[] = [];
        if (res) {
          if (Array.isArray(res)) {
            list = res;
          } else if (res.data) {
            if (Array.isArray(res.data.data)) list = res.data.data;
            else if (Array.isArray(res.data)) list = res.data;
            else if (Array.isArray(res.data.temples)) list = res.data.temples;
          } else if (res.temples && Array.isArray(res.temples)) {
            list = res.temples;
          }
        }

        const activeTemples = list.filter((t: any) => t.isActive !== false);
        setTemples(activeTemples);

        const pagination =
          res?.data?.pagination || res?.pagination || res?.data || {};
        const total =
          pagination?.total ||
          pagination?.totalCount ||
          res?.total ||
          activeTemples.length;
        const calcPages =
          pagination?.totalPages ||
          pagination?.pageCount ||
          Math.ceil(total / itemsPerPage) ||
          1;

        setTotalCount(total);
        setTotalPages(calcPages);
      } catch (err) {
        console.error("Failed to fetch temples from API:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchTemples();

    return () => {
      isCancelled = true;
    };
  }, [page, debouncedSearch]);

  const hasSearchFilter = Boolean(searchTerm.trim());

  return (
    <Box sx={{ pb: { xs: 4, sm: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            bgcolor: "#FFF0E6",
            border: "1px solid #FFD4BC",
            borderRadius: "20px",
            px: 1.5,
            py: 0.4,
            mb: 1.25,
          }}
        >
          <TempleHinduIcon sx={{ fontSize: 13, color: COLORS.PRIMARY }} />
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "11px",
              fontWeight: 800,
              color: COLORS.PRIMARY,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            SACRED PILGRIMAGE DESTINATIONS
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#2C1810",
            fontSize: { xs: "1.65rem", sm: "2.1rem", md: "2.4rem" },
            lineHeight: 1.2,
            mb: 0.75,
          }}
        >
          Explore Sacred Temples
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#7C6A60",
            fontSize: { xs: "13.5px", sm: "15px" },
            lineHeight: 1.5,
            maxWidth: 620,
          }}
        >
          Discover holy shrines, sacred pilgrimage destinations, and book authentic temple rituals.
        </Typography>
      </Box>

      {/* Search Bar with Debouncing */}
      <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: "4px 10px", sm: "6px 14px" },
            display: "flex",
            alignItems: "center",
            borderRadius: "14px",
            border: "1.5px solid #EFE6D5",
            bgcolor: "#FFFFFF",
            boxShadow: "0 2px 6px rgba(44, 24, 16, 0.02)",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#FFD4BC",
            },
            "&:focus-within": {
              borderColor: COLORS.PRIMARY,
              boxShadow: "0 0 0 3px rgba(255, 98, 0, 0.12)",
            },
          }}
        >
          <IconButton sx={{ p: "8px", color: COLORS.PRIMARY }} aria-label="search">
            <SearchIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
          </IconButton>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "13.5px", sm: "14.5px" },
              color: "#2C1810",
            }}
            placeholder="Search temples by name, deity, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <IconButton
              sx={{ p: "8px", color: "#94a3b8" }}
              aria-label="clear search"
              onClick={handleResetSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>

        {/* Results summary and reset button */}
        {hasSearchFilter && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1.25,
              px: 0.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12.5px",
                color: "#7C6A60",
                fontWeight: 500,
              }}
            >
              {loading
                ? "Searching sacred temples..."
                : `Found ${totalCount} temple${totalCount === 1 ? "" : "s"} for "${searchTerm}"`}
            </Typography>
            <Button
              size="small"
              onClick={handleResetSearch}
              startIcon={<RestartAltIcon fontSize="small" />}
              sx={{
                fontFamily: FONTS.OUTFIT,
                textTransform: "none",
                color: COLORS.PRIMARY,
                fontSize: "12.5px",
                fontWeight: 600,
                "&:hover": { bgcolor: "rgba(255, 98, 0, 0.05)" },
              }}
            >
              Clear Search
            </Button>
          </Box>
        )}
      </Box>

      {/* Main Content Area */}
      {loading ? (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {[1, 2, 3, 4].map((n) => (
            <Grid size={{ xs: 12, lg: 6 }} key={n}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.25 },
                  borderRadius: "20px",
                  border: "1.5px solid #EFE6D5",
                  bgcolor: "#FFFFFF",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 2.25 },
                }}
              >
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: { xs: "100%", sm: 170, md: 190 },
                    height: { xs: 180, sm: 165 },
                    borderRadius: "14px",
                  }}
                  animation="wave"
                />
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Skeleton variant="text" height={26} width="65%" animation="wave" />
                    <Skeleton variant="text" height={18} width="45%" animation="wave" />
                    <Skeleton variant="text" height={16} width="95%" animation="wave" sx={{ mt: 1 }} />
                    <Skeleton variant="text" height={16} width="80%" animation="wave" />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                    <Skeleton variant="rectangular" width={110} height={34} sx={{ borderRadius: "20px" }} />
                    <Skeleton variant="rectangular" width={110} height={34} sx={{ borderRadius: "20px" }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : temples.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            textAlign: "center",
            borderRadius: "20px",
            border: "1.5px dashed #FFD4BC",
            bgcolor: "#FAF7F4",
            maxWidth: 540,
            mx: "auto",
            my: 2,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              bgcolor: "#FFF0E6",
              border: "1px solid #FFD4BC",
              color: COLORS.PRIMARY,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <TempleHinduIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              mb: 1,
            }}
          >
            No Temples Found
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#7C6A60",
              fontSize: "13.5px",
              lineHeight: 1.6,
              maxWidth: 440,
              mx: "auto",
              mb: 2.5,
            }}
          >
            {hasSearchFilter
              ? `We couldn't find any temples matching "${searchTerm}". Try checking your spelling or searching another location.`
              : "No sacred temples are currently available in this category. Please check back later."}
          </Typography>
          {hasSearchFilter && (
            <Button
              variant="contained"
              onClick={handleResetSearch}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "#ffffff",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "13px",
                borderRadius: "20px",
                textTransform: "none",
                px: 3,
                py: 0.8,
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                "&:hover": {
                  bgcolor: COLORS.PRIMARY_DARK,
                },
              }}
            >
              Reset Search
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {temples.map((temple) => (
            <CustomerTempleCard key={temple.id} temple={temple} />
          ))}
        </Grid>
      )}

      {!loading && temples.length > 0 && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, sm: 6 } }}>
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={(_, value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: COLORS.PRIMARY,
                color: "white",
                "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
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
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: FONTS.PRIMARY,
            fontWeight: 800,
            color: "#1A1A1A",
            mb: 1,
          }}
        >
          Explore Sacred Temples
        </Typography>
        <Typography sx={{ fontFamily: FONTS.PRIMARY, color: "#666" }}>
          Discover holy shrines, sacred pilgrimage destinations, and book authentic temple rituals.
        </Typography>
      </Box>

      {/* Search Bar with Debouncing */}
      <Box sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: "6px 12px",
            display: "flex",
            alignItems: "center",
            borderRadius: "14px",
            border: "1.5px solid #e2e8f0",
            bgcolor: "#ffffff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
            transition: "all 0.2s ease",
            "&:focus-within": {
              borderColor: COLORS.PRIMARY,
              boxShadow: "0 0 0 3px rgba(255, 98, 0, 0.12)",
            },
          }}
        >
          <IconButton sx={{ p: "8px", color: COLORS.PRIMARY }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              fontFamily: FONTS.PRIMARY,
              fontSize: "15px",
              color: "#1e293b",
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
              mt: 1.5,
              px: 0.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              {loading
                ? "Searching temples..."
                : `Found ${totalCount} temple${totalCount === 1 ? "" : "s"} for "${searchTerm}"`}
            </Typography>
            <Button
              size="small"
              onClick={handleResetSearch}
              startIcon={<RestartAltIcon fontSize="small" />}
              sx={{
                fontFamily: FONTS.PRIMARY,
                textTransform: "none",
                color: COLORS.PRIMARY,
                fontSize: "13px",
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : temples.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: "20px",
            border: "1.5px dashed #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <TempleHinduIcon
            sx={{ fontSize: 56, color: COLORS.PRIMARY, mb: 1.5, opacity: 0.8 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              color: "#1e293b",
              mb: 0.5,
            }}
          >
            No Temples Found
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: "#64748b",
              fontSize: "14px",
              mb: 3,
            }}
          >
            {hasSearchFilter
              ? `We couldn't find any temples matching "${searchTerm}". Try checking for spelling or searching with a different term.`
              : "No sacred temples are currently available. Please check back later."}
          </Typography>
          {hasSearchFilter && (
            <Button
              variant="outlined"
              onClick={handleResetSearch}
              sx={{
                color: COLORS.PRIMARY,
                borderColor: COLORS.PRIMARY,
                fontFamily: FONTS.PRIMARY,
                fontWeight: 600,
                borderRadius: "10px",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#e65800",
                  bgcolor: "rgba(255, 98, 0, 0.04)",
                },
              }}
            >
              Clear Search
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {temples.map((temple) => (
            <CustomerTempleCard key={temple.id} temple={temple} />
          ))}
        </Grid>
      )}

      {!loading && temples.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
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

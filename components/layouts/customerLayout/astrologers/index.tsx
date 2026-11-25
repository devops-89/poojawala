"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Pagination, Paper, Skeleton } from "@mui/material";
import { getAstrologersAPI } from "@/api/userControllers";
import { COLORS } from "@/utils/enums";
import CustomerAstrologersHeader from "./CustomerAstrologersHeader";
import CustomerAstrologersFilters from "./CustomerAstrologersFilters";
import CustomerAstrologerCard from "./CustomerAstrologerCard";
import CustomerAstrologersEmptyState from "./CustomerAstrologersEmptyState";
export { default as CustomerAstrologerDetailsContent } from "./CustomerAstrologerDetailsContent";

export default function CustomerAstrologersContent() {
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchAstrologers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAstrologersAPI(
        page,
        8,
        searchTerm || undefined,
        "APPROVED"
      );

      if (res.success) {
        const usersArray = res.data?.data || res.data?.users || res.data || [];
        const pagination = res.data?.pagination || {};
        setAstrologers(Array.isArray(usersArray) ? usersArray : []);
        setTotalPages(
          pagination.totalPages ||
            Math.ceil((pagination.total || usersArray.length || 1) / 8) ||
            1
        );
      }
    } catch (err) {
      console.error("Error fetching astrologers for customer portal:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAstrologers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchAstrologers]);

  return (
    <Box sx={{ pb: { xs: 4, sm: 6 } }}>
      <CustomerAstrologersHeader />

      <CustomerAstrologersFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
      />

      {loading ? (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {[1, 2, 3, 4].map((n) => (
            <Grid size={{ xs: 12, lg: 6 }} key={n}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: "20px",
                  border: "1.5px solid #EFE6D5",
                  bgcolor: "#FFFFFF",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: { xs: "100%", sm: 140 },
                    height: { xs: 100, sm: 140 },
                    borderRadius: "16px",
                  }}
                  animation="wave"
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" height={26} width="60%" animation="wave" />
                  <Skeleton variant="text" height={18} width="40%" animation="wave" />
                  <Skeleton variant="text" height={18} width="80%" animation="wave" />
                  <Box sx={{ display: "flex", gap: 1, my: 1.5 }}>
                    <Skeleton variant="rectangular" width={60} height={22} sx={{ borderRadius: "6px" }} />
                    <Skeleton variant="rectangular" width={60} height={22} sx={{ borderRadius: "6px" }} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Skeleton variant="text" height={24} width="30%" animation="wave" />
                    <Skeleton variant="rectangular" width={100} height={34} sx={{ borderRadius: "20px" }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : astrologers.length === 0 ? (
        <CustomerAstrologersEmptyState
          onReset={() => {
            setSearchTerm("");
            setPage(1);
          }}
        />
      ) : (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {astrologers.map((astrologer, idx) => (
            <CustomerAstrologerCard
              key={astrologer.id || idx}
              astrologer={astrologer}
            />
          ))}
        </Grid>
      )}

      {!loading && astrologers.length > 0 && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, sm: 6 } }}>
          <Pagination
            count={totalPages}
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

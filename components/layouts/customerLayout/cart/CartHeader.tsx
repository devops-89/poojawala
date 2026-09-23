"use client";
import React from "react";
import Link from "next/link";
import { Box, Typography, Button, Divider } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function CartHeader() {
  return (
    <Box sx={{ mb: 3, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: "#C84B16",
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            COMPLETE YOUR ORDER
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "28px", sm: "36px", md: "42px" },
              lineHeight: 1.1,
            }}
          >
            Your Sacred{" "}
            <Box
              component="span"
              sx={{
                color: "#C84B16",
                fontStyle: "italic",
                fontWeight: 700,
              }}
            >
              Cart
            </Box>
          </Typography>
        </Box>

        <Link
          href="/customer/products"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button
            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "12px !important" }} />}
            sx={{
              color: "#64534A",
              fontFamily: '"DM Sans", sans-serif',
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { color: "#C84B16", bgcolor: "transparent" },
            }}
          >
            Continue Shopping
          </Button>
        </Link>
      </Box>

      {/* Diya Icon Decorative Divider Line */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2.5,
          mb: 3,
          position: "relative",
        }}
      >
        <Divider sx={{ flexGrow: 1, borderColor: "#EADCCF" }} />
        <Box
          sx={{
            px: 2,
            color: "#C84B16",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C12 2 8 7 8 11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11C16 7 12 2 12 2Z"
              fill="#C84B16"
            />
            <path
              d="M12 6C12 6 10 9 10 11C10 12.1046 10.8954 13 12 13C13.1046 13 14 12.1046 14 11C14 9 12 6 12 6Z"
              fill="#FFC107"
            />
            <path
              d="M4 17C4 16.4477 4.44772 16 5 16H19C19.5523 16 20 16.4477 20 17V18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18V17Z"
              fill="#2C1810"
            />
          </svg>
        </Box>
        <Divider sx={{ flexGrow: 1, borderColor: "#EADCCF" }} />
      </Box>
    </Box>
  );
}

import { Box, Grid } from "@mui/material";
import React from "react";

const PopularPackagesSkeleton = () => (
  <Grid
    container
    spacing={{ xs: 3, sm: 3, md: 3.5 }}
    sx={{ justifyContent: "center" }}
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "24px",
            border: "1.5px solid #EFE6D5",
            p: 2,
            height: "360px",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box
            sx={{ bgcolor: "#FAF4EE", borderRadius: "14px", height: "160px" }}
          />
          <Box
            sx={{
              bgcolor: "#F5EFE6",
              borderRadius: "4px",
              height: "20px",
              width: "70%",
              mx: "auto",
            }}
          />
          <Box
            sx={{
              bgcolor: "#FAF4EE",
              borderRadius: "4px",
              height: "14px",
              width: "50%",
              mx: "auto",
              mt: "auto",
            }}
          />
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default React.memo(PopularPackagesSkeleton);

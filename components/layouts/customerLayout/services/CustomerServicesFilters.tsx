"use client";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";

interface CustomerServicesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  stateOptions: string[];
  selectedState: string;
  onStateChange: (value: string) => void;
  cityOptions: string[];
  selectedCity: string;
  onCityChange: (value: string) => void;
}

export default function CustomerServicesFilters({
  searchTerm,
  onSearchChange,
  stateOptions,
  selectedState,
  onStateChange,
  cityOptions,
  selectedCity,
  onCityChange,
}: CustomerServicesFiltersProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search pujas or services..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                bgcolor: "white",
                "& fieldset": { borderColor: "#E0E0E0" },
              },
            },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Autocomplete
          options={["All States", ...stateOptions]}
          value={
            selectedState && selectedState !== "All"
              ? selectedState
              : "All States"
          }
          onChange={(_, newValue) => {
            const val =
              !newValue || newValue === "All States" ? "All" : newValue;
            onStateChange(val);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by State"
              placeholder="Select or type State"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "white",
                  "& fieldset": { borderColor: "#E0E0E0" },
                },
              }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Autocomplete
          options={["All Cities", ...cityOptions]}
          value={
            selectedCity && selectedCity !== "All"
              ? selectedCity
              : "All Cities"
          }
          onChange={(_, newValue) => {
            const val =
              !newValue || newValue === "All Cities" ? "All" : newValue;
            onCityChange(val);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by City"
              placeholder="Select or type City"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "white",
                  "& fieldset": { borderColor: "#E0E0E0" },
                },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

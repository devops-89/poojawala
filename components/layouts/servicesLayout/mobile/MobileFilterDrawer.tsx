import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { getIndianCitiesByState } from "../useServicesLayout";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  isOnline: boolean;
  stateOptions: string[];
  selectedState: string;
  selectedCity: string;
  onSubmit: (state: string, city: string) => void;
  onClearAll: () => void;
}

const MobileFilterDrawer = ({
  open,
  onClose,
  isOnline,
  stateOptions,
  selectedState,
  selectedCity,
  onSubmit,
  onClearAll,
}: MobileFilterDrawerProps) => {
  const [draftState, setDraftState] = useState(selectedState);
  const [draftCity, setDraftCity] = useState(selectedCity);

  useEffect(() => {
    if (open) {
      setDraftState(selectedState);
      setDraftCity(selectedCity);
    }
  }, [open, selectedState, selectedCity]);

  const stateMenuOptions = useMemo(
    () => ["All States", ...stateOptions],
    [stateOptions],
  );
  const cityMenuOptions = useMemo(
    () => ["All Cities", ...getIndianCitiesByState(draftState)],
    [draftState],
  );

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(draftState, draftCity);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "85%", sm: 360 },
            maxWidth: "360px",
            height: "100%",
            boxSizing: "border-box",
            borderTopLeftRadius: "24px",
            borderBottomLeftRadius: "24px",
            bgcolor: COLORS.BG_MAIN,
            p: 3,
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "18px",
            color: "#2C1810",
          }}
        >
          Filter Services
        </Typography>
        <IconButton size="small" aria-label="Close filters" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {!isOnline ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Autocomplete
              options={stateMenuOptions}
              value={draftState === "All" ? "All States" : draftState}
              onChange={(_, value) => {
                const nextState =
                  !value || value === "All States" ? "All" : value;
                setDraftState(nextState);
                setDraftCity("All");
              }}
              renderInput={(params) => (
                <TextField {...params} label="State" size="small" />
              )}
            />

            <Autocomplete
              options={cityMenuOptions}
              value={draftCity === "All" ? "All Cities" : draftCity}
              disabled={draftState === "All"}
              onChange={(_, value) =>
                setDraftCity(!value || value === "All Cities" ? "All" : value)
              }
              renderInput={(params) => (
                <TextField {...params} label="City" size="small" />
              )}
            />
          </Box>
        ) : (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "14px",
              color: "#7A6353",
            }}
          >
            Location filters are not needed for Online Pooja services.
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1.5, pt: 0.5 }}>
          <Button
            fullWidth
            type="button"
            variant="outlined"
            onClick={onClearAll}
            sx={{
              borderRadius: "14px",
              borderColor: COLORS.PRIMARY,
              color: COLORS.PRIMARY,
              bgcolor: COLORS.BG_CREAM,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              textTransform: "none",
              py: 1.1,
              "&:hover": {
                bgcolor: COLORS.LIGHT_BG_HOVER,
                borderColor: COLORS.PRIMARY_HOVER,
              },
            }}
          >
            Clear All
          </Button>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "14px",
              bgcolor: COLORS.PRIMARY,
              color: COLORS.WHITE,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              textTransform: "none",
              py: 1.1,
              boxShadow: `0 4px 14px ${COLORS.PRIMARY_SHADOW}`,
              "&:hover": { bgcolor: COLORS.PRIMARY_HOVER },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default React.memo(MobileFilterDrawer);

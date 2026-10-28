"use client";
import React from "react";
import { FONTS } from "@/utils/fonts";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { inputSx, labelSx } from "@/utils/templeFormUtils";

export interface AartiItem {
  name: string;
  time: string;
  description?: string;
}

interface TempleTimingsSectionProps {
  formik: any;
  aartis: AartiItem[];
  onAddAarti: () => void;
  onRemoveAarti: (index: number) => void;
  onAartiChange: (index: number, field: keyof AartiItem, value: string) => void;
}

export default function TempleTimingsSection({
  formik,
  aartis,
  onAddAarti,
  onRemoveAarti,
  onAartiChange,
}: TempleTimingsSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "18px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {/* Section Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: "10px",
            bgcolor: "#FFF7ED",
            color: "#EA580C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 0.3,
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "1.15rem",
              color: "#1E293B",
            }}
          >
            2. Timings & Seva Offerings
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: "0.85rem",
              mt: 0.25,
            }}
          >
            Configure visiting hours, daily Aarti schedules, and online offerings.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 0.5 }} />

      {/* Opening & Closing Times Container Box */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: "14px",
          border: "1px solid #FEF3C7",
          bgcolor: "#FFFDF6",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#92400E",
              mb: 0.75,
            }}
          >
            Opening Time
          </Typography>
          <TextField
            fullWidth
            type="time"
            name="openingTime"
            value={formik.values.openingTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            slotProps={{ htmlInput: { step: 300 } }}
            sx={inputSx}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#92400E",
              mb: 0.75,
            }}
          >
            Closing Time
          </Typography>
          <TextField
            fullWidth
            type="time"
            name="closingTime"
            value={formik.values.closingTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            slotProps={{ htmlInput: { step: 300 } }}
            sx={inputSx}
          />
        </Box>
      </Box>

      {/* Daily Aarti Schedule */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={labelSx}>DAILY AARTI SCHEDULE</Typography>
          <Button
            startIcon={<AddIcon fontSize="small" />}
            onClick={onAddAarti}
            size="small"
            sx={{
              color: "#EA580C",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "13px",
              "&:hover": { bgcolor: "#FFF7ED" },
            }}
          >
            Add Aarti
          </Button>
        </Box>

        {aartis.map((aarti, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 1.5,
              p: 1.25,
              borderRadius: "12px",
              border: "1px solid #F1F5F9",
              bgcolor: "#F8FAFC",
            }}
          >
            <TextField
              placeholder="Aarti Name, e.g. Mangala Aarti"
              value={aarti.name}
              onChange={(e) => onAartiChange(index, "name", e.target.value)}
              size="small"
              sx={{ flex: 2, width: { xs: "100%", sm: "auto" }, ...inputSx }}
            />
            <TextField
              type="time"
              value={aarti.time}
              onChange={(e) => onAartiChange(index, "time", e.target.value)}
              size="small"
              slotProps={{ htmlInput: { step: 300 } }}
              sx={{ flex: 1.2, width: { xs: "100%", sm: "auto" }, ...inputSx }}
            />
            <TextField
              placeholder="Description (optional)"
              value={aarti.description || ""}
              onChange={(e) =>
                onAartiChange(index, "description", e.target.value)
              }
              size="small"
              sx={{ flex: 2, width: { xs: "100%", sm: "auto" }, ...inputSx }}
            />
            <IconButton
              size="small"
              onClick={() => onRemoveAarti(index)}
              disabled={aartis.length === 1 && !aarti.name && !aarti.time}
              sx={{
                color: "#94A3B8",
                "&:hover": { color: "#DC2626", bgcolor: "#FEE2E2" },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

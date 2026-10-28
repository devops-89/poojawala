"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import AddIcon from "@mui/icons-material/Add";
import TranslateIcon from "@mui/icons-material/Translate";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import { ALL_INDIAN_LANGUAGES } from "@/utils/serviceDetailsUtils";

const COMMON_LANGUAGES = ALL_INDIAN_LANGUAGES;

interface ServiceLanguagesFieldsProps {
  languages: Array<{ name: string; code?: string }>;
  handleChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
}

export default function ServiceLanguagesFields({
  languages = [],
  setFieldValue,
}: ServiceLanguagesFieldsProps) {
  const formik = useFormikContext<any>();
  const updateLanguages = (newList: Array<{ name: string; code?: string }>) => {
    if (setFieldValue) {
      setFieldValue("languages", newList);
    } else if (formik?.setFieldValue) {
      formik.setFieldValue("languages", newList);
    }
  };

  const [inputVal, setInputVal] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveLanguage = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setErrorMsg("Please enter or select a language");
      return;
    }

    const alreadyExists = languages.some(
      (l) => l.name?.toLowerCase().trim() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      setErrorMsg("This language is already added");
      return;
    }

    const updated = [
      ...languages,
      {
        name: trimmed,
      },
    ];

    updateLanguages(updated);
    setInputVal("");
    setErrorMsg(null);
  };

  const handleDeleteLanguage = (index: number) => {
    const updated = languages.filter((_, i) => i !== index);
    updateLanguages(updated);
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          p: 3,
          bgcolor: "#f8fafc",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "1.05rem",
            }}
          >
            Languages
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
            Add languages supported for this ritual. Type or choose from common Vedic languages.
          </Typography>
        </Box>

        {/* Input Row with Save Button & Enter Key */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            alignItems: { xs: "stretch", sm: "flex-start" },
            mb: 2.5,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              freeSolo
              forcePopupIcon
              options={COMMON_LANGUAGES}
              value={inputVal}
              onChange={(_, newValue) => {
                const clean = (newValue || "").replace(/[^a-zA-Z\s]/g, "");
                setInputVal(clean);
                if (errorMsg) setErrorMsg(null);
              }}
              onInputChange={(_, newInputValue) => {
                const clean = (newInputValue || "").replace(/[^a-zA-Z\s]/g, "");
                setInputVal(clean);
                if (errorMsg) setErrorMsg(null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Add Language *"
                  placeholder="e.g. Hindi, Sanskrit, English"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveLanguage();
                    }
                  }}
                  error={Boolean(errorMsg)}
                  helperText={errorMsg || undefined}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "white",
                    },
                  }}
                />
              )}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleSaveLanguage}
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "white",
              textTransform: "none",
              borderRadius: "10px",
              fontWeight: 600,
              fontFamily: FONTS.OUTFIT,
              px: 3,
              py: 1,
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                bgcolor: COLORS.PRIMARY_DARK,
                boxShadow: "none",
              },
            }}
          >
            Save Language
          </Button>
        </Box>

        {/* Saved Languages List */}
        {languages.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: "white",
              borderRadius: "12px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem", fontFamily: FONTS.OUTFIT }}>
              No languages added yet. Type a language name above and click &quot;Save Language&quot; or press Enter.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {languages.map((lang, index) => (
              <Chip
                key={`lang-chip-${index}`}
                icon={<TranslateIcon sx={{ fontSize: 16, color: `${COLORS.PRIMARY} !important` }} />}
                label={lang.name}
                onDelete={() => handleDeleteLanguage(index)}
                sx={{
                  borderRadius: "10px",
                  bgcolor: "white",
                  border: "1px solid #e2e8f0",
                  py: 2.2,
                  px: 0.5,
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  color: "#1e293b",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  "& .MuiChip-deleteIcon": {
                    color: "#94a3b8",
                    "&:hover": { color: "#ef4444" },
                  },
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    bgcolor: "#fffbf5",
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Grid>
  );
}

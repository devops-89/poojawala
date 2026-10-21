"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import EditIcon from "@mui/icons-material/Edit";
import { FONTS } from "@/utils/fonts";
import {
  getPlatformSettingsAPI,
  upsertPlatformSettingAPI,
} from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";

export const parsePlatformSetting = (
  res: any,
  targetKey: string = "ASTROLOGY_COMMISSION_PERCENTAGE"
) => {
  if (!res) return { key: targetKey, value: "", description: "" };

  const findItem = (obj: any): any => {
    if (!obj) return null;
    if (Array.isArray(obj)) {
      for (const el of obj) {
        const found = findItem(el);
        if (found) return found;
      }
      return null;
    }
    if (typeof obj === "object") {
      if (
        obj.key === targetKey ||
        obj.settingKey === targetKey ||
        obj.name === targetKey ||
        obj.code === targetKey
      ) {
        return obj;
      }
      if (obj.data !== undefined) {
        const found = findItem(obj.data);
        if (found) return found;
      }
      if (obj[targetKey] !== undefined) {
        const val = obj[targetKey];
        if (typeof val === "object" && val !== null) {
          return {
            key: targetKey,
            value: val.value ?? val.settingValue ?? val.val ?? "",
            description: val.description ?? val.desc ?? "",
          };
        }
        return {
          key: targetKey,
          value: String(val),
          description: obj.description ?? "",
        };
      }
    }
    return null;
  };

  const item = findItem(res);
  if (item) {
    return {
      key: String(item.key ?? targetKey),
      value: String(item.value ?? item.settingValue ?? item.val ?? ""),
      description: String(item.description ?? item.desc ?? ""),
    };
  }

  return { key: targetKey, value: "", description: "" };
};

interface AstrologyCommissionBannerProps {
  onCommissionLoaded?: (value: string, description: string) => void;
  onCommissionUpdated?: (value: string, description: string) => void;
}

export const AstrologyCommissionBanner: React.FC<AstrologyCommissionBannerProps> = ({
  onCommissionLoaded,
  onCommissionUpdated,
}) => {
  const [platformCommission, setPlatformCommission] = useState<string>("");
  const [platformDescription, setPlatformDescription] = useState<string>("");
  const [loadingCommission, setLoadingCommission] = useState<boolean>(true);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState<boolean>(false);
  const [inputCommissionValue, setInputCommissionValue] = useState<string>("");
  const [inputCommissionDesc, setInputCommissionDesc] = useState<string>("");
  const [isSavingCommission, setIsSavingCommission] = useState<boolean>(false);
  const { showSnackbar } = useSnackbarStore();

  const fetchPlatformCommission = useCallback(async () => {
    try {
      setLoadingCommission(true);
      const res = await getPlatformSettingsAPI();
      const parsed = parsePlatformSetting(res, "ASTROLOGY_COMMISSION_PERCENTAGE");
      if (parsed.value !== "") {
        setPlatformCommission(parsed.value);
      }
      setPlatformDescription(parsed.description || "");
      if (onCommissionLoaded) {
        onCommissionLoaded(parsed.value, parsed.description || "");
      }
    } catch (error) {
      console.error("Failed to fetch platform setting:", error);
    } finally {
      setLoadingCommission(false);
    }
  }, [onCommissionLoaded]);

  useEffect(() => {
    fetchPlatformCommission();
  }, [fetchPlatformCommission]);

  const handleOpenCommissionModal = () => {
    setInputCommissionValue(platformCommission || "");
    setInputCommissionDesc(platformDescription || "");
    setIsCommissionModalOpen(true);
  };

  const handleSaveCommission = async () => {
    const trimmedVal = inputCommissionValue.trim();
    const numVal = Number(trimmedVal);
    if (!trimmedVal || isNaN(numVal) || numVal < 0 || numVal > 100) {
      showSnackbar("Please enter a valid commission percentage between 0 and 100", "error");
      return;
    }

    setIsSavingCommission(true);
    try {
      const payload = {
        key: "ASTROLOGY_COMMISSION_PERCENTAGE",
        value: trimmedVal,
        description: inputCommissionDesc.trim() || platformDescription || "",
      };

      await upsertPlatformSettingAPI(payload);
      showSnackbar("Platform commission percentage updated successfully!", "success");
      setPlatformCommission(payload.value);
      setPlatformDescription(payload.description);
      setIsCommissionModalOpen(false);

      if (onCommissionUpdated) {
        onCommissionUpdated(payload.value, payload.description);
      }

      await fetchPlatformCommission();
    } catch (error: any) {
      console.error("Failed to update platform setting:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to update platform commission percentage",
        "error"
      );
    } finally {
      setIsSavingCommission(false);
    }
  };

  return (
    <>
      {/* Top Banner: Global Astrology Platform Commission */}
      <Box
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: "20px",
          background: "linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)",
          border: "1.5px solid #fed7aa",
          boxShadow: "0 4px 20px -2px rgba(249, 115, 22, 0.08)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2.5,
        }}
      >
        {/* Left side: Icon + Title + Description */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(234, 88, 12, 0.25)",
              flexShrink: 0,
              mt: 0.2,
            }}
          >
            <PercentIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                color: "#0f172a",
              }}
            >
              Platform Commission Setting
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "0.88rem",
                color: "#475569",
                lineHeight: 1.45,
              }}
            >
              {loadingCommission ? (
                <CircularProgress size={14} sx={{ color: "#ea580c" }} />
              ) : (
                platformDescription || "Astrology platform commission percentage"
              )}
            </Typography>
          </Box>
        </Box>

        {/* Right side: Clean Commission Percentage Label & Value + Update Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2.5, sm: 3 },
            flexShrink: 0,
            alignSelf: { xs: "stretch", sm: "center" },
            justifyContent: { xs: "space-between", sm: "flex-end" },
          }}
        >
          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Commission Percentage
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                fontSize: { xs: "1.5rem", sm: "1.85rem" },
                color: "#ea580c",
                lineHeight: 1.1,
              }}
            >
              {loadingCommission ? (
                <CircularProgress size={20} sx={{ color: "#ea580c" }} />
              ) : (
                `${platformCommission || "0"}%`
              )}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<EditIcon sx={{ fontSize: 18 }} />}
            onClick={handleOpenCommissionModal}
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "12px",
              px: 3,
              py: 1.3,
              bgcolor: "#ea580c",
              boxShadow: "0 4px 14px rgba(234, 88, 12, 0.25)",
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "#c2410c",
              },
            }}
          >
            Update Commission
          </Button>
        </Box>
      </Box>

      {/* Modal Dialog for updating commission */}
      <Dialog
        open={isCommissionModalOpen}
        onClose={() => !isSavingCommission && setIsCommissionModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "20px",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, pb: 1 }}>
          Update Astrology Platform Commission
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "0.88rem", color: "#64748b" }}>
            {platformDescription || "Astrology platform commission percentage"}
          </Typography>

          <TextField
            fullWidth
            label="Commission Percentage (%) *"
            value={inputCommissionValue}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setInputCommissionValue("");
                return;
              }
              const sanitized = raw.replace(/[^0-9.]/g, "");
              const parts = sanitized.split(".");
              if (parts.length > 2) return;
              const num = Number(sanitized);
              if (isNaN(num) || num > 100 || num < 0) return;
              setInputCommissionValue(sanitized);
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                e.preventDefault();
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <PercentIcon sx={{ color: "#ea580c", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            placeholder="e.g. 25"
            helperText="Enter the commission percentage to deduct (0 - 100%)"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: FONTS.OUTFIT,
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={inputCommissionDesc}
            onChange={(e) => setInputCommissionDesc(e.target.value)}
            placeholder="e.g. Astrology platform commission percentage"
            helperText="Brief note explaining this commission setting"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: FONTS.OUTFIT,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setIsCommissionModalOpen(false)}
            disabled={isSavingCommission}
            sx={{
              fontFamily: FONTS.OUTFIT,
              textTransform: "none",
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCommission}
            disabled={isSavingCommission || !inputCommissionValue.trim()}
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "12px",
              px: 3,
              bgcolor: "#ea580c",
              "&:hover": { bgcolor: "#c2410c" },
            }}
          >
            {isSavingCommission ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

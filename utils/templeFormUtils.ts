import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

export const labelSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  letterSpacing: "0.5px",
  color: "#334155",
  textTransform: "uppercase" as const,
  mb: 0.75,
  display: "flex",
  alignItems: "center",
  gap: 0.5,
};

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: "#FFFFFF",
    fontSize: "14px",
    fontFamily: FONTS.OUTFIT,
    "& fieldset": { borderColor: "#E2E8F0" },
    "&:hover fieldset": { borderColor: COLORS.PRIMARY },
    "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
  },
  "& .MuiInputBase-input": {
    py: 1.35,
    px: 1.75,
    fontSize: "14px",
    color: "#1E293B",
    "&::placeholder": { color: "#94A3B8", opacity: 1 },
  },
};

// Helper: formats "06:00" to "06:00:00" for backend
export const formatTimeToSeconds = (timeStr?: string): string => {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  return trimmed;
};

// Helper: formats "06:00:00" to "06:00" for HTML <input type="time" />
export const formatSecondsToTimeInput = (timeStr?: string): string => {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed.slice(0, 5);
  return trimmed;
};

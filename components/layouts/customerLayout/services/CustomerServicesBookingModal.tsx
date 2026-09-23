"use client";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";

interface CustomerServicesBookingModalProps {
  open: boolean;
  onClose: () => void;
  bookingForm: {
    scheduledAt: string;
    specialInstructions: string;
    bookingMode: string;
    language: string;
    members: number | string;
  };
  setBookingForm: (form: any) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function CustomerServicesBookingModal({
  open,
  onClose,
  bookingForm,
  setBookingForm,
  onSubmit,
  submitting,
}: CustomerServicesBookingModalProps) {
  const now = new Date();
  const minDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  const max = new Date(now);
  max.setMonth(max.getMonth() + 6);
  const maxDate = new Date(max.getTime() - max.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: "#FF6200",
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#FF6200" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700 }}
          >
            Book Service
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Scheduled Date & Time"
              value={bookingForm.scheduledAt}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  scheduledAt: e.target.value,
                })
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: minDate, max: maxDate },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Booking Mode</InputLabel>
              <Select
                value={bookingForm.bookingMode}
                label="Booking Mode"
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    bookingMode: e.target.value,
                  })
                }
              >
                <MenuItem value="OFFLINE">
                  Offline (Purohit visits location)
                </MenuItem>
                <MenuItem value="ONLINE">Online (Video Call)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Language"
              placeholder="e.g. Hindi, Sanskrit"
              value={bookingForm.language}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, language: e.target.value })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Number of Members"
              value={bookingForm.members}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  members:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Instructions"
              placeholder="Any special requirements..."
              value={bookingForm.specialInstructions}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  specialInstructions: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          disabled={submitting}
          sx={{
            mt: 4,
            background: "#FF6200",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            py: 1.5,
            "&:hover": { background: "#F05A00" },
          }}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </Box>
    </Modal>
  );
}

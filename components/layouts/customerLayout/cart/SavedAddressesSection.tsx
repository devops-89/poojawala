"use client";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { CustomerAddress } from "./CustomerCartContent";

interface SavedAddressesSectionProps {
  addresses: CustomerAddress[];
  selectedAddressId: string | number;
  onSelectAddress: (id: string | number) => void;
  onOpenAddModal: () => void;
  loading: boolean;
}

export default function SavedAddressesSection({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onOpenAddModal,
  loading,
}: SavedAddressesSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "1.2px",
              color: "#64534A",
              textTransform: "uppercase",
              mb: 0.3,
            }}
          >
            DELIVER TO
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "22px", sm: "26px" },
            }}
          >
            Saved Addresses
          </Typography>
        </Box>

        <Button
          onClick={onOpenAddModal}
          startIcon={<AddIcon />}
          sx={{
            color: "#FF6200",
            borderColor: "#FF6200",
            borderStyle: "dashed",
            borderWidth: "1.5px",
            borderRadius: "12px",
            px: 2.5,
            py: 1,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: "14px",
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(255, 98, 0, 0.08)",
              borderColor: "#FF6200",
              borderStyle: "solid",
            },
          }}
        >
          Add New Address
        </Button>
      </Box>

      {/* Address Cards Grid */}
      <Grid container spacing={2.5}>
        {loading ? (
          [1, 2].map((n) => (
            <Grid size={{ xs: 12, sm: 6 }} key={n}>
              <Skeleton
                variant="rectangular"
                height={160}
                sx={{ borderRadius: "18px" }}
              />
            </Grid>
          ))
        ) : addresses.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "white",
                borderRadius: "18px",
                border: "1px dashed #EADCCF",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#64534A",
                  mb: 2,
                }}
              >
                No saved addresses found. Please add an address to proceed.
              </Typography>
              <Button
                onClick={onOpenAddModal}
                variant="contained"
                sx={{
                  bgcolor: "#FF6200",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: "10px",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#E05600" },
                }}
              >
                Add Address
              </Button>
            </Paper>
          </Grid>
        ) : (
          addresses.map((addr) => {
            const isSelected = String(addr.id) === String(selectedAddressId);

            return (
              <Grid size={{ xs: 12, sm: 6 }} key={addr.id}>
                <Paper
                  elevation={0}
                  onClick={() => onSelectAddress(addr.id)}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: "18px",
                    cursor: "pointer",
                    position: "relative",
                    bgcolor: isSelected ? "#FFF9F5" : "white",
                    border: isSelected
                      ? "2px solid #FF6200"
                      : "1px solid #EADCCF",
                    transition: "all 0.2s ease-in-out",
                    boxShadow: isSelected
                      ? "0 6px 20px rgba(255, 98, 0, 0.12)"
                      : "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 160,
                  }}
                >
                  {/* Top Badge for Selected */}
                  {isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: 20,
                        bgcolor: "#FF6200",
                        color: "white",
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 800,
                        fontSize: "11px",
                        letterSpacing: "0.8px",
                        px: 1.5,
                        py: 0.3,
                        borderRadius: "6px",
                        textTransform: "uppercase",
                        boxShadow: "0 2px 8px rgba(255, 98, 0, 0.3)",
                      }}
                    >
                      DELIVERING HERE
                    </Box>
                  )}

                  <Box sx={{ pt: isSelected ? 0.5 : 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 800,
                        color: "#2C1810",
                        fontSize: "17px",
                        mb: 1,
                      }}
                    >
                      {addr.addressLabel || "Address"}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        color: "#64534A",
                        fontSize: "14px",
                        lineHeight: 1.5,
                        mb: 0.5,
                      }}
                    >
                      {addr.fullAddress}
                    </Typography>

                    {/* Explicit City, State & Pincode Display */}
                    {(addr.city || addr.state || addr.pincode) && (
                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: "#2C1810",
                          fontWeight: 700,
                          fontSize: "13.5px",
                          mb: 1,
                        }}
                      >
                        {[addr.city, addr.state].filter(Boolean).join(", ")}
                        {addr.pincode ? ` — ${addr.pincode}` : ""}
                      </Typography>
                    )}
                  </Box>

                  {/* Card Bottom Actions (NO Edit option) */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mt: 2,
                    }}
                  >
                    {isSelected ? (
                      <Box
                        sx={{
                          bgcolor: "#FFF0E6",
                          border: "1px solid #FF6200",
                          color: "#FF6200",
                          px: 2,
                          py: 0.6,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 700,
                          fontFamily: '"DM Sans", sans-serif',
                        }}
                      >
                        Selected
                      </Box>
                    ) : (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAddress(addr.id);
                        }}
                        sx={{
                          border: "1px solid #EADCCF",
                          color: "#2C1810",
                          px: 2,
                          py: 0.5,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                          fontFamily: '"DM Sans", sans-serif',
                          textTransform: "none",
                          bgcolor: "white",
                          "&:hover": {
                            borderColor: "#FF6200",
                            color: "#FF6200",
                            bgcolor: "#FFF9F5",
                          },
                        }}
                      >
                        Deliver Here
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}

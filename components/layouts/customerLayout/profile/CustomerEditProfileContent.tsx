"use client";
import {
  addCustomerAddressAPI,
  deleteCustomerAddressAPI,
  updateCustomerAddressAPI,
  updateProfileAPI,
} from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const maxDobDate = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 15);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

const TABS = [
  {
    id: "personal",
    label: "Personal Info",
    icon: <PersonIcon sx={{ fontSize: 20 }} />,
  },
  {
    id: "location",
    label: "Addresses",
    icon: <LocationOnIcon sx={{ fontSize: 20 }} />,
  },
];

function CustomerEditProfileContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "personal",
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile, fetchProfile } = useUserStore();

  // --- Form State ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [dob, setDob] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // --- Address State ---
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [addressData, setAddressData] = useState({
    venueType: "HOME",
    fullAddress: "",
    addressLabel: "Home",
    city: "",
    pincode: "",
    latitude: "",
    longitude: "",
    isDefault: false,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      await fetchProfile(true);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setDob(profile.dob ? profile.dob.split("T")[0] : "");
      setBirthPlace(profile.birthPlace || "");
      setPreviewImage(profile.profileImage || "");
      setAddresses(profile.addresses || []);
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar("Image size should be less than 2MB", "error");
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSavePersonal = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      if (dob) formData.append("dob", dob);
      formData.append("birthPlace", birthPlace);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await updateProfileAPI(formData);
      await fetchProfile(true);
      showSnackbar("Profile updated successfully", "success");
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      showSnackbar("Geolocation is not supported by your browser", "error");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toString();
        const lon = position.coords.longitude.toString();

        let newAddressData = {
          ...addressData,
          latitude: lat,
          longitude: lon,
        };

        try {
          // Reverse geocoding using OpenStreetMap Nominatim API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );
          if (res.ok) {
            const data = await res.json();
            const addressObj = data.address || {};

            newAddressData = {
              ...newAddressData,
              fullAddress: data.display_name || "",
              city:
                addressObj.city ||
                addressObj.town ||
                addressObj.village ||
                addressObj.state_district ||
                "",
              pincode: addressObj.postcode || "",
            };
          }
        } catch (err) {
          console.error("Failed to reverse geocode:", err);
        }

        setAddressData(newAddressData);
        showSnackbar("Location data fetched successfully!", "success");
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error(error);
        showSnackbar(
          "Failed to fetch location. Please allow location access.",
          "error",
        );
        setIsFetchingLocation(false);
      },
    );
  };

  const handleOpenAddressModal = (address?: any) => {
    if (address) {
      setSelectedAddressId(address.id);
      setAddressData({
        venueType: address.venueType || "HOME",
        fullAddress: address.fullAddress || "",
        addressLabel: address.addressLabel || "",
        city: address.city || "",
        pincode: address.pincode || "",
        latitude: address.latitude || "0",
        longitude: address.longitude || "0",
        isDefault: address.isDefault || false,
      });
    } else {
      setSelectedAddressId(null);
      setAddressData({
        venueType: "HOME",
        fullAddress: "",
        addressLabel: "",
        city: "",
        pincode: "",
        latitude: "0",
        longitude: "0",
        isDefault: addresses.length === 0,
      });
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      if (
        !addressData.fullAddress ||
        !addressData.city ||
        !addressData.pincode
      ) {
        showSnackbar("Please fill all required fields", "error");
        return;
      }
      setSaving(true);
      if (selectedAddressId) {
        await updateCustomerAddressAPI(selectedAddressId, addressData);
      } else {
        await addCustomerAddressAPI(addressData);
      }
      await fetchProfile(true); // Refetch to get updated addresses
      showSnackbar(
        selectedAddressId ? "Address updated" : "Address added",
        "success",
      );
      setAddressModalOpen(false);
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Failed to save address",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddressClick = (id: number) => {
    setAddressToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await deleteCustomerAddressAPI(addressToDelete);
      await fetchProfile(true);
      showSnackbar("Address deleted", "success");
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete address",
        "error",
      );
    } finally {
      setDeleteConfirmOpen(false);
      setAddressToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "#FF6200" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton
          onClick={() => router.push("/customer/profile")}
          sx={{
            mr: 2,
            bgcolor: "white",
            border: "1px solid #e2e8f0",
            "&:hover": { bgcolor: "#f8fafc" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Edit Profile
          </Typography>
          <Typography
            sx={{ color: "#64748b", fontFamily: '"DM Sans", sans-serif' }}
          >
            Update your personal information and addresses
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Sidebar Tabs */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            {TABS.map((tab) => (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2.5,
                  cursor: "pointer",
                  borderBottom: "1px solid #e2e8f0",
                  bgcolor: activeTab === tab.id ? "#FFF0E6" : "white",
                  color: activeTab === tab.id ? "#FF6200" : "#475569",
                  borderLeft:
                    activeTab === tab.id
                      ? "4px solid #FF6200"
                      : "4px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: activeTab === tab.id ? "#FFF0E6" : "#f8fafc",
                  },
                }}
              >
                {tab.icon}
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Right Content Area */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* PERSONAL INFO TAB */}
            {activeTab === "personal" && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    mb: 4,
                  }}
                >
                  Personal Information
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 3, mb: 5 }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={previewImage}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: "#f1f5f9",
                        color: "#94a3b8",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 50 }} />
                    </Avatar>
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: -5,
                        right: -5,
                        bgcolor: "#FF6200",
                        color: "white",
                        "&:hover": { bgcolor: "#ea580c" },
                        width: 36,
                        height: 36,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <PhotoCameraIcon sx={{ fontSize: 18 }} />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 600,
                        color: "#1e293b",
                        mb: 0.5,
                      }}
                    >
                      Profile Photo
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: "0.875rem",
                        color: "#64748b",
                      }}
                    >
                      JPG, PNG or GIF. Max size 2MB.
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date of Birth"
                      slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: maxDobDate } }}
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Birth Place"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}
                >
                  <Box
                    component="button"
                    onClick={handleSavePersonal}
                    disabled={saving}
                    sx={{
                      bgcolor: "#FF6200 !important",
                      color: "white !important",
                      px: 4,
                      py: 1.5,
                      borderRadius: "8px",
                      border: "none",
                      cursor: saving ? "not-allowed" : "pointer",
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      transition: "background-color 0.2s",
                      opacity: saving ? 0.7 : 1,
                      "&:hover": { bgcolor: "#ea580c !important" },
                    }}
                  >
                    {saving ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save Changes"
                    )}
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === "location" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    My Addresses
                  </Typography>
                  <Box
                    component="button"
                    onClick={() => handleOpenAddressModal()}
                    sx={{
                      bgcolor: "#FF6200 !important",
                      color: "white !important",
                      border: "none",
                      cursor: "pointer",
                      px: 3,
                      py: 1,
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 600,
                      borderRadius: "8px",
                      transition: "background-color 0.2s",
                      "&:hover": { bgcolor: "#ea580c !important" },
                    }}
                  >
                    Add Address
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {addresses.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 8,
                          bgcolor: "#f8fafc",
                          borderRadius: "12px",
                          border: "1px dashed #cbd5e1",
                        }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }}
                        />
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
                            color: "#64748b",
                          }}
                        >
                          No addresses found. Add one to get started.
                        </Typography>
                      </Box>
                    </Grid>
                  ) : (
                    addresses.map((address: any) => (
                      <Grid size={{ xs: 12 }} key={address.id}>
                        <Card
                          elevation={0}
                          sx={{
                            border: "1px solid",
                            borderColor: address.isDefault
                              ? "#FF6200"
                              : "#e2e8f0",
                            borderRadius: "12px",
                            position: "relative",
                            overflow: "visible",
                          }}
                        >
                          <CardContent
                            sx={{
                              p: 3,
                              pt: 3,
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              justifyContent: "space-between",
                              alignItems: { xs: "flex-start", sm: "center" },
                              gap: { xs: 2, sm: 0 },
                            }}
                          >
                            <Box>
                              <Typography
                                component="div"
                                sx={{
                                  fontFamily: '"DM Sans", sans-serif',
                                  fontWeight: 700,
                                  color: "#1e293b",
                                  mb: 1,
                                  fontSize: "1.1rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                }}
                              >
                                {address.addressLabel || "Home"}
                                {address.isDefault && (
                                  <Chip
                                    label="Default"
                                    size="small"
                                    sx={{
                                      bgcolor: "#e6f4ea",
                                      color: "#1e8e3e",
                                      fontWeight: 700,
                                      fontFamily: '"DM Sans", sans-serif',
                                      height: "22px",
                                      fontSize: "0.75rem",
                                    }}
                                  />
                                )}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: '"DM Sans", sans-serif',
                                  color: "#475569",
                                  mb: 1,
                                }}
                              >
                                {address.fullAddress}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Typography
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    color: "#64748b",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  City:{" "}
                                  <span
                                    style={{
                                      color: "#1e293b",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {address.city}
                                  </span>
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: '"DM Sans", sans-serif',
                                    color: "#64748b",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  Pincode:{" "}
                                  <span
                                    style={{
                                      color: "#1e293b",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {address.pincode}
                                  </span>
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                width: { xs: "100%", sm: "auto" },
                                justifyContent: {
                                  xs: "flex-end",
                                  sm: "flex-start",
                                },
                              }}
                            >
                              <IconButton
                                onClick={() => handleOpenAddressModal(address)}
                                sx={{
                                  color: "#3b82f6",
                                  bgcolor: "#eff6ff",
                                  "&:hover": { bgcolor: "#dbeafe" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  handleDeleteAddressClick(address.id)
                                }
                                sx={{
                                  color: "#ef4444",
                                  bgcolor: "#fef2f2",
                                  "&:hover": { bgcolor: "#fee2e2" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ADDRESS MODAL */}
      <Dialog
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { borderRadius: "20px" },
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: "#FF6200",
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#FF6200" },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, pb: 1 }}
        >
          {selectedAddressId ? "Edit Address" : "Add New Address"}
        </DialogTitle>
        <DialogContent dividers>
          <Button
            fullWidth
            variant="outlined"
            onClick={fetchCurrentLocation}
            disabled={isFetchingLocation}
            startIcon={
              isFetchingLocation ? (
                <CircularProgress size={16} />
              ) : (
                <MyLocationIcon />
              )
            }
            sx={{
              mb: 3,
              py: 1.5,
              color: "#388e3c",
              borderColor: "#c8e6c9",
              bgcolor: "#e8f5e9",
              "&:hover": { bgcolor: "#c8e6c9", borderColor: "#a5d6a7" },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "12px",
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {isFetchingLocation
              ? "Locating..."
              : "Use Current Location Coordinates"}
          </Button>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address Label (e.g., Home, Office)"
                value={addressData.addressLabel}
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    addressLabel: e.target.value,
                  })
                }
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Full Address *"
                value={addressData.fullAddress}
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    fullAddress: e.target.value,
                  })
                }
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="City *"
                value={addressData.city}
                onChange={(e) =>
                  setAddressData({ ...addressData, city: e.target.value })
                }
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Pincode *"
                value={addressData.pincode}
                onChange={(e) =>
                  setAddressData({ ...addressData, pincode: e.target.value })
                }
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addressData.isDefault}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        isDefault: e.target.checked,
                      })
                    }
                    sx={{
                      color: "#FF6200",
                      "&.Mui-checked": { color: "#FF6200" },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif' }}>
                    Set as default address
                  </Typography>
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Latitude (Optional)"
                value={addressData.latitude}
                onChange={(e) =>
                  setAddressData({ ...addressData, latitude: e.target.value })
                }
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Longitude (Optional)"
                value={addressData.longitude}
                onChange={(e) =>
                  setAddressData({ ...addressData, longitude: e.target.value })
                }
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setAddressModalOpen(false)}
            sx={{
              color: "#64748b",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Box
            component="button"
            onClick={handleSaveAddress}
            disabled={saving}
            sx={{
              bgcolor: "#FF6200 !important",
              color: "white !important",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              px: 2.5,
              py: 1,
              borderRadius: "6px",
              transition: "background-color 0.2s",
              opacity: saving ? 0.7 : 1,
              "&:hover": { bgcolor: "#ea580c !important" },
            }}
          >
            {saving ? "Saving..." : "Save Address"}
          </Box>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 800,
            pb: 1,
            color: "#ef4444",
          }}
        >
          Delete Address
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            sx={{ fontFamily: '"DM Sans", sans-serif', color: "#475569" }}
          >
            Are you sure you want to delete this address? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{
              color: "#64748b",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Box
            component="button"
            onClick={confirmDeleteAddress}
            sx={{
              bgcolor: "#ef4444 !important",
              color: "white !important",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              px: 2.5,
              py: 1,
              borderRadius: "6px",
              transition: "background-color 0.2s",
              "&:hover": { bgcolor: "#dc2626 !important" },
            }}
          >
            Delete
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function CustomerEditProfileContent() {
  return (
    <Suspense
      fallback={<Box sx={{ p: 4, textAlign: "center" }}>Loading...</Box>}
    >
      <CustomerEditProfileContentInner />
    </Suspense>
  );
}

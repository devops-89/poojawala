"use client";

import {
  addServiceAreaAPI,
  deleteServiceAreaAPI,
  updateServiceAreaAPI,
} from "@/api/userControllers";
import { AddressModal } from "@/components/layouts/portalLayout/profile/AddressModal";
import ConfirmDeleteDialog from "@/components/widgets/ConfirmDeleteDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface ServiceAreasSectionProps {
  purohitId: string | number;
  serviceAreas: any[];
  setServiceAreas: React.Dispatch<React.SetStateAction<any[]>>;
  defaultCity?: string;
  defaultState?: string;
}

export const ServiceAreasSection: React.FC<ServiceAreasSectionProps> = ({
  purohitId,
  serviceAreas,
  setServiceAreas,
  defaultCity,
  defaultState,
}) => {
  const { showSnackbar } = useSnackbarStore();

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [deleteAreaTarget, setDeleteAreaTarget] = useState<any>(null);
  const [isDeletingArea, setIsDeletingArea] = useState(false);
  const [isSavingAreaModal, setIsSavingAreaModal] = useState(false);

  const [addressForm, setAddressForm] = useState<{
    id?: number | null;
    addressLabel: string;
    streetName: string;
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
    latitude: string;
    longitude: string;
    serviceRadiusKm: number;
  }>({
    id: null,
    addressLabel: "Primary Service Area",
    streetName: "",
    fullAddress: "",
    city: defaultCity || "",
    state: defaultState || "",
    pincode: "",
    isDefault: false,
    latitude: "",
    longitude: "",
    serviceRadiusKm: 15,
  });

  const initialAddressDataRef = React.useRef<any>(null);

  const handleOpenAddAddress = () => {
    setSelectedAddressId(null);
    const initialData = {
      id: null,
      addressLabel: "Primary Service Area",
      streetName: "",
      fullAddress: "",
      city: defaultCity || "",
      state: defaultState || "",
      pincode: "",
      isDefault: serviceAreas.length === 0,
      latitude: "",
      longitude: "",
      serviceRadiusKm: 15,
    };
    initialAddressDataRef.current = null;
    setAddressForm(initialData);
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (area: any) => {
    setSelectedAddressId(area.id);
    const initialData = {
      id: area.id,
      addressLabel: area.addressLabel || "Primary Service Area",
      streetName: area.streetName || "",
      fullAddress: area.fullAddress || "",
      city: area.city || "",
      state: area.state || "",
      pincode: area.pincode || "",
      isDefault: area.isDefault || false,
      latitude: area.latitude || "",
      longitude: area.longitude || "",
      serviceRadiusKm: Number(area.serviceRadiusKm || 15),
    };
    initialAddressDataRef.current = initialData;
    setAddressForm(initialData);
    setAddressModalOpen(true);
  };

  const handleOpenDeleteAddressModal = (area: any) => {
    setDeleteAreaTarget(area);
  };

  const handleConfirmDeleteArea = async () => {
    if (!deleteAreaTarget) return;
    setIsDeletingArea(true);
    const areaId = deleteAreaTarget.id ?? deleteAreaTarget._id;
    try {
      if (
        areaId &&
        (typeof areaId === "string" ||
          (typeof areaId === "number" && areaId < 1000000000000))
      ) {
        await deleteServiceAreaAPI(areaId);
      }
      setServiceAreas((prev) => prev.filter((a) => (a.id ?? a._id) !== areaId));
      showSnackbar("Service area deleted successfully!", "success");
    } catch (error: any) {
      console.error("Service area delete error:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to delete service area",
        "error"
      );
    } finally {
      setIsDeletingArea(false);
      setDeleteAreaTarget(null);
    }
  };

  const handleSaveAddressModal = async (overrideData?: any) => {
    const targetData = overrideData || addressForm;

    if (selectedAddressId && initialAddressDataRef.current) {
      const isUnchanged =
        JSON.stringify(targetData) ===
        JSON.stringify(initialAddressDataRef.current);
      if (isUnchanged) {
        showSnackbar("No changes detected to save", "info");
        setAddressModalOpen(false);
        setSelectedAddressId(null);
        return;
      }
    }

    const constructedFullAddress =
      targetData.fullAddress ||
      [targetData.streetName, targetData.city, targetData.state, targetData.pincode]
        .filter(Boolean)
        .join(", ");

    const areaPayload = {
      purohitId: Number(purohitId),
      addressLabel: targetData.addressLabel || "Primary Service Area",
      streetName:
        targetData.streetName || targetData.addressLabel || "Main Area",
      fullAddress: constructedFullAddress,
      city: targetData.city || defaultCity,
      state: targetData.state || defaultState,
      pincode: targetData.pincode,
      latitude: targetData.latitude ? String(targetData.latitude) : undefined,
      longitude: targetData.longitude
        ? String(targetData.longitude)
        : undefined,
      serviceRadiusKm: targetData.serviceRadiusKm
        ? String(targetData.serviceRadiusKm)
        : "15.00",
      isDefault: targetData.isDefault || false,
    };

    setIsSavingAreaModal(true);
    try {
      if (
        selectedAddressId &&
        (typeof selectedAddressId === "string" ||
          (typeof selectedAddressId === "number" && selectedAddressId < 1000000000000))
      ) {
        const res = await updateServiceAreaAPI(selectedAddressId, areaPayload);
        const resObj =
          res?.data?.data ||
          (res?.data && typeof res.data === "object" && !("success" in res.data) ? res.data : {}) ||
          res?.serviceArea ||
          {};
        const updatedObj = {
          ...targetData,
          ...areaPayload,
          ...resObj,
          id: selectedAddressId,
          fullAddress: resObj.fullAddress || constructedFullAddress,
        };
        setServiceAreas((prev) =>
          prev.map((a) =>
            (a.id ?? a._id) === selectedAddressId ? updatedObj : a,
          ),
        );
        showSnackbar("Service area updated successfully!", "success");
      } else {
        const res = await addServiceAreaAPI(areaPayload);
        const resObj =
          res?.data?.data ||
          (res?.data && typeof res.data === "object" && !("success" in res.data) ? res.data : {}) ||
          res?.serviceArea ||
          {};
        const assignedId = resObj.id || resObj._id || res?.data?.id || Date.now();
        const newObj = {
          ...targetData,
          ...areaPayload,
          ...resObj,
          id: assignedId,
          fullAddress: resObj.fullAddress || constructedFullAddress,
        };
        setServiceAreas((prev) => [...prev, newObj]);
        showSnackbar("Service area added successfully!", "success");
      }
      setAddressModalOpen(false);
      setSelectedAddressId(null);
    } catch (error: any) {
      console.error("Service area save error:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to save service area",
        "error",
      );
    } finally {
      setIsSavingAreaModal(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnIcon sx={{ color: "#FF6200" }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            4. Service Areas & Operating Locations
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={handleOpenAddAddress}
          sx={{
            borderColor: "#FF6200",
            color: "#FF6200",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 0.8,
            fontFamily: "var(--font-outfit), sans-serif",
            "&:hover": {
              borderColor: "#E65800",
              bgcolor: "#FFF8F2",
            },
          }}
        >
          Add Service Area
        </Button>
      </Box>

      {serviceAreas.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: "14px",
            p: 4,
            textAlign: "center",
            borderStyle: "dashed",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#64748b",
            }}
          >
            No service areas added yet. Click "Add Service Area" to configure
            operating locations.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {serviceAreas.map((area: any) => (
            <Grid
              size={{ xs: 12, sm: 6 }}
              key={area.id}
              sx={{ display: "flex" }}
            >
              <Card
                variant="outlined"
                sx={{
                  width: "100%",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#FFF",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOnIcon sx={{ color: "#FF6200", fontSize: 20 }} />
                      <Typography
                        sx={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontWeight: 700,
                          fontSize: "16px",
                          color: "#1A1A1A",
                        }}
                      >
                        {area.addressLabel || "Primary Service Area"}
                      </Typography>
                      {area.isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          sx={{
                            bgcolor: "#E8F5E9",
                            color: "#2E7D32",
                            fontWeight: 700,
                            fontSize: "11px",
                            height: "22px",
                            borderRadius: "6px",
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Edit Service Area">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditAddress(area)}
                          sx={{
                            color: "#64748b",
                            "&:hover": { color: "#FF6200" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Service Area">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteAddressModal(area)}
                          sx={{
                            color: "#64748b",
                            "&:hover": { color: "#ef4444" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      color: "#64748b",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {area.fullAddress ||
                      [area.streetName, area.city, area.state, area.pincode]
                        .filter(Boolean)
                        .join(", ")}
                  </Typography>

                  {(area.serviceRadiusKm || area.radius) && (
                    <Box
                      sx={{
                        mt: 2,
                        pt: 1.5,
                        borderTop: "1px dashed #f1f5f9",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#FF6200",
                        }}
                      >
                        Operating Radius: {area.serviceRadiusKm || area.radius} km
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Address Edit / Add Modal */}
      <AddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        selectedAddressId={selectedAddressId}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        onSaveAddress={handleSaveAddressModal}
        savingAddress={isSavingAreaModal}
        onFetchCurrentLocation={() => {}}
        isFetchingLocation={false}
      />

      {/* Delete Service Area Confirmation Modal */}
      <ConfirmDeleteDialog
        open={Boolean(deleteAreaTarget)}
        title="Delete Service Area"
        itemName={
          deleteAreaTarget?.addressLabel ||
          deleteAreaTarget?.fullAddress ||
          "Service Area"
        }
        customMessage={`Are you sure you want to delete the service area "${deleteAreaTarget?.addressLabel || deleteAreaTarget?.fullAddress || "this area"}"?`}
        onClose={() => setDeleteAreaTarget(null)}
        onConfirm={handleConfirmDeleteArea}
        loading={isDeletingArea}
      />
    </Box>
  );
};

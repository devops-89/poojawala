"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { MuiTelInput } from "@/components/widgets/MuiTelInput";

interface AddBookingCustomerSectionProps {
  showAddCustomer: boolean;
  setShowAddCustomer: (val: boolean) => void;
  customers: any[];
  values: any;
  errors: any;
  touched: any;
  handleChange: any;
  handleBlur: any;
  setFieldValue: any;
  setCustomerSearchText: (text: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  handleCreateCustomer: () => void;
  isCreatingCustomer: boolean;
}

export default function AddBookingCustomerSection({
  showAddCustomer,
  setShowAddCustomer,
  customers,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  setCustomerSearchText,
  showPassword,
  setShowPassword,
  handleCreateCustomer,
  isCreatingCustomer,
}: AddBookingCustomerSectionProps) {
  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          {showAddCustomer ? "Add New Customer" : "Select Customer"}
        </Typography>
        <Button
          size="small"
          onClick={() => {
            const nextShow = !showAddCustomer;
            setShowAddCustomer(nextShow);
            setFieldValue("isNewCustomer", nextShow);
            setFieldValue("customerId", "");

            // Clear input fields so form opens fresh every time
            setFieldValue("newCustomerName", "");
            setFieldValue("newCustomerMobile", "");
            setFieldValue("newCustomerEmail", "");
            setFieldValue("newCustomerAddress", "");
            setFieldValue("newCustomerCity", "");
            setFieldValue("newCustomerPassword", "");
          }}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#FF6200",
          }}
        >
          {showAddCustomer ? "Use Existing Customer" : "+ Add New Customer"}
        </Button>
      </Box>

      {!showAddCustomer ? (
        <Autocomplete
          options={customers}
          getOptionLabel={(option) => {
            const defaultAddr =
              option?.addresses?.find(
                (a: any) =>
                  a.isDefault === true ||
                  a.isdefault === true ||
                  a.is_default === true,
              ) || option?.addresses?.[0];
            const cityInfo = defaultAddr?.city
              ? ` - ${defaultAddr.city}`
              : option?.city
                ? ` - ${option.city}`
                : "";
            return `${option.firstName} ${
              option.lastName || ""
            } (${option.phone || option.email})${cityInfo}`;
          }}
          value={
            customers.find((c) => c.id === Number(values.customerId)) || null
          }
          filterOptions={(x) => x}
          onInputChange={(_, newInputValue, reason) => {
            if (reason === "input" || reason === "clear") {
              setCustomerSearchText(newInputValue);
            }
          }}
          onChange={(_, newValue) => {
            setFieldValue("customerId", newValue ? newValue.id : "");
            setFieldValue("serviceId", "");
            setFieldValue("purohitId", "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search customer by name, email or phone"
              error={touched.customerId && Boolean(errors.customerId)}
              helperText={
                touched.customerId ? (errors.customerId as string) : undefined
              }
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
          )}
        />
      ) : (
        <Card
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            bgcolor: "#f8fafc",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Full Name *"
                name="newCustomerName"
                variant="outlined"
                value={values.newCustomerName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.newCustomerName && Boolean(errors.newCustomerName)
                }
                helperText={touched.newCustomerName && errors.newCustomerName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MuiTelInput
                fullWidth
                label="Mobile Number *"
                name="newCustomerMobile"
                variant="outlined"
                defaultCountry="IN"
                onlyCountries={["IN"]}
                disableDropdown
                value={
                  values.newCustomerMobile
                    ? "+91" + values.newCustomerMobile
                    : ""
                }
                onChange={(newValue, info) => {
                  const natNum = info.nationalNumber || "";
                  const cleanNum = natNum.replace(/\D/g, "").slice(0, 10);
                  setFieldValue("newCustomerMobile", cleanNum);
                }}
                onKeyDown={(e) => {
                  if (
                    values.newCustomerMobile &&
                    values.newCustomerMobile.length >= 10
                  ) {
                    if (
                      ![
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }
                }}
                error={
                  touched.newCustomerMobile && Boolean(errors.newCustomerMobile)
                }
                helperText={
                  touched.newCustomerMobile &&
                  (errors.newCustomerMobile as string)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email *"
                name="newCustomerEmail"
                variant="outlined"
                value={values.newCustomerEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.newCustomerEmail && Boolean(errors.newCustomerEmail)
                }
                helperText={
                  touched.newCustomerEmail &&
                  (errors.newCustomerEmail as string)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Password *"
                name="newCustomerPassword"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={values.newCustomerPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.newCustomerPassword &&
                  Boolean(errors.newCustomerPassword)
                }
                helperText={
                  touched.newCustomerPassword &&
                  (errors.newCustomerPassword as string)
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Address *"
                name="newCustomerAddress"
                variant="outlined"
                value={values.newCustomerAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.newCustomerAddress &&
                  Boolean(errors.newCustomerAddress)
                }
                helperText={
                  touched.newCustomerAddress &&
                  (errors.newCustomerAddress as string)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City *"
                name="newCustomerCity"
                variant="outlined"
                value={values.newCustomerCity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.newCustomerCity && Boolean(errors.newCustomerCity)
                }
                helperText={
                  touched.newCustomerCity && (errors.newCustomerCity as string)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              onClick={handleCreateCustomer}
              disabled={isCreatingCustomer}
              sx={{
                bgcolor: "#FF6200",
                color: "white",
                "&:hover": { bgcolor: "#E65800" },
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              {isCreatingCustomer ? "Creating..." : "Create Customer"}
            </Button>
          </Box>
        </Card>
      )}
    </Grid>
  );
}

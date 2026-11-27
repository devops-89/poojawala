"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import {
  allowOnlyEmailCharsOnKeyDown,
  sanitizeEmailInput,
  allowOnlyAddressCharsOnKeyDown,
  sanitizeAddressInput,
} from "@/utils/helpers";

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
  setFieldTouched?: any;
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
  setFieldTouched,
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
          flexWrap: "wrap",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: { xs: "12.5px", sm: "13px" },
            color: "#1e293b",
          }}
        >
          {showAddCustomer ? "Add New Customer" : "Select Customer *"}
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

            // Reset touched status so validation errors are not displayed immediately
            if (setFieldTouched) {
              setFieldTouched("newCustomerName", false, false);
              setFieldTouched("newCustomerMobile", false, false);
              setFieldTouched("newCustomerEmail", false, false);
              setFieldTouched("newCustomerAddress", false, false);
              setFieldTouched("newCustomerCity", false, false);
              setFieldTouched("newCustomerPassword", false, false);
              setFieldTouched("customerId", false, false);
            }
          }}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: FONTS.OUTFIT,
            color: COLORS.PRIMARY,
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
          renderInput={(params) => {
            if (params.slotProps?.htmlInput) {
              params.slotProps.htmlInput.autoComplete = "new-password";
            }
            return (
              <TextField
                {...params}
                size="small"
                name="search_customer_input"
                variant="outlined"
                placeholder="Search customer..."
                error={touched.customerId && Boolean(errors.customerId)}
                helperText={
                  touched.customerId ? (errors.customerId as string) : undefined
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    height: { xs: "40px", sm: "42px" },
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                    "& input": { py: 0 },
                  },
                }}
              />
            );
          }}
        />
      ) : (
        <Card
          elevation={0}
          sx={{
            p: { xs: 1.8, sm: 2.5 },
            border: "1px solid #EFEAE3",
            borderRadius: "14px",
            bgcolor: "#FAF8F5",
            "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
              WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
              WebkitTextFillColor: "#1e293b !important",
              caretColor: "#1e293b",
              transition: "background-color 50000s ease-in-out 0s",
            },
          }}
        >
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Full Name *"
                name="newCustomerName"
                variant="outlined"
                value={values.newCustomerName}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
                  setFieldValue("newCustomerName", val);
                  if (setFieldTouched) setFieldTouched("newCustomerName", true, false);
                }}
                onBlur={handleBlur}
                error={
                  Boolean(errors.newCustomerName) &&
                  (touched.newCustomerName || Boolean(values.newCustomerName))
                }
                helperText={
                  (touched.newCustomerName || Boolean(values.newCustomerName))
                    ? errors.newCustomerName
                    : undefined
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "white",
                    height: { xs: "40px", sm: "42px" },
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MuiTelInput
                fullWidth
                size="small"
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
                  (touched.newCustomerMobile || Boolean(values.newCustomerMobile)) &&
                  (Boolean(errors.newCustomerMobile) ||
                    (values.newCustomerMobile && values.newCustomerMobile.length > 0 && !/^[6-9]/.test(values.newCustomerMobile)))
                }
                helperText={
                  values.newCustomerMobile && values.newCustomerMobile.length > 0 && !/^[6-9]/.test(values.newCustomerMobile)
                    ? "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                    : touched.newCustomerMobile
                    ? (errors.newCustomerMobile as string)
                    : undefined
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "white",
                    height: { xs: "40px", sm: "42px" },
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Email *"
                name="newCustomerEmail"
                autoComplete="off"
                variant="outlined"
                value={values.newCustomerEmail}
                onKeyDown={allowOnlyEmailCharsOnKeyDown}
                onChange={(e) => {
                  const val = sanitizeEmailInput(e.target.value);
                  setFieldValue("newCustomerEmail", val);
                }}
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
                    borderRadius: "10px",
                    bgcolor: "white",
                    height: { xs: "40px", sm: "42px" },
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Password *"
                name="newCustomerPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
                    autoComplete: "new-password",
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#64748B" }}
                        >
                          {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "white",
                    height: { xs: "40px", sm: "42px" },
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Address *"
                name="newCustomerAddress"
                variant="outlined"
                value={values.newCustomerAddress}
                onKeyDown={allowOnlyAddressCharsOnKeyDown}
                onChange={(e) => {
                  const val = sanitizeAddressInput(e.target.value);
                  setFieldValue("newCustomerAddress", val);
                }}
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
                    borderRadius: "10px",
                    bgcolor: "white",
                    height: { xs: "40px", sm: "42px" },
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
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
                    borderRadius: "10px",
                    bgcolor: "white",
                    height: { xs: "40px", sm: "42px" },
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "13px", sm: "13.5px" },
                    fontFamily: FONTS.OUTFIT,
                  },
                }}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              onClick={handleCreateCustomer}
              disabled={isCreatingCustomer}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "white",
                "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                fontFamily: FONTS.OUTFIT,
                boxShadow: "none",
                width: { xs: "100%", sm: "auto" },
                height: { xs: "40px", sm: "38px" },
                px: 2.5,
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

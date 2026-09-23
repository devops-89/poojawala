"use client";

import { PRODUCT_PRICING_UNIT } from "@/api/productControllers";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";

const PRICING_UNITS = Object.values(PRODUCT_PRICING_UNIT);

interface FormValues {
  name: string;
  price: string | number;
  pricingUnit: string;
  quantity: string | number;
  description: string;
}

export default function ProductBasicFields() {
  const { values, handleChange, handleBlur, touched, errors } =
    useFormikContext<FormValues>();

  return (
    <>
      {/* Product Name */}
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Product Name *"
          name="name"
          placeholder="e.g. Pure Brass Pooja Thali Set"
          variant="outlined"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </Grid>

      {/* Price */}
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="Price (₹) *"
          name="price"
          type="number"
          placeholder="e.g. 1450.00"
          variant="outlined"
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.price && Boolean(errors.price)}
          helperText={touched.price && errors.price}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </Grid>

      {/* Pricing Unit */}
      <Grid size={{ xs: 12, md: 2 }}>
        <FormControl fullWidth variant="outlined" error={touched.pricingUnit && Boolean(errors.pricingUnit)}>
          <InputLabel id="pricing-unit-label">Pricing Unit *</InputLabel>
          <Select
            labelId="pricing-unit-label"
            label="Pricing Unit *"
            name="pricingUnit"
            value={values.pricingUnit}
            onChange={handleChange}
            onBlur={handleBlur}
            sx={{
              borderRadius: "12px",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            {PRICING_UNITS.map((unit) => (
              <MenuItem
                key={unit}
                value={unit}
                sx={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Quantity */}
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="Quantity *"
          name="quantity"
          type="number"
          placeholder="e.g. 10"
          variant="outlined"
          value={values.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.quantity && Boolean(errors.quantity)}
          helperText={touched.quantity && errors.quantity}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </Grid>
    </>
  );
}

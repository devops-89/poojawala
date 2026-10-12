"use client";
import { FONTS } from "@/utils/fonts";

import { PRODUCT_PRICING_UNIT } from "@/api/productControllers";
import { getServiceCategoriesAPI } from "@/api/serviceControllers";
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";

const PRICING_UNITS = Object.values(PRODUCT_PRICING_UNIT);

interface FormValues {
  name: string;
  price: string | number;
  pricingUnit: string;
  quantity: string | number;
  description: string;
  categoryId?: string | number;
}

export default function ProductBasicFields() {
  const { values, handleChange, handleBlur, touched, errors, setFieldTouched } =
    useFormikContext<FormValues>();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getServiceCategoriesAPI(1, 100, "", true, "PRODUCT");
        let list: any[] = [];
        if (res) {
          if (Array.isArray(res)) list = res;
          else if (res.data) {
            if (Array.isArray(res.data.data)) list = res.data.data;
            else if (Array.isArray(res.data)) list = res.data;
            else if (Array.isArray(res.data.categories)) list = res.data.categories;
          } else if (res.categories && Array.isArray(res.categories)) {
            list = res.categories;
          }
        }
        const activeOnly = list.filter((c: any) => c.isActive !== false);
        setCategories(activeOnly);
      } catch (err) {
        console.error("Failed to load product categories for dropdown", err);
      }
    };
    fetchCats();
  }, []);

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
          onChange={(e) => {
            handleChange(e);
            setFieldTouched("name", true, false);
          }}
          onBlur={handleBlur}
          error={
            Boolean(errors.name) &&
            (touched.name || Boolean(values.name))
          }
          helperText={
            (touched.name || Boolean(values.name))
              ? (errors.name as string)
              : undefined
          }
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </Grid>

      {/* Product Category */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl
          fullWidth
          variant="outlined"
          error={
            Boolean(errors.categoryId) &&
            (touched.categoryId || Boolean(values.categoryId))
          }
        >
          <InputLabel id="product-category-label">Category *</InputLabel>
          <Select
            labelId="product-category-label"
            label="Category *"
            name="categoryId"
            value={values.categoryId || ""}
            onChange={(e) => {
              handleChange(e);
              setFieldTouched("categoryId", true, false);
            }}
            onBlur={handleBlur}
            sx={{
              borderRadius: "12px",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            <MenuItem value="" disabled sx={{ fontFamily: FONTS.OUTFIT }}>
              Select Product Category
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem
                key={cat.id || cat._id}
                value={cat.id || cat._id}
                sx={{ fontFamily: FONTS.OUTFIT }}
              >
                {cat.name || cat.title}
              </MenuItem>
            ))}
          </Select>
          {(touched.categoryId || Boolean(values.categoryId)) && errors.categoryId && (
            <FormHelperText>{errors.categoryId as string}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Price */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Price (₹) *"
          name="price"
          type="number"
          placeholder="e.g. 1450.00"
          variant="outlined"
          value={values.price}
          onChange={(e: any) => {
            if (Number(e.target.value) < 0) return;
            handleChange(e as any);
            setFieldTouched("price", true, false);
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          onBlur={handleBlur}
          error={
            Boolean(errors.price) &&
            (touched.price || Boolean(values.price !== ""))
          }
          helperText={
            (touched.price || Boolean(values.price !== ""))
              ? (errors.price as string)
              : undefined
          }
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </Grid>

      {/* Pricing Unit */}
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth variant="outlined" error={touched.pricingUnit && Boolean(errors.pricingUnit)}>
          <InputLabel id="pricing-unit-label">Pricing Unit *</InputLabel>
          <Select
            labelId="pricing-unit-label"
            label="Pricing Unit *"
            name="pricingUnit"
            value={values.pricingUnit}
            onChange={(e) => {
              handleChange(e);
              setFieldTouched("pricingUnit", true, false);
            }}
            onBlur={handleBlur}
            sx={{
              borderRadius: "12px",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {PRICING_UNITS.map((unit) => (
              <MenuItem
                key={unit}
                value={unit}
                sx={{ fontFamily: FONTS.OUTFIT }}
              >
                {unit}
              </MenuItem>
            ))}
          </Select>
          {touched.pricingUnit && errors.pricingUnit && (
            <FormHelperText>{errors.pricingUnit as string}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Quantity */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Quantity *"
          name="quantity"
          type="number"
          placeholder="e.g. 10"
          variant="outlined"
          value={values.quantity}
          onChange={(e: any) => {
            if (Number(e.target.value) < 0) return;
            handleChange(e as any);
            setFieldTouched("quantity", true, false);
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          onBlur={handleBlur}
          error={
            Boolean(errors.quantity) &&
            (touched.quantity || Boolean(values.quantity !== ""))
          }
          helperText={
            (touched.quantity || Boolean(values.quantity !== ""))
              ? (errors.quantity as string)
              : undefined
          }
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </Grid>
    </>
  );
}

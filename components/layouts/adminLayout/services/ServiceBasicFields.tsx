"use client";
import { FONTS } from "@/utils/fonts";

import { getServiceCategoriesAPI } from "@/api/serviceControllers";
import { getTemplesAPI } from "@/api/templeControllers";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { ServiceBasicFieldsProps } from "@/utils/types";

export default function ServiceBasicFields({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}: ServiceBasicFieldsProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [temples, setTemples] = useState<any[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getServiceCategoriesAPI(1, 100, "", true, "SERVICE");
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
        console.error("Failed to load categories for dropdown", err);
      }
    };

    const fetchTemples = async () => {
      try {
        const res = await getTemplesAPI(1, 100, "", true);
        let list: any[] = [];
        if (res) {
          if (Array.isArray(res)) list = res;
          else if (Array.isArray(res.data)) list = res.data;
          else if (res.data?.data && Array.isArray(res.data.data)) list = res.data.data;
          else if (res.data?.temples && Array.isArray(res.data.temples)) list = res.data.temples;
          else if (res.temples && Array.isArray(res.temples)) list = res.temples;
        }
        setTemples(list);
      } catch (err) {
        console.error("Failed to load temples for dropdown", err);
      }
    };

    fetchCats();
    fetchTemples();
  }, []);

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          name="name"
          label="Service Name *"
          placeholder="e.g., Satyanarayan Katha"
          variant="outlined"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>

      {/* Select Category */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl
          fullWidth
          variant="outlined"
          error={touched.categoryId && Boolean(errors.categoryId)}
        >
          <InputLabel id="service-category-label">Select Category *</InputLabel>
          <Select
            labelId="service-category-label"
            label="Select Category *"
            name="categoryId"
            value={values.categoryId || ""}
            onChange={(e: any) => {
              if (setFieldValue) {
                setFieldValue("categoryId", e.target.value);
              } else {
                handleChange(e);
              }
            }}
            onBlur={handleBlur}
            sx={{
              borderRadius: "12px",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            <MenuItem value="" disabled>
              <em>Select Service Category</em>
            </MenuItem>
            {categories.map((cat: any) => (
              <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>
                {cat.name || cat.title}
              </MenuItem>
            ))}
          </Select>
          {touched.categoryId && errors.categoryId && (
            <FormHelperText>{errors.categoryId}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Select Temple */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl
          fullWidth
          variant="outlined"
          error={touched.templeId && Boolean(errors.templeId)}
        >
          <InputLabel id="service-temple-label">Select Temple</InputLabel>
          <Select
            labelId="service-temple-label"
            label="Select Temple"
            name="templeId"
            value={values.templeId || ""}
            onChange={(e: any) => {
              if (setFieldValue) {
                setFieldValue("templeId", e.target.value);
              } else {
                handleChange(e);
              }
            }}
            onBlur={handleBlur}
            sx={{
              borderRadius: "12px",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            <MenuItem value="">
              <em>Select Temple</em>
            </MenuItem>
            {temples.map((temple: any) => (
              <MenuItem key={temple.id || temple._id} value={temple.id || temple._id}>
                {temple.name}
              </MenuItem>
            ))}
          </Select>
          {touched.templeId && errors.templeId && (
            <FormHelperText>{errors.templeId}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="description"
          label="Description *"
          placeholder="Describe the ritual..."
          variant="outlined"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description && errors.description}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>
    </>
  );
}

"use client";

import { getServiceCategoriesAPI } from "@/api/serviceControllers";
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface ServiceBasicFieldsProps {
  values: {
    name: string;
    description: string;
    categoryId?: string | number;
  };
  errors: Record<string, any>;
  touched: Record<string, any>;
  handleChange: any;
  handleBlur: any;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
}

export default function ServiceBasicFields({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}: ServiceBasicFieldsProps) {
  const [categories, setCategories] = useState<any[]>([]);

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
    fetchCats();
  }, []);

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
          }}
        >
          Service Name *
        </Typography>
        <TextField
          fullWidth
          name="name"
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

      <Grid size={{ xs: 12 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
          }}
        >
          Select Category *
        </Typography>
        <FormControl
          fullWidth
          error={touched.categoryId && Boolean(errors.categoryId)}
        >
          <Select
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
            displayEmpty
            sx={{
              borderRadius: "12px",
              fontFamily: "var(--font-outfit), sans-serif",
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

      <Grid size={{ xs: 12 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            mb: 1,
            color: "#1e293b",
          }}
        >
          Description *
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="description"
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

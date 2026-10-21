"use client";
import { FONTS } from "@/utils/fonts";
import {
  allowOnlyTitleCharsOnKeyDown,
  sanitizeTitleInput,
  allowOnlyDescriptionCharsOnKeyDown,
  sanitizeDescriptionInput,
} from "@/utils/helpers";

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
  setFieldTouched,
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
          onKeyDown={allowOnlyTitleCharsOnKeyDown}
          onChange={(e) => {
            const sanitized = sanitizeTitleInput(e.target.value);
            if (setFieldValue) {
              setFieldValue("name", sanitized);
            } else {
              handleChange(e as any);
            }
            if (setFieldTouched) setFieldTouched("name", true, false);
          }}
          onBlur={handleBlur}
          error={
            Boolean(errors.name) &&
            (touched.name || Boolean(values.name))
          }
          helperText={
            (touched.name || Boolean(values.name)) ? errors.name : undefined
          }
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>

      {/* Select Category */}
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl
          fullWidth
          variant="outlined"
          error={
            Boolean(errors.categoryId) &&
            (touched.categoryId || Boolean(values.categoryId))
          }
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
              if (setFieldTouched) setFieldTouched("categoryId", true, false);
            }}
            onBlur={handleBlur}
            MenuProps={{
              disableScrollLock: true,
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              slotProps: {
                paper: {
                  sx: {
                    mt: 1,
                    borderRadius: "12px",
                    maxHeight: 280,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
                  },
                },
              },
            }}
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
          {(touched.categoryId || Boolean(values.categoryId)) && errors.categoryId && (
            <FormHelperText>{errors.categoryId}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Select Temple */}
      <Grid size={{ xs: 12, md: 4 }}>
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
            MenuProps={{
              disableScrollLock: true,
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              slotProps: {
                paper: {
                  sx: {
                    mt: 1,
                    borderRadius: "12px",
                    maxHeight: 280,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
                  },
                },
              },
            }}
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

      {/* Sort Order */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          name="sortOrder"
          label="Sort Order"
          placeholder="e.g. 1, 2, 3..."
          variant="outlined"
          type="number"
          value={values.sortOrder ?? ""}
          onChange={(e: any) => {
            if (Number(e.target.value) < 0) return;
            handleChange(e);
            if (setFieldTouched) setFieldTouched("sortOrder", true, false);
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          onWheel={(e: any) => e.target.blur()}
          onBlur={handleBlur}
          error={touched.sortOrder && Boolean(errors.sortOrder)}
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
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
          onKeyDown={allowOnlyDescriptionCharsOnKeyDown}
          onChange={(e) => {
            const sanitized = sanitizeDescriptionInput(e.target.value);
            if (setFieldValue) {
              setFieldValue("description", sanitized);
            } else {
              handleChange(e as any);
            }
            if (setFieldTouched) setFieldTouched("description", true, false);
          }}
          onBlur={handleBlur}
          error={
            Boolean(errors.description) &&
            (touched.description || Boolean(values.description))
          }
          helperText={
            (touched.description || Boolean(values.description))
              ? errors.description
              : undefined
          }
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
          }}
        />
      </Grid>
    </>
  );
}

"use client";
import { COLORS } from "@/utils/enums";

import { editBlogAPI, getBlogByIdAPI } from "@/api/blogControllers";
import BlogForm, { BlogFormValues } from "@/components/layouts/adminLayout/blogs/BlogForm";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EditBlogContentProps {
  blogId: string | number;
}

export default function EditBlogContent({ blogId }: EditBlogContentProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<BlogFormValues>({
    title: "",
    content: "",
    category: "",
    authorName: "",
    readTime: "",
    isFeatured: false,
    coverImage: "",
    metaTitle: "",
    metaDescription: "",
    sections: [],
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlogByIdAPI(blogId);
        const data = res?.data?.data || res?.data || res?.blog || res;

        if (data) {
          const authorName =
            data.authorName ||
            (typeof data.author === "string"
              ? data.author
              : typeof data.author === "object" && data.author
              ? `${data.author.firstName || ""} ${data.author.lastName || ""}`.trim() ||
                data.author.username ||
                data.author.name
              : "");

          const categoryName =
            typeof data.category === "string"
              ? data.category
              : typeof data.category === "object" && data.category
              ? data.category.name || data.category.title
              : data.categoryName || "";

          const coverImg =
            data.coverImage || data.imageUrl || data.image || data.downloadUrl || "";

          const rawMainContent = data.content || data.body || "";
          const cleanText = (str: string) => (str || "").replace(/<[^>]*>/g, "").trim();
          const mainClean = cleanText(rawMainContent);

          let initialSections = Array.isArray(data.sections)
            ? data.sections.map((sec: any) => ({
                title: sec.title || sec.heading || "",
                description: sec.description || sec.content || sec.body || "",
              }))
            : [];

          // If only 1 section exists and its content matches the blog's main content,
          // it was automatically duplicated from main content by the backend when no custom sections were added.
          if (initialSections.length === 1) {
            const onlySec = initialSections[0];
            const secTitle = (onlySec.title || "").trim().toLowerCase();
            const secClean = cleanText(onlySec.description || "");
            const blogTitle = (data.title || "").trim().toLowerCase();

            if (
              (secClean && secClean === mainClean) ||
              (onlySec.description && onlySec.description === rawMainContent)
            ) {
              if (!secTitle || secTitle === blogTitle || secTitle === "main content" || secTitle === "content") {
                initialSections = [];
              }
            }
          }

          setInitialValues({
            title: data.title || "",
            content: rawMainContent,
            category: categoryName,
            authorName: authorName,
            readTime: data.readTime ?? "",
            isFeatured: Boolean(data.isFeatured),
            coverImage: coverImg,
            metaTitle: data.metaTitle || "",
            metaDescription: data.metaDescription || "",
            status: data.status || "PUBLISHED",
            sections: initialSections,
          });
        }
      } catch (err: any) {
        console.error("Failed to fetch blog details", err);
        showSnackbar("Failed to fetch blog details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId, showSnackbar]);

  const handleSubmit = async (values: BlogFormValues, imageFile?: File | null) => {
    try {
      let payload: any;
      const parsedRead = Number(values.readTime);
      const safeReadTime =
        !isNaN(parsedRead) && parsedRead > 0 && parsedRead <= 300
          ? Math.round(parsedRead)
          : 4;

      const jsonPayload = {
        title: values.title,
        content: values.content,
        sections: (values.sections || [])
          .filter((sec: any) => Boolean(sec?.title || sec?.heading || sec?.description || sec?.content))
          .map((sec: any) => ({
            title: sec.title || sec.heading || "",
            description: sec.description || sec.content || "",
          })),
        readTime: safeReadTime,
        category: values.category,
        status: values.status || "PUBLISHED",
        isFeatured: Boolean(values.isFeatured),
        authorName: values.authorName || "",
        coverImage: values.coverImage || "",
        metaTitle: values.metaTitle ? values.metaTitle.trim() : "",
        metaDescription: values.metaDescription ? values.metaDescription.trim() : "",
      };

      let fileToSend = imageFile;
      const existingCover =
        values.coverImage && !values.coverImage.startsWith("blob:")
          ? values.coverImage
          : "";

      if (!fileToSend && existingCover) {
        try {
          const imgRes = await fetch(existingCover);
          if (imgRes.ok) {
            const blob = await imgRes.blob();
            const ext = blob.type?.split("/")[1] || "webp";
            fileToSend = new File([blob], `blog_cover.${ext}`, {
              type: blob.type || "image/webp",
            });
          }
        } catch (err) {
          console.error("Could not fetch existing blog cover image:", err);
        }
      }

      if (fileToSend) {
        const formData = new FormData();
        const { coverImage, ...restPayload } = jsonPayload;
        Object.entries(restPayload).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            if (key === "sections") {
              formData.append(key, JSON.stringify(val));
            } else {
              formData.append(key, String(val));
            }
          }
        });
        formData.append("coverImage", fileToSend);
        payload = formData;
      } else {
        const { coverImage, ...restJson } = jsonPayload;
        payload =
          coverImage && coverImage.startsWith("blob:") ? restJson : jsonPayload;
      }

      const res = await editBlogAPI(blogId, payload);
      if (res?.success !== false) {
        showSnackbar("Blog updated successfully!", "success");
        router.push("/admin/blogs");
      } else {
        showSnackbar(res?.message || "Failed to update blog", "error");
      }
    } catch (err: any) {
      console.error("Error updating blog", err);
      const rawMsg = err?.response?.data?.message || err?.message || "";
      const displayMsg =
        typeof rawMsg === "string" && rawMsg.toLowerCase().includes("validation failed")
          ? "Please complete all required fields before publishing the blog."
          : rawMsg || "Failed to update blog";
      showSnackbar(displayMsg, "error");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  return (
    <BlogForm
      isEdit
      title="Edit Blog Post"
      submitButtonText="Save Changes"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}

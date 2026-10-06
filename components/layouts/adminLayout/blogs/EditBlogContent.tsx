"use client";

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

          setInitialValues({
            title: data.title || "",
            content: data.content || data.body || "",
            category: categoryName,
            authorName: authorName,
            readTime: data.readTime ?? "",
            isFeatured: Boolean(data.isFeatured),
            coverImage: coverImg,
            status: data.status || "PUBLISHED",
            sections: Array.isArray(data.sections)
              ? data.sections.map((sec: any) => ({
                  title: sec.title || sec.heading || "",
                  description: sec.description || sec.content || sec.body || "",
                }))
              : [],
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
      const jsonPayload = {
        title: values.title,
        content: values.content,
        sections: (values.sections || []).map((sec: any) => ({
          title: sec.title || sec.heading || "",
          description: sec.description || sec.content || "",
        })),
        readTime: values.readTime ? Number(values.readTime) : 4,
        category: values.category,
        status: values.status || "PUBLISHED",
        isFeatured: Boolean(values.isFeatured),
        authorName: values.authorName || "",
        coverImage: values.coverImage || "",
      };

      if (imageFile) {
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
        formData.append("coverImage", imageFile);
        payload = formData;
      } else {
        const { coverImage, ...restJson } = jsonPayload;
        payload = coverImage && coverImage.startsWith("blob:") ? restJson : jsonPayload;
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
      showSnackbar(err?.response?.data?.message || "Failed to update blog", "error");
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
        <CircularProgress sx={{ color: "#FF6200" }} />
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

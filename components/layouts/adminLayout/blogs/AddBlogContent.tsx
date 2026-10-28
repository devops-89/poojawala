"use client";

import { createBlogAPI } from "@/api/blogControllers";
import BlogForm, { BlogFormValues } from "@/components/layouts/adminLayout/blogs/BlogForm";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useRouter } from "next/navigation";

export default function AddBlogContent() {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const handleSubmit = async (values: BlogFormValues, imageFile?: File | null) => {
    try {
      let payload: any;
      const parsedRead = Number(values.readTime);
      const safeReadTime =
        !isNaN(parsedRead) && parsedRead > 0 && parsedRead <= 300
          ? Math.round(parsedRead)
          : 4;

      const blogStatus = values.status || "PUBLISHED";

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
        status: blogStatus,
        isFeatured: Boolean(values.isFeatured),
        authorName: values.authorName || "",
        coverImage: values.coverImage || "",
        metaTitle: values.metaTitle ? values.metaTitle.trim() : "",
        metaDescription: values.metaDescription ? values.metaDescription.trim() : "",
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

      const res = await createBlogAPI(payload);
      if (res?.success !== false) {
        showSnackbar(
          blogStatus === "DRAFT"
            ? "Blog saved as draft successfully!"
            : "Blog created successfully!",
          "success"
        );
        router.push("/admin/blogs");
      } else {
        showSnackbar(res?.message || "Failed to create blog", "error");
      }
    } catch (err: any) {
      console.error("Error creating blog", err);
      const rawMsg = err?.response?.data?.message || err?.message || "";
      const displayMsg =
        typeof rawMsg === "string" && rawMsg.toLowerCase().includes("validation failed")
          ? "Please complete all required fields before publishing the blog."
          : rawMsg || "Failed to create blog";
      showSnackbar(displayMsg, "error");
    }
  };

  return (
    <BlogForm
      title="Create New Blog Post"
      submitButtonText="Publish Blog"
      onSubmit={handleSubmit}
    />
  );
}

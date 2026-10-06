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

      const res = await createBlogAPI(payload);
      if (res?.success !== false) {
        showSnackbar("Blog created successfully!", "success");
        router.push("/admin/blogs");
      } else {
        showSnackbar(res?.message || "Failed to create blog", "error");
      }
    } catch (err: any) {
      console.error("Error creating blog", err);
      showSnackbar(err?.response?.data?.message || "Failed to create blog", "error");
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

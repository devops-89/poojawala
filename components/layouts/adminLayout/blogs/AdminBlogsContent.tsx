"use client";

import {
  deleteBlogAPI,
  getAllBlogsAPI,
  updateBlogStatusAPI,
} from "@/api/blogControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmDeleteDialog from "@/components/widgets/ConfirmDeleteDialog";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Avatar, Box, Chip, IconButton, Typography } from "@mui/material";
import NextLink from "next/link";
import { useCallback, useEffect, useState } from "react";

const getAuthorName = (blog: any) => {
  const authorData = blog.author || blog.authorName || blog.createdBy || blog.user;
  if (!authorData) return "Editorial Team";
  if (typeof authorData === "string") return authorData;
  if (typeof authorData === "object") {
    const name = `${authorData.firstName || ""} ${authorData.lastName || ""}`.trim();
    if (name) return name;
    if (authorData.username) return authorData.username;
    if (authorData.name) return authorData.name;
    if (authorData.email) return authorData.email;
  }
  return "Editorial Team";
};

const getCategoryName = (blog: any) => {
  const catData = blog.category || blog.categoryName;
  if (!catData) return "Spiritual";
  if (typeof catData === "string") return catData;
  if (typeof catData === "object") {
    return catData.name || catData.title || catData.categoryName || "Spiritual";
  }
  return "Spiritual";
};

const getBlogTitle = (blog: any) => {
  const titleVal = blog.title || blog.heading || blog.name;
  if (!titleVal) return "Untitled Blog Article";
  if (typeof titleVal === "string") return titleVal;
  if (typeof titleVal === "object") return titleVal.name || titleVal.title || "Untitled Blog Article";
  return String(titleVal);
};

const getBlogDescription = (blog: any) => {
  const descVal = blog.excerpt || blog.description || blog.shortDescription || blog.metaDescription || blog.slug;
  if (!descVal) return "Sacred insights & Vedic rituals guide";
  if (typeof descVal === "string") return descVal;
  if (typeof descVal === "object") return descVal.text || descVal.description || "Sacred insights & Vedic rituals guide";
  return String(descVal);
};

const STATUS_TABS = [
  { id: "All", label: "All Blogs" },
  { id: "PUBLISHED", label: "Published" },
  { id: "DRAFT", label: "Draft" },
];

export default function AdminBlogsContent() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(null);
  const { showSnackbar } = useSnackbarStore();

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);

      let statusParam: string | undefined = undefined;
      if (statusFilter === "PUBLISHED") statusParam = "PUBLISHED";
      if (statusFilter === "DRAFT") statusParam = "DRAFT";

      const res = await getAllBlogsAPI(
        page + 1,
        rowsPerPage,
        searchValue,
        statusParam
      );

      let rawList: any[] = [];
      let total = 0;

      if (res) {
        if (Array.isArray(res)) {
          rawList = res;
          total = res.length;
        } else if (res.data) {
          if (Array.isArray(res.data)) {
            rawList = res.data;
            total = res.pagination?.total || res.total || res.data.length;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            rawList = res.data.data;
            total =
              res.data.total ||
              res.data.pagination?.total ||
              res.data.data.length;
          }
        } else if (res.blogs && Array.isArray(res.blogs)) {
          rawList = res.blogs;
          total = res.total || res.blogs.length;
        }
      }

      setBlogs(rawList);
      setTotalCount(total || rawList.length);
    } catch (err: any) {
      console.error("Failed to fetch blogs", err);
      showSnackbar(
        err?.response?.data?.message || "Failed to fetch blogs",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter, showSnackbar]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchBlogs]);

  const handleStatusChangeConfirm = async () => {
    if (!statusChangeTarget) return;
    try {
      const newStatus = statusChangeTarget.newStatus;
      const res = await updateBlogStatusAPI(
        statusChangeTarget.blog.id,
        newStatus
      );
      if (res?.success !== false) {
        showSnackbar("Blog status updated successfully", "success");
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === statusChangeTarget.blog.id
              ? { ...b, status: newStatus, isActive: newStatus === "PUBLISHED" }
              : b
          )
        );
      } else {
        showSnackbar(
          res?.message || "Failed to update blog status",
          "error"
        );
      }
    } catch (error: any) {
      showSnackbar("Error updating blog status", "error");
    } finally {
      setStatusChangeTarget(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteBlogAPI(deleteTarget);
      if (res?.success !== false) {
        showSnackbar("Blog deleted successfully", "success");
        setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget));
      } else {
        showSnackbar(res?.message || "Failed to delete blog", "error");
      }
    } catch (error: any) {
      showSnackbar("Error deleting blog", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "ID",
      render: (blog) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#FF6200",
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "0.85rem",
          }}
        >
          B-{blog.id}
        </Typography>
      ),
    },
    {
      id: "title",
      label: "NAME",
      render: (blog) => {
        const titleText = getBlogTitle(blog);
        return (
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "0.95rem",
            }}
          >
            {titleText}
          </Typography>
        );
      },
    },
    {
      id: "author",
      label: "AUTHOR",
      render: (blog) => {
        const authorName = getAuthorName(blog);
        return (
          <Typography
            sx={{
              color: "#475569",
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {authorName}
          </Typography>
        );
      },
    },
    {
      id: "status",
      label: "STATUS",
      render: (blog) => {
        const isAct =
          blog.status === "PUBLISHED" ||
          blog.isActive === true ||
          (blog.status !== "DRAFT" && blog.isActive !== false);
        return (
          <AdminStatusSelect
            value={isAct ? "Published" : "Draft"}
            options={[
              { value: "Published", label: "Published" },
              { value: "Draft", label: "Draft" },
            ]}
            onChange={(val) =>
              setStatusChangeTarget({
                blog,
                newStatus: val === "Published" ? "PUBLISHED" : "DRAFT",
              })
            }
          />
        );
      },
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "center",
      render: (blog) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <IconButton
            component={NextLink}
            href={`/admin/blogs/${blog.id}`}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#0ea5e9", bgcolor: "#e0f2fe" },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            component={NextLink}
            href={`/admin/blogs/edit/${blog.id}`}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#FF6200", bgcolor: "#fff7ed" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setDeleteTarget(blog.id)}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 2, md: 3.5 } }}>
      <AdminPageHeader
        title="Blogs Management"
        subtitle="Manage articles, spiritual insights, and published blog content."
        searchPlaceholder="Search blogs..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Create Blog"
        actionButtonHref="/admin/blogs/create"
        actionButtonIcon={<AddIcon />}
      />

      <AdminDataTable
        columns={columns}
        data={blogs}
        isLoading={loading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        tabs={STATUS_TABS}
        activeTab={statusFilter}
        onTabChange={(tab) => {
          setStatusFilter(tab);
          setPage(0);
        }}
        keyExtractor={(blog) => blog.id}
        emptyMessage="No blogs found matching your criteria."
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Blog Deletion"
        itemName={blogs.find((b) => b.id === deleteTarget)?.title || "Blog Article"}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Change Blog Status"
        itemName={statusChangeTarget?.blog?.title || "Blog Article"}
        newStatus={statusChangeTarget?.newStatus === "PUBLISHED" ? "Published" : "Draft"}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={handleStatusChangeConfirm}
      />
    </Box>
  );
}

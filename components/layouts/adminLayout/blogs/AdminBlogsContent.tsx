"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Avatar, Box, Chip, IconButton, Typography } from "@mui/material";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AdminTableActionMenu from "../common/AdminTableActionMenu";

const getAuthorName = (blog: any) => {
  if (!blog) return "Editorial Team";
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
  if (!blog) return "Spiritual";
  const catData = blog.category || blog.categoryName;
  if (!catData) return "Spiritual";
  if (typeof catData === "string") return catData;
  if (typeof catData === "object") {
    return catData.name || catData.title || catData.categoryName || "Spiritual";
  }
  return "Spiritual";
};

const getBlogTitle = (blog: any) => {
  if (!blog) return "";
  const titleVal = blog.title || blog.heading || blog.name;
  if (!titleVal) return "Untitled Blog Article";
  if (typeof titleVal === "string") return titleVal;
  if (typeof titleVal === "object") return titleVal.name || titleVal.title || "Untitled Blog Article";
  return String(titleVal);
};

const getBlogDescription = (blog: any) => {
  if (!blog) return "Sacred insights & Vedic rituals guide";
  const descVal = blog.excerpt || blog.description || blog.shortDescription || blog.content || blog.body || blog.metaDescription || blog.slug;
  if (!descVal) return "Sacred insights & Vedic rituals guide";
  const raw = typeof descVal === "string" ? descVal : descVal.text || descVal.description || "";
  const clean = raw.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return clean || "Sacred insights & Vedic rituals guide";
};

const STATUS_TABS = [
  { id: "All", label: "All Blogs" },
  { id: "PUBLISHED", label: "Published" },
  { id: "DRAFT", label: "Draft" },
];

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminBlogsContent() {
  const initialPagination = getTablePaginationState("admin_blogs_state", {
    defaultStatus: "All",
    defaultLimit: 10,
  });

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    syncTablePagination(
      "admin_blogs_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All", defaultLimit: 10 }
    );
  }, [statusFilter, page, rowsPerPage]);

  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
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
      const targetId = statusChangeTarget.blog.id ?? statusChangeTarget.blog._id;
      const res = await updateBlogStatusAPI(
        targetId,
        newStatus
      );
      if (res?.success !== false) {
        showSnackbar("Blog status updated successfully", "success");
        if (
          (statusFilter === "PUBLISHED" && newStatus !== "PUBLISHED") ||
          (statusFilter === "DRAFT" && newStatus !== "DRAFT")
        ) {
          setBlogs((prev) =>
            prev.filter((b) => (b.id ?? b._id) !== targetId)
          );
          setTotalCount((prev) => Math.max(0, prev - 1));
          fetchBlogs();
        } else {
          setBlogs((prev) =>
            prev.map((b) =>
              (b.id ?? b._id) === targetId
                ? { ...b, status: newStatus, isActive: newStatus === "PUBLISHED" }
                : b
            )
          );
        }
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
      const targetId = deleteTarget.id ?? deleteTarget._id ?? deleteTarget;
      const res = await deleteBlogAPI(targetId);
      if (res?.success !== false) {
        showSnackbar("Blog deleted successfully", "success");
        setBlogs((prev) => prev.filter((b) => (b.id ?? b._id) !== targetId));
        setTotalCount((prev) => Math.max(0, prev - 1));
        fetchBlogs();
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
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.85rem",
          }}
        >
          B-{blog.id ?? blog._id}
        </Typography>
      ),
    },
    {
      id: "title",
      label: "NAME",
      render: (blog) => {
        const titleText = getBlogTitle(blog);
        const isFeatured = Boolean(blog.isFeatured || blog.featured);
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography
              component={NextLink}
              href={`/admin/blogs/${blog.id ?? blog._id}`}
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                fontFamily: FONTS.OUTFIT,
                fontSize: "0.95rem",
                textDecoration: "none",
                "&:hover": {
                  color: COLORS.PRIMARY,
                  textDecoration: "underline",
                },
              }}
            >
              {titleText}
            </Typography>
            {isFeatured && (
              <Chip
                icon={<StarIcon sx={{ fontSize: "14px !important", color: "#b45309 !important" }} />}
                label="Featured"
                size="small"
                sx={{
                  bgcolor: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  height: "22px",
                  borderRadius: "6px",
                  fontFamily: FONTS.OUTFIT,
                  border: "1px solid #fde68a",
                }}
              />
            )}
          </Box>
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
              fontFamily: FONTS.OUTFIT,
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
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                href: `/admin/blogs/${blog.id ?? blog._id}`,
              },
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                href: `/admin/blogs/edit/${blog.id ?? blog._id}`,
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setDeleteTarget(blog),
                color: "#ef4444",
              },
            ]}
          />
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
        keyExtractor={(blog) => blog?.id ?? blog?._id ?? blog?.slug ?? (blog ? getBlogTitle(blog) : "")}
        emptyMessage="No blogs found matching your criteria."
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Blog Deletion"
        itemName={deleteTarget ? getBlogTitle(deleteTarget) : ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Change Blog Status"
        itemName={statusChangeTarget?.blog ? getBlogTitle(statusChangeTarget.blog) : ""}
        newStatus={statusChangeTarget?.newStatus === "PUBLISHED" ? "Published" : "Draft"}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={handleStatusChangeConfirm}
      />
    </Box>
  );
}

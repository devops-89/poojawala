"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Box,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import CodeIcon from "@mui/icons-material/Code";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import FormatClearIcon from "@mui/icons-material/FormatClear";

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: number | string;
  error?: boolean;
  helperText?: string;
  label?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  placeholder = "Write blog content here...",
  minHeight = 260,
  error = false,
  helperText,
  label,
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          style: "color: #FF6200; text-decoration: underline;",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      const currentContent = editor.getHTML();
      if (value !== currentContent) {
        editor.commands.setContent(value || "");
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#1e293b",
            mb: 1,
          }}
        >
          {label}
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: "14px",
          borderColor: error ? "#ef4444" : "#cbd5e1",
          overflow: "hidden",
          transition: "border-color 0.2s ease",
          "&:focus-within": {
            borderColor: error ? "#ef4444" : "#FF6200",
            boxShadow: error
              ? "0 0 0 3px rgba(239, 68, 68, 0.15)"
              : "0 0 0 3px rgba(255, 98, 0, 0.15)",
          },
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 0.5,
            p: 1,
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          {/* Bold */}
          <Tooltip title="Bold">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBold().run()}
              sx={{
                bgcolor: editor.isActive("bold") ? "#FFE0D0" : "transparent",
                color: editor.isActive("bold") ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Italic */}
          <Tooltip title="Italic">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              sx={{
                bgcolor: editor.isActive("italic") ? "#FFE0D0" : "transparent",
                color: editor.isActive("italic") ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Underline */}
          <Tooltip title="Underline">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              sx={{
                bgcolor: editor.isActive("underline") ? "#FFE0D0" : "transparent",
                color: editor.isActive("underline") ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Headings */}
          <Tooltip title="Heading 1">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              sx={{
                bgcolor: editor.isActive("heading", { level: 1 }) ? "#FFE0D0" : "transparent",
                color: editor.isActive("heading", { level: 1 }) ? "#FF6200" : "#475569",
                fontWeight: "bold",
                fontSize: "13px",
                px: 1,
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              H1
            </IconButton>
          </Tooltip>

          <Tooltip title="Heading 2">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              sx={{
                bgcolor: editor.isActive("heading", { level: 2 }) ? "#FFE0D0" : "transparent",
                color: editor.isActive("heading", { level: 2 }) ? "#FF6200" : "#475569",
                fontWeight: "bold",
                fontSize: "13px",
                px: 1,
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              H2
            </IconButton>
          </Tooltip>

          <Tooltip title="Heading 3">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              sx={{
                bgcolor: editor.isActive("heading", { level: 3 }) ? "#FFE0D0" : "transparent",
                color: editor.isActive("heading", { level: 3 }) ? "#FF6200" : "#475569",
                fontWeight: "bold",
                fontSize: "13px",
                px: 1,
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              H3
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Bullet List */}
          <Tooltip title="Bullet List">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              sx={{
                bgcolor: editor.isActive("bulletList") ? "#FFE0D0" : "transparent",
                color: editor.isActive("bulletList") ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Numbered List */}
          <Tooltip title="Numbered List">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              sx={{
                bgcolor: editor.isActive("orderedList") ? "#FFE0D0" : "transparent",
                color: editor.isActive("orderedList") ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatListNumberedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Blockquote */}
          <Tooltip title="Quote">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              sx={{
                bgcolor: editor.isActive("blockquote") ? "#FFE0D0" : "transparent",
                color: editor.isActive("blockquote") ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatQuoteIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Code */}
          <Tooltip title="Code">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleCode().run()}
              sx={{
                bgcolor: editor.isActive("code") ? "#FFE0D0" : "transparent",
                color: editor.isActive("code") ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <CodeIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Alignment */}
          <Tooltip title="Align Left">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              sx={{
                bgcolor: editor.isActive({ textAlign: "left" }) ? "#FFE0D0" : "transparent",
                color: editor.isActive({ textAlign: "left" }) ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatAlignLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Align Center">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              sx={{
                bgcolor: editor.isActive({ textAlign: "center" }) ? "#FFE0D0" : "transparent",
                color: editor.isActive({ textAlign: "center" }) ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatAlignCenterIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Align Right">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              sx={{
                bgcolor: editor.isActive({ textAlign: "right" }) ? "#FFE0D0" : "transparent",
                color: editor.isActive({ textAlign: "right" }) ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <FormatAlignRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Link */}
          <Tooltip title="Add / Edit Link">
            <IconButton
              size="small"
              onClick={setLink}
              sx={{
                bgcolor: editor.isActive("link") ? "#FFE0D0" : "transparent",
                color: editor.isActive("link") ? "#FF6200" : "#475569",
                "&:hover": { bgcolor: "#FFF0E6" },
              }}
            >
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {editor.isActive("link") && (
            <Tooltip title="Remove Link">
              <IconButton
                size="small"
                onClick={() => editor.chain().focus().unsetLink().run()}
                sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fef2f2" } }}
              >
                <LinkOffIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Clear Formatting">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              sx={{ color: "#64748b", "&:hover": { bgcolor: "#f1f5f9" } }}
            >
              <FormatClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Undo / Redo */}
          <Tooltip title="Undo">
            <span>
              <IconButton
                size="small"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                sx={{ color: "#475569" }}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Redo">
            <span>
              <IconButton
                size="small"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                sx={{ color: "#475569" }}
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Editor Content Area */}
        <Box
          sx={{
            p: 2,
            minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
            cursor: "text",
            "& .tiptap": {
              minHeight: typeof minHeight === "number" ? `${minHeight - 32}px` : "200px",
              outline: "none",
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "#1e293b",
              "& p.is-editor-empty:first-child::before": {
                color: "#94a3b8",
                content: "attr(data-placeholder)",
                float: "left",
                height: 0,
                pointerEvents: "none",
              },
              "& h1": {
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "#0f172a",
                mt: 2,
                mb: 1,
              },
              "& h2": {
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#FF6200",
                mt: 2,
                mb: 1,
              },
              "& h3": {
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#1e293b",
                mt: 1.5,
                mb: 0.75,
              },
              "& ul, & ol": {
                pl: 3,
                my: 1,
              },
              "& li": {
                mb: 0.5,
              },
              "& blockquote": {
                borderLeft: "4px solid #FF6200",
                pl: 2,
                ml: 0,
                my: 2,
                fontStyle: "italic",
                color: "#475569",
                bgcolor: "#FFF8F2",
                py: 1,
                borderRadius: "0 8px 8px 0",
              },
              "& code": {
                bgcolor: "#f1f5f9",
                color: "#0f172a",
                px: 0.8,
                py: 0.2,
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "0.9em",
              },
            },
          }}
          onClick={() => editor.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </Box>
      </Paper>

      {error && helperText && (
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "0.75rem",
            color: "#ef4444",
            mt: 0.75,
            ml: 1,
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

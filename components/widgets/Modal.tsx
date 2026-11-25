"use client";
import { useModal } from "@/stores/useModal";
import {
  Modal as MuiModal,
  Box,
  Backdrop,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "90vh",
  minWidth: { xs: "90%", sm: "600px" },
  bgcolor: "background.paper",
  boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
  p: { xs: 3, md: 5 },
  borderRadius: "24px",
  outline: "none",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(0,0,0,0.1)",
    borderRadius: "10px",
  },
};

export default function Modal() {
  const { content, hideModal } = useModal();

  const handleClose = () => hideModal();

  return (
    <MuiModal
      open={!!content}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
          },
        },
      }}
    >
      <Fade in={!!content}>
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              color: "rgba(0,0,0,0.5)",
              "&:hover": {
                color: "black",
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ mt: 1 }}>{content}</Box>
        </Box>
      </Fade>
    </MuiModal>
  );
}

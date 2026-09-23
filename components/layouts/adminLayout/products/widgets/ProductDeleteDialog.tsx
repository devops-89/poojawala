"use client";

import ConfirmDeleteDialog from "@/components/widgets/ConfirmDeleteDialog";
import React from "react";

interface ProductDeleteDialogProps {
  targetId: number | string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ProductDeleteDialog({
  targetId,
  onClose,
  onConfirm,
}: ProductDeleteDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={Boolean(targetId)}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

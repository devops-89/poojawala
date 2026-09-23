"use client";

import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import React from "react";

interface ProductStatusDialogProps {
  target: { product: any; isActive: boolean } | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ProductStatusDialog({
  target,
  onClose,
  onConfirm,
}: ProductStatusDialogProps) {
  return (
    <ConfirmStatusDialog
      open={Boolean(target)}
      itemName={target?.product?.name}
      newStatus={target?.isActive ? "Available" : "Unavailable"}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

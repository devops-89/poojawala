"use client";

import EditAstrologerForm from "@/components/layouts/adminLayout/astrologers/EditAstrologerForm";
import { useParams } from "next/navigation";
import React from "react";

export default function EditAstrologerPage() {
  const params = useParams();
  const id = params.id as string;

  return <EditAstrologerForm id={id} />;
}

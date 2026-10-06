"use client";

import EditPurohitForm from "@/components/layouts/adminLayout/purohits/EditPurohitForm";
import { useParams } from "next/navigation";
import React from "react";

export default function EditPurohitByParamPage() {
  const params = useParams();
  const id = params.id as string;

  return <EditPurohitForm id={id} />;
}

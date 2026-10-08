"use client";

import TempleForm from "./TempleForm";

interface EditTempleFormProps {
  id: string | number;
}

export default function EditTempleForm({ id }: EditTempleFormProps) {
  return <TempleForm isEdit={true} id={id} />;
}

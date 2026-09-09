import PurohitProfileLayout from "@/components/layouts/purohitsLayout/PurohitProfileLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purohit Profile | Poojawala",
  description: "View detailed profile, expertise, and availability of our verified Purohits.",
};

export default async function PurohitProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PurohitProfileLayout id={resolvedParams.id} />;
}

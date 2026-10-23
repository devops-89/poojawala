import PurohitProfileLayout from "@/components/layouts/purohitsLayout/PurohitProfileLayout";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Purohit Profile | 1Pooja",
    description: "View detailed profile, expertise, and availability of our verified Purohits.",
    alternates: {
      canonical: `https://1pooja.com/purohits/${id}`,
    },
    openGraph: {
      url: `https://1pooja.com/purohits/${id}`,
    },
  };
}

export default async function PurohitProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PurohitProfileLayout id={resolvedParams.id} />;
}

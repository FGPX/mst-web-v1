import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { FitCheckerClient } from "@/components/FitCheckerClient";

export default async function FitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <FitCheckerClient product={product} />;
}

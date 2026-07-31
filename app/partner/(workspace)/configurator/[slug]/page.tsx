import { notFound } from "next/navigation";
import { ConfiguratorClient } from "@/components/ConfiguratorClient";
import { products } from "@/lib/data";

export default async function PartnerConfiguratorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug && item.active);
  if (!product) notFound();
  return <div className="partner-configurator-embed"><ConfiguratorClient product={product} /></div>;
}

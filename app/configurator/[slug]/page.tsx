import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { ConfiguratorClient } from "@/components/ConfiguratorClient";

export default async function ConfiguratorPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const query = await searchParams;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ConfiguratorClient
    product={product}
    configurationId={typeof query.configuration === "string" ? query.configuration : undefined}
    initialAssistantRequest={typeof query.request === "string" ? query.request : ""}
  />;
}

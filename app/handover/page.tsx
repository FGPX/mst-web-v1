import { HandoverClient } from "@/components/HandoverClient";

export default async function HandoverPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const initialRequest = params.request === "material" ? "Request a Material Sample" : params.request === "quote" ? "Request a Quote" : undefined;
  return <HandoverClient initialRequest={initialRequest} productId={typeof params.product === "string" ? params.product : undefined} materialId={typeof params.material === "string" ? params.material : undefined} />;
}

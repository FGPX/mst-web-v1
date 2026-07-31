import { CompareClient } from "@/components/CompareClient";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const params = await searchParams;
  return <CompareClient initialIds={params.ids?.split(",").filter(Boolean) ?? []} />;
}

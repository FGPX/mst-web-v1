import { SearchExperience } from "@/components/SearchExperience";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  return <SearchExperience initialQuery={params.q ?? ""} />;
}

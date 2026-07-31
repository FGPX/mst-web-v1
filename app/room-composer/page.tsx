import { RoomComposerClient } from "@/components/RoomComposerClient";

export default async function RoomComposerPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  return <RoomComposerClient openPresentationScene={query.presentation === "1"} />;
}

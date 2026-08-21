import { RoomComposerClient } from "@/components/RoomComposerClient";
import { products } from "@/lib/data";
import { normalizeRoomComposerProductIds } from "@/lib/room-composer-selection";

export default async function UploadRoomPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const activeProductIds = products.filter((product) => product.active).map((product) => product.id);
  const recommendedProductIds = normalizeRoomComposerProductIds(query.product, activeProductIds);
  const projectId = typeof query.project === "string" && query.project ? query.project : "project-room-composer";
  const sceneId = typeof query.scene === "string" && query.scene ? query.scene : undefined;

  return <RoomComposerClient upload openPresentationScene={query.presentation === "1"} recommendedProductIds={recommendedProductIds} projectId={projectId} sceneId={sceneId} />;
}

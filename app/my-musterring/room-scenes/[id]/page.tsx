import { RoomSceneDetailClient } from "@/components/RoomSceneDetailClient";

export default async function SavedRoomScenePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RoomSceneDetailClient sceneKey={decodeURIComponent(id)} />;
}

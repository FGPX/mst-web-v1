import type { Product } from "../types";

export type VisualizationRequest = {
  roomImageReference: string;
  products: Array<Pick<Product, "id" | "modelCode" | "imageAssets">>;
  prompt: string;
};

export type VisualizationResult = {
  imageUrl: string;
  productIds: string[];
  provider: string;
  inspirationalOnly: true;
};

/**
 * Keeps room generation scoped to the products explicitly confirmed in the
 * current chat. Recommendations, old project saves and recently viewed cards
 * are deliberately not inputs to this function.
 */
export function selectedProductIdsForVisualization(selectedIds: string[], savedIds: string[], activeProductIds: string[], limit = 6) {
  const active = new Set(activeProductIds);
  const saved = new Set(savedIds);
  return [...new Set(selectedIds)].filter((id) => saved.has(id) && active.has(id)).slice(0, limit);
}

export interface RoomVisualizationProvider {
  createInspirationalEdit(request: VisualizationRequest): Promise<VisualizationResult>;
  deleteUploadedImage(reference: string): Promise<void>;
}

// Demo mode intentionally uses RoomComposerClient and prepared catalogue imagery.
// A production image-editing service implements this boundary without changing product grounding.
export interface ExternalRoomVisualizationAdapter extends RoomVisualizationProvider {
  readonly service: "openai-image-editing" | "azure-vision" | "vertex-ai" | "amazon-titan";
}

export interface MultimodalRetrievalAdapter {
  readonly service: "azure-vision-multimodal" | "vertex-ai-multimodal" | "amazon-titan-multimodal";
  rankImageAgainstCatalogue(image: Uint8Array, catalogueImageUrls: string[]): Promise<Array<{ imageUrl: string; score: number }>>;
}


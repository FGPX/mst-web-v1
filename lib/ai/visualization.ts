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


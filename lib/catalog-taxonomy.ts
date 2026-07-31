import type { Category } from "./types";

export const categoryDetails: Record<Category, {
  label: string;
  room: string;
  headline: string;
  description: string;
}> = {
  sofa: { label: "Sofas", room: "Living Room", headline: "The heart of the room.", description: "Modular and classic sofa collections designed around individual comfort." },
  armchair: { label: "Armchairs", room: "Living Room", headline: "A place of your own.", description: "Relaxing, swivel and accent armchairs with configurable comfort." },
  sectional: { label: "Sectional Sofas", room: "Living Room", headline: "Comfort without limits.", description: "Generous corner and modular arrangements for open living spaces." },
  storage: { label: "Living Walls & Sideboards", room: "Living Room", headline: "Storage, composed beautifully.", description: "Media furniture, living walls and sideboards with architectural clarity." },
  "coffee-table": { label: "Coffee & Side Tables", room: "Living Room", headline: "The finishing point.", description: "Coffee and side tables that complete the living room." },
  "bedroom-series": { label: "Bedroom Series", room: "Bedroom", headline: "A calmer private world.", description: "Coordinated bedroom collections for a harmonious retreat." },
  bed: { label: "Beds", room: "Bedroom", headline: "Rest, beautifully engineered.", description: "Upholstered and box-spring beds designed for restorative comfort." },
  wardrobe: { label: "Wardrobes", room: "Bedroom & Hallway", headline: "Order with character.", description: "Wardrobe systems with considered storage and refined finishes." },
  "dining-chair": { label: "Dining Chairs", room: "Dining Room", headline: "Take a comfortable seat.", description: "Dining chairs and swivel chairs made for long conversations." },
  "dining-table": { label: "Dining Tables", room: "Dining Room", headline: "Made for gathering.", description: "Dining tables with adaptable formats and enduring materials." },
  bathroom: { label: "Bathroom Series", room: "Bathroom", headline: "Quiet rituals, considered.", description: "Coordinated bathroom furniture with practical storage." },
  kitchen: { label: "Kitchens", room: "Kitchen", headline: "The working heart of home.", description: "Kitchen collections combining function, craft and clean lines." },
  outdoor: { label: "Outdoor Furniture", room: "Outdoor", headline: "Living beyond four walls.", description: "Outdoor seating and tables for considered open-air rooms." },
  "small-furniture": { label: "Small Furniture", room: "Home Accessories", headline: "Small pieces, strong accents.", description: "Flexible occasional furniture for every living world." },
  carpet: { label: "Carpets", room: "Home Accessories", headline: "A softer foundation.", description: "Carpets that bring texture, warmth and balance to a room." },
  lamp: { label: "Lamp Collection", room: "Home Accessories", headline: "Atmosphere, illuminated.", description: "Lighting that shapes mood and highlights materials." },
  "home-textile": { label: "Home Textiles", room: "Home Accessories", headline: "Layers of comfort.", description: "Textiles that add softness, colour and a finished touch." }
};

export const categoryGroups: Array<{ name: string; categories: Category[] }> = [
  { name: "Living Room", categories: ["sofa", "armchair", "sectional", "storage", "coffee-table"] },
  { name: "Bedroom", categories: ["bedroom-series", "bed", "wardrobe"] },
  { name: "Dining Room", categories: ["dining-chair", "dining-table"] },
  { name: "Bathroom", categories: ["bathroom"] },
  { name: "Kitchen", categories: ["kitchen"] },
  { name: "Outdoor", categories: ["outdoor"] },
  { name: "Home Accessories", categories: ["small-furniture", "carpet", "lamp", "home-textile"] }
];

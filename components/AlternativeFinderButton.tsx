"use client";

import { Compass } from "lucide-react";
import { storage } from "@/lib/persistence";

export function AlternativeFinderButton({ productId, label = "Discover More Like This", className = "button ghost" }: { productId: string; label?: string; className?: string }) {
  return <button className={className} type="button" onClick={() => {
    storage.track({ name: "product_alternative_opened", productId });
    window.dispatchEvent(new CustomEvent("musterring:alternatives", { detail: { productId } }));
  }}><Compass size={16} /> {label}</button>;
}

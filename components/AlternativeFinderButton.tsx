"use client";

import { Sparkles } from "lucide-react";
import { storage } from "@/lib/persistence";

export function AlternativeFinderButton({ productId, label = "Find a Better Match for Me", className = "button ghost" }: { productId: string; label?: string; className?: string }) {
  return <button className={className} type="button" onClick={() => {
    storage.track({ name: "product_alternative_opened", productId });
    window.dispatchEvent(new CustomEvent("musterring:alternatives", { detail: { productId } }));
  }}><Sparkles size={16} /> {label}</button>;
}

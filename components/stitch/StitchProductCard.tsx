"use client";

import Link from "next/link";
import Image from "@/components/HighQualityImage";
import { ArrowUpRight, Eye, GitCompare, MapPin, Settings } from "lucide-react";
import type { Product } from "@/lib/types";
import { dimensions } from "@/lib/format";
import { storage } from "@/lib/persistence";
import { productImages } from "@/lib/musterring-assets";
import { roomComposerUploadHref } from "@/lib/room-composer-selection";
import { AlternativeFinderButton } from "../AlternativeFinderButton";

export function StitchProductCard({ product, explanation, imageOverride, imageNote, showMeta = true, showCompare = true, compareSelected = false, onCompare }: { product: Product; explanation?: string; imageOverride?: string; imageNote?: string; showMeta?: boolean; showCompare?: boolean; compareSelected?: boolean; onCompare?: () => void }) {
  const image = imageOverride ?? productImages(product.id)[0];
  const isConfigurable = ["sofa", "sectional", "armchair"].includes(product.category);
  const canPlaceInRoom = ["sofa", "sectional", "armchair", "storage", "coffee-table"].includes(product.category);
  return (
    <article className="stitch-product-card">
      <Link className="stitch-product-image" href={`/furniture/${product.slug}`} aria-label={`View ${product.name}`} onClick={() => {
        storage.track({ name: "search_result_clicked", productId: product.id });
        if (explanation) storage.track({ name: "ai_recommendation_clicked", productId: product.id });
      }}>
        <Image
          src={image}
          alt={`${product.name} furniture photography`}
          width={900}
          height={675}
          sizes="(max-width: 760px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
        <span>View Details</span>
        {imageNote ? <small className="stitch-product-image-note">{imageNote}</small> : null}
      </Link>
      <div className="stitch-product-copy">
        <p className="stitch-eyebrow">{product.modelCode}</p>
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        {showMeta ? <p className="stitch-product-meta">
          {product.verifiedFacts.dimensions
            ? dimensions(product.widthMm, product.depthMm, product.heightMm)
            : "Product dimensions are configuration dependent"}
        </p> : null}
        {explanation ? <p className="stitch-product-explanation">{explanation}</p> : null}
        <div className="stitch-product-actions" aria-label="Product actions">
          <AlternativeFinderButton productId={product.id} label="Discover more" className="stitch-product-action-match" />
          {showCompare ? onCompare ? <button type="button" className={`stitch-product-action-compare${compareSelected ? " is-selected" : ""}`} onClick={onCompare}><GitCompare size={15} /> {compareSelected ? "Selected" : "Compare"}</button> : <Link className="stitch-product-action-compare" href={`/compare?ids=${product.id}`}><GitCompare size={15} /> Compare</Link> : null}
          {isConfigurable ? <Link className="stitch-product-action-configure" href="/handover"><Settings size={15} /> Plan with Retailer</Link> : null}
          {canPlaceInRoom ? <Link className={`stitch-product-action-room${isConfigurable ? "" : " stitch-product-action-wide"}`} href={roomComposerUploadHref([product.id])}><Eye size={15} /> Room Visualizer</Link> : null}
          {!canPlaceInRoom ? <Link className="stitch-product-action-details stitch-product-action-wide" href={`/furniture/${product.slug}`}><ArrowUpRight size={15} /> View Details</Link> : null}
          <Link className="stitch-product-action-dealer" href="/dealers"><MapPin size={15} /> Find Near You</Link>
        </div>
      </div>
    </article>
  );
}

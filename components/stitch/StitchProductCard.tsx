"use client";

import Link from "next/link";
import Image from "@/components/HighQualityImage";
import { Eye, GitCompare, MapPin, Settings, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { dimensions, formatEuro } from "@/lib/format";
import { storage } from "@/lib/persistence";
import { productImages } from "@/lib/musterring-assets";
import { useEffect, useState } from "react";
import { AlternativeFinderButton } from "../AlternativeFinderButton";

export function StitchProductCard({ product, explanation, imageOverride, imageNote }: { product: Product; explanation?: string; imageOverride?: string; imageNote?: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(storage.savedProducts().includes(product.id)), [product.id]);
  const image = imageOverride ?? productImages(product.id)[0];
  const isConfigurable = ["sofa", "sectional", "armchair"].includes(product.category);
  const canPlaceInRoom = ["sofa", "sectional", "armchair", "storage", "coffee-table"].includes(product.category);
  return (
    <article className="stitch-product-card">
      <Link className="stitch-product-image" href={`/furniture/${product.slug}`} aria-label={`View ${product.name}`} onClick={() => {
        storage.track({ name: "search_result_clicked", productId: product.id });
        if (explanation) storage.track({ name: "ai_recommendation_clicked", productId: product.id });
      }}>
        <Image src={image} alt={`${product.name} furniture photography`} width={900} height={675} sizes="(max-width: 760px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <span>View Details</span>
        {imageNote ? <small className="stitch-product-image-note">{imageNote}</small> : null}
      </Link>
      <div className="stitch-product-copy">
        <p className="stitch-eyebrow">{product.modelCode}</p>
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <p className="stitch-product-meta">
          {product.authorizedContent
            ? "Configuration-dependent dimensions · Price available from retailer"
            : `${dimensions(product.widthMm, product.depthMm, product.heightMm)} · Starting from ${formatEuro(product.indicativePriceCents)}`}
        </p>
        {explanation ? <p className="stitch-product-explanation">{explanation}</p> : null}
        <div className="stitch-product-actions" aria-label="Product actions">
          <button onClick={() => { setSaved(storage.toggleProduct(product.id).includes(product.id)); storage.track({ name: "product_saved", productId: product.id }); }}><Star size={15} /> {saved ? "Saved" : "Save to Project"}</button>
          <AlternativeFinderButton productId={product.id} label="Better Match" className="" />
          <Link href={`/compare?ids=${product.id}`}><GitCompare size={15} /> Compare</Link>
          {isConfigurable ? <Link href={`/configurator/${product.slug}`}><Settings size={15} /> Quick Configure</Link> : null}
          {canPlaceInRoom ? <Link href="/room-composer"><Eye size={15} /> See It in Your Room</Link> : null}
          <Link href="/dealers"><MapPin size={15} /> Find Near You</Link>
        </div>
      </div>
    </article>
  );
}

"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { CheckCircle2, ChevronDown, Download, Eye, FileText, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { storage } from "@/lib/persistence";
import { AlternativeFinderButton } from "./AlternativeFinderButton";

export function ProductGallery({ product, gallery }: { product: Product; gallery: string[] }) {
  const [selected, setSelected] = useState(gallery[0]);
  const selectedMedia = product.media?.images.find((image) => image.url === selected);
  return (
    <div className="stitch-detail-gallery">
      <div className="stitch-detail-main-image" aria-live="polite">
        <Image src={selected} alt={selectedMedia?.alt ?? `${product.name} ${product.category.replaceAll("-", " ")} product view`} width={1440} height={1080} priority />
      </div>
      <div className="stitch-detail-thumbs" aria-label="Product gallery thumbnails">
        {gallery.slice(0, 4).map((image, index) => (
          <button type="button" className={selected === image ? "is-active" : ""} key={image} onClick={() => setSelected(image)} aria-label={`Show ${product.name} image ${index + 1}`}>
            <Image src={image} alt="" width={420} height={280} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductDetailActions({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(storage.savedProducts().includes(product.id));
    storage.track({ name: "product_viewed", productId: product.id });
  }, [product.id]);
  const material = product.materials[0] ?? "";
  const toggleSaved = () => {
    const action = saved ? "remove" : "save";
    setSaved(storage.toggleProduct(product.id).includes(product.id));
    storage.track({ name: action === "save" ? "product_saved" : "product_removed", productId: product.id });
  };
  return (
    <div className="product-action-panel" aria-label="Product actions">
      <div className="product-primary-actions">
        <Link className="button primary" href="/handover">Plan with a Retailer</Link>
        <button className={`button product-save-action${saved ? " is-saved" : ""}`} type="button" aria-pressed={saved} onClick={toggleSaved}>
          {saved ? <CheckCircle2 aria-hidden="true" size={19} /> : <Star aria-hidden="true" size={18} />}
          <span aria-live="polite">{saved ? "Saved to My Project" : "Save to My Project"}</span>
        </button>
        <AlternativeFinderButton productId={product.id} />
      </div>
      <Link className="product-retailer-action" href={`/handover?product=${encodeURIComponent(product.id)}`}>
        <MapPin size={18} />
        <span><strong>Continue with a Musterring Retailer</strong><small>Take this product into a personal consultation</small></span>
      </Link>
      <details className="product-more-actions">
        <summary>More planning tools <ChevronDown size={18} /></summary>
        <div>
          <Link className="button ghost" href="/room-composer/upload"><Eye size={16} /> See It in Your Room</Link>
          <Link className="button ghost" href={`/compare?ids=${product.id}`}>Compare</Link>
          <Link className="button ghost" href={`/handover?request=material&product=${encodeURIComponent(product.id)}&material=${encodeURIComponent(material)}`}><FileText size={16} /> Request Material Sample</Link>
          <button className="button ghost" onClick={() => window.print()}><Download size={16} /> Print Product Summary</button>
          <Link className="button ghost" href="/dealers"><MapPin size={16} /> Check Showroom Availability</Link>
        </div>
      </details>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { dimensions } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { productImages } from "@/lib/musterring-assets";
import { ProductDetailActions, ProductGallery } from "@/components/ProductDetailClient";
import { completeTheRoom } from "@/lib/recommendations";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = completeTheRoom(product);
  const gallery = productImages(product.id);
  return (
    <div className="product-detail-page">
      <section className="product-detail-hero">
        <div className="product-detail-container">
          <nav className="product-breadcrumb" aria-label="Breadcrumb">
            <Link href="/furniture">Furniture</Link><span aria-hidden="true">/</span><span>{product.name}</span>
          </nav>
          <div className="product-detail-layout">
          <div className="product-gallery-column">
            <ProductGallery product={product} gallery={gallery} />
            <p className="product-gallery-note">Product gallery · 2D preview</p>
          </div>
          <div className="product-summary">
            <p className="eyebrow">{product.modelCode}</p>
            <h1>{product.name}</h1>
            <p className="product-subtitle">{product.subtitle}</p>
            <p className="product-description">{product.description}</p>
            {product.authorizedContent ? (
              <div className="product-planning-note">
                <strong>Planning information</strong>
                <p>{product.specificationNote}</p>
                {product.sourceUrl ? <a className="text-link" href={product.sourceUrl} target="_blank" rel="noreferrer">View official product information</a> : null}
              </div>
            ) : null}
            <ProductDetailActions product={product} />
            <div className="product-key-facts" aria-label="Key product facts">
              <div><span>Dimensions</span><strong>{product.verifiedFacts.dimensions ? dimensions(product.widthMm, product.depthMm, product.heightMm) : "Configuration dependent"}</strong></div>
              <div><span>Seats</span><strong>{product.numberOfSeatsVerified ? product.numberOfSeats : "Configuration dependent"}</strong></div>
              <div><span>Comfort</span><strong>{product.verifiedFacts.comfort ? product.comfortOptions.join(", ") : "Configuration dependent"}</strong></div>
            </div>
            <details className="product-specifications">
              <summary>View full specifications</summary>
              <div className="spec-list">
                <div><span>Seat height</span><strong>{product.verifiedFacts.seatHeight ? `${product.seatHeightMm} mm` : "Configuration dependent"}</strong></div>
                <div><span>Seat depth</span><strong>{product.verifiedFacts.seatDepth ? `${product.seatDepthMm} mm` : "Configuration dependent"}</strong></div>
                <div><span>Modules</span><strong>{product.verifiedFacts.modular ? "Modular configurations available" : "Configuration dependent"}</strong></div>
                <div><span>Armrests</span><strong>Configuration dependent</strong></div>
                <div><span>Feet</span><strong>Configuration dependent</strong></div>
                <div><span>Colors</span><strong>{product.verifiedFacts.colors.join(", ") || "Configuration dependent"}</strong></div>
                <div><span>Care</span><strong>See material care instructions and retailer documentation.</strong></div>
              </div>
            </details>
          </div>
          </div>
        </div>
      </section>
      <section className="product-planning-section">
        <div className="product-detail-container">
          <header><p className="eyebrow">Planning details</p><h2>Everything you need for the next step.</h2></header>
          <div className="product-planning-grid">
            <article><h3>Materials</h3><p>{product.verifiedFacts.materialTypes.length ? `Catalogue mentions ${product.verifiedFacts.materialTypes.join(" and ")} options. Specific covers remain configuration dependent.` : "Material options are configuration dependent."}</p></article>
            <article><h3>Functions</h3><p>{product.verifiedFacts.functions.length ? `Verified catalogue functions: ${product.verifiedFacts.functions.join(", ")}.` : "Functions are configuration dependent."}</p></article>
            <article><h3>Check your space</h3><p>Use the fit guide before confirming whether this product works in your room.</p><Link className="button ghost" href={`/will-it-fit/${product.slug}`}>Open “Will It Fit?”</Link></article>
          </div>
        </div>
      </section>
      <section className="product-related-section"><div className="product-detail-container"><p className="eyebrow">Products to consider</p><h2>Complete the room</h2><div className="grid grid-3">{related.map(({ product: item, reasons }) => <ProductCard key={item.id} product={item} explanation={`Recommended because: ${reasons.join("; ")}.`} />)}</div></div></section>
    </div>
  );
}

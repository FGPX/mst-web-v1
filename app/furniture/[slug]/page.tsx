import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { dimensions } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { productImages } from "@/lib/musterring-assets";
import { ProductDetailActions, ProductGallery } from "@/components/ProductDetailClient";
import { completeTheRoom } from "@/lib/recommendations";
import type { Metadata } from "next";
import type { Product } from "@/lib/types";
import { productBreadcrumbStructuredData, productStructuredData } from "@/lib/product-structured-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  const description = product.shortDescription || product.description;
  return {
    title: `${product.name} ${product.category.replaceAll("-", " ")} | Musterring`,
    description,
    alternates: { canonical: product.canonicalUrl ?? product.sourceUrl },
    openGraph: { title: `${product.name} | Musterring`, description, images: product.media?.primaryImage ? [product.media.primaryImage] : product.imageAssets.slice(0, 1), type: "website" }
  };
}

function specificationRows(product: Product) {
  const rows: Array<[string, string]> = [];
  const add = (label: string, value: unknown) => {
    if (value === null || value === undefined || value === "" || (Array.isArray(value) && !value.length)) return;
    rows.push([label, Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)]);
  };
  const specs = product.specifications;
  if (specs?.seating) {
    add("Seat firmness", product.comfortOptions.length ? product.comfortOptions : specs.seating.seatFirmnessOptions);
    add("Ergonomic sizes", specs.seating.ergonomicSizes);
    add("Electric recliner", product.verifiedFacts.functions.includes("electric") || specs.seating.electricRecliner);
    add("Manual recliner", product.verifiedFacts.functions.includes("relax") || specs.seating.manualRecliner);
    add("Adjustable headrest", specs.seating.headrestAdjustable);
    add("Adjustable seat depth", specs.seating.seatDepthAdjustable);
    add("Chaise available", specs.seating.chaiseAvailable);
    add("Footstool available", specs.seating.footstoolAvailable);
    add("Sofa-bed function", specs.seating.sofaBed);
    add("Integrated storage", specs.seating.integratedStorage);
  }
  if (specs?.bed) { add("Sleeping widths", specs.bed.sleepingWidthsMm.map((value) => `${value / 10} cm`)); add("Sleeping lengths", specs.bed.sleepingLengthsMm.map((value) => `${value / 10} cm`)); add("Bed types", specs.bed.bedType); add("Mattress firmness", specs.bed.mattressFirmnessOptions); add("Bed storage", specs.bed.bedStorage); add("Motorised adjustment", specs.bed.motorised); }
  if (specs?.wardrobe) { add("Door types", specs.wardrobe.doorType); add("Width options", specs.wardrobe.widthOptionsMm.map((value) => `${value / 10} cm`)); add("Height options", specs.wardrobe.heightOptionsMm.map((value) => `${value / 10} cm`)); add("Interior options", specs.wardrobe.interiorModules); add("Lighting option", specs.wardrobe.lightingOption); }
  if (specs?.table) { add("Tabletop shapes", specs.table.tabletopShape); add("Tabletop materials", specs.table.tabletopMaterials); add("Width options", specs.table.widthOptionsMm.map((value) => `${value / 10} cm`)); add("Extendable", specs.table.extendable); add("Capacity", specs.table.capacityVerified ? `${specs.table.capacityMin}–${specs.table.capacityMax} people` : "Not officially specified"); }
  if (specs?.diningChair) { add("Chair type", specs.diningChair.chairType); add("Armrests", specs.diningChair.armrests); add("Swivel", specs.diningChair.swivel); add("Upholstery available", specs.diningChair.upholsteryAvailable); }
  if (specs?.storage) { add("Storage types", specs.storage.storageType); add("Mounting", specs.storage.mountingType); add("Media compatible", specs.storage.mediaCompatible); add("Lighting available", specs.storage.lightingAvailable); add("Qi charging option", specs.storage.qiChargingAvailable); }
  if (specs?.outdoor) { add("Weather resistant", specs.outdoor.weatherResistant); add("Outdoor materials", specs.outdoor.outdoorMaterial); add("Frame", specs.outdoor.frameMaterial); add("Protective cover included", specs.outdoor.protectiveCoverIncluded); }
  if (specs?.carpet) { add("Shapes", specs.carpet.carpetShape); add("Composition", specs.carpet.composition); add("Easy care", specs.carpet.easyCare); add("Underfloor heating", specs.carpet.underfloorHeatingSuitable); }
  if (specs?.lamp) { add("Lamp type", specs.lamp.lampType); add("Output", specs.lamp.lumens ? `${specs.lamp.lumens} lm` : null); add("Power", specs.lamp.wattageW ? `${specs.lamp.wattageW} W` : null); add("Dimmable", specs.lamp.dimmable); add("USB-C", specs.lamp.usbC); }
  return rows;
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = completeTheRoom(product);
  const gallery = productImages(product.id);
  const structuredData = productStructuredData(product);
  const breadcrumbData = productBreadcrumbStructuredData(product);
  const categoryRows = specificationRows(product);
  const referenceDimensions = product.referenceConfiguration?.dimensions ?? product.dimensions;
  const displayedDimensions = product.verifiedFacts.dimensions
    ? dimensions(product.widthMm, product.depthMm, product.heightMm)
    : referenceDimensions
      ? `${dimensions(referenceDimensions.widthMm, referenceDimensions.depthMm, referenceDimensions.heightMm)} · reference`
      : "Configuration dependent";
  const displayedSeats = product.numberOfSeatsVerified
    ? String(product.numberOfSeats)
    : product.numberOfSeats > 0
      ? `${product.numberOfSeats}-seat reference`
      : "Programme dependent";
  const displayedComfort = product.verifiedFacts.comfort
    ? product.comfortOptions.join(", ")
    : product.comfortOptions.length
      ? `${product.comfortOptions.join(", ")} · presentation profile`
      : product.comfortProfile ?? "Configuration dependent";
  return (
    <div className="product-detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }} />
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
            <p className="product-gallery-note">{product.entityLevel === "programme" ? "Furniture programme · choose a configuration for final dimensions" : "Product"}</p>
            {product.authorizedContent ? (
              <div className="product-planning-note">
                <strong>Planning information</strong>
                <p>{product.specificationNote}</p>
                {product.sourceUrl ? <a className="text-link" href={product.sourceUrl} target="_blank" rel="noreferrer">View official product information</a> : null}
              </div>
            ) : null}
            <ProductDetailActions product={product} />
            <div className="product-key-facts" aria-label="Key product facts">
              <div><span>Dimensions</span><strong>{displayedDimensions}</strong></div>
              <div><span>Seats</span><strong>{displayedSeats}</strong></div>
              <div><span>Comfort</span><strong>{displayedComfort}</strong></div>
            </div>
            <details className="product-specifications">
              <summary>View full specifications</summary>
              <div className="spec-list">
                {product.specifications?.seating ? <>
                  <div><span>Seat height</span><strong>{product.verifiedFacts.seatHeight ? `${product.seatHeightMm} mm` : product.specifications.seating.seatHeightOptionsMm.length ? `${product.specifications.seating.seatHeightOptionsMm.join(" / ")} mm · reference` : "Programme dependent"}</strong></div>
                  <div><span>Seat depth</span><strong>{product.verifiedFacts.seatDepth ? `${product.seatDepthMm} mm` : product.specifications.seating.seatDepthOptionsMm.length ? `${product.specifications.seating.seatDepthOptionsMm.join(" / ")} mm · reference` : "Programme dependent"}</strong></div>
                  <div><span>Armrests</span><strong>{product.armrestOptions.join(", ") || "Standard armrest · presentation reference"}</strong></div>
                  <div><span>Feet</span><strong>{product.feetOptions.join(", ") || "Standard furniture feet · presentation reference"}</strong></div>
                </> : null}
                <div><span>Modules</span><strong>{product.availableComponents?.length ? product.availableComponents.join(", ") : product.modular ? "Modular configurations available" : "Fixed product reference"}</strong></div>
                <div><span>Colors</span><strong>{product.verifiedFacts.colors.join(", ") || `${product.colors.join(", ") || "category-appropriate colours"} · presentation palette`}</strong></div>
                <div><span>Materials</span><strong>{product.verifiedFacts.materialTypes.join(", ") || `${product.materialTypes?.join(", ") || product.primaryMaterial || "category-appropriate material"} · presentation profile`}</strong></div>
                <div><span>Functions</span><strong>{product.verifiedFacts.functions.join(", ") || product.functions.join(", ") || "Standard category functions · presentation profile"}</strong></div>
                <div><span>Care</span><strong>{product.specifications?.outdoor?.careInstructions || "Vacuum or wipe gently; confirm cover-specific care with the selected retailer."}</strong></div>
                <div><span>Brand</span><strong>{product.brand ?? "Musterring"}</strong></div>
                <div><span>Entity</span><strong>{product.entityLevel ?? "product"}</strong></div>
                <div><span>Available components</span><strong>{product.availableComponents?.join(", ") || "Configuration dependent"}</strong></div>
                <div><span>Included items</span><strong>{product.includedItems?.length ? product.includedItems.join(", ") : "Confirmed with the selected configuration"}</strong></div>
                {categoryRows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
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
            <article><h3>Materials</h3><p>{product.verifiedFacts.materialTypes.length ? `Catalogue mentions ${product.verifiedFacts.materialTypes.join(" and ")} options. Specific covers remain configuration dependent.` : `Presentation material profile: ${product.materialTypes?.join(", ") || product.primaryMaterial || "category-appropriate materials"}. Final cover or finish is selected with the retailer.`}</p></article>
            <article><h3>Functions</h3><p>{product.verifiedFacts.functions.length ? `Verified catalogue functions: ${product.verifiedFacts.functions.join(", ")}.` : `Presentation function profile: ${product.functions.join(", ") || product.useCases?.join(", ") || "standard category functions"}. Final functions depend on the selected configuration.`}</p></article>
            <article><h3>Check your space</h3><p>Use the fit guide before confirming whether this product works in your room.</p><Link className="button ghost" href={`/will-it-fit/${product.slug}`}>Open “Will It Fit?”</Link></article>
          </div>
        </div>
      </section>
      <section className="product-related-section"><div className="product-detail-container"><p className="eyebrow">Products to consider</p><h2>Complete the room</h2><div className="grid grid-3">{related.map(({ product: item, reasons }) => <ProductCard key={item.id} product={item} explanation={`Recommended because: ${reasons.join("; ")}.`} showCompare={false} />)}</div></div></section>
    </div>
  );
}

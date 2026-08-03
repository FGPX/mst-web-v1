import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, Search, Settings } from "lucide-react";
import { products } from "@/lib/data";
import { dimensions } from "@/lib/format";
import { productImages } from "@/lib/musterring-assets";

export default function PartnerProductsPage() {
  const activeProducts = products.filter((product) => product.active);
  return (
    <div className="partner-page">
      <header className="partner-page-head">
        <div><p>Verified catalogue</p><h1>Products</h1><span>Use product codes, validated dimensions and configuration eligibility during customer consultations.</span></div>
        <Link className="partner-secondary-action" href="/search"><Search size={17} /> Open guided search</Link>
      </header>
      <section className="partner-panel">
        <header><div><p>Available products</p><h2>{activeProducts.length} catalogue models</h2></div></header>
        <div className="partner-product-table">
          <div className="partner-product-table-head"><span>Product</span><span>Category</span><span>Dimensions</span><span>Planning</span><span>Actions</span></div>
          {activeProducts.map((product) => {
            const configurable = ["sofa", "armchair", "sectional"].includes(product.category);
            return (
              <article key={product.id}>
                <Image src={productImages(product.id)[0]} alt="" width={120} height={84} />
                <div><strong>{product.modelCode}</strong><small>{product.name}</small></div>
                <span>{product.category.replaceAll("-", " ")}</span>
                <span>{dimensions(product.widthMm, product.depthMm, product.heightMm)}</span>
                <span>{configurable ? "Configurable" : "Retailer planning"}</span>
                <div>
                  <Link href={`/furniture/${product.slug}`}>View <ArrowRight size={14} /></Link>
                  {configurable ? <Link href={`/partner/configurator/${product.slug}`}><Settings size={14} /> Configure</Link> : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

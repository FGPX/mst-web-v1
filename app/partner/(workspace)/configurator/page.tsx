import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Settings } from "lucide-react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";

export default function PartnerConfiguratorIndexPage() {
  const configurable = products.filter((product) => product.active && ["sofa", "armchair", "sectional"].includes(product.category));
  return (
    <div className="partner-page">
      <header className="partner-page-head">
        <div><p>Configuration workspace</p><h1>Choose a product to configure</h1><span>Every proposal is checked against the product rules currently available in the catalogue.</span></div>
      </header>
      <div className="partner-config-product-grid">
        {configurable.map((product) => (
          <Link href={`/partner/configurator/${product.slug}`} key={product.id}>
            <Image src={productImages(product.id)[0]} alt={product.name} width={520} height={340} />
            <span><small>{product.modelCode}</small><strong>{product.name}</strong></span>
            <em><Settings size={15} /> Configure <ArrowRight size={15} /></em>
          </Link>
        ))}
      </div>
    </div>
  );
}

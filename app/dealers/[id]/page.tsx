import Link from "next/link";
import { notFound } from "next/navigation";
import { dealers, products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export default async function DealerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dealer = dealers.find((item) => item.id === id);
  if (!dealer) notFound();
  return <section className="section"><div className="container"><p className="eyebrow">{dealer.city}</p><h1 className="h2">{dealer.name}</h1><p className="lead">{dealer.address}, {dealer.postcode} {dealer.city}. {dealer.openingHours}</p><div className="chips">{dealer.languages.map((item) => <span className="chip" key={item}>{item}</span>)}{dealer.services.map((item) => <span className="chip" key={item}>{item}</span>)}</div><h2>Showroom display products</h2><div className="grid grid-3">{products.filter((p) => dealer.displayProductIds.includes(p.id)).map((product) => <ProductCard key={product.id} product={product} />)}</div><Link className="button consult" href="/handover">Book a Consultation</Link></div></section>;
}

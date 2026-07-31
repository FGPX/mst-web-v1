import Link from "next/link";
import { ArrowRight, BookOpen, Download, FileImage, FileText, Headphones } from "lucide-react";

const resources = [
  { icon: FileText, title: "Price lists", text: "Authorized current and preliminary price documents.", status: "Connection required" },
  { icon: FileImage, title: "Image database", text: "Product, lifestyle and campaign assets with usage information.", status: "Connection required" },
  { icon: Download, title: "Marketing downloads", text: "Campaign material, brochures and point-of-sale resources.", status: "Connection required" },
  { icon: BookOpen, title: "Technical documents", text: "Assembly, care, guarantee and product documentation.", status: "Catalogue links available" }
];

export default function PartnerResourcesPage() {
  return (
    <div className="partner-page">
      <header className="partner-page-head">
        <div><p>Partner resources</p><h1>Documents and media</h1><span>One searchable location for the information partners need during sales and service.</span></div>
      </header>
      <div className="partner-resource-grid">
        {resources.map(({ icon: Icon, title, text, status }) => <article key={title}><Icon /><h2>{title}</h2><p>{text}</p><span>{status}</span></article>)}
      </div>
      <section className="partner-support-banner"><Headphones /><div><p>Partner support</p><h2>Need help with a product or customer project?</h2></div><Link href="/handover">Prepare support context <ArrowRight size={17} /></Link></section>
    </div>
  );
}

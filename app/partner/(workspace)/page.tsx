import Link from "next/link";
import { ArrowRight, Boxes, FileText, FolderKanban, PackageCheck, Plus, Settings, ShoppingCart } from "lucide-react";
import { products } from "@/lib/data";

export default function PartnerDashboardPage() {
  const activeProducts = products.filter((product) => product.active);
  const configurable = activeProducts.filter((product) => ["sofa", "armchair", "sectional"].includes(product.category));

  return (
    <div className="partner-page">
      <header className="partner-page-head">
        <div><p>Partner dashboard</p><h1>Good morning. What are you working on?</h1><span>Start a consultation or continue a customer project from one clear workspace.</span></div>
        <Link className="partner-primary-action" href="/partner/projects"><Plus size={18} /> Start customer project</Link>
      </header>

      <section className="partner-quick-actions" aria-label="Quick partner actions">
        <Link href="/partner/products"><Boxes /><span><strong>Find a product</strong><small>Search verified catalogue information</small></span><ArrowRight /></Link>
        <Link href="/partner/configurator"><Settings /><span><strong>Create configuration</strong><small>Build a rule-valid product proposal</small></span><ArrowRight /></Link>
        <Link href="/partner/projects"><FolderKanban /><span><strong>Continue a project</strong><small>Open customer selections and notes</small></span><ArrowRight /></Link>
        <Link href="/partner/quotes"><FileText /><span><strong>Prepare a quote</strong><small>Review project information first</small></span><ArrowRight /></Link>
      </section>

      <div className="partner-dashboard-grid">
        <section className="partner-panel">
          <header><div><p>Catalogue</p><h2>Product workspace</h2></div><Link href="/partner/products">View products <ArrowRight size={16} /></Link></header>
          <div className="partner-catalogue-summary">
            <article><strong>{activeProducts.length}</strong><span>Active catalogue models</span></article>
            <article><strong>{configurable.length}</strong><span>Configurable seating models</span></article>
            <article><strong>Validated</strong><span>Product rules remain enforced</span></article>
          </div>
        </section>
        <section className="partner-panel partner-commercial-status">
          <header><div><p>Commercial workspace</p><h2>Connection status</h2></div></header>
          <ul>
            <li><PackageCheck /><span><strong>Product catalogue</strong><small>Local validated data available</small></span><em>Ready</em></li>
            <li><FileText /><span><strong>Partner price lists</strong><small>Connect an authorized pricing source</small></span><em>Not connected</em></li>
            <li><ShoppingCart /><span><strong>Order submission</strong><small>ERP connection and confirmation required</small></span><em>Not connected</em></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

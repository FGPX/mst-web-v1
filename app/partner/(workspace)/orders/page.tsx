import { CheckCircle2, Link2, LockKeyhole, ShoppingCart } from "lucide-react";

export default function PartnerOrdersPage() {
  return (
    <div className="partner-page">
      <header className="partner-page-head">
        <div><p>Commercial workspace</p><h1>Orders</h1><span>Orders require authorized pricing, inventory and ERP validation before submission can be enabled.</span></div>
      </header>
      <section className="partner-panel partner-order-readiness">
        <header><div><p>Order readiness</p><h2>Production connection checklist</h2></div></header>
        <div>
          <article className="is-ready"><CheckCircle2 /><span><strong>Product rules</strong><small>Validated configuration logic is available.</small></span><em>Ready</em></article>
          <article><Link2 /><span><strong>Partner pricing</strong><small>Connect the authorized market and account price list.</small></span><em>Required</em></article>
          <article><Link2 /><span><strong>Inventory and lead time</strong><small>Connect an authoritative availability source.</small></span><em>Required</em></article>
          <article><LockKeyhole /><span><strong>ERP order submission</strong><small>Requires review, explicit confirmation, audit logging and duplicate protection.</small></span><em>Locked</em></article>
        </div>
        <aside><ShoppingCart /><div><h3>Order submission is safely disabled</h3><p>The portal will not invent availability, commercial pricing or order confirmation.</p></div></aside>
      </section>
    </div>
  );
}

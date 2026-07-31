import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, FolderKanban } from "lucide-react";

export default function PartnerQuotesPage() {
  return (
    <div className="partner-page">
      <header className="partner-page-head">
        <div><p>Commercial workspace</p><h1>Quotes</h1><span>Prepare a commercial proposal only after product, configuration and customer details are complete.</span></div>
      </header>
      <section className="partner-panel partner-guided-workflow">
        <header><div><p>Quote workflow</p><h2>From project to reviewed proposal</h2></div></header>
        <ol>
          <li className="is-ready"><span>1</span><div><strong>Select customer project</strong><small>Products and configurations provide the quote context.</small></div><CheckCircle2 /></li>
          <li><span>2</span><div><strong>Connect authorized pricing</strong><small>No partner prices are currently connected to this environment.</small></div></li>
          <li><span>3</span><div><strong>Review delivery and service</strong><small>Add only validated commercial options.</small></div></li>
          <li><span>4</span><div><strong>Customer approval</strong><small>Generate a reviewable proposal before creating an order.</small></div></li>
        </ol>
        <div className="partner-workflow-empty"><FileText /><div><h3>No quote can be generated yet</h3><p>Connect an authorized price source before enabling totals or customer-facing quote documents.</p></div><Link href="/partner/projects"><FolderKanban size={16} /> Review projects <ArrowRight size={15} /></Link></div>
      </section>
    </div>
  );
}

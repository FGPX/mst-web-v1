import { PartnerProjectsWorkspace } from "@/components/partner/PartnerProjectsWorkspace";

export default function PartnerProjectsPage() {
  return (
    <div className="partner-page">
      <header className="partner-page-head">
        <div><p>Customer workspace</p><h1>Projects</h1><span>Keep products, configurations, room concepts and consultation notes together.</span></div>
      </header>
      <PartnerProjectsWorkspace />
    </div>
  );
}

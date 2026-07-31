import { PartnerShell } from "@/components/partner/PartnerShell";
import { requirePartnerSession } from "@/lib/require-partner";

export const dynamic = "force-dynamic";

export default async function PartnerWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePartnerSession();
  return <PartnerShell email={session.email}>{children}</PartnerShell>;
}

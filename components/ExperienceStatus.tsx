import { Check, CircleAlert, Database, Sparkles } from "lucide-react";

export type ExperienceStatusKind = "real-ai" | "deterministic" | "external" | "validated" | "concept";

const statusCopy: Record<ExperienceStatusKind, { label: string; icon: typeof Check }> = {
  "real-ai": { label: "Real AI provider active", icon: Sparkles },
  deterministic: { label: "Local deterministic demo provider active", icon: Check },
  external: { label: "External integration required", icon: CircleAlert },
  validated: { label: "Validated catalogue data", icon: Database },
  concept: { label: "Concept data", icon: CircleAlert }
};

export function ExperienceStatus({ kind, detail }: { kind: ExperienceStatusKind; detail?: string }) {
  const status = statusCopy[kind];
  const Icon = status.icon;
  return <span className={`experience-status is-${kind}`}><Icon size={14} /><span>{status.label}</span>{detail ? <small>{detail}</small> : null}</span>;
}

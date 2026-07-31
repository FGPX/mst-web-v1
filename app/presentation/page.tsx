import { PresentationClient } from "@/components/PresentationClient";

export default function PresentationPage() {
  const realAiActive = process.env.AI_ENABLED !== "false"
    && process.env.AI_PROVIDER === "openai"
    && Boolean(process.env.OPENAI_API_KEY);
  return <PresentationClient realAiActive={realAiActive} />;
}

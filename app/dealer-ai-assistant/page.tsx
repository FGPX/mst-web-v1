import type { Metadata } from "next";
import { DealerAiAssistantClient } from "@/components/DealerAiAssistantClient";

export const metadata: Metadata = {
  title: "Dealer AI Assistant | Musterring",
  description: "A catalogue-grounded workspace for reviewing customer projects and preparing retailer consultations."
};

export default function DealerAiAssistantPage() {
  return <DealerAiAssistantClient />;
}

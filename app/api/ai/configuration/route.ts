import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withDemoFallback } from "@/lib/ai/providers";
import { buildGroundedConfiguration } from "@/lib/ai/configuration";

const requestSchema = z.object({ request: z.string().trim().min(3).max(1000) });

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Describe the configuration you need." }, { status: 400 });
  const requirements = await withDemoFallback((provider) => provider.suggestConfigurationRequirements(parsed.data.request));
  const proposal = buildGroundedConfiguration(requirements.data);
  return NextResponse.json({
    requirements: requirements.data,
    product: proposal.product,
    configuration: proposal.configuration,
    validation: proposal.validation,
    corrections: proposal.correctionNotes,
    ai: { provider: requirements.provider, fallback: requirements.fallback, mode: requirements.provider === "openai" ? "Provider-backed AI interpretation" : "Deterministic demo interpretation" },
    calculationMode: "Deterministic catalogue rules"
  });
}


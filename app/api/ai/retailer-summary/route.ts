import { NextRequest, NextResponse } from "next/server";
import { groundProjectData } from "@/lib/ai/grounding";
import { withDemoFallback } from "@/lib/ai/providers";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  try {
    const grounded = groundProjectData(body);
    const generated = await withDemoFallback((provider) => provider.summarizeRetailerProject(grounded.project, grounded.groundedFacts));
    return NextResponse.json({
      summary: generated.data,
      projectData: grounded.project,
      ai: { provider: generated.provider, fallback: generated.fallback, mode: generated.provider === "openai" ? "Provider-backed grounded summary" : "Deterministic demo summary" }
    });
  } catch {
    return NextResponse.json({ error: "Invalid structured project data." }, { status: 400 });
  }
}


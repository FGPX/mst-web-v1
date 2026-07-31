import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, handoverRequestSchema } from "@/lib/server-validation";

export async function POST(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for") ?? "local-demo";
  const rate = checkRateLimit(`handover:${key}`, 8);
  if (!rate.allowed) return NextResponse.json({ ok: false, error: "Too many requests. Try again shortly." }, { status: 429 });
  const body = await request.json().catch(() => null);
  const parsed = handoverRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  return NextResponse.json({
    ok: true,
    mode: "DEMO_MODE",
    reference: `MR-DEMO-${Date.now().toString().slice(-6)}`,
    request: parsed.data
  });
}

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, uploadMetadataSchema } from "@/lib/server-validation";

export async function POST(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for") ?? "local-demo";
  const rate = checkRateLimit(`upload:${key}`, 20);
  if (!rate.allowed) return NextResponse.json({ ok: false, error: "Too many validation requests." }, { status: 429 });
  const body = await request.json().catch(() => null);
  const parsed = uploadMetadataSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Unsafe or invalid upload metadata.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  return NextResponse.json({ ok: true, mode: "DEMO_MODE", metadata: parsed.data });
}

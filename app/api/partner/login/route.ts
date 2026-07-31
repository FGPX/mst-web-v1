import { NextResponse } from "next/server";
import { authenticatePartner, partnerAuthConfigured, setPartnerSession } from "@/lib/partner-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  if (!partnerAuthConfigured()) {
    return NextResponse.redirect(new URL("/partner/login?error=configuration", request.url), 303);
  }
  if (!authenticatePartner(email, password)) {
    return NextResponse.redirect(new URL("/partner/login?error=credentials", request.url), 303);
  }

  await setPartnerSession(email);
  return NextResponse.redirect(new URL("/partner", request.url), 303);
}

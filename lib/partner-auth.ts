import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const partnerCookie = "musterring_partner_session";
const sessionLifetimeSeconds = 60 * 60 * 8;

type PartnerSession = {
  email: string;
  role: "partner-admin";
  expiresAt: number;
};

function sessionSecret() {
  return process.env.PARTNER_SESSION_SECRET ?? "";
}

function signature(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function safelyEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function partnerAuthConfigured() {
  return Boolean(process.env.PARTNER_EMAIL && process.env.PARTNER_PASSWORD && sessionSecret());
}

export function authenticatePartner(email: string, password: string) {
  if (!partnerAuthConfigured()) return false;
  return safelyEqual(email.trim().toLowerCase(), process.env.PARTNER_EMAIL!.trim().toLowerCase())
    && safelyEqual(password, process.env.PARTNER_PASSWORD!);
}

export function createPartnerSession(email: string) {
  const payload: PartnerSession = {
    email: email.trim().toLowerCase(),
    role: "partner-admin",
    expiresAt: Date.now() + sessionLifetimeSeconds * 1000
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export async function readPartnerSession(): Promise<PartnerSession | null> {
  if (!sessionSecret()) return null;
  const value = (await cookies()).get(partnerCookie)?.value;
  if (!value) return null;
  const [encoded, providedSignature] = value.split(".");
  if (!encoded || !providedSignature || !safelyEqual(signature(encoded), providedSignature)) return null;
  try {
    const session = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as PartnerSession;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export async function setPartnerSession(email: string) {
  (await cookies()).set(partnerCookie, createPartnerSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionLifetimeSeconds
  });
}

export async function clearPartnerSession() {
  (await cookies()).set(partnerCookie, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });
}

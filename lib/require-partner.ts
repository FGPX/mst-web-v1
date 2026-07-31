import "server-only";
import { redirect } from "next/navigation";
import { readPartnerSession } from "./partner-auth";

export async function requirePartnerSession() {
  const session = await readPartnerSession();
  if (!session) redirect("/partner/login");
  return session;
}

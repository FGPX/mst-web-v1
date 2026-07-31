"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dealers } from "@/lib/data";
import { storage } from "@/lib/persistence";

export function ConfirmationClient() {
  const [lead, setLead] = useState<Record<string, unknown> | null>(null);
  useEffect(() => setLead(storage.lastLead()), []);
  const dealer = dealers.find((item) => item.id === lead?.dealerId) ?? dealers[0];
  const project = lead?.project as { productIds?: string[]; configurationIds?: string[]; roomScenes?: Array<{ name?: string }> } | undefined;
  return <section className="section"><div className="container"><p className="eyebrow">Demo-mode confirmation</p><h1 className="h2">Your project request is ready for {dealer.name}.</h1><div className="card card-body"><p><strong>Reference number:</strong> {String(lead?.reference ?? "MR-DEMO-PENDING")}</p><p><strong>Retailer:</strong> {dealer.name}, {dealer.city}</p><p><strong>Request type:</strong> {String(lead?.requestType ?? "Demo request")}</p><p><strong>Products:</strong> {project?.productIds?.join(", ") || "No saved Product IDs"}</p><p><strong>Configuration ID:</strong> {project?.configurationIds?.join(", ") || "No saved configuration"}</p><p><strong>Room scene:</strong> {project?.roomScenes?.at(-1)?.name ?? "No saved room scene"}</p><p><strong>Appointment preference:</strong> {String(lead?.appointment ?? "To be confirmed")}</p><p><strong>Expected next step:</strong> This concept stores the request locally. Production delivery and appointment confirmation require Musterring CRM, email and booking integration.</p></div><div className="chips"><Link className="button primary" href="/my-musterring">View in My Musterring</Link><button className="button ghost" onClick={() => window.print()}>Download Project Summary</button><Link className="button ghost" href="/dealers">Select Alternative Retailer</Link></div></div></section>;
}

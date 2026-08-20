"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, Bot, Check, CheckCircle2, Clock, FileText, Mail, MapPin, PackageCheck, Send, ShieldCheck, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { dealers, materials, products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import { normalizeAppointmentDescription } from "@/lib/appointment";
import type { AdvisorAnswer, ConversationContext } from "@/lib/ai/assistant-schemas";

type DealerMessage = { role: "dealer" | "assistant"; text: string; answer?: AdvisorAnswer };
type Lead = Record<string, unknown> & {
  reference?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  requestType?: string;
  dealerId?: string;
  appointment?: string;
  project?: {
    consultationSummary?: string;
    productIds?: string[];
    materialIds?: string[];
    configurationIds?: string[];
    roomScenes?: unknown[];
    fitReports?: unknown[];
    advisorProjectBrief?: { customerRequests?: string[] } | null;
  };
};

const quickQuestions = [
  "Summarize the customer's priorities",
  "Which saved products should I discuss first?",
  "What still needs retailer confirmation?",
  "Prepare consultation talking points"
];

function conversationRequestsFromSession() {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem("musterring.assistantConversation") ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const message = entry as { role?: unknown; text?: unknown };
      if (message.role !== "customer" || typeof message.text !== "string") return [];
      const text = message.text.trim();
      if (text.length <= 8 || /^(?:hello|hi|thanks|thank you|okay|yes|no)[.!\s]*$/i.test(text)) return [];
      if (/^(?:my room photo|product inspiration):/i.test(text) || /^save\b.*\bproject\b/i.test(text)) return [];
      return [text];
    }))].slice(-8);
  } catch {
    return [];
  }
}

export function DealerAiAssistantClient() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [roomViews, setRoomViews] = useState(0);
  const [fitReports, setFitReports] = useState(0);
  const [messages, setMessages] = useState<DealerMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendMessage, setSendMessage] = useState("");

  useEffect(() => {
    const savedLead = storage.lastLead() as Lead | null;
    const savedIds = [...new Set([...(savedLead?.project?.productIds ?? []), ...storage.savedProducts()])]
      .filter((id) => products.some((product) => product.active && product.id === id));
    setLead(savedLead);
    setProductIds(savedIds);
    setRoomViews(savedLead?.project?.roomScenes?.length ?? storage.roomScenes().length);
    setFitReports(savedLead?.project?.fitReports?.length ?? storage.fitReports().length);
  }, []);

  const selectedProducts = useMemo(() => products.filter((product) => productIds.includes(product.id)), [productIds]);
  const dealer = dealers.find((candidate) => candidate.id === (lead?.dealerId ?? storage.selectedDealer())) ?? dealers[0];
  const projectSummary = lead?.project?.consultationSummary
    ?? (selectedProducts.length
      ? `Customer selected ${selectedProducts.map((product) => product.modelCode).join(", ")}. Retailer confirmation is required for price, availability, final configuration and physical fit.`
      : "No confirmed customer handover has been received yet. The assistant can review locally saved project context only.");

  const ask = async (question = input) => {
    const clean = question.trim();
    if (!clean || pending) return;
    setMessages((current) => [...current, { role: "dealer", text: clean }]);
    setInput("");
    setPending(true);
    const recentMessages = [...messages, { role: "dealer" as const, text: clean }].slice(-8).map((message) => ({
      role: message.role === "dealer" ? "customer" as const : "advisor" as const,
      text: message.text
    }));
    const context: ConversationContext = {
      route: "/dealer-ai-assistant",
      referencedProductIds: productIds,
      selectedMaterialIds: storage.savedMaterials(),
      currentFilters: {},
      approvedPreferences: {},
      recentMessages
    };
    const response = await fetch("/api/ai/advisor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: clean, context })
    }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    setPending(false);
    if (!response?.ok || !payload?.answer) {
      setMessages((current) => [...current, { role: "assistant", text: payload?.error ?? "Dealer AI is temporarily unavailable. No project data has changed." }]);
      return;
    }
    setMessages((current) => [...current, { role: "assistant", text: payload.answer.answer, answer: payload.answer }]);
  };

  const prepareEmail = () => {
    const customer = lead?.name || "Customer";
    const draft = storage.consultationDraft();
    const appointment = normalizeAppointmentDescription(lead?.appointment) || normalizeAppointmentDescription(draft
      ? `${draft.appointmentMode} · ${draft.appointmentDate || "date to confirm"} · ${draft.preferredTime}`
      : "To be confirmed");
    const brief = lead?.project?.advisorProjectBrief ?? storage.advisorProjectBrief();
    const requests = brief?.customerRequests?.filter(Boolean).length
      ? brief.customerRequests.filter(Boolean)
      : conversationRequestsFromSession();
    const selectedMaterialIds = [...new Set([...(lead?.project?.materialIds ?? []), ...storage.savedMaterials()])];
    const selectedMaterials = materials.filter((material) => selectedMaterialIds.includes(material.id));
    const configurationIds = new Set(lead?.project?.configurationIds ?? []);
    const configurations = storage.configurations().filter((configuration) => !configurationIds.size || configurationIds.has(configuration.id));
    const requestSection = [
      "WHAT THE CUSTOMER ASKED FOR",
      ...(requests.length ? requests.map((request) => `- ${request}`) : [lead?.message ? `- ${lead.message}` : "- No separate chatbot request was saved."])
    ].join("\n");
    const selectionSection = [
      "WHAT THE CUSTOMER SELECTED",
      "Products:",
      ...(selectedProducts.length ? selectedProducts.map((product) => {
        const dimensions = product.verifiedFacts.dimensions
          ? `${Math.round(product.widthMm / 10)} × ${Math.round(product.depthMm / 10)} × ${Math.round(product.heightMm / 10)} cm (verified catalogue dimensions)`
          : "dimensions depend on the final configuration";
        return `- ${product.modelCode} — ${product.name} (${product.category}); ${dimensions}`;
      }) : ["- No products saved"]),
      "Materials:",
      ...(selectedMaterials.length ? selectedMaterials.map((material) => `- ${material.name} (${material.type}, ${material.colorFamily})`) : ["- No material selected"]),
      "Configurations:",
      ...(configurations.length ? configurations.map((configuration) => {
        const product = products.find((candidate) => candidate.id === configuration.productId);
        const material = materials.find((candidate) => candidate.id === configuration.materialId);
        return `- ${configuration.id}: ${product?.modelCode ?? configuration.productId}; ${material?.name ?? configuration.materialId}; ${configuration.color}; ${Math.round(configuration.dimensions.widthMm / 10)} × ${Math.round(configuration.dimensions.depthMm / 10)} × ${Math.round(configuration.dimensions.heightMm / 10)} cm (saved configuration)`;
      }) : ["- No saved configuration"]),
      `Saved room visualizations: ${roomViews}`,
      `Saved fit reports: ${fitReports}`
    ].join("\n");
    setEmailDraft([
      `New Musterring consultation handover${lead?.reference ? ` · ${lead.reference}` : ""}`,
      "",
      `Customer: ${customer}`,
      `Request: ${lead?.requestType ?? "Retailer consultation"}`,
      `Appointment preference: ${appointment}`,
      "",
      requestSection,
      "",
      selectionSection,
      "",
      "PROJECT SUMMARY",
      projectSummary,
      "",
      "CUSTOMER NOTES",
      lead?.message || "No additional notes.",
      "",
      "Price, availability, final configuration, delivery feasibility, physical fit and appointment time require retailer confirmation."
    ].join("\n"));
    setSendState("idle");
    setSendMessage("");
  };

  const sendEmail = async () => {
    setConfirmEmail(false);
    setSendState("sending");
    const response = await fetch("/api/dealer-assistant/send-email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        confirmed: true,
        subject: `Musterring consultation handover${lead?.reference ? ` · ${lead.reference}` : ""}`,
        text: emailDraft,
        ...(typeof lead?.email === "string" ? { replyTo: lead.email } : {})
      })
    }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.delivered) {
      setSendState("error");
      setSendMessage(payload?.error ?? "The retailer email could not be delivered.");
      return;
    }
    const provider = payload.provider === "smtp" ? "smtp" as const : "resend" as const;
    const delivery = { id: String(payload.id), provider, dealerId: dealer.id, deliveredAt: new Date().toISOString() };
    storage.saveRetailerEmailDelivery(delivery);
    window.dispatchEvent(new CustomEvent("musterring:retailer-email-sent", { detail: delivery }));
    setSendState("sent");
    setSendMessage(`The confirmed handover email was delivered to ${dealer.name} through ${provider.toUpperCase()}.`);
  };

  return <div className="dealer-ai-page">
    <section className="dealer-ai-hero">
      <div className="container">
        <div><p className="eyebrow">Musterring partner intelligence</p><h1>Dealer AI<br /><em>Consultation Copilot</em></h1><p>Turn every confirmed customer handover into a prepared, catalogue-grounded consultation—without losing the human relationship.</p><div className="dealer-ai-hero-actions"><a href="#dealer-workspace">Open project workspace <ArrowRight /></a><Link href="/partner/login">Partner portal</Link></div></div>
        <div className="dealer-ai-hero-card"><span><Sparkles /> Live project brief</span><strong>{lead?.reference ?? "Awaiting confirmed handover"}</strong><p>{projectSummary}</p><div><small>Selected retailer</small><b>{dealer.name}</b></div></div>
      </div>
    </section>

    <section className="dealer-ai-trust"><div className="container"><span><ShieldCheck /> Catalogue grounded</span><span><CheckCircle2 /> Configuration rules respected</span><span><UserRound /> Human approval before sending</span><span><PackageCheck /> Complete project context</span></div></section>

    <section className="container dealer-ai-workspace" id="dealer-workspace">
      <aside className="dealer-ai-context">
        <div className="dealer-ai-section-head"><span>Customer handover</span><strong>{lead ? "Received" : "Demo context"}</strong></div>
        <div className="dealer-ai-customer"><span><UserRound /></span><div><small>Customer</small><strong>{lead?.name ?? "Living Room Project"}</strong><p>{lead?.requestType ?? "Interior consultation"}</p></div></div>
        <dl><div><dt><PackageCheck /> Products</dt><dd>{selectedProducts.length}</dd></div><div><dt><FileText /> Room views</dt><dd>{roomViews}</dd></div><div><dt><ShieldCheck /> Fit reports</dt><dd>{fitReports}</dd></div></dl>
        <div className="dealer-ai-retailer"><MapPin /><span><small>Assigned retailer</small><strong>{dealer.name}</strong><em>{dealer.city} · {dealer.distanceKm} km listed distance</em></span></div>
        <div className="dealer-ai-summary"><small>AI consultation brief</small><p>{projectSummary}</p></div>
      </aside>

      <section className="dealer-ai-chat">
        <header><div><span><Bot /></span><div><strong>Project Assistant</strong><small>Grounded in the saved Musterring catalogue</small></div></div><em>AI online</em></header>
        <div className="dealer-ai-chat-body">
          {!messages.length ? <div className="dealer-ai-welcome"><Sparkles /><h2>Ready for the consultation</h2><p>Ask about verified products, saved decisions, missing information or the next retailer action.</p><div>{quickQuestions.map((question) => <button key={question} onClick={() => void ask(question)}>{question}<ArrowRight /></button>)}</div></div> : null}
          {messages.map((message, index) => <article className={message.role} key={`${message.role}-${index}`}><small>{message.role === "dealer" ? "You" : "Dealer AI"}</small><p>{message.text}</p>{message.answer?.productIds.length ? <div className="dealer-ai-answer-products">{message.answer.productIds.slice(0, 3).map((id) => { const product = products.find((candidate) => candidate.id === id); return product ? <Link href={`/furniture/${product.slug}`} key={id}>{product.modelCode}<ArrowRight /></Link> : null; })}</div> : null}</article>)}
          {pending ? <p className="dealer-ai-thinking"><Sparkles /> Checking validated project and catalogue data…</p> : null}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); void ask(); }}><input aria-label="Ask Dealer AI about this customer project" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about this project…" /><button disabled={pending} aria-label="Send question"><Send /></button></form>
      </section>

      <aside className="dealer-ai-actions">
        <div className="dealer-ai-section-head"><span>Consultation readiness</span><strong>{selectedProducts.length ? "Prepared" : "Needs input"}</strong></div>
        <ul><li><Check /> Customer intent summarized</li><li><Check /> Catalogue products validated</li><li><Check /> Room context attached</li><li className={fitReports ? "" : "is-warning"}>{fitReports ? <Check /> : <Clock />} Physical fit {fitReports ? "report available" : "still open"}</li></ul>
        <div className="dealer-ai-product-strip">{selectedProducts.slice(0, 3).map((product) => <Link href={`/furniture/${product.slug}`} key={product.id}><Image src={productImages(product.id)[0]} alt={product.name} width={180} height={120} /><span>{product.modelCode}</span></Link>)}</div>
        <section className="dealer-ai-email"><div><Mail /><span><strong>Retailer handover email</strong><small>Review every detail before delivery</small></span></div>{emailDraft ? <textarea aria-label="Retailer email draft" value={emailDraft} onChange={(event) => setEmailDraft(event.target.value)} /> : <p>Create a complete draft from confirmed contact data, saved products, room views, fit notes and appointment preference.</p>}<button onClick={emailDraft ? () => setConfirmEmail(true) : prepareEmail}>{emailDraft ? <><Send /> Review &amp; send</> : <><Sparkles /> Prepare email draft</>}</button>{sendMessage ? <p className={`dealer-ai-send-state is-${sendState}`}>{sendMessage}</p> : null}</section>
      </aside>
    </section>

    {confirmEmail ? <div className="dealer-ai-modal" role="dialog" aria-modal="true" aria-labelledby="dealer-email-title"><section><button aria-label="Close email confirmation" onClick={() => setConfirmEmail(false)}><X /></button><Mail /><h2 id="dealer-email-title">Send this retailer handover?</h2><p>The complete project summary and confirmed customer details will be delivered to the server-configured retailer mailbox.</p><small>Nothing is sent until you confirm. Price, availability, fit and appointment time remain retailer decisions.</small><div><button onClick={() => setConfirmEmail(false)}>Cancel</button><button onClick={() => void sendEmail()}>Confirm &amp; send email</button></div></section></div> : null}
  </div>;
}

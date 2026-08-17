"use client";

import Image from "@/components/HighQualityImage";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Check, Mic, MicOff, Send, Sparkles, Trash2, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { materials, products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { AdvisorAction, AdvisorAnswer, ConversationContext, VoiceCommand } from "@/lib/ai/assistant-schemas";

type Message = { role: "customer" | "advisor"; text: string; answer?: AdvisorAnswer };
const memoryKey = "musterring.assistantContext";

function starters(pathname: string) {
  if (pathname.includes("configurator")) return ["Build a configuration from my needs", "Explain why this option is unavailable", "Suggest a compatible material", "Reduce the total width"];
  if (pathname.includes("room-composer")) return ["Add matching products", "Improve walking space", "Create a warmer style", "Prepare this room for a retailer"];
  if (pathname.includes("my-musterring")) return ["What is missing from my project?", "Summarize my decisions", "Suggest my next step", "Prepare this project for a retailer"];
  if (pathname.includes("/furniture/")) return ["Find a smaller alternative", "Explain the configuration options", "Which material is best for a family?", "Add this to my project"];
  return ["Help me find the right sofa", "Plan a room", "Choose a material", "Find a retailer"];
}

function productFromPath(pathname: string) {
  const slug = pathname.match(/^\/furniture\/([^/?#]+)/)?.[1] ?? pathname.match(/^\/configurator\/([^/?#]+)/)?.[1];
  return products.find((product) => product.slug === slug);
}

export function MusterringAdvisor() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [pendingAction, setPendingAction] = useState<AdvisorAction | null>(null);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "processing" | "recognized" | "error" | "denied">("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [muted, setMuted] = useState(true);
  const [context, setContext] = useState<ConversationContext>({ route: pathname, referencedProductIds: [], selectedMaterialIds: [], currentFilters: {}, approvedPreferences: {} });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentProduct = productFromPath(pathname);
  useEffect(() => {
    const stored = window.sessionStorage.getItem(memoryKey);
    if (stored) {
      try { setContext({ ...JSON.parse(stored), route: pathname, currentProductId: currentProduct?.id ?? null }); } catch { /* discard malformed session data */ }
    } else setContext((current) => ({ ...current, route: pathname, currentProductId: currentProduct?.id ?? null }));
  }, [pathname, currentProduct?.id]);
  useEffect(() => {
    window.sessionStorage.setItem(memoryKey, JSON.stringify(context));
  }, [context]);
  useEffect(() => {
    const show = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: "voice"; prompt?: string }>).detail;
      setOpen(true);
      storage.track({ name: "chatbot_opened", route: pathname });
      if (detail?.prompt) setInput(detail.prompt);
      if (detail?.mode === "voice") window.setTimeout(() => void startVoice(), 50);
      else window.setTimeout(() => inputRef.current?.focus(), 0);
    };
    window.addEventListener("musterring:advisor", show);
    return () => window.removeEventListener("musterring:advisor", show);
  });
  useEffect(() => {
    if (!open) return;
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        const focusable = document.querySelectorAll<HTMLElement>(".advisor-panel button:not([disabled]), .advisor-panel a, .advisor-panel textarea");
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  const speak = (text: string) => {
    if (muted || !voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text.slice(0, 500)));
  };
  const ask = async (question = input) => {
    const clean = question.trim();
    if (!clean) return;
    setMessages((current) => [...current, { role: "customer", text: clean }]);
    setInput(""); setPending(true);
    storage.track({ name: "chatbot_question_submitted" });
    const response = await fetch("/api/ai/advisor", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: clean, context: { ...context, route: pathname, currentProductId: currentProduct?.id ?? context.currentProductId } }) }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    setPending(false);
    if (!response?.ok || !payload?.answer) {
      setMessages((current) => [...current, { role: "advisor", text: "The Product Advisor is temporarily unavailable. Your saved project has not changed." }]);
      return;
    }
    const answer = payload.answer as AdvisorAnswer;
    setMessages((current) => [...current, { role: "advisor", text: answer.answer, answer }]);
    setContext((current) => ({ ...current, referencedProductIds: answer.productIds.length ? answer.productIds : current.referencedProductIds }));
    if (answer.productIds.length) storage.track({ name: "chatbot_product_recommended", productId: answer.productIds[0] });
    if (answer.proposedAction) storage.track({ name: "chatbot_action_proposed" });
    speak(answer.answer);
  };
  const actionRoute = (action: AdvisorAction) => {
    const values = action.parameters;
    if (action.type === "SEARCH_PRODUCTS") return `/search?q=${encodeURIComponent(String(values.query ?? ""))}`;
    if (action.type === "COMPARE_PRODUCTS") return `/compare?ids=${(values.productIds as string[] ?? []).join(",")}`;
    if (action.type === "OPEN_PRODUCT") return `/furniture/${String(values.slug ?? "")}`;
    if (action.type === "CONFIGURE_PRODUCT") return `/configurator/${String(values.slug ?? currentProduct?.slug ?? "")}`;
    if (action.type === "OPEN_ROOM_COMPOSER") return "/room-composer";
    if (action.type === "OPEN_FIT_CHECK") return `/will-it-fit/${String(values.slug ?? currentProduct?.slug ?? "")}`;
    if (action.type === "FIND_RETAILER") return "/dealers";
    if (action.type === "PREPARE_HANDOVER" || action.type === "BOOK_CONSULTATION") return "/handover";
    if (action.type === "SHOW_MATERIALS") return `/materials?advisor=${encodeURIComponent(String(values.query ?? ""))}`;
    return "";
  };
  const execute = (action: AdvisorAction) => {
    if (action.type === "SAVE_PRODUCT") {
      const id = String(action.parameters.productId ?? "");
      if (products.some((product) => product.id === id) && !storage.savedProducts().includes(id)) storage.toggleProduct(id);
      setMessages((current) => [...current, { role: "advisor", text: "The catalogue product was saved to My Musterring." }]);
    } else if (action.type === "SHOW_ALTERNATIVES") {
      window.dispatchEvent(new CustomEvent("musterring:alternatives", { detail: { productId: String(action.parameters.productId), requestText: String(action.parameters.requestText ?? "") } }));
      setOpen(false);
    } else {
      if (action.type === "PREPARE_HANDOVER") storage.track({ name: "chatbot_retailer_handover_started", actionType: action.type });
      const route = actionRoute(action);
      if (route) router.push(route);
    }
    storage.track({ name: "chatbot_action_confirmed" });
    setPendingAction(null);
  };
  const propose = (action: AdvisorAction) => {
    if (action.requiresConfirmation) setPendingAction(action);
    else execute(action);
  };
  const handleVoiceCommand = (command: VoiceCommand, transcript: string) => {
    setVoiceState("recognized");
    storage.track({ name: "voice_command_recognized" });
    const answerInsideChat = ["SEARCH_PRODUCTS", "FILTER_PRODUCTS", "COMPARE_PRODUCTS", "ASK_PRODUCT_QUESTION"].includes(command.intent);
    if (answerInsideChat) {
      void ask(transcript);
      return;
    }
    const map: Record<VoiceCommand["intent"], AdvisorAction["type"]> = {
      SEARCH_PRODUCTS: "SEARCH_PRODUCTS", FILTER_PRODUCTS: "SEARCH_PRODUCTS", OPEN_PRODUCT: "OPEN_PRODUCT",
      COMPARE_PRODUCTS: "COMPARE_PRODUCTS", CONFIGURE_PRODUCT: "CONFIGURE_PRODUCT", CHANGE_MATERIAL: "SHOW_MATERIALS",
      SAVE_TO_PROJECT: "SAVE_PRODUCT", ADD_COMPLEMENTARY_PRODUCT: "SEARCH_PRODUCTS", OPEN_ROOM_COMPOSER: "OPEN_ROOM_COMPOSER",
      OPEN_FIT_CHECK: "OPEN_FIT_CHECK", FIND_RETAILER: "FIND_RETAILER", BOOK_CONSULTATION: "BOOK_CONSULTATION",
      ASK_PRODUCT_QUESTION: "SEARCH_PRODUCTS"
    };
    const action: AdvisorAction = {
      type: map[command.intent], label: transcript, parameters: { ...command.parameters, productId: currentProduct?.id, slug: currentProduct?.slug, query: transcript },
      requiresConfirmation: command.requiresConfirmation
    };
    setMessages((current) => [...current, { role: "customer", text: transcript }, { role: "advisor", text: command.requiresConfirmation ? `I recognized “${transcript}”. Confirm before I change your project or continue.` : `I recognized “${transcript}”.` }]);
    propose(action);
  };
  const parseVoiceText = async (transcript: string) => {
    setVoiceState("processing");
    const response = await fetch("/api/ai/voice-command", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ transcript }) }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.command) { setVoiceState("error"); storage.track({ name: "voice_command_failed" }); return; }
    handleVoiceCommand(payload.command, transcript);
  };
  const startVoice = async () => {
    if (!voiceEnabled) return;
    storage.track({ name: "voice_assistant_started" });
    const scope = window as unknown as { SpeechRecognition?: new () => { lang: string; interimResults: boolean; start: () => void; abort: () => void; onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void; onerror: (event: { error: string }) => void; onend: () => void }; webkitSpeechRecognition?: new () => { lang: string; interimResults: boolean; start: () => void; abort: () => void; onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void; onerror: (event: { error: string }) => void; onend: () => void } };
    const Recognition = scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
    if (!Recognition) { setVoiceState("error"); setMessages((current) => [...current, { role: "advisor", text: "Speech recognition is not supported in this browser. Type the command below instead." }]); return; }
    const recognition = new Recognition();
    recognition.lang = navigator.language || "en-US"; recognition.interimResults = false;
    recognition.onresult = (event) => void parseVoiceText(event.results[0][0].transcript);
    recognition.onerror = (event) => { setVoiceState(event.error === "not-allowed" ? "denied" : "error"); storage.track({ name: "voice_command_failed" }); };
    recognition.onend = () => setVoiceState((current) => current === "listening" ? "idle" : current);
    setVoiceState("listening"); recognition.start();
  };
  const clear = () => {
    setMessages([]); setPendingAction(null);
    const next = { route: pathname, currentProductId: currentProduct?.id ?? null, referencedProductIds: [], selectedMaterialIds: [], currentFilters: {}, approvedPreferences: {} };
    setContext(next); window.sessionStorage.removeItem(memoryKey);
  };
  if (!open) return <div className="assistant-dock" aria-label="Musterring assistance">
    <button className="advisor-launcher" aria-label="Open Musterring Product Advisor" onClick={() => { setOpen(true); storage.track({ name: "chatbot_opened" }); }}><Sparkles /><span><small>AI Product Advisor</small><strong>Ask Musterring</strong></span></button>
    <button className="voice-launcher" aria-label="Start Voice Interior Assistant" title="Use voice assistant" onClick={() => { setOpen(true); window.setTimeout(() => void startVoice(), 50); }}><Mic /></button>
  </div>;
  return <aside className="advisor-panel" role="dialog" aria-modal="true" aria-labelledby="advisor-title">
    <header><span className="advisor-brand-icon" aria-hidden="true"><Sparkles /></span><div><p>AI Product Advisor</p><h2 id="advisor-title">Ask Musterring</h2></div><button aria-label="Close Product Advisor" onClick={() => setOpen(false)}><X /></button></header>
      <div className="advisor-toolbar"><button aria-label={muted ? "Enable spoken feedback" : "Mute spoken feedback"} onClick={() => setMuted((value) => !value)}>{muted ? <VolumeX /> : <Volume2 />}</button><button onClick={() => setVoiceEnabled((value) => !value)}>{voiceEnabled ? <Mic /> : <MicOff />} Voice {voiceEnabled ? "on" : "off"}</button><button onClick={clear}><Trash2 /> New conversation</button></div>
      <div className="advisor-messages" aria-live="polite">
        {!messages.length ? <div className="advisor-welcome"><div className="advisor-welcome-copy"><div><h3>How can I help with your space?</h3></div></div><div className="advisor-starters">{starters(pathname).map((question) => <button key={question} onClick={() => void ask(question)}>{question}</button>)}</div></div> : null}
        {messages.map((message, index) => <article className={message.role} key={`${message.role}-${index}`}><div className="advisor-message-bubble">{message.role === "advisor" ? <span className="advisor-message-icon" aria-hidden="true"><Sparkles /></span> : null}<div><small>{message.role === "customer" ? "You" : "Musterring Product Advisor"}</small><p>{message.text}</p></div></div>
          {message.answer?.productIds.length ? <div className="advisor-products">
            {message.answer.answerType === "missing-data" ? <small className="advisor-product-group-label">Closest recommendations — requested option unavailable</small> : null}
            {message.answer.productIds.map((id) => {
            const product = products.find((item) => item.id === id); if (!product) return null;
            const requestText = messages[index - 1]?.role === "customer" ? messages[index - 1].text : "";
            const imageOverride = /\bred\b/i.test(requestText) && product.slug === "mr-260" ? "/musterring-catalog/mr-260/image-08-hq.jpg?v=4" : undefined;
            return <LinkCard key={id} product={product} imageOverride={imageOverride} />;
          })}</div> : null}
          {message.answer?.materialIds.length ? <div className="advisor-materials">{message.answer.materialIds.map((id) => { const material = materials.find((item) => item.id === id); return material ? <span key={id}><i style={{ background: material.colorFamily }} />{material.name}</span> : null; })}</div> : null}
          {message.answer?.sources.length ? <p className="advisor-sources">Source: {message.answer.sources.join(" · ")}</p> : null}
          {message.answer?.proposedAction ? <button className="advisor-proposal" onClick={() => propose(message.answer!.proposedAction!)}>{message.answer.proposedAction.label}</button> : null}
          {message.answer?.suggestedQuestions.length ? <div className="advisor-followups">{message.answer.suggestedQuestions.map((question) => <button type="button" key={question} onClick={() => void ask(question)}>{question}</button>)}</div> : null}
        </article>)}
        {pending ? <p role="status">Consulting available Musterring product data…</p> : null}
        {voiceState !== "idle" ? <p className={`voice-state is-${voiceState}`} role="status">Voice: {voiceState === "denied" ? "Microphone permission denied. Use text input." : voiceState}</p> : null}
      </div>
      {pendingAction ? <section className="advisor-confirmation" aria-label="Confirmation required"><Check /><div><h3>Confirmation required</h3><p>{pendingAction.label}</p><small>The application will validate and execute this action. No retailer request is submitted here.</small></div><button onClick={() => execute(pendingAction)}>Confirm</button><button onClick={() => { setPendingAction(null); storage.track({ name: "chatbot_action_cancelled" }); }}>Cancel</button></section> : null}
      <form className="advisor-input" onSubmit={(event) => { event.preventDefault(); void ask(); }}><textarea ref={inputRef} aria-label="Ask Musterring about products and your project" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about products, materials, configuration, fit or your project…" /><button type="button" aria-label="Use microphone" onClick={() => void startVoice()} disabled={!voiceEnabled}><Mic /></button><button type="submit" aria-label="Send question" disabled={pending}><Send /></button></form>
  </aside>;
}

function LinkCard({ product, imageOverride }: { product: typeof products[number]; imageOverride?: string }) {
  return <a href={`/furniture/${product.slug}`}><Image src={imageOverride ?? productImages(product.id)[0]} alt="" width={260} height={180} /><span><strong>{product.modelCode}</strong><small>{product.category.replaceAll("-", " ")}</small><em>{product.subtitle}</em><b>View details <ArrowRight size={15} /></b></span></a>;
}

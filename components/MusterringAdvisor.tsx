"use client";

import Image from "@/components/HighQualityImage";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Check, ImagePlus, MapPin, Maximize2, MessageSquarePlus, Mic, Minimize2, Paperclip, Save, Send, Sparkles, Square, Upload, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { dealers, materials, products } from "@/lib/data";
import { productImageForColors, productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import { normalizeAppointmentTime } from "@/lib/appointment";
import { buildRetailerEmail } from "@/lib/retailer-email";
import { advisorAnswerSchema, type AdvisorAction, type AdvisorAnswer, type ConversationContext, type VoiceCommand } from "@/lib/ai/assistant-schemas";
import { deriveAdvisorPreferences } from "@/lib/ai/conversation-memory";

type VisualMatch = { productId: string; score: number; label: string; reasons: string[]; differences: string[] };
type Message = { role: "customer" | "advisor"; text: string; answer?: AdvisorAnswer; visualMatches?: VisualMatch[]; roomImage?: string; uploadedImage?: string };
type AttachmentPurpose = "reference" | "room";
const journeySteps = ["Describe", "Discover", "Save", "Visualize", "Retailer", "Consultation"];
/** How long a customer may pause mid-sentence before the turn is submitted. */
const VOICE_SILENCE_MS = 1800;
const memoryKey = "musterring.assistantContext";
const conversationKey = "musterring.assistantConversation";
type SpeechRecognitionResultLike = { 0: { transcript: string }; isFinal?: boolean };
type SpeechRecognitionEventLike = { resultIndex?: number; results: ArrayLike<SpeechRecognitionResultLike> };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous?: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
};

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

function customerQuickReplies(questions: string[], productIds: string[]) {
  const matchedProducts = productIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const noun = matchedProducts.length && matchedProducts.every((product) => product?.category === "sofa" || product?.category === "sectional")
    ? "sofas"
    : "products";
  return [...new Set(questions.flatMap((question) => {
    const clean = question.trim();
    if (!clean) return [];
    if (/^would you like me to compare\b/i.test(clean) || /^do you want me to compare\b/i.test(clean)) {
      return [`Compare these ${productIds.length || 3} ${noun} side by side`];
    }
    if (productIds.length && /\b(?:save|saved project)\b/i.test(clean)) return [];
    if (/\b(?:check|confirm|test)\b.*\bfit\b|\bfit\b.*\broom\b/i.test(clean)) return [];
    // These are questions the assistant should ask in prose, not utterances
    // that should be placed in the customer's mouth as clickable replies.
    if (/^(?:do you want|would you|do you have|are you|is your)\b/i.test(clean)) return [];
    if (/^(?:how|what|which|can|do|would|are|is)\b.*\b(?:you|your)\b/i.test(clean)) return [];
    if (/^how many people should\b|^what seating capacity\b/i.test(clean)) return [];
    return [clean.replace(/\?$/, "")];
  }))].slice(0, 4);
}

function customerRequests(messages: Message[]) {
  return [...new Set(messages
    .filter((message) => message.role === "customer")
    .map((message) => message.text.trim())
    .filter((text) => text.length > 8)
    .filter((text) => !/^(?:hello|hi|thanks|thank you|okay|yes|no)[.!\s]*$/i.test(text))
    .filter((text) => !/^(?:my room photo|product inspiration):/i.test(text))
    .filter((text) => !/^save\b.*\bproject\b/i.test(text)))]
    .slice(-8);
}

async function compactGeneratedRoom(source: string) {
  const image = new window.Image();
  image.src = source;
  await image.decode();
  const scale = Math.min(1, 1400 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) return source;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", .8);
}

export function MusterringAdvisor() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationReady, setConversationReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [pendingAction, setPendingAction] = useState<AdvisorAction | null>(null);
  const [pendingProjectProductIds, setPendingProjectProductIds] = useState<string[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [confirmNewChat, setConfirmNewChat] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "processing" | "recognized" | "error" | "denied">("idle");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [voiceLang, setVoiceLang] = useState("en-US");
  /** Voice conversation mode: the assistant answers out loud, not just in text. */
  const [voiceReplies, setVoiceReplies] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [journeyStep, setJourneyStep] = useState(1);
  const [attachmentMenu, setAttachmentMenu] = useState(false);
  const [attachmentPurpose, setAttachmentPurpose] = useState<AttachmentPurpose>("reference");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState("");
  const [uploadedRoomPreview, setUploadedRoomPreview] = useState("");
  const [attachmentPending, setAttachmentPending] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const [roomGenerationStatus, setRoomGenerationStatus] = useState<"idle" | "loading" | "complete">("idle");
  const [roomGenerationProgress, setRoomGenerationProgress] = useState(0);
  const [pendingRoomSave, setPendingRoomSave] = useState(false);
  const [generatedRoom, setGeneratedRoom] = useState<{ image: string; productIds: string[] } | null>(null);
  const [dealerLocation, setDealerLocation] = useState("");
  const [pendingDealerId, setPendingDealerId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentMode, setAppointmentMode] = useState("Showroom consultation");
  const [appointmentTime, setAppointmentTime] = useState("10:00");
  const [pendingAppointment, setPendingAppointment] = useState(false);
  const [showInlineHandover, setShowInlineHandover] = useState(false);
  const [handoverFirstName, setHandoverFirstName] = useState("");
  const [handoverLastName, setHandoverLastName] = useState("");
  const [handoverEmail, setHandoverEmail] = useState("");
  const [handoverPhone, setHandoverPhone] = useState("");
  const [handoverNotes, setHandoverNotes] = useState("");
  const [handoverConsent, setHandoverConsent] = useState(false);
  const [pendingHandover, setPendingHandover] = useState(false);
  const [handoverState, setHandoverState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [handoverError, setHandoverError] = useState("");
  const [context, setContext] = useState<ConversationContext>({ route: pathname, referencedProductIds: [], selectedMaterialIds: [], currentFilters: {}, approvedPreferences: {} });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const conversationVersionRef = useRef(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceDraftRef = useRef("");
  const voiceParsedRef = useRef(false);
  const stickToBottomRef = useRef(true);
  const silenceTimerRef = useRef<number | null>(null);
  const manualStopRef = useRef(false);
  const levelFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const spokenCountRef = useRef(0);
  const currentProduct = productFromPath(pathname);
  // A single source of truth for which blocking card is on screen. Previously
  // each section carried its own `!a && !b && !c` guard, which let the photo
  // and handover confirmations render at the same time.
  const activeModal: "newChat" | "action" | "projectSave" | "handover" | "attachment" | "roomSave" | "dealer" | "appointment" | null =
    confirmNewChat ? "newChat"
      : pendingAction && pendingAction.type !== "SAVE_PRODUCT" ? "action"
        : pendingProjectProductIds.length ? "projectSave"
          : pendingHandover ? "handover"
            : attachmentPending ? "attachment"
              : pendingRoomSave ? "roomSave"
                : pendingDealerId ? "dealer"
                  : pendingAppointment ? "appointment"
                    : null;
  const dismissModal = () => {
    switch (activeModal) {
      case "newChat": setConfirmNewChat(false); break;
      case "action": setPendingAction(null); storage.track({ name: "chatbot_action_cancelled" }); break;
      case "projectSave": setPendingProjectProductIds([]); break;
      case "handover": setPendingHandover(false); break;
      case "attachment": setAttachmentPending(false); setAttachmentFile(null); break;
      case "roomSave": setPendingRoomSave(false); break;
      case "dealer": setPendingDealerId(""); break;
      case "appointment": setPendingAppointment(false); break;
      default: break;
    }
  };
  useEffect(() => {
    const stored = window.sessionStorage.getItem(conversationKey);
    let restoredJourneyStep = 1;
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const restoredMessages = parsed.map(restoreStoredMessage).filter((message): message is Message => Boolean(message)).slice(-40);
          setMessages(restoredMessages);
          if (restoredMessages.some((message) => message.answer?.productIds.length)) restoredJourneyStep = 2;
        }
      } catch { /* discard malformed session conversation */ }
    }
    setJourneyStep(restoredJourneyStep);
    setConversationReady(true);
    setSavedProductIds(storage.savedProducts());
    const draft = storage.consultationDraft();
    if (draft) {
      setAppointmentDate(draft.appointmentDate);
      setAppointmentMode(draft.appointmentMode);
      setAppointmentTime(normalizeAppointmentTime(draft.preferredTime));
    }
  }, []);
  useEffect(() => {
    if (!conversationReady) return;
    try {
      const sessionMessages = messages.slice(-40).map(({ role, text, answer }) => ({ role, text, answer }));
      window.sessionStorage.setItem(conversationKey, JSON.stringify(sessionMessages));
    } catch { /* keep the current in-memory conversation if browser storage is unavailable */ }
  }, [conversationReady, messages]);
  useEffect(() => {
    const stored = window.sessionStorage.getItem(memoryKey);
    if (stored) {
      try { setContext({ ...JSON.parse(stored), route: pathname, currentProductId: currentProduct?.id ?? null }); } catch { /* discard malformed session data */ }
    } else setContext((current) => ({ ...current, route: pathname, currentProductId: currentProduct?.id ?? null }));
  }, [pathname, currentProduct?.id]);
  useEffect(() => {
    setOpen(false);
    setPendingAction(null);
    setPendingProjectProductIds([]);
    setVoiceState("idle");
    setAttachmentMenu(false);
  }, [pathname]);
  useEffect(() => {
    window.sessionStorage.setItem(memoryKey, JSON.stringify(context));
  }, [context]);
  useEffect(() => {
    if (roomGenerationStatus !== "loading") return;
    const startedAt = Date.now();
    setRoomGenerationProgress(4);
    const timer = window.setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      setRoomGenerationProgress(Math.min(94, Math.round(4 + 90 * (1 - Math.exp(-elapsedSeconds / 55)))));
    }, 750);
    return () => window.clearInterval(timer);
  }, [roomGenerationStatus]);
  useEffect(() => {
    if (roomGenerationStatus !== "complete") return;
    const timer = window.setTimeout(() => setRoomGenerationStatus("idle"), 900);
    return () => window.clearTimeout(timer);
  }, [roomGenerationStatus]);
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
    const emailSent = (event: Event) => {
      const detail = (event as CustomEvent<{ provider?: string }>).detail;
      setJourneyStep(6);
      setMessages((current) => [...current, {
        role: "advisor",
        text: `The confirmed retailer handover email was delivered successfully${detail?.provider ? ` through ${detail.provider.toUpperCase()}` : ""}. The retailer now has the saved products, room view, appointment preference and consultation summary.`
      }]);
      storage.track({ name: "retailer_email_delivered" });
      setOpen(true);
    };
    window.addEventListener("musterring:retailer-email-sent", emailSent);
    return () => window.removeEventListener("musterring:retailer-email-sent", emailSent);
  }, []);
  useEffect(() => {
    if (!open) return;
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const key = (event: KeyboardEvent) => {
      // Escape dismisses the blocking card first; only an unobstructed panel closes.
      if (event.key === "Escape") {
        if (activeModal) { event.preventDefault(); dismissModal(); }
        else if (attachmentMenu) setAttachmentMenu(false);
        else setOpen(false);
      }
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
  }, [open, activeModal, attachmentMenu]);
  // Only follow the conversation while the reader is already at the bottom, so
  // scrolling back through history is never yanked away by an incoming message.
  useEffect(() => {
    const node = messagesRef.current;
    if (!node) return;
    const track = () => { stickToBottomRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 160; };
    node.addEventListener("scroll", track, { passive: true });
    return () => node.removeEventListener("scroll", track);
  }, [open]);
  useEffect(() => {
    const node = messagesRef.current;
    if (!node || !stickToBottomRef.current) return;
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const frame = window.requestAnimationFrame(() => node.scrollTo({ top: node.scrollHeight, behavior }));
    return () => window.cancelAnimationFrame(frame);
  }, [open, messages, pending, roomGenerationStatus, roomGenerationProgress, journeyStep, showInlineHandover, handoverState]);
  // Speak each new advisor reply while voice mode is on, and never speak the
  // backlog when the customer switches it on mid-conversation.
  useEffect(() => {
    if (!voiceReplies) { spokenCountRef.current = messages.length; return; }
    if (messages.length <= spokenCountRef.current) { spokenCountRef.current = messages.length; return; }
    const fresh = messages.slice(spokenCountRef.current);
    spokenCountRef.current = messages.length;
    const latest = [...fresh].reverse().find((message) => message.role === "advisor");
    if (latest) void speak(spokenSummary(latest));
  }, [messages, voiceReplies]);

  // Match the recogniser and the speaking voice to the page language once, and
  // let the customer override it — a German speaker on an English browser was
  // previously never understood.
  useEffect(() => {
    const detected = navigator.language;
    if (detected) setVoiceLang(detected.startsWith("de") ? "de-DE" : detected.startsWith("en") ? "en-US" : detected);
  }, []);

  useEffect(() => () => {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    if (levelFrameRef.current) window.cancelAnimationFrame(levelFrameRef.current);
    if (keepAliveRef.current) window.clearInterval(keepAliveRef.current);
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const ask = async (question = input) => {
    const clean = question.trim();
    if (!clean) return;
    if (!/[\p{L}\p{N}]/u.test(clean)) {
      setInput("");
      setMessages((current) => [...current, { role: "advisor", text: "I didn’t catch a question there. Tell me what you would like to find, compare, configure or check." }]);
      return;
    }
    stickToBottomRef.current = true;
    setMessages((current) => [...current, { role: "customer", text: clean }]);
    setInput(""); setPending(true);
    const conversationVersion = conversationVersionRef.current;
    storage.track({ name: "chatbot_question_submitted" });
    const recentMessages = [...messages, { role: "customer" as const, text: clean }].slice(-8).map(({ role, text }) => ({ role, text }));
    const approvedPreferences = deriveAdvisorPreferences(clean, context.approvedPreferences);
    const response = await fetch("/api/ai/advisor", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: clean, context: { ...context, route: pathname, currentProductId: currentProduct?.id ?? context.currentProductId, approvedPreferences, recentMessages } }) }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (conversationVersion !== conversationVersionRef.current) return;
    setPending(false);
    if (!response?.ok || !payload?.answer) {
      setMessages((current) => [...current, { role: "advisor", text: payload?.error ?? "The Musterring Assistant is temporarily unavailable. Your saved project has not changed." }]);
      return;
    }
    const answer = payload.answer as AdvisorAnswer;
    setMessages((current) => [...current, { role: "advisor", text: answer.answer, answer }]);
    // Carry the brief forward: what the customer has now seen must never be
    // offered again as "something different", and a slot we just asked about
    // must never be asked twice.
    setContext((current) => ({
      ...current,
      approvedPreferences: {
        ...approvedPreferences,
        shownProductIds: [...new Set([...approvedPreferences.shownProductIds, ...answer.productIds])],
        askedSlots: [...new Set([...approvedPreferences.askedSlots, ...(answer.clarify ? [answer.clarify.slot] : [])])]
      },
      referencedProductIds: answer.productIds.length ? answer.productIds : current.referencedProductIds
    }));
    if (answer.productIds.length) {
      setJourneyStep((current) => Math.max(current, 2));
      storage.track({ name: "chatbot_product_recommended", productId: answer.productIds[0] });
    }
    if (answer.proposedAction) storage.track({ name: "chatbot_action_proposed" });
  };
  const startNewChat = () => {
    conversationVersionRef.current += 1;
    setMessages([]);
    setInput("");
    setPending(false);
    setPendingAction(null);
    setConfirmNewChat(false);
    setVoiceState("idle");
    setJourneyStep(1);
    setSelectedProductIds([]);
    cancelSpeech();
    setAttachmentFile(null);
    if (attachmentPreview) URL.revokeObjectURL(attachmentPreview);
    setAttachmentPreview("");
    setUploadedRoomPreview("");
    setAttachmentPending(false);
    setGeneratedRoom(null);
    setRoomGenerationStatus("idle");
    setRoomGenerationProgress(0);
    voiceDraftRef.current = "";
    voiceParsedRef.current = true;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setContext({
      route: pathname,
      currentProductId: currentProduct?.id ?? null,
      referencedProductIds: [],
      selectedMaterialIds: [],
      currentFilters: {},
      approvedPreferences: {}
    });
    try {
      window.sessionStorage.removeItem(conversationKey);
      window.sessionStorage.removeItem(memoryKey);
    } catch { /* the in-memory conversation is still reset when storage is unavailable */ }
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };
  const actionRoute = (action: AdvisorAction) => {
    const values = action.parameters;
    if (action.type === "SEARCH_PRODUCTS") return `/search?q=${encodeURIComponent(String(values.query ?? ""))}`;
    if (action.type === "COMPARE_PRODUCTS") return `/compare?ids=${(values.productIds as string[] ?? []).join(",")}`;
    if (action.type === "OPEN_PRODUCT") return `/furniture/${String(values.slug ?? "")}`;
    if (action.type === "CONFIGURE_PRODUCT") return "/handover";
    if (action.type === "OPEN_ROOM_COMPOSER") return "/room-composer";
    if (action.type === "OPEN_FIT_CHECK") return "";
    if (action.type === "FIND_RETAILER") return "/dealers";
    if (action.type === "PREPARE_HANDOVER" || action.type === "BOOK_CONSULTATION") return "/handover";
    if (action.type === "SHOW_MATERIALS") return `/materials?advisor=${encodeURIComponent(String(values.query ?? ""))}`;
    return "";
  };
  const execute = (action: AdvisorAction) => {
    if (action.type === "SAVE_PRODUCT") {
      const id = String(action.parameters.productId ?? "");
      if (products.some((product) => product.id === id) && !storage.savedProducts().includes(id)) storage.toggleProduct(id);
      setSavedProductIds(storage.savedProducts());
      if (id) setSelectedProductIds((current) => [...new Set([...current, id])]);
      const product = products.find((candidate) => candidate.id === id);
      setJourneyStep((current) => Math.max(current, 3));
      setMessages((current) => [...current, { role: "advisor", text: `${product?.modelCode ?? "The catalogue product"} was saved to My Musterring. Next, upload a photo of your room and I can create a catalogue-grounded visualization after you confirm the image processing.` }]);
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

  const confirmSelectedProjectProducts = () => {
    const validIds = [...new Set(pendingProjectProductIds)].filter((id) => products.some((product) => product.active && product.id === id));
    validIds.forEach((id) => {
      if (!storage.savedProducts().includes(id)) storage.toggleProduct(id);
    });
    setSavedProductIds(storage.savedProducts());
    setSelectedProductIds((current) => [...new Set([...current, ...validIds])]);
    setJourneyStep((current) => Math.max(current, 3));
    const labels = validIds.map((id) => products.find((product) => product.id === id)?.modelCode).filter(Boolean).join(", ");
    setMessages((current) => [...current, { role: "advisor", text: `${labels || "The selected products"} ${validIds.length === 1 ? "was" : "were"} saved to your project. Next I can place ${validIds.length === 1 ? "it" : "them"} in a photo of your own room — upload one and I'll generate the visualisation.` }]);
    storage.track({ name: "chatbot_action_confirmed" });
    setPendingProjectProductIds([]);
  };

  const chooseAttachment = (purpose: AttachmentPurpose) => {
    setAttachmentPurpose(purpose);
    setAttachmentMenu(false);
    fileInputRef.current?.click();
  };

  const selectAttachment = async (file?: File) => {
    if (!file) return;
    setAttachmentError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setAttachmentError("Choose a JPG, PNG or WebP image up to 10 MB.");
      return;
    }
    if (attachmentPreview) URL.revokeObjectURL(attachmentPreview);
    const objectUrl = URL.createObjectURL(file);
    setAttachmentFile(file);
    setAttachmentPreview(objectUrl);
    setAttachmentPending(true);
    const displayImage = await compactGeneratedRoom(objectUrl).catch(() => objectUrl);
    if (attachmentPurpose === "room") setUploadedRoomPreview(displayImage);
    setMessages((current) => [...current, {
      role: "customer",
      text: `${attachmentPurpose === "reference" ? "Product inspiration" : "My room photo"}: ${file.name}`,
      uploadedImage: displayImage
    }]);
  };

  const analyzeAttachment = async () => {
    if (!attachmentFile) return;
    setAttachmentPending(false);
    setPending(true);
    setAttachmentError("");
    storage.recordConsent("photo-ai-processing", true);
    const form = new FormData();
    form.append("image", attachmentFile);
    form.append("consent", "true");
    if (attachmentPurpose === "reference") {
      form.append("crop", JSON.stringify({ x: 0, y: 0, size: 100 }));
      const response = await fetch("/api/ai/image", { method: "POST", body: form }).catch(() => null);
      const payload = response ? await response.json().catch(() => null) : null;
      setPending(false);
      if (!response?.ok || !Array.isArray(payload?.matches)) {
        setAttachmentError(payload?.error ?? "The image could not be analyzed. Your project has not changed.");
        return;
      }
      const visualMatches: VisualMatch[] = payload.matches.slice(0, 6).map((match: { product: { id: string }; score: number; label: string; reasons: string[]; differences: string[] }) => ({
        productId: match.product.id, score: match.score, label: match.label, reasons: match.reasons, differences: match.differences
      }));
      const ids = visualMatches.map((match) => match.productId).filter((id) => products.some((product) => product.id === id));
      const answer: AdvisorAnswer = {
        answer: ids.length ? "I analyzed the visible shape, palette and style, then matched them only against available Musterring catalogue products." : payload?.noMatchReason ?? "No grounded catalogue match is available for this image.",
        answerType: ids.length ? "products" : "missing-data",
        productIds: ids, materialIds: [], sources: ["Uploaded reference image", "Validated Musterring catalogue"], proposedAction: null,
        suggestedQuestions: ids.length > 1 ? ["Compare the top matches", "Which one is more compact?"] : []
      };
      setMessages((current) => [...current, { role: "advisor", text: answer.answer, answer, visualMatches }]);
      setContext((current) => ({ ...current, referencedProductIds: ids }));
      setJourneyStep((current) => Math.max(current, 2));
      storage.track({ name: "visual_search_analyzed" });
    } else {
      setRoomGenerationStatus("loading");
      const productIds = [...new Set([...storage.savedProducts(), ...context.referencedProductIds])].filter((id) => products.some((product) => product.id === id)).slice(0, 6);
      if (!productIds.length) {
        setPending(false);
        setRoomGenerationStatus("idle");
        setRoomGenerationProgress(0);
        setAttachmentError("Save at least one catalogue product before visualizing your room.");
        return;
      }
      form.append("confirmed", "true");
      form.append("items", JSON.stringify(productIds.map((productId, index) => ({
        productId, x: productIds.length === 1 ? 50 : 25 + (index * 50) / Math.max(1, productIds.length - 1), y: 78, rotation: 0, scale: productIds.length > 3 ? .75 : 1
      }))));
      const response = await fetch("/api/ai/room-visualization", { method: "POST", body: form }).catch(() => null);
      const payload = response ? await response.json().catch(() => null) : null;
      setPending(false);
      if (!response?.ok || !payload?.image) {
        setRoomGenerationStatus("idle");
        setRoomGenerationProgress(0);
        setAttachmentError(payload?.error ?? "The room visualization could not be generated. Your original photo is unchanged.");
        return;
      }
      setRoomGenerationProgress(100);
      setRoomGenerationStatus("complete");
      setGeneratedRoom({ image: payload.image, productIds });
      setJourneyStep((current) => Math.max(current, 4));
      setMessages((current) => [...current, { role: "advisor", text: "Your room visualization is ready. It is inspirational and does not confirm physical fit. Review it, then explicitly save it if you want it included in My Musterring and the retailer handover.", roomImage: payload.image }]);
      storage.track({ name: "room_visualization_generated" });
    }
    setAttachmentFile(null);
  };

  const saveGeneratedRoom = async () => {
    if (!generatedRoom) return;
    const compactImage = await compactGeneratedRoom(generatedRoom.image).catch(() => generatedRoom.image);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    storage.saveRoomScene({
      id, rootSceneId: id, projectId: "project-chat-advisor", name: "AI Advisor Room View", version: 1,
      planningMode: "inspiration", roomSize: { widthMm: 5600, lengthMm: 4200 }, sceneScale: 1,
      backgroundId: "customer-upload", generatedVisualizationSrc: compactImage, hasLocalRoomPhoto: false,
      items: generatedRoom.productIds.map((productId, index) => {
        const product = products.find((candidate) => candidate.id === productId)!;
        return { id: `${id}-item-${index + 1}`, productId, x: 30 + index * 18, y: 78, rotation: 0, scale: 1, materialId: product.materials[0], color: product.colors[0], dimensions: { widthMm: product.widthMm, depthMm: product.depthMm, heightMm: product.heightMm } };
      }), createdAt: now, updatedAt: now, demoData: false
    });
    setPendingRoomSave(false);
    setJourneyStep((current) => Math.max(current, 5));
    setMessages((current) => [...current, { role: "advisor", text: "The room view was saved to My Musterring. Tell me your city or postcode below and I’ll show the closest available retail partners from the connected retailer list." }]);
    storage.track({ name: "room_scene_saved" });
  };
  const propose = (action: AdvisorAction) => {
    if (action.requiresConfirmation) setPendingAction(action);
    else execute(action);
  };
  const confirmDealer = () => {
    const dealer = dealers.find((candidate) => candidate.id === pendingDealerId);
    if (!dealer) return;
    storage.setDealer(dealer.id);
    setPendingDealerId("");
    setJourneyStep(6);
    setMessages((current) => [...current, { role: "advisor", text: `${dealer.name} is selected for this project. Choose your preferred consultation date and time; the retailer will confirm final availability.` }]);
  };
  const confirmAppointment = () => {
    const dealerId = storage.selectedDealer() ?? dealers[0].id;
    storage.saveConsultationDraft({ dealerId, appointmentMode, appointmentDate, preferredTime: appointmentTime, createdAt: new Date().toISOString() });
    storage.saveAdvisorProjectBrief({ customerRequests: customerRequests(messages), createdAt: new Date().toISOString() });
    setPendingAppointment(false);
    setShowInlineHandover(true);
    setMessages((current) => [...current, { role: "advisor", text: "Your appointment preference is saved. Continue to the final handover to add contact details, review the complete project summary and explicitly confirm submission." }]);
    storage.track({ name: "appointment_preference_saved", dealerId });
  };

  const reviewInlineHandover = () => {
    setHandoverError("");
    if (!handoverFirstName.trim() || !/^\S+@\S+\.\S+$/.test(handoverEmail.trim())) {
      setHandoverError("Enter your first name and a valid email address before review.");
      return;
    }
    if (!handoverConsent) {
      setHandoverError("Confirm that the selected retailer may receive this project and contact information.");
      return;
    }
    setPendingHandover(true);
  };

  const submitInlineHandover = async () => {
    const dealerId = storage.selectedDealer() ?? dealers[0].id;
    const selectedRoomScene = storage.roomScenes().at(-1) ?? null;
    const fitReports = storage.fitReports();
    const projectData = {
      customerIntent: storage.advisorProjectBrief()?.customerRequests.join(" | ") || "Customer requests a Musterring retailer consultation.",
      productIds: [...new Set([...storage.savedProducts(), ...(selectedRoomScene?.items.map((item) => item.productId) ?? [])])],
      configurationIds: storage.configurations().map((configuration) => configuration.id),
      materialIds: storage.savedMaterials(),
      roomPlan: selectedRoomScene,
      fitWarnings: fitReports.flatMap((report) => Array.isArray(report.reasons) ? report.reasons.map(String) : []),
      requestedRetailerAction: "Book a Consultation"
    };
    setHandoverState("sending");
    setHandoverError("");
    const summaryResponse = await fetch("/api/ai/retailer-summary", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(projectData)
    }).catch(() => null);
    const summaryPayload = summaryResponse ? await summaryResponse.json().catch(() => null) : null;
    if (!summaryResponse?.ok || !summaryPayload?.summary) {
      setPendingHandover(false);
      setHandoverState("error");
      setHandoverError("The retailer project summary could not be prepared. Nothing was submitted.");
      return;
    }
    const fullName = `${handoverFirstName.trim()} ${handoverLastName.trim()}`.trim();
    const response = await fetch("/api/demo/handover", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: fullName, email: handoverEmail.trim(), phone: handoverPhone.trim(), message: handoverNotes.trim(), requestType: "Book a Consultation", dealerId, consent: true, aiSummary: summaryPayload.summary, projectData })
    }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.reference) {
      setPendingHandover(false);
      setHandoverState("error");
      setHandoverError(payload?.error ?? "The handover could not be submitted. Please try again.");
      return;
    }
    const consentRecord = storage.recordConsent("retailer-handover", true);
    storage.saveLead({
      reference: String(payload.reference), name: fullName, email: handoverEmail.trim(), phone: handoverPhone.trim(), message: handoverNotes.trim(),
      requestType: "Book a Consultation", dealerId, consentRecordId: consentRecord.id,
      appointment: `${appointmentMode} · ${appointmentDate || "Date to confirm"} · ${appointmentTime}`,
      project: {
        productIds: storage.savedProducts(), configurationIds: storage.configurations().map((configuration) => configuration.id),
        comparisonProductIds: storage.comparisons(), materialIds: storage.savedMaterials(), roomScenes: storage.roomScenes(),
        fitReports, consultationSummary: summaryPayload.summary, structuredProjectData: projectData,
        advisorProjectBrief: storage.advisorProjectBrief()
      },
      createdAt: new Date().toISOString()
    });
    storage.track({ name: "lead_submitted", dealerId });
    storage.track({ name: "appointment_booked", dealerId });

    // Send the retailer a ready-to-work email rather than a bare notification:
    // the brief, the customer's own sentences, the products they picked with
    // photos, their room visualisation and the slot they want.
    const chosenIds = selectedProductIds.length ? selectedProductIds : projectData.productIds;
    const roomImage = [...messages].reverse().find((message) => message.roomImage)?.roomImage;
    const email = buildRetailerEmail({
      reference: String(payload.reference),
      customer: {
        firstName: handoverFirstName.trim(), lastName: handoverLastName.trim(),
        email: handoverEmail.trim(), phone: handoverPhone.trim(), notes: handoverNotes.trim()
      },
      dealerId,
      briefSummary: briefChips,
      quotes: customerRequests(messages),
      productIds: chosenIds,
      materialIds: storage.savedMaterials(),
      roomImage,
      appointment: { mode: appointmentMode, date: appointmentDate, time: appointmentTime },
      aiSummary: String(summaryPayload.summary),
      origin: window.location.origin
    });
    const delivery = await fetch("/api/dealer-assistant/send-email", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ confirmed: true, ...email })
    }).catch(() => null);
    const deliveryPayload = delivery ? await delivery.json().catch(() => null) : null;
    if (delivery?.ok && deliveryPayload?.delivered) {
      storage.track({ name: "retailer_email_delivered" });
    }

    setPendingHandover(false);
    setHandoverState("sent");
    const dealerName = dealers.find((dealer) => dealer.id === dealerId)?.name ?? "the selected retailer";
    setMessages((current) => [...current, {
      role: "advisor",
      text: delivery?.ok && deliveryPayload?.delivered
        ? `Done — reference ${String(payload.reference)}. I've emailed ${dealerName} your brief, the ${chosenIds.length} product${chosenIds.length === 1 ? "" : "s"} you picked with their photos, your room visualisation and your preferred appointment. They start from your project, not from zero. Final availability and the exact time still come from them.`
        : `Your handover is confirmed with reference ${String(payload.reference)}. The selected products, room view, appointment preference and contact details are prepared for ${dealerName}. Email delivery is not configured in this environment, so nothing was sent outside. Final availability and appointment time still require retailer confirmation.`
    }]);
  };
  const handleVoiceCommand = (command: VoiceCommand, transcript: string) => {
    setVoiceState("recognized");
    setInput("");
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
    const cleanTranscript = transcript.trim();
    if (!cleanTranscript) return;
    const conversationVersion = conversationVersionRef.current;
    setInput(cleanTranscript);
    setVoiceState("processing");
    const response = await fetch("/api/ai/voice-command", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ transcript: cleanTranscript }) }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (conversationVersion !== conversationVersionRef.current) return;
    if (!response?.ok || !payload?.command) { setVoiceState("error"); storage.track({ name: "voice_command_failed" }); return; }
    handleVoiceCommand(payload.command, cleanTranscript);
  };  /* ---------------------------------------------------------------------- */
  /* Speech output                                                            */
  /* ---------------------------------------------------------------------- */

  /**
   * The assistant speaks its answers back. Previously voice was one-way: the
   * customer talked and read the reply, which is not a conversation. In a
   * showroom, on a tablet, being answered out loud is the whole point.
   */
  /**
   * Chrome's speechSynthesis has three well-known failure modes, and the first
   * implementation hit all of them — which is why nothing was audible:
   *
   *  1. `cancel()` is asynchronous internally. Calling `speak()` on the same
   *     tick makes Chrome silently drop the new utterance.
   *  2. An utterance that nothing references can be garbage-collected while it
   *     is still queued, so speech never starts or cuts off mid-sentence.
   *  3. `getVoices()` returns an empty list until the engine has loaded, and a
   *     `lang` with no matching voice yields silence rather than a fallback.
   *
   * Everything below exists to work around one of those.
   */
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveRef = useRef<number | null>(null);

  const stopKeepAlive = () => {
    if (keepAliveRef.current) { window.clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
  };

  const cancelSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    stopKeepAlive();
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  /** Resolves once the engine has published its voice list, or gives up. */
  const loadVoices = () => new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const synthesis = window.speechSynthesis;
    const existing = synthesis.getVoices();
    if (existing.length) { resolve(existing); return; }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      synthesis.removeEventListener("voiceschanged", finish);
      resolve(synthesis.getVoices());
    };
    synthesis.addEventListener("voiceschanged", finish);
    window.setTimeout(finish, 1200);
  });

  /**
   * Windows and Chrome ship two generations of voice side by side: the old
   * formant ones (David, Zira, Hazel "Desktop") that sound unmistakably
   * synthetic, and the newer neural ones (Aria, Jenny, Katja, and Google's
   * cloud voices) that do not. Both answer to the same language code, and the
   * browser hands back whichever it likes, so the good ones are chosen by name.
   */
  const voiceQuality = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    if (/natural|neural/.test(name)) return 5;
    if (/online/.test(name)) return 4;
    if (/google/.test(name)) return 3;
    if (/desktop|espeak|compact/.test(name)) return 0;
    return 2;
  };

  const pickVoice = (voices: SpeechSynthesisVoice[]) => {
    const language = voiceLang.slice(0, 2).toLowerCase();
    const sameLanguage = voices
      .filter((voice) => voice.lang.replace("_", "-").toLowerCase().startsWith(language))
      .sort((left, right) => voiceQuality(right) - voiceQuality(left));
    const exact = sameLanguage.filter((voice) => voice.lang.replace("_", "-").toLowerCase() === voiceLang.toLowerCase());
    return exact[0] ?? sameLanguage[0] ?? voices.find((voice) => voice.default) ?? voices[0] ?? null;
  };

  const speak = async (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const clean = text.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
    if (!clean) return;
    const synthesis = window.speechSynthesis;

    stopKeepAlive();
    synthesis.cancel();
    const voices = await loadVoices();
    // Let the cancel above actually settle before queueing the new utterance.
    await new Promise((resolve) => window.setTimeout(resolve, 90));

    const utterance = new SpeechSynthesisUtterance(clean);
    const voice = pickVoice(voices);
    if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }
    else utterance.lang = voiceLang;
    // Slightly under natural pace with a touch of pitch variation reads as
    // considered rather than hurried; the defaults sound like an announcement.
    utterance.rate = 0.97;
    utterance.pitch = 1.03;
    utterance.volume = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { stopKeepAlive(); utteranceRef.current = null; setSpeaking(false); };
    utterance.onerror = () => { stopKeepAlive(); utteranceRef.current = null; setSpeaking(false); };

    // Hold a reference for the lifetime of the utterance so it survives GC.
    utteranceRef.current = utterance;
    synthesis.speak(utterance);

    // Chrome suspends the engine after roughly fifteen seconds; nudging it
    // keeps longer product descriptions from stopping halfway.
    keepAliveRef.current = window.setInterval(() => {
      if (!synthesis.speaking) { stopKeepAlive(); return; }
      synthesis.pause();
      synthesis.resume();
    }, 10_000);
  };

  /**
   * Turning spoken replies on happens inside a real click, which is the one
   * moment the browser reliably lets audio start. Speaking a short confirmation
   * here unlocks the engine for every later reply and tells the customer the
   * feature is actually working.
   */
  const toggleVoiceReplies = () => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setMessages((current) => [...current, { role: "advisor", text: "This browser cannot speak replies aloud. Everything still works in writing." }]);
      return;
    }
    const next = !voiceReplies;
    setVoiceReplies(next);
    if (!next) { cancelSpeech(); return; }
    // Nothing new should be spoken twice, so mark the backlog as already heard
    // before the confirmation goes out.
    spokenCountRef.current = messages.length;
    const latest = [...messages].reverse().find((message) => message.role === "advisor");
    void speak(latest ? spokenSummary(latest) : "Spoken replies are on. Ask me anything.");
  };

  /**
   * Rewrites an answer for the ear.
   *
   * Screen copy and spoken copy are not the same register. On screen a bulleted
   * spec table is efficient; read aloud, "dash, sleeping sizes colon, one four
   * zero multiplication sign two zero zero c m" is unbearable and instantly
   * gives away that a machine is reading a form. So symbols become words, the
   * list becomes sentences, and only the handful of facts a person would
   * actually say out loud survive.
   */
  const toSpeech = (value: string) => value
    .replace(/\*\*/g, "")
    .replace(/(\d)\s*[×x]\s*(\d)/g, "$1 by $2")
    .replace(/\s*·\s*/g, ", ")
    .replace(/\bcm\b/g, "centimetres")
    .replace(/\bmm\b/g, "millimetres")
    .replace(/\bl\b(?=\s*\))/g, "litres")
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();

  /** Openers rotate so a run of answers never sounds like a loop. */
  const opener = (seed: number, options: string[]) => options[seed % options.length];

  const spokenSummary = (message: Message) => {
    const seed = messages.length;
    const answer = message.answer;

    // A product detail answer: read the lead, then a few facts as sentences.
    if (answer?.answerType === "fact") {
      const [lead, ...rest] = message.text.split("\n\n");
      const facts = rest
        .join("\n")
        .split("\n")
        .filter((line) => line.trimStart().startsWith("-"))
        .slice(0, 4)
        .map((line) => {
          const [rawLabel, ...valueParts] = line.replace(/^\s*-\s*/, "").split(":");
          const label = rawLabel.trim().toLowerCase();
          const value = valueParts.join(":").trim();
          if (!value) return label;
          // A spec sheet says "Bed storage: no". A person says "it has no bed
          // storage". Reading the table verbatim is the giveaway.
          if (/^(?:no|none|not included)$/i.test(value)) return `it has no ${label}`;
          if (/^yes$/i.test(value)) return `it does have ${label}`;
          const plural = label.endsWith("s") && !label.endsWith("ss");
          return `the ${label} ${plural ? "are" : "is"} ${value}`;
        });
      const more = rest.join("\n").split("\n").filter((line) => line.trimStart().startsWith("-")).length - facts.length;
      const sentence = (part: string) => part.charAt(0).toUpperCase() + part.slice(1);
      return toSpeech([
        lead.replace(/^(\S+)\s+—\s+/, "$1. "),
        facts.length ? `${facts.map(sentence).join(". ")}.` : "",
        more > 0 ? `There ${more === 1 ? "is one more detail" : `are ${more} more details`} on screen.` : ""
      ].filter(Boolean).join(" "));
    }

    // A clarifying question: just ask it, warmly.
    if (answer?.answerType === "clarify" && answer.clarify) {
      return toSpeech(`${opener(seed, ["Sure.", "Of course.", "Happy to help."])} ${answer.clarify.question}`);
    }

    // Nothing matched: say what blocks it, plainly, without the written hedging.
    if (answer?.answerType === "missing-data") {
      const blockers = (answer.unmet ?? []).map((entry) => `${entry.requested}, where ${entry.closest}`);
      return toSpeech(blockers.length
        ? `I don't have a match for that. ${blockers.join(". ")}. Tell me which of those I can relax and I'll look again.`
        : message.text.split("\n")[0]);
    }

    // Recommendations: name what was found rather than reading the UI copy.
    const named = (answer?.productIds ?? [])
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is typeof products[number] => Boolean(product));
    if (!named.length) return toSpeech(message.text.split("\n\n")[0]);

    const describe = named.slice(0, 3).map((product) => {
      const size = product.verifiedFacts.dimensions
        ? `, ${Math.round(product.widthMm / 10)} by ${Math.round(product.depthMm / 10)} centimetres`
        : "";
      return `${product.modelCode}${size}`;
    });
    const lead = named.length === 1
      ? opener(seed, ["I found one that fits.", "There's one that works here.", "One match for you."])
      : opener(seed, [`I found ${named.length} that fit.`, `Here are ${named.length} worth a look.`, `${named.length} of these should work.`]);
    const list = describe.length === 1
      ? describe[0]
      : `${describe.slice(0, -1).join(", ")} and ${describe.at(-1)}`;
    const rest = named.length > describe.length ? ` The rest are on screen.` : "";
    const question = answer?.clarify ? ` ${answer.clarify.question}` : "";
    return toSpeech(`${lead} ${list}.${rest}${question}`);
  };

  /**
   * Voice capture. Two things were wrong before and both made the assistant
   * feel broken in the room:
   *
   *  1. `continuous` was false, so the browser ended the session at the first
   *     natural pause and the sentence was cut in half.
   *  2. The first final result submitted immediately, so a customer drawing
   *     breath mid-sentence had their half-sentence sent.
   *
   * Now the recogniser runs continuously and a silence timer decides when the
   * customer has actually finished. Any new speech cancels the pending submit.
   */
  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) { window.clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
  };

  const stopVoice = (submit: boolean) => {
    clearSilenceTimer();
    stopLevelMeter();
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    manualStopRef.current = true;
    try { recognition?.stop(); } catch { try { recognition?.abort(); } catch { /* already stopped */ } }
    const draft = voiceDraftRef.current.trim();
    if (submit && draft && !voiceParsedRef.current) {
      voiceParsedRef.current = true;
      void parseVoiceText(draft);
    } else if (!submit) {
      voiceDraftRef.current = "";
      setVoiceState("idle");
    }
  };

  /** Live microphone level, so the customer can see they are being heard. */
  const startLevelMeter = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      const audioContext = new AudioContextCtor();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (const sample of samples) { const centred = (sample - 128) / 128; sum += centred * centred; }
        setVoiceLevel(Math.min(1, Math.sqrt(sum / samples.length) * 4));
        levelFrameRef.current = window.requestAnimationFrame(tick);
      };
      tick();
    } catch { /* the level meter is a nicety; recognition still works without it */ }
  };

  const stopLevelMeter = () => {
    if (levelFrameRef.current) { window.cancelAnimationFrame(levelFrameRef.current); levelFrameRef.current = null; }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    setVoiceLevel(0);
  };

  const startVoice = async () => {
    if (voiceState === "listening") { stopVoice(true); return; }
    if (voiceState === "processing") return;
    cancelSpeech();
    storage.track({ name: "voice_assistant_started" });
    const scope = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    const Recognition = scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceState("error");
      setMessages((current) => [...current, { role: "advisor", text: "Speech recognition is not supported in this browser. Type the command below instead." }]);
      return;
    }
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    voiceDraftRef.current = "";
    voiceParsedRef.current = false;
    manualStopRef.current = false;
    setInput("");
    recognition.lang = voiceLang;
    recognition.interimResults = true;
    // Keep the microphone open across natural pauses; the silence timer below
    // is what decides the customer has finished, not the browser.
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const part = result?.[0]?.transcript ?? "";
        if (result?.isFinal) finalTranscript += part;
        else interimTranscript += part;
      }
      const visibleTranscript = `${finalTranscript} ${interimTranscript}`.replace(/\s+/g, " ").trim();
      if (visibleTranscript) {
        voiceDraftRef.current = visibleTranscript;
        setInput(visibleTranscript);
      }
      // Still talking: push the submit back. Only a genuine pause sends.
      clearSilenceTimer();
      silenceTimerRef.current = window.setTimeout(() => stopVoice(true), VOICE_SILENCE_MS);
    };

    recognition.onerror = (event) => {
      // A pause long enough to trip "no-speech" is not a failure worth showing;
      // the silence timer already handles the end of a sentence.
      if (event.error === "no-speech" || event.error === "aborted") return;
      clearSilenceTimer();
      stopLevelMeter();
      setVoiceState(event.error === "not-allowed" ? "denied" : "error");
      storage.track({ name: "voice_command_failed" });
    };

    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;
      // Chrome ends the session on its own after a long silence. If the
      // customer said something, treat that as the end of their turn.
      recognitionRef.current = null;
      clearSilenceTimer();
      stopLevelMeter();
      if (manualStopRef.current) return;
      const draft = voiceDraftRef.current.trim();
      if (draft && !voiceParsedRef.current) {
        voiceParsedRef.current = true;
        void parseVoiceText(draft);
        return;
      }
      setVoiceState((current) => current === "listening" ? "idle" : current);
    };

    setVoiceState("listening");
    recognition.start();
    void startLevelMeter();
  };

  const voiceStatusText = voiceState === "denied"
    ? "Microphone permission denied. Use text input."
    : voiceState === "listening"
      ? "Listening — take your time, I'll wait for you to finish."
      : voiceState === "processing"
        ? "Reading your voice command…"
        : voiceState === "recognized"
          ? "Voice command recognized."
          : "Voice input failed. Try again or type your question.";
  // What the assistant currently understands, shown as chips so the customer
  // can see their brief being built instead of guessing what was heard.
  const briefChips = [...messages].reverse().find((message) => message.answer?.briefSummary?.length)?.answer?.briefSummary ?? [];
  const normalizedLocation = dealerLocation.trim().toLocaleLowerCase();
  const dealerMatches = [...dealers].sort((left, right) => {
    const leftExact = normalizedLocation && `${left.city} ${left.postcode}`.toLocaleLowerCase().includes(normalizedLocation) ? 0 : 1;
    const rightExact = normalizedLocation && `${right.city} ${right.postcode}`.toLocaleLowerCase().includes(normalizedLocation) ? 0 : 1;
    return leftExact - rightExact || left.distanceKm - right.distanceKm;
  }).slice(0, 3);
  if (!open) return <button className="assistant-dock" aria-label="Open Musterring Assistant" onClick={() => { setOpen(true); storage.track({ name: "chatbot_opened" }); }}><span>Ask</span><span className="assistant-mark-crop" aria-hidden="true"><Image className="assistant-launcher-logo" src="/brand/musterring-logo.svg" alt="" width={70} height={90} /></span></button>;
  return <aside className={`advisor-panel${wide ? " is-wide" : ""}`} data-modal={activeModal ?? undefined} role="dialog" aria-modal="true" aria-labelledby="advisor-title">
    <header><span className="advisor-brand-icon" aria-hidden="true"><Sparkles /></span><div><p id="advisor-title" className="advisor-header-title">Ask Musterring</p><small>Interior &amp; service concierge</small></div><div className="advisor-header-actions"><button className="advisor-new-chat" aria-label="Start a new chat" onClick={() => setConfirmNewChat(true)}><MessageSquarePlus /><span>New chat</span></button><button className={`advisor-voice-toggle${voiceReplies ? " is-on" : ""}`} aria-label={voiceReplies ? "Turn off spoken replies" : "Turn on spoken replies"} aria-pressed={voiceReplies} onClick={toggleVoiceReplies}>{voiceReplies ? <Volume2 /> : <VolumeX />}</button><button className="advisor-expand" aria-label={wide ? "Collapse the assistant panel" : "Expand the assistant panel"} aria-pressed={wide} onClick={() => setWide((value) => !value)}>{wide ? <Minimize2 /> : <Maximize2 />}</button><button aria-label="Close Musterring Assistant" onClick={() => setOpen(false)}><X /></button></div></header>
      <ol className="advisor-journey" aria-label="Project journey">{journeySteps.map((step, index) => <li key={step} className={index + 1 < journeyStep ? "is-complete" : index + 1 === journeyStep ? "is-current" : ""}><span>{index + 1 < journeyStep ? <Check /> : index + 1}</span><small>{step}</small></li>)}</ol>
      {briefChips.length ? <div className="advisor-brief-chips" aria-label="What I understand so far"><span>Your brief</span><ul>{briefChips.map((chip) => <li key={chip}>{chip}</li>)}</ul></div> : null}
      <div className="advisor-messages" ref={messagesRef} aria-live="polite">
        {!messages.length ? <div className="advisor-welcome"><div className="advisor-welcome-copy"><div><span className="advisor-welcome-kicker">Your home, considered</span><h3>What are you working on?</h3><p>Products, rooms, materials, planning or service—I can help you find the next useful step.</p></div></div><div className="advisor-starters">{starters(pathname).map((question) => <button key={question} onClick={() => void ask(question)}>{question}<ArrowRight /></button>)}</div></div> : null}
        {messages.length ? <div className="advisor-conversation-prompts" aria-label="Suggested questions">{starters(pathname).slice(0, 3).map((question) => <button type="button" key={question} onClick={() => void ask(question)}>{question}</button>)}</div> : null}
        {messages.map((message, index) => <article className={message.role} key={`${message.role}-${index}`}><div className="advisor-message-bubble">{message.role === "advisor" ? <span className="advisor-message-icon" aria-hidden="true"><Sparkles /></span> : null}<div><small>{message.role === "customer" ? "You" : "Musterring Assistant"}</small><AdvisorReply message={message} />{message.uploadedImage ? <figure className="advisor-uploaded-image"><Image src={message.uploadedImage} alt={message.text.startsWith("My room photo") ? "Room photo uploaded by the customer" : "Product inspiration uploaded by the customer"} width={640} height={420} unoptimized /><figcaption>{message.text.startsWith("My room photo") ? "Your uploaded room" : "Your inspiration image"}</figcaption></figure> : null}</div></div>
          {message.answer?.unmet?.length ? <section className="advisor-unmet" aria-label="Requirements the catalogue cannot meet"><h4>Why there is no exact match</h4><ul>{message.answer.unmet.map((entry) => <li key={entry.key}><strong>{entry.requested}</strong><span>{entry.closest}</span></li>)}</ul></section> : null}
          {message.answer?.nearest?.length ? <section className="advisor-nearest" aria-label="Closest options, not matches"><h4>Closest in the catalogue — not a match</h4>{message.answer.nearest.map((entry) => { const product = products.find((candidate) => candidate.id === entry.productId); return product ? <article key={entry.productId}><Image src={productImages(product.id)[0]} alt="" width={96} height={72} /><div><strong>{product.modelCode}</strong><ul>{entry.gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul><a href={`/furniture/${product.slug}`}>View details <ArrowRight size={13} /></a></div></article> : null; })}</section> : null}
          {message.answer?.clarify ? <section className="advisor-clarify" aria-label="Question from the assistant"><p>{message.answer.clarify.question}</p><div>{message.answer.clarify.options.map((option) => <button type="button" key={option} onClick={() => void ask(option)}>{option}</button>)}</div></section> : null}
          {message.answer?.productIds.length ? <RecommendationSet productIds={message.answer.productIds} requestText={messages[index - 1]?.role === "customer" ? messages[index - 1].text : ""} visualMatches={message.visualMatches} savedProductIds={savedProductIds} pendingSaveProductId={pendingAction?.type === "SAVE_PRODUCT" ? String(pendingAction.parameters.productId ?? "") : ""} onSave={(productId) => propose({ type: "SAVE_PRODUCT", label: `Save ${products.find((product) => product.id === productId)?.modelCode ?? "this product"} to My Musterring`, parameters: { productId }, requiresConfirmation: true })} onSaveSelected={(productIds) => setPendingProjectProductIds(productIds)} onConfirmSave={() => pendingAction?.type === "SAVE_PRODUCT" && execute(pendingAction)} onCancelSave={() => { setPendingAction(null); storage.track({ name: "chatbot_action_cancelled" }); }} /> : null}
          {message.roomImage ? <div className="advisor-room-result"><Image src={message.roomImage} alt="AI-generated visualization of the customer's room" width={900} height={600} unoptimized /><span>Inspirational visualization · fit not confirmed</span><button type="button" onClick={() => setPendingRoomSave(true)}><Save /> Save room view</button></div> : null}
          {message.answer?.proposedAction && !["SAVE_PRODUCT", "OPEN_FIT_CHECK"].includes(message.answer.proposedAction.type) && message.answer.proposedAction.type !== "OPEN_FIT_CHECK" ? <button className="advisor-proposal" onClick={() => propose(message.answer!.proposedAction!)}>{message.answer.proposedAction.label}</button> : null}
          {message.answer?.suggestedQuestions.length && customerQuickReplies(message.answer.suggestedQuestions, message.answer.productIds).length ? <div className="advisor-followups">{customerQuickReplies(message.answer.suggestedQuestions, message.answer.productIds).map((question) => <button type="button" key={question} onClick={() => void ask(question)}>{question}</button>)}</div> : null}
        </article>)}
        {pending && roomGenerationStatus === "idle" ? <article className="advisor advisor-thinking" role="status" aria-label="The assistant is preparing an answer"><div className="advisor-message-bubble"><span className="advisor-message-icon" aria-hidden="true"><Sparkles /></span><div><small>Musterring Assistant</small><p><span className="advisor-thinking-dots" aria-hidden="true"><i /><i /><i /></span><span className="advisor-thinking-label">Consulting the validated catalogue…</span></p></div></div></article> : null}
        {roomGenerationStatus !== "idle" ? <section className={`advisor-generation-progress is-${roomGenerationStatus}`} role="progressbar" aria-label="Estimated room visualization progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={roomGenerationProgress}>{uploadedRoomPreview ? <figure className="advisor-generation-source"><Image src={uploadedRoomPreview} alt="Room photo currently being processed" width={240} height={160} unoptimized /><figcaption><strong>Your uploaded room</strong><span>Source photo being processed</span></figcaption></figure> : null}<div><span><Sparkles /> {roomGenerationProgress < 18 ? "Preparing your room" : roomGenerationProgress < 42 ? "Locking catalogue products" : roomGenerationProgress < 82 ? "Rendering your room visualization" : roomGenerationProgress < 100 ? "Finalizing lighting and product details" : "Room visualization ready"}</span><strong>{roomGenerationProgress}%</strong></div><div className="advisor-generation-track" aria-hidden="true"><span style={{ width: `${roomGenerationProgress}%` }} /></div><small>Estimated progress · generation usually takes 1–3 minutes. Keep this chat open.</small></section> : null}
        {voiceState !== "idle" || speaking ? <section className={`advisor-voice-bar is-${speaking ? "speaking" : voiceState}`} role="status" aria-label="Voice status">
          <span className="advisor-voice-orb" aria-hidden="true" style={{ ["--level" as string]: String(speaking ? 0.7 : voiceLevel) }}><i /><i /><i /><i /><i /></span>
          <div><strong>{speaking ? "Speaking…" : voiceState === "listening" ? "Listening" : voiceState === "processing" ? "Thinking" : voiceState === "recognized" ? "Got it" : "Voice"}</strong><small>{speaking ? "Tap stop to interrupt me." : voiceStatusText}</small></div>
          {speaking ? <button type="button" onClick={cancelSpeech}>Stop</button>
            : voiceState === "listening" ? <><button type="button" onClick={() => stopVoice(false)}>Cancel</button><button type="button" className="is-primary" onClick={() => stopVoice(true)}>Send now</button></>
              : null}
        </section> : null}
        {attachmentError ? <p className="advisor-attachment-error" role="alert">{attachmentError}</p> : null}
        {journeyStep === 3 && !attachmentFile ? <button className="advisor-next-step" type="button" onClick={() => chooseAttachment("room")}><ImagePlus /><span><strong>Visualize the saved product</strong><small>Upload your room photo</small></span><ArrowRight /></button> : null}
        {journeyStep === 5 ? <section className="advisor-retailer-step"><div><MapPin /><span><strong>Find your nearest retailer</strong><small>Enter a city or postcode</small></span></div><input aria-label="City or postcode" value={dealerLocation} onChange={(event) => setDealerLocation(event.target.value)} placeholder="e.g. Hannover or 30159" />{normalizedLocation ? <div className="advisor-dealer-list">{dealerMatches.map((dealer) => <button type="button" key={dealer.id} onClick={() => setPendingDealerId(dealer.id)}><span><strong>{dealer.name}</strong><small>{dealer.city} · {dealer.distanceKm} km listed distance</small></span><ArrowRight /></button>)}</div> : null}</section> : null}
        {journeyStep >= 6 ? <section className="advisor-appointment-step"><div><CalendarDays /><span><strong>When would you like to visit?</strong><small>The retailer confirms the final appointment.</small></span></div><label>Date<input type="date" value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} /></label><label>Mode<select value={appointmentMode} onChange={(event) => setAppointmentMode(event.target.value)}><option>Showroom consultation</option><option>Video consultation</option><option>Phone consultation</option><option>Home planning visit</option></select></label><label>Exact time<input type="time" value={appointmentTime} onChange={(event) => setAppointmentTime(event.target.value)} /></label><button type="button" onClick={() => setPendingAppointment(true)}>Review appointment preference</button>{storage.consultationDraft() ? <button type="button" className="is-primary" onClick={() => setShowInlineHandover(true)}>Complete contact details in chat <ArrowRight /></button> : null}</section> : null}
        {journeyStep >= 6 && showInlineHandover && handoverState !== "sent" ? <section className="advisor-inline-handover" aria-label="Complete retailer handover in chat"><div className="advisor-inline-handover-head"><span>Final handover</span><strong>Your contact details</strong><small>Review and explicitly confirm before anything is submitted.</small></div><div className="advisor-inline-handover-grid"><label>First name<input autoComplete="given-name" value={handoverFirstName} onChange={(event) => setHandoverFirstName(event.target.value)} /></label><label>Last name<input autoComplete="family-name" value={handoverLastName} onChange={(event) => setHandoverLastName(event.target.value)} /></label><label>Email<input type="email" autoComplete="email" value={handoverEmail} onChange={(event) => setHandoverEmail(event.target.value)} /></label><label>Phone<input type="tel" autoComplete="tel" value={handoverPhone} onChange={(event) => setHandoverPhone(event.target.value)} /></label></div><label>Message to retailer <small>Optional</small><textarea rows={3} value={handoverNotes} onChange={(event) => setHandoverNotes(event.target.value)} placeholder="Priorities, questions or access details" /></label><div className="advisor-inline-project-review"><span><strong>{storage.savedProducts().length}</strong> products</span><span><strong>{storage.roomScenes().length}</strong> room views</span><span><strong>{storage.fitReports().length}</strong> fit reports</span></div><label className="advisor-inline-consent"><input type="checkbox" checked={handoverConsent} onChange={(event) => setHandoverConsent(event.target.checked)} /><span>I confirm that my project and contact details may be transmitted to <strong>{dealers.find((dealer) => dealer.id === (storage.selectedDealer() ?? dealers[0].id))?.name}</strong>.</span></label>{handoverError ? <p className="advisor-attachment-error" role="alert">{handoverError}</p> : null}<button type="button" disabled={handoverState === "sending"} onClick={reviewInlineHandover}>{handoverState === "sending" ? "Preparing handover…" : "Review complete handover"}</button></section> : null}
        {handoverState === "sent" ? <section className="advisor-inline-handover-success"><Check /><div><strong>Handover confirmed</strong><small>Your complete project remains available inside My Musterring and the Dealer AI workspace.</small></div></section> : null}
      </div>
      {activeModal === "newChat" ? <section className="advisor-confirmation advisor-new-chat-confirmation" aria-label="Confirm new chat"><MessageSquarePlus /><div><h3>Start a new chat?</h3><p>This clears the current conversation and its context.</p></div><button onClick={startNewChat}>Start new chat</button><button onClick={() => setConfirmNewChat(false)}>Cancel</button></section> : null}
      {activeModal === "action" && pendingAction ? <section className="advisor-confirmation" aria-label="Confirmation required"><Check /><div><h3>Confirmation required</h3><p>{pendingAction.label}</p><small>The application will validate and execute this action. No retailer request is submitted here.</small></div><button onClick={() => execute(pendingAction)}>Confirm</button><button onClick={() => { setPendingAction(null); storage.track({ name: "chatbot_action_cancelled" }); }}>Cancel</button></section> : null}
      {activeModal === "projectSave" ? <section className="advisor-confirmation" aria-label="Confirm selected project products"><Save /><div><h3>Save selected products as a project?</h3><p>{pendingProjectProductIds.map((id) => products.find((product) => product.id === id)?.modelCode).filter(Boolean).join(", ")}</p><small>Only the products you selected will be added to My Musterring. Existing saved products will not be duplicated.</small></div><button onClick={confirmSelectedProjectProducts}>Confirm project save</button><button onClick={() => setPendingProjectProductIds([])}>Cancel</button></section> : null}
      {activeModal === "handover" ? <section className="advisor-confirmation" aria-label="Confirm complete retailer handover"><Check /><div><h3>Submit this complete handover?</h3><p>{handoverFirstName} {handoverLastName} · {handoverEmail}</p><small>This sends the confirmed contact details and saved project context to the selected retailer workflow. Price, availability, fit and final appointment time remain retailer decisions.</small></div><button disabled={handoverState === "sending"} onClick={() => void submitInlineHandover()}>{handoverState === "sending" ? "Submitting…" : "Confirm & submit"}</button><button disabled={handoverState === "sending"} onClick={() => setPendingHandover(false)}>Back</button></section> : null}
      {activeModal === "attachment" ? <section className="advisor-confirmation advisor-photo-confirmation" aria-label="Confirm photo processing"><ImagePlus /><div><h3>{attachmentPurpose === "reference" ? "Analyze this inspiration image?" : "Generate a room visualization?"}</h3><p>{attachmentFile?.name}</p><small>{attachmentPurpose === "reference" ? "The image will be processed temporarily to find grounded catalogue similarities." : "The room photo and saved catalogue references will be sent to OpenAI. The result is inspirational and does not confirm fit."}</small></div>{attachmentPreview ? <Image src={attachmentPreview} alt="Selected upload preview" width={420} height={180} unoptimized /> : null}<button onClick={() => void analyzeAttachment()}>{attachmentPurpose === "reference" ? "Analyze image" : "Generate room"}</button><button onClick={() => { setAttachmentPending(false); setAttachmentFile(null); }}>Cancel</button></section> : null}
      {activeModal === "roomSave" ? <section className="advisor-confirmation" aria-label="Confirm saving room view"><Save /><div><h3>Save this room view?</h3><p>It will be added to My Musterring and included in the retailer handover.</p><small>The visualization remains inspirational and is not a fit result.</small></div><button onClick={() => void saveGeneratedRoom()}>Save room view</button><button onClick={() => setPendingRoomSave(false)}>Cancel</button></section> : null}
      {activeModal === "dealer" ? <section className="advisor-confirmation" aria-label="Confirm retailer selection"><MapPin /><div><h3>Select this retailer?</h3><p>{dealers.find((dealer) => dealer.id === pendingDealerId)?.name}</p><small>This changes the retailer attached to your project; nothing is submitted yet.</small></div><button onClick={confirmDealer}>Confirm retailer</button><button onClick={() => setPendingDealerId("")}>Cancel</button></section> : null}
      {activeModal === "appointment" ? <section className="advisor-confirmation" aria-label="Confirm appointment preference"><CalendarDays /><div><h3>Save appointment preference?</h3><p>{appointmentMode} · {appointmentDate || "Date to confirm"} · {appointmentTime}</p><small>The selected retailer must confirm the final time. No request is submitted here.</small></div><button onClick={confirmAppointment}>Save preference</button><button onClick={() => setPendingAppointment(false)}>Cancel</button></section> : null}
      {attachmentMenu ? <div className="advisor-attachment-menu"><button type="button" onClick={() => chooseAttachment("reference")}><Paperclip /><span><strong>Find similar products</strong><small>Furniture photo or screenshot</small></span></button><button type="button" onClick={() => chooseAttachment("room")}><ImagePlus /><span><strong>Visualize my room</strong><small>Uses products saved to your project</small></span></button></div> : null}
      <input ref={fileInputRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onClick={(event) => { event.currentTarget.value = ""; }} onChange={(event) => void selectAttachment(event.target.files?.[0])} />
      <form className="advisor-input" onSubmit={(event) => { event.preventDefault(); void ask(); }}><button type="button" aria-label="Add an image or screenshot" aria-expanded={attachmentMenu} onClick={() => setAttachmentMenu((value) => !value)}><Upload /></button><textarea ref={inputRef} aria-label="Ask Musterring about products and your project" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void ask(); } }} placeholder={voiceState === "listening" ? "Listening... your speech appears here" : "Describe your room, product or project…"} /><button type="button" className={voiceState === "listening" ? "advisor-mic is-listening" : "advisor-mic"} aria-label={voiceState === "listening" ? "Stop listening and send" : "Speak to the assistant"} aria-pressed={voiceState === "listening"} disabled={voiceState === "processing"} onClick={() => void startVoice()}>{voiceState === "listening" ? <Square /> : <Mic />}</button><button type="submit" aria-label="Send question" disabled={pending || voiceState === "processing"}><Send /></button></form>
  </aside>;
}

function AdvisorReply({ message }: { message: Message }) {
  if (message.role === "customer" || !message.answer) return <p>{message.text}</p>;

  const answer = message.answer;
  const normalizedText = message.text.toLocaleLowerCase();
  const referencedMaterials = materials.filter((material) =>
    answer.materialIds.includes(material.id) || normalizedText.includes(material.name.toLocaleLowerCase())
  );
  const hasStructuredRecommendations = answer.productIds.length > 0 || referencedMaterials.length > 0;
  const firstSentence = message.text.match(/^.*?[.!?](?=\s|$)/s)?.[0]?.trim();
  // When cards or material facts are available, never repeat the provider's
  // prose list. The structured sections below are the single source of detail.
  const summary = hasStructuredRecommendations
    ? firstSentence ?? `${message.text.slice(0, 220).trim()}${message.text.length > 220 ? "…" : ""}`
    : message.text;
  const practicalAdvice = message.text.match(/If you want the safest practical choice,\s*([\s\S]*?)(?=If you(?:'|’)d like|$)/i)?.[1]?.trim();

  return <div className="advisor-answer-copy">
    <p>{summary}</p>
    {referencedMaterials.length ? <section className="advisor-answer-section">
      <h4>Recommended materials</h4>
      <ul>{referencedMaterials.slice(0, 4).map((material) => {
        const qualities = [material.easyCare === true ? "easy-care" : "", material.petFriendly === true ? "pet-friendly" : "", material.familyFriendly === true ? "family-friendly" : "", material.durability != null && material.durability >= 4 ? "high durability" : ""].filter(Boolean);
        return <li key={material.id}><strong>{material.name}</strong>{qualities.length ? <span>{qualities.join(" · ")}</span> : null}</li>;
      })}</ul>
    </section> : null}
    {practicalAdvice ? <p className="advisor-practical-note"><strong>Practical choice</strong><span>{practicalAdvice}</span></p> : null}
    {answer.productIds.length ? <p className="advisor-match-intro"><strong>Top catalogue matches</strong><span>Selected from the current validated Musterring catalogue.</span></p> : null}
  </div>;
}

function RecommendationSet({ productIds, requestText, visualMatches, savedProductIds, pendingSaveProductId, onSave, onSaveSelected, onConfirmSave, onCancelSave }: { productIds: string[]; requestText: string; visualMatches?: VisualMatch[]; savedProductIds: string[]; pendingSaveProductId: string; onSave: (productId: string) => void; onSaveSelected: (productIds: string[]) => void; onConfirmSave: () => void; onCancelSave: () => void }) {
  const matches = productIds.map((id) => products.find((product) => product.id === id)).filter((product): product is typeof products[number] => Boolean(product));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const best = matches[0];
  if (!best) return null;
  const selectionMode = matches.length > 1;
  const toggleSelection = (productId: string) => setSelectedIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  const reasons = recommendationReasons(best);
  const requestColors = ["beige", "cream", "white", "black", "red", "burgundy", "brown", "grey", "gray", "green", "blue"].filter((color) => new RegExp(`\\b${color}\\b`, "i").test(requestText));
  const requestedImage = (productId: string) => productImageForColors(productId, requestColors);
  const imageOverride = requestedImage(best.id).matchedColor ? requestedImage(best.id).src : undefined;
  return <div className="advisor-recommendation">
    <div className="advisor-products"><LinkCard product={best} imageOverride={imageOverride} featured visualMatch={visualMatches?.find((match) => match.productId === best.id)} saved={savedProductIds.includes(best.id)} selected={selectedIds.includes(best.id)} selectionMode={selectionMode} pendingSave={pendingSaveProductId === best.id} onSave={onSave} onSelect={toggleSelection} onConfirmSave={onConfirmSave} onCancelSave={onCancelSave} /></div>
    {reasons.length ? <section className="advisor-reasons"><h4>Why it works</h4><ul>{reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></section> : null}
    {matches.length > 1 ? <section className="advisor-other-matches"><h4>Other good matches</h4><p>{matches.slice(1).map((product) => product.modelCode).join(" · ")}</p><div className="advisor-products">{matches.slice(1).map((product) => { const presentation = requestedImage(product.id); return <LinkCard key={product.id} product={product} imageOverride={presentation.matchedColor ? presentation.src : undefined} visualMatch={visualMatches?.find((match) => match.productId === product.id)} saved={savedProductIds.includes(product.id)} selected={selectedIds.includes(product.id)} selectionMode={selectionMode} pendingSave={pendingSaveProductId === product.id} onSave={onSave} onSelect={toggleSelection} onConfirmSave={onConfirmSave} onCancelSave={onCancelSave} />; })}</div></section> : null}
    {selectionMode ? <section className="advisor-selection-bar"><span><strong>{selectedIds.length}</strong> selected</span><button type="button" disabled={!selectedIds.length} onClick={() => onSaveSelected(selectedIds)}><Save size={14} /> Save selected as project</button></section> : null}
  </div>;
}

function recommendationReasons(product: typeof products[number]) {
  const reasons: string[] = [];
  if (product.verifiedFacts.styles.length) reasons.push(`Matches ${product.verifiedFacts.styles.slice(0, 2).join(" and ")} interiors`);
  if (product.verifiedFacts.dimensions) reasons.push(`Verified ${Math.round(product.widthMm / 10)} × ${Math.round(product.depthMm / 10)} cm footprint`);
  if (product.verifiedFacts.modular && product.modular) reasons.push("Offers a verified modular configuration");
  else if (product.verifiedFacts.materialTypes.length) reasons.push(`Available in verified ${product.verifiedFacts.materialTypes.slice(0, 2).join(" and ")} options`);
  return reasons.slice(0, 3);
}

function LinkCard({ product, imageOverride, featured = false, visualMatch, saved, selected, selectionMode, pendingSave, onSave, onSelect, onConfirmSave, onCancelSave }: { product: typeof products[number]; imageOverride?: string; featured?: boolean; visualMatch?: VisualMatch; saved: boolean; selected: boolean; selectionMode: boolean; pendingSave: boolean; onSave: (productId: string) => void; onSelect: (productId: string) => void; onConfirmSave: () => void; onCancelSave: () => void }) {
  const categories = (product.categories ?? [product.category]).map((category) => category.replaceAll("-", " ")).join(" · ");
  return <article className={`advisor-product-card ${saved ? "is-saved" : ""} ${selected ? "is-selected" : ""}`} data-product-id={product.id}>{featured ? <i className="advisor-best-match">{visualMatch ? `${visualMatch.score}% visual match` : "Best match"}</i> : null}<a href={`/furniture/${product.slug}`}><Image src={imageOverride ?? productImages(product.id)[0]} alt="" width={260} height={180} /><span><strong>{product.modelCode}</strong><small>{categories}</small><em>{visualMatch ? visualMatch.reasons.slice(0, 2).join(" · ") : product.subtitle}</em><b>View details <ArrowRight size={15} /></b></span></a>{selectionMode ? <button className="advisor-select-product" type="button" aria-pressed={selected} onClick={() => onSelect(product.id)}>{selected ? <><Check size={14} /> Selected</> : "Select this product"}</button> : pendingSave ? <section className="advisor-inline-save" aria-label={`Confirm saving ${product.modelCode}`}><div><Check /><span><strong>{saved ? `Save ${product.modelCode} again?` : `Save ${product.modelCode}?`}</strong><small>{saved ? "This product is already in My Musterring. Confirming keeps one catalogue entry and refreshes the project step." : "Add this validated catalogue product to My Musterring."}</small></span></div><div><button type="button" onClick={onCancelSave}>Cancel</button><button type="button" onClick={onConfirmSave}>Confirm save</button></div></section> : <button type="button" onClick={() => onSave(product.id)}>{saved ? <><Check size={14} /> Saved · save again</> : <><Save size={14} /> Save to project</>}</button>}{visualMatch && visualMatch.score < 100 ? <small className="advisor-match-difference">Not exact: {visualMatch.differences[0]}</small> : null}</article>;
}

function isStoredMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<Message>;
  return (message.role === "customer" || message.role === "advisor")
    && typeof message.text === "string"
    && message.text.length <= 5000
    && (message.answer === undefined || advisorAnswerSchema.safeParse(message.answer).success);
}

function restoreStoredMessage(value: unknown): Message | null {
  if (!isStoredMessage(value)) return null;

  // A conversation stored before a field was added to advisorAnswerSchema has
  // no value for it. Re-parsing (rather than only validating) applies the
  // schema defaults, so an older session cannot reach the render with
  // `briefSummary`, `unmet` or `nearest` missing.
  if (value.answer) {
    const parsed = advisorAnswerSchema.safeParse(value.answer);
    return parsed.success ? { ...value, answer: parsed.data } : { ...value, answer: undefined };
  }
  if (value.role !== "advisor") return value;

  // Conversations saved before structured answer persistence contain only the
  // visible paragraph. Reconnect model codes from that paragraph to active,
  // validated catalogue entries so recommendation UI survives an upgrade.
  const normalizedText = value.text.toLocaleLowerCase();
  const productIds = products
    .filter((product) => product.active && normalizedText.includes(product.modelCode.toLocaleLowerCase()))
    .map((product) => product.id)
    .slice(0, 12);
  if (!productIds.length) return value;

  return {
    ...value,
    answer: advisorAnswerSchema.parse({
      answer: value.text,
      answerType: "products",
      productIds,
      materialIds: [],
      sources: [],
      proposedAction: null,
      suggestedQuestions: []
    })
  };
}

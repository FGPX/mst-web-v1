"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, RefreshCw, Save, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { stylistAnswerLabel, stylistQuizByRoom, stylistRoomOptions, type StylistQuizQuestion } from "@/lib/ai/stylist-quiz";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import { stylistStyleLabel, type Product, type StylistPreferences, type StylistQuizInput, type StylistRoomType } from "@/lib/types";

type MatchLevel = "strong" | "partial" | "limited";
type StylistAlternative = { product: Product; reason: string; styleMatch: MatchLevel; preferenceMatch: MatchLevel; matchEvidence: string[] };
type StylistSelection = {
  slotId: string;
  slotLabel: string;
  product: Product;
  reason: string;
  styleMatch: MatchLevel;
  preferenceMatch: MatchLevel;
  matchEvidence: string[];
  alternatives: StylistAlternative[];
};
type StylistResult = {
  preferences: StylistPreferences;
  title: string;
  rationale: string;
  catalogueMatch: { level: MatchLevel; message: string };
  roomType: StylistRoomType;
  style: StylistPreferences["style"];
  selections: StylistSelection[];
  ai: { provider: string; mode: string };
};

const visualImages = [
  "/musterring-catalog/mr-315/image-01.jpg",
  "/musterring-catalog/mr-285/image-01.jpg",
  "/musterring-catalog/kanto/image-01.jpg",
  "/musterring-catalog/mr-5100/image-01.jpg",
  "/musterring-catalog/mr-270/image-01.jpg"
];

function roomLabel(roomType: StylistRoomType) {
  return stylistRoomOptions.find((room) => room.id === roomType)?.label ?? roomType.replaceAll("-", " ");
}

function catalogueMatchFor(selections: StylistSelection[]) {
  const levels = selections.flatMap((selection) => [selection.styleMatch, selection.preferenceMatch]);
  if (levels.includes("limited")) return { level: "limited" as const, message: "One or more matches have limited verified evidence for these preferences. These are the closest grounded catalogue options." };
  if (levels.includes("partial")) return { level: "partial" as const, message: "These recommendations combine explicit and partial catalogue evidence for your preferences." };
  return { level: "strong" as const, message: "Every recommendation has strong catalogue evidence for your style and preferences." };
}

function questionComplete(question: StylistQuizQuestion | undefined, answers: Record<string, string>, notes: Record<string, string>, width: string, depth: string) {
  if (!question) return false;
  const answer = answers[question.id];
  if (!answer) return false;
  if (question.noteOption === answer && !notes[question.id]?.trim()) return false;
  if (question.dimensionOption === answer && (Number(width) < 30 || Number(depth) < 30)) return false;
  return true;
}

export default function InteriorStylistClient() {
  const [step, setStep] = useState(0);
  const [roomType, setRoomType] = useState<StylistRoomType | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [maxWidthCm, setMaxWidthCm] = useState("");
  const [maxDepthCm, setMaxDepthCm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<StylistResult | null>(null);
  const [saved, setSaved] = useState(false);

  const questions = roomType ? stylistQuizByRoom[roomType] : [];
  const currentQuestion = step > 0 && step <= questions.length ? questions[step - 1] : undefined;
  const confirmationStep = questions.length + 1;
  const progressTotal = questions.length + 1;
  const isConfirmation = Boolean(roomType && step === confirmationStep);
  const canContinue = step === 0 ? Boolean(roomType) : questionComplete(currentQuestion, answers, notes, maxWidthCm, maxDepthCm);

  const resetResult = () => {
    setResult(null);
    setSaved(false);
    setError("");
    setStatus("idle");
  };

  const chooseRoom = (value: StylistRoomType) => {
    setRoomType(value);
    setAnswers({});
    setNotes({});
    setMaxWidthCm("");
    setMaxDepthCm("");
    resetResult();
  };

  const chooseAnswer = (question: StylistQuizQuestion, value: string) => {
    setAnswers((current) => ({ ...current, [question.id]: value }));
    if (question.noteOption !== value) setNotes((current) => {
      const next = { ...current };
      delete next[question.id];
      return next;
    });
    if (question.dimensionOption !== value) {
      setMaxWidthCm("");
      setMaxDepthCm("");
    }
    resetResult();
  };

  const requestBody = (): StylistQuizInput | null => {
    if (!roomType || !isConfirmation) return null;
    const usesDimensions = questions.some((question) => question.dimensionOption && answers[question.id] === question.dimensionOption);
    return {
      roomType,
      answers,
      notes,
      selectedProductIds: roomType === "home-accessories" && answers["match-selected"] === "yes" ? storage.savedProducts() : [],
      maxWidthMm: usesDimensions ? Math.round(Number(maxWidthCm) * 10) : null,
      maxDepthMm: usesDimensions ? Math.round(Number(maxDepthCm) * 10) : null
    };
  };

  const createSet = async () => {
    const input = requestBody();
    if (!input || status === "loading") return;
    setStatus("loading");
    setError("");
    setResult(null);
    setSaved(false);
    try {
      const response = await fetch("/api/ai/stylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.selections) throw new Error(payload?.error ?? "Your recommendations could not be created right now.");
      setResult(payload as StylistResult);
      setStatus("ready");
      storage.track({ name: "ai_stylist_set_created", route: "/ai-stylist" });
      requestAnimationFrame(() => document.getElementById("stylist-results")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "Your recommendations could not be created right now. Please try again.");
    }
  };

  const swapAlternative = (slotId: string, alternative: StylistAlternative) => {
    setResult((current) => {
      if (!current) return current;
      const limit = current.selections.length > 1 ? 2 : 5;
      const selections = current.selections.map((selection) => selection.slotId !== slotId ? selection : {
        ...selection,
        product: alternative.product,
        reason: alternative.reason,
        styleMatch: alternative.styleMatch,
        preferenceMatch: alternative.preferenceMatch,
        matchEvidence: alternative.matchEvidence,
        alternatives: [
          { product: selection.product, reason: "Return to the previous catalogue recommendation.", styleMatch: selection.styleMatch, preferenceMatch: selection.preferenceMatch, matchEvidence: selection.matchEvidence },
          ...selection.alternatives.filter((item) => item.product.id !== alternative.product.id)
        ].slice(0, limit)
      });
      return { ...current, selections, catalogueMatch: catalogueMatchFor(selections) };
    });
    setSaved(false);
  };

  const saveSet = () => {
    if (!result) return;
    const record = storage.saveStylistSet({
      id: crypto.randomUUID(), name: result.title, roomType: result.roomType, style: result.style, preferences: result.preferences,
      productIds: result.selections.map((selection) => selection.product.id),
      alternativeProductIds: Object.fromEntries(result.selections.map((selection) => [selection.slotId, selection.alternatives.map((item) => item.product.id)])),
      summary: result.rationale, createdAt: new Date().toISOString()
    });
    if (!record) return;
    setSaved(true);
    storage.track({ name: "ai_stylist_set_saved", route: "/ai-stylist" });
  };

  const advance = () => {
    if (!canContinue) return;
    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div className="stylist-page">
    <section className="stylist-hero"><div className="container stylist-hero-inner"><div className="stylist-hero-copy">
      <span className="stylist-kicker"><Sparkles size={15} /> Catalogue-grounded inspiration</span>
      <h1>Tell us how you live. We&apos;ll find what fits your style.</h1>
      <p>Choose a room and answer a short, tailored questionnaire. Our AI stylist will recommend only real products from the Musterring catalogue.</p>
      <span className="stylist-hero-assurance"><ShieldCheck size={16} /> Catalogue-verified recommendations only</span>
    </div></div></section>

    <section className="container stylist-builder" aria-labelledby="stylist-builder-heading">
      <header><h2 id="stylist-builder-heading">Build your personal brief</h2><p>The questions adapt to the room you choose, so every answer is relevant to the product search.</p></header>
      <nav className="stylist-progress is-adaptive" aria-label="Stylist quiz progress">
        {Array.from({ length: progressTotal }, (_, index) => <span key={index} className={index === step ? "is-active" : index < step ? "is-complete" : ""}>{index < step ? <Check size={13} /> : index + 1}</span>)}
      </nav>

      <div className="stylist-flow">
        {step === 0 ? <fieldset className="stylist-question"><legend><span>First, choose a space</span><strong>Which area would you like help with?</strong></legend><div className="stylist-room-options stylist-room-options-adaptive">
          {stylistRoomOptions.map(({ id, label, text }) => <button aria-pressed={roomType === id} type="button" key={id} className={roomType === id ? "is-active" : ""} onClick={() => chooseRoom(id)}><span><strong>{label}</strong><small>{text}</small></span>{roomType === id ? <Check size={16} /> : <ArrowRight size={15} />}</button>)}
        </div></fieldset> : null}

        {currentQuestion ? <fieldset className="stylist-question"><legend><span>Question {step} of {questions.length}</span><strong>{currentQuestion.prompt}</strong>{currentQuestion.help ? <small>{currentQuestion.help}</small> : null}</legend>
          <div className={currentQuestion.visual ? "stylist-style-visuals" : "stylist-target-options stylist-adaptive-options"}>
            {currentQuestion.options.map((choice, index) => <button aria-pressed={answers[currentQuestion.id] === choice.id} type="button" key={choice.id} className={answers[currentQuestion.id] === choice.id ? "is-active" : ""} onClick={() => chooseAnswer(currentQuestion, choice.id)}>
              {currentQuestion.visual ? <span className="stylist-style-image"><Image src={visualImages[index % visualImages.length]} alt="" width={420} height={260} /></span> : null}
              <span className={currentQuestion.visual ? "stylist-style-copy" : ""}><strong>{choice.label}</strong>{!currentQuestion.visual ? <small>Select this preference</small> : null}</span>
              {answers[currentQuestion.id] === choice.id ? currentQuestion.visual ? <i><Check size={15} /></i> : <Check size={16} /> : !currentQuestion.visual ? <ArrowRight size={15} /> : null}
            </button>)}
          </div>
          {currentQuestion.dimensionOption === answers[currentQuestion.id] ? <div className="stylist-dimension-fields"><label><span>Maximum width</span><span><input aria-label="Maximum width in centimetres" min="30" max="1000" type="number" inputMode="decimal" value={maxWidthCm} onChange={(event) => { setMaxWidthCm(event.target.value); resetResult(); }} /> cm</span></label><label><span>Maximum depth</span><span><input aria-label="Maximum depth in centimetres" min="30" max="1000" type="number" inputMode="decimal" value={maxDepthCm} onChange={(event) => { setMaxDepthCm(event.target.value); resetResult(); }} /> cm</span></label><p>Only products with verified dimensions inside both limits will be considered.</p></div> : null}
          {currentQuestion.noteOption === answers[currentQuestion.id] ? <label className="stylist-note-field"><span>{currentQuestion.noteLabel}</span><input aria-label={currentQuestion.noteLabel} maxLength={240} value={notes[currentQuestion.id] ?? ""} onChange={(event) => { setNotes((current) => ({ ...current, [currentQuestion.id]: event.target.value })); resetResult(); }} /></label> : null}
        </fieldset> : null}

        {isConfirmation && roomType ? <div className="stylist-ready"><span><Sparkles size={22} /></span><h3>Perfect — I have enough to start.</h3><p>I&apos;ll look for Musterring products that match your room, needs, space and design preferences.</p><div className="stylist-choice-summary stylist-adaptive-summary">
          <div><small>Area</small><strong>{roomLabel(roomType)}</strong></div>
          {questions.map((question) => <div key={question.id}><small>{question.prompt}</small><strong>{stylistAnswerLabel(roomType, question.id, answers[question.id])}{notes[question.id] ? ` · ${notes[question.id]}` : ""}</strong></div>)}
        </div></div> : null}

        <div className="stylist-flow-actions">
          <button type="button" className="stylist-back" disabled={step === 0 || status === "loading"} onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft size={17} /> Back</button>
          {!isConfirmation ? <button type="button" className="stylist-continue" disabled={!canContinue} onClick={advance}>Continue <ArrowRight size={17} /></button> : <button className="stylist-submit" type="button" disabled={status === "loading"} onClick={() => void createSet()}>{status === "loading" ? <><LoaderCircle className="spin" size={20} /> Matching your preferences…</> : status === "error" ? <><RefreshCw size={19} /> Try again</> : <><Sparkles size={19} /> Create my recommendations</>}</button>}
        </div>
        {error ? <div className="stylist-error" role="alert"><strong>We could not create the recommendations.</strong><span>{error}</span></div> : null}
      </div>
    </section>

    {status === "loading" ? <section className="stylist-loading" aria-live="polite"><LoaderCircle className="spin" size={38} /><h2>Matching your brief to the catalogue</h2><p>We&apos;re ranking verified products against every answer in your tailored questionnaire.</p></section> : null}

    {result ? <section className="stylist-results" id="stylist-results"><div className="container">
      <header className="stylist-result-head"><div><span className="stylist-kicker"><Sparkles size={15} /> Your grounded recommendations</span><h2>{result.title}</h2><p>{result.rationale}</p><div className={`stylist-match-note is-${result.catalogueMatch.level}`}><strong>{result.catalogueMatch.level === "strong" ? "Strong catalogue evidence" : result.catalogueMatch.level === "partial" ? "Partial catalogue evidence" : "Closest catalogue match"}</strong><span>{result.catalogueMatch.message}</span></div></div><div className="stylist-result-actions"><button type="button" onClick={saveSet} disabled={saved}><Save size={17} /> {saved ? "Saved to My Musterring" : result.selections.length === 1 ? "Save recommendation" : "Save complete set"}</button>{saved ? <Link href="/my-musterring">View saved set <ArrowRight size={16} /></Link> : null}</div></header>
      <div className="stylist-analysis stylist-adaptive-results"><div><span>Area</span><p>{roomLabel(result.preferences.roomType)}</p></div><div><span>Catalogue direction</span><p>{stylistStyleLabel(result.preferences.style)}</p></div>{Object.entries(result.preferences.answers).map(([questionId, answerId]) => <div key={questionId}><span>{stylistQuizByRoom[result.preferences.roomType].find((question) => question.id === questionId)?.prompt}</span><p>{stylistAnswerLabel(result.preferences.roomType, questionId, answerId)}</p></div>)}</div>
      <div className={`stylist-set-grid${result.selections.length === 1 ? " is-single" : ""}`}>{result.selections.map((selection, index) => <article className="stylist-product" key={selection.slotId}><div className="stylist-product-number">0{index + 1} · {selection.slotLabel}</div><Link className="stylist-product-image" href={`/furniture/${selection.product.slug}`}><Image src={productImages(selection.product.id)[0]} alt={selection.product.name} width={760} height={560} /><span>View product <ArrowRight size={15} /></span></Link><div className="stylist-product-copy"><small>{selection.product.modelCode}</small><h3>{selection.product.name}</h3><div className="stylist-product-match"><span className={`is-${selection.styleMatch}`}>Style: {selection.styleMatch === "limited" ? "closest" : selection.styleMatch}</span><span className={`is-${selection.preferenceMatch}`}>Preference: {selection.preferenceMatch === "limited" ? "closest" : selection.preferenceMatch}</span></div><p>{selection.reason}</p></div>{selection.alternatives.length ? <div className="stylist-alternatives"><strong>Try an alternative</strong>{selection.alternatives.map((alternative) => <button type="button" key={alternative.product.id} onClick={() => swapAlternative(selection.slotId, alternative)}><Image src={productImages(alternative.product.id)[0]} alt="" width={120} height={90} /><span><small>{alternative.product.modelCode}</small><b>{alternative.product.name}</b><em>{alternative.reason}</em></span><RefreshCw size={15} /></button>)}</div> : <div className="stylist-no-alternatives">No other active catalogue product is available in this category.</div>}</article>)}</div>
      <p className="stylist-boundary">These recommendations are for inspiration. Dimensions, exact configuration, physical fit and availability must be confirmed through the product details, Will It Fit, or a Musterring retailer.</p>
    </div></section> : null}
  </div>;
}

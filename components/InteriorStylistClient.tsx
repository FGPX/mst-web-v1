"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Check,
  CookingPot,
  DoorOpen,
  LampFloor,
  LoaderCircle,
  Pencil,
  RefreshCw,
  Save,
  Sparkles,
  TreePine,
  UtensilsCrossed
} from "lucide-react";
import { useState } from "react";
import { stylistAnswerLabel, stylistAnswerValues, stylistQuestionsForAnswers, stylistQuizByRoom, stylistRoomOptions, type StylistQuizQuestion } from "@/lib/ai/stylist-quiz";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import { roomComposerUploadHref } from "@/lib/room-composer-selection";
import { stylistStyleLabel, type Product, type StylistPreferences, type StylistQuizAnswer, type StylistQuizInput, type StylistRoomType } from "@/lib/types";

type MatchLevel = "strong" | "partial" | "limited";
type RecommendationLevel = "exact" | "closest";
type StylistAlternative = { product: Product; reason: string; styleMatch: MatchLevel; preferenceMatch: MatchLevel; matchEvidence: string[]; matchLevel: RecommendationLevel; matchedPreferences: string[]; unmetPreferences: string[]; recommendedQuantity?: number };
type StylistSelection = {
  slotId: string;
  slotLabel: string;
  product: Product;
  reason: string;
  styleMatch: MatchLevel;
  preferenceMatch: MatchLevel;
  matchEvidence: string[];
  matchLevel: RecommendationLevel;
  matchedPreferences: string[];
  unmetPreferences: string[];
  recommendedQuantity?: number;
  alternatives: StylistAlternative[];
};
type StylistResult = {
  preferences: StylistPreferences;
  title: string;
  rationale: string;
  catalogueMatch: { level: MatchLevel; message: string };
  recommendationMode: "alternatives" | "set";
  matchLevel: RecommendationLevel;
  matchedPreferences: string[];
  unmetPreferences: string[];
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

const atmosphereVisualImages: Record<string, string> = {
  "calm-neutral": "/ai-stylist/atmospheres/calm-neutral.webp",
  "warm-cosy": "/ai-stylist/atmospheres/warm-cosy.webp",
  modern: "/ai-stylist/atmospheres/modern.webp",
  elegant: "/ai-stylist/atmospheres/elegant.webp",
  "dark-dramatic": "/ai-stylist/atmospheres/dark-dramatic.webp"
};

const roomIcons = {
  "living-room": Armchair,
  bedroom: BedDouble,
  "dining-room": UtensilsCrossed,
  bathroom: Bath,
  hallway: DoorOpen,
  kitchen: CookingPot,
  outdoor: TreePine,
  "home-accessories": LampFloor
};

const continuationRooms: Record<StylistRoomType, StylistRoomType[]> = {
  "living-room": ["dining-room", "bedroom", "home-accessories"],
  bedroom: ["living-room", "dining-room", "home-accessories"],
  "dining-room": ["living-room", "kitchen", "home-accessories"],
  bathroom: ["bedroom", "hallway", "home-accessories"],
  hallway: ["living-room", "bedroom", "home-accessories"],
  kitchen: ["dining-room", "living-room", "home-accessories"],
  outdoor: ["living-room", "dining-room", "home-accessories"],
  "home-accessories": ["living-room", "bedroom", "dining-room"]
};

function roomLabel(roomType: StylistRoomType) {
  return stylistRoomOptions.find((room) => room.id === roomType)?.label ?? roomType.replaceAll("-", " ");
}

function catalogueMatchFor(selections: StylistSelection[]) {
  const levels = selections.flatMap((selection) => [selection.styleMatch, selection.preferenceMatch]);
  if (levels.includes("limited")) return { level: "limited" as const, message: "One or more matches have limited verified evidence for these preferences. These are the closest grounded catalogue options." };
  if (levels.includes("partial")) return { level: "partial" as const, message: "These recommendations combine explicit and partial catalogue evidence for your preferences." };
  return { level: "strong" as const, message: "Every recommendation has strong catalogue evidence for your style and preferences." };
}

function answerSelected(answer: StylistQuizAnswer | undefined, value: string) {
  return stylistAnswerValues(answer).includes(value);
}

function questionComplete(question: StylistQuizQuestion | undefined, answers: Record<string, StylistQuizAnswer>, notes: Record<string, string>, width: string, depth: string) {
  if (!question) return false;
  const answer = answers[question.id];
  const values = stylistAnswerValues(answer);
  if (!values.length || (question.minSelections && values.length < question.minSelections) || (question.maxSelections && values.length > question.maxSelections)) return false;
  if (question.noteOption && values.includes(question.noteOption) && !notes[question.id]?.trim()) return false;
  if (question.dimensionOption && values.includes(question.dimensionOption) && (Number(width) < 30 || Number(depth) < 30)) return false;
  return true;
}

export default function InteriorStylistClient() {
  const [step, setStep] = useState(0);
  const [roomType, setRoomType] = useState<StylistRoomType | null>(null);
  const [answers, setAnswers] = useState<Record<string, StylistQuizAnswer>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [maxWidthCm, setMaxWidthCm] = useState("");
  const [maxDepthCm, setMaxDepthCm] = useState("");
  const [styleDirection, setStyleDirection] = useState<StylistPreferences["style"] | null>(null);
  const [styleSourceRoom, setStyleSourceRoom] = useState<StylistRoomType | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<StylistResult | null>(null);
  const [saved, setSaved] = useState(false);

  const questions = roomType ? stylistQuestionsForAnswers(roomType, answers) : [];
  const currentQuestion = step > 0 && step <= questions.length ? questions[step - 1] : undefined;
  const confirmationStep = questions.length + 1;
  const progressTotal = questions.length + 1;
  const displayProgressTotal = roomType ? progressTotal : 6;
  const displayProgressStep = Math.min(step + 1, displayProgressTotal);
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
    setStyleDirection(null);
    setStyleSourceRoom(null);
    resetResult();
  };

  const chooseAnswer = (question: StylistQuizQuestion, value: string) => {
    if (question.id === "target") {
      const questionsBeforeTarget = roomType
        ? stylistQuizByRoom[roomType].slice(0, stylistQuizByRoom[roomType].findIndex((candidate) => candidate.id === "target"))
        : [];
      const preservedQuestionIds = new Set(questionsBeforeTarget.map((candidate) => candidate.id));
      setAnswers((current) => ({
        ...Object.fromEntries(Object.entries(current).filter(([questionId]) => preservedQuestionIds.has(questionId))),
        target: value
      }));
      setNotes((current) => Object.fromEntries(Object.entries(current).filter(([questionId]) => preservedQuestionIds.has(questionId))));
      setMaxWidthCm("");
      setMaxDepthCm("");
      resetResult();
      return;
    }
    const applyDynamicAnswer = (answer: StylistQuizAnswer) => {
      if (!roomType) return;
      const nextAnswers = { ...answers, [question.id]: answer };
      const activeQuestions = stylistQuestionsForAnswers(roomType, nextAnswers);
      const activeIds = new Set(activeQuestions.map((candidate) => candidate.id));
      setAnswers(Object.fromEntries(Object.entries(nextAnswers).filter(([questionId]) => activeIds.has(questionId))));
      setNotes((current) => Object.fromEntries(Object.entries(current).filter(([questionId]) => activeIds.has(questionId))));
      setStep((current) => Math.min(current, activeQuestions.length + 1));
    };
    if (question.maxSelections) {
      const selected = stylistAnswerValues(answers[question.id]);
      const isExclusive = question.exclusiveOptions?.includes(value);
      const withoutExclusive = selected.filter((answer) => !question.exclusiveOptions?.includes(answer));
      const next = selected.includes(value)
        ? selected.filter((answer) => answer !== value)
        : isExclusive
          ? [value]
          : withoutExclusive.length >= question.maxSelections
            ? selected
            : [...withoutExclusive, value];
      if (next === selected || (next.length === selected.length && next.every((answer, index) => answer === selected[index]))) return;
      applyDynamicAnswer(next);
    } else {
      applyDynamicAnswer(value);
    }
    if (question.dimensionOption !== value) {
      setMaxWidthCm("");
      setMaxDepthCm("");
    }
    resetResult();
  };

  const requestBody = (): StylistQuizInput | null => {
    if (!roomType || !isConfirmation) return null;
    const usesDimensions = questions.some((question) => question.dimensionOption && answerSelected(answers[question.id], question.dimensionOption));
    return {
      roomType,
      answers,
      notes,
      selectedProductIds: roomType === "home-accessories" && answerSelected(answers["match-selected"], "yes") ? storage.savedProducts() : [],
      maxWidthMm: usesDimensions ? Math.round(Number(maxWidthCm) * 10) : null,
      maxDepthMm: usesDimensions ? Math.round(Number(maxDepthCm) * 10) : null,
      styleDirection
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
      const limit = 2;
      const selections = current.selections.map((selection) => selection.slotId !== slotId ? selection : {
        ...selection,
        product: alternative.product,
        reason: alternative.reason,
        styleMatch: alternative.styleMatch,
        preferenceMatch: alternative.preferenceMatch,
        matchEvidence: alternative.matchEvidence,
        matchLevel: alternative.matchLevel,
        recommendedQuantity: alternative.recommendedQuantity,
        matchedPreferences: alternative.matchedPreferences,
        unmetPreferences: alternative.unmetPreferences,
        alternatives: [
          { product: selection.product, reason: "Return to the previous catalogue recommendation.", styleMatch: selection.styleMatch, preferenceMatch: selection.preferenceMatch, matchEvidence: selection.matchEvidence, matchLevel: selection.matchLevel, matchedPreferences: selection.matchedPreferences, unmetPreferences: selection.unmetPreferences, recommendedQuantity: selection.recommendedQuantity },
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

  const continueStyleInRoom = (nextRoom: StylistRoomType) => {
    if (!result) return;
    const sourceRoom = result.roomType;
    const sourceStyle = result.style;
    setRoomType(nextRoom);
    setAnswers({});
    setNotes({});
    setMaxWidthCm("");
    setMaxDepthCm("");
    setStyleDirection(sourceStyle);
    setStyleSourceRoom(sourceRoom);
    resetResult();
    setStep(1);
    requestAnimationFrame(() => document.querySelector(".stylist-builder")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const editAnswers = () => {
    setResult(null);
    setSaved(false);
    setStatus("idle");
    setStep(confirmationStep);
    requestAnimationFrame(() => document.querySelector(".stylist-builder")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return <div className="stylist-page">
    <section className="stylist-hero"><div className="container stylist-hero-inner"><div className="stylist-hero-copy">
      <span className="stylist-kicker">Style Finder</span>
      <h1>Tell us what feels right.<br />We&apos;ll find what fits.</h1>
      <p>Furniture matched to your space and style.</p>
    </div></div></section>

    <section className="container stylist-builder" aria-label="Style Finder questionnaire">
      <header className="stylist-builder-intro is-compact"><div className="stylist-progress-summary"><span>Step {displayProgressStep} of {displayProgressTotal}</span><div role="progressbar" aria-label="Style Finder quiz progress" aria-valuemin={1} aria-valuemax={displayProgressTotal} aria-valuenow={displayProgressStep}><i style={{ width: `${(displayProgressStep / displayProgressTotal) * 100}%` }} /></div></div></header>

      <div className="stylist-flow">
        {styleDirection && styleSourceRoom ? <div className="stylist-style-carryover"><Sparkles size={17} /><span>Continuing the <strong>{stylistStyleLabel(styleDirection)}</strong> direction from your {roomLabel(styleSourceRoom).toLowerCase()}.</span></div> : null}
        {step === 0 ? <fieldset className="stylist-question"><legend><strong>Choose a room</strong></legend><div className="stylist-room-options stylist-room-options-adaptive">
          {stylistRoomOptions.map(({ id, label }) => {
            const RoomIcon = roomIcons[id];
            return <button aria-pressed={roomType === id} type="button" key={id} className={roomType === id ? "is-active" : ""} onClick={() => chooseRoom(id)}><span className="stylist-room-icon"><RoomIcon aria-hidden="true" size={38} strokeWidth={1.35} /></span><span className="stylist-room-copy"><strong>{label}</strong></span><span className="stylist-room-action">{roomType === id ? <Check size={15} /> : <ArrowRight size={17} />}</span></button>;
          })}
        </div></fieldset> : null}

        {currentQuestion ? <fieldset className="stylist-question"><legend><strong>{currentQuestion.prompt}</strong>{currentQuestion.help || currentQuestion.maxSelections ? <small>{currentQuestion.help ? `${currentQuestion.help} ` : ""}{currentQuestion.maxSelections ? currentQuestion.minSelections ? `Choose ${currentQuestion.minSelections}–${currentQuestion.maxSelections}.` : `Choose up to ${currentQuestion.maxSelections}.` : ""}</small> : null}</legend>
          <div className={currentQuestion.visual ? `stylist-style-visuals${currentQuestion.id === "atmosphere" ? " is-atmosphere" : ""}` : "stylist-target-options stylist-adaptive-options"}>
            {currentQuestion.options.map((choice, index) => {
              const selected = answerSelected(answers[currentQuestion.id], choice.id);
              return <button aria-pressed={selected} type="button" key={choice.id} className={selected ? "is-active" : ""} onClick={() => chooseAnswer(currentQuestion, choice.id)}>
                {currentQuestion.visual ? <span className="stylist-style-image"><Image src={currentQuestion.id === "atmosphere" ? atmosphereVisualImages[choice.id] : visualImages[index % visualImages.length]} alt={`${choice.label} interior atmosphere`} width={420} height={260} /></span> : null}
                <span className={currentQuestion.visual ? "stylist-style-copy" : "stylist-answer-copy"}><strong>{choice.label}</strong></span>
                {selected ? currentQuestion.visual ? <i><Check size={15} /></i> : <span className="stylist-answer-action is-selected"><Check size={15} /></span> : !currentQuestion.visual ? <span className="stylist-answer-action"><ArrowRight size={16} /></span> : null}
              </button>;
            })}
          </div>
          {currentQuestion.dimensionOption && answerSelected(answers[currentQuestion.id], currentQuestion.dimensionOption) ? <div className="stylist-dimension-fields"><label><span>Maximum width</span><span><input aria-label="Maximum width in centimetres" min="30" max="1000" type="number" inputMode="decimal" value={maxWidthCm} onChange={(event) => { setMaxWidthCm(event.target.value); resetResult(); }} /> cm</span></label><label><span>Maximum depth</span><span><input aria-label="Maximum depth in centimetres" min="30" max="1000" type="number" inputMode="decimal" value={maxDepthCm} onChange={(event) => { setMaxDepthCm(event.target.value); resetResult(); }} /> cm</span></label><p>Only products with verified dimensions inside both limits will be considered.</p></div> : null}
          <label className="stylist-note-field"><span>{currentQuestion.noteOption && answerSelected(answers[currentQuestion.id], currentQuestion.noteOption) ? currentQuestion.noteLabel : "Something else? (optional)"}</span><textarea aria-label={currentQuestion.noteOption && answerSelected(answers[currentQuestion.id], currentQuestion.noteOption) ? currentQuestion.noteLabel : `Something else for ${currentQuestion.prompt}`} placeholder="Describe what you have in mind…" required={Boolean(currentQuestion.noteOption && answerSelected(answers[currentQuestion.id], currentQuestion.noteOption))} maxLength={240} rows={3} value={notes[currentQuestion.id] ?? ""} onChange={(event) => { setNotes((current) => ({ ...current, [currentQuestion.id]: event.target.value })); resetResult(); }} /></label>
        </fieldset> : null}

        {isConfirmation && roomType ? <div className="stylist-ready"><span><Sparkles size={22} /></span><h3>Ready. Let&apos;s find what fits.</h3><p className="stylist-ready-intro">Review every question and answer before creating your recommendations.</p><h4>Your questions and answers</h4><div className="stylist-choice-summary stylist-adaptive-summary">
          <div><small>Area</small><strong>{roomLabel(roomType)}</strong></div>
          {questions.map((question) => <div key={question.id}><small>{question.prompt}</small><strong>{stylistAnswerLabel(roomType, question.id, answers[question.id])}{notes[question.id] ? ` · ${notes[question.id]}` : ""}</strong></div>)}
        </div></div> : null}

        <div className={`stylist-flow-actions${step === 0 ? " is-first-step" : ""}`}>
          {step > 0 ? <button type="button" className="stylist-back" disabled={status === "loading"} onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft size={17} /> Back</button> : null}
          {!isConfirmation ? <button type="button" className="stylist-continue" disabled={!canContinue} onClick={advance}>Continue <ArrowRight size={17} /></button> : <button className="stylist-submit" type="button" disabled={status === "loading"} onClick={() => void createSet()}>{status === "loading" ? <><LoaderCircle className="spin" size={20} /> Matching your preferences…</> : status === "error" ? <><RefreshCw size={19} /> Try again</> : <><Sparkles size={19} /> Find my matches</>}</button>}
        </div>
        {error ? <div className="stylist-error" role="alert"><strong>We could not create the recommendations.</strong><span>{error}</span></div> : null}
      </div>
    </section>

    {status === "loading" ? <section className="stylist-loading" aria-live="polite"><LoaderCircle className="spin" size={38} /><h2>Matching your brief to the catalogue</h2><p>We&apos;re ranking verified products against every answer in your tailored questionnaire.</p></section> : null}

    {result ? <section className="stylist-results" id="stylist-results"><div className="container">
      <header className="stylist-result-head"><div><span className="stylist-kicker"><Sparkles size={15} /> Your grounded recommendations</span><h2>{result.title}</h2><p>{result.rationale}</p><div className={`stylist-match-note is-${result.catalogueMatch.level}`}><strong>{result.matchLevel === "exact" ? "Meets verified requirements" : result.recommendationMode === "set" ? "Closest coordinated set" : "Closest verified option"}</strong><span>{result.catalogueMatch.message}</span></div></div><div className="stylist-result-actions"><Link className="is-primary" href={roomComposerUploadHref(result.selections.map((selection) => selection.product.id))}><Armchair size={17} /> {result.recommendationMode === "set" ? "See this set in your room" : "See this product in your room"}</Link><button type="button" onClick={saveSet} disabled={saved}><Save size={17} /> {saved ? "Saved to My Musterring" : result.selections.length === 1 ? "Save recommendation" : "Save complete set"}</button>{saved ? <Link href="/my-musterring">View saved set <ArrowRight size={16} /></Link> : null}</div></header>
      <header className="stylist-section-heading stylist-recommendations-heading"><div><span>Selected for you</span><h3>{result.selections.length === 1 ? "Your best match" : "Your best matches"}</h3><p>Chosen first from the active catalogue against your room, style and product preferences.</p></div><strong>{result.selections.length} {result.selections.length === 1 ? "recommendation" : "recommendations"}</strong></header>
      <div className={`stylist-set-grid${result.selections.length === 1 ? " is-single" : ""}`}>{result.selections.map((selection, index) => <article className="stylist-product" key={selection.slotId}><div className="stylist-product-number">0{index + 1} · {selection.slotLabel}{selection.recommendedQuantity ? ` · Qty ${selection.recommendedQuantity}` : ""}</div><Link className="stylist-product-image" href={`/furniture/${selection.product.slug}`}><Image src={productImages(selection.product.id)[0]} alt={selection.product.name} width={760} height={560} /><span>View product <ArrowRight size={15} /></span></Link><div className="stylist-product-copy"><small>{selection.product.modelCode}</small><h3>{selection.product.name}</h3><div className="stylist-product-match"><span className={`is-${selection.matchLevel === "exact" ? "strong" : "limited"}`}>{selection.matchLevel === "exact" ? "Meets verified requirements" : "Closest verified option"}</span><span className={`is-${selection.styleMatch}`}>Style: {selection.styleMatch === "limited" ? "closest" : selection.styleMatch}</span><span className={`is-${selection.preferenceMatch}`}>Preference: {selection.preferenceMatch === "limited" ? "closest" : selection.preferenceMatch}</span></div><p>{selection.reason}</p>{selection.recommendedQuantity ? <p><strong>Recommended quantity:</strong> {selection.recommendedQuantity}</p> : null}{selection.matchedPreferences.length ? <p><strong>Matched:</strong> {selection.matchedPreferences.join(" · ")}</p> : null}{selection.unmetPreferences.length ? <p><strong>Not fully matched:</strong> {selection.unmetPreferences.join(" · ")}</p> : null}</div>{selection.alternatives.length ? <div className="stylist-alternatives"><strong>Try an alternative</strong>{selection.alternatives.map((alternative) => <button type="button" key={alternative.product.id} onClick={() => swapAlternative(selection.slotId, alternative)}><Image src={productImages(alternative.product.id)[0]} alt="" width={120} height={90} /><span><small>{alternative.product.modelCode}</small><b>{alternative.product.name}{alternative.recommendedQuantity ? ` · Qty ${alternative.recommendedQuantity}` : ""}</b><em>{alternative.matchLevel === "closest" ? `Closest: ${alternative.reason}` : alternative.reason}</em></span><RefreshCw size={15} /></button>)}</div> : <div className="stylist-no-alternatives">No other active catalogue product is available in this category.</div>}</article>)}</div>
      <p className="stylist-boundary">These recommendations are for inspiration. Dimensions, exact configuration, physical fit and availability must be confirmed through the product details, Will It Fit, or a Musterring retailer.</p>
      <section className="stylist-selection-summary" aria-labelledby="stylist-selection-summary-heading">
        <header className="stylist-section-heading"><div><span>Your brief</span><h3 id="stylist-selection-summary-heading">Based on your selections</h3><p>These are the preferences used to rank your catalogue matches.</p></div><button type="button" onClick={editAnswers}><Pencil size={14} /> Edit answers</button></header>
        <div className="stylist-analysis stylist-adaptive-results"><div><span>Area</span><p>{roomLabel(result.preferences.roomType)}</p></div><div><span>Recommended pieces</span><p>{result.selections.map((selection) => `${selection.slotLabel}${selection.recommendedQuantity ? ` × ${selection.recommendedQuantity}` : ""}`).join(" · ")}</p></div><div><span>Catalogue direction</span><p>{stylistStyleLabel(result.preferences.style)}</p></div>{Object.entries(result.preferences.answers).map(([questionId, answerId]) => <div key={questionId}><span>{stylistQuizByRoom[result.preferences.roomType].find((question) => question.id === questionId)?.prompt}</span><p>{stylistAnswerLabel(result.preferences.roomType, questionId, answerId)}{result.preferences.notes[questionId] ? ` · ${result.preferences.notes[questionId]}` : ""}</p></div>)}</div>
      </section>
      <section className="stylist-continue-style" aria-labelledby="continue-style-heading"><header><span className="stylist-kicker"><Sparkles size={15} /> Continue this style</span><h3 id="continue-style-heading">Bring the same direction into another space.</h3><p>Choose where to continue. We&apos;ll carry over the {stylistStyleLabel(result.style)} direction and ask only the room-specific questions needed for a grounded recommendation.</p></header><div>{continuationRooms[result.roomType].map((nextRoom) => {
        const RoomIcon = roomIcons[nextRoom];
        return <button type="button" key={nextRoom} onClick={() => continueStyleInRoom(nextRoom)}><RoomIcon aria-hidden="true" size={26} strokeWidth={1.35} /><span><strong>{roomLabel(nextRoom)}</strong><small>Continue this style</small></span><ArrowRight aria-hidden="true" size={18} /></button>;
      })}</div></section>
    </div></section> : null}
  </div>;
}

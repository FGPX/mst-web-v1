import { products } from "../data";
import { asksForDetail, buildProductDetail, detailAspect, productIntent, resolveProduct, type ProductIntent } from "./product-detail";
import { productHasCategory, type Category, type Product } from "../types";
import { advisorAnswerSchema, type AdvisorAnswer, type ConversationContext } from "./assistant-schemas";
import {
  emptyBrief, matchBrief, nextQuestion, requestedCategories, summariseBrief, updateBrief,
  type BriefMatch, type CustomerBrief, type ScoredProduct, type UnmetConstraint
} from "./customer-brief";

export type { CustomerBrief } from "./customer-brief";
export { requestedCategories, summariseBrief } from "./customer-brief";

/**
 * Folds the newest customer message into the running brief. Exported under the
 * previous name so existing callers keep working.
 */
export function deriveAdvisorPreferences(text: string, previous: Record<string, unknown> = {}): CustomerBrief {
  return updateBrief({ ...emptyBrief, ...(previous as Partial<CustomerBrief>) } as CustomerBrief, text);
}

const FOLLOW_UP = /\b(?:another|different|else|replace|smaller|more compact|narrower|too big|too small|larger|bigger|instead)\b/i;
const DISCOVERY = /\b(?:want|need|find|show|recommend|suggest|looking|have you got|do you have|another|different|smaller|larger|bigger|too big|too small)\b/i;
const WANTS_OTHERS = /\b(?:another|different|else|replace|instead)\b/i;

/** How many hard, measurable constraints the brief currently carries. */
function hardConstraintCount(brief: CustomerBrief) {
  // An explicit sleeping size is two measurements and pins the choice down
  // hard, so it counts as a complete brief on its own — asking "fabric or
  // leather?" before showing anything would just be in the way.
  const sleeping = brief.sleepingWidthMm && brief.sleepingLengthMm ? 2 : 0;
  return sleeping + [brief.maxWidthMm, brief.maxDepthMm, brief.seatCount, brief.colors.length || undefined,
    brief.materialTypes.length || undefined, brief.layoutShapes.length || undefined,
    brief.easyCareRequired || undefined].filter(Boolean).length;
}

const categoryLabel = (category: Category) => category.replaceAll("-", " ");

/** "max 200 cm wide — the narrowest verified option is 268 cm" */
const unmetSentence = (unmet: UnmetConstraint[]) =>
  unmet.map((entry) => `${entry.requested} — ${entry.closest}`).join("; ");

const relaxLabel = (key: string) =>
  key === "maxWidth" ? "Allow a wider option"
    : key === "maxDepth" ? "Allow a deeper option"
      : key === "colour" ? "Show other colours"
        : key === "seats" ? "Allow a different seat count"
          : key === "layout" ? "Show other layouts"
            : key === "material" ? "Show other materials"
              : "Relax the easy-care requirement";

/**
 * Verified matches first, then the unverified-but-not-contradicted tier — and
 * the unpublished facts of whatever was actually taken, so the copy can never
 * claim full verification for a padded result set.
 */
function pick(match: BriefMatch, limit: number) {
  const verified = match.exact.slice(0, limit).map((product) => ({ product, unverified: [] as string[] }));
  const padding = match.possible.slice(0, Math.max(0, limit - verified.length));
  return [...verified, ...padding.map((entry) => ({ product: entry.product, unverified: entry.unverified }))];
}

/** Turns a category label into something that reads correctly after "Here are". */
const pluralise = (label: string) => label.endsWith("s") ? label : `${label}s`;

const toNearestPayload = (entry: ScoredProduct) => ({ productId: entry.product.id, gaps: entry.gaps.slice(0, 3) });

/**
 * Turns a next-step request about a known product into a proposed action the
 * application can actually execute, rather than more prose about the product.
 */
function productActionAnswer(product: Product, intent: Exclude<ProductIntent, "detail" | "similar">, briefSummary: string[]): AdvisorAnswer {
  const config = {
    visualise: {
      type: "OPEN_ROOM_COMPOSER" as const,
      label: `Place ${product.modelCode} in a photo of your room`,
      answer: `Let's put ${product.modelCode} in your actual room. Upload a photo of the space and I'll generate the visualisation here in the chat — it stays inspirational, so it isn't a fit confirmation.`,
      questions: ["Upload a room photo", `Check whether ${product.modelCode} fits my room`]
    },
    choose: {
      type: "SAVE_PRODUCT" as const,
      label: `Add ${product.modelCode} to your project`,
      answer: `Good choice. I'll put ${product.modelCode} in your project — then we can place it in a photo of your room and, when you're ready, hand the whole thing to a retailer.`,
      questions: [`See ${product.modelCode} in my room`, "Show me something similar", "Find my nearest retailer"]
    },
    save: {
      type: "SAVE_PRODUCT" as const,
      label: `Save ${product.modelCode} to My Musterring`,
      answer: `I'll add ${product.modelCode} to your project so it travels with you to the retailer handover.`,
      questions: [`See ${product.modelCode} in my room`, "Find my nearest retailer"]
    },
    compare: {
      type: "COMPARE_PRODUCTS" as const,
      label: `Compare ${product.modelCode} with your other options`,
      answer: `I'll put ${product.modelCode} side by side with the other options you've seen.`,
      questions: [`See ${product.modelCode} in my room`]
    },
    retailer: {
      type: "FIND_RETAILER" as const,
      label: "Find your nearest Musterring retailer",
      answer: `Good moment to bring in a retailer — they confirm price, availability and delivery for ${product.modelCode}. Tell me your city or postcode.`,
      questions: ["Prepare my project for the retailer"]
    }
  }[intent];

  return advisorAnswerSchema.parse({
    answer: config.answer,
    answerType: intent === "visualise" ? "room" : intent === "retailer" ? "dealer" : "project",
    productIds: [product.id],
    materialIds: [],
    sources: ["Musterring product catalogue"],
    proposedAction: {
      type: config.type,
      label: config.label,
      parameters: { productId: product.id, slug: product.slug },
      requiresConfirmation: config.type === "SAVE_PRODUCT"
    },
    suggestedQuestions: config.questions,
    clarify: null, unmet: [], nearest: [], briefSummary
  });
}

/**
 * Renders a product's catalogue facts as a chat answer. Used when the customer
 * is asking about a product they already have in front of them.
 */
function productDetailAnswer(productId: string, question: string, briefSummary: string[]): AdvisorAnswer {
  const product = products.find((candidate) => candidate.id === productId)!;
  const aspect = detailAspect(question);
  const detail = buildProductDetail(product, aspect);
  const body = detail.groups
    .map((group) => `${group.title}\n${group.rows.map((row) => `- ${row.label}: ${row.value}`).join("\n")}`)
    .join("\n\n");
  const lead = aspect === "overview"
    ? `${product.modelCode} — ${detail.headline}`
    : `Here is what the catalogue publishes for ${product.modelCode}.`;
  return advisorAnswerSchema.parse({
    answer: body
      ? `${lead}\n\n${body}\n\nStill with the retailer: ${detail.openPoints.join("; ")}.`
      : `${lead}\n\nThe catalogue publishes no further detail for this product. Your retailer has the full specification.`,
    answerType: "fact",
    productIds: [product.id],
    materialIds: [],
    sources: ["Musterring product catalogue"],
    proposedAction: null,
    suggestedQuestions: [
      `Save ${product.modelCode} to my project`,
      `See ${product.modelCode} in my room`,
      `Show me something similar`
    ],
    clarify: null, unmet: [], nearest: [], briefSummary
  });
}

/**
 * Replaces the provider's free-text product selection with a deterministic,
 * constraint-checked one.
 *
 * The rule that matters: a hard constraint is never silently relaxed. If the
 * catalogue has no beige sofa within 200 x 200 cm, the assistant says exactly
 * that and shows the nearest options labelled with how far off they are. It
 * does not present a 268 cm sofa as an answer to a 200 cm request.
 */
export function groundAdvisorConversationTurn(question: string, context: ConversationContext, generated: AdvisorAnswer): AdvisorAnswer {
  const brief = updateBrief({ ...emptyBrief, ...(context.approvedPreferences as Partial<CustomerBrief>) } as CustomerBrief, question);
  const briefSummary = summariseBrief(brief);

  // A question about a product the customer already has in view must never be
  // answered with a fresh wall of recommendations. "Continue with BARI" and
  // "explain this bed's functions" are the same intent: tell me about THIS one.
  const named = resolveProduct(question);
  const intent = productIntent(question);
  // "this one" means the option that was presented first — the best match —
  // not the last row of the list, which is the weakest suggestion.
  const impliedId = brief.focusProductId
    ?? context.referencedProductIds[0]
    ?? (context.currentProductId ?? undefined)
    ?? brief.shownProductIds[0];
  const addressesProduct = intent !== "detail" || asksForDetail(question);
  const focusId = named?.id ?? (addressesProduct && !WANTS_OTHERS.test(question) ? impliedId : undefined);
  const focus = focusId ? products.find((product) => product.id === focusId && product.active) : undefined;

  if (focus && (named || addressesProduct)) {
    // "See it in my room", "save it", "I'll take this one" are steps in the
    // journey, not requests for another description. They must advance the
    // process, not repeat what the customer just read.
    if (intent !== "detail" && intent !== "similar") {
      return productActionAnswer(focus, intent, briefSummary);
    }
    if (intent === "detail" && !WANTS_OTHERS.test(question)) {
      return productDetailAnswer(focus.id, question, briefSummary);
    }
  }

  let categories = requestedCategories(question);
  const isFollowUp = FOLLOW_UP.test(question);
  if (!categories.length && isFollowUp && brief.lastCategory) categories = [brief.lastCategory];
  // Fall back to the piece the customer last named, not to everything they
  // have ever mentioned — otherwise asking about a bed and later about a sofa
  // returns both for the rest of the conversation.
  if (!categories.length && brief.lastCategory && DISCOVERY.test(question)) categories = [brief.lastCategory];
  if (!categories.length || !DISCOVERY.test(question)) {
    return advisorAnswerSchema.parse({ ...generated, briefSummary });
  }

  // "Show me something similar" must not return the very product the customer
  // is looking at, so the focus is excluded alongside anything already seen.
  const wantsAlternatives = WANTS_OTHERS.test(question) || intent === "similar";
  const excludeIds = wantsAlternatives
    ? [...new Set([...brief.shownProductIds, ...(focus ? [focus.id] : []), ...(impliedId ? [impliedId] : [])])]
    : [];
  const primary = categories[0];

  // Ask before guessing when the brief is still too thin to mean anything.
  // One well-chosen question beats six arbitrary recommendations.
  if (hardConstraintCount(brief) < 2 && !brief.shownProductIds.length && !isFollowUp) {
    const opening = nextQuestion(brief, primary);
    if (opening) {
      return advisorAnswerSchema.parse({
        answer: `Happy to help you find ${categories.map((category) => pluralise(categoryLabel(category))).join(" and ")}. One thing first, so I only show you options that actually fit — ${opening.question}`,
        answerType: "clarify",
        productIds: [], materialIds: [], sources: ["Musterring product catalogue"],
        proposedAction: null, suggestedQuestions: [],
        clarify: opening, unmet: [], nearest: [], briefSummary
      });
    }
  }

  const perCategory = categories.length > 1 ? 2 : 4;
  const results = categories.map((category) => ({ category, match: matchBrief(brief, category, { excludeIds }) }));
  const blocked = results.filter(({ match }) => match.unmet.length);

  // At least one requested category verifiably cannot be satisfied. Say so.
  if (blocked.length) {
    const detail = blocked.map(({ category, match }) =>
      `${categoryLabel(category)}: ${unmetSentence(match.unmet)}`).join("\n");
    const nearest = blocked.flatMap(({ match }) => match.nearest.slice(0, 2).map(toNearestPayload));
    const satisfiedIds = results
      .filter(({ match }) => !match.unmet.length)
      .flatMap(({ match }) => pick(match, perCategory).map((entry) => entry.product.id));
    const relaxable = [...new Set(blocked.flatMap(({ match }) => match.unmet.map((entry) => entry.key)))];

    return advisorAnswerSchema.parse({
      answer: `I don't have a validated match for that, and I won't show you something that misses your requirement as if it fitted. Here is exactly what blocks it:\n\n${detail}\n\nTell me which requirement I may relax, or look at the closest options below — each one is labelled with how far off it is.`,
      answerType: "missing-data",
      productIds: satisfiedIds,
      materialIds: [],
      sources: ["Musterring product catalogue"],
      proposedAction: null,
      suggestedQuestions: relaxable.slice(0, 3).map(relaxLabel),
      clarify: null,
      unmet: blocked.flatMap(({ match }) => match.unmet),
      nearest,
      briefSummary
    });
  }

  const selected = results.flatMap(({ match }) => pick(match, perCategory));
  const unique = [...new Map(selected.map((entry) => [entry.product.id, entry])).values()].slice(0, 6);

  // Which requirements the catalogue does not publish for the products we are
  // about to show — computed from the chosen set, not from the whole category.
  const unverified = [...new Set(unique.flatMap((entry) => entry.unverified))];

  if (!unique.length) {
    // Every requirement is individually satisfiable but the exclusion list has
    // exhausted the category: the customer has seen everything that fits.
    const label = categories.map(categoryLabel).join(" and ");
    return advisorAnswerSchema.parse({
      answer: `I've now shown you every validated ${label} that matches your brief, and I won't repeat an option you already turned down. Tell me which requirement I may relax and I'll widen the search.`,
      answerType: "missing-data",
      productIds: [], materialIds: [], sources: ["Musterring product catalogue"],
      proposedAction: null,
      suggestedQuestions: ["Relax the size limit", "Show other colours", `Show all ${label} options`],
      clarify: null, unmet: [], nearest: [], briefSummary
    });
  }

  // Recommend, and keep narrowing: attach the single most useful open question
  // so the conversation moves forward instead of stalling on a wall of cards.
  const clarify = nextQuestion(brief, primary);
  const labels = categories.map(categoryLabel).join(" and ");
  const plural = categories.map((category) => pluralise(categoryLabel(category))).join(" and ");
  const qualifiers = [
    brief.maxWidthMm ? `within ${Math.round(brief.maxWidthMm / 10)} cm` : "",
    brief.colors.length ? `in ${brief.colors.join("/")}` : "",
    brief.easyCareRequired ? "easy to clean" : "",
    brief.spaceSize === "compact" ? "suited to a compact room" : ""
  ].filter(Boolean).join(", ");

  // The copy must never imply a requirement is met when the catalogue simply
  // does not publish the fact. Verified results and unverified ones therefore
  // get different sentences, not the same sentence with a footnote.
  const opener = /\b(?:smaller|too big|more compact|narrower)\b/i.test(question)
    ? `Understood — smaller ${plural}`
    : wantsAlternatives
      ? `Of course — different ${plural}`
      : `Here are ${plural}`;
  const body = unverified.length
    ? `${opener} that don't contradict anything you've told me${qualifiers ? ` (${qualifiers})` : ""}. Be aware: the catalogue does not publish ${unverified.slice(0, 3).join(", ")} for these, so I can't confirm those points — your retailer can.`
    : `${opener}${qualifiers ? ` ${qualifiers}` : ""}. Every one of them is verified against each requirement you've given me.`;
  // Being honest that a requirement changed nothing is more useful than letting
  // the customer believe the list was filtered by it.
  const useless = [...new Map(results.flatMap(({ match }) => match.uninformative.map((entry) => [entry.key, entry]))).values()];
  const uselessNote = useless.length
    ? ` One thing worth knowing: ${useless.map((entry) => `you asked for ${entry.label}, and ${entry.note}`).join("; ")}.`
    : "";
  const answer = `${body}${uselessNote}`;

  return advisorAnswerSchema.parse({
    ...generated,
    answer: clarify ? `${answer}\n\n${clarify.question}` : answer,
    answerType: "products",
    productIds: unique.map((entry) => entry.product.id),
    materialIds: categories.some((category) => ["sofa", "sectional", "armchair"].includes(category)) ? generated.materialIds : [],
    sources: ["Musterring product catalogue"],
    proposedAction: null,
    suggestedQuestions: clarify ? [] : unique.length > 1 ? [`Compare these ${labels} side by side`] : [`Show me another ${labels} option`],
    clarify,
    unmet: [],
    nearest: [],
    briefSummary
  });
}

/** Products the customer has actually been shown, for the exclusion list. */
export function recordShownProducts(brief: CustomerBrief, productIds: string[]): CustomerBrief {
  return { ...brief, shownProductIds: [...new Set([...brief.shownProductIds, ...productIds])] };
}

/** Marks a slot answered so the assistant never asks the same question twice. */
export function recordAskedSlot(brief: CustomerBrief, slot: string): CustomerBrief {
  return { ...brief, askedSlots: [...new Set([...brief.askedSlots, slot])] };
}

/** Used by the retailer handover to name what the customer actually asked for. */
export function briefProductPool(brief: CustomerBrief) {
  return products.filter((product) => product.active && brief.categories.some((category) => productHasCategory(product, category)));
}

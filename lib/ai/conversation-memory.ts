import { products } from "../data";
import { asksForDetail, buildProductDetail, detailAspect, resolveProduct } from "./product-detail";
import { productHasCategory, type Category } from "../types";
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
  const focusId = named?.id
    ?? (asksForDetail(question) && !WANTS_OTHERS.test(question)
      ? brief.focusProductId ?? (context.currentProductId ?? undefined) ?? brief.shownProductIds.at(-1)
      : undefined);
  if (focusId && products.some((product) => product.id === focusId && product.active)
    && (named || asksForDetail(question)) && !WANTS_OTHERS.test(question)) {
    return productDetailAnswer(focusId, question, briefSummary);
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

  const excludeIds = WANTS_OTHERS.test(question) ? brief.shownProductIds : [];
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
    : WANTS_OTHERS.test(question)
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

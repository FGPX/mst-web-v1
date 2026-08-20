import { products } from "../data";
import { parseSearchQuery, searchColorTerms } from "../search";
import { productHasCategory, type Category, type Product } from "../types";
import { hasVerifiedColourPresentation } from "../musterring-assets";
import { advisorAnswerSchema, type AdvisorAnswer, type ConversationContext } from "./assistant-schemas";

export type AdvisorPreferences = {
  spaceSize?: "compact" | "large";
  colors?: string[];
  materialPreferences?: string[];
  seatCount?: number;
  maxWidthMm?: number;
  requestedCategories?: Category[];
  lastCategory?: Category;
  shownProductIds?: string[];
};

const categoryPatterns: Array<[Category, RegExp]> = [
  ["coffee-table", /\b(?:coffee|coffe|coffy|cofee|couch|side)\s+table\b/i],
  ["dining-table", /\bdining\s+table\b/i],
  ["dining-chair", /\bdining\s+(?:chair|seat|bench)\b/i],
  ["armchair", /\b(?:armchair|recliner|accent chair)\b/i],
  ["sectional", /\b(?:sectional|corner sofa|corner couch|chaise)\b/i],
  ["sofa", /\b(?:sofa|couch|loveseat)\b/i],
  ["storage", /\b(?:storage|cabinet|sideboard|wall unit)\b/i],
  ["wardrobe", /\b(?:wardrobe|closet)\b/i],
  ["bed", /\b(?:bed|mattress|topper)\b/i],
  ["carpet", /\b(?:carpet|rug)\b/i],
  ["lamp", /\b(?:lamp|lighting)\b/i]
];

export function requestedCategories(text: string) {
  return categoryPatterns.filter(([, pattern]) => pattern.test(text)).map(([category]) => category);
}

export function deriveAdvisorPreferences(text: string, previous: Record<string, unknown> = {}): AdvisorPreferences {
  const current = previous as AdvisorPreferences;
  const categories = requestedCategories(text);
  const normalized = text.toLowerCase();
  const parsed = parseSearchQuery(text);
  const colors = searchColorTerms.filter((color) => new RegExp(`\\b${color}\\b`, "i").test(normalized));
  const materialPreferences = ["wood", "fabric", "leather", "glass", "metal"].filter((material) => new RegExp(`\\b${material}\\b`, "i").test(normalized));
  const numericSeats = normalized.match(/\b([1-9])\s*(?:persons?|people|seats?|seater)\b/)?.[1];
  const wordSeats = normalized.match(/\b(one|two|three|four)\s*(?:persons?|people|seats?|seater)\b/)?.[1];
  const seatCount = numericSeats ? Number(numericSeats) : wordSeats ? ({ one: 1, two: 2, three: 3, four: 4 } as const)[wordSeats as "one" | "two" | "three" | "four"] : undefined;
  const compact = /\b(?:small|compact|tiny|narrow|limited space|not much space|no much space|less space|smaller|too big)\b/i.test(normalized);
  const large = /\b(?:large|spacious|big room|big space)\b/i.test(normalized) && !/\btoo big\b/i.test(normalized);
  return {
    ...current,
    ...(compact ? { spaceSize: "compact" as const } : large ? { spaceSize: "large" as const } : {}),
    ...(colors.length ? { colors: [...new Set(colors)] } : {}),
    ...(materialPreferences.length ? { materialPreferences: [...new Set([...(current.materialPreferences ?? []), ...materialPreferences])] } : {}),
    ...(seatCount ? { seatCount } : {}),
    ...(parsed.maxWidthMm ? { maxWidthMm: parsed.maxWidthMm } : {}),
    ...(categories.length ? {
      requestedCategories: [...new Set([...(current.requestedCategories ?? []), ...categories])],
      lastCategory: categories.at(-1)
    } : {})
  };
}

function verifiedWidth(product: Product) {
  return product.verifiedFacts.dimensions ? product.widthMm : null;
}

function selectForCategory(category: Category, input: { question: string; context: ConversationContext; preferences: AdvisorPreferences; generatedIds: string[] }) {
  const { question, context, preferences, generatedIds } = input;
  const text = question.toLowerCase();
  const currentColors = searchColorTerms.filter((color) => new RegExp(`\\b${color}\\b`, "i").test(text));
  const referenced = products.filter((product) => context.referencedProductIds.includes(product.id) && productHasCategory(product, category));
  const alreadyShown = new Set([...(preferences.shownProductIds ?? []), ...referenced.map((product) => product.id)]);
  let candidates = products.filter((product) => product.active && productHasCategory(product, category));
  const wantsAnother = /\b(?:another|different|else|replace)\b/.test(text);
  const wantsSmaller = /\b(?:smaller|more compact|narrower|too big)\b/.test(text);

  if (wantsAnother) {
    candidates = candidates.filter((product) => !alreadyShown.has(product.id));
  }
  if (wantsSmaller && referenced.length) {
    const sourceWidths = referenced.map(verifiedWidth).filter((width): width is number => width !== null);
    const limit = sourceWidths.length ? Math.min(...sourceWidths) : null;
    const smaller = limit ? candidates.filter((product) => verifiedWidth(product) !== null && product.widthMm < limit) : [];
    if (smaller.length) candidates = smaller;
  }
  if (preferences.seatCount && ["sofa", "sectional", "armchair"].includes(category)) {
    const exactSeats = candidates.filter((product) => product.numberOfSeatsVerified && product.numberOfSeats === preferences.seatCount);
    if (exactSeats.length) candidates = exactSeats;
  }
  if (preferences.maxWidthMm) {
    const withinWidth = candidates.filter((product) => verifiedWidth(product) !== null && product.widthMm <= preferences.maxWidthMm!);
    if (withinWidth.length) candidates = withinWidth;
  }
  if (preferences.spaceSize === "compact") {
    const verifiedCompact = candidates.filter((product) => product.verifiedFacts.smallSpaceSuitable && product.smallSpaceSuitable);
    if (verifiedCompact.length) candidates = verifiedCompact;
  } else if (preferences.spaceSize === "large") {
    const largeRoomOptions = candidates.filter((product) => !(product.verifiedFacts.smallSpaceSuitable && product.smallSpaceSuitable));
    if (largeRoomOptions.length) candidates = largeRoomOptions;
  }
  if (currentColors.length && requestedCategories(question).length === 1) {
    candidates = candidates.filter((product) => currentColors.some((color) => product.verifiedFacts.colors.includes(color) && hasVerifiedColourPresentation(product.id, color)));
  } else if (preferences.colors?.length && !preferences.spaceSize) {
    const colorMatches = candidates.filter((product) => preferences.colors!.some((color) => product.verifiedFacts.colors.includes(color)));
    if (colorMatches.length) candidates = colorMatches;
  }

  const generatedOrder = new Map(generatedIds.map((id, index) => [id, index]));
  return candidates.sort((left, right) => {
    if (preferences.spaceSize === "large") return (verifiedWidth(right) ?? 0) - (verifiedWidth(left) ?? 0);
    if (preferences.spaceSize === "compact" || wantsSmaller) return (verifiedWidth(left) ?? Number.MAX_SAFE_INTEGER) - (verifiedWidth(right) ?? Number.MAX_SAFE_INTEGER);
    return (generatedOrder.get(left.id) ?? 999) - (generatedOrder.get(right.id) ?? 999) || left.modelCode.localeCompare(right.modelCode);
  });
}

export function groundAdvisorConversationTurn(question: string, context: ConversationContext, generated: AdvisorAnswer): AdvisorAnswer {
  const preferences = deriveAdvisorPreferences(question, context.approvedPreferences);
  let categories = requestedCategories(question);
  const followUp = /\b(?:another|different|else|replace|smaller|more compact|narrower|too big|too small|larger|bigger)\b/i.test(question);
  if (!categories.length && followUp && preferences.lastCategory) categories = [preferences.lastCategory];
  const discovery = /\b(?:want|need|find|show|recommend|suggest|looking|another|different|smaller|larger|bigger|too big|too small)\b/i.test(question);
  if (!categories.length || !discovery) return generated;

  const perCategory = categories.length > 1 ? 1 : 4;
  const selected = categories.flatMap((category) => selectForCategory(category, {
    question, context, preferences, generatedIds: generated.productIds
  }).slice(0, perCategory));
  const unique = [...new Map(selected.map((product) => [product.id, product])).values()].slice(0, 6);
  const explicitColors = searchColorTerms.filter((color) => new RegExp(`\\b${color}\\b`, "i").test(question));
  if (!unique.length && explicitColors.length && categories.length === 1) {
    const label = categories[0].replaceAll("-", " ");
    return advisorAnswerSchema.parse({
      answer: `I couldn’t find a validated ${explicitColors.join(" or ")} ${label} with a matching catalogue presentation. I won’t show a differently coloured product as if it matched.`,
      answerType: "missing-data",
      productIds: [], materialIds: [], sources: ["Musterring product catalogue"], proposedAction: null,
      suggestedQuestions: [`Show ${label} options in another colour`, `Show all validated ${label} options`]
    });
  }
  if (!unique.length && /\b(?:another|different|else|replace)\b/i.test(question)) {
    const label = categories.map((category) => category.replaceAll("-", " ")).join(" and ");
    return advisorAnswerSchema.parse({
      answer: `I don’t have another validated ${label} option that keeps the current preferences. I won’t repeat a product you already rejected; tell me which preference I may relax.`,
      answerType: "missing-data",
      productIds: [], materialIds: [], sources: ["Musterring product catalogue"], proposedAction: null,
      suggestedQuestions: [`Show all ${label} options`, "Relax the colour preference", "Relax the size preference"]
    });
  }
  if (!unique.length) return generated;

  const labels = categories.map((category) => category.replaceAll("-", " ")).join(" and ");
  const compactCopy = preferences.spaceSize === "compact" ? " for your compact-space brief" : preferences.spaceSize === "large" ? " for your larger room" : "";
  const answer = /\b(?:smaller|too big|more compact|narrower)\b/i.test(question)
    ? `You’re right — I’ve replaced the previous option with smaller ${labels} recommendations${compactCopy}. The cards below use only catalogue-grounded product data; physical fit still requires the fit check.`
    : /\b(?:another|different|else|replace)\b/i.test(question)
      ? `Of course — here are different ${labels} options${compactCopy}. I excluded every previously shown ${labels} from this result.`
      : `For your request, I found ${labels} recommendations${compactCopy}. I kept the remembered preferences that remain relevant and used only validated catalogue products.`;

  return advisorAnswerSchema.parse({
    ...generated,
    answer,
    answerType: "products",
    productIds: unique.map((product) => product.id),
    materialIds: categories.some((category) => ["sofa", "sectional", "armchair"].includes(category)) ? generated.materialIds : [],
    sources: ["Musterring product catalogue"],
    proposedAction: null,
    suggestedQuestions: unique.length > 1 ? [`Compare these ${labels} side by side`] : [`Show me another ${labels} option`]
  });
}

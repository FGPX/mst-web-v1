import type {
  StylistMaterialPreference,
  StylistPalette,
  StylistPreferences,
  StylistPriority,
  StylistQuizAnswer,
  StylistQuizInput,
  StylistRoomType,
  StylistSpaceSize,
  StylistStylePreference,
  StylistTarget
} from "../types";

export type StylistQuizOption = { id: string; label: string };
export type StylistQuizQuestion = {
  id: string;
  prompt: string;
  help?: string;
  options: StylistQuizOption[];
  visual?: boolean;
  dimensionOption?: string;
  noteOption?: string;
  noteLabel?: string;
  maxSelections?: number;
  exclusiveOptions?: string[];
  appliesToTargets?: StylistTarget[];
};

const option = (id: string, label: string): StylistQuizOption => ({ id, label });

export const stylistRoomOptions: Array<{ id: StylistRoomType; label: string; text: string }> = [
  { id: "living-room", label: "Living room", text: "Seating, tables and living storage" },
  { id: "bedroom", label: "Bedroom", text: "Beds, wardrobes and bedroom series" },
  { id: "dining-room", label: "Dining room", text: "Tables, seating and sideboards" },
  { id: "bathroom", label: "Bathroom", text: "Vanity units and bathroom storage" },
  { id: "hallway", label: "Hallway", text: "Wardrobes, shoe and coat storage" },
  { id: "kitchen", label: "Kitchen", text: "Storage, dining and seating ideas" },
  { id: "outdoor", label: "Outdoor", text: "Balcony, terrace, patio or garden" },
  { id: "home-accessories", label: "Home accessories", text: "Small furniture, carpets, lamps and textiles" }
];

export const stylistQuizByRoom: Record<StylistRoomType, StylistQuizQuestion[]> = {
  "living-room": [
    { id: "target", prompt: "What are you looking for?", options: [option("sofa", "Sofa"), option("armchair", "Armchair"), option("coffee-table", "Coffee table"), option("side-table", "Side table"), option("wall-unit", "Wall unit"), option("sideboard", "Sideboard"), option("complete-living-room", "Complete living room")] },
    { id: "seating-capacity", prompt: "How many people should the seating accommodate?", appliesToTargets: ["sofa", "complete-living-room"], options: [option("1-2", "1–2"), option("3", "3"), option("4", "4"), option("5-plus", "5+")] },
    { id: "sofa-format", prompt: "What sofa format do you prefer?", appliesToTargets: ["sofa"], options: [option("standard-sofa", "Standard sofa"), option("corner-sofa", "Corner sofa"), option("modular-sofa", "Modular sofa"), option("sofa-bed", "Sofa bed"), option("not-sure", "Not sure")] },
    { id: "armchair-function", prompt: "What kind of armchair do you want?", appliesToTargets: ["armchair"], options: [option("standard", "Standard"), option("recliner", "Recliner"), option("swivel", "Swivel"), option("electric-relax", "Electric relax"), option("no-preference", "No preference")] },
    { id: "storage-purpose", prompt: "What should the storage furniture prioritise?", appliesToTargets: ["wall-unit", "sideboard", "complete-living-room"], options: [option("media", "Media equipment"), option("display", "Display space"), option("closed-storage", "Closed storage"), option("mixed-storage", "A balanced mix")] },
    { id: "space", prompt: "What is the approximate available space?", help: "Dimensions are treated as maximum furniture limits, not a fit guarantee.", dimensionOption: "dimensions", options: [option("compact", "Compact"), option("medium", "Medium"), option("large", "Large"), option("dimensions", "Enter dimensions")] },
    { id: "material", prompt: "What upholstery do you prefer?", appliesToTargets: ["sofa", "armchair"], options: [option("fabric", "Fabric"), option("leather", "Leather"), option("mixed", "Mixed"), option("no-preference", "No preference")] },
    { id: "surface-material", prompt: "What main material do you prefer?", appliesToTargets: ["coffee-table", "side-table", "wall-unit", "sideboard"], options: [option("solid-wood", "Solid wood"), option("wood-look", "Wood look"), option("glass", "Glass"), option("metal", "Metal"), option("mixed", "Mixed materials"), option("no-preference", "No preference")] },
    { id: "style-colours", prompt: "What style and colours do you prefer?", visual: true, options: [option("light-neutral", "Light & neutral"), option("warm-natural", "Warm & natural"), option("dark-elegant", "Dark & elegant"), option("colourful", "Colourful"), option("not-sure", "Not sure")] }
  ],
  bedroom: [
    { id: "target", prompt: "What are you looking for?", options: [option("bed", "Bed"), option("wardrobe", "Wardrobe"), option("bedside-tables", "Bedside tables"), option("dresser", "Dresser"), option("bedroom-series", "Bedroom series"), option("complete-bedroom", "Complete bedroom")] },
    { id: "bed-size", prompt: "What bed size do you need?", appliesToTargets: ["bed", "complete-bedroom"], noteOption: "other", noteLabel: "Describe the required bed size", options: [option("140x200", "140 × 200"), option("160x200", "160 × 200"), option("180x200", "180 × 200"), option("200x200", "200 × 200"), option("other", "Other")] },
    { id: "bed-type", prompt: "What type of bed do you prefer?", appliesToTargets: ["bed"], options: [option("upholstered", "Upholstered"), option("wooden", "Wooden"), option("boxspring", "Boxspring"), option("no-preference", "No preference")] },
    { id: "additional-storage", prompt: "Do you need additional storage?", appliesToTargets: ["bed"], maxSelections: 3, exclusiveOptions: ["no"], options: [option("under-bed", "Under-bed storage"), option("wardrobe", "Wardrobe storage"), option("dresser", "Dresser storage"), option("no", "No")] },
    { id: "wardrobe-capacity", prompt: "How much wardrobe storage do you need?", appliesToTargets: ["wardrobe"], options: [option("compact-one-person", "Compact · one person"), option("standard-two-person", "Standard · two people"), option("generous", "Generous storage"), option("wall-to-wall", "Wall-to-wall storage")] },
    { id: "wardrobe-doors", prompt: "What type of wardrobe doors do you prefer?", appliesToTargets: ["wardrobe", "complete-bedroom"], options: [option("hinged", "Hinged doors"), option("sliding", "Sliding doors"), option("folding", "Folding doors"), option("no-preference", "No preference")] },
    { id: "wardrobe-interior", prompt: "What should the wardrobe interior prioritise?", appliesToTargets: ["wardrobe"], maxSelections: 3, exclusiveOptions: ["no-preference"], options: [option("hanging-space", "Hanging space"), option("shelving", "Shelving"), option("drawers", "Drawers"), option("shoe-storage", "Shoes & accessories"), option("no-preference", "No preference")] },
    { id: "bedside-quantity", prompt: "How many bedside tables do you need?", appliesToTargets: ["bedside-tables"], options: [option("one", "One"), option("two", "Two"), option("coordinated-set", "A coordinated set"), option("not-sure", "Not sure")] },
    { id: "bedside-storage", prompt: "What kind of bedside storage do you prefer?", appliesToTargets: ["bedside-tables"], options: [option("drawers", "Drawers"), option("open-shelf", "Open shelf"), option("combination", "Drawers + open shelf"), option("minimal", "Minimal surface only")] },
    { id: "dresser-size", prompt: "What dresser size works best?", appliesToTargets: ["dresser"], options: [option("compact", "Compact"), option("medium", "Medium"), option("wide", "Wide"), option("tall", "Tall chest")] },
    { id: "dresser-storage", prompt: "How should the dresser storage be organised?", appliesToTargets: ["dresser"], options: [option("mostly-drawers", "Mostly drawers"), option("drawers-doors", "Drawers + doors"), option("open-closed", "Open + closed storage"), option("no-preference", "No preference")] },
    { id: "series-pieces", prompt: "Which pieces should the bedroom series include?", appliesToTargets: ["bedroom-series", "complete-bedroom"], maxSelections: 4, options: [option("bed", "Bed"), option("wardrobe", "Wardrobe"), option("bedside-tables", "Bedside tables"), option("dresser", "Dresser")] },
    { id: "series-priority", prompt: "What matters most for the bedroom series?", appliesToTargets: ["bedroom-series"], maxSelections: 2, options: [option("matched-design", "A perfectly matched design"), option("flexible-combination", "Flexible combination"), option("maximum-storage", "Maximum storage"), option("coordinated-finishes", "Coordinated finishes")] },
    { id: "space", prompt: "How much space is available?", dimensionOption: "dimensions", options: [option("compact", "Compact"), option("medium", "Medium"), option("large", "Spacious"), option("dimensions", "Enter dimensions")] },
    { id: "atmosphere", prompt: "What atmosphere do you want?", visual: true, options: [option("calm-neutral", "Calm & neutral"), option("warm-cosy", "Warm & cosy"), option("modern", "Modern"), option("elegant", "Elegant"), option("dark-dramatic", "Dark & dramatic")] }
  ],
  "dining-room": [
    { id: "target", prompt: "What are you looking for?", options: [option("dining-table", "Dining table"), option("dining-chairs", "Chairs"), option("dining-bench", "Bench"), option("dining-sideboard", "Sideboard"), option("complete-dining-room", "Complete dining room")] },
    { id: "table-capacity", prompt: "How many people should it accommodate?", appliesToTargets: ["dining-table", "dining-chairs", "dining-bench", "complete-dining-room"], options: [option("2-4", "2–4"), option("4-6", "4–6"), option("6-8", "6–8"), option("8-plus", "8+")] },
    { id: "table-format", prompt: "What table format do you prefer?", appliesToTargets: ["dining-table", "complete-dining-room"], options: [option("fixed-rectangular", "Fixed rectangular"), option("extendable-rectangular", "Extendable rectangular"), option("round", "Round"), option("oval", "Oval"), option("no-preference", "No preference")] },
    { id: "seating-priority", prompt: "What matters most for the seating?", appliesToTargets: ["dining-chairs", "dining-bench"], options: [option("comfort", "Comfort"), option("easy-care", "Easy care"), option("compact-size", "Compact footprint"), option("mixed-seating", "Flexible mixed seating"), option("no-preference", "No preference")] },
    { id: "sideboard-storage", prompt: "What storage layout do you prefer?", appliesToTargets: ["dining-sideboard"], options: [option("drawers", "Mostly drawers"), option("doors", "Mostly doors"), option("open-display", "Open display"), option("combination", "Combination")] },
    { id: "material", prompt: "What main material do you prefer?", options: [option("solid-wood", "Solid wood"), option("wood-look", "Wood look"), option("fabric", "Upholstered fabric"), option("leather", "Leather"), option("glass", "Glass"), option("ceramic", "Ceramic"), option("mixed", "Mixed materials"), option("no-preference", "No preference")] },
    { id: "space", prompt: "How much space do you have?", dimensionOption: "dimensions", options: [option("compact", "Compact"), option("medium", "Medium"), option("large", "Large"), option("dimensions", "Enter dimensions")] },
    { id: "style-colours", prompt: "What style and colours do you prefer?", visual: true, options: [option("light-neutral", "Light & neutral"), option("warm-natural", "Warm & natural"), option("dark-elegant", "Dark & elegant"), option("modern", "Modern"), option("not-sure", "Not sure")] }
  ],
  bathroom: [
    { id: "target", prompt: "What are you looking for?", options: [option("vanity-unit", "Vanity unit"), option("washbasin-cabinet", "Washbasin cabinet"), option("tall-cabinet", "Tall cabinet"), option("mirror-cabinet", "Mirror cabinet"), option("bathroom-storage", "Storage"), option("complete-bathroom-series", "Complete bathroom series")] },
    { id: "storage-amount", prompt: "How much storage do you need?", options: [option("minimal", "Minimal"), option("moderate", "Moderate"), option("lots", "Lots of storage")] },
    { id: "space", prompt: "What size is your bathroom?", dimensionOption: "dimensions", options: [option("compact", "Small"), option("medium", "Medium"), option("large", "Large"), option("dimensions", "Enter dimensions")] },
    { id: "mounting", prompt: "Do you prefer wall-mounted or floor-standing furniture?", appliesToTargets: ["vanity-unit", "washbasin-cabinet", "tall-cabinet"], options: [option("wall-mounted", "Wall-mounted"), option("floor-standing", "Floor-standing"), option("no-preference", "No preference")] },
    { id: "storage-type", prompt: "What kind of storage do you prefer?", appliesToTargets: ["bathroom-storage", "complete-bathroom-series"], options: [option("drawers", "Drawers"), option("doors", "Doors"), option("open-shelving", "Open shelving"), option("combination", "Combination")] },
    { id: "finish", prompt: "What finish do you prefer?", options: [option("light-wood", "Light wood"), option("dark-wood", "Dark wood"), option("white", "White"), option("dark-colours", "Dark colours"), option("natural-tones", "Natural tones")] },
    { id: "bathroom-style", prompt: "What style should the bathroom have?", visual: true, options: [option("minimal", "Minimal"), option("warm-natural", "Warm & natural"), option("modern", "Modern"), option("elegant", "Elegant"), option("spa-like", "Spa-like")] }
  ],
  hallway: [
    { id: "target", prompt: "What are you looking for?", options: [option("hallway-wardrobe", "Wardrobe"), option("shoe-storage", "Shoe storage"), option("coat-storage", "Coat storage"), option("hallway-bench", "Bench"), option("mirror", "Mirror"), option("complete-hallway", "Complete hallway")] },
    { id: "store-items", prompt: "What do you need to store?", appliesToTargets: ["hallway-wardrobe", "shoe-storage", "coat-storage", "complete-hallway"], maxSelections: 4, exclusiveOptions: ["everything"], options: [option("coats", "Coats"), option("shoes", "Shoes"), option("bags", "Bags"), option("accessories", "Accessories"), option("everything", "Everything")] },
    { id: "users", prompt: "How many people use the hallway regularly?", appliesToTargets: ["hallway-wardrobe", "shoe-storage", "coat-storage", "hallway-bench", "complete-hallway"], options: [option("1-2", "1–2"), option("3-4", "3–4"), option("5-plus", "5+")] },
    { id: "space", prompt: "How much space do you have?", dimensionOption: "dimensions", options: [option("compact", "Very compact"), option("medium", "Medium"), option("large", "Spacious"), option("dimensions", "Enter dimensions")] },
    { id: "storage-openness", prompt: "Do you prefer closed or open storage?", appliesToTargets: ["hallway-wardrobe", "shoe-storage", "coat-storage", "complete-hallway"], options: [option("mostly-closed", "Mostly closed"), option("mostly-open", "Mostly open"), option("combination", "Combination")] },
    { id: "look", prompt: "What look do you prefer?", visual: true, options: [option("light-minimal", "Light & minimal"), option("warm-wood", "Warm wood"), option("modern", "Modern"), option("elegant", "Elegant"), option("dark", "Dark")] }
  ],
  kitchen: [
    { id: "target", prompt: "What would you like help with?", options: [option("kitchen-storage", "Storage"), option("kitchen-dining-area", "Dining area"), option("kitchen-seating", "Seating"), option("kitchen-small-furniture", "Small furniture"), option("complete-kitchen-concept", "Complete kitchen concept")] },
    { id: "users", prompt: "How many people normally use the kitchen?", appliesToTargets: ["kitchen-dining-area", "kitchen-seating", "complete-kitchen-concept"], options: [option("1-2", "1–2"), option("3-4", "3–4"), option("5-plus", "5+")] },
    { id: "main-use", prompt: "How will you mainly use this furniture?", appliesToTargets: ["kitchen-small-furniture"], maxSelections: 2, exclusiveOptions: ["everything"], options: [option("cooking", "Cooking support"), option("family-meals", "Family meals"), option("entertaining", "Entertaining"), option("quick-meals", "Quick meals"), option("everything", "Everything")] },
    { id: "additional-storage", prompt: "How much additional storage do you need?", appliesToTargets: ["kitchen-storage", "complete-kitchen-concept"], options: [option("lots", "A lot"), option("some", "Some additional storage"), option("minimal", "Only a little")] },
    { id: "dining-area", prompt: "What dining format do you prefer?", appliesToTargets: ["kitchen-dining-area", "kitchen-seating", "complete-kitchen-concept"], options: [option("dining-table", "Dining table"), option("breakfast-area", "Breakfast area"), option("bar-seating", "Bar seating"), option("flexible", "Flexible / extendable")] },
    { id: "space", prompt: "How much space is available?", dimensionOption: "dimensions", options: [option("compact", "Compact"), option("medium", "Medium"), option("large", "Large"), option("dimensions", "Enter dimensions")] },
    { id: "kitchen-style", prompt: "What style do you prefer?", visual: true, options: [option("modern", "Modern"), option("minimal", "Minimal"), option("warm-natural", "Warm & natural"), option("elegant", "Elegant"), option("industrial", "Industrial")] }
  ],
  outdoor: [
    { id: "outdoor-type", prompt: "What type of outdoor space are you furnishing?", options: [option("balcony", "Balcony"), option("terrace", "Terrace"), option("patio", "Patio"), option("garden", "Garden")] },
    { id: "target", prompt: "What are you looking for?", options: [option("outdoor-sofa", "Outdoor sofa"), option("outdoor-chairs", "Chairs"), option("outdoor-dining-table", "Dining table"), option("lounge-furniture", "Lounge furniture"), option("lounger", "Lounger"), option("complete-outdoor-set", "Complete outdoor set")] },
    { id: "main-use", prompt: "How will you mainly use the space?", appliesToTargets: ["complete-outdoor-set"], maxSelections: 3, exclusiveOptions: ["everything"], options: [option("relaxing", "Relaxing"), option("dining", "Dining"), option("entertaining", "Entertaining"), option("sunbathing", "Sunbathing"), option("everything", "Everything")] },
    { id: "capacity", prompt: "How many people should it accommodate?", appliesToTargets: ["outdoor-sofa", "outdoor-chairs", "outdoor-dining-table", "lounge-furniture", "complete-outdoor-set"], options: [option("1-2", "1–2"), option("3-4", "3–4"), option("5-6", "5–6"), option("7-plus", "7+")] },
    { id: "space", prompt: "How much space do you have?", dimensionOption: "dimensions", options: [option("compact", "Small balcony"), option("medium", "Medium terrace"), option("large", "Large outdoor area"), option("dimensions", "Enter dimensions")] },
    { id: "outdoor-priority", prompt: "What is most important?", appliesToTargets: ["outdoor-sofa", "outdoor-chairs", "outdoor-dining-table", "lounge-furniture", "lounger"], maxSelections: 2, options: [option("comfort", "Comfort"), option("easy-care", "Easy care"), option("weather-resistance", "Weather resistance"), option("flexible", "Flexible arrangement"), option("compact-size", "Compact size")] },
    { id: "outdoor-look", prompt: "What look do you prefer?", visual: true, options: [option("natural", "Natural"), option("modern", "Modern"), option("minimal", "Minimal"), option("dark-elegant", "Dark & elegant"), option("mediterranean", "Mediterranean")] }
  ],
  "home-accessories": [
    { id: "target", prompt: "What are you looking for?", options: [option("small-furniture", "Small furniture"), option("carpet", "Carpet"), option("lamp", "Lamp"), option("home-textiles", "Home textiles"), option("several-accessories", "Several accessories")] },
    { id: "decorating-room", prompt: "Which room are you decorating?", noteOption: "other", noteLabel: "Describe the room", options: [option("living-room", "Living room"), option("bedroom", "Bedroom"), option("dining-room", "Dining room"), option("hallway", "Hallway"), option("other", "Other")] },
    { id: "goal", prompt: "What are you trying to achieve?", maxSelections: 3, options: [option("cosier", "Make it cosier"), option("add-colour", "Add colour"), option("add-lighting", "Add lighting"), option("complete-room", "Complete the room"), option("refresh-style", "Refresh the style")] },
    { id: "existing-colours", prompt: "What colours are already in the room?", appliesToTargets: ["carpet", "home-textiles", "several-accessories"], noteOption: "describe", noteLabel: "Describe the existing colours", maxSelections: 3, exclusiveOptions: ["describe"], options: [option("light-neutral", "Light neutrals"), option("warm-natural", "Warm natural tones"), option("dark", "Dark tones"), option("colourful", "Colourful"), option("describe", "I’ll describe them")] },
    { id: "carpet-size", prompt: "What carpet size do you need?", appliesToTargets: ["carpet"], noteOption: "other", noteLabel: "Describe the required carpet size", options: [option("small", "Small accent rug"), option("medium", "Medium room rug"), option("large", "Large seating-area rug"), option("runner", "Runner"), option("other", "Other")] },
    { id: "lamp-type", prompt: "What type of lamp do you need?", appliesToTargets: ["lamp"], options: [option("floor-lamp", "Floor lamp"), option("table-lamp", "Table lamp"), option("pendant", "Pendant"), option("wall-light", "Wall light"), option("not-sure", "Not sure")] },
    { id: "visual-impact", prompt: "Should it blend in or stand out?", appliesToTargets: ["small-furniture", "lamp", "home-textiles"], options: [option("blend-in", "Blend in"), option("subtle-accent", "Subtle accent"), option("statement", "Statement piece")] },
    { id: "accessory-style", prompt: "What style should it match?", visual: true, options: [option("modern", "Modern"), option("minimal", "Minimal"), option("natural", "Natural"), option("elegant", "Elegant"), option("decorative", "Decorative")] },
    { id: "match-selected", prompt: "Should the accessories match furniture you already selected?", appliesToTargets: ["several-accessories"], help: "The current MVP records this preference; direct project-product matching can be connected next.", options: [option("yes", "Yes"), option("no", "No")] }
  ]
};

const styleMap: Record<string, StylistStylePreference> = {
  modern: "modern-contemporary", minimal: "minimalist-scandinavian", "light-minimal": "minimalist-scandinavian",
  "light-neutral": "minimalist-scandinavian", "calm-neutral": "minimalist-scandinavian", "warm-natural": "warm-natural-rustic", "warm-cosy": "warm-natural-rustic",
  "warm-wood": "warm-natural-rustic", natural: "warm-natural-rustic", mediterranean: "warm-natural-rustic",
  elegant: "classic-elegant-luxury", "dark-elegant": "classic-elegant-luxury", "dark-dramatic": "classic-elegant-luxury",
  industrial: "industrial-urban", colourful: "retro-decorative", decorative: "retro-decorative"
};

const paletteMap: Record<string, StylistPalette> = {
  "light-neutral": "light-neutral", "calm-neutral": "light-neutral", "light-minimal": "light-neutral", white: "light-neutral",
  "warm-natural": "warm-natural", "warm-cosy": "warm-natural", "warm-wood": "warm-natural", natural: "warm-natural",
  "natural-tones": "warm-natural", "light-wood": "warm-natural", "dark-elegant": "dark-tones", "dark-dramatic": "dark-tones",
  dark: "dark-tones", "dark-wood": "dark-tones", "dark-colours": "dark-tones", colourful: "colour-accents"
};

export function stylistAnswerValues(answer: StylistQuizAnswer | undefined) {
  return answer === undefined ? [] : Array.isArray(answer) ? answer : [answer];
}

export function stylistQuestionsForAnswers(roomType: StylistRoomType, answers: Record<string, StylistQuizAnswer>) {
  const target = stylistAnswerValues(answers.target)[0] as StylistTarget | undefined;
  return stylistQuizByRoom[roomType].filter((question) => !question.appliesToTargets || Boolean(target && question.appliesToTargets.includes(target)));
}

function firstMapped<T>(answers: Record<string, StylistQuizAnswer>, map: Record<string, T>, fallback: T) {
  for (const answer of Object.values(answers)) {
    for (const value of stylistAnswerValues(answer)) if (value in map) return map[value]!;
  }
  return fallback;
}

export function validateStylistQuizInput(input: StylistQuizInput) {
  const questions = stylistQuestionsForAnswers(input.roomType, input.answers);
  if (!questions) return false;
  if (Object.keys(input.answers).length !== questions.length) return false;
  const questionIds = new Set(questions.map((question) => question.id));
  if (Object.keys(input.notes).some((questionId) => !questionIds.has(questionId))) return false;
  for (const question of questions) {
    const answer = input.answers[question.id];
    const values = stylistAnswerValues(answer);
    if (!values.length || values.some((value) => !question.options.some((candidate) => candidate.id === value))) return false;
    if (new Set(values).size !== values.length) return false;
    if (question.maxSelections) {
      if (values.length > question.maxSelections) return false;
      if (values.length > 1 && question.exclusiveOptions?.some((value) => values.includes(value))) return false;
    } else if (Array.isArray(answer)) {
      return false;
    }
    if (question.noteOption && values.includes(question.noteOption) && !input.notes[question.id]?.trim()) return false;
  }
  const dimensionQuestion = questions.find((question) => question.dimensionOption && stylistAnswerValues(input.answers[question.id]).includes(question.dimensionOption));
  if (dimensionQuestion) return Boolean(input.maxWidthMm && input.maxDepthMm);
  return input.maxWidthMm === null && input.maxDepthMm === null;
}

export function normalizeStylistQuiz(input: StylistQuizInput): StylistPreferences {
  if (!validateStylistQuizInput(input)) throw new Error("Invalid stylist quiz answers.");
  const target = stylistAnswerValues(input.answers.target)[0] as StylistTarget;
  const aestheticQuestionIds = new Set(["style-colours", "atmosphere", "bathroom-style", "look", "kitchen-style", "outdoor-look", "accessory-style"]);
  const aestheticAnswers = Object.fromEntries(Object.entries(input.answers).filter(([questionId]) => aestheticQuestionIds.has(questionId)));
  const selectedStyle = firstMapped(aestheticAnswers, styleMap, "not-sure" as StylistStylePreference);
  const style = selectedStyle === "not-sure" && input.styleDirection ? input.styleDirection : selectedStyle;
  const palette = firstMapped(input.answers, paletteMap, "no-preference" as StylistPalette);
  const materialValue = stylistAnswerValues(input.answers.material ?? input.answers["surface-material"])[0];
  const material: StylistMaterialPreference | null = materialValue === "fabric" || materialValue === "leather" || materialValue === "mixed" || materialValue === "no-preference"
    ? materialValue
    : materialValue === "solid-wood" || materialValue === "wood-look" ? "wood" : null;
  const spaceValue = stylistAnswerValues(input.answers.space)[0];
  const spaceSize: StylistSpaceSize = spaceValue === "compact" ? "compact" : spaceValue === "large" ? "large" : spaceValue === "dimensions" ? "known-dimensions" : "medium";
  const priorities = new Set<StylistPriority>();
  const values = Object.values(input.answers).flatMap(stylistAnswerValues);
  if (values.some((value) => ["maximum-comfort", "comfort", "relaxing"].includes(value))) priorities.add("comfort");
  if (values.some((value) => ["easy-care", "weather-resistance"].includes(value))) priorities.add("easy-care");
  if (values.some((value) => ["modular-sofa", "flexible", "sofa-bed", "combination"].includes(value))) priorities.add("flexible-modular");
  if (values.some((value) => ["compact", "compact-size"].includes(value))) priorities.add("compact-footprint");
  if (values.some((value) => ["relax-function", "recliner", "electric-relax", "adjustable-headrest", "adjustable-functions"].includes(value))) priorities.add("relax-functions");
  if (values.some((value) => ["solid-wood", "leather", "ceramic", "design"].includes(value))) priorities.add("premium-materials");
  return { ...input, target, style, palette, material, spaceSize, priorities: [...priorities].slice(0, 2) };
}

export function stylistAnswerLabel(roomType: StylistRoomType, questionId: string, answer: StylistQuizAnswer | undefined) {
  const question = stylistQuizByRoom[roomType].find((candidate) => candidate.id === questionId);
  return stylistAnswerValues(answer).map((answerId) => (
    question?.options.find((candidate) => candidate.id === answerId)?.label ?? answerId.replaceAll("-", " ")
  )).join(", ");
}

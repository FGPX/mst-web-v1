"use client";

import Image from "@/components/HighQualityImage";
import { ArrowRight, Camera, History, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import { productHasCategory, type Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { CompareSelectionBar } from "./CompareSelectionBar";

const suggestions = [
  "Beige modular sofa under 300 cm",
  "Black modern sofa with relax function",
  "Taupe swivel armchair",
  "Brown oak storage cabinet",
  "Black minimal coffee table"
];

const cutoutSlugs = new Set(["justb-pm100", "justb-pm200", "mr-lucia", "mr-230", "mr-260", "mr-270", "mr-280", "mr-285", "mr-nils", "mr-pamela", "mr-231", "jana", "kanto", "justb-ct100", "nara", "mr-kleo", "mr-281", "mr-5111", "mr-9445"]);

const autocompleteCategories: Array<{ category: Product["category"]; aliases: string[] }> = [
  { category: "sofa", aliases: ["sofa", "couch"] },
  { category: "armchair", aliases: ["armchair"] },
  { category: "sectional", aliases: ["sectional", "corner"] },
  { category: "storage", aliases: ["storage", "cabinet", "sideboard", "hallway", "cloakroom"] },
  { category: "coffee-table", aliases: ["coffee"] },
  { category: "dining-table", aliases: ["dining", "table"] },
  { category: "dining-chair", aliases: ["dining chair"] },
  { category: "bedroom-series", aliases: ["bedroom"] },
  { category: "bed", aliases: ["bed", "mattress", "topper"] },
  { category: "wardrobe", aliases: ["wardrobe", "closet"] },
  { category: "bathroom", aliases: ["bathroom"] },
  { category: "kitchen", aliases: ["kitchen"] },
  { category: "outdoor", aliases: ["outdoor", "garden"] },
  { category: "carpet", aliases: ["carpet", "rug"] },
  { category: "lamp", aliases: ["lamp", "lighting"] },
  { category: "small-furniture", aliases: ["occasional"] },
  { category: "home-textile", aliases: ["textile", "bedding", "linen"] }
];

const compactMatchReason = (reason: string) => {
  const concise = reason
    .replace(/^requested colour family:\s*/i, "")
    .replace(/^requested\s+/i, "")
    .replace(/\s+catalogue flag$/i, "")
    .replace(/\s+function$/i, "");
  return concise.charAt(0).toUpperCase() + concise.slice(1);
};

const intentLabels: Record<string, string> = {
  category: "Category",
  colorFamilies: "Colour",
  materials: "Material",
  maxWidthMm: "Maximum width",
  minWidthMm: "Minimum width",
  targetWidthMm: "Target width",
  minSeatHeightMm: "Minimum seat height",
  maxSeatDepthMm: "Maximum seat depth",
  numberOfSeats: "Seats",
  modular: "Modular",
  functions: "Functions",
  styles: "Style",
  roomType: "Room",
  smallSpaceSuitable: "Small-space suitable",
  excludedColorFamilies: "Exclude colour",
  excludedFunctions: "Without functions",
  layoutShapes: "Layout"
};

const formatIntentValue = (key: string, value: unknown) => {
  if (typeof value === "number" && /Mm$/.test(key)) return `${Math.round(value / 10)} cm`;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  return String(value).replace(/-/g, " ");
};

type SearchResponse = {
  intent: Record<string, unknown>;
  exactMatches: Array<{ product: Product; reasons: string[] }>;
  closeAlternatives: Array<{ product: Product; reasons: string[] }>;
  exactColorAvailable: boolean;
  categoryAvailable: boolean;
  unverifiedRequirements: string[];
  ai: { mode: string; fallback: boolean };
};

type VisualMatch = {
  product: Product;
  score: number;
  label: string;
  reasons: string[];
  differences: string[];
};

export function SearchExperience({ initialQuery = "" }: { initialQuery?: string }) {
  const visualInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);
  const [recent, setRecent] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [visualDragActive, setVisualDragActive] = useState(false);
  const [visualUploadError, setVisualUploadError] = useState("");
  const [visualPreview, setVisualPreview] = useState("");
  const [visualPending, setVisualPending] = useState(false);
  const [visualMatches, setVisualMatches] = useState<VisualMatch[]>([]);
  const [visualAnalysis, setVisualAnalysis] = useState("");
  const [visualNoMatchReason, setVisualNoMatchReason] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  useEffect(() => setRecent(storage.recentSearches()), []);

  const requestedRed = Array.isArray(response?.intent.colorFamilies) &&
    response.intent.colorFamilies.some((color) => ["red", "burgundy", "barolo"].includes(String(color)));
  const resultImage = (slug: string, productId: string) => {
    if (requestedRed && slug === "mr-260") return "/musterring-catalog/mr-260/image-08-hq.jpg?v=4";
    if (cutoutSlugs.has(slug)) return `/generated-product-views/${slug}/official-front.png?v=3`;
    return productImages(productId)[0];
  };

  const submit = async (value = query) => {
    const next = value.trim();
    if (!next) return;
    setQuery(next);
    setSubmitted(next);
    setPending(true);
    setError("");
    setRecent(storage.saveRecentSearch(next));
    storage.track({ name: "ai_search_submitted" });
    const result = await fetch("/api/ai/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: next })
    }).catch(() => null);
    const payload = result ? await result.json().catch(() => null) : null;
    setPending(false);
    if (!result?.ok || !payload?.intent) {
      setError(payload?.error ?? "Search interpretation failed. Please try again.");
      storage.track({ name: "ai_search_failed" });
      return;
    }
    setResponse(payload);
    storage.track({ name: "ai_intent_parsed" });
  };

  useEffect(() => { if (initialQuery) void submit(initialQuery); /* URL query runs once */ }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (response && response.exactMatches.length === 0) storage.track({ name: "search_zero_results" });
  }, [response]);

  const autocomplete = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (value.length < 2 || value === submitted.toLowerCase()) return [];
    const terms = value.split(/[^a-z0-9]+/).filter(Boolean);
    const categoryTerms = new Set<string>();
    const inferredCategory = autocompleteCategories.find(({ aliases }) => aliases.some((alias) =>
      terms.some((term) => {
        const isCategoryTerm = term.length >= 3 && (alias.startsWith(term) || term.startsWith(alias));
        if (isCategoryTerm) categoryTerms.add(term);
        return isCategoryTerm;
      })
    ))?.category;

    return products.filter((product) => {
      if (!product.active || (inferredCategory && !productHasCategory(product, inferredCategory))) return false;
      const words = `${product.modelCode} ${product.name} ${product.subtitle} ${(product.categories ?? [product.category]).join(" ")} ${product.colors.join(" ")} ${product.styles.join(" ")} ${product.functions.join(" ")} ${Math.round(product.widthMm / 10)} cm wide ${Math.round(product.depthMm / 10)} cm deep ${Math.round(product.heightMm / 10)} cm high`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      return terms.every((term) => categoryTerms.has(term) || words.some((word) => word.startsWith(term)));
    }).slice(0, 5);
  }, [query, submitted]);

  const removeFilter = (key: string) => {
    const replacements: Record<string, RegExp> = {
      category: /\b(sofa|couch|armchair|chair|sectional|corner|storage|cabinet|coffee table|side table|dining table|dining chair|bed|wardrobe|outdoor|garden furniture|carpet|rug|lamp|bathroom|kitchen|kitchen unit)\b/gi,
      colorFamilies: /\b(beige|ivory|taupe|stone|charcoal|brown|cream|green|grey|graphite|red|burgundy|barolo)\b/gi,
      modular: /\b(?:(?:not|no|without|non[- ]?)\s+)?(?:modular|module|flexible)\b/gi,
      functions: /\b(?:relax|recline|lounge|electric|motor|power)(?:\s+function)?\b/gi,
      excludedFunctions: /\b(?:not|no|without|non[- ]?)\s+(?:relax|recline|lounge|electric|motor|power)(?:\s+function)?\b/gi,
      excludedColorFamilies: /\b(?:(?:not|no|without)\s+(?:an?\s+)?|non[- ]|anything\s+but\s+)(?:beige|ivory|taupe|stone|charcoal|black|white|brown|oak|natural|cream|green|grey|graphite|red|burgundy|barolo|purple|blue|orange|pink|yellow|mustard|cognac|sand)\b/gi,
      smallSpaceSuitable: /\b(small|compact|apartment)\b/gi,
      maxWidthMm: /\b(?:maximum width|max|under|below|less than|at most|no wider than|up to)\s*\d+(?:[.,]\d+)?\s*(?:mm|cm|m|millimeters?|centimeters?|meters?)\b/gi,
      minWidthMm: /\b(?:minimum width|min|above|over|more than|at least|greater than)\s*\d+(?:[.,]\d+)?\s*(?:mm|cm|m|millimeters?|centimeters?|meters?)\b/gi,
      targetWidthMm: /\b(?:around|about|approximately|approx\.?|roughly)?\s*\d+(?:[.,]\d+)?\s*(?:mm|cm|m|millimeters?|centimeters?|meters?)(?:\s+(?:wide|width|sofa|couch|kitchen))?\b/gi,
      layoutShapes: /\b(?:l[- ]shaped|l shape|u[- ]shaped|u shape|straight(?: line)?|single[- ]wall|island|corner kitchen)\b/gi
    };
    const next = (replacements[key] ? submitted.replace(replacements[key], " ") : submitted).replace(/\s+/g, " ").trim();
    void submit(next || "furniture");
  };

  const toggleCompare = (productId: string) => setCompareIds((current) =>
    current.includes(productId) ? current.filter((id) => id !== productId) : current.length < 3 ? [...current, productId] : current
  );

  const exact = response?.exactMatches ?? [];

  const startVisualUpload = async (file?: File) => {
    if (!file) return;
    setVisualUploadError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setVisualUploadError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setVisualUploadError("Choose an image smaller than 10 MB.");
      return;
    }
    if (visualPreview) URL.revokeObjectURL(visualPreview);
    setVisualPreview(URL.createObjectURL(file));
    setVisualPending(true);
    setVisualMatches([]);
    setVisualAnalysis("");
    setVisualNoMatchReason("");
    storage.track({ name: "visual_search_uploaded" });
    const form = new FormData();
    form.append("image", file);
    form.append("consent", "true");
    form.append("observedColors", "[]");
    const response = await fetch("/api/ai/image", { method: "POST", body: form }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    setVisualPending(false);
    if (!response?.ok || !payload?.tags) {
      setVisualUploadError(payload?.error ?? "Visual analysis could not be completed. Please try another image.");
      return;
    }
    const matches = payload.matches ?? [];
    setVisualMatches(matches);
    setVisualNoMatchReason(payload.noMatchReason ?? "");
    setVisualAnalysis([
      payload.tags.category ? String(payload.tags.category).replace(/-/g, " ") : "Furniture",
      ...(payload.tags.colorFamilies ?? []).slice(0, 2),
      payload.ai?.mode
    ].filter(Boolean).join(" · "));
    storage.track({ name: "visual_search_analyzed" });
    if (matches.length) {
      window.setTimeout(() => document.getElementById("visual-recommendations")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  };

  useEffect(() => () => {
    if (visualPreview) URL.revokeObjectURL(visualPreview);
  }, [visualPreview]);

  return (
    <div className={`stitch-ai-search ${requestedRed ? "is-colour-search" : ""} ${submitted ? "has-results" : ""}`}>
      <section className="stitch-ai-search-hero">
        <div className="container">
          <div className="stitch-ai-kicker"><Sparkles size={16} /> Guided Product Search</div>
          <h1 className="stitch-ai-title">What are you looking for?</h1>
          <form onSubmit={(event) => { event.preventDefault(); void submit(); }} role="search">
            <div className="stitch-ai-input-row">
              <Search size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: I need a compact beige modular sofa for a small apartment, maximum width 240 cm." aria-label="Describe the furniture you are looking for" />
              {query ? <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setSubmitted(""); setResponse(null); }}><X /></button> : null}
              <button type="submit" aria-label="Search products"><ArrowRight /></button>
            </div>
          </form>
          {autocomplete.length ? (
            <div className="stitch-search-autocomplete" role="listbox" aria-label="Product suggestions">
              {autocomplete.map((product) => (
                <button type="button" role="option" aria-selected="false" key={product.id} onClick={() => void submit(product.modelCode)}>
                  <Image src={resultImage(product.slug, product.id)} alt="" width={64} height={48} />
                  <span>
                    <strong>{product.modelCode}</strong>
                    <small>{product.category} · {Math.round(product.widthMm / 10)} cm wide</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : null}
          {!submitted ? <div className={`stitch-ai-discovery ${visualPreview ? "has-visual-search" : ""}`}>
            <div className="stitch-ai-visual-upload-shell" id="visual-search">
              <button
                className={`stitch-ai-visual-entry ${visualDragActive ? "is-dragging" : ""}`}
                type="button"
                onClick={() => visualInputRef.current?.click()}
                onDragEnter={(event) => { event.preventDefault(); setVisualDragActive(true); }}
                onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; setVisualDragActive(true); }}
                onDragLeave={() => setVisualDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setVisualDragActive(false);
                  void startVisualUpload(event.dataTransfer.files?.[0]);
                }}
              >
                {visualPreview ? (
                  // Blob URLs are local previews and cannot use the Next image optimizer.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={visualPreview} alt="Selected visual search reference" />
                ) : <i aria-hidden="true"><Camera size={27} /></i>}
                <strong>{visualPending ? "Searching catalogue…" : visualPreview ? "Change image" : "Visual Search"}</strong>
                <span>{visualDragActive ? "Drop the image to analyze it" : visualPreview ? "Upload another image or review the recommendations" : "Upload or drag an image to find similar pieces"}</span>
                <b>{visualDragActive ? "Drop & analyze" : visualPreview ? "Choose another" : "Upload & analyze"}</b>
                {visualUploadError ? <em role="alert">{visualUploadError}</em> : null}
              </button>
              <input
                ref={visualInputRef}
                hidden
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onClick={(event) => { event.currentTarget.value = ""; }}
                onChange={(event) => void startVisualUpload(event.target.files?.[0])}
              />
            </div>
            {visualPreview ? (
              <div className="stitch-inline-visual-results" aria-live="polite">
                <div className="stitch-inline-visual-results-head">
                  <div><p className="stitch-ai-label">Visual recommendations</p>{visualAnalysis ? <small>{visualAnalysis}</small> : null}</div>
                  {visualMatches.length ? <strong>{visualMatches.length} catalogue {visualMatches.length === 1 ? "match" : "matches"}</strong> : null}
                </div>
                {visualPending ? (
                  <div className="stitch-inline-visual-status"><Sparkles className="spin" /><strong>Analyzing the image and checking the Musterring catalogue…</strong></div>
                ) : visualUploadError ? (
                  <div className="stitch-inline-visual-status is-error"><X /><strong>{visualUploadError}</strong></div>
                ) : visualMatches.length ? (
                  <div className="stitch-inline-visual-status is-ready"><Sparkles /><strong>{visualMatches.length} catalogue recommendations are ready below.</strong></div>
                ) : (
                  <div className="stitch-inline-visual-status"><Search /><strong>{visualNoMatchReason || "No grounded catalogue match was found. Try another furniture image."}</strong></div>
                )}
              </div>
            ) : <div className="stitch-ai-search-lists">
              <section>
                <p className="stitch-ai-label">Suggested searches</p>
                <div className="stitch-ai-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => void submit(suggestion)}><Search size={13} />{suggestion}</button>)}</div>
              </section>
              <section>
                <p className="stitch-ai-label">Recent searches</p>
                {recent.length ? <div className="stitch-ai-suggestions" aria-label="Recent searches">{recent.slice(0, 5).map((item) => <button type="button" key={item} onClick={() => void submit(item)}><History size={13} />{item}</button>)}</div> : <p className="stitch-ai-empty-recent">Your recent searches will appear here.</p>}
              </section>
            </div>}
          </div> : null}
        </div>
      </section>

      {!submitted && visualPreview && visualMatches.length ? (
        <section className="section stitch-ai-results stitch-visual-catalogue-results" id="visual-recommendations">
          <div className="container">
            <div className="stitch-ai-results-head">
              <div>
                <p className="eyebrow">Your visual search results</p>
                <h1 className="h2">{visualMatches.length} catalogue {visualMatches.length === 1 ? "recommendation" : "recommendations"}</h1>
                {visualAnalysis ? <details className="search-technical-details"><summary>How these results were prepared</summary><p>{visualAnalysis} · ranked against available catalogue data</p></details> : null}
              </div>
            </div>
            <p className="stitch-search-catalogue-notice">Recommendations are based on visible similarity. Product identity, dimensions, upholstery and availability require catalogue or retailer confirmation.</p>
            <div className="grid grid-3">
              {visualMatches.map((match) => (
                <ProductCard
                  key={match.product.id}
                  product={match.product}
                  imageOverride={productImages(match.product.id)[0]}
                  explanation={`${match.label}: ${match.reasons.map(compactMatchReason).join(" · ") || "Same detected furniture category"}`}
                  showMeta={false}
                  compareSelected={compareIds.includes(match.product.id)}
                  onCompare={() => toggleCompare(match.product.id)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {submitted ? (
        <section className="section stitch-ai-results">
          <div className="container">
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <div className="stitch-ai-results-head">
              <div>
                <p className="eyebrow">Your search results</p>
                <h1 className="h2">{exact.length} exact catalogue {exact.length === 1 ? "match" : "matches"}</h1>
                {response ? <details className="search-technical-details"><summary>How these results were prepared</summary><p>{response.ai.mode}{response.ai.fallback ? " · fallback used" : ""} · checked against available catalogue data</p></details> : null}
              </div>
              <div className="chips" aria-label="Editable interpreted request">
                {Object.entries(response?.intent ?? {}).filter(([key, value]) => key !== "queryText" && value !== null && value !== "" && (!Array.isArray(value) || value.length)).map(([key, value]) =>
                  <button type="button" className="chip" key={key} onClick={() => removeFilter(key)} aria-label={`Remove ${intentLabels[key] ?? key} filter`}>{intentLabels[key] ?? key}: {formatIntentValue(key, value)} ×</button>)}
              </div>
            </div>
            {response && [...exact, ...response.closeAlternatives].some(({ product }) => product.authorizedContent) ? (
              <p className="stitch-search-catalogue-notice">Dimensions and prices vary by configuration and are confirmed by a Musterring retailer.</p>
            ) : null}
            {pending ? <div className="card card-body" role="status">Interpreting request and searching validated catalogue data…</div> : exact.length ? (
              <div className="grid grid-3">{exact.map(({ product, reasons }) => <ProductCard key={product.id} product={product} imageOverride={resultImage(product.slug, product.id)} imageNote={requestedRed ? (product.slug === "mr-260" ? "Catalogue photo: red leather" : "Red upholstery option · photo shows another finish") : undefined} explanation={`Matches: ${reasons.map(compactMatchReason).join(" · ") || "Catalogue relevance"}`} showMeta={false} compareSelected={compareIds.includes(product.id)} onCompare={() => toggleCompare(product.id)} />)}</div>
            ) : response ? (
              <div className="card card-body">
                <h2>No exact catalogue match</h2>
                <p>{!response.categoryAvailable
                  ? `There are no active ${String(response.intent.category ?? "requested-category").replace(/-/g, " ")} products in the connected catalogue.`
                  : response.unverifiedRequirements.length
                    ? `The catalogue does not currently verify ${response.unverifiedRequirements.join(", ")} for products in this category. This requirement was not silently ignored.`
                    : !response.exactColorAvailable
                      ? "There is no exact match in the requested colour. The products below are clearly labelled alternatives and do not claim that colour."
                      : "Try removing or changing an interpreted filter."}</p>
              </div>
            ) : null}
            {response?.closeAlternatives.length ? (
              <div className="stitch-ai-alternatives">
                <p className="eyebrow">Recommended alternatives</p>
                <h2>Other products to consider</h2>
                <div className="grid grid-3">{response.closeAlternatives.map(({ product, reasons }) => <ProductCard key={product.id} product={product} explanation={`Close match: ${reasons.map(compactMatchReason).join(" · ")}`} showMeta={false} compareSelected={compareIds.includes(product.id)} onCompare={() => toggleCompare(product.id)} />)}</div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      <CompareSelectionBar ids={compareIds} onClear={() => setCompareIds([])} />
    </div>
  );
}

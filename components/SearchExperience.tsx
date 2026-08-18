"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, Camera, History, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { CompareSelectionBar } from "./CompareSelectionBar";

const suggestions = [
  "Beige modular sofa",
  "Black relax sofa",
  "Taupe armchair",
  "Oak storage",
  "Minimal coffee table"
];

const cutoutSlugs = new Set(["justb-pm100", "justb-pm200", "mr-lucia", "mr-230", "mr-260", "mr-270", "mr-280", "mr-285", "mr-nils", "mr-pamela", "mr-231", "jana", "kanto", "justb-ct100", "nara", "mr-kleo", "mr-281", "mr-5111", "mr-9445"]);

const autocompleteCategories: Array<{ category: Product["category"]; aliases: string[] }> = [
  { category: "sofa", aliases: ["sofa", "couch"] },
  { category: "armchair", aliases: ["armchair"] },
  { category: "sectional", aliases: ["sectional", "corner"] },
  { category: "storage", aliases: ["storage", "cabinet", "sideboard"] },
  { category: "coffee-table", aliases: ["coffee"] },
  { category: "dining-table", aliases: ["dining"] }
];

const compactMatchReason = (reason: string) => {
  const concise = reason
    .replace(/^requested colour family:\s*/i, "")
    .replace(/^requested\s+/i, "")
    .replace(/\s+catalogue flag$/i, "")
    .replace(/\s+function$/i, "");
  return concise.charAt(0).toUpperCase() + concise.slice(1);
};

type SearchResponse = {
  intent: Record<string, unknown>;
  exactMatches: Array<{ product: Product; reasons: string[] }>;
  closeAlternatives: Array<{ product: Product; reasons: string[] }>;
  exactColorAvailable: boolean;
  ai: { mode: string; fallback: boolean };
};

export function SearchExperience({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);
  const [recent, setRecent] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<SearchResponse | null>(null);
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
      if (!product.active || (inferredCategory && product.category !== inferredCategory)) return false;
      const words = `${product.modelCode} ${product.name} ${product.subtitle} ${product.category} ${product.colors.join(" ")} ${product.styles.join(" ")} ${product.functions.join(" ")} ${Math.round(product.widthMm / 10)} cm wide ${Math.round(product.depthMm / 10)} cm deep ${Math.round(product.heightMm / 10)} cm high`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      return terms.every((term) => categoryTerms.has(term) || words.some((word) => word.startsWith(term)));
    }).slice(0, 5);
  }, [query, submitted]);

  const removeFilter = (key: string) => {
    const replacements: Record<string, RegExp> = {
      category: /\b(sofa|couch|armchair|chair|sectional|corner|storage|cabinet|coffee table|side table|dining table|dining chair|bed|wardrobe|outdoor|garden furniture|carpet|rug|lamp|bathroom)\b/gi,
      colorFamilies: /\b(beige|ivory|taupe|stone|charcoal|brown|cream|green|grey|graphite|red|burgundy|barolo)\b/gi,
      modular: /\b(modular|module|flexible)\b/gi,
      smallSpaceSuitable: /\b(small|compact|apartment)\b/gi,
      maxWidthMm: /\b(?:maximum width|max|under|below)?\s*\d{2,3}\s*(?:cm|centimeter)\b/gi
    };
    const next = (replacements[key] ? submitted.replace(replacements[key], " ") : submitted).replace(/\s+/g, " ").trim();
    void submit(next || "furniture");
  };

  const toggleCompare = (productId: string) => setCompareIds((current) =>
    current.includes(productId) ? current.filter((id) => id !== productId) : current.length < 3 ? [...current, productId] : current
  );

  const exact = response?.exactMatches ?? [];

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
          {!submitted ? <div className="stitch-ai-discovery">
            <Link className="stitch-ai-visual-entry" href="/visual-search"><i aria-hidden="true"><Camera size={24} /></i><strong>Visual Search</strong><span>Upload an image to find similar pieces</span><b>Upload image</b></Link>
            <div className="stitch-ai-search-lists">
              <section>
                <p className="stitch-ai-label">Suggested searches</p>
                <div className="stitch-ai-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => void submit(suggestion)}><Search size={13} />{suggestion}</button>)}</div>
              </section>
              <section>
                <p className="stitch-ai-label">Recent searches</p>
                {recent.length ? <div className="stitch-ai-suggestions" aria-label="Recent searches">{recent.slice(0, 5).map((item) => <button type="button" key={item} onClick={() => void submit(item)}><History size={13} />{item}</button>)}</div> : <p className="stitch-ai-empty-recent">Your recent searches will appear here.</p>}
              </section>
            </div>
          </div> : null}
        </div>
      </section>

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
                  <button type="button" className="chip" key={key} onClick={() => removeFilter(key)} aria-label={`Remove ${key} filter`}>{key}: {Array.isArray(value) ? value.join(", ") : String(value)} ×</button>)}
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
                <p>{!response.exactColorAvailable ? "There is no exact match in the requested colour. The products below are clearly labelled alternatives and do not claim that colour." : "Try removing or changing an interpreted filter."}</p>
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

"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowRight, Camera, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const suggestions = [
  "beige modular sofa under 300 cm",
  "black modern sofa with relax function",
  "taupe swivel armchair",
  "brown oak storage cabinet",
  "black minimal coffee table"
];

const cutoutSlugs = new Set(["justb-pm100", "justb-pm200", "mr-lucia", "mr-230", "mr-260", "mr-270", "mr-280", "mr-285", "mr-nils", "mr-pamela", "mr-231", "jana", "kanto", "justb-ct100", "nara", "mr-kleo", "mr-281", "mr-5111", "mr-9445"]);

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
    return products.filter((product) => `${product.modelCode} ${product.name} ${product.category} ${product.colors.join(" ")} ${product.styles.join(" ")} ${product.functions.join(" ")} ${Math.round(product.widthMm / 10)} cm wide ${Math.round(product.depthMm / 10)} cm deep ${Math.round(product.heightMm / 10)} cm high`.toLowerCase().includes(value)).slice(0, 5);
  }, [query, submitted]);

  const removeFilter = (key: string) => {
    const replacements: Record<string, RegExp> = {
      category: /\b(sofa|couch|armchair|chair|sectional|corner|storage|cabinet|coffee table|side table|dining table)\b/gi,
      colorFamilies: /\b(beige|ivory|taupe|stone|charcoal|brown|cream|green|grey|graphite|red|burgundy|barolo)\b/gi,
      modular: /\b(modular|module|flexible)\b/gi,
      smallSpaceSuitable: /\b(small|compact|apartment)\b/gi,
      maxWidthMm: /\b(?:maximum width|max|under|below)?\s*\d{2,3}\s*(?:cm|centimeter)\b/gi
    };
    const next = (replacements[key] ? submitted.replace(replacements[key], " ") : submitted).replace(/\s+/g, " ").trim();
    void submit(next || "furniture");
  };

  const exact = response?.exactMatches ?? [];

  return (
    <div className={`stitch-ai-search ${requestedRed ? "is-colour-search" : ""}`}>
      <section className="stitch-ai-search-hero">
        <div className="container">
          <div className="stitch-ai-kicker"><Sparkles size={16} /> Guided Product Search</div>
          <form onSubmit={(event) => { event.preventDefault(); void submit(); }} role="search">
            <div className="stitch-ai-input-row">
              <Search size={34} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" aria-label="Describe the furniture you are looking for" />
              {query ? <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setSubmitted(""); setResponse(null); }}><X /></button> : null}
              <button type="submit" aria-label="Search products"><ArrowRight /></button>
            </div>
          </form>
          {autocomplete.length ? (
            <div className="stitch-search-autocomplete" role="listbox" aria-label="Product suggestions">
              {autocomplete.map((product) => <button type="button" role="option" aria-selected="false" key={product.id} onClick={() => void submit(product.modelCode)}><span>{product.modelCode}</span>{product.name}</button>)}
            </div>
          ) : null}
          <p className="stitch-ai-example">Try: “I need a compact beige modular sofa for a small apartment, maximum width 240 cm.”</p>
          <div className="stitch-ai-discovery">
            <Link className="stitch-ai-visual-entry" href="/visual-search"><Camera size={48} /><strong>Visual Search</strong><span>Upload an image to find similar pieces</span></Link>
            <div>
              <p className="stitch-ai-label">Suggested searches</p>
              <div className="stitch-ai-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => void submit(suggestion)}>{suggestion}</button>)}</div>
              <p className="stitch-ai-label">{submitted ? "Best matching products" : "Recent searches"}</p>
              {!submitted && recent.length ? <div className="stitch-ai-suggestions" aria-label="Recent searches">{recent.map((item) => <button type="button" key={item} onClick={() => void submit(item)}>Recent: {item}</button>)}</div> : null}
              <div className="stitch-ai-recent">
                {exact.slice(0, 4).map(({ product }) => <Link href={`/furniture/${product.slug}`} key={product.id}><Image src={resultImage(product.slug, product.id)} alt={product.name} width={220} height={130} /><span>{product.modelCode}</span>{requestedRed ? <small>{product.slug === "mr-260" ? "Shown in red leather" : "Red option available · image differs"}</small> : null}</Link>)}
              </div>
            </div>
          </div>
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
            {pending ? <div className="card card-body" role="status">Interpreting request and searching validated catalogue data…</div> : exact.length ? (
              <div className="grid grid-3">{exact.map(({ product, reasons }) => <ProductCard key={product.id} product={product} imageOverride={resultImage(product.slug, product.id)} imageNote={requestedRed ? (product.slug === "mr-260" ? "Catalogue photo: red leather" : "Red upholstery option · photo shows another finish") : undefined} explanation={`Why it matches: ${reasons.join("; ") || "validated catalogue relevance"}.`} />)}</div>
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
                <div className="grid grid-3">{response.closeAlternatives.map(({ product, reasons }) => <ProductCard key={product.id} product={product} explanation={`Close alternative: ${reasons.join("; ")}.`} />)}</div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

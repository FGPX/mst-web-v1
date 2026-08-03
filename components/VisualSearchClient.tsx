"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { Camera, Check, LoaderCircle, Sparkles, Upload, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { materials } from "@/lib/data";
import { storage } from "@/lib/persistence";
import { productImages } from "@/lib/musterring-assets";
import type { Category, Product } from "@/lib/types";

type MatchCategory = Extract<Category, "sofa" | "armchair" | "storage">;
type VisualResult = { product: Product; score: number; explanation: string };

function matchLabel(score: number) {
  if (score >= 82) return "Excellent visual match";
  if (score >= 68) return "Strong visual match";
  if (score >= 54) return "Similar palette and form";
  return "Related visual character";
}

async function cropImageFile(source: string, crop: { x: number; y: number; size: number }, original: File) {
  const image = new window.Image();
  image.src = source;
  await image.decode();
  const ratio = Math.max(0.25, Math.min(1, crop.size / 100));
  const width = Math.round(image.naturalWidth * ratio);
  const height = Math.round(image.naturalHeight * ratio);
  const x = Math.round(image.naturalWidth * Math.min(1 - ratio, crop.x / 100));
  const y = Math.round(image.naturalHeight * Math.min(1 - ratio, crop.y / 100));
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(width, 1600);
  canvas.height = Math.min(height, 1600);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Crop is unavailable.");
  context.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, original.type, 0.9));
  if (!blob) throw new Error("Crop could not be created.");
  return new File([blob], original.name, { type: original.type });
}

export function VisualSearchClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "ready" | "error">("idle");
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<VisualResult[]>([]);
  const [category, setCategory] = useState<MatchCategory>("sofa");
  const [color, setColor] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [style, setStyle] = useState("");
  const [saved, setSaved] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 100 });
  const [consent, setConsent] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiMode, setAiMode] = useState("");
  const visibleResults = useMemo(
    () => results.filter(({ product }) =>
      product.category === category &&
      (!color || product.colors.includes(color)) &&
      (!materialId || product.materials.includes(materialId)) &&
      (!style || product.styles.includes(style))
    ),
    [results, category, color, materialId, style]
  );
  const primary = visibleResults[0];

  const processFile = async (file?: File) => {
    if (!file) return;
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setStatus("error");
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus("error");
      setError("Choose an image smaller than 10 MB.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    const source = URL.createObjectURL(file);
    storage.track({ name: "visual_search_uploaded" });
    setPreview(source);
    setSelectedFile(file);
    setStatus("idle");
    setResults([]);
    setAnalysis("");
  };
  const analyzeSelectedArea = async () => {
    if (!preview || !selectedFile || !consent) return;
    setStatus("analyzing");
    setError("");
    try {
      const croppedFile = await cropImageFile(preview, crop, selectedFile);
      const form = new FormData();
      form.append("image", croppedFile);
      form.append("consent", "true");
      form.append("crop", JSON.stringify(crop));
      const response = await fetch("/api/ai/image", { method: "POST", body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error);
      const detectedCategory = payload.tags.category;
      if (detectedCategory === "storage" || detectedCategory === "armchair" || detectedCategory === "sofa") setCategory(detectedCategory);
      setAnalysis(`${detectedCategory ?? "furniture"} · ${payload.tags.colorFamilies.join(", ")} · ${payload.tags.silhouette}`);
      setResults(payload.matches.map((match: { product: Product; label: string; reasons: string[] }) => ({
        product: match.product,
        score: match.label === "Excellent Visual Match" ? 90 : match.label === "Strong Match" ? 75 : match.label === "Similar Shape" ? 60 : match.label === "Similar Material" ? 45 : 25,
        explanation: match.reasons.join(", ")
      })));
      setAiMode(payload.ai.mode);
      setStatus("ready");
      storage.track({ name: "visual_search_analyzed" });
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error && cause.message
        ? cause.message
        : "The selected area could not be analyzed.");
    }
  };
  const removeUpload = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setResults([]);
    setAnalysis("");
    setStatus("idle");
    setError("");
    setSelectedFile(null);
    setAiMode("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="stitch-visual-search">
      <section className="section">
        <div className="container">
          <div className="stitch-visual-heading">
            <div>
              <p className="eyebrow">Visual intelligence</p>
              <h1 className="h2">Visual Match Results</h1>
              <p className="lead">Upload a room or furniture photo. The browser analyzes its colour palette and proportions, then compares them with available Musterring products.</p>
              <label className="chip"><input type="checkbox" checked={consent} onChange={(event) => {
                setConsent(event.target.checked);
                storage.recordConsent("photo-ai-processing", event.target.checked);
              }} /> I consent to temporary AI processing of this photo.</label>
            </div>
            <div className="chips">
              <button className="button primary" onClick={() => inputRef.current?.click()}><Upload size={18} /> {preview ? "Change photo" : "Choose photo"}</button>
              {preview ? <button className="button ghost" onClick={removeUpload}><X size={18} /> Remove photo</button> : null}
            </div>
            <input
              ref={inputRef}
              hidden
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onClick={(event) => { event.currentTarget.value = ""; }}
              onChange={(event) => processFile(event.target.files?.[0])}
            />
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}

          {!preview ? (
            <button className="stitch-visual-dropzone" type="button" onClick={() => inputRef.current?.click()}>
              <Camera size={56} />
              <strong>Search with an image</strong>
              <span>Choose a JPG, PNG or WebP photo</span>
            </button>
          ) : (
            <div className="stitch-visual-stage">
              <div>
                <div className="stitch-visual-upload">
                  {/* Blob URLs are local previews and cannot use the Next image optimizer. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Uploaded room or furniture reference" />
                  <span className="stitch-visual-focus-dot" />
                </div>
                <div className="stitch-visual-analysis">
                  {status === "analyzing" ? <LoaderCircle className="spin" /> : <span><Sparkles /></span>}
                  <div>
                    <strong>{status === "analyzing" ? "Analyzing your selected object…" : status === "error" ? "Analysis could not be completed" : status === "ready" ? "Visual analysis complete" : "Select the target object"}</strong>
                    <p>{status === "ready" ? `Detected ${analysis}. ${aiMode}. Uploaded bytes are processed only for this request.` : "Adjust the crop controls, then analyze the selected area."}</p>
                  </div>
                </div>
                <div className="card card-body">
                  <p className="eyebrow">Select object area</p>
                  <label>Crop size {crop.size}%<input type="range" min="25" max="100" value={crop.size} onChange={(event) => setCrop({ ...crop, size: Number(event.target.value) })} /></label>
                  <label>Horizontal focus<input type="range" min="0" max={100 - crop.size} value={crop.x} onChange={(event) => setCrop({ ...crop, x: Number(event.target.value) })} /></label>
                  <label>Vertical focus<input type="range" min="0" max={100 - crop.size} value={crop.y} onChange={(event) => setCrop({ ...crop, y: Number(event.target.value) })} /></label>
                  {!consent ? <p className="stitch-visual-consent-note">Check the consent box above to analyze this photo. The preview remains only in your browser until then.</p> : null}
                  <button className="button ghost" disabled={!consent || status === "analyzing"} onClick={() => void analyzeSelectedArea()}>Analyze selected area</button>
                </div>
              </div>

              <div>
                {primary ? (
                  <article className="stitch-visual-primary">
                    <div className="stitch-match-badge">{matchLabel(primary.score)}</div>
                    <Image src={productImages(primary.product.id)[0]} alt={primary.product.name} width={900} height={600} />
                    <div>
                      <p className="eyebrow">Visually similar to your upload</p>
                      <h2>{primary.product.modelCode}</h2>
                      <p><strong>Why it matches:</strong> {primary.explanation}. Results are ranked locally from measurable image characteristics; the label is qualitative, not a claim of AI certainty.</p>
                      <div className="chips">
                        <Link className="button primary" href={primary.product.category === "storage" ? `/furniture/${primary.product.slug}` : `/configurator/${primary.product.slug}`}>
                          {primary.product.category === "storage" ? "View Product" : "Configure Piece"}
                        </Link>
                        <Link className="button ghost" href="/handover">Book Consultation</Link>
                        <button className="button ghost" onClick={() => {
                          storage.toggleProduct(primary.product.id);
                          setSaved(true);
                        }}>{saved ? "Saved to Project" : "Save Result to Project"}</button>
                      </div>
                    </div>
                  </article>
                ) : (
                  <div className="stitch-visual-loading"><LoaderCircle className="spin" /><p>Preparing visual matches…</p></div>
                )}
                <div className="stitch-visual-refine">
                  <p className="eyebrow">Refine results</p>
                  {(["storage", "sofa", "armchair"] as const).map((item) => (
                    <button className={category === item ? "is-active" : ""} key={item} onClick={() => setCategory(item)}>
                      {category === item ? <Check size={14} /> : null}
                      {item === "storage" ? "Living walls" : `${item}s`}
                    </button>
                  ))}
                  <label>Color<select value={color} onChange={(event) => setColor(event.target.value)}><option value="">Any color</option>{[...new Set(results.flatMap(({ product }) => product.colors))].map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label>Material<select value={materialId} onChange={(event) => setMaterialId(event.target.value)}><option value="">Any material</option>{materials.map((material) => <option value={material.id} key={material.id}>{material.name}</option>)}</select></label>
                  <label>Style<select value={style} onChange={(event) => setStyle(event.target.value)}><option value="">Any style</option>{[...new Set(results.flatMap(({ product }) => product.styles))].map((item) => <option key={item}>{item}</option>)}</select></label>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {visibleResults.length > 1 ? (
        <section className="section band">
          <div className="container">
            <h2 className="h2">Other intelligent suggestions</h2>
            <div className="stitch-visual-suggestions">
              {visibleResults.slice(1, 7).map(({ product, score }) => (
                <Link href={`/furniture/${product.slug}`} key={product.id}>
                  <Image src={productImages(product.id)[0]} alt={product.name} width={520} height={360} />
                  <span>{matchLabel(score)}</span>
                  <strong>{product.modelCode}</strong>
                  <small>{product.subtitle}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

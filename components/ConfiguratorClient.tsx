"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { Armchair, Check, Copy, Info, Printer, Redo2, RotateCw, Save, Share2, Sparkles, Undo2, Zap, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Configuration, Product } from "@/lib/types";
import { createConfiguration, priceConfiguration, validateConfiguration } from "@/lib/configurator";
import { materials } from "@/lib/data";
import { dimensions, formatEuro } from "@/lib/format";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";

const sofaLayouts = [
  { label: "2 seat", modules: ["left seat", "right seat"], width: 1 },
  { label: "3 seat", modules: ["left seat", "centre seat", "right seat"], width: 1.22 },
  { label: "Corner", modules: ["left seat", "corner", "right seat"], width: 1.28 },
  { label: "Chaise", modules: ["left seat", "power module", "chaise"], width: 1.34 }
];

export function ConfiguratorClient({ product, configurationId, initialAssistantRequest = "" }: { product: Product; configurationId?: string; initialAssistantRequest?: string }) {
  const [config, setConfig] = useState(() => createConfiguration(product));
  const [history, setHistory] = useState<Configuration[]>([]);
  const [future, setFuture] = useState<Configuration[]>([]);
  const [saved, setSaved] = useState(false);
  const [autosaved, setAutosaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [assistantRequest, setAssistantRequest] = useState(initialAssistantRequest);
  const [assistantResult, setAssistantResult] = useState<{
    requirements: Record<string, unknown>;
    product: Product;
    configuration: Configuration;
    validation: { valid: boolean; issues: string[] };
    corrections: string[];
    ai: { mode: string };
    calculationMode: string;
  } | null>(null);
  const [assistantPending, setAssistantPending] = useState(false);
  const validation = useMemo(() => validateConfiguration(config), [config]);
  const price = useMemo(() => priceConfiguration(config), [config]);
  const gallery = productImages(product.id);
  const selectedMaterialIndex = Math.max(0, product.materials.indexOf(config.materialId));
  const preview = gallery[0];
  const previewFilters = ["none", "grayscale(.8) contrast(.92)", "sepia(.32) saturate(1.28)", "brightness(.9) saturate(.72)"];
  const layouts = product.category === "armchair"
    ? [{ label: "Armchair", modules: ["chair"], width: 1 }]
    : sofaLayouts;
  useEffect(() => { storage.track({ name: "configurator_started", productId: product.id, configurationId: config.id }); }, [product.id, config.id]);

  useEffect(() => {
    if (!configurationId) return;
    const stored = storage.configurations().find((item) => item.id === configurationId && item.productId === product.id);
    if (stored) {
      setConfig(stored);
      setSaved(true);
    }
  }, [configurationId, product.id]);
  useEffect(() => {
    if (saved) return;
    setAutosaved(false);
    const timeout = window.setTimeout(() => {
      storage.saveConfiguration({ ...config, indicativePriceCents: price });
      setAutosaved(true);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [config, price, saved]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (saved || autosaved) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [saved, autosaved]);

  const update = (patch: Partial<typeof config>) => {
    storage.track({ name: "configuration_changed", productId: product.id, configurationId: config.id });
    setHistory((current) => [...current.slice(-19), config]);
    setFuture([]);
    setSaved(false);
    setConfig((current) => {
      const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
      return { ...next, indicativePriceCents: priceConfiguration(next) };
    });
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((current) => [config, ...current]);
    setHistory((current) => current.slice(0, -1));
    setConfig(previous);
    setSaved(false);
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [...current, config]);
    setFuture((current) => current.slice(1));
    setConfig(next);
    setSaved(false);
  };
  const chooseLayout = (layout: typeof layouts[number]) => update({
    modules: layout.modules,
    dimensions: {
      ...config.dimensions,
      widthMm: Math.round(product.widthMm * layout.width),
      depthMm: layout.label === "Corner" || layout.label === "Chaise" ? Math.round(product.depthMm * 1.45) : product.depthMm
    }
  });

  return (
    <div className="stitch-configurator">
      <div className="stitch-configurator-preview">
        <div className="stitch-config-id">
          <span>Configuration ID</span>
          <strong>{config.id}</strong>
        </div>
        <div
          className={`stitch-config-product ${zoomed ? "is-zoomed" : ""}`}
          style={{ "--preview-rotation": `${rotation}deg`, "--preview-filter": previewFilters[selectedMaterialIndex % previewFilters.length] } as React.CSSProperties}
        >
          <Image src={preview} alt={`${product.name} configured preview`} fill priority sizes="(max-width: 900px) 100vw, 72vw" />
          <div className="stitch-config-product-label">
            <strong>{product.modelCode}</strong>
            <span>{materials.find((material) => material.id === config.materialId)?.name}</span>
          </div>
        </div>
        <div className="stitch-config-view-tools">
          <button onClick={() => setRotation((value) => value + 1)}><RotateCw /> Rotate view</button>
          <button onClick={() => setZoomed((value) => !value)}><ZoomIn /> {zoomed ? "Reset zoom" : "Zoom detail"}</button>
        </div>
      </div>

      <aside className="stitch-config-panel">
        <div className="stitch-config-section ai-config-assistant">
          <p><Sparkles /><span>AI Configuration Assistant</span></p>
          <p className="ai-config-boundary">AI interprets the customer request. The configuration engine validates the product rules.</p>
          <label>Describe your ideal configuration
            <textarea value={assistantRequest} onChange={(event) => setAssistantRequest(event.target.value)} placeholder="Build a compact four-seat sofa in beige, maximum 290 cm, with easy-care fabric and relax function." />
          </label>
          <button disabled={assistantPending || assistantRequest.trim().length < 3} onClick={async () => {
            setAssistantPending(true);
            storage.track({ name: "ai_configuration_requested", productId: product.id });
            const response = await fetch("/api/ai/configuration", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ request: assistantRequest })
            }).catch(() => null);
            const payload = response ? await response.json().catch(() => null) : null;
            setAssistantPending(false);
            if (!response?.ok || !payload?.configuration) return;
            setAssistantResult(payload);
            storage.track({ name: "ai_configuration_validated", productId: payload.product.id, configurationId: payload.configuration.id });
            if (payload.product.id === product.id && payload.validation.valid) {
              setHistory((current) => [...current, config]);
              setConfig(payload.configuration);
            }
          }}>{assistantPending ? "Interpreting request…" : "Build valid proposal"}</button>
          {assistantResult ? (
            <div className="ai-config-result">
              <small>{assistantResult.ai.mode} · {assistantResult.calculationMode}</small>
              <p><strong>Customer request:</strong> {assistantRequest}</p>
              <p><strong>Interpreted requirements:</strong> {Object.entries(assistantResult.requirements).filter(([, value]) => value !== null && value !== false && value !== "").map(([key, value]) => `${key}: ${String(value)}`).join(" · ")}</p>
              <p><strong>Proposed configuration:</strong> {assistantResult.product.modelCode} · {assistantResult.configuration.modules.join(", ")} · {Math.round(assistantResult.configuration.dimensions.widthMm / 10)} cm wide · Configuration ID {assistantResult.configuration.id}</p>
              <p><strong>Configuration check:</strong> {assistantResult.validation.valid ? "All product rules passed" : assistantResult.validation.issues.join(" ")}</p>
              {assistantResult.corrections.length ? <p><strong>Corrections:</strong> {assistantResult.corrections.join(" ")}</p> : null}
              {assistantResult.product.id !== product.id ? <Link href="/handover">Continue with a retailer for {assistantResult.product.modelCode}</Link> : null}
            </div>
          ) : null}
        </div>
        <div className="stitch-config-summary">
          <p className="eyebrow">Your {product.modelCode}</p>
          <h1>{product.name}</h1>
          <div className="stitch-config-quote">
            <span>{product.authorizedContent ? "Retailer quote" : "Indicative price"}</span>
            <strong>{product.authorizedContent ? "Price on request" : formatEuro(price)}</strong>
            <Info size={18} />
            <dl>
              <div><dt>Width</dt><dd>{Math.round(config.dimensions.widthMm / 10)} cm</dd></div>
              <div><dt>Depth</dt><dd>{Math.round(config.dimensions.depthMm / 10)} cm</dd></div>
            </dl>
          </div>
        </div>

        <div className="stitch-config-section">
          <p><span>01</span> Layout</p>
          <div className="stitch-layout-options">
            {layouts.map((layout) => (
              <button className={config.modules.join() === layout.modules.join() ? "is-active" : ""} key={layout.label} onClick={() => chooseLayout(layout)}>
                <span>{layout.modules.map((module) => <i key={module} />)}</span>
                {layout.label}
              </button>
            ))}
          </div>
        </div>

        <div className="stitch-config-section">
          <p><span>02</span> Materials</p>
          <div className="stitch-material-options">
            {product.materials.map((id, index) => {
              const material = materials.find((candidate) => candidate.id === id);
              return (
                <button className={config.materialId === id ? "is-active" : ""} key={id} onClick={() => update({ materialId: id, color: product.colors[index % product.colors.length] })}>
                  <span className={`material-swatch swatch-${index + 1}`}>{config.materialId === id ? <Check /> : null}</span>
                  <small>{material?.name ?? "Musterring cover"}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="stitch-config-section">
          <p><span>03</span> Functions</p>
          <label className="stitch-config-toggle">
            <Armchair />
            <span><strong>Relax function</strong><small>Adjustable comfort position</small></span>
            <input type="checkbox" checked={config.relax} onChange={(event) => update({ relax: event.target.checked })} />
          </label>
          <label className="stitch-config-toggle">
            <Zap />
            <span><strong>Electric function</strong><small>Motor-assisted extension</small></span>
            <input type="checkbox" checked={config.electric} disabled={!config.modules.some((module) => module.includes("power"))} aria-describedby="electric-rule" onChange={(event) => update({ electric: event.target.checked })} />
          </label>
          {!config.modules.some((module) => module.includes("power")) ? <small id="electric-rule">Choose the Chaise layout to add a required power module.</small> : null}
        </div>

        <div className="stitch-config-section">
          <p><span>04</span> Base styling</p>
          <div className="stitch-base-options">
            {product.feetOptions.slice(0, 3).map((feet) => <button className={config.feet === feet ? "is-active" : ""} disabled={feet === "Hidden glide" && config.seatHeightMm > 480} title={feet === "Hidden glide" && config.seatHeightMm > 480 ? "Hidden glide is restricted to standard seat height." : ""} onClick={() => update({ feet })} key={feet}>{feet}</button>)}
          </div>
          <label>Armrest
            <select value={config.armrest} onChange={(event) => update({ armrest: event.target.value })}>
              {product.armrestOptions.map((armrest) => <option key={armrest}>{armrest}</option>)}
            </select>
          </label>
          <label>Seat height
            <select value={config.seatHeightMm} onChange={(event) => update({ seatHeightMm: Number(event.target.value) })}>
              {[product.seatHeightMm, product.seatHeightMm + 20, product.seatHeightMm + 40].map((height) => <option value={height} key={height}>{height / 10} cm</option>)}
            </select>
          </label>
        </div>

        {!validation.valid ? <div className="stitch-config-warning" role="alert"><strong>Choose a valid alternative:</strong> {validation.issues.join(" ")} Suggested: {validation.alternatives.join(", ")}.</div> : null}
        <div className="stitch-config-history" aria-label="Configuration history">
          <button onClick={undo} disabled={!history.length}><Undo2 /> Undo</button>
          <button onClick={redo} disabled={!future.length}><Redo2 /> Redo</button>
          <span role="status">{saved ? "Saved" : autosaved ? "Autosaved locally" : "Unsaved changes"}</span>
        </div>
        <div className="stitch-config-spec">{dimensions(config.dimensions.widthMm, config.dimensions.depthMm, config.dimensions.heightMm)} · planning dimensions</div>
        <div className="stitch-config-actions">
          <div className="stitch-config-primary-completion">
            <button disabled={!validation.valid} onClick={() => { storage.saveConfiguration({ ...config, indicativePriceCents: price }); storage.track({ name: "configuration_completed", productId: product.id, configurationId: config.id }); setSaved(true); }}><Save /> {saved ? "Saved" : "Save"}</button>
            <Link href="/handover">Continue with a Musterring retailer</Link>
          </div>
          <details className="stitch-config-more-actions">
            <summary>Share and more options</summary>
            <div>
              <button onClick={async () => { await navigator.clipboard?.writeText(`${location.origin}/handover`); setShared(true); }}><Share2 /> {shared ? "Copied" : "Share"}</button>
              <button onClick={() => {
                const duplicate = { ...config, id: `CFG-${product.modelCode.replace(/\W/g, "")}-${Date.now()}`, updatedAt: new Date().toISOString() };
                storage.saveConfiguration(duplicate);
                setHistory((current) => [...current, config]);
                setConfig(duplicate);
                setSaved(true);
              }}><Copy /> Duplicate</button>
              <button onClick={() => window.print()}><Printer /> Print summary</button>
              <button className="is-reset" onClick={() => { setConfig(createConfiguration(product)); setSaved(false); }}>Reset configuration</button>
            </div>
          </details>
        </div>
      </aside>
    </div>
  );
}

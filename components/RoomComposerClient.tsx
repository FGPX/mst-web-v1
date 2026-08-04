"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { Box, Check, ChevronLeft, ChevronRight, Copy, Grid3X3, Layers, Lock, Minus, Plus, Printer, Redo2, RotateCw, Save, Send, Share2, Trash2, Unlock, Upload } from "lucide-react";
import { PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { RoomAnalysis } from "@/lib/ai/schemas";
import type { Project } from "@/lib/types";

type ComposerCategory = "seating" | "armchair" | "storage" | "tables";

const roomBackgrounds = [
  { id: "neutral", name: "Neutral studio", src: "" },
  { id: "natural", name: "Natural living", src: "/stitch-assets/original/room-living-clean.jpg" },
  { id: "city", name: "City lounge", src: "/musterring-catalog/mr-2875/image-01.jpg" },
  { id: "soft", name: "Soft retreat", src: "/musterring-catalog/mr-1370/image-01.jpg" }
] as const;

const generatedTurntableSlugs = new Set(["mr-alena", "mr-lia", "mr-281", "mr-2665", "mr-4100", "mr-5100", "mr-kleo", "mr-5111", "mr-720", "mr-9445"]);
const generatedCutoutSlugs = new Set([
  ...generatedTurntableSlugs,
  "justb-pm100",
  "justb-pm200",
  "mr-lucia",
  "mr-230",
  "mr-260",
  "mr-270",
  "mr-280",
  "mr-285",
  "mr-nils",
  "mr-pamela",
  "mr-231",
  "jana",
  "kanto",
  "justb-ct100",
  "nara"
]);
const generatedViews = (slug: string) => generatedTurntableSlugs.has(slug)
  ? ["official-front.png", "view-2.png", "view-3.png", "view-4.png"].map((view) => `/generated-product-views/${slug}/${view}?v=2`)
  : [];

type SceneItem = {
  id: string;
  productId: string;
  x: number;
  y: number;
  rotation: number;
  viewIndex?: number;
  scale: number;
  materialId?: string;
  color?: string;
  locked?: boolean;
  zIndex?: number;
};

export function RoomComposerClient({ upload = false, openPresentationScene = false }: { upload?: boolean; openPresentationScene?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);
  const activeProducts = useMemo(
    () => products
      .filter((product) => product.active)
      .sort((left, right) => Number(!generatedCutoutSlugs.has(left.slug)) - Number(!generatedCutoutSlugs.has(right.slug))),
    []
  );
  const [category, setCategory] = useState<ComposerCategory>("seating");
  const [productQuery, setProductQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [roomBackgroundId, setRoomBackgroundId] = useState<(typeof roomBackgrounds)[number]["id"]>("neutral");
  const [items, setItems] = useState<SceneItem[]>([
    { id: "scene-product-1", productId: activeProducts[0].id, x: 50, y: 68, rotation: 0, scale: 1, materialId: activeProducts[0].materials[0], color: activeProducts[0].colors[0], zIndex: 1 }
  ]);
  const [history, setHistory] = useState<SceneItem[][]>([]);
  const [future, setFuture] = useState<SceneItem[][]>([]);
  const [selectedId, setSelectedId] = useState(items[0].id);
  const [grid, setGrid] = useState(true);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [roomPreview, setRoomPreview] = useState("");
  const [uploadConsent, setUploadConsent] = useState(!upload);
  const [uploadError, setUploadError] = useState("");
  const [planningMode, setPlanningMode] = useState<"inspiration" | "accurate">("inspiration");
  const [showBefore, setShowBefore] = useState(false);
  const [versions, setVersions] = useState(0);
  const [savedVersions, setSavedVersions] = useState<Array<{ id?: string; version?: number; items?: SceneItem[] }>>([]);
  const [roomSize, setRoomSize] = useState({ widthMm: 4200, lengthMm: 5600 });
  const [roomAnalysis, setRoomAnalysis] = useState<RoomAnalysis | null>(null);
  const [composerNotice, setComposerNotice] = useState("");
  useEffect(() => {
    storage.track({ name: "room_composer_started" });
    const scenes = storage.roomScenes() as Array<{ id?: string; version?: number; items?: SceneItem[] }>;
    setVersions(scenes.length);
    setSavedVersions(scenes);
    if (openPresentationScene) {
      const presentation = scenes.find((scene) => scene.id === "scene-presentation-living");
      if (presentation?.items?.length) {
        setItems(presentation.items);
        setSelectedId(presentation.items[0].id);
        setSaved(true);
      }
    }
  }, [openPresentationScene]);

  const categoryMatches = (productCategory: string) => {
    if (category === "seating") return productCategory === "sofa" || productCategory === "sectional";
    if (category === "armchair") return productCategory === "armchair";
    if (category === "storage") return ["storage", "wardrobe", "bedroom-series"].includes(productCategory);
    return ["coffee-table", "dining-table", "small-furniture"].includes(productCategory);
  };
  const catalog = activeProducts.filter((product) => categoryMatches(product.category)
    && generatedCutoutSlugs.has(product.slug)
    && `${product.modelCode} ${product.name} ${product.subtitle}`.toLowerCase().includes(productQuery.toLowerCase()));
  const visibleCatalog = catalog.slice(0, visibleCount);
  const selectedBackground = roomBackgrounds.find((background) => background.id === roomBackgroundId) ?? roomBackgrounds[0];
  const composerImage = (productId: string) => {
    const product = activeProducts.find((item) => item.id === productId);
    if (product && generatedCutoutSlugs.has(product.slug)) return `/generated-product-views/${product.slug}/official-front.png?v=4`;
    const images = productImages(productId);
    return images.find((image) => image.toLowerCase().endsWith(".png")) ?? images[0];
  };
  const sceneItemImage = (productId: string, viewIndex = 0) => {
    const product = activeProducts.find((item) => item.id === productId);
    if (product && generatedCutoutSlugs.has(product.slug) && !generatedTurntableSlugs.has(product.slug)) return composerImage(productId);
    if (viewIndex === 0) return composerImage(productId);
    const images = productImages(productId);
    return images[viewIndex % images.length] ?? composerImage(productId);
  };
  const productViewCount = (productId: string) => {
    const product = activeProducts.find((item) => item.id === productId);
    if (!product) return 1;
    if (generatedTurntableSlugs.has(product.slug)) return 4;
    if (generatedCutoutSlugs.has(product.slug)) return 4;
    return productImages(productId).length;
  };
  const cutoutViewTransform = (viewIndex = 0) => {
    const view = viewIndex % 4;
    if (view === 1) return "perspective(900px) rotateY(-16deg) scaleX(.94)";
    if (view === 2) return "scaleX(-1)";
    if (view === 3) return "perspective(900px) rotateY(16deg) scaleX(-.94)";
    return "none";
  };
  const selected = items.find((item) => item.id === selectedId);
  const pushHistory = () => {
    setHistory((current) => [...current.slice(-9), items]);
    setFuture([]);
  };
  const updateSelected = (patch: Partial<SceneItem>) => {
    if (!selected) return;
    pushHistory();
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, ...patch } : item));
  };
  const addProduct = (productId: string) => {
    pushHistory();
    const id = `scene-${Date.now()}`;
    const product = activeProducts.find((item) => item.id === productId) ?? activeProducts[0];
    setItems((current) => [...current, { id, productId, x: 44 + ((current.length * 8) % 24), y: 70, rotation: 0, scale: 0.9, materialId: product.materials[0], color: product.colors[0], zIndex: current.length + 1 }]);
    setSelectedId(id);
    setShowBefore(false);
    setSaved(false);
    setComposerNotice(`${product.modelCode} was added to the room.`);
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const replaceSelectedProduct = (productId: string) => {
    if (!selected) return addProduct(productId);
    const product = activeProducts.find((item) => item.id === productId) ?? activeProducts[0];
    const topLayer = Math.max(0, ...items.map((item) => item.zIndex ?? 0)) + 1;
    pushHistory();
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, productId, viewIndex: 0, x: 50, y: 70, scale: 1, zIndex: topLayer, materialId: product.materials[0], color: product.colors[0] } : item));
    setSelectedId(selected.id);
    setShowBefore(false);
    setSaved(false);
    setComposerNotice(`${product.modelCode} is now selected and visible in the room.`);
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const chooseBackground = (backgroundId: (typeof roomBackgrounds)[number]["id"]) => {
    if (roomPreview) URL.revokeObjectURL(roomPreview);
    setRoomPreview("");
    setRoomAnalysis(null);
    setRoomBackgroundId(backgroundId);
    if (roomInputRef.current) roomInputRef.current.value = "";
    setSaved(false);
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setItems(previous);
    setHistory((current) => current.slice(0, -1));
    setFuture((current) => [items, ...current]);
    setSelectedId(previous.at(-1)?.id ?? "");
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [...current, items]);
    setItems(next);
    setFuture((current) => current.slice(1));
  };
  const move = (event: ReactPointerEvent<HTMLButtonElement>, item: SceneItem) => {
    if (!dragging || dragging !== item.id || !stageRef.current) return;
    const bounds = stageRef.current.getBoundingClientRect();
    if (item.locked) return;
    const rawX = Math.max(8, Math.min(92, ((event.clientX - bounds.left) / bounds.width) * 100));
    const rawY = Math.max(20, Math.min(88, ((event.clientY - bounds.top) / bounds.height) * 100));
    const x = grid ? Math.round(rawX / 2) * 2 : rawX;
    const y = grid ? Math.round(rawY / 2) * 2 : rawY;
    setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, x, y } : candidate));
  };

  return (
    <div className="stitch-room-composer">
      <section className="stitch-composer-intro">
        <div className="container">
          <p className="eyebrow">Room planning</p>
          <div>
            <div>
              <h1>Room Composer</h1>
              <p>Visualize Musterring furniture in a premium room scene. Add products, drag them into place, rotate and scale the composition, then save or hand it to a retailer.</p>
            </div>
            <div className="chips">
              <button className="button ghost" onClick={() => document.querySelector(".stitch-composer-library")?.scrollIntoView({ behavior: "smooth" })}><Box size={18} /> Shoppable scenes</button>
              <button className="button consult" disabled={!uploadConsent} onClick={() => roomInputRef.current?.click()}><Upload size={18} /> {upload ? "Choose room photo" : "Upload room photo"}</button>
              <input
                ref={roomInputRef}
                hidden
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  setUploadError("");
                  if (!file) return;
                  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                    setUploadError("Choose a JPG, PNG or WebP image.");
                    return;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    setUploadError("Choose an image smaller than 10 MB.");
                    return;
                  }
                  const form = new FormData();
                  form.append("image", file);
                  form.append("consent", String(uploadConsent));
                  const validation = await fetch("/api/ai/room", { method: "POST", body: form }).catch(() => null);
                  const payload = validation ? await validation.json().catch(() => null) : null;
                  if (!validation?.ok || !payload?.analysis) {
                    setUploadError(payload?.error ?? "The room analysis could not be completed.");
                    return;
                  }
                  if (roomPreview) URL.revokeObjectURL(roomPreview);
                  setRoomPreview(URL.createObjectURL(file));
                  setRoomAnalysis(payload.analysis);
                  storage.track({ name: "room_analysis_completed" });
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section stitch-composer-workspace">
        <div className="container stitch-composer-layout">
          {upload ? (
            <div className="card card-body" style={{ gridColumn: "1 / -1" }}>
              <p className="eyebrow">Private room upload</p>
              <p>Your photo is processed temporarily for room analysis. It is not saved by this application and can be removed from the preview at any time.</p>
              <label className="chip"><input type="checkbox" checked={uploadConsent} onChange={(event) => {
                setUploadConsent(event.target.checked);
                storage.recordConsent("photo-ai-processing", event.target.checked);
              }} /> I consent to temporary AI processing of this room photo.</label>
              {uploadError ? <p className="form-error" role="alert">{uploadError}</p> : null}
            </div>
          ) : null}
          {upload && roomAnalysis ? (
            <div className="card card-body room-analysis-editor" style={{ gridColumn: "1 / -1" }}>
              <p className="eyebrow">Room analysis</p>
              <p><strong>This analysis supports inspiration. Confirm dimensions with “Will It Fit?” or a Musterring retailer.</strong></p>
              <div className="grid grid-3">
                <label>Room type<input value={roomAnalysis.roomType} onChange={(event) => setRoomAnalysis({ ...roomAnalysis, roomType: event.target.value })} /></label>
                <label>Visible floor region<input value={roomAnalysis.visibleFloorRegion} onChange={(event) => setRoomAnalysis({ ...roomAnalysis, visibleFloorRegion: event.target.value })} /></label>
                <label>Lighting description<input value={roomAnalysis.lightingDescription} onChange={(event) => setRoomAnalysis({ ...roomAnalysis, lightingDescription: event.target.value })} /></label>
                {([
                  ["approximateWallAreas", "Approximate wall areas"],
                  ["windows", "Windows"],
                  ["doors", "Doors"],
                  ["existingMajorFurniture", "Existing major furniture"],
                  ["dominantColors", "Dominant colours"],
                  ["styleTags", "Style tags"]
                ] as const).map(([key, label]) => (
                  <label key={key}>{label}<input value={roomAnalysis[key].join(", ")} onChange={(event) => setRoomAnalysis({ ...roomAnalysis, [key]: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label>
                ))}
              </div>
            </div>
          ) : null}
          <aside className="stitch-composer-library">
            <div className="stitch-composer-library-heading">
              <div><p className="eyebrow">Room background</p><strong>Choose your space</strong></div>
              <button type="button" className="stitch-composer-upload" disabled={!uploadConsent} onClick={() => roomInputRef.current?.click()}><Upload size={15} /> Import</button>
            </div>
            <div className="stitch-composer-backgrounds">
              {roomBackgrounds.map((background) => (
                <button type="button" key={background.id} className={roomBackgroundId === background.id && !roomPreview ? "is-active" : ""} onClick={() => chooseBackground(background.id)}>
                  {background.src ? <Image src={background.src} alt="" width={128} height={82} /> : <span className="stitch-neutral-swatch" />}
                  <small>{background.name}</small>
                </button>
              ))}
              {roomPreview ? <button type="button" className="is-active"><span className="stitch-uploaded-swatch"><Upload size={18} /></span><small>Imported photo</small></button> : null}
            </div>
            <p className="eyebrow">Module categories</p>
            <div className="stitch-composer-tabs">
              <button className={category === "seating" ? "is-active" : ""} onClick={() => { setCategory("seating"); setVisibleCount(12); }}>Seating</button>
              <button className={category === "armchair" ? "is-active" : ""} onClick={() => setCategory("armchair")}>Armchairs</button>
              <button className={category === "storage" ? "is-active" : ""} onClick={() => setCategory("storage")}>Storage</button>
              <button className={category === "tables" ? "is-active" : ""} onClick={() => setCategory("tables")}>Tables</button>
            </div>
            <div className="stitch-composer-catalog-heading"><p className="eyebrow">Available products</p><span>{catalog.length} models</span></div>
            <input className="stitch-composer-search" type="search" value={productQuery} onChange={(event) => { setProductQuery(event.target.value); setVisibleCount(12); }} placeholder="Search model or product" aria-label="Search products" />
            <div className="stitch-composer-products">
              {visibleCatalog.map((product) => (
                <article key={product.id}>
                  <div className={`stitch-composer-product-media ${composerImage(product.id).toLowerCase().endsWith(".png") ? "is-cutout" : "is-scene"}`}><Image src={composerImage(product.id)} alt={`${product.modelCode} product crop`} width={280} height={200} /><span>Product focus</span></div>
                  <div className="stitch-composer-product-copy">
                    <span>{product.modelCode}</span>
                    <strong>{product.name}</strong>
                    <small>{product.subtitle}</small>
                    {product.authorizedContent && product.sourceUrl ? <a href={product.sourceUrl} target="_blank" rel="noreferrer">Official Musterring product</a> : null}
                  </div>
                  <div className="stitch-composer-product-actions">
                    <button type="button" onClick={() => addProduct(product.id)}><Plus size={14} /> Add to room</button>
                    {selected ? <button type="button" className="ghost replace" onClick={() => replaceSelectedProduct(product.id)}>Replace selected</button> : null}
                  </div>
                </article>
              ))}
            </div>
            {visibleCount < catalog.length ? <button type="button" className="stitch-composer-show-more" onClick={() => setVisibleCount((count) => count + 12)}>Show 12 more</button> : null}
          </aside>

          <div>
            {composerNotice ? <p className="stitch-composer-feedback" role="status"><Check size={16} /> {composerNotice}</p> : null}
            <div className="stitch-composer-toolbar">
              <button className={planningMode === "accurate" ? "is-active" : ""} onClick={() => setPlanningMode((mode) => mode === "accurate" ? "inspiration" : "accurate")}>{planningMode === "accurate" ? "Accurate Planning Mode" : "Inspiration Mode"}</button>
              <button onClick={undo} disabled={!history.length}>Undo</button>
              <button onClick={redo} disabled={!future.length}><Redo2 size={15} /> Redo</button>
              <details className="stitch-composer-more-tools">
                <summary>More tools</summary>
                <div>
                  <button className={grid ? "is-active" : ""} onClick={() => setGrid((value) => !value)}><Grid3X3 size={16} /> Grid: {grid ? "on" : "off"}</button>
                  <span>Snap: 10 cm</span>
                  {roomPreview ? <button onClick={() => setShowBefore((value) => !value)}>{showBefore ? "Show designed room" : "Show before"}</button> : null}
                  <button onClick={() => window.print()}><Printer size={15} /> Print</button>
                  <button onClick={async () => { await navigator.clipboard?.writeText(`${location.origin}/room-composer`); }}><Share2 size={15} /> Share</button>
                  <button onClick={() => { setItems([]); setSelectedId(""); }}>Clear room</button>
                  {roomPreview ? <button onClick={() => {
                    URL.revokeObjectURL(roomPreview);
                    setRoomPreview("");
                    setRoomAnalysis(null);
                    if (roomInputRef.current) roomInputRef.current.value = "";
                  }}>Remove room photo</button> : null}
                </div>
              </details>
            </div>
            {planningMode === "accurate" ? <div className="chips" aria-label="Room dimensions"><label className="chip">Room width mm<input type="number" value={roomSize.widthMm} onChange={(event) => setRoomSize({ ...roomSize, widthMm: Number(event.target.value) })} /></label><label className="chip">Room length mm<input type="number" value={roomSize.lengthMm} onChange={(event) => setRoomSize({ ...roomSize, lengthMm: Number(event.target.value) })} /></label></div> : null}
            <div ref={stageRef} className={`stitch-composer-stage ${grid ? "has-grid" : ""}`}>
              {roomPreview ? (
                // Blob URLs are local room previews and cannot use the Next image optimizer.
                // eslint-disable-next-line @next/next/no-img-element
                <img className="stitch-composer-room" src={roomPreview} alt="Uploaded room scene" />
              ) : selectedBackground.src ? (
                <Image className="stitch-composer-room" src={selectedBackground.src} alt={selectedBackground.name} fill priority sizes="(max-width: 900px) 100vw, 75vw" />
              ) : (
                <div className="stitch-composer-neutral-room" aria-label="Neutral studio background"><span /><i /></div>
              )}
              <div className="stitch-composer-shade" />
              {!showBefore ? items.map((item) => {
                const product = activeProducts.find((candidate) => candidate.id === item.productId) ?? activeProducts[0];
                const turntableViews = generatedViews(product.slug);
                const generatedTurntable = turntableViews[(item.viewIndex ?? 0) % 4];
                return (
                  <button
                    key={item.id}
                    className={`stitch-composer-item ${selectedId === item.id ? "is-selected" : ""} ${generatedCutoutSlugs.has(product.slug) || sceneItemImage(product.id, item.viewIndex).toLowerCase().split("?")[0].endsWith(".png") ? "is-cutout" : "is-scene-crop"}`}
                    style={{ left: `${item.x}%`, top: `${item.y}%`, zIndex: item.zIndex, transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})` }}
                    onPointerDown={(event) => {
                      pushHistory();
                      setSelectedId(item.id);
                      setDragging(item.id);
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => move(event, item)}
                    onPointerUp={() => setDragging(null)}
                  >
                    {generatedTurntable ? <Image className="stitch-composer-turntable" src={generatedTurntable} alt={`${product.name}, generated view ${(item.viewIndex ?? 0) + 1}`} width={520} height={360} draggable={false} /> : <Image src={sceneItemImage(product.id, item.viewIndex)} alt={`${product.name}, view ${(item.viewIndex ?? 0) + 1}`} width={420} height={240} draggable={false} style={generatedCutoutSlugs.has(product.slug) ? { transform: cutoutViewTransform(item.viewIndex) } : undefined} />}
                  </button>
                );
              }) : null}

              {selected ? (
                <div className="stitch-composer-controls">
                  <button aria-label="Rotate selected product" onClick={() => updateSelected({ rotation: selected.rotation + 15 })}><RotateCw /></button>
                  <button aria-label="Make selected product smaller" onClick={() => updateSelected({ scale: Math.max(0.55, selected.scale - 0.1) })}><Minus /></button>
                  <button aria-label="Make selected product larger" onClick={() => updateSelected({ scale: Math.min(1.8, selected.scale + 0.1) })}><Plus /></button>
                  <button aria-label="Duplicate selected product" onClick={() => {
                    pushHistory();
                    const copy = { ...selected, id: `scene-${Date.now()}`, x: Math.min(92, selected.x + 4), y: Math.min(88, selected.y + 4), zIndex: items.length + 1 };
                    setItems((current) => [...current, copy]);
                    setSelectedId(copy.id);
                  }}><Copy /></button>
                  <button aria-label={selected.locked ? "Unlock selected product" : "Lock selected product"} onClick={() => updateSelected({ locked: !selected.locked })}>{selected.locked ? <Unlock /> : <Lock />}</button>
                  <button aria-label="Bring selected product forward" onClick={() => updateSelected({ zIndex: Math.max(...items.map((item) => item.zIndex ?? 1)) + 1 })}><Layers /></button>
                  <button aria-label="Remove selected product" onClick={() => { pushHistory(); setItems((current) => current.filter((item) => item.id !== selected.id)); setSelectedId(""); }}><Trash2 /></button>
                </div>
              ) : null}

              {selected ? (
                <div className="stitch-composer-properties">
                  <div className="stitch-composer-angle-control">
                    <span>Product views</span>
                    <strong>{productViewCount(selected.productId) > 1 ? ((selected.viewIndex ?? 0) % productViewCount(selected.productId)) + 1 : 1} / {productViewCount(selected.productId)}</strong>
                    <button type="button" aria-label="Previous product view" disabled={productViewCount(selected.productId) < 2} onClick={() => {
                      const count = productViewCount(selected.productId);
                      updateSelected({ viewIndex: ((selected.viewIndex ?? 0) - 1 + count) % count });
                    }}><ChevronLeft size={16} /></button>
                    <button type="button" aria-label="Next product view" disabled={productViewCount(selected.productId) < 2} onClick={() => {
                      const count = productViewCount(selected.productId);
                      updateSelected({ viewIndex: ((selected.viewIndex ?? 0) + 1) % count });
                    }}><ChevronRight size={16} /></button>
                  </div>
                  <label className="stitch-composer-size-control">Product size <span>{Math.round(selected.scale * 100)}%</span><input type="range" min="55" max="180" step="5" value={Math.round(selected.scale * 100)} onChange={(event) => updateSelected({ scale: Number(event.target.value) / 100 })} /></label>
                  <label>Material<select value={selected.materialId} onChange={(event) => updateSelected({ materialId: event.target.value })}>{(activeProducts.find((item) => item.id === selected.productId)?.materials ?? []).map((id) => <option key={id}>{id}</option>)}</select></label>
                  <label>Color<select value={selected.color} onChange={(event) => updateSelected({ color: event.target.value })}>{(activeProducts.find((item) => item.id === selected.productId)?.colors ?? []).map((color) => <option key={color}>{color}</option>)}</select></label>
                </div>
              ) : null}

              <div className="stitch-composer-summary">
                <div><small>Total items</small><strong>{String(items.length).padStart(2, "0")} Modules</strong></div>
                <button onClick={() => {
                  if (!window.confirm("Save this room concept to My Musterring?")) return;
                  const version = storage.roomScenes().length + 1;
                  const sceneId = `scene-${Date.now()}`;
                  const savedItems = items.map((item) => {
                    const product = activeProducts.find((candidate) => candidate.id === item.productId);
                    return { ...item, dimensions: product ? { widthMm: product.widthMm, depthMm: product.depthMm, heightMm: product.heightMm } : undefined };
                  });
                  storage.saveRoomScene({ id: sceneId, name: "Living Room Concept", version, planningMode, roomSize, backgroundId: roomBackgroundId, backgroundSrc: roomPreview ? undefined : selectedBackground.src, items: savedItems, hasLocalRoomPhoto: Boolean(roomPreview), createdAt: new Date().toISOString() });
                  const existingProject = storage.projects().find((project) => project.id === "project-room-composer");
                  const savedProductIds = [...new Set(items.map((item) => item.productId))];
                  const project: Project = {
                    id: "project-room-composer",
                    name: "Room Composer Project",
                    status: "Ideas Saved",
                    coverImage: roomPreview ? "/stitch-assets/original/room-living-clean.jpg" : selectedBackground.src || "/stitch-assets/original/room-living-clean.jpg",
                    savedProductIds,
                    savedConfigurationIds: existingProject?.savedConfigurationIds ?? [],
                    savedComparisonIds: existingProject?.savedComparisonIds ?? [],
                    notes: `${savedProductIds.length} products saved from Room Composer · Version ${version}`,
                    updatedAt: new Date().toISOString(),
                    demoData: false
                  };
                  storage.saveProject(project);
                  storage.track({ name: "room_scene_saved" });
                  setVersions(version);
                  setSavedVersions(storage.roomScenes() as Array<{ id?: string; version?: number; items?: SceneItem[] }>);
                  setSaved(true);
                }}><Save size={18} /> {saved ? "Saved to project" : "Save concept"}</button>
                <Link href="/handover"><Send size={18} /> Send concept to retailer</Link>
              </div>
            </div>
            <p className="stitch-composer-note">{planningMode === "accurate" ? "Accurate Planning Mode preserves entered room and product dimensions, but delivery feasibility must still be confirmed with a Musterring retailer." : "Inspirational visualization — product proportions and colors may vary. Never use this visualization for fit confirmation."} Saved versions: {versions}.</p>
            {savedVersions.length ? <div className="chips" aria-label="Saved room versions">{savedVersions.slice(-4).map((version, index) => <button className="chip" key={version.id ?? index} onClick={() => {
              if (!version.items) return;
              pushHistory();
              setItems(version.items);
              setSelectedId(version.items[0]?.id ?? "");
            }}>Open version {version.version ?? index + 1}</button>)}</div> : null}
          </div>
        </div>
      </section>

      <section className="section band stitch-engineering-specs">
        <div className="container">
          <div><h2>Planning summary</h2><p>Your room concept stays organized and ready for the next consultation step.</p></div>
          <dl>
            <div><dt>Planning mode</dt><dd>Interactive local composition</dd></div>
            <div><dt>Products</dt><dd>{activeProducts.length} available models</dd></div>
            <div><dt>Privacy</dt><dd>Room state stays in this browser</dd></div>
            <div><dt>Handover</dt><dd>Retailer-ready project summary</dd></div>
          </dl>
        </div>
      </section>
    </div>
  );
}

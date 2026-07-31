"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Copy, Grid3X3, Layers, Lock, Minus, Plus, Printer, Redo2, RotateCw, Save, Send, Share2, Trash2, Unlock, Upload } from "lucide-react";
import { PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { Category } from "@/lib/types";
import type { RoomAnalysis } from "@/lib/ai/schemas";

type SceneItem = {
  id: string;
  productId: string;
  x: number;
  y: number;
  rotation: number;
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
      .sort((left, right) => Number(!productImages(left.id)[0]?.endsWith(".png")) - Number(!productImages(right.id)[0]?.endsWith(".png"))),
    []
  );
  const [category, setCategory] = useState<Extract<Category, "sofa" | "armchair" | "storage">>("sofa");
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

  const catalog = activeProducts.filter((product) => product.category === category).slice(0, 10);
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
    setItems((current) => [...current, { id, productId, x: 50, y: 67 - current.length * 4, rotation: 0, scale: 0.9, materialId: product.materials[0], color: product.colors[0], zIndex: current.length + 1 }]);
    setSelectedId(id);
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

      <section className="section">
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
            <p className="eyebrow">Module categories</p>
            <div className="stitch-composer-tabs">
              <button className={category === "sofa" ? "is-active" : ""} onClick={() => setCategory("sofa")}>Seating</button>
              <button className={category === "armchair" ? "is-active" : ""} onClick={() => setCategory("armchair")}>Armchairs</button>
              <button className={category === "storage" ? "is-active" : ""} onClick={() => setCategory("storage")}>Storage</button>
            </div>
            <p className="eyebrow">Available products</p>
            <div className="stitch-composer-products">
              {catalog.map((product) => (
                <button key={product.id} onClick={() => addProduct(product.id)}>
                  <Image src={productImages(product.id)[0]} alt={product.name} width={280} height={200} />
                  <span>{product.modelCode}</span>
                  <small>{product.subtitle}</small>
                  <b><Plus size={14} /> Add to room</b>
                </button>
              ))}
            </div>
          </aside>

          <div>
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
              ) : (
                <Image className="stitch-composer-room" src="/musterring-catalog/mr-2875/image-01.jpg" alt="Contemporary living room scene" fill priority sizes="(max-width: 900px) 100vw, 75vw" />
              )}
              <div className="stitch-composer-shade" />
              {!showBefore ? items.map((item) => {
                const product = activeProducts.find((candidate) => candidate.id === item.productId) ?? activeProducts[0];
                return (
                  <button
                    key={item.id}
                    className={`stitch-composer-item ${selectedId === item.id ? "is-selected" : ""}`}
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
                    <Image src={productImages(product.id)[0]} alt={product.name} width={420} height={240} draggable={false} />
                    <span>{product.modelCode}</span>
                  </button>
                );
              }) : null}

              {selected ? (
                <div className="stitch-composer-controls">
                  <button aria-label="Rotate selected product" onClick={() => updateSelected({ rotation: selected.rotation + 15 })}><RotateCw /></button>
                  <button aria-label="Make selected product smaller" onClick={() => updateSelected({ scale: Math.max(0.55, selected.scale - 0.1) })}><Minus /></button>
                  <button aria-label="Make selected product larger" onClick={() => updateSelected({ scale: Math.min(1.5, selected.scale + 0.1) })}><Plus /></button>
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
                  <label>Material<select value={selected.materialId} onChange={(event) => updateSelected({ materialId: event.target.value })}>{(activeProducts.find((item) => item.id === selected.productId)?.materials ?? []).map((id) => <option key={id}>{id}</option>)}</select></label>
                  <label>Color<select value={selected.color} onChange={(event) => updateSelected({ color: event.target.value })}>{(activeProducts.find((item) => item.id === selected.productId)?.colors ?? []).map((color) => <option key={color}>{color}</option>)}</select></label>
                </div>
              ) : null}

              <div className="stitch-composer-summary">
                <div><small>Total items</small><strong>{String(items.length).padStart(2, "0")} Modules</strong></div>
                <button onClick={() => {
                  const version = storage.roomScenes().length + 1;
                  storage.saveRoomScene({ id: `scene-${Date.now()}`, name: "Living Room Concept", version, planningMode, roomSize, items: items.map((item) => {
                    const product = activeProducts.find((candidate) => candidate.id === item.productId);
                    return { ...item, dimensions: product ? { widthMm: product.widthMm, depthMm: product.depthMm, heightMm: product.heightMm } : undefined };
                  }), hasLocalRoomPhoto: Boolean(roomPreview), createdAt: new Date().toISOString() });
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

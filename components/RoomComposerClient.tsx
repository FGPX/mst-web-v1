"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { Box, Check, ChevronLeft, ChevronRight, Copy, Download, Grid3X3, Layers, Lock, Plus, Printer, Redo2, RotateCw, Save, Send, Share2, Sparkles, Trash2, Unlock, Upload } from "lucide-react";
import { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import { analyzePlacement, type Door, type RoomItem } from "@/lib/fit-simulator";
import type { RoomAnalysis } from "@/lib/ai/schemas";
import type { Product, Project } from "@/lib/types";

type ComposerCategory = "all" | "seating" | "armchair" | "storage" | "tables" | "bedroom";
const maxGeneratedVisualizationItems = 6;

const roomBackgrounds = [
  { id: "neutral", name: "Neutral studio", src: "" },
  { id: "natural", name: "Natural living", src: "/stitch-assets/original/room-living-clean.jpg" },
  { id: "city", name: "City lounge", src: "/musterring-catalog/mr-2875/image-01.jpg" },
  { id: "soft", name: "Soft retreat", src: "/musterring-catalog/mr-1370/image-01.jpg" }
] as const;

const generatedTurntableSlugs = new Set(["mr-alena", "mr-lia", "mr-281", "mr-2665", "mr-4100", "mr-5100", "mr-kleo", "mr-5111", "mr-720", "mr-9445"]);
const generatedRearViewSlugs = new Set(["justb-pm100", "justb-pm200"]);
const physicalFrontSlugs = new Set(["justb-pm100", "justb-pm200", "mr-kleo", "mr-nils", "mr-pamela", "mr-281", "mr-9445", "jana", "kanto"]);
const verifiedComposerSlugs = new Set(["justb-pm100", "justb-ct100", "nara", "mr-260", "mr-270", "mr-kleo", "mr-nils", "mr-pamela", "mr-281", "mr-9445", "jana", "kanto"]);
const composerDimensionLabels: Record<string, string> = {
  "mr-260": "3-seat catalogue reference",
  "mr-270": "3-seat catalogue reference"
};
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
const generatedViews = (slug: string) => {
  if (generatedTurntableSlugs.has(slug)) {
    // Only the catalogue-grounded front cutout is exposed. Generated rotations
    // can introduce modules or geometry that are not present in the product.
    const filename = physicalFrontSlugs.has(slug) ? "physical-front.png" : "official-front.png";
    return [`/generated-product-views/${slug}/${filename}?v=1`];
  }
  if (generatedRearViewSlugs.has(slug)) {
    if (slug === "justb-pm100") {
      return [
        "/generated-product-views/justb-pm100/physical-front.png?v=1",
        "/generated-product-views/justb-pm100/physical-back-v3.png?v=1"
      ];
    }
    return [`/generated-product-views/${slug}/physical-front.png?v=1`];
  }
  return [];
};

type ComposerFinish = {
  materialId: string;
  materialLabel: string;
  color: string;
  image: string;
};

// Only finishes documented for these catalogue models are offered here. Each
// option has its own cutout so the room preview follows the selected finish.
const composerFinishes: Record<string, ComposerFinish[]> = {
  "justb-ct100": [
    { materialId: "ct100-light-wild-oak", materialLabel: "Light wild oak veneer", color: "natural oak", image: "/generated-product-views/justb-ct100/official-front.png?v=4" },
    { materialId: "ct100-black-oak", materialLabel: "Black oak veneer, lacquered", color: "black oak", image: "/generated-product-views/justb-ct100/physical-black-oak.png?v=1" }
  ],
  "nara": [
    { materialId: "nara-dekton-sirius", materialLabel: "Dekton Sirius", color: "dark stone", image: "/generated-product-views/nara/physical-dark-stone.png?v=1" },
    { materialId: "nara-natural-oak", materialLabel: "Natural oak", color: "natural oak", image: "/generated-product-views/nara/physical-natural-oak.png?v=1" },
    { materialId: "nara-knotty-oak", materialLabel: "Knotty oak", color: "knotty oak", image: "/generated-product-views/nara/physical-knotty-oak.png?v=1" }
  ]
};

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

type SavedScene = {
  id?: string;
  version?: number;
  sceneScale?: number;
  items?: SceneItem[];
};

type Wall = Door["wall"];
type MeasuredOpening = { id: string; wall: Wall; positionCm: number; widthCm: number; heightCm: number; sillHeightCm?: number; hinge?: Door["hinge"]; opens?: Door["opens"] };
type FixedFeature = { id: string; kind: "radiator" | "built-in" | "column" | "other"; name: string; xCm: number; yCm: number; widthCm: number; depthCm: number; heightCm: number };

export function RoomComposerClient({ upload = false, openPresentationScene = false, recommendedProductIds = [] }: { upload?: boolean; openPresentationScene?: boolean; recommendedProductIds?: string[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);
  const activeProducts = useMemo(
    () => products
      .filter((product) => product.active)
      .sort((left, right) => Number(!generatedCutoutSlugs.has(left.slug)) - Number(!generatedCutoutSlugs.has(right.slug))),
    []
  );
  const [category, setCategory] = useState<ComposerCategory>(upload ? "all" : "seating");
  const [productQuery, setProductQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(upload ? 8 : 12);
  const [roomBackgroundId, setRoomBackgroundId] = useState<(typeof roomBackgrounds)[number]["id"]>("neutral");
  const [items, setItems] = useState<SceneItem[]>(() => upload
    ? []
    : [{ id: "scene-product-1", productId: activeProducts[0].id, x: 50, y: 86, rotation: 0, scale: 1, materialId: activeProducts[0].materials[0], color: activeProducts[0].colors[0], zIndex: 1 }]);
  const [history, setHistory] = useState<SceneItem[][]>([]);
  const [future, setFuture] = useState<SceneItem[][]>([]);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [grid, setGrid] = useState(true);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [roomPreview, setRoomPreview] = useState("");
  const [roomPhoto, setRoomPhoto] = useState<File | null>(null);
  const [uploadConsent, setUploadConsent] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [planningMode, setPlanningMode] = useState<"inspiration" | "accurate">("inspiration");
  const [showBefore, setShowBefore] = useState(false);
  const [versions, setVersions] = useState(0);
  const [savedVersions, setSavedVersions] = useState<SavedScene[]>([]);
  const [sceneScale, setSceneScale] = useState(1);
  const [roomSize, setRoomSize] = useState({ widthMm: 5600, lengthMm: 4200 });
  const [roomAnalysis, setRoomAnalysis] = useState<RoomAnalysis | null>(null);
  const [composerNotice, setComposerNotice] = useState(() => recommendedProductIds.length
    ? `${recommendedProductIds.length === 1 ? "Your selected product is" : "Your selected products are"} ready. Choose the products you want to add.`
    : "");
  const [generatedVisualization, setGeneratedVisualization] = useState("");
  const [generatedForSignature, setGeneratedForSignature] = useState("");
  const [generationStatus, setGenerationStatus] = useState<"idle" | "loading" | "error">("idle");
  const [generationError, setGenerationError] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showGenerated, setShowGenerated] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [fitOpen, setFitOpen] = useState(false);
  const [measuredRoom, setMeasuredRoom] = useState({ widthCm: 0, lengthCm: 0, heightCm: 0 });
  const [measuredDoors, setMeasuredDoors] = useState<MeasuredOpening[]>([]);
  const [measuredWindows, setMeasuredWindows] = useState<MeasuredOpening[]>([]);
  const [fixedFeatures, setFixedFeatures] = useState<FixedFeature[]>([]);
  const [featuresConfirmed, setFeaturesConfirmed] = useState(false);
  const [configurationsConfirmed, setConfigurationsConfirmed] = useState(false);
  useEffect(() => {
    storage.track({ name: "room_composer_started" });
    const scenes = storage.roomScenes() as SavedScene[];
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

  useEffect(() => {
    if (generationStatus !== "loading") return;

    const startedAt = Date.now();
    setGenerationProgress(4);
    const timer = window.setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      // Image generation does not stream progress, so advance an honest estimate
      // and wait below 100% until the request has actually completed.
      setGenerationProgress(Math.min(92, Math.round(4 + 88 * (1 - Math.exp(-elapsedSeconds / 55)))));
    }, 750);

    return () => window.clearInterval(timer);
  }, [generationStatus]);

  const categoryMatches = (productCategory: string) => {
    if (category === "all") return true;
    if (category === "seating") return productCategory === "sofa" || productCategory === "sectional";
    if (category === "armchair") return productCategory === "armchair";
    if (category === "storage") return ["storage", "wardrobe", "bedroom-series"].includes(productCategory);
    if (category === "bedroom") return ["bed", "bedroom-series", "wardrobe", "home-textile"].includes(productCategory);
    return ["coffee-table", "dining-table", "small-furniture"].includes(productCategory);
  };
  const catalog = activeProducts.filter((product) => categoryMatches(product.category)
    && (upload || generatedCutoutSlugs.has(product.slug))
    && `${product.modelCode} ${product.name} ${product.subtitle}`.toLowerCase().includes(productQuery.toLowerCase()))
    .sort((left, right) => category === "bedroom"
      ? Number(left.category !== "bed") - Number(right.category !== "bed")
      : 0);
  const recommendedProductIdSet = useMemo(() => new Set(recommendedProductIds), [recommendedProductIds]);
  const recommendedProducts = recommendedProductIds
    .map((productId) => activeProducts.find((product) => product.id === productId))
    .filter((product): product is Product => Boolean(product));
  const otherCatalog = upload && recommendedProducts.length
    ? catalog.filter((product) => !recommendedProductIdSet.has(product.id))
    : catalog;
  const visibleCatalog = otherCatalog.slice(0, visibleCount);
  const selectedBackground = roomBackgrounds.find((background) => background.id === roomBackgroundId) ?? roomBackgrounds[0];
  const fitAssessment = useMemo(() => {
    const selected = items.map((item) => ({ item, product: activeProducts.find((product) => product.id === item.productId) })).filter((entry) => entry.product);
    const missing: string[] = [];
    if (!measuredRoom.widthCm || !measuredRoom.lengthCm || !measuredRoom.heightCm) missing.push("Enter the room width, length, and height.");
    if (!featuresConfirmed) missing.push("Confirm that every door, window, radiator, built-in, column, and other fixed obstruction is included.");
    if (!configurationsConfirmed) missing.push("Confirm the exact selected product configurations with their verified dimensions.");
    const unverified = selected.filter(({ product }) => !product!.verifiedFacts.dimensions);
    if (unverified.length) missing.push(`Verified configuration dimensions are unavailable for ${unverified.map(({ product }) => product!.modelCode).join(", ")}.`);
    if (!selected.length) missing.push("Choose at least one product.");
    if (missing.length) return { status: "unverified" as const, missing, issues: [] as string[], severity: undefined };

    const widthMm = measuredRoom.widthCm * 10;
    const lengthMm = measuredRoom.lengthCm * 10;
    const doors: Door[] = measuredDoors.map((door) => ({ id: door.id, wall: door.wall, position: door.positionCm * 10, width: door.widthCm * 10, height: door.heightCm * 10, hinge: door.hinge ?? "left", opens: door.opens ?? "inward" }));
    const obstacles: RoomItem[] = fixedFeatures.map((feature) => ({ id: feature.id, kind: feature.kind === "built-in" ? "obstacle" : feature.kind === "other" ? "obstacle" : feature.kind, name: feature.name || feature.kind, x: feature.xCm * 10, y: feature.yCm * 10, width: feature.widthCm * 10, depth: feature.depthCm * 10, locked: true }));
    const issues: { message: string; severity: "tight" | "conflict" }[] = [];
    selected.forEach(({ item, product }, index) => {
      const placement = { x: item.x / 100 * widthMm, y: item.y / 100 * lengthMm - product!.depthMm / 2, rotation: item.rotation };
      const otherProducts: RoomItem[] = selected.filter((_, otherIndex) => otherIndex !== index).map(({ item: otherItem, product: otherProduct }) => {
        const quarterTurn = Math.abs(otherItem.rotation % 180) > 45 && Math.abs(otherItem.rotation % 180) < 135;
        const otherWidth = quarterTurn ? otherProduct!.depthMm : otherProduct!.widthMm;
        const otherDepth = quarterTurn ? otherProduct!.widthMm : otherProduct!.depthMm;
        return { id: otherItem.id, kind: "furniture", name: otherProduct!.modelCode, x: otherItem.x / 100 * widthMm - otherWidth / 2, y: otherItem.y / 100 * lengthMm - otherDepth, width: otherWidth, depth: otherDepth };
      });
      const lowWindows: RoomItem[] = measuredWindows.filter((window) => product!.heightMm > (window.sillHeightCm ?? 0) * 10).map((window) => {
        const position = window.positionCm * 10;
        const span = window.widthCm * 10;
        if (window.wall === "north") return { id: window.id, kind: "restricted", name: "low window", x: position, y: 0, width: span, depth: 120 };
        if (window.wall === "south") return { id: window.id, kind: "restricted", name: "low window", x: position, y: lengthMm - 120, width: span, depth: 120 };
        if (window.wall === "west") return { id: window.id, kind: "restricted", name: "low window", x: 0, y: position, width: 120, depth: span };
        return { id: window.id, kind: "restricted", name: "low window", x: widthMm - 120, y: position, width: 120, depth: span };
      });
      if (product!.heightMm > measuredRoom.heightCm * 10) issues.push({ message: `${product!.modelCode} is taller than the measured room.`, severity: "conflict" });
      const analysis = analyzePlacement(widthMm, lengthMm, product!, placement, [...obstacles, ...otherProducts, ...lowWindows], doors);
      analysis.issues.forEach((issue) => issues.push({ message: `${product!.modelCode}: ${issue.message}`, severity: issue.severity }));
    });
    const uniqueIssues = [...new Map(issues.map((issue) => [issue.message, issue])).values()];
    const severity = uniqueIssues.some((issue) => issue.severity === "conflict") ? "conflict" as const : uniqueIssues.length ? "tight" as const : undefined;
    return { status: severity ?? "safe" as const, missing, issues: uniqueIssues.map((issue) => issue.message), severity };
  }, [activeProducts, configurationsConfirmed, featuresConfirmed, fixedFeatures, items, measuredDoors, measuredRoom, measuredWindows]);
  const sceneSignature = useMemo(() => JSON.stringify({
    room: roomPhoto ? [roomPhoto.name, roomPhoto.size, roomPhoto.lastModified] : null,
    sceneScale,
    items: items.map(({ productId, x, y, rotation, scale, materialId, color }) => ({ productId, x, y, rotation, scale, materialId, color }))
  }), [items, roomPhoto, sceneScale]);
  const generatedIsCurrent = Boolean(generatedVisualization && generatedForSignature === sceneSignature);
  const displayGenerated = generatedIsCurrent && showGenerated && !showBefore;
  const composerImage = (productId: string) => {
    const product = activeProducts.find((item) => item.id === productId);
    if (product && physicalFrontSlugs.has(product.slug)) return `/generated-product-views/${product.slug}/physical-front.png?v=1`;
    if (product && generatedCutoutSlugs.has(product.slug)) return `/generated-product-views/${product.slug}/official-front.png?v=4`;
    const images = productImages(productId);
    return images.find((image) => image.toLowerCase().endsWith(".png")) ?? images[0];
  };
  const sceneItemImage = (productId: string, viewIndex = 0, materialId?: string, color?: string) => {
    const product = activeProducts.find((item) => item.id === productId);
    const views = product ? generatedViews(product.slug) : [];
    if (views.length) return views[viewIndex % views.length];
    const finishes = product ? composerFinishes[product.slug] : undefined;
    const finish = finishes?.find((option) => option.materialId === materialId)
      ?? finishes?.find((option) => option.color === color)
      ?? finishes?.[0];
    if (finish) return finish.image;
    if (product && generatedCutoutSlugs.has(product.slug) && !generatedTurntableSlugs.has(product.slug)) return composerImage(productId);
    if (viewIndex === 0) return composerImage(productId);
    const images = productImages(productId);
    return images[viewIndex % images.length] ?? composerImage(productId);
  };
  const productViewCount = (productId: string) => {
    const product = activeProducts.find((item) => item.id === productId);
    if (!product) return 1;
    const views = generatedViews(product.slug);
    if (views.length) return views.length;
    if (generatedCutoutSlugs.has(product.slug)) return 1;
    return productImages(productId).length;
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
    const finish = composerFinishes[product.slug]?.[0];
    setItems((current) => {
      const topLayer = Math.max(0, ...current.map((item) => item.zIndex ?? 0)) + 1;
      return [...current, { id, productId, x: 44 + ((current.length * 8) % 24), y: 86, rotation: 0, scale: 1, materialId: finish?.materialId ?? product.materials[0], color: finish?.color ?? product.colors[0], zIndex: topLayer }];
    });
    setSelectedId(id);
    setShowBefore(false);
    setSaved(false);
    setComposerNotice(verifiedComposerSlugs.has(product.slug)
      ? `${product.modelCode} was added to the room at catalogue scale.`
      : `${product.modelCode} was added as a visual preview; placement dimensions require retailer confirmation.`);
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const replaceSelectedProduct = (productId: string) => {
    if (!selected) return addProduct(productId);
    const product = activeProducts.find((item) => item.id === productId) ?? activeProducts[0];
    const finish = composerFinishes[product.slug]?.[0];
    const topLayer = Math.max(0, ...items.map((item) => item.zIndex ?? 0)) + 1;
    pushHistory();
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, productId, viewIndex: 0, x: 50, y: 86, scale: 1, zIndex: topLayer, materialId: finish?.materialId ?? product.materials[0], color: finish?.color ?? product.colors[0] } : item));
    setSelectedId(selected.id);
    setShowBefore(false);
    setSaved(false);
    setComposerNotice(verifiedComposerSlugs.has(product.slug)
      ? `${product.modelCode} is now selected at catalogue scale.`
      : `${product.modelCode} is now shown as a visual preview; placement dimensions require retailer confirmation.`);
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const productCard = (product: Product, recommended = false) => {
    const hasVerifiedDimensions = verifiedComposerSlugs.has(product.slug);
    const alreadyInRoom = items.some((item) => item.productId === product.id);
    return (
      <article key={product.id} className={recommended ? "is-recommended" : undefined}>
        <div className={`stitch-composer-product-media ${composerImage(product.id).toLowerCase().endsWith(".png") ? "is-cutout" : "is-scene"}`}><Image src={composerImage(product.id)} alt={`${product.modelCode} product crop`} width={280} height={200} /><span>{recommended ? "Selected product" : "Product focus"}</span></div>
        <div className="stitch-composer-product-copy">
          <span>{product.modelCode}</span>
          {product.name.trim().toLowerCase() !== product.modelCode.trim().toLowerCase() ? <strong>{product.name}</strong> : null}
          {!upload ? <small>{product.subtitle}</small> : null}
          {!upload ? (hasVerifiedDimensions ? <small>{composerDimensionLabels[product.slug] ?? "Catalogue dimensions ready for room placement"}</small> : <small>Visual preview only · dimensions require retailer confirmation</small>) : null}
          {!upload && product.authorizedContent && product.sourceUrl ? <a href={product.sourceUrl} target="_blank" rel="noreferrer">Official Musterring product</a> : null}
        </div>
        <div className="stitch-composer-product-actions">
          <button type="button" disabled={upload && alreadyInRoom} onClick={() => addProduct(product.id)}>{upload && alreadyInRoom ? <Check size={14} /> : <Plus size={14} />} {upload ? alreadyInRoom ? "Added" : "Add" : hasVerifiedDimensions ? "Add to room" : "Add visual preview"}</button>
          {!upload && selected ? <button type="button" className="ghost replace" onClick={() => replaceSelectedProduct(product.id)}>Replace selected</button> : null}
        </div>
      </article>
    );
  };
  const chooseBackground = (backgroundId: (typeof roomBackgrounds)[number]["id"]) => {
    if (roomPreview) URL.revokeObjectURL(roomPreview);
    setRoomPreview("");
    setRoomPhoto(null);
    setRoomAnalysis(null);
    setGeneratedVisualization("");
    setGeneratedForSignature("");
    setShowGenerated(false);
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

  const moveSelectedWithKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!selected || selected.locked || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const target = event.target as HTMLElement;
    if (target.closest(".stitch-composer-properties, .stitch-composer-controls, .stitch-composer-summary")) return;
    event.preventDefault();
    const stepMm = event.shiftKey ? 500 : grid ? 100 : 50;
    const stepX = (stepMm / Math.max(roomSize.widthMm, 1)) * 100;
    const stepY = (stepMm / Math.max(roomSize.lengthMm, 1)) * 100;
    const xDelta = event.key === "ArrowLeft" ? -stepX : event.key === "ArrowRight" ? stepX : 0;
    const yDelta = event.key === "ArrowUp" ? -stepY : event.key === "ArrowDown" ? stepY : 0;
    pushHistory();
    setItems((current) => current.map((item) => item.id === selected.id ? {
      ...item,
      x: Math.max(8, Math.min(92, item.x + xDelta)),
      y: Math.max(20, Math.min(88, item.y + yDelta))
    } : item));
    setSaved(false);
  };

  const generateRoomVisualization = async () => {
    setGenerationError("");
    if (!roomPhoto || !roomPreview) {
      setGenerationStatus("error");
      setGenerationError("Upload a real room photo first.");
      return;
    }
    if (!items.length || items.length > maxGeneratedVisualizationItems) {
      setGenerationStatus("error");
      setGenerationError(`Choose between one and ${maxGeneratedVisualizationItems} products for one generated view.`);
      return;
    }
    const confirmed = window.confirm(
      "Generate a new full-room image? Your room photo and selected catalogue product references will be sent to OpenAI, and this request uses image-generation quota. Your uploaded file stays unchanged. The selected products are locked to their catalogue references, while the generated image may reinterpret room lighting, room finishes, decor, and loose objects."
    );
    if (!confirmed) return;

    setGenerationStatus("loading");
    const signature = sceneSignature;
    const form = new FormData();
    form.append("image", roomPhoto);
    form.append("consent", "true");
    form.append("confirmed", "true");
    form.append("items", JSON.stringify(items.map((item) => ({
      productId: item.productId,
      x: item.x,
      y: item.y,
      rotation: item.rotation,
      scale: item.scale * sceneScale,
      materialId: item.materialId,
      color: item.color
    }))));

    const response = await fetch("/api/ai/room-visualization", { method: "POST", body: form }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.image) {
      setGenerationStatus("error");
      setGenerationError(payload?.error ?? "The room visualization could not be generated. Please try again.");
      return;
    }

    setGeneratedVisualization(payload.image);
    setGeneratedForSignature(signature);
    setComparisonPosition(50);
    setGenerationProgress(100);
    setGenerationStatus("idle");
    setShowBefore(false);
    setShowGenerated(true);
    storage.track({ name: "room_visualization_generated" });
  };

  return (
    <div className={`stitch-room-composer ${upload ? "is-upload-flow" : ""}`}>
      <section className="stitch-composer-intro">
        <div className="container">
          <p className="eyebrow">{upload ? "Room preview" : "Room planning"}</p>
          <div>
            <div>
              <h1>{upload ? "See it in your room" : "Room Composer"}</h1>
              <p>{upload ? "Upload a photo, choose products, and generate a realistic preview." : "Upload your real room, choose catalogue products, arrange their approximate placement, and generate a realistic staged view while keeping the original photo available for comparison."}</p>
            </div>
            <div className="chips">
              {!upload ? <Link className="button ghost" href="/room-planner"><Box size={18} /> Open 3D Room Planner</Link> : null}
              <button className="button consult" disabled={!upload && !uploadConsent} onClick={() => roomInputRef.current?.click()}><Upload size={18} /> {upload ? "Choose room photo" : "Upload room photo"}</button>
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
                  if (roomPreview) URL.revokeObjectURL(roomPreview);
                  setRoomPreview(URL.createObjectURL(file));
                  setRoomPhoto(file);
                  setRoomAnalysis(null);
                  setGeneratedVisualization("");
                  setGeneratedForSignature("");
                  setShowGenerated(false);
                  setShowBefore(false);
                  if (upload) {
                    storage.track({ name: "room_photo_selected" });
                    return;
                  }
                  const form = new FormData();
                  form.append("image", file);
                  form.append("consent", String(uploadConsent));
                  const validation = await fetch("/api/ai/room", { method: "POST", body: form }).catch(() => null);
                  const payload = validation ? await validation.json().catch(() => null) : null;
                  if (!validation?.ok || !payload?.analysis) {
                    setUploadError(payload?.error
                      ? `The photo is ready, but room analysis could not be completed: ${payload.error}`
                      : "The photo is ready, but room analysis could not be completed.");
                    return;
                  }
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
          {!upload ? <div className="card card-body stitch-composer-privacy" style={{ gridColumn: "1 / -1" }}>
            <p className="eyebrow">Private room upload</p>
            <p>{upload ? "Your photo is sent only when you confirm generation. This app does not save it." : "Your photo is sent for room analysis only after you consent. Generating a realistic staged view requires a second confirmation before the room photo and selected catalogue references are sent to OpenAI. This application does not save the uploaded photo."}</p>
            <label className="chip"><input type="checkbox" checked={uploadConsent} onChange={(event) => {
              setUploadConsent(event.target.checked);
              storage.recordConsent("photo-ai-processing", event.target.checked);
            }} /> I agree to temporary AI processing.</label>
            {uploadError ? <p className="form-error" role="alert">{uploadError}</p> : null}
          </div> : null}
          {!upload && roomAnalysis ? (
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
            {!upload ? <><div className="stitch-composer-library-heading">
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
            </div></> : null}
            <p className="eyebrow">{upload ? "Choose products" : "Module categories"}</p>
            <div className="stitch-composer-tabs">
              {upload ? <button className={category === "all" ? "is-active" : ""} onClick={() => { setCategory("all"); setVisibleCount(8); }}>All</button> : null}
              <button className={category === "seating" ? "is-active" : ""} onClick={() => { setCategory("seating"); setVisibleCount(upload ? 8 : 12); }}>Seating</button>
              {upload ? <button className={category === "bedroom" ? "is-active" : ""} onClick={() => { setCategory("bedroom"); setVisibleCount(8); }}>Bedroom</button> : null}
              <button className={category === "armchair" ? "is-active" : ""} onClick={() => setCategory("armchair")}>Armchairs</button>
              <button className={category === "storage" ? "is-active" : ""} onClick={() => setCategory("storage")}>Storage</button>
              <button className={category === "tables" ? "is-active" : ""} onClick={() => setCategory("tables")}>Tables</button>
            </div>
            <div className="stitch-composer-catalog-heading"><p className="eyebrow">Available products</p><span>{catalog.length} models</span></div>
            <input className="stitch-composer-search" type="search" value={productQuery} onChange={(event) => { setProductQuery(event.target.value); setVisibleCount(upload ? 4 : 12); }} placeholder="Search model or product" aria-label="Search products" />
            {upload && recommendedProducts.length ? <section className="stitch-composer-product-group is-yours" aria-labelledby="selected-products-heading">
              <div className="stitch-composer-product-group-heading"><strong id="selected-products-heading">Selected products</strong><span>{recommendedProducts.length}</span></div>
              <div className="stitch-composer-products">{recommendedProducts.map((product) => productCard(product, true))}</div>
            </section> : null}
            <section className="stitch-composer-product-group" aria-labelledby={upload && recommendedProducts.length ? "other-products-heading" : undefined} aria-label={upload && recommendedProducts.length ? undefined : "Available products"}>
              {upload && recommendedProducts.length ? <div className="stitch-composer-product-group-heading"><strong id="other-products-heading">Other products</strong><span>{otherCatalog.length}</span></div> : null}
              <div className="stitch-composer-products">{visibleCatalog.map((product) => productCard(product))}</div>
            </section>
            {visibleCount < otherCatalog.length ? <button type="button" className="stitch-composer-show-more" onClick={() => setVisibleCount((count) => count + (upload ? 8 : 12))}>{upload ? `Show more (${otherCatalog.length - visibleCount})` : "Show 12 more"}</button> : null}
          </aside>

          <div className="stitch-composer-main">
            {composerNotice ? <p className="stitch-composer-feedback" role="status"><Check size={16} /> {composerNotice}</p> : null}
            {!upload ? <div className="stitch-composer-toolbar">
              <button className={planningMode === "accurate" ? "is-active" : ""} onClick={() => setPlanningMode((mode) => mode === "accurate" ? "inspiration" : "accurate")}>{planningMode === "accurate" ? "Accurate Planning Mode" : "Inspiration Mode"}</button>
              <button onClick={undo} disabled={!history.length}>Undo</button>
              <button onClick={redo} disabled={!future.length}><Redo2 size={15} /> Redo</button>
              <label className="stitch-composer-global-scale">
                <span>All items</span>
                <input aria-label="Scale all room items together" type="range" min="55" max="145" step="5" value={Math.round(sceneScale * 100)} onChange={(event) => { setSceneScale(Number(event.target.value) / 100); setSaved(false); }} />
                <strong>{Math.round(sceneScale * 100)}%</strong>
              </label>
              <details className="stitch-composer-more-tools">
                <summary>More tools</summary>
                <div>
                  <button className={grid ? "is-active" : ""} onClick={() => setGrid((value) => !value)}><Grid3X3 size={16} /> Grid: {grid ? "on" : "off"}</button>
                  <span>Snap: 10 cm</span>
                  {roomPreview ? <button onClick={() => setShowBefore((value) => !value)}>{showBefore ? (generatedIsCurrent && showGenerated ? "Show generated view" : "Show product layout") : "Show original room"}</button> : null}
                  <button onClick={() => window.print()}><Printer size={15} /> Print</button>
                  <button onClick={async () => { await navigator.clipboard?.writeText(`${location.origin}/room-composer`); }}><Share2 size={15} /> Share</button>
                  <button onClick={() => { setItems([]); setSelectedId(""); }}>Clear room</button>
                  {roomPreview ? <button onClick={() => {
                    URL.revokeObjectURL(roomPreview);
                    setRoomPreview("");
                    setRoomPhoto(null);
                    setRoomAnalysis(null);
                    setGeneratedVisualization("");
                    setGeneratedForSignature("");
                    setShowGenerated(false);
                    setShowBefore(false);
                    if (roomInputRef.current) roomInputRef.current.value = "";
                  }}>Remove room photo</button> : null}
                </div>
              </details>
            </div> : roomPreview ? <div className="stitch-composer-view-toggle" aria-label="Room view">
              <button className={showBefore ? "is-active" : ""} onClick={() => setShowBefore(true)}>Original</button>
              <button className={!showBefore && !displayGenerated ? "is-active" : ""} onClick={() => { setShowBefore(false); setShowGenerated(false); }}>Layout</button>
              {generatedIsCurrent ? <button className={displayGenerated ? "is-active" : ""} onClick={() => { setShowBefore(false); setShowGenerated(true); }}>Visualized</button> : null}
            </div> : null}
            {!upload && planningMode === "accurate" ? <div className="chips" aria-label="Room dimensions"><label className="chip">Room width mm<input type="number" value={roomSize.widthMm} onChange={(event) => setRoomSize({ ...roomSize, widthMm: Number(event.target.value) })} /></label><label className="chip">Room length mm<input type="number" value={roomSize.lengthMm} onChange={(event) => setRoomSize({ ...roomSize, lengthMm: Number(event.target.value) })} /></label></div> : null}
            <div className="stitch-composer-stage-with-sidebar">
              <div ref={stageRef} className={`stitch-composer-stage ${grid ? "has-grid" : ""}`} tabIndex={0} aria-label="Room scene. Select a product and use the arrow keys to move it." onKeyDown={moveSelectedWithKeyboard}>
              {displayGenerated ? (
                <div className="stitch-room-comparison">
                  {/* Generated data URLs and local blob URLs cannot use the Next image optimizer. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="stitch-composer-room" src={generatedVisualization} alt="AI-generated room" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="stitch-composer-room stitch-room-comparison-original"
                    src={roomPreview}
                    alt="Original uploaded room"
                    style={{ clipPath: `inset(0 ${100 - comparisonPosition}% 0 0)` }}
                  />
                  <span className="stitch-room-comparison-label is-original">Original</span>
                  <span className="stitch-room-comparison-label is-generated">Generated</span>
                  <span className="stitch-room-comparison-divider" style={{ left: `${comparisonPosition}%` }} aria-hidden="true"><i><ChevronLeft size={16} /><ChevronRight size={16} /></i></span>
                  <input
                    className="stitch-room-comparison-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={comparisonPosition}
                    onChange={(event) => setComparisonPosition(Number(event.target.value))}
                    onKeyDown={(event) => event.stopPropagation()}
                    aria-label={`Compare original and generated room: ${comparisonPosition}% original`}
                  />
                </div>
              ) : roomPreview ? (
                // Blob URLs are local room previews and cannot use the Next image optimizer.
                // eslint-disable-next-line @next/next/no-img-element
                <img className="stitch-composer-room" src={roomPreview} alt="Uploaded room scene" />
              ) : selectedBackground.src ? (
                <Image className="stitch-composer-room" src={selectedBackground.src} alt={selectedBackground.name} fill priority sizes="(max-width: 900px) 100vw, 75vw" />
              ) : (
                <div className="stitch-composer-neutral-room" aria-label="Neutral studio background"><span /><i /></div>
              )}
              {upload && !roomPreview ? <div className="stitch-composer-empty-state"><Upload size={22} /><strong>Upload your room photo</strong></div> : null}
              {upload && roomPreview && !items.length ? <div className="stitch-composer-empty-state"><Plus size={22} /><strong>Choose a product to add</strong></div> : null}
              {!displayGenerated && !showBefore ? <div className="stitch-composer-shade" /> : null}
              {!showBefore && !displayGenerated ? items.map((item) => {
                const product = activeProducts.find((candidate) => candidate.id === item.productId) ?? activeProducts[0];
                const turntableViews = generatedViews(product.slug);
                const generatedTurntable = turntableViews.length
                  ? turntableViews[(item.viewIndex ?? 0) % turntableViews.length]
                  : undefined;
                const itemImage = sceneItemImage(product.id, item.viewIndex, item.materialId, item.color);
                const isCutoutImage = generatedCutoutSlugs.has(product.slug) || itemImage.toLowerCase().split("?")[0].endsWith(".png");
                const hasVerifiedDimensions = verifiedComposerSlugs.has(product.slug);
                const relativeWidth = hasVerifiedDimensions
                  ? (product.widthMm / Math.max(roomSize.widthMm, 1)) * 100 * sceneScale
                  : (["sofa", "sectional"].includes(product.category) ? 42 : 22) * sceneScale;
                return (
                  <button
                    key={item.id}
                    className={`stitch-composer-item has-physical-aspect ${["sofa", "sectional"].includes(product.category) ? "is-sofa" : ""} ${selectedId === item.id ? "is-selected" : ""} ${isCutoutImage ? "is-cutout" : "is-scene-crop"}`}
                    style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${relativeWidth}%`, aspectRatio: hasVerifiedDimensions ? `${product.widthMm} / ${product.heightMm}` : (["sofa", "sectional"].includes(product.category) ? "16 / 7" : "1 / 1"), zIndex: item.zIndex, transform: `translate(-50%, -100%) rotate(${item.rotation}deg)` }}
                    onPointerDown={(event) => {
                      pushHistory();
                      setSelectedId(item.id);
                      setDragging(item.id);
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => move(event, item)}
                    onPointerUp={() => setDragging(null)}
                  >
                    {generatedTurntable ? <Image className="stitch-composer-turntable" src={generatedTurntable} alt={`${product.name}, catalogue view`} width={520} height={360} draggable={false} style={{ objectFit: "contain" }} /> : <Image src={itemImage} alt={`${product.name}, catalogue view`} width={420} height={240} draggable={false} style={{ objectFit: isCutoutImage ? "contain" : "cover" }} />}
                  </button>
                );
              }) : null}

              {selected && !showBefore && !displayGenerated ? (
                <div className="stitch-composer-controls">
                  <button aria-label="Rotate selected product" onClick={() => updateSelected({ rotation: selected.rotation + 15 })}><RotateCw /></button>
                  {!upload ? <button aria-label="Duplicate selected product" onClick={() => {
                    pushHistory();
                    const topLayer = Math.max(0, ...items.map((item) => item.zIndex ?? 0)) + 1;
                    const copy = { ...selected, id: `scene-${Date.now()}`, x: Math.min(92, selected.x + 4), y: Math.min(88, selected.y + 4), zIndex: topLayer };
                    setItems((current) => [...current, copy]);
                    setSelectedId(copy.id);
                  }}><Copy /></button> : null}
                  {!upload ? <button aria-label={selected.locked ? "Unlock selected product" : "Lock selected product"} onClick={() => updateSelected({ locked: !selected.locked })}>{selected.locked ? <Unlock /> : <Lock />}</button> : null}
                  {!upload ? <button aria-label="Bring selected product forward" onClick={() => updateSelected({ zIndex: Math.max(...items.map((item) => item.zIndex ?? 1)) + 1 })}><Layers /></button> : null}
                  <button aria-label="Remove selected product" onClick={() => { pushHistory(); setItems((current) => current.filter((item) => item.id !== selected.id)); setSelectedId(""); }}><Trash2 /></button>
                </div>
              ) : null}
            </div>

              {!upload && selected ? (
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
                  <div className="stitch-composer-relative-size"><span>{(() => { const product = activeProducts.find((item) => item.id === selected.productId); return product && verifiedComposerSlugs.has(product.slug) ? composerDimensionLabels[product.slug] ?? "Dimension-proportional size" : "Visual preview only"; })()}</span><strong>{(() => { const product = activeProducts.find((item) => item.id === selected.productId); return product && verifiedComposerSlugs.has(product.slug) ? `W ${Math.round(product.widthMm / 10)} × D ${Math.round(product.depthMm / 10)} × H ${Math.round(product.heightMm / 10)} cm` : "Dimensions require retailer confirmation"; })()}</strong></div>
                  <small className="stitch-composer-keyboard-hint">Move with arrow keys · hold Shift for 50 cm</small>
                  {(() => {
                    const product = activeProducts.find((item) => item.id === selected.productId);
                    const finishes = product ? composerFinishes[product.slug] : undefined;
                    const materialOptions = finishes ?? (product?.materials ?? []).map((id) => ({ materialId: id, materialLabel: id, color: "", image: "" }));
                    const colorOptions = finishes?.map((finish) => finish.color) ?? product?.colors ?? [];
                    return <>
                      <label>Material<select value={selected.materialId ?? ""} onChange={(event) => {
                        const finish = finishes?.find((option) => option.materialId === event.target.value);
                        updateSelected({ materialId: event.target.value, color: finish?.color ?? selected.color });
                      }}>{materialOptions.map((option) => <option value={option.materialId} key={option.materialId}>{option.materialLabel}</option>)}</select></label>
                      <label>Color<select value={selected.color ?? ""} onChange={(event) => {
                        const finish = finishes?.find((option) => option.color === event.target.value);
                        updateSelected({ color: event.target.value, materialId: finish?.materialId ?? selected.materialId });
                      }}>{colorOptions.map((color) => <option value={color} key={color}>{color}</option>)}</select></label>
                    </>;
                  })()}
                </div>
              ) : !upload ? <div className="stitch-composer-properties is-empty"><strong>Select a product</strong><span>Choose an item in the room to view its dimensions, material, color, and available views.</span></div> : null}
            </div>

            {upload ? <section className="stitch-fit-panel" aria-labelledby="room-fit-heading">
              <button type="button" className="stitch-fit-panel__toggle" aria-expanded={fitOpen} onClick={() => setFitOpen((value) => !value)}>
                <span><small>Measured planning</small><strong id="room-fit-heading">Will these products fit?</strong></span>
                <span className={`stitch-fit-status is-${fitAssessment.status}`}>{fitAssessment.status === "safe" ? "Likely fits" : fitAssessment.status === "tight" ? "Tight clearance" : fitAssessment.status === "conflict" ? "Does not fit here" : "Measurements needed"}</span>
              </button>
              {fitOpen ? <div className="stitch-fit-panel__body">
                <p className="stitch-fit-intro">The result is calculated from measurements, not guessed from the photograph. Enter every fixed feature and verify the exact product configuration.</p>
                <div className="stitch-fit-grid">
                  <fieldset className="stitch-fit-room-card"><legend><span>1</span> Room dimensions</legend><p>Measure the clear internal space wall to wall.</p><div className="stitch-fit-fields">
                    <label>Width (cm)<input type="number" min="1" value={measuredRoom.widthCm || ""} onChange={(event) => setMeasuredRoom((room) => ({ ...room, widthCm: Number(event.target.value) }))} /></label>
                    <label>Length (cm)<input type="number" min="1" value={measuredRoom.lengthCm || ""} onChange={(event) => setMeasuredRoom((room) => ({ ...room, lengthCm: Number(event.target.value) }))} /></label>
                    <label>Height (cm)<input type="number" min="1" value={measuredRoom.heightCm || ""} onChange={(event) => setMeasuredRoom((room) => ({ ...room, heightCm: Number(event.target.value) }))} /></label>
                  </div></fieldset>

                  <fieldset><legend><span>2</span> Doors</legend><p>Add every door that opens into or beside the room.</p>{measuredDoors.map((door) => <div className="stitch-fit-row" key={door.id}>
                    <select aria-label="Door wall" value={door.wall} onChange={(event) => setMeasuredDoors((rows) => rows.map((row) => row.id === door.id ? { ...row, wall: event.target.value as Wall } : row))}><option value="north">North wall</option><option value="east">East wall</option><option value="south">South wall</option><option value="west">West wall</option></select>
                    <label>From corner (cm)<input type="number" value={door.positionCm || ""} onChange={(event) => setMeasuredDoors((rows) => rows.map((row) => row.id === door.id ? { ...row, positionCm: Number(event.target.value) } : row))} /></label>
                    <label>Width (cm)<input type="number" value={door.widthCm || ""} onChange={(event) => setMeasuredDoors((rows) => rows.map((row) => row.id === door.id ? { ...row, widthCm: Number(event.target.value) } : row))} /></label>
                    <label>Height (cm)<input type="number" value={door.heightCm || ""} onChange={(event) => setMeasuredDoors((rows) => rows.map((row) => row.id === door.id ? { ...row, heightCm: Number(event.target.value) } : row))} /></label>
                    <select aria-label="Door hinge side" value={door.hinge ?? "left"} onChange={(event) => setMeasuredDoors((rows) => rows.map((row) => row.id === door.id ? { ...row, hinge: event.target.value as Door["hinge"] } : row))}><option value="left">Left hinge</option><option value="right">Right hinge</option></select>
                    <select aria-label="Door opening direction" value={door.opens ?? "inward"} onChange={(event) => setMeasuredDoors((rows) => rows.map((row) => row.id === door.id ? { ...row, opens: event.target.value as Door["opens"] } : row))}><option value="inward">Opens inward</option><option value="outward">Opens outward</option></select>
                    <button type="button" aria-label="Remove door" onClick={() => setMeasuredDoors((rows) => rows.filter((row) => row.id !== door.id))}><Trash2 size={15} /></button>
                  </div>)}<button type="button" className="stitch-fit-add" onClick={() => setMeasuredDoors((rows) => [...rows, { id: `door-${Date.now()}`, wall: "north", positionCm: 0, widthCm: 90, heightCm: 210, hinge: "left", opens: "inward" }])}><Plus size={15} /> Add door</button></fieldset>

                  <fieldset><legend><span>3</span> Windows</legend><p>Sill height helps identify furniture that may block a window.</p>{measuredWindows.map((window) => <div className="stitch-fit-row" key={window.id}>
                    <select aria-label="Window wall" value={window.wall} onChange={(event) => setMeasuredWindows((rows) => rows.map((row) => row.id === window.id ? { ...row, wall: event.target.value as Wall } : row))}><option value="north">North wall</option><option value="east">East wall</option><option value="south">South wall</option><option value="west">West wall</option></select>
                    <label>From corner (cm)<input type="number" value={window.positionCm || ""} onChange={(event) => setMeasuredWindows((rows) => rows.map((row) => row.id === window.id ? { ...row, positionCm: Number(event.target.value) } : row))} /></label>
                    <label>Width (cm)<input type="number" value={window.widthCm || ""} onChange={(event) => setMeasuredWindows((rows) => rows.map((row) => row.id === window.id ? { ...row, widthCm: Number(event.target.value) } : row))} /></label>
                    <label>Height (cm)<input type="number" value={window.heightCm || ""} onChange={(event) => setMeasuredWindows((rows) => rows.map((row) => row.id === window.id ? { ...row, heightCm: Number(event.target.value) } : row))} /></label>
                    <label>Sill height (cm)<input type="number" value={window.sillHeightCm || ""} onChange={(event) => setMeasuredWindows((rows) => rows.map((row) => row.id === window.id ? { ...row, sillHeightCm: Number(event.target.value) } : row))} /></label>
                    <button type="button" aria-label="Remove window" onClick={() => setMeasuredWindows((rows) => rows.filter((row) => row.id !== window.id))}><Trash2 size={15} /></button>
                  </div>)}<button type="button" className="stitch-fit-add" onClick={() => setMeasuredWindows((rows) => [...rows, { id: `window-${Date.now()}`, wall: "north", positionCm: 0, widthCm: 120, heightCm: 120, sillHeightCm: 90 }])}><Plus size={15} /> Add window</button></fieldset>

                  <fieldset><legend><span>4</span> Fixed objects</legend><p>Include radiators, built-ins, columns, and anything that cannot move.</p>{fixedFeatures.map((feature) => <div className="stitch-fit-row is-feature" key={feature.id}>
                    <select aria-label="Fixed feature type" value={feature.kind} onChange={(event) => setFixedFeatures((rows) => rows.map((row) => row.id === feature.id ? { ...row, kind: event.target.value as FixedFeature["kind"], name: event.target.value } : row))}><option value="radiator">Radiator</option><option value="built-in">Built-in</option><option value="column">Column</option><option value="other">Other</option></select>
                    {(["xCm", "yCm", "widthCm", "depthCm", "heightCm"] as const).map((key) => <label key={key}>{key === "xCm" ? "X from left" : key === "yCm" ? "Y from top" : key === "widthCm" ? "Width" : key === "depthCm" ? "Depth" : "Height"} (cm)<input type="number" value={feature[key] || ""} onChange={(event) => setFixedFeatures((rows) => rows.map((row) => row.id === feature.id ? { ...row, [key]: Number(event.target.value) } : row))} /></label>)}
                    <button type="button" aria-label="Remove fixed feature" onClick={() => setFixedFeatures((rows) => rows.filter((row) => row.id !== feature.id))}><Trash2 size={15} /></button>
                  </div>)}<button type="button" className="stitch-fit-add" onClick={() => setFixedFeatures((rows) => [...rows, { id: `feature-${Date.now()}`, kind: "radiator", name: "radiator", xCm: 0, yCm: 0, widthCm: 100, depthCm: 15, heightCm: 60 }])}><Plus size={15} /> Add fixed object</button></fieldset>
                </div>

                <div className="stitch-fit-products"><div className="stitch-fit-section-title"><span>5</span><strong>Selected product dimensions</strong></div>{items.length ? items.map((item) => { const product = activeProducts.find((entry) => entry.id === item.productId); return product ? <div key={item.id}><span>{product.modelCode}</span><span>{product.verifiedFacts.dimensions ? `${Math.round(product.widthMm / 10)} × ${Math.round(product.depthMm / 10)} × ${Math.round(product.heightMm / 10)} cm` : "Not verified — fit cannot be confirmed"}</span></div> : null; }) : <p>No products selected.</p>}</div>
                <div className="stitch-fit-confirmations"><div className="stitch-fit-section-title"><span>6</span><strong>Confirm your measurements</strong></div>
                  <label className="stitch-fit-confirm"><input type="checkbox" checked={featuresConfirmed} onChange={(event) => setFeaturesConfirmed(event.target.checked)} /> <span>I have included every door, window, radiator, built-in, column, and fixed obstruction.</span></label>
                  <label className="stitch-fit-confirm"><input type="checkbox" checked={configurationsConfirmed} onChange={(event) => setConfigurationsConfirmed(event.target.checked)} /> <span>These are the exact product configurations I intend to order, with verified dimensions.</span></label>
                </div>
                <div className={`stitch-fit-result is-${fitAssessment.status}`} role="status"><small className="stitch-fit-result-label">Fit result</small><strong>{fitAssessment.status === "safe" ? "Likely to fit" : fitAssessment.status === "tight" ? "Fits, with tight clearance" : fitAssessment.status === "conflict" ? "Does not fit in this placement" : "More information needed"}</strong>
                  <ul>{(fitAssessment.status === "unverified" ? fitAssessment.missing : fitAssessment.issues.length ? fitAssessment.issues : ["No boundary, fixed-object, low-window, door-swing, or product-overlap conflicts were found in the entered layout."]).map((message) => <li key={message}>{message}</li>)}</ul>
                  <small>This is a planning check, not installation confirmation. A Musterring retailer should confirm final configuration and site measurements.</small>
                </div>
              </div> : null}
            </section> : null}

            {generationStatus === "loading" ? <div className="stitch-generation-progress" role="progressbar" aria-label="Estimated room visualization progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={generationProgress}>
              <div className="stitch-generation-progress__copy">
                <span>{generationProgress < 20 ? "Preparing your room and product references" : generationProgress < 78 ? "Generating your realistic room view" : "Finalizing lighting and product details"}</span>
                <strong>{generationProgress}%</strong>
              </div>
              <div className="stitch-generation-progress__track" aria-hidden="true"><span style={{ width: `${generationProgress}%` }} /></div>
              <small>Estimated progress — this usually takes 1–3 minutes. Please keep this page open.</small>
            </div> : null}

            <div className="stitch-composer-ai-panel" aria-busy={generationStatus === "loading"}>
              <div>
                <p className="eyebrow"><Sparkles size={15} /> AI room staging</p>
                <strong>{upload ? "Generate room" : "Add the selected catalogue products to your real room"}</strong>
                <span>{upload ? "Creates one cohesive room photograph while locking each selected product to its catalogue colour, material, and visible details. Usually takes 1–3 minutes. The result is inspirational and cannot confirm physical fit." : "OpenAI re-renders the complete photograph while using your room as the architectural reference and locking selected products to their catalogue references. Generation usually takes 1–3 minutes. The result is inspirational and cannot confirm physical fit."}</span>
                {generatedIsCurrent ? <small role="status">Generated from the current room and {items.length} selected {items.length === 1 ? "product" : "products"}.</small> : null}
                {generatedVisualization && !generatedIsCurrent ? <small role="status">Your room layout changed after the last generation. Generate again to update the realistic view.</small> : null}
                {uploadError ? <small className="form-error" role="alert">{uploadError}</small> : null}
                {generationError ? <small className="form-error" role="alert">{generationError}</small> : null}
              </div>
              <div className="stitch-composer-ai-actions">
                {generatedIsCurrent && !showGenerated ? <button type="button" className="ghost" onClick={() => { setShowBefore(false); setShowGenerated(true); }}>View generated</button> : null}
                {displayGenerated ? <button type="button" className="ghost" onClick={() => { setShowBefore(false); setShowGenerated(false); }}>Edit placement</button> : null}
                {generatedIsCurrent ? <a className="ghost" href={generatedVisualization} download={`musterring-room-visualization.${generatedVisualization.startsWith("data:image/png") ? "png" : "jpg"}`}><Download size={16} /> Download</a> : null}
                <button
                  type="button"
                  onClick={generateRoomVisualization}
                  disabled={!roomPhoto || !uploadConsent || !items.length || items.length > maxGeneratedVisualizationItems || generationStatus === "loading"}
                >{generatedIsCurrent ? <RotateCw size={17} /> : <Sparkles size={17} />} {generationStatus === "loading" ? "Generating realistic view…" : generatedIsCurrent ? "Regenerate again" : "Generate realistic view"}</button>
                {upload ? <label className="stitch-composer-ai-consent"><input type="checkbox" checked={uploadConsent} onChange={(event) => {
                  setUploadConsent(event.target.checked);
                  storage.recordConsent("photo-ai-processing", event.target.checked);
                }} /> <span>I agree to temporary AI processing. <Link href="/privacy">See privacy policy.</Link></span></label> : null}
              </div>
            </div>

            {!upload ? <><div className="stitch-composer-summary">
                <div><small>Total items</small><strong>{String(items.length).padStart(2, "0")} Modules</strong></div>
                <button onClick={() => {
                  if (!window.confirm("Save this room concept to My Musterring?")) return;
                  const version = storage.roomScenes().length + 1;
                  const sceneId = `scene-${Date.now()}`;
                  const savedItems = items.map((item) => {
                    const product = activeProducts.find((candidate) => candidate.id === item.productId);
                    return { ...item, dimensions: product && verifiedComposerSlugs.has(product.slug) ? { widthMm: product.widthMm, depthMm: product.depthMm, heightMm: product.heightMm } : undefined };
                  });
                  storage.saveRoomScene({ id: sceneId, name: "Living Room Concept", version, planningMode, roomSize, sceneScale, backgroundId: roomBackgroundId, backgroundSrc: roomPreview ? undefined : selectedBackground.src, items: savedItems, hasLocalRoomPhoto: Boolean(roomPreview), createdAt: new Date().toISOString() });
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
                  setSavedVersions(storage.roomScenes() as SavedScene[]);
                  setSaved(true);
                }}><Save size={18} /> {saved ? "Saved to project" : "Save concept"}</button>
                <Link href="/handover"><Send size={18} /> Send concept to retailer</Link>
            </div>
            <p className="stitch-composer-note">{planningMode === "accurate" ? "Accurate Planning Mode preserves entered room and product dimensions, but delivery feasibility must still be confirmed with a Musterring retailer." : "Inspirational visualization — product proportions and colors may vary. Never use this visualization for fit confirmation."} Saved versions: {versions}.</p>
            {savedVersions.length ? <div className="chips" aria-label="Saved room versions">{savedVersions.slice(-4).map((version, index) => <button className="chip" key={version.id ?? index} onClick={() => {
              if (!version.items) return;
              pushHistory();
              setItems(version.items);
              setSceneScale(version.sceneScale ?? 1);
              setSelectedId(version.items[0]?.id ?? "");
            }}>Open version {version.version ?? index + 1}</button>)}</div> : null}</> : null}
          </div>
        </div>
      </section>

      {!upload ? <section className="section band stitch-engineering-specs">
        <div className="container">
          <div><h2>Planning summary</h2><p>Your room concept stays organized and ready for the next consultation step.</p></div>
          <dl>
            <div><dt>Planning mode</dt><dd>Interactive composition + confirmed AI staging</dd></div>
            <div><dt>Products</dt><dd>{activeProducts.length} available models</dd></div>
            <div><dt>Privacy</dt><dd>Uploads are processed with consent and are not saved by this app</dd></div>
            <div><dt>Handover</dt><dd>Retailer-ready project summary</dd></div>
          </dl>
        </div>
      </section> : null}
    </div>
  );
}

"use client";

import Image from "@/components/HighQualityImage";
import { products } from "@/lib/data";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import type { Product } from "@/lib/types";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { Box, Camera, Check, ChevronLeft, ChevronRight, Grid3X3, Minus, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type RoomShape = "rectangle" | "l-shape";
type ViewMode = "perspective" | "top";
type PlannerItem = { id: string; productId: string; x: number; z: number; rotation: number };
type ModelSize = { width: number; depth: number; height: number };

const verifiedSlugs = new Set(["mr-260", "mr-270", "justb-pm100", "mr-kleo", "mr-nils", "mr-pamela", "mr-281", "mr-9445", "jana", "kanto", "justb-ct100", "nara"]);
const cutoutSlugs = new Set(["jana", "justb-ct100", "justb-pm100", "justb-pm200", "kanto", "mr-230", "mr-231", "mr-260", "mr-2665", "mr-270", "mr-280", "mr-281", "mr-285", "mr-4100", "mr-5100", "mr-5111", "mr-720", "mr-9445", "mr-alena", "mr-kleo", "mr-lia", "mr-lucia", "mr-nils", "mr-pamela", "nara"]);
const cutoutFiles: Record<string, string> = {
  jana: "physical-front.png",
  "justb-ct100": "physical-natural-oak.png",
  "justb-pm100": "physical-front.png",
  "justb-pm200": "physical-front.png",
  kanto: "physical-front.png",
  "mr-281": "physical-front.png",
  "mr-9445": "physical-front.png",
  "mr-kleo": "physical-front.png",
  "mr-nils": "physical-front.png",
  "mr-pamela": "physical-front.png",
  nara: "physical-natural-oak.png"
};
const plannerProducts = products.filter((product) => product.active);
const categoryOptions = [...new Set(plannerProducts.map((product) => product.category))].sort();
const illustrativeSizes: Record<string, ModelSize> = {
  sofa: { width: 2.2, depth: .92, height: .84 },
  sectional: { width: 2.8, depth: 1.65, height: .82 },
  armchair: { width: .88, depth: .9, height: .92 },
  storage: { width: 1.8, depth: .46, height: .82 },
  wardrobe: { width: 1.8, depth: .62, height: 2.15 },
  "bedroom-series": { width: 1.8, depth: 2.1, height: 1.05 },
  bed: { width: 1.8, depth: 2.1, height: 1.05 },
  "dining-table": { width: 1.9, depth: .95, height: .76 },
  "coffee-table": { width: 1.05, depth: .7, height: .42 },
  "small-furniture": { width: .72, depth: .54, height: .5 },
  "dining-chair": { width: .52, depth: .58, height: .88 },
  bathroom: { width: 1.25, depth: .52, height: .86 },
  kitchen: { width: 1.8, depth: .62, height: .92 },
  outdoor: { width: 1.8, depth: .86, height: .78 },
  carpet: { width: 2.4, depth: 1.7, height: .018 },
  lamp: { width: .48, depth: .48, height: 1.65 },
  "home-textile": { width: 1.8, depth: 1.3, height: .025 }
};

const modelSize = (product: Product): ModelSize => verifiedSlugs.has(product.slug)
  ? { width: product.widthMm / 1000, depth: product.depthMm / 1000, height: product.heightMm / 1000 }
  : illustrativeSizes[product.category] ?? { width: 1.2, depth: .8, height: .8 };

function CameraRig({ mode, width, depth }: { mode: ViewMode; width: number; depth: number }) {
  const { camera, gl } = useThree();
  useEffect(() => {
    const span = Math.max(width, depth);
    if (mode === "top") {
      camera.position.set(0, span * 1.35, .01);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, span * .58, span * 1.2);
      camera.lookAt(0, .55, 0);
    }
    camera.updateProjectionMatrix();
  }, [camera, mode, width, depth]);
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 15;
    controls.minPolarAngle = mode === "top" ? .01 : .82;
    controls.maxPolarAngle = mode === "top" ? .03 : 1.28;
    controls.minAzimuthAngle = mode === "top" ? -Infinity : -.34;
    controls.maxAzimuthAngle = mode === "top" ? Infinity : .34;
    controls.enableRotate = mode !== "top";
    controls.target.set(0, .45, 0);
    controls.update();
    return () => controls.dispose();
  }, [camera, gl, mode]);
  return null;
}

const Upholstery = ({ color = "#8c796c" }: { color?: string }) => <meshStandardMaterial color={color} roughness={.88} metalness={0} />;
const Timber = ({ color = "#896746" }: { color?: string }) => <meshStandardMaterial color={color} roughness={.64} metalness={.03} />;
const Metal = ({ color = "#342f2b" }: { color?: string }) => <meshStandardMaterial color={color} roughness={.3} metalness={.7} />;

function SeatingModel({ size, sectional = false, armchair = false }: { size: ModelSize; sectional?: boolean; armchair?: boolean }) {
  const { width, depth, height } = size;
  const seatHeight = height * .43;
  return <>
    <mesh position={[0, seatHeight * .58, 0]} castShadow><boxGeometry args={[width * .94, seatHeight, depth * .9]} /><Upholstery color={armchair ? "#9a8878" : "#8b7769"} /></mesh>
    <mesh position={[0, seatHeight * 1.02, -depth * .05]} castShadow><boxGeometry args={[width * .82, seatHeight * .24, depth * .7]} /><Upholstery color="#a08c7c" /></mesh>
    <mesh position={[0, height * .72, depth * .34]} rotation={[-.1, 0, 0]} castShadow><boxGeometry args={[width * .88, height * .54, depth * .2]} /><Upholstery color="#79675d" /></mesh>
    <mesh position={[-width * .47, height * .48, 0]} castShadow><boxGeometry args={[width * .08, height * .5, depth]} /><Upholstery color="#725f55" /></mesh>
    <mesh position={[width * .47, height * .48, 0]} castShadow><boxGeometry args={[width * .08, height * .5, depth]} /><Upholstery color="#725f55" /></mesh>
    {sectional ? <><mesh position={[width * .33, seatHeight * .58, -depth * .35]} castShadow><boxGeometry args={[width * .32, seatHeight, depth * 1.55]} /><Upholstery color="#8b7769" /></mesh><mesh position={[width * .33, seatHeight * 1.02, -depth * .58]} castShadow><boxGeometry args={[width * .27, seatHeight * .24, depth * 1.02]} /><Upholstery color="#a08c7c" /></mesh></> : null}
    {[-.41, .41].map((x) => <mesh key={x} position={[x * width, .04, depth * .27]} castShadow><cylinderGeometry args={[.025, .025, .08, 10]} /><Metal /></mesh>)}
  </>;
}

function TableModel({ size, coffee = false }: { size: ModelSize; coffee?: boolean }) {
  const { width, depth, height } = size;
  return <>
    <mesh position={[0, height, 0]} castShadow receiveShadow><boxGeometry args={[width, Math.min(.09, height * .2), depth]} /><Timber color={coffee ? "#7b5a3c" : "#9b7650"} /></mesh>
    {[[-.42, -.38], [.42, -.38], [-.42, .38], [.42, .38]].map(([x, z], index) => <mesh key={index} position={[x * width, height / 2, z * depth]} castShadow><boxGeometry args={[coffee ? .045 : .065, height, coffee ? .045 : .065]} /><Metal /></mesh>)}
  </>;
}

function ChairModel({ size }: { size: ModelSize }) {
  const { width, depth, height } = size;
  return <>
    <mesh position={[0, height * .48, 0]} castShadow><boxGeometry args={[width, .1, depth * .82]} /><Upholstery color="#a39180" /></mesh>
    <mesh position={[0, height * .74, depth * .36]} rotation={[-.06, 0, 0]} castShadow><boxGeometry args={[width * .9, height * .5, .1]} /><Upholstery color="#89776a" /></mesh>
    {[[-.4, -.32], [.4, -.32], [-.4, .32], [.4, .32]].map(([x, z], index) => <mesh key={index} position={[x * width, height * .24, z * depth]} castShadow><cylinderGeometry args={[.018, .024, height * .48, 10]} /><Metal /></mesh>)}
  </>;
}

function StorageModel({ size, tall = false }: { size: ModelSize; tall?: boolean }) {
  const { width, depth, height } = size;
  const panels = tall ? 3 : Math.max(2, Math.min(4, Math.round(width / .65)));
  return <>
    <mesh position={[0, height / 2 + .06, 0]} castShadow receiveShadow><boxGeometry args={[width, height, depth]} /><Timber color={tall ? "#b6a28b" : "#a48668"} /></mesh>
    {Array.from({ length: panels }).map((_, index) => { const panelWidth = width / panels; return <group key={index}><mesh position={[-width / 2 + panelWidth * (index + .5), height / 2 + .06, -depth / 2 - .006]}><boxGeometry args={[panelWidth - .018, height * .92, .018]} /><meshStandardMaterial color={index % 2 ? "#b69878" : "#aa8a6b"} roughness={.7} /></mesh><mesh position={[-width / 2 + panelWidth * (index + .82), height / 2 + .06, -depth / 2 - .02]}><sphereGeometry args={[.018, 10, 10]} /><Metal /></mesh></group>; })}
    {[-.42, .42].map((x) => <mesh key={x} position={[x * width, .06, 0]}><boxGeometry args={[.05, .12, depth * .7]} /><Metal /></mesh>)}
  </>;
}

function BedModel({ size }: { size: ModelSize }) {
  const { width, depth, height } = size;
  return <>
    <mesh position={[0, .18, 0]} castShadow><boxGeometry args={[width, .34, depth]} /><Upholstery color="#7d6e65" /></mesh>
    <mesh position={[0, .43, -.02]} castShadow><boxGeometry args={[width * .92, .24, depth * .88]} /><meshStandardMaterial color="#eee8df" roughness={.94} /></mesh>
    <mesh position={[0, height * .52, depth * .47]} castShadow><boxGeometry args={[width, height, .16]} /><Upholstery color="#897970" /></mesh>
    {[-.24, .24].map((x) => <mesh key={x} position={[x * width, .62, depth * .24]} rotation={[-.08, 0, 0]} castShadow><boxGeometry args={[width * .4, .13, depth * .27]} /><meshStandardMaterial color="#f6f1ea" roughness={1} /></mesh>)}
  </>;
}

function DecorModel({ product, size }: { product: Product; size: ModelSize }) {
  const { width, depth, height } = size;
  if (product.category === "carpet" || product.category === "home-textile") return <mesh position={[0, height / 2 + .012, 0]} receiveShadow><boxGeometry args={[width, height, depth]} /><meshStandardMaterial color="#b8aa95" roughness={1} /></mesh>;
  if (product.category === "lamp") return <><mesh position={[0, .04, 0]} castShadow><cylinderGeometry args={[width * .42, width * .48, .08, 32]} /><Metal /></mesh><mesh position={[0, height * .5, 0]} castShadow><cylinderGeometry args={[.025, .032, height, 16]} /><Metal /></mesh><mesh position={[0, height * .88, 0]} castShadow><coneGeometry args={[width * .5, height * .35, 32, 1, true]} /><meshStandardMaterial color="#d9c7ad" roughness={.86} side={THREE.DoubleSide} /></mesh><pointLight position={[0, height * .86, 0]} intensity={.35} color="#ffd9a3" /></>;
  return <><StorageModel size={size} /><mesh position={[0, height + .05, 0]} castShadow><cylinderGeometry args={[width * .2, width * .16, .1, 32]} /><meshStandardMaterial color="#e8e3da" roughness={.25} /></mesh></>;
}

function ProductGeometry({ product, size }: { product: Product; size: ModelSize }) {
  if (["sofa", "sectional", "armchair", "outdoor"].includes(product.category)) return <SeatingModel size={size} sectional={product.category === "sectional"} armchair={product.category === "armchair"} />;
  if (["dining-table", "coffee-table", "small-furniture"].includes(product.category)) return <TableModel size={size} coffee={product.category !== "dining-table"} />;
  if (product.category === "dining-chair") return <ChairModel size={size} />;
  if (["bed", "bedroom-series"].includes(product.category)) return <BedModel size={size} />;
  if (["storage", "wardrobe", "kitchen"].includes(product.category)) return <StorageModel size={size} tall={product.category === "wardrobe"} />;
  return <DecorModel product={product} size={size} />;
}

function ProductCutout({ product, size }: { product: Product; size: ModelSize }) {
  const source = `/generated-product-views/${product.slug}/${cutoutFiles[product.slug] ?? "official-front.png"}`;
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(source, (loaded) => {
      if (!active) return loaded.dispose();
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = 8;
      setTexture(loaded);
    });
    return () => { active = false; };
  }, [source]);
  if (!texture) return null;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const image = texture.image as HTMLImageElement;
  const imageRatio = image?.naturalWidth ? image.naturalHeight / image.naturalWidth : size.height / size.width;
  const visualHeight = Math.min(size.height * 1.22, Math.max(size.height * .72, size.width * imageRatio));
  return <>
    <mesh position={[0, visualHeight / 2 + .025, size.depth * .5 + .025]} castShadow renderOrder={2}>
      <planeGeometry args={[size.width, visualHeight]} />
      <meshStandardMaterial map={texture} transparent alphaTest={.08} side={THREE.DoubleSide} roughness={.86} />
    </mesh>
    <mesh position={[0, .018, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[size.width * .44, size.depth * .32, 1]}>
      <circleGeometry args={[1, 48]} />
      <meshBasicMaterial color="#2d2925" transparent opacity={.2} depthWrite={false} />
    </mesh>
  </>;
}

function ApproximateGlbModel({ product }: { product: Product }) {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  useEffect(() => {
    let active = true;
    const loader = new GLTFLoader();
    loader.load(`/room-planner-models/${product.slug}.glb?v=3`, (loaded) => {
      if (active) setScene(loaded.scene);
    });
    return () => { active = false; };
  }, [product.slug]);
  const instance = useMemo(() => scene?.clone(true) ?? null, [scene]);
  return instance ? <primitive object={instance} /> : <ProductGeometry product={product} size={modelSize(product)} />;
}

function FurnitureModel({ item, selected, view, onSelect, onMove }: { item: PlannerItem; selected: boolean; view: ViewMode; onSelect: () => void; onMove: (x: number, z: number) => void }) {
  const product = plannerProducts.find((candidate) => candidate.id === item.productId)!;
  const size = modelSize(product);
  const drag = (event: ThreeEvent<PointerEvent>) => {
    if (!event.buttons) return;
    event.stopPropagation();
    onMove(event.point.x, event.point.z);
  };
  return <group position={[item.x, 0, item.z]} rotation={[0, item.rotation, 0]} onPointerDown={(event) => { event.stopPropagation(); onSelect(); }} onPointerMove={drag}>
    <ApproximateGlbModel product={product} />
    {cutoutSlugs.has(product.slug) && view === "perspective" ? <ProductCutout product={product} size={size} /> : null}
    {selected ? <mesh position={[0, .024, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[Math.max(size.width, size.depth) * .59, Math.max(size.width, size.depth) * .63, 56]} /><meshBasicMaterial color="#b94128" side={THREE.DoubleSide} /></mesh> : null}
  </group>;
}

function RoomScene({ shape, width, depth, height, items, selectedId, view, onSelect, onMove }: { shape: RoomShape; width: number; depth: number; height: number; items: PlannerItem[]; selectedId: string; view: ViewMode; onSelect: (id: string) => void; onMove: (id: string, x: number, z: number) => void }) {
  const cutWidth = shape === "l-shape" ? width * .38 : 0;
  const cutDepth = shape === "l-shape" ? depth * .42 : 0;
  return <>
    <CameraRig mode={view} width={width} depth={depth} />
    <color attach="background" args={["#f4f2ee"]} />
    <fog attach="fog" args={["#f4f2ee", 9, 22]} />
    <hemisphereLight args={["#fff8ed", "#b6aa9b", 2.2]} />
    <directionalLight position={[4, 8, 5]} intensity={2.7} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    <gridHelper args={[Math.max(width, depth) * 1.4, 20, "#b9afa2", "#ddd6cc"]} position={[0, .012, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[width, depth]} /><meshStandardMaterial color="#d7bea0" roughness={.82} /></mesh>
    {shape === "l-shape" ? <mesh position={[width / 2 - cutWidth / 2, .03, -depth / 2 + cutDepth / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[cutWidth, cutDepth]} /><meshBasicMaterial color="#f4f2ee" /></mesh> : null}
    <mesh position={[0, height / 2, -depth / 2]} receiveShadow><boxGeometry args={[width + .16, height, .16]} /><meshStandardMaterial color="#f1ece4" roughness={.95} /></mesh>
    <mesh position={[-width / 2, height / 2, 0]} receiveShadow><boxGeometry args={[.16, height, depth]} /><meshStandardMaterial color="#e9e2d9" roughness={.95} /></mesh>
    <mesh position={[0, 1.3, -depth / 2 - .09]}><boxGeometry args={[1.4, .95, .04]} /><meshStandardMaterial color="#d6c6b2" /></mesh>
    <mesh position={[0, 1.3, -depth / 2 - .12]}><boxGeometry args={[1.17, .72, .03]} /><meshStandardMaterial color="#6f786f" /></mesh>
    {items.map((item) => <FurnitureModel key={item.id} item={item} selected={item.id === selectedId} view={view} onSelect={() => onSelect(item.id)} onMove={(x, z) => onMove(item.id, x, z)} />)}
  </>;
}

export function RoomPlanner3DClient() {
  const [step, setStep] = useState(1);
  const [shape, setShape] = useState<RoomShape>("rectangle");
  const [room, setRoom] = useState({ width: 5, depth: 4, height: 2.6 });
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [view, setView] = useState<ViewMode>("top");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [saved, setSaved] = useState(false);
  const selected = items.find((item) => item.id === selectedId);
  const filtered = useMemo(() => plannerProducts.filter((product) => (category === "all" || product.category === category) && `${product.modelCode} ${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const updateSelected = (patch: Partial<PlannerItem>) => setItems((current) => current.map((item) => item.id === selectedId ? { ...item, ...patch } : item));
  const addProduct = (productId: string) => {
    const id = `planner-${Date.now()}`;
    setItems((current) => {
      const index = current.length % 9;
      const placements = [
        [-.25, -.24], [.24, .22], [-.25, .22], [.24, -.24], [0, 0],
        [0, -.3], [0, .3], [-.32, 0], [.32, 0]
      ];
      const [xRatio, zRatio] = placements[index];
      return [...current, { id, productId, x: xRatio * room.width, z: zRatio * room.depth, rotation: 0 }];
    });
    setSelectedId(id);
    setSaved(false);
  };
  const moveItem = (id: string, x: number, z: number) => {
    const product = plannerProducts.find((candidate) => candidate.id === items.find((item) => item.id === id)?.productId);
    if (!product) return;
    const size = modelSize(product);
    const xLimit = Math.max(.05, room.width / 2 - size.width / 2);
    const zLimit = Math.max(.05, room.depth / 2 - size.depth / 2);
    setItems((current) => current.map((item) => item.id === id ? { ...item, x: Math.max(-xLimit, Math.min(xLimit, x)), z: Math.max(-zLimit, Math.min(zLimit, z)) } : item));
    setSaved(false);
  };
  const save = () => {
    storage.saveRoomScene({ id: `3d-room-${Date.now()}`, version: 1, type: "3d-planner", room, shape, items, createdAt: new Date().toISOString() });
    storage.track({ name: "room_composer_saved" });
    setSaved(true);
  };

  return <div className="planner3d-shell">
    <header className="planner3d-topbar"><Link href="/room-composer"><ChevronLeft size={18} /> Room Composer</Link><div><Box size={20} /><strong>Musterring 3D Room Planner</strong><span>Catalogue-grounded planner</span></div><button onClick={save}><Save size={17} /> {saved ? "Saved" : "Save plan"}</button></header>
    {step < 3 ? <div className="planner3d-setup">
      <aside>
        <p>Step {step} of 2</p>
        <h1>{step === 1 ? "Choose your room shape" : "Enter room dimensions"}</h1>
        {step === 1 ? <><span>Select the closest basic shape. You can refine your room dimensions in the next step.</span><div className="planner3d-shapes"><button className={shape === "rectangle" ? "active" : ""} onClick={() => setShape("rectangle")}><i className="rectangle" />Rectangle<Check size={16} /></button><button className={shape === "l-shape" ? "active" : ""} onClick={() => setShape("l-shape")}><i className="lshape" />L-shaped<Check size={16} /></button></div></> : <><span>Use your measured room dimensions in metres. Product dimensions are shown only when locally validated.</span>{(["width", "depth", "height"] as const).map((key) => <label key={key}>{key === "depth" ? "Room length" : `Room ${key}`}<div><button onClick={() => setRoom({ ...room, [key]: Math.max(key === "height" ? 2 : 2.5, room[key] - .1) })}><Minus size={16} /></button><input type="number" step="0.1" value={room[key]} onChange={(event) => setRoom({ ...room, [key]: Number(event.target.value) })} /><b>m</b><button onClick={() => setRoom({ ...room, [key]: room[key] + .1 })}><Plus size={16} /></button></div></label>)}</>}
        <button className="planner3d-next" onClick={() => setStep(step + 1)}>{step === 1 ? "Next: dimensions" : "Start designing"}<ChevronRight size={18} /></button>
      </aside>
      <section className="planner3d-setup-preview"><div className={`planner3d-floorplan ${shape}`}><span>{room.width.toFixed(1)} m</span><b>{room.depth.toFixed(1)} m</b></div></section>
    </div> : <div className="planner3d-workspace">
      <aside className="planner3d-catalog">
        <div><p>Musterring catalogue</p><h1>All products</h1><span className="planner3d-count">{filtered.length} of {plannerProducts.length} products</span><input type="search" placeholder="Search model or product" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Filter product category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categoryOptions.map((option) => <option key={option} value={option}>{option.replaceAll("-", " ")}</option>)}</select></div>
        <div className="planner3d-products">{filtered.map((product) => { const verified = verifiedSlugs.has(product.slug); const hasCutout = cutoutSlugs.has(product.slug); return <article key={product.id} className={hasCutout ? "has-real-view" : ""}><div><Image src={productImages(product.id)[0]} alt="" width={180} height={120} />{hasCutout ? <b>Product view</b> : null}</div><p>{product.category.replaceAll("-", " ")}</p><h2>{product.modelCode}</h2><span>{verified ? `${Math.round(product.widthMm / 10)} × ${Math.round(product.depthMm / 10)} cm` : hasCutout ? "Real front view · illustrative scale" : "Illustrative 3D scale"}</span><button onClick={() => addProduct(product.id)}><Plus size={15} /> Add to room</button></article>; })}</div>
      </aside>
      <main className="planner3d-canvas-wrap">
        <div className="planner3d-canvas-tools"><button className={view === "top" ? "active" : ""} onClick={() => setView("top")}><Grid3X3 size={16} /> Top view <small>Best for planning</small></button><button className={view === "perspective" ? "active" : ""} onClick={() => setView("perspective")}><Camera size={16} /> Front 3D</button><button onClick={() => setStep(2)}>Room {room.width.toFixed(1)} × {room.depth.toFixed(1)} m</button></div>
        <Canvas shadows camera={{ fov: 42, near: .1, far: 100 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}><RoomScene shape={shape} width={room.width} depth={room.depth} height={room.height} items={items} selectedId={selectedId} view={view} onSelect={setSelectedId} onMove={moveItem} /></Canvas>
        {!items.length ? <div className="planner3d-empty"><Box size={30} /><strong>Your room is ready</strong><span>Choose from all {plannerProducts.length} Musterring products.</span></div> : null}
      </main>
      <aside className="planner3d-properties">{selected ? (() => { const product = plannerProducts.find((candidate) => candidate.id === selected.productId)!; const verified = verifiedSlugs.has(product.slug); const hasCutout = cutoutSlugs.has(product.slug); return <><p>Selected product</p><h2>{product.modelCode}</h2><span>{product.name}</span>{hasCutout ? <div className="planner3d-real-view"><Check size={14} /> Real product front view</div> : null}{verified ? <dl><div><dt>Width</dt><dd>{Math.round(product.widthMm / 10)} cm</dd></div><div><dt>Depth</dt><dd>{Math.round(product.depthMm / 10)} cm</dd></div><div><dt>Height</dt><dd>{Math.round(product.heightMm / 10)} cm</dd></div></dl> : <div className="planner3d-unverified"><strong>Illustrative scale</strong><span>Approved variant dimensions are not connected yet. Do not use this preview to confirm fit.</span></div>}<label>Rotation <b>{Math.round(THREE.MathUtils.radToDeg(selected.rotation))}°</b><input type="range" min="0" max="360" value={THREE.MathUtils.radToDeg(selected.rotation)} onChange={(event) => updateSelected({ rotation: THREE.MathUtils.degToRad(Number(event.target.value)) })} /></label><button onClick={() => updateSelected({ rotation: selected.rotation + Math.PI / 2 })}><RotateCcw size={16} /> Rotate 90°</button><button className="danger" onClick={() => { setItems((current) => current.filter((item) => item.id !== selected.id)); setSelectedId(""); }}><Trash2 size={16} /> Remove product</button><small>{hasCutout ? "The room uses the product's prepared front view. Side and top views remain illustrative until an approved 3D model is connected." : verified ? "Dimensional model based on the locally validated catalogue variant. Appearance remains illustrative until an approved 3D asset is connected." : "Catalogue product identity is validated; 3D geometry and scale are illustrative. Confirm the exact configuration with a Musterring retailer."}</small></>; })() : <><Box size={28} /><h2>Select a product</h2><span>Click an item to rotate, inspect, or remove it. Drag to reposition and use the mouse to orbit.</span></>}</aside>
    </div>}
  </div>;
}

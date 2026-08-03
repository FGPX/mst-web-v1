"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type TouchEvent, type WheelEvent } from "react";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Box, Check, ChevronDown, Download, HelpCircle,
  Lock, Move, Plus, Redo2, RotateCcw, Save, Send, Trash2, Undo2, Unlock, ZoomIn, ZoomOut
} from "lucide-react";
import type { Product } from "@/lib/types";
import { productImages } from "@/lib/musterring-assets";
import { storage } from "@/lib/persistence";
import {
  analyzePlacement, buildComponents, doorHingePoint, evaluateDelivery, normalizeRotation,
  suggestPlacements, type DeliveryInputs, type Door, type Placement, type RoomItem
} from "@/lib/fit-simulator";

type Step = "product" | "room" | "placement" | "delivery" | "result";
type SimulatorState = {
  room: { width: number; length: number; height: number };
  placement: Placement;
  items: RoomItem[];
  doors: Door[];
  delivery: DeliveryInputs;
  removedParts: string[];
};

const STEPS: { id: Step; label: string }[] = [
  { id: "product", label: "Product" }, { id: "room", label: "Room" }, { id: "placement", label: "Placement" },
  { id: "delivery", label: "Delivery path" }, { id: "result", label: "Result" }
];

function initialState(product: Product): SimulatorState {
  return {
    room: { width: 4000, length: 5500, height: 2450 },
    placement: { x: 2000, y: 2750, rotation: 0 },
    items: [{ id: "radiator-1", kind: "radiator", name: "Radiator", x: 1500, y: 0, width: 1000, depth: 140, locked: false }],
    doors: [{ id: "door-1", wall: "south", position: 900, width: 850, height: 2000, hinge: "left", opens: "inward" }],
    delivery: {
      entranceWidth: 850, entranceHeight: 2000, hallwayWidth: 1100, turnWidth: 1200,
      staircaseWidth: 900, elevatorWidth: 0, elevatorDepth: 0, elevatorHeight: 0,
      roomDoorWidth: 850, roomDoorHeight: 2000
    },
    removedParts: product.modular ? ["legs"] : []
  };
}

const cm = (value: number) => Math.round(value / 10);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const clone = (state: SimulatorState) => JSON.parse(JSON.stringify(state)) as SimulatorState;

function DimensionInput({ label, value, onChange, min = 0, help }: { label: string; value: number; onChange: (value: number) => void; min?: number; help?: string }) {
  const [draft, setDraft] = useState(String(cm(value)));
  useEffect(() => setDraft(String(cm(value))), [value]);
  const commitValue = () => {
    const parsed = Number(draft);
    if (Number.isFinite(parsed)) onChange(Math.max(min, parsed * 10));
    else setDraft(String(cm(value)));
  };
  return <label className="fit-field"><span>{label}{help && <small title={help}>?</small>}</span><span className="fit-unit-input"><input aria-label={`${label} in centimetres`} type="number" min={min / 10} value={draft} onChange={(event) => {
    setDraft(event.target.value);
    const parsed = Number(event.target.value);
    if (event.target.value !== "" && Number.isFinite(parsed)) onChange(Math.max(min, parsed * 10));
  }} onBlur={commitValue} onKeyDown={(event) => { if (event.key === "Enter") { commitValue(); event.currentTarget.blur(); } }} /><b>cm</b></span></label>;
}

function StatusMark({ status }: { status: "safe" | "tight" | "conflict" }) {
  return <span className={`fit-status fit-status-${status}`}>{status === "safe" ? <Check size={14} /> : <AlertTriangle size={14} />}{status}</span>;
}

export function FitCheckerClient({ product }: { product: Product }) {
  const [state, setState] = useState(() => initialState(product));
  const [step, setStep] = useState<Step>("room");
  const [activeTab, setActiveTab] = useState<"room" | "delivery">("room");
  const [history, setHistory] = useState<SimulatorState[]>([]);
  const [future, setFuture] = useState<SimulatorState[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<"product" | string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deliveryProgress, setDeliveryProgress] = useState(18);
  const svgRef = useRef<SVGSVGElement>(null);
  const hydrated = useRef(false);
  const pinchDistance = useRef<number | null>(null);

  const components = useMemo(() => buildComponents(product, state.removedParts), [product, state.removedParts]);
  const roomAnalysis = useMemo(() => analyzePlacement(state.room.width, state.room.length, product, state.placement, state.items, state.doors), [state, product]);
  const deliveryAnalysis = useMemo(() => evaluateDelivery(components, state.delivery), [components, state.delivery]);
  const suggestions = useMemo(() => suggestPlacements(state.room.width, state.room.length, product, state.items, state.doors), [state.room, state.items, state.doors, product]);
  const selected = state.items.find((item) => item.id === selectedItem);
  const overall = roomAnalysis.status === "conflict" || deliveryAnalysis.status === "conflict" ? "conflict" : roomAnalysis.status === "tight" || deliveryAnalysis.status === "tight" ? "tight" : "safe";
  const measurementMissing = Object.entries(state.delivery).filter(([, value]) => value <= 0).map(([name]) => name);

  useEffect(() => {
    const draft = storage.fitDraft(product.id);
    if (draft?.state) setState(draft.state as SimulatorState);
    hydrated.current = true;
  }, [product.id]);

  useEffect(() => {
    if (!hydrated.current) return;
    const timeout = window.setTimeout(() => storage.saveFitDraft(product.id, { state, step, updatedAt: new Date().toISOString() }), 350);
    return () => window.clearTimeout(timeout);
  }, [product.id, state, step]);

  const commit = (updater: (current: SimulatorState) => SimulatorState) => {
    setHistory((items) => [...items.slice(-29), clone(state)]);
    setFuture([]);
    setState((current) => updater(current));
    setSaved(false);
  };
  const replace = (updater: (current: SimulatorState) => SimulatorState) => setState(updater);
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [clone(state), ...items]);
    setState(previous);
    setHistory((items) => items.slice(0, -1));
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items, clone(state)]);
    setState(next);
    setFuture((items) => items.slice(1));
  };

  const svgPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const viewWidth = state.room.width / zoom;
    const viewHeight = state.room.length / zoom;
    return {
      x: pan.x + (event.clientX - rect.left) / rect.width * viewWidth,
      y: pan.y + (event.clientY - rect.top) / rect.height * viewHeight
    };
  };
  const pointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const point = svgPoint(event);
    if (dragging === "product") {
      replace((current) => ({ ...current, placement: { ...current.placement, x: point.x, y: point.y } }));
    } else {
      replace((current) => ({ ...current, items: current.items.map((item) => item.id === dragging && !item.locked ? { ...item, x: point.x - item.width / 2, y: point.y - item.depth / 2 } : item) }));
    }
  };
  const endDrag = () => {
    if (!dragging) return;
    setHistory((items) => [...items.slice(-29), clone(state)]);
    setDragging(null);
  };
  const pinchZoom = (event: TouchEvent<SVGSVGElement>) => {
    if (event.touches.length !== 2) { pinchDistance.current = null; return; }
    const distance = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
    if (pinchDistance.current) setZoom((value) => clamp(value * (distance / pinchDistance.current!), .6, 2.5));
    pinchDistance.current = distance;
  };
  const keyboardPlacement = (event: KeyboardEvent<HTMLDivElement>) => {
    const stepSize = event.shiftKey ? 100 : 10;
    const movement: Record<string, [number, number]> = { ArrowLeft: [-stepSize, 0], ArrowRight: [stepSize, 0], ArrowUp: [0, -stepSize], ArrowDown: [0, stepSize] };
    if (movement[event.key]) {
      event.preventDefault();
      const [x, y] = movement[event.key];
      commit((current) => ({ ...current, placement: { ...current.placement, x: current.placement.x + x, y: current.placement.y + y } }));
    }
    if (event.key === "[" || event.key === "]") {
      event.preventDefault();
      rotate(event.key === "[" ? -15 : 15);
    }
  };
  const rotate = (amount: number) => commit((current) => ({ ...current, placement: { ...current.placement, rotation: normalizeRotation(current.placement.rotation + amount) } }));
  const setRoom = (key: keyof SimulatorState["room"], value: number) => commit((current) => ({ ...current, room: { ...current.room, [key]: value } }));
  const setDelivery = (key: keyof DeliveryInputs, value: number) => commit((current) => ({ ...current, delivery: { ...current.delivery, [key]: value } }));
  const addItem = (kind: RoomItem["kind"]) => {
    const id = `${kind}-${Date.now()}`;
    commit((current) => ({ ...current, items: [...current.items, { id, kind, name: kind[0].toUpperCase() + kind.slice(1), x: 350, y: 500, width: kind === "column" ? 350 : 900, depth: kind === "radiator" ? 140 : 400 }] }));
    setSelectedItem(id);
  };
  const updateSelected = (patch: Partial<RoomItem>) => commit((current) => ({ ...current, items: current.items.map((item) => item.id === selectedItem ? { ...item, ...patch } : item) }));
  const updateDoor = (patch: Partial<Door>) => commit((current) => ({ ...current, doors: current.doors.map((door, index) => index === 0 ? { ...door, ...patch } : door) }));
  const applySuggestion = (placement: Placement) => commit((current) => ({ ...current, placement }));
  const centerProduct = () => commit((current) => ({ ...current, placement: { ...current.placement, x: current.room.width / 2, y: current.room.length / 2 } }));
  const snapToWall = () => commit((current) => ({ ...current, placement: { ...current.placement, y: product.depthMm / 2 + 50, rotation: 0 } }));
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const saveReport = () => {
    const id = `fit-${product.id}-${Date.now()}`;
    storage.saveFitReport({ id, productId: product.id, productSlug: product.slug, state, roomAnalysis, deliveryAnalysis, overall, measurementQuality: measurementMissing.length ? "Some optional measurements are missing" : "All requested measurements supplied", createdAt: new Date().toISOString() });
    storage.track({ name: "fit_check_completed", productId: product.id });
    setSaved(true);
  };
  const downloadReport = () => {
    const report = { product: product.modelCode, state, roomAnalysis, deliveryAnalysis, overall, generatedAt: new Date().toISOString(), disclaimer: "Planning guidance based on supplied measurements; not an installation guarantee." };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `${product.modelCode.replace(/\s/g, "-")}-fit-report.json`; anchor.click();
    URL.revokeObjectURL(url);
  };
  const roomViewWidth = state.room.width / zoom;
  const roomViewHeight = state.room.length / zoom;

  return (
    <main className="stitch-fit">
      <header className="container stitch-fit-head">
        <p className="eyebrow">Planning tools</p>
        <h1>Will It Fit?<br />Engineering Accuracy.</h1>
        <p>Plan room placement and the delivery journey for your Musterring {product.modelCode}. Results are guidance based on the measurements you provide.</p>
      </header>

      <nav className="container fit-progress" aria-label="Fit planning steps">
        {STEPS.map((item, index) => <button key={item.id} className={step === item.id ? "is-active" : ""} onClick={() => { setStep(item.id); if (item.id === "delivery") setActiveTab("delivery"); if (item.id === "room" || item.id === "placement") setActiveTab("room"); }}><span>{index + 1}</span>{item.label}</button>)}
      </nav>

      <section className="container fit-simulator">
        <aside className="fit-panel fit-input-panel">
          <div className="fit-panel-title"><div><p className="eyebrow">{step === "delivery" ? "Access route" : "Plan details"}</p><h2>{step === "delivery" ? "Delivery measurements" : "Room editor"}</h2></div><button className="icon-button" title="Measurement help"><HelpCircle /></button></div>
          <div className="stitch-fit-product"><Image src={productImages(product.id)[0]} alt={product.name} width={110} height={86} /><span><strong>{product.modelCode}</strong><small>{product.numberOfSeats || 3}-seater · {product.modular ? "Modular" : "Fixed"}<br />{cm(product.widthMm)} × {cm(product.depthMm)} × {cm(product.heightMm)} cm</small></span></div>

          {activeTab === "room" ? <>
            <details open><summary>Room dimensions <ChevronDown size={15} /></summary><div className="fit-field-grid">
              <DimensionInput label="Width" value={state.room.width} min={1000} onChange={(value) => setRoom("width", value)} />
              <DimensionInput label="Length" value={state.room.length} min={1000} onChange={(value) => setRoom("length", value)} />
              <DimensionInput label="Height" value={state.room.height} min={1000} onChange={(value) => setRoom("height", value)} />
            </div></details>
            <details open><summary>Door <ChevronDown size={15} /></summary><div className="fit-field-grid">
              <label className="fit-field"><span>Wall</span><select aria-label="Door wall" value={state.doors[0].wall} onChange={(event) => updateDoor({ wall: event.target.value as Door["wall"] })}><option value="north">North</option><option value="east">East</option><option value="south">South</option><option value="west">West</option></select></label>
              <DimensionInput label="Position" value={state.doors[0].position} onChange={(value) => updateDoor({ position: value })} />
              <DimensionInput label="Width" value={state.doors[0].width} min={500} onChange={(value) => updateDoor({ width: value })} />
              <DimensionInput label="Height" value={state.doors[0].height} min={1000} onChange={(value) => updateDoor({ height: value })} />
              <label className="fit-field"><span>Hinge</span><select aria-label="Door hinge" value={state.doors[0].hinge} onChange={(event) => updateDoor({ hinge: event.target.value as Door["hinge"] })}><option value="left">Left</option><option value="right">Right</option></select></label>
              <label className="fit-field"><span>Opens</span><select aria-label="Door opening direction" value={state.doors[0].opens} onChange={(event) => updateDoor({ opens: event.target.value as Door["opens"] })}><option value="inward">Inward</option><option value="outward">Outward</option></select></label>
            </div></details>
            <details><summary>Objects & restrictions <ChevronDown size={15} /></summary>
              <div className="fit-object-buttons">{(["radiator", "column", "obstacle", "furniture", "restricted"] as RoomItem["kind"][]).map((kind) => <button key={kind} onClick={() => addItem(kind)}><Plus size={13} />{kind}</button>)}</div>
              <div className="fit-object-list">{state.items.map((item) => <button className={selectedItem === item.id ? "is-active" : ""} key={item.id} onClick={() => setSelectedItem(item.id)}>{item.locked ? <Lock size={13} /> : <Move size={13} />}{item.name}</button>)}</div>
              {selected && <div className="fit-selected-editor">
                <input aria-label="Selected object name" value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} />
                <div className="fit-field-grid"><DimensionInput label="X" value={selected.x} onChange={(x) => updateSelected({ x })} /><DimensionInput label="Y" value={selected.y} onChange={(y) => updateSelected({ y })} /><DimensionInput label="Width" value={selected.width} min={50} onChange={(width) => updateSelected({ width })} /><DimensionInput label="Depth" value={selected.depth} min={50} onChange={(depth) => updateSelected({ depth })} /></div>
                <div className="fit-inline-actions"><button onClick={() => updateSelected({ locked: !selected.locked })}>{selected.locked ? <Unlock size={14} /> : <Lock size={14} />}{selected.locked ? "Unlock" : "Lock"}</button><button onClick={() => commit((current) => ({ ...current, items: current.items.filter((item) => item.id !== selected.id) }))}><Trash2 size={14} />Delete</button></div>
              </div>}
            </details>
          </> : <>
            <div className="fit-field-grid">
              <DimensionInput label="Entrance width" value={state.delivery.entranceWidth} onChange={(value) => setDelivery("entranceWidth", value)} />
              <DimensionInput label="Entrance height" value={state.delivery.entranceHeight} onChange={(value) => setDelivery("entranceHeight", value)} />
              <DimensionInput label="Hallway width" value={state.delivery.hallwayWidth} onChange={(value) => setDelivery("hallwayWidth", value)} />
              <DimensionInput label="Tightest turn" value={state.delivery.turnWidth} onChange={(value) => setDelivery("turnWidth", value)} />
              <DimensionInput label="Stair width" value={state.delivery.staircaseWidth} onChange={(value) => setDelivery("staircaseWidth", value)} />
              <DimensionInput label="Room door width" value={state.delivery.roomDoorWidth} onChange={(value) => setDelivery("roomDoorWidth", value)} />
            </div>
            <details><summary>Elevator (optional) <ChevronDown size={15} /></summary><div className="fit-field-grid"><DimensionInput label="Width" value={state.delivery.elevatorWidth} onChange={(value) => setDelivery("elevatorWidth", value)} /><DimensionInput label="Depth" value={state.delivery.elevatorDepth} onChange={(value) => setDelivery("elevatorDepth", value)} /><DimensionInput label="Height" value={state.delivery.elevatorHeight} onChange={(value) => setDelivery("elevatorHeight", value)} /></div></details>
            <details open><summary>Delivery configuration <ChevronDown size={15} /></summary>
              <p className="fit-note">The check uses the largest delivery component: <b>{deliveryAnalysis.component.name}</b>, {cm(deliveryAnalysis.component.width)} × {cm(deliveryAnalysis.component.depth)} × {cm(deliveryAnalysis.component.height)} cm.</p>
              {["legs", "armrests", "backrests"].map((part) => <label className="fit-check" key={part}><input type="checkbox" checked={state.removedParts.includes(part)} onChange={() => commit((current) => ({ ...current, removedParts: current.removedParts.includes(part) ? current.removedParts.filter((value) => value !== part) : [...current.removedParts, part] }))} />Remove {part} for delivery</label>)}
            </details>
          </>}
        </aside>

        <section className="fit-canvas-column">
          <div className="fit-tabs"><button className={activeTab === "room" ? "is-active" : ""} onClick={() => { setActiveTab("room"); setStep("placement"); }}>Room placement</button><button className={activeTab === "delivery" ? "is-active" : ""} onClick={() => { setActiveTab("delivery"); setStep("delivery"); }}>Delivery path</button></div>
          <div className="fit-toolbar" aria-label="Canvas tools">
            <button title="Undo" disabled={!history.length} onClick={undo}><Undo2 /></button><button title="Redo" disabled={!future.length} onClick={redo}><Redo2 /></button>
            <span />
            <button title="Pan left" onClick={() => setPan((value) => ({ ...value, x: Math.max(0, value.x - roomViewWidth * .1) }))}><ArrowLeft /></button><button title="Pan right" onClick={() => setPan((value) => ({ ...value, x: Math.min(Math.max(0, state.room.width - roomViewWidth), value.x + roomViewWidth * .1) }))}><ArrowRight /></button>
            <button title="Zoom out" onClick={() => setZoom((value) => clamp(value - .2, .6, 2.5))}><ZoomOut /></button><b>{Math.round(zoom * 100)}%</b><button title="Zoom in" onClick={() => setZoom((value) => clamp(value + .2, .6, 2.5))}><ZoomIn /></button><button title="Reset view" onClick={resetView}><RotateCcw /></button>
          </div>

          {activeTab === "room" ? <div className="fit-plan-wrap" onKeyDown={keyboardPlacement} tabIndex={0} aria-label="Interactive room plan. Use arrow keys to move the product, shift plus arrows for larger moves, and square brackets to rotate.">
            <svg ref={svgRef} className="fit-room-svg" role="img" aria-labelledby="fit-room-title fit-room-desc" viewBox={`${pan.x} ${pan.y} ${roomViewWidth} ${roomViewHeight}`} onPointerMove={pointerMove} onPointerUp={endDrag} onPointerLeave={endDrag} onTouchMove={pinchZoom} onTouchEnd={() => { pinchDistance.current = null; }} onWheel={(event: WheelEvent<SVGSVGElement>) => { event.preventDefault(); setZoom((value) => clamp(value + (event.deltaY < 0 ? .1 : -.1), .6, 2.5)); }}>
              <title id="fit-room-title">{`Top-down room placement for ${product.modelCode}`}</title>
              <desc id="fit-room-desc">{`${state.room.width / 1000} by ${state.room.length / 1000} metre room. Placement status is ${roomAnalysis.status}.`}</desc>
              <defs><pattern id="fit-grid-small" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#dedbd5" strokeWidth="5" /></pattern><pattern id="fit-grid" width="500" height="500" patternUnits="userSpaceOnUse"><rect width="500" height="500" fill="url(#fit-grid-small)" /><path d="M 500 0 L 0 0 0 500" fill="none" stroke="#c8c3bb" strokeWidth="8" /></pattern></defs>
              <rect width={state.room.width} height={state.room.length} fill="#fbf9f4" />
              <rect width={state.room.width} height={state.room.length} fill="url(#fit-grid)" stroke="#171815" strokeWidth="28" />
              {state.items.map((item) => <g key={item.id} className={`fit-svg-item is-${item.kind} ${selectedItem === item.id ? "is-selected" : ""}`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setSelectedItem(item.id); if (!item.locked) setDragging(item.id); }}>
                <rect x={item.x} y={item.y} width={item.width} height={item.depth} rx="18" /><text x={item.x + item.width / 2} y={item.y + item.depth / 2} dominantBaseline="middle" textAnchor="middle">{item.name}</text>
              </g>)}
              {state.doors.map((door) => {
                const hinge = doorHingePoint(door, state.room.width, state.room.length);
                const vertical = door.wall === "east" || door.wall === "west";
                const lineStart = door.position;
                return <g className="fit-door" key={door.id}>
                  {vertical ? <line x1={door.wall === "west" ? 0 : state.room.width} y1={lineStart} x2={door.wall === "west" ? 0 : state.room.width} y2={lineStart + door.width} /> : <line x1={lineStart} y1={door.wall === "north" ? 0 : state.room.length} x2={lineStart + door.width} y2={door.wall === "north" ? 0 : state.room.length} />}
                  {door.opens === "inward" && <circle cx={hinge.x} cy={hinge.y} r={door.width} />}
                </g>;
              })}
              <g className={`fit-product-shape fit-status-${roomAnalysis.status}`} transform={`translate(${state.placement.x} ${state.placement.y}) rotate(${state.placement.rotation})`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging("product"); }}>
                <rect x={-product.widthMm / 2} y={-product.depthMm / 2} width={product.widthMm} height={product.depthMm} rx="90" />
                <rect className="fit-product-back" x={-product.widthMm / 2 + 55} y={-product.depthMm / 2 + 45} width={product.widthMm - 110} height={Math.max(130, product.depthMm * .22)} rx="50" />
                {Array.from({ length: Math.max(1, product.numberOfSeats) }, (_, index) => <rect key={index} className="fit-product-seat" x={-product.widthMm / 2 + 90 + index * ((product.widthMm - 180) / Math.max(1, product.numberOfSeats))} y={-product.depthMm * .13} width={(product.widthMm - 180) / Math.max(1, product.numberOfSeats) - 15} height={product.depthMm * .47} rx="35" />)}
                <text y="20" textAnchor="middle">{product.modelCode}</text>
                <text className="fit-product-dims" y={product.depthMm / 2 + 130} textAnchor="middle">{cm(product.widthMm)} × {cm(product.depthMm)} cm · {state.placement.rotation}°</text>
              </g>
              <text className="fit-dimension fit-dimension-top" x={state.room.width / 2} y={95} textAnchor="middle">{cm(state.room.width)} cm</text>
              <text className="fit-dimension" x={state.room.width - 80} y={state.room.length / 2} transform={`rotate(90 ${state.room.width - 80} ${state.room.length / 2})`} textAnchor="middle">{cm(state.room.length)} cm</text>
            </svg>
            <div className="fit-live-status" role="status" aria-live="polite"><StatusMark status={roomAnalysis.status} /><span>Wall distances: left {cm(roomAnalysis.distances.left)} · right {cm(roomAnalysis.distances.right)} · front {cm(roomAnalysis.distances.bottom)} cm</span></div>
          </div> : <div className="fit-delivery-canvas">
            <div className="fit-route">
              {deliveryAnalysis.passages.map((passage, index) => <div className={`fit-route-segment fit-status-${passage.status}`} key={passage.id}><span>{index + 1}</span><b>{passage.name}</b><small>{passage.available ? `${cm(passage.available)} cm` : "Not measured"}</small></div>)}
              <div className="fit-delivery-piece" style={{ left: `${deliveryProgress}%` }}><Box /><span>{deliveryAnalysis.component.name}</span></div>
            </div>
            <label className="fit-route-slider">Move largest component along route<input aria-label="Delivery route position" type="range" min="2" max="94" value={deliveryProgress} onChange={(event) => setDeliveryProgress(Number(event.target.value))} /></label>
            <div className="fit-module-strip"><p className="eyebrow">Delivery components</p>{components.map((component) => <article key={component.id}><Box /><b>{component.name}</b><small>{cm(component.width)} × {cm(component.depth)} × {cm(component.height)} cm</small></article>)}</div>
          </div>}

          {activeTab === "room" && <div className="fit-placement-tools">
            <div><p className="eyebrow">Position & orientation</p><div className="fit-inline-actions"><button onClick={() => rotate(-15)}>Rotate −15°</button><button onClick={() => rotate(15)}>Rotate +15°</button><button onClick={() => rotate(90)}>90°</button><button onClick={snapToWall}>Align to wall</button><button onClick={centerProduct}>Centre</button></div></div>
            <div className="fit-field-grid fit-coordinate-fields"><DimensionInput label="X position" value={state.placement.x} onChange={(x) => commit((current) => ({ ...current, placement: { ...current.placement, x } }))} /><DimensionInput label="Y position" value={state.placement.y} onChange={(y) => commit((current) => ({ ...current, placement: { ...current.placement, y } }))} /></div>
          </div>}

          {activeTab === "room" && <div className="fit-suggestions"><p className="eyebrow">Automatic placement suggestions</p><div>{suggestions.map((suggestion, index) => <button key={`${suggestion.placement.x}-${suggestion.placement.y}`} onClick={() => applySuggestion(suggestion.placement)}><span>{index + 1}</span><b>{index === 0 ? "Recommended" : index === 1 ? "Alternative" : "Space-first"}</b><StatusMark status={suggestion.analysis.status} /></button>)}</div></div>}
        </section>

        <aside className="fit-panel fit-results-panel">
          <p className="eyebrow">Live analysis</p>
          <h2>{overall === "safe" ? "Likely to fit" : overall === "tight" ? "Review tight clearances" : "Potential conflict"}</h2>
          <p className="fit-disclaimer">Based on the measurements supplied. This is planning guidance, not an installation guarantee.</p>
          <section><h3>Room fit <StatusMark status={roomAnalysis.status} /></h3>{roomAnalysis.issues.length ? <ul>{roomAnalysis.issues.map((issue) => <li key={issue.id}><AlertTriangle size={15} />{issue.message}</li>)}</ul> : <p><Check size={15} /> No room conflicts found in this placement.</p>}</section>
          <section><h3>Delivery fit <StatusMark status={deliveryAnalysis.status} /></h3><ul>{deliveryAnalysis.passages.map((passage) => <li key={passage.id}><StatusMark status={passage.status} /><span><b>{passage.name}</b><small>{passage.message}</small></span></li>)}</ul></section>
          <section><h3>Measurement quality</h3><p>{measurementMissing.length ? `${measurementMissing.length} optional elevator measurement${measurementMissing.length === 1 ? " is" : "s are"} missing. Add them if elevator transport is required.` : "All requested route measurements are available."}</p></section>
          <div className="fit-result-actions"><button className="primary" onClick={saveReport}><Save />{saved ? "Fit report saved" : "Save fit report"}</button><button onClick={downloadReport}><Download />Download report</button><button onClick={() => window.print()}><Download />Print report</button><Link href={`/handover?product=${product.id}&subject=fit-report`}><Send />Send to retailer</Link><Link href="/handover">Book technical check <ArrowRight /></Link></div>
        </aside>
      </section>

      <footer className="container fit-mobile-nav"><button disabled={STEPS.findIndex((item) => item.id === step) === 0} onClick={() => setStep(STEPS[Math.max(0, STEPS.findIndex((item) => item.id === step) - 1)].id)}><ArrowLeft />Back</button><button onClick={() => { const next = STEPS[Math.min(STEPS.length - 1, STEPS.findIndex((item) => item.id === step) + 1)].id; setStep(next); if (next === "delivery") setActiveTab("delivery"); }}><span>Continue</span><ArrowRight /></button></footer>
    </main>
  );
}

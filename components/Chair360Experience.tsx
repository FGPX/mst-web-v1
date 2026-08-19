"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Mouse, Pause, Play, Search } from "lucide-react";
import { FormEvent, PointerEvent, useEffect, useRef, useState, WheelEvent } from "react";

const FRAME_COUNT = 7;
const frames = Array.from(
  { length: FRAME_COUNT },
  (_, index) => `/chair-360/frame-${String(index + 1).padStart(2, "0")}.jpg`
);

const AVAILABLE_360_PRODUCT = {
  code: "CHAIR360",
  label: "360° chair demo"
} as const;

export function has360View(productCode: string) {
  return productCode.trim().replace(/[\s-]+/g, "").toUpperCase() === AVAILABLE_360_PRODUCT.code;
}

export default function Chair360Experience() {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [productCode, setProductCode] = useState("");
  const [searchStatus, setSearchStatus] = useState<"idle" | "found" | "unavailable">("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startFrameRef = useRef(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) setIsPlaying(false);

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible) return;
    const interval = window.setInterval(
      () => setFrame((current) => (current + 1) % FRAME_COUNT),
      520
    );
    return () => window.clearInterval(interval);
  }, [isPlaying, isVisible]);

  useEffect(() => () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  function pauseThenResume() {
    setIsPlaying(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsPlaying(true), 2600);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    startXRef.current = event.clientX;
    startFrameRef.current = frame;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPlaying(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const offset = Math.round((event.clientX - startXRef.current) / 48);
    setFrame(((startFrameRef.current + offset) % FRAME_COUNT + FRAME_COUNT) % FRAME_COUNT);
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pauseThenResume();
  }

  function rotateWithWheel(event: WheelEvent<HTMLDivElement>) {
    if (Math.abs(event.deltaY) < 2 && Math.abs(event.deltaX) < 2) return;
    const direction = Math.sign(Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY);
    setFrame((current) => (current + direction + FRAME_COUNT) % FRAME_COUNT);
    pauseThenResume();
  }

  function toggleAutoplay() {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setFrame((current) => (current + 1) % FRAME_COUNT);
    setIsPlaying(true);
  }

  function searchProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (has360View(productCode)) {
      setFrame(0);
      setIsPlaying(true);
      setSearchStatus("found");
      return;
    }

    setSearchStatus("unavailable");
  }

  return (
    <section ref={sectionRef} className="simple-chair360" aria-labelledby="chair360-heading">
      <div className="simple-container simple-chair360-grid">
        <div className="simple-chair360-viewer">
          <div
            className="simple-chair360-stage"
            onPointerDown={startDrag}
            onPointerMove={drag}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onWheel={rotateWithWheel}
          >
            <span className="simple-chair360-mark" aria-hidden="true">360<sup>°</sup></span>
            <div className="simple-chair360-images" aria-live="off">
              {frames.map((src, index) => (
                <Image
                  key={src}
                  className={index === frame ? "is-active" : ""}
                  src={src}
                  alt={index === frame ? `Grey upholstered chair, 360 degree view ${index + 1} of ${FRAME_COUNT}` : ""}
                  aria-hidden={index !== frame}
                  draggable={false}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 900px) calc(100vw - 40px), 58vw"
                />
              ))}
            </div>
            <div className="simple-chair360-interaction">
              <span><Mouse size={23} strokeWidth={1.4} /> Drag or scroll to rotate</span>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleAutoplay();
                }}
                aria-label={isPlaying ? "Pause chair rotation" : "Play chair rotation"}
              >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                <span>{isPlaying ? "Auto rotating" : "Rotation paused"}</span>
              </button>
            </div>
          </div>

          <form className="simple-chair360-search" onSubmit={searchProduct} noValidate>
            <label htmlFor="chair360-product-code">Find a product in 360°</label>
            <div className="simple-chair360-search-row">
              <input
                id="chair360-product-code"
                name="productCode"
                type="search"
                value={productCode}
                onChange={(event) => {
                  setProductCode(event.target.value);
                  setSearchStatus("idle");
                }}
                placeholder="Enter product code — try CHAIR360"
                autoComplete="off"
                required
              />
              <button type="submit" aria-label="Search product code">
                <Search size={19} />
                <span>Search</span>
              </button>
            </div>
            <div className="simple-chair360-search-feedback" aria-live="polite">
              {searchStatus === "found" && (
                <p className="is-found"><Check size={16} /> {AVAILABLE_360_PRODUCT.label} is ready to explore.</p>
              )}
              {searchStatus === "unavailable" && (
                <p>No 360° view is available for that code yet. Try the demo code <button type="button" onClick={() => {
                  setProductCode(AVAILABLE_360_PRODUCT.code);
                  setSearchStatus("idle");
                }}>CHAIR360</button>.</p>
              )}
            </div>
          </form>
        </div>

        <div className="simple-chair360-copy">
          <span className="simple-kicker">360° product experience</span>
          <h2 id="chair360-heading">See every angle.</h2>
          <span className="simple-chair360-rule" aria-hidden="true" />
          <p>Explore the chair in complete 360-degree detail. Discover its form, comfort and craftsmanship from every perspective.</p>
          <Link className="simple-chair360-cta" href="/furniture">
            Explore collection <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}

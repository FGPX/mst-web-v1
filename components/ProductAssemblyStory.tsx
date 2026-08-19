"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";

const assemblyImageStyle = {
  objectFit: "var(--assembly-fit)" as CSSProperties["objectFit"],
  objectPosition: "center"
};

export default function ProductAssemblyStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const navigationEntry = window.performance
      .getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isPageReload = navigationEntry?.type === "reload";

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      section.style.setProperty("--assembly-progress", progress.toFixed(4));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const resetReloadedStory = () => {
      if (!isPageReload) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionEnd = sectionTop + Math.max(section.offsetHeight - window.innerHeight, 1);

      if (window.scrollY > sectionTop && window.scrollY <= sectionEnd) {
        window.scrollTo({ top: sectionTop, left: 0, behavior: "auto" });
      }

      requestUpdate();
    };

    resetReloadedStory();
    update();
    window.addEventListener("load", resetReloadedStory, { once: true });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("load", resetReloadedStory);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="product-assembly" ref={sectionRef} aria-labelledby="assembly-heading">
      <div className="product-assembly-sticky">
        <div className="assembly-intro">
          <span className="simple-kicker">A room, composed</span>
          <h2 id="assembly-heading">Beautiful alone.<br />Better together.</h2>
          <p>Scroll to bring a Musterring living space together.</p>
        </div>

        <div className="assembly-stage" aria-label="A Musterring living room assembling as you scroll">
          <div className="assembly-room-plate" aria-hidden="true">
            <Image
              src="/assembly-layers/room-empty.webp"
              alt=""
              fill
              priority
              unoptimized
              sizes="100vw"
              style={assemblyImageStyle}
            />
          </div>

          <div className="assembly-object assembly-object-sofa" aria-hidden="true">
            <Image src="/assembly-layers/sofa-layer.png" alt="" fill sizes="100vw" style={assemblyImageStyle} />
          </div>

          <div className="assembly-object assembly-object-tables" aria-hidden="true">
            <Image src="/assembly-layers/tables-layer.png" alt="" fill sizes="100vw" style={assemblyImageStyle} />
          </div>

          <div className="assembly-final-seal">
            <Image
              src="/musterring-catalog/justb-pm100/image-01.jpg"
              alt="Bright Musterring living room with a JUSTB! PM100 sectional sofa"
              fill
              priority
              sizes="100vw"
              style={assemblyImageStyle}
            />
          </div>

          <Link className="assembly-product-link" href="/furniture/justb-pm100">
            <small>Sofa</small>
            <strong>JUSTB! PM100</strong>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="assembly-finale">
          <span>Living, considered</span>
          <Link href="/inspiration/rooms">Explore room inspiration <ArrowRight size={17} /></Link>
        </div>

        <div className="assembly-scroll-cue" aria-hidden="true">
          <ArrowDown size={16} />
          <span>Scroll to compose</span>
        </div>

        <div className="assembly-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}

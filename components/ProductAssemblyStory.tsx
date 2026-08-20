"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";

const AUTO_PLAY_DELAY = 700;
const AUTO_PLAY_DURATION = 4200;
const HERO_END_BUFFER = 2;

const assemblyImageStyle = {
  objectFit: "var(--assembly-fit)" as CSSProperties["objectFit"],
  objectPosition: "var(--assembly-position, center)"
};

export default function ProductAssemblyStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let lastFrameTime = 0;
    let currentProgress = 0;
    let targetProgress = 0;
    let autoPlayFrame = 0;
    let autoPlayTimer = 0;
    let isAutoPlaying = false;
    let restoreScrollBehavior: (() => void) | undefined;
    const navigationEntry = window.performance
      .getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isPageReload = navigationEntry?.type === "reload";

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const scrolledDistance = -rect.top;
      targetProgress = distance - scrolledDistance <= HERO_END_BUFFER
        ? 1
        : Math.min(1, Math.max(0, scrolledDistance / distance));
    };

    const render = (time: number) => {
      const delta = targetProgress - currentProgress;
      const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 64) : 16.7;
      const ease = 1 - Math.exp(-elapsed / 85);
      lastFrameTime = time;
      currentProgress = reduceMotion || Math.abs(delta) < 0.0002
        ? targetProgress
        : currentProgress + delta * ease;
      section.style.setProperty("--assembly-progress", currentProgress.toFixed(4));

      if (Math.abs(targetProgress - currentProgress) >= 0.0002) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = 0;
        lastFrameTime = 0;
      }
    };

    const requestUpdate = () => {
      if (isAutoPlaying) return;
      measure();
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const finishAutoPlay = () => {
      isAutoPlaying = false;
      autoPlayFrame = 0;
      currentProgress = 1;
      targetProgress = 1;
      section.style.setProperty("--assembly-progress", "1");
      restoreScrollBehavior?.();
      restoreScrollBehavior = undefined;
    };

    const cancelAutoPlay = () => {
      window.clearTimeout(autoPlayTimer);
      if (!isAutoPlaying) return;

      isAutoPlaying = false;
      if (autoPlayFrame) window.cancelAnimationFrame(autoPlayFrame);
      autoPlayFrame = 0;
      restoreScrollBehavior?.();
      restoreScrollBehavior = undefined;
      requestUpdate();
    };

    const startAutoPlay = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;

      // Do not pull someone back into the hero when the browser restores a
      // position farther down the page.
      if (Math.abs(window.scrollY - sectionTop) > 2) return;

      if (reduceMotion) {
        finishAutoPlay();
        return;
      }

      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      restoreScrollBehavior = () => {
        root.style.scrollBehavior = previousScrollBehavior;
      };

      isAutoPlaying = true;
      const startTime = window.performance.now();

      const animate = (time: number) => {
        const linearProgress = Math.min(1, (time - startTime) / AUTO_PLAY_DURATION);
        // Quintic easing has a gentler start and landing than the previous
        // cubic curve, so the individual layers settle without a visible snap.
        const easedProgress = linearProgress < .5
          ? 16 * Math.pow(linearProgress, 5)
          : 1 - Math.pow(-2 * linearProgress + 2, 5) / 2;
        const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
        const storyEnd = sectionTop + distance - HERO_END_BUFFER;

        currentProgress = easedProgress;
        targetProgress = easedProgress;
        section.style.setProperty("--assembly-progress", easedProgress.toFixed(4));
        window.scrollTo({
          top: sectionTop + (storyEnd - sectionTop) * easedProgress,
          left: 0,
          behavior: "auto"
        });

        if (linearProgress < 1) {
          autoPlayFrame = window.requestAnimationFrame(animate);
          return;
        }

        // Keep a tiny buffer before the sticky boundary so the next section
        // cannot peek into the completed hero because of pixel rounding.
        window.scrollTo({ top: storyEnd, left: 0, behavior: "auto" });
        finishAutoPlay();
      };

      autoPlayFrame = window.requestAnimationFrame(animate);
    };

    const scheduleAutoPlay = () => {
      autoPlayTimer = window.setTimeout(startAutoPlay, AUTO_PLAY_DELAY);
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
    measure();
    currentProgress = targetProgress;
    section.style.setProperty("--assembly-progress", currentProgress.toFixed(4));
    window.addEventListener("load", resetReloadedStory, { once: true });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("wheel", cancelAutoPlay, { passive: true });
    window.addEventListener("touchstart", cancelAutoPlay, { passive: true });
    window.addEventListener("pointerdown", cancelAutoPlay, { passive: true });
    window.addEventListener("keydown", cancelAutoPlay);

    if (document.readyState === "complete") scheduleAutoPlay();
    else window.addEventListener("load", scheduleAutoPlay, { once: true });

    return () => {
      window.clearTimeout(autoPlayTimer);
      window.removeEventListener("load", resetReloadedStory);
      window.removeEventListener("load", scheduleAutoPlay);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("wheel", cancelAutoPlay);
      window.removeEventListener("touchstart", cancelAutoPlay);
      window.removeEventListener("pointerdown", cancelAutoPlay);
      window.removeEventListener("keydown", cancelAutoPlay);
      if (frame) window.cancelAnimationFrame(frame);
      if (autoPlayFrame) window.cancelAnimationFrame(autoPlayFrame);
      restoreScrollBehavior?.();
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
          <div className="assembly-canvas">
            <div className="assembly-room-plate" aria-hidden="true">
              <Image
                src="/assembly-layers/room-empty.webp"
                alt=""
                fill
                priority
                unoptimized
                sizes="(max-aspect-ratio: 4/3) 100vw, 133vh"
                style={assemblyImageStyle}
              />
            </div>

            <div className="assembly-object assembly-object-sofa" aria-hidden="true">
              <Image src="/assembly-layers/sofa-layer.png" alt="" fill sizes="(max-aspect-ratio: 4/3) 100vw, 133vh" style={assemblyImageStyle} />
            </div>

            <div className="assembly-object assembly-object-tables" aria-hidden="true">
              <Image src="/assembly-layers/tables-layer.png" alt="" fill sizes="(max-aspect-ratio: 4/3) 100vw, 133vh" style={assemblyImageStyle} />
            </div>

            <div className="assembly-final-image">
              <Image
                src="/musterring-catalog/justb-pm100/image-01.jpg"
                alt="Bright Musterring living room with a JUSTB! PM100 sectional sofa"
                fill
                priority
                sizes="(max-aspect-ratio: 4/3) 100vw, 133vh"
                style={assemblyImageStyle}
              />
            </div>
          </div>
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

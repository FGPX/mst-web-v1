"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, type CSSProperties } from "react";

const HERO_END_BUFFER = 2;
const AUTO_PLAY_DELAY = 0;
const AUTO_PLAY_DURATION = 5600;

function smoothPhase(progress: number, start: number, end: number) {
  const normalized = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  return normalized * normalized * (3 - 2 * normalized);
}

const assemblyImageStyle = {
  objectFit: "var(--assembly-fit)" as CSSProperties["objectFit"],
  objectPosition: "var(--assembly-position, center)"
};

export default function ProductAssemblyStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
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
    const isPageReload = navigationEntry?.type === "reload"
      || window.performance.navigation?.type === 1;
    const previousScrollRestoration = window.history.scrollRestoration;

    if (isPageReload) window.history.scrollRestoration = "manual";

    const setVisualProgress = (progress: number) => {
      section.style.setProperty("--assembly-progress", progress.toFixed(4));
      section.style.setProperty("--assembly-room-progress", smoothPhase(progress, 0, .58).toFixed(4));
      // 1.png (tables) arrives first, followed by 2.png (sofa).
      section.style.setProperty("--assembly-tables-progress", smoothPhase(progress, .08, .58).toFixed(4));
      section.style.setProperty("--assembly-sofa-progress", smoothPhase(progress, .24, .74).toFixed(4));
      section.style.setProperty("--assembly-final-progress", smoothPhase(progress, .64, .8).toFixed(4));
      section.style.setProperty("--assembly-layer-fade-progress", smoothPhase(progress, .82, .995).toFixed(4));
    };

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
      // Follow the user's gesture closely, while filtering the tiny jumps
      // produced by trackpads and high-resolution mouse wheels.
      const ease = 1 - Math.exp(-elapsed / 105);
      lastFrameTime = time;
      currentProgress = reduceMotion || Math.abs(delta) < 0.0002
        ? targetProgress
        : currentProgress + delta * ease;
      setVisualProgress(currentProgress);

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
      setVisualProgress(1);
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
      if (reduceMotion) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      if (Math.abs(window.scrollY - sectionTop) > 2) return;

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
        // A quadratic ease-out makes the composition visibly start at once,
        // then settles progressively more gently toward the finished room.
        const easedProgress = 1 - (1 - linearProgress) ** 2;
        const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
        const storyEnd = sectionTop + distance - HERO_END_BUFFER;

        currentProgress = easedProgress;
        targetProgress = easedProgress;
        setVisualProgress(easedProgress);
        window.scrollTo({
          top: sectionTop + (storyEnd - sectionTop) * easedProgress,
          left: 0,
          behavior: "auto"
        });

        if (linearProgress < 1) {
          autoPlayFrame = window.requestAnimationFrame(animate);
          return;
        }

        window.scrollTo({ top: storyEnd, left: 0, behavior: "auto" });
        finishAutoPlay();
      };

      autoPlayFrame = window.requestAnimationFrame(animate);
    };

    const resetReloadedStory = () => {
      if (!isPageReload) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionEnd = sectionTop + Math.max(section.offsetHeight - window.innerHeight, 1);

      if (window.scrollY >= sectionTop && window.scrollY <= sectionEnd) {
        window.scrollTo({ top: sectionTop, left: 0, behavior: "auto" });
        currentProgress = 0;
        targetProgress = 0;
        setVisualProgress(0);
      }
    };

    resetReloadedStory();
    measure();
    currentProgress = targetProgress;
    setVisualProgress(currentProgress);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("wheel", cancelAutoPlay, { passive: true });
    window.addEventListener("touchstart", cancelAutoPlay, { passive: true });
    window.addEventListener("pointerdown", cancelAutoPlay, { passive: true });
    window.addEventListener("keydown", cancelAutoPlay);
    window.addEventListener("load", resetReloadedStory, { once: true });
    autoPlayTimer = window.setTimeout(startAutoPlay, AUTO_PLAY_DELAY);

    return () => {
      window.clearTimeout(autoPlayTimer);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("wheel", cancelAutoPlay);
      window.removeEventListener("touchstart", cancelAutoPlay);
      window.removeEventListener("pointerdown", cancelAutoPlay);
      window.removeEventListener("keydown", cancelAutoPlay);
      window.removeEventListener("load", resetReloadedStory);
      if (frame) window.cancelAnimationFrame(frame);
      if (autoPlayFrame) window.cancelAnimationFrame(autoPlayFrame);
      restoreScrollBehavior?.();
      window.history.scrollRestoration = previousScrollRestoration;
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
            <div className="assembly-artboard">
              <div className="assembly-room-plate" aria-hidden="true">
                <Image
                  src="/assembly-layers/room-empty-exact.jpg"
                  alt=""
                  fill
                  priority
                  unoptimized
                  sizes="(max-aspect-ratio: 4/3) 100vw, 133vh"
                  style={assemblyImageStyle}
                />
              </div>

              <div className="assembly-object assembly-object-sofa" aria-hidden="true">
                <Image src="/assembly-layers/sofa-layer-exact.png" alt="" fill unoptimized sizes="(max-aspect-ratio: 4/3) 100vw, 133vh" style={assemblyImageStyle} />
              </div>

              <div className="assembly-object assembly-object-tables" aria-hidden="true">
                <Image src="/assembly-layers/tables-layer-exact.png" alt="" fill unoptimized sizes="(max-aspect-ratio: 4/3) 100vw, 133vh" style={assemblyImageStyle} />
              </div>

              <div className="assembly-final-image">
                <Image
                  src="/assembly-layers/room-assembled-exact.jpg"
                  alt="Bright Musterring living room with a JUSTB! PM100 sectional sofa"
                  fill
                  priority
                  unoptimized
                  sizes="(max-aspect-ratio: 4/3) 100vw, 133vh"
                  style={assemblyImageStyle}
                />
              </div>
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

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Database, Network, RefreshCcw, Route, Sparkles, Store } from "lucide-react";
import { useState } from "react";
import { storage } from "@/lib/persistence";
import { ExperienceStatus } from "./ExperienceStatus";

const searchQuery = "I need a compact beige modular sofa for a small apartment, maximum width 240 cm, with relax function.";
const configurationRequest = "Build a four-seat sofa under 290 cm in an easy-care beige fabric with relax function.";

export function PresentationClient({ realAiActive }: { realAiActive: boolean }) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const reset = () => {
    storage.resetPresentationDemo();
    setNotice("Presentation data restored: project, configuration, room scene, fit report and preferred retailer.");
  };
  const launch = (route: string) => {
    reset();
    router.push(route);
  };
  return (
    <div className="presentation-page">
      <section className="presentation-hero">
        <Image src="/stitch-assets/original/room-living.jpg" alt="" fill priority sizes="100vw" />
        <div className="stitch-container presentation-hero-inner">
          <div>
            <p className="stitch-eyebrow">Executive presentation · 2027</p>
            <h1>Musterring<br /><em>Online Product World</em></h1>
            <p className="presentation-statement">From an inspiring catalogue to an intelligent, configurable and dealer-ready product experience.</p>
            <div className="presentation-actions">
              <button onClick={() => launch(`/search?q=${encodeURIComponent(searchQuery)}`)}>Start guided demo <ArrowRight size={18} /></button>
              <button className="is-ghost" onClick={reset}><RefreshCcw size={17} /> Reset demo data</button>
            </div>
            {notice ? <p className="presentation-notice" role="status">{notice}</p> : null}
          </div>
          <aside>
            <span>Customer need</span><i />
            <span>Intelligent guidance</span><i />
            <span>Validated product decision</span><i />
            <span>Retailer consultation</span>
          </aside>
        </div>
      </section>

      <section className="presentation-journeys stitch-container">
        <header><p className="stitch-eyebrow">Three controlled live journeys</p><h2>Complex products, made confidently understandable.</h2></header>
        <div>
          <article>
            <span>01</span><Sparkles />
            <h3>Find the right product</h3>
            <p>Interpret a customer need, expose structured intent and separate exact catalogue matches from close alternatives.</p>
            <button onClick={() => launch(`/search?q=${encodeURIComponent(searchQuery)}`)}>Launch Intelligent Search <ArrowRight size={16} /></button>
            <button className="presentation-text-action" onClick={() => launch(`/search?q=${encodeURIComponent("I need a red sofa under 220 cm.")}`)}>Run negative-control search</button>
          </article>
          <article>
            <span>02</span><Database />
            <h3>Configure a valid solution</h3>
            <p>AI interprets the request. The deterministic engine validates modules, options, dimensions and a retailer-ready Configuration ID.</p>
            <button onClick={() => launch(`/configurator/mr-2875?request=${encodeURIComponent(configurationRequest)}`)}>Launch Configuration Assistant <ArrowRight size={16} /></button>
          </article>
          <article>
            <span>03</span><Store />
            <h3>Visualize and continue</h3>
            <p>Open a curated room concept with retained Product and Configuration IDs, then continue through My Musterring to a retailer.</p>
            <button onClick={() => launch("/room-composer?presentation=1")}>Launch Room & Retailer Journey <ArrowRight size={16} /></button>
          </article>
        </div>
      </section>

      <section className="presentation-assistant-demos stitch-container">
        <header><p className="stitch-eyebrow">Connected customer assistance</p><h2>Four grounded capabilities. One continuous conversation.</h2></header>
        <div>
          <button onClick={() => { reset(); window.dispatchEvent(new CustomEvent("musterring:alternatives", { detail: { productId: "p1", requestText: "I like this sofa, but I need something 30 cm narrower with a higher seat." } })); }}><span>01</span><strong>Product alternatives</strong><small>I need something 30 cm narrower with a higher seat.</small></button>
          <button onClick={() => launch(`/materials?advisor=${encodeURIComponent("I have two children, a dog and strong afternoon sunlight.")}`)}><span>02</span><strong>Material & care</strong><small>Two children, a dog and strong afternoon sunlight.</small></button>
          <button onClick={() => { reset(); window.dispatchEvent(new CustomEvent("musterring:advisor", { detail: { mode: "voice", prompt: "Show me a modular corner sofa in beige, then add a matching table to my Living Room Project." } })); }}><span>03</span><strong>Voice Interior Assistant</strong><small>Recognize a website command and confirm important actions.</small></button>
          <button onClick={() => { reset(); window.dispatchEvent(new CustomEvent("musterring:advisor", { detail: { prompt: "I need a compact family sofa with easy-care material. It must be under 260 cm. Help me compare the best options." } })); }}><span>04</span><strong>Musterring Product Advisor</strong><small>Discover, compare, configure, save and prepare a retailer handover.</small></button>
        </div>
      </section>

      <section className="presentation-status-section">
        <div className="stitch-container">
          <header><p className="stitch-eyebrow">Implementation status</p><h2>Presentation-ready locally. Integration-honest by design.</h2></header>
          <div className="presentation-status-grid">
            <article>
              <h3>Functional today</h3>
              {["Complete local customer journey", "Natural-language intent parsing", "Grounded catalogue search", "Deterministic configuration validation", "Project persistence", "Retailer handover demo", "Analytics event layer"].map((item) => <p key={item}><Check size={15} />{item}</p>)}
              <ExperienceStatus kind={realAiActive ? "real-ai" : "deterministic"} />
              <ExperienceStatus kind="validated" detail="Official names and imagery where imported" />
              <ExperienceStatus kind="concept" detail="Planning values remain illustrative" />
            </article>
            <article>
              <h3>Next production integrations</h3>
              {["Musterring PIM", "CMS / DAM", "Real dealer data", "CRM lead delivery", "Booking / calendar", "Maps / geolocation", "Official analytics platform", "Production image visualization provider"].map((item) => <p key={item}><Route size={15} />{item}</p>)}
              <ExperienceStatus kind="external" />
            </article>
          </div>
        </div>
      </section>

      <section className="presentation-value stitch-container">
        <header><p className="stitch-eyebrow">Executive business value</p><h2>One product world. Three beneficiaries.</h2></header>
        <div>
          <article><h3>For customers</h3><p>Find suitable products faster, understand complex options, save the planning journey and arrive better prepared for consultation.</p></article>
          <article><h3>For retailers</h3><p>Receive higher-quality leads with exact Product and Configuration IDs, room context, measurements and the requested next action.</p></article>
          <article><h3>For Musterring</h3><p>Use governed product data more effectively, strengthen premium digital positioning and measure online-to-retailer conversion.</p></article>
        </div>
      </section>

      <section className="presentation-architecture">
        <div className="stitch-container">
          <header><Network /><div><p className="stitch-eyebrow">Executive architecture</p><h2>AI interprets. Deterministic services decide.</h2></div></header>
          <div className="presentation-flow">
            {["PIM / CMS / DAM", "Validated Product API", "Search / Configurator / Visualization", "My Musterring", "CRM / Dealer / Booking", "Analytics"].map((item, index) => <span key={item}>{item}{index < 5 ? <ArrowRight size={15} /> : null}</span>)}
          </div>
          <div className="presentation-service-split">
            <article><h3>AI services</h3><p>Language understanding · visual tagging · recommendations · summaries</p></article>
            <article><h3>Deterministic services</h3><p>Product facts · rules · dimensions · fit checking · price logic · dealer routing</p></article>
          </div>
        </div>
      </section>

      <section className="presentation-roadmap stitch-container">
        <header><p className="stitch-eyebrow">Integration roadmap</p><h2>Build confidence in four deliberate stages.</h2></header>
        <ol>
          <li><span>A</span><div><h3>Foundation</h3><p>PIM data contract · taxonomy · analytics · dealer process</p></div></li>
          <li><span>B</span><div><h3>MVP</h3><p>Intelligent Search · product pages · comparison · My Musterring · handover</p></div></li>
          <li><span>C</span><div><h3>Decision Support</h3><p>Configurator pilot · materials · showroom request · booking</p></div></li>
          <li><span>D</span><div><h3>Advanced Visualization</h3><p>Shoppable rooms · Room Composer · Upload Your Room · 3D / AR · Visual Search</p></div></li>
        </ol>
        <p className="presentation-disclaimer">Product names, prices, configurations and availability shown in this concept are illustrative and must be connected to validated Musterring PIM and retailer data.</p>
      </section>
    </div>
  );
}

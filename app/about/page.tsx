import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Globe2,
  Heart,
  Leaf,
  ShieldCheck,
  SlidersHorizontal,
  Users
} from "lucide-react";
import { StitchLinkButton } from "@/components/stitch/StitchButtons";

export const metadata: Metadata = {
  title: "About Musterring | You are at home",
  description: "Discover Musterring: individual furniture, lasting quality, personal service and a story that began in 1938."
};

const principles = [
  {
    icon: SlidersHorizontal,
    title: "Made personal",
    text: "Choose from a wide range of forms, colours, materials and comfort options."
  },
  {
    icon: ShieldCheck,
    title: "Quality considered",
    text: "Design requirements, selected manufacturing partners and product testing work together."
  },
  {
    icon: Users,
    title: "Advice nearby",
    text: "Qualified retail partners help turn individual ideas into a complete furniture plan."
  },
  {
    icon: Leaf,
    title: "Made responsibly",
    text: "Furniture is produced for individual orders, supported by resource-conscious approaches."
  }
];

const history = [
  { year: "1938", text: "Furniture architect Josef Höner establishes Musterring as a shared service community." },
  { year: "1959", text: "The international brand concept begins with the first retail partner in Austria." },
  { year: "1975", text: "Musterring opens its own test institute and introduces a five-year guarantee." },
  { year: "1992", text: "Support begins for the reforestation of the Zittau municipal forest." },
  { year: "2021", text: "Bettina Zimmermann and Kai Wiesinger become Musterring brand ambassadors." },
  { year: "2025", text: "The fourth generation of the Höner family takes responsibility in management." }
];

export default function AboutPage() {
  return (
    <div className="public-page about-page">
      <section className="about-brand-hero" aria-labelledby="about-title">
        <div className="about-brand-image">
          <Image
            src="/stitch-assets/original/room-living.jpg"
            alt="Contemporary living room furnished in a calm, natural style"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="about-brand-overlay" />
        <div className="simple-container about-brand-copy">
          <span className="simple-kicker">This is Musterring</span>
          <h1 id="about-title">You are at home.</h1>
          <p>Furniture should do more than fill a room. It should reflect your personality, support everyday life and make home feel unmistakably yours.</p>
          <div className="simple-actions">
            <StitchLinkButton href="/furniture">Discover furniture</StitchLinkButton>
            <StitchLinkButton variant="ghost" href="/dealers">Find a retailer</StitchLinkButton>
          </div>
        </div>
        <a className="about-scroll" href="#our-principle">
          Discover Musterring <ArrowDown size={17} />
        </a>
      </section>

      <nav className="about-section-nav" aria-label="About Musterring sections">
        <div className="simple-container">
          <a href="#our-principle">Our principle</a>
          <a href="#our-story">Our story</a>
          <a href="#ambassadors">Brand ambassadors</a>
          <a href="#responsibility">Responsibility</a>
        </div>
      </nav>

      <section className="about-intro" id="our-principle">
        <div className="simple-container about-intro-grid">
          <div>
            <span className="simple-kicker">The Musterring principle</span>
            <h2>Your way to furniture that fits you.</h2>
          </div>
          <div className="about-intro-copy">
            <p className="about-intro-lead">Every home is different. Musterring brings together broad planning possibilities and personal specialist advice so your furniture can be adapted to your ideas.</p>
            <p>From sofas and tables to wardrobes and living-room systems, colours, materials, dimensions and comfort features can be explored with a qualified retail partner.</p>
          </div>
        </div>
        <div className="simple-container public-value-grid about-principle-grid">
          {principles.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon aria-hidden="true" size={26} strokeWidth={1.5} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-editorial" aria-label="Musterring brand themes">
        <article className="about-editorial-row">
          <div className="about-editorial-image">
            <Image
              src="/musterring-catalog/justb-pm100/image-02.jpg"
              alt="Bright living room with a configurable Musterring sofa"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="about-editorial-copy">
            <span className="about-editorial-number">01</span>
            <span className="simple-kicker">Individuality</span>
            <h2>Designed around your life.</h2>
            <p>Different spaces and routines call for different solutions. Musterring collections offer room for personal decisions—from layout and size to surfaces, fabrics and comfort.</p>
            <Link className="simple-arrow-link" href="/room-composer">
              Start planning your room <ArrowRight size={18} />
            </Link>
          </div>
        </article>

        <article className="about-editorial-row about-editorial-row-reverse" id="our-story">
          <div className="about-editorial-image about-editorial-history-image">
            <div className="about-history-mark">
              <span>Since</span>
              <strong>1938</strong>
              <span>Rheda-Wiedenbrück</span>
            </div>
          </div>
          <div className="about-editorial-copy">
            <span className="about-editorial-number">02</span>
            <span className="simple-kicker">Home since 1938</span>
            <h2>Tradition with a view to the future.</h2>
            <p>Josef Höner’s founding idea was to connect design, manufacturing, retail and service under one shared brand. That collaborative principle continues to shape Musterring today.</p>
            <div className="about-fact-line">
              <Globe2 size={22} strokeWidth={1.5} />
              <span><strong>More than 25 countries</strong> form part of today’s international Musterring network.</span>
            </div>
          </div>
        </article>
      </section>

      <section className="about-timeline" aria-labelledby="history-title">
        <div className="simple-container">
          <header className="public-section-heading about-timeline-heading">
            <div>
              <span className="simple-kicker">Selected milestones</span>
              <h2 id="history-title">Lots of tradition. Lots of future.</h2>
            </div>
            <p>A concise view of the moments that shaped Musterring.</p>
          </header>
          <ol>
            {history.map((item) => (
              <li key={item.year}>
                <strong>{item.year}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-people" id="ambassadors">
        <div className="simple-container about-people-grid">
          <div className="about-people-copy">
            <span className="simple-kicker">Our brand ambassadors</span>
            <h2>Bettina Zimmermann &amp; Kai Wiesinger</h2>
            <p>The actor couple have represented Musterring since 2021. Bettina Zimmermann also developed the JustB! collection together with Musterring—bringing her personal design ideas into the range.</p>
            <Link className="simple-arrow-link" href="/search?q=JustB">
              Discover the JustB! collection <ArrowRight size={18} />
            </Link>
          </div>
          <blockquote>
            <Heart aria-hidden="true" size={26} strokeWidth={1.4} />
            <p>Home is personal. Good furniture should leave space for exactly that.</p>
          </blockquote>
        </div>
      </section>

      <section className="about-responsibility" id="responsibility">
        <div className="about-responsibility-image">
          <Image
            src="/musterring-catalog/freilicht/image-02.jpg"
            alt="Musterring outdoor furniture surrounded by greenery"
            fill
            sizes="(max-width: 800px) 100vw, 48vw"
          />
        </div>
        <div className="about-responsibility-copy">
          <span className="simple-kicker">Environmental responsibility</span>
          <h2>Sustainability is part of the tradition.</h2>
          <p>Musterring has supported reforestation in the Zittau municipal forest since 1992. Around 145,000 trees have been planted there to date.</p>
          <dl>
            <div><dt>145,000</dt><dd>Trees planted</dd></div>
            <div><dt>30+ years</dt><dd>Supporting reforestation</dd></div>
            <div><dt>1,450 t</dt><dd>CO₂ bound per year</dd></div>
          </dl>
        </div>
      </section>

      <section className="public-cta">
        <div className="simple-container public-cta-inner">
          <div>
            <span className="simple-kicker">Your home starts here</span>
            <h2>Let’s find what feels right.</h2>
          </div>
          <div className="public-cta-actions">
            <Link href="/furniture">Explore furniture <ArrowRight size={18} /></Link>
            <Link href="/contact">Contact Musterring <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

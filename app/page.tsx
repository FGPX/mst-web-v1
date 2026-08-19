import Image from "@/components/HighQualityImage";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FolderOpen,
  Heart,
  Leaf,
  MapPin,
  Ruler,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { StitchLinkButton } from "@/components/stitch/StitchButtons";

const quickStarts = [
  {
    number: "01",
    icon: Search,
    title: "Intelligent Search",
    text: "Search by product, style or size and compare suitable models.",
    href: "/search",
    action: "Start search"
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Interior Stylist",
    text: "Answer a short room-specific questionnaire and receive focused Musterring catalogue recommendations.",
    href: "/ai-stylist",
    action: "Style your room"
  },
  {
    number: "03",
    icon: Ruler,
    title: "Plan a room",
    text: "Arrange products in your room and check measurements step by step.",
    href: "/room-composer",
    action: "Plan your room"
  },
  {
    number: "04",
    icon: FolderOpen,
    title: "Open a project",
    text: "Continue saved selections, configurations and notes in one place.",
    href: "/my-musterring",
    action: "Go to My Musterring"
  }
];

const rooms = [
  { name: "Living room", href: "/inspiration/rooms#living-room", image: "/stitch-assets/original/room-living-clean.jpg" },
  { name: "Dining room", href: "/inspiration/rooms#dining-room", image: "/stitch-assets/original/room-dining-hq.jpg" },
  { name: "Bedroom", href: "/inspiration/rooms#bedroom", image: "/stitch-assets/original/room-bedroom-hq.jpg" }
];

export default function HomePage() {
  return (
    <div className="simple-home">
      <section className="simple-hero" aria-labelledby="home-heading">
        <div className="simple-hero-inner">
          <div className="simple-hero-copy">
            <span className="simple-kicker">Furniture made personal</span>
            <h1 id="home-heading">Your home.<br />Planned simply.</h1>
            <p>Discover furniture, see what works in your room and prepare everything for a personal consultation.</p>
            <div className="simple-actions">
              <StitchLinkButton href="/furniture">Discover furniture</StitchLinkButton>
              <StitchLinkButton variant="ghost" href="/room-composer">Start planning</StitchLinkButton>
            </div>
          </div>
          <div className="simple-hero-visual">
            <Image
              src="/musterring-catalog/justb-pm100/image-01.jpg"
              alt="Bright living room furnished with a Musterring sofa"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 58vw"
            />
          </div>
        </div>
        <div className="simple-hero-benefits">
          <span><Check size={15} /> Explore</span>
          <span><Check size={15} /> Plan</span>
          <span><Check size={15} /> Consult locally</span>
        </div>
      </section>

      <section className="simple-start" aria-labelledby="start-heading">
        <div className="simple-container">
          <header className="simple-section-head">
            <div>
              <span className="simple-kicker">Start here</span>
              <h2 id="start-heading">What would you like to do?</h2>
            </div>
            <p>Choose the path that fits your task. Each tool guides you clearly through the next step.</p>
          </header>
          <div className="simple-start-grid">
            {quickStarts.map(({ number, icon: Icon, title, text, href, action }) => (
              <Link className="simple-start-card" href={href} key={title}>
                <span className="simple-card-number">{number}</span>
                <Icon aria-hidden="true" size={28} strokeWidth={1.6} />
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="simple-card-action">{action} <ArrowRight size={17} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="simple-assistant" aria-labelledby="assistant-heading">
        <div className="simple-container simple-assistant-inner">
          <div className="simple-assistant-icon" aria-hidden="true"><Sparkles size={30} /></div>
          <div>
            <span className="simple-kicker">Quick product search</span>
            <h2 id="assistant-heading">Describe it instead of filtering.</h2>
            <p>For example: “Beige sofa, maximum width 240 cm, with soft cushioning.”</p>
          </div>
          <Link className="simple-arrow-link" href="/search?q=beige sofa maximum width 240 cm with soft cushioning">
            Open intelligent search <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="simple-rooms" aria-labelledby="rooms-heading">
        <div className="simple-container">
          <header className="simple-section-head simple-section-head-inline">
            <div>
              <span className="simple-kicker">Inspiration by room</span>
              <h2 id="rooms-heading">One room. Clear possibilities.</h2>
            </div>
            <Link className="simple-arrow-link" href="/inspiration/rooms">View all rooms <ArrowRight size={18} /></Link>
          </header>
          <div className="simple-room-grid">
            {rooms.map((room) => (
              <Link className="simple-room-card" href={room.href} key={room.name}>
                <div className="simple-room-image">
                  <Image src={room.image} alt={`${room.name} with Musterring furniture`} fill sizes="(max-width: 760px) 100vw, 33vw" />
                </div>
                <span>{room.name}</span>
                <ArrowRight aria-hidden="true" size={20} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="simple-process" aria-labelledby="process-heading">
        <div className="simple-container simple-process-grid">
          <div className="simple-process-image">
            <Image src="/stitch-assets/original/room-living-clean.jpg" alt="Digitally planned living room" fill sizes="(max-width: 760px) 100vw, 50vw" />
          </div>
          <div className="simple-process-copy">
            <span className="simple-kicker">From idea to consultation</span>
            <h2 id="process-heading">Three clear steps to a complete project.</h2>
            <ol>
              <li><span>1</span><div><strong>Choose</strong><p>Discover and compare products.</p></div></li>
              <li><span>2</span><div><strong>Plan</strong><p>Keep measurements, options and room ideas together.</p></div></li>
              <li><span>3</span><div><strong>Consult</strong><p>Hand the prepared project to a retailer.</p></div></li>
            </ol>
            <div className="simple-actions">
              <StitchLinkButton href="/room-composer">Start a project</StitchLinkButton>
              <StitchLinkButton variant="ghost" href="/handover">View handover</StitchLinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="simple-quality" aria-labelledby="quality-heading">
        <div className="simple-container">
          <header className="simple-quality-head">
            <span className="simple-kicker">Musterring quality</span>
            <h2 id="quality-heading">Reliable planning. Personal advice.</h2>
          </header>
          <div className="simple-quality-grid">
            <article><ShieldCheck size={25} /><strong>Validated details</strong><p>Advice is grounded in available product and configuration data.</p></article>
            <article><Ruler size={25} /><strong>Measurements in view</strong><p>Dimensions and planning notes remain clear throughout the project.</p></article>
            <article><Heart size={25} /><strong>Personal support</strong><p>Your retailer takes over where personal consultation matters most.</p></article>
            <article><Leaf size={25} /><strong>Considered choices</strong><p>Material information supports a selection designed to last.</p></article>
          </div>
        </div>
      </section>

      <section className="simple-about" aria-labelledby="about-heading">
        <div className="simple-container simple-about-grid">
          <div className="simple-about-copy">
            <span className="simple-kicker">About Musterring</span>
            <h2 id="about-heading">Furniture for homes with character.</h2>
            <p>Since 1938, Musterring has combined considered design, quality materials and individual planning possibilities.</p>
            <Link className="simple-arrow-link" href="/about">
              Discover the Musterring story <ArrowRight size={18} />
            </Link>
          </div>
          <div className="simple-about-values" aria-label="Musterring values">
            <div><strong>1938</strong><span>The Musterring story begins</span></div>
            <div><strong>Quality</strong><span>Products made for lasting enjoyment</span></div>
            <div><strong>Individual</strong><span>Choices for your way of living</span></div>
          </div>
        </div>
      </section>

      <section className="simple-retailer" aria-labelledby="retailer-heading">
        <div className="simple-container simple-retailer-inner">
          <MapPin aria-hidden="true" size={28} />
          <div>
            <span className="simple-kicker">Personal advice nearby</span>
            <h2 id="retailer-heading">Find a retailer near you.</h2>
            <p>Take your selection and room plan directly to a Musterring retail partner.</p>
          </div>
          <StitchLinkButton href="/dealers">Find a retailer</StitchLinkButton>
        </div>
      </section>
    </div>
  );
}

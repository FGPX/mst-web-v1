import Link from "next/link";
import { ArrowRight, Globe2, Mail, Share2 } from "lucide-react";
import { disclaimer } from "@/lib/data";

export function StitchFooter() {
  return (
    <footer className="stitch-footer">
      <div className="stitch-footer-grid">
        <div className="stitch-footer-brand">
          <span className="stitch-footer-logo">Musterring</span>
          <p>Quality that lasts. Furniture and interior solutions for a home that feels like yours.</p>
          <p className="stitch-disclaimer">{disclaimer}</p>
          <div className="stitch-footer-icons" aria-label="Service links">
            <Link href="/dealers" aria-label="Find a retailer"><Globe2 size={21} /></Link>
            <Link href="/my-musterring" aria-label="Share project"><Share2 size={21} /></Link>
            <Link href="/handover" aria-label="Contact a retailer"><Mail size={21} /></Link>
          </div>
        </div>
        <div>
          <span className="stitch-footer-label">Musterring</span>
          <ul>
            <li><Link href="/about">About Musterring</Link></li>
            <li><Link href="/inspiration/rooms">Inspiration</Link></li>
            <li><Link href="/materials">Materials</Link></li>
            <li><Link href="/furniture">Furniture</Link></li>
            <li><Link href="/contact">Contact us</Link></li>
          </ul>
        </div>
        <div>
          <span className="stitch-footer-label">Planning &amp; service</span>
          <ul>
            <li><Link href="/search">Product search</Link></li>
            <li><Link href="/room-composer/upload">Room Visualizer</Link></li>
            <li><Link href="/my-musterring">My Musterring</Link></li>
            <li><Link href="/handover">Project handover</Link></li>
            <li><Link href="/dealers">Find a retailer</Link></li>
            <li><Link href="/dealer-ai-assistant">Dealer AI Assistant</Link></li>
            <li><Link href="/analytics">Analytics overview</Link></li>
            <li><Link href="/partner/login">Partner Portal</Link></li>
          </ul>
        </div>
        <div className="stitch-newsletter">
          <span className="stitch-footer-label">Inspiration by email</span>
          <p>New interior ideas and selected collections delivered to your inbox.</p>
          <form>
            <input aria-label="Email address" placeholder="Your email address" type="email" />
            <button aria-label="Subscribe" type="submit"><ArrowRight size={20} /></button>
          </form>
        </div>
        <div className="stitch-footer-bottom">
          <span>© 2027 Musterring. Quality that lasts.</span>
          <div>
            <Link href="/privacy">Imprint</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/privacy">Cookie settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

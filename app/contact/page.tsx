import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { StitchLinkButton } from "@/components/stitch/StitchButtons";

export const metadata: Metadata = {
  title: "Contact Musterring | Find the right support",
  description: "Find the right Musterring contact for product advice, an existing purchase, retail partnership or a general enquiry."
};

export default function ContactPage() {
  return (
    <div className="public-page contact-page">
      <section className="contact-intro">
        <div className="simple-container contact-intro-grid">
          <div>
            <span className="simple-kicker">Contact Musterring</span>
            <h1>How can we help?</h1>
          </div>
          <p>Choose the subject that best matches your question. This helps you reach the right contact without unnecessary steps.</p>
        </div>
      </section>

      <section className="contact-paths" aria-label="Contact options">
        <div className="simple-container contact-path-grid">
          <article className="contact-path contact-path-featured">
            <ShoppingBag aria-hidden="true" size={27} strokeWidth={1.5} />
            <span className="simple-kicker">Before you buy</span>
            <h2>Product and planning advice</h2>
            <p>A local Musterring retailer can advise on products, options, planning and the next steps for your room.</p>
            <StitchLinkButton href="/dealers">Find a retailer</StitchLinkButton>
          </article>
          <article className="contact-path">
            <Building2 aria-hidden="true" size={27} strokeWidth={1.5} />
            <span className="simple-kicker">Existing purchase</span>
            <h2>Order or service question</h2>
            <p>Please contact the retailer where you purchased your furniture. They hold the details connected to your order.</p>
            <Link href="/dealers">Find retailer details <ArrowRight size={17} /></Link>
          </article>
          <article className="contact-path">
            <Mail aria-hidden="true" size={27} strokeWidth={1.5} />
            <span className="simple-kicker">Project prepared</span>
            <h2>Share your project</h2>
            <p>Send your saved selection, room notes and configuration details to a retail partner for consultation.</p>
            <Link href="/handover">Prepare handover <ArrowRight size={17} /></Link>
          </article>
        </div>
      </section>

      <section className="contact-details" aria-labelledby="details-heading">
        <div className="simple-container contact-details-grid">
          <div>
            <span className="simple-kicker">General enquiries</span>
            <h2 id="details-heading">Musterring service contact</h2>
            <p>Available Monday to Friday, 08:00–17:00.</p>
          </div>
          <address>
            <a href="tel:+495242592260"><Phone size={19} /> +49 5242 592 260</a>
            <a href="mailto:service@musterring.de"><Mail size={19} /> service@musterring.de</a>
          </address>
          <div className="contact-address">
            <MapPin aria-hidden="true" size={21} />
            <p><strong>Musterring International</strong><br />Josef Höner GmbH &amp; Co. KG<br />Hauptstraße 134–140<br />33378 Rheda-Wiedenbrück, Germany</p>
          </div>
        </div>
      </section>

      <section className="contact-partner-note">
        <div className="simple-container">
          <span>Are you a Musterring retail partner?</span>
          <Link href="/partner/login">Open the Partner Portal <ArrowRight size={17} /></Link>
        </div>
      </section>
    </div>
  );
}

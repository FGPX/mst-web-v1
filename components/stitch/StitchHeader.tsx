"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { StitchLinkButton } from "./StitchButtons";

export function StitchHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header className="stitch-header" role="banner">
      <nav className="stitch-nav" aria-label="Primary">
        <Link className="stitch-brand" href="/">
          <span className="stitch-brand-mark" aria-hidden="true">M</span>
          <span>Musterring</span>
        </Link>
        <div className="stitch-nav-links">
          <Link className={active("/furniture") ? "is-active" : ""} href="/furniture">Furniture</Link>
          <Link className={active("/inspiration/rooms") ? "is-active" : ""} href="/inspiration/rooms">Rooms</Link>
          <Link className={active("/room-composer") ? "is-active" : ""} href="/room-composer">Plan a Room</Link>
          <Link className={active("/about") ? "is-active" : ""} href="/about">About</Link>
          <Link className={active("/contact") ? "is-active" : ""} href="/contact">Contact</Link>
        </div>
        <div className="stitch-nav-actions">
          <Link className="stitch-partner-entry" href="/partner/login">Partner Portal</Link>
          <Link className="stitch-project-entry" href="/my-musterring">My Project</Link>
          <Link href="/search" aria-label="Search"><Search size={21} strokeWidth={1.6} /></Link>
          <StitchLinkButton variant="primary" href="/dealers">Find a Retailer</StitchLinkButton>
          <button className="stitch-mobile-menu" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>{open ? <X size={24} strokeWidth={1.6} /> : <Menu size={24} strokeWidth={1.6} />}</button>
        </div>
      </nav>
      <div className={`stitch-mobile-panel ${open ? "is-open" : ""}`} id="mobile-navigation">
        <Link href="/furniture" onClick={close}>Furniture</Link>
        <Link href="/inspiration/rooms" onClick={close}>Rooms</Link>
        <Link href="/room-composer" onClick={close}>Plan a Room</Link>
        <Link href="/my-musterring" onClick={close}>My Project</Link>
        <Link href="/materials" onClick={close}>Materials</Link>
        <Link href="/visual-search" onClick={close}>Visual Search</Link>
        <Link href="/comfort-match" onClick={close}>Advice</Link>
        <Link href="/about" onClick={close}>About Musterring</Link>
        <Link href="/contact" onClick={close}>Contact us</Link>
        <Link href="/search" onClick={close}>Search</Link>
        <Link href="/dealers" onClick={close}>Find a Retailer</Link>
        <Link href="/partner/login" onClick={close}>Partner Portal</Link>
      </div>
    </header>
  );
}

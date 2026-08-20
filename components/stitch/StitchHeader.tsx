"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bath,
  BedDouble,
  ChevronDown,
  ChevronRight,
  CookingPot,
  LampFloor,
  Menu,
  Search,
  Sofa,
  SwatchBook,
  Trees,
  UtensilsCrossed,
  X,
  type LucideIcon
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { categoryDetails, categoryGroups } from "@/lib/catalog-taxonomy";
import { StitchLinkButton } from "./StitchButtons";
import musterringLogo from "../../Logo_MST png.png";

const categoryGroupIcons: Record<string, LucideIcon> = {
  "Living Room": Sofa,
  Bedroom: BedDouble,
  "Dining Room": UtensilsCrossed,
  Bathroom: Bath,
  Kitchen: CookingPot,
  Outdoor: Trees,
  "Home Accessories": LampFloor
};

export function StitchHeader() {
  const [open, setOpen] = useState(false);
  const [furnitureOpen, setFurnitureOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const close = () => {
    setOpen(false);
    setFurnitureOpen(false);
  };
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setOpen(false);
    setFurnitureOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!furnitureOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setFurnitureOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFurnitureOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [furnitureOpen]);

  return (
    <header className="stitch-header" role="banner" ref={headerRef}>
      <nav className="stitch-nav" aria-label="Primary">
        <Link className="stitch-brand" href="/" aria-label="Musterring home">
          <Image className="stitch-brand-logo" src={musterringLogo} alt="" width={2982} height={3750} priority />
        </Link>
        <div className="stitch-nav-links">
          <button
            className={`stitch-furniture-trigger ${active("/furniture") || active("/materials") ? "is-active" : ""}`}
            type="button"
            aria-expanded={furnitureOpen}
            aria-controls="furniture-mega-menu"
            onClick={() => setFurnitureOpen((value) => !value)}
          >
            Furniture <ChevronDown size={14} aria-hidden="true" />
          </button>
          <Link className={pathname === "/room-composer/upload" ? "is-active" : ""} href="/room-composer/upload">Room Visualizer</Link>
          <Link className={active("/ai-stylist") ? "is-active" : ""} href="/ai-stylist">Style Finder</Link>
          <Link className={active("/about") ? "is-active" : ""} href="/about">About</Link>
          <Link className={active("/contact") ? "is-active" : ""} href="/contact">Contact</Link>
          <Link className="stitch-partner-entry" href="/partner/login">Partner Portal</Link>
          <Link className="stitch-project-entry" href="/my-musterring">My Project</Link>
        </div>
        <div className="stitch-nav-actions">
          <Link className="stitch-search-entry" href="/search" aria-label="Search"><Search size={21} strokeWidth={1.6} /></Link>
          <StitchLinkButton variant="primary" href="/dealers">Find a Retailer</StitchLinkButton>
          <button className="stitch-mobile-menu" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => { setFurnitureOpen(false); setOpen((value) => !value); }}>{open ? <X size={24} strokeWidth={1.6} /> : <Menu size={24} strokeWidth={1.6} />}</button>
        </div>
      </nav>
      <div className={`stitch-furniture-mega ${furnitureOpen ? "is-open" : ""}`} id="furniture-mega-menu">
        <div className="stitch-furniture-mega-inner">
          <div className="stitch-furniture-mega-intro">
            <span>Product catalogue</span>
            <h2>Furniture for every room.</h2>
            <p>Browse all connected Musterring collections by room and product type.</p>
            <Link href="/furniture" onClick={close}>View all furniture <ChevronRight size={16} /></Link>
          </div>
          <div className="stitch-furniture-mega-groups">
            {categoryGroups.map((group) => {
              const GroupIcon = categoryGroupIcons[group.name];
              return <section key={group.name}>
                <h3><GroupIcon aria-hidden="true" />{group.name}</h3>
                {group.categories.map((category) => (
                  <Link href={`/furniture?category=${category}`} key={category} onClick={close}>
                    {categoryDetails[category].label}
                  </Link>
                ))}
              </section>;
            })}
            <section>
              <h3><SwatchBook aria-hidden="true" />Materials &amp; finishes</h3>
              <Link href="/materials" onClick={close}>Materials</Link>
            </section>
          </div>
        </div>
      </div>
      <div className={`stitch-mobile-panel ${open ? "is-open" : ""}`} id="mobile-navigation">
        <details className="stitch-mobile-furniture">
          <summary>Furniture <ChevronDown size={16} /></summary>
          <Link href="/furniture" onClick={close}>All furniture</Link>
          {categoryGroups.map((group) => (
            <div key={group.name}>
              <span>{group.name}</span>
              {group.categories.map((category) => (
                <Link href={`/furniture?category=${category}`} key={category} onClick={close}>{categoryDetails[category].label}</Link>
              ))}
            </div>
          ))}
          <div>
            <span>Materials &amp; finishes</span>
            <Link href="/materials" onClick={close}>Materials</Link>
          </div>
        </details>
        <Link href="/room-composer/upload" onClick={close}>Room Visualizer</Link>
        <Link href="/ai-stylist" onClick={close}>Style Finder</Link>
        <Link href="/my-musterring" onClick={close}>My Project</Link>
        <Link href="/search#visual-search" onClick={close}>Visual Search</Link>
        <Link href="/comfort-match" onClick={close}>Advice</Link>
        <Link href="/about" onClick={close}>About Musterring</Link>
        <Link href="/contact" onClick={close}>Contact us</Link>
        <Link href="/search" onClick={close}>Search</Link>
        <Link href="/dealers" onClick={close}>Find a Retailer</Link>
        <Link href="/partner/login" onClick={close}>Partner Portal</Link>
        <Link href="/analytics" onClick={close}>Website Analytics</Link>
      </div>
    </header>
  );
}

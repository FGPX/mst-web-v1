"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ChevronRight,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  PanelLeftClose,
  Search,
  Settings,
  ShoppingCart,
  Users,
  X
} from "lucide-react";
import { useState } from "react";

const sections = [
  { href: "/partner", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/partner/projects", label: "Customer Projects", icon: FolderKanban },
  { href: "/partner/products", label: "Products", icon: Boxes },
  { href: "/partner/configurator", label: "Configurator", icon: Settings },
  { href: "/partner/quotes", label: "Quotes", icon: FileText },
  { href: "/partner/orders", label: "Orders", icon: ShoppingCart },
  { href: "/partner/resources", label: "Resources", icon: PackageCheck }
];

export function PartnerShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="partner-app">
      <aside className={`partner-sidebar ${open ? "is-open" : ""}`}>
        <div className="partner-sidebar-brand">
          <Link href="/partner"><span aria-hidden="true">M</span><strong>Musterring</strong><small>Partner Workspace</small></Link>
          <button type="button" aria-label="Close partner navigation" onClick={() => setOpen(false)}><PanelLeftClose /></button>
        </div>
        <nav aria-label="Partner workspace">
          <p>Workspace</p>
          {sections.map(({ href, label, icon: Icon, exact }) => (
            <Link className={active(href, exact) ? "is-active" : ""} href={href} key={href} onClick={() => setOpen(false)}>
              <Icon size={19} /><span>{label}</span><ChevronRight size={15} />
            </Link>
          ))}
        </nav>
        <div className="partner-sidebar-support">
          <Users size={20} />
          <strong>Need assistance?</strong>
          <p>Use the support route before submitting commercial changes.</p>
          <Link href="/partner/resources">Open support</Link>
        </div>
        <form action="/api/partner/logout" method="post">
          <button type="submit"><LogOut size={17} /> Sign out</button>
        </form>
      </aside>

      <div className="partner-workspace">
        <header className="partner-topbar">
          <button className="partner-menu-trigger" type="button" aria-label={open ? "Close partner navigation" : "Open partner navigation"} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
          <Link className="partner-global-search" href="/partner/products"><Search size={18} /><span>Search products, codes and projects</span></Link>
          <div className="partner-account"><span>{email.slice(0, 1).toUpperCase()}</span><div><strong>Partner account</strong><small>{email}</small></div></div>
        </header>
        <main id="partner-main" className="partner-content">{children}</main>
      </div>
    </div>
  );
}

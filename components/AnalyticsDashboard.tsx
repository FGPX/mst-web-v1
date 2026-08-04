"use client";

import Link from "next/link";
import { BarChart3, Eye, PackageSearch, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";
import { storage } from "@/lib/persistence";
import type { AnalyticsEvent } from "@/lib/types";

type RankedItem = { id: string; label: string; count: number; href?: string };

function rank(values: Array<{ id: string; label: string; href?: string }>): RankedItem[] {
  const counts = new Map<string, RankedItem>();
  values.forEach((value) => {
    const current = counts.get(value.id);
    counts.set(value.id, { ...value, count: (current?.count ?? 0) + 1 });
  });
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

export function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setEvents(storage.events());
    setConsent(storage.consent());
  }, []);

  const pageViews = useMemo(() => events.filter((event) => event.name === "page_viewed"), [events]);
  const visitors = useMemo(() => new Set(pageViews.map((event) => event.sessionId)).size, [pageViews]);
  const pages = useMemo(() => rank(pageViews.map((event) => ({ id: event.route || "/", label: event.route || "/", href: event.route || "/" }))), [pageViews]);
  const viewedProducts = useMemo(() => rank(events.filter((event) => event.name === "product_viewed" && event.productId).map((event) => {
    const product = products.find((item) => item.id === event.productId);
    return { id: event.productId!, label: product?.name ?? event.productId!, href: product ? `/furniture/${product.slug}` : undefined };
  })), [events]);
  const maxPage = pages[0]?.count || 1;
  const maxProduct = viewedProducts[0]?.count || 1;

  return (
    <div className="analytics-view">
      <header className="container analytics-head">
        <div><p className="eyebrow">B2B performance</p><h1>Website analytics.</h1><p>See how often the website is visited and which products receive the most attention.</p></div>
        <Link href="/my-musterring">Back to My Project</Link>
      </header>
      <div className="container">
        {!consent ? <section className="analytics-notice"><strong>Analytics is currently disabled.</strong><span>Allow optional analytics in the privacy banner to start recording visits. Existing privacy choices are respected.</span></section> : null}
        <section className="analytics-kpis">
          <article><Eye /><span>Total page views</span><strong>{pageViews.length}</strong></article>
          <article><Users /><span>Visitors / sessions</span><strong>{visitors}</strong></article>
          <article><PackageSearch /><span>Product views</span><strong>{viewedProducts.reduce((total, item) => total + item.count, 0)}</strong></article>
          <article><BarChart3 /><span>Tracked events</span><strong>{events.length}</strong></article>
        </section>
        <section className="analytics-grid">
          <article className="analytics-panel"><div><p className="eyebrow">Traffic</p><h2>Most visited pages</h2></div>{pages.length ? <ol>{pages.slice(0, 10).map((item) => <li key={item.id}><Link href={item.href || "/"}><span>{item.label}</span><i><b style={{ width: `${Math.max(8, item.count / maxPage * 100)}%` }} /></i><strong>{item.count}</strong></Link></li>)}</ol> : <p className="analytics-empty">No page visits recorded yet.</p>}</article>
          <article className="analytics-panel"><div><p className="eyebrow">Catalogue interest</p><h2>Most viewed products</h2></div>{viewedProducts.length ? <ol>{viewedProducts.slice(0, 10).map((item) => <li key={item.id}>{item.href ? <Link href={item.href}><span>{item.label}</span><i><b style={{ width: `${Math.max(8, item.count / maxProduct * 100)}%` }} /></i><strong>{item.count}</strong></Link> : <div><span>{item.label}</span><i><b style={{ width: `${Math.max(8, item.count / maxProduct * 100)}%` }} /></i><strong>{item.count}</strong></div>}</li>)}</ol> : <p className="analytics-empty">Product visits will appear after a product detail page is opened.</p>}</article>
        </section>
        <p className="analytics-footnote">This prototype stores analytics only in this browser. Production-wide reporting requires a shared analytics service.</p>
      </div>
    </div>
  );
}

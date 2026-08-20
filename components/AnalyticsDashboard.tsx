"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BarChart3, CalendarDays, Download, Eye, Globe2, MousePointerClick, PackageSearch, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";
import { storage } from "@/lib/persistence";
import type { AnalyticsEvent } from "@/lib/types";

type RankedItem = { id: string; label: string; count: number; href?: string };
type RangeKey = "7" | "30" | "90" | "all";

const rangeLabels: Record<RangeKey, string> = { "7": "Last 7 days", "30": "Last 30 days", "90": "Last 90 days", all: "All time" };
const eventLabels: Record<string, string> = {
  page_viewed: "Page views", product_viewed: "Product views", search_result_clicked: "Product clicks",
  filter_applied: "Filters applied", comparison_opened: "Comparisons", configurator_started: "Configurator starts",
  configuration_completed: "Configurations saved", chatbot_opened: "Advisor opens",
  chatbot_question_submitted: "Advisor questions", lead_started: "Retailer enquiries",
  lead_submitted: "Leads submitted", appointment_booked: "Appointments booked"
};

function rank(values: Array<{ id: string; label: string; href?: string }>): RankedItem[] {
  const counts = new Map<string, RankedItem>();
  values.forEach((value) => {
    const current = counts.get(value.id);
    counts.set(value.id, { ...value, count: (current?.count ?? 0) + 1 });
  });
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

function regionFromLocale(locale: string) {
  try { return new Intl.Locale(locale).maximize().region || "Unknown"; } catch { return "Unknown"; }
}

function regionName(code: string) {
  if (code === "Unknown") return code;
  try { return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code; } catch { return code; }
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("en", { notation: value >= 1000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

function productImage(productId: string) {
  return products.find((product) => product.id === productId)?.imageAssets[0];
}

export function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [consent, setConsent] = useState(false);
  const [range, setRange] = useState<RangeKey>("30");

  useEffect(() => {
    const refresh = () => { setEvents(storage.events()); setConsent(storage.consent()); };
    refresh();
    window.addEventListener("musterring:analytics-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("musterring:analytics-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (range === "all") return events;
    const from = Date.now() - Number(range) * 86400000;
    return events.filter((event) => new Date(event.timestamp).getTime() >= from);
  }, [events, range]);
  const pageViews = useMemo(() => filteredEvents.filter((event) => event.name === "page_viewed"), [filteredEvents]);
  const visitors = useMemo(() => new Set(filteredEvents.map((event) => event.sessionId)).size, [filteredEvents]);
  const productViewEvents = useMemo(() => filteredEvents.filter((event) => event.name === "product_viewed" && event.productId), [filteredEvents]);
  const pages = useMemo(() => rank(pageViews.map((event) => ({ id: event.route || "/", label: event.route || "/", href: event.route || "/" }))), [pageViews]);
  const viewedProducts = useMemo(() => rank(productViewEvents.map((event) => {
    const product = products.find((item) => item.id === event.productId);
    return { id: event.productId!, label: product?.name ?? event.productId!, href: product ? `/furniture/${product.slug}` : undefined };
  })), [productViewEvents]);
  const regions = useMemo(() => {
    const uniqueSessions = new Map<string, { id: string; label: string }>();
    filteredEvents.forEach((event) => {
      const code = regionFromLocale(event.locale);
      uniqueSessions.set(`${event.sessionId}:${code}`, { id: code, label: regionName(code) });
    });
    return rank([...uniqueSessions.values()]);
  }, [filteredEvents]);
  const eventMix = useMemo(() => rank(filteredEvents.map((event) => ({ id: event.name, label: eventLabels[event.name] ?? event.name.replaceAll("_", " ") }))), [filteredEvents]);

  const series = useMemo(() => {
    const days = range === "7" ? 7 : range === "90" || range === "all" ? 14 : 10;
    const earliest = filteredEvents.length ? Math.min(...filteredEvents.map((event) => new Date(event.timestamp).getTime())) : Date.now();
    const allTimeDays = Math.max(1, Math.ceil((Date.now() - earliest) / 86400000));
    const bucketDays = range === "all" ? Math.max(1, Math.ceil(allTimeDays / days)) : range === "90" ? 7 : Math.max(1, Math.ceil(Number(range) / days));
    const now = new Date(); now.setHours(23, 59, 59, 999);
    return Array.from({ length: days }, (_, index) => {
      const end = new Date(now.getTime() - (days - index - 1) * bucketDays * 86400000);
      const start = new Date(end.getTime() - bucketDays * 86400000 + 1);
      const items = filteredEvents.filter((event) => { const time = new Date(event.timestamp).getTime(); return time >= start.getTime() && time <= end.getTime(); });
      return { label: end.toLocaleDateString("en", { day: "2-digit", month: "short" }), views: items.filter((event) => event.name === "page_viewed").length, sessions: new Set(items.map((event) => event.sessionId)).size };
    });
  }, [filteredEvents, range]);

  const maxTrend = Math.max(1, ...series.map((item) => Math.max(item.views, item.sessions)));
  const averagePages = visitors ? pageViews.length / visitors : 0;
  const engagementRate = pageViews.length ? Math.round(productViewEvents.length / pageViews.length * 100) : 0;

  function exportData() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(filteredEvents, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `musterring-analytics-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
  }

  function enableAnalytics() {
    if (!window.confirm("Enable anonymous analytics in this browser? Product visits and website interactions will begin recording after confirmation.")) return;
    storage.setConsent(true);
  }

  return (
    <div className="analytics-view">
      <header className="container analytics-head">
        <div><p className="eyebrow">Digital performance</p><h1>Analytics overview</h1><p>Understand your audience, discover the products that attract attention and follow every important customer interaction.</p></div>
        <Link href="/my-musterring">Back to My Project <ArrowUpRight size={15} /></Link>
      </header>

      <div className="container analytics-shell">
        <div className="analytics-toolbar">
          <div className="analytics-period" aria-label="Analytics date range"><CalendarDays size={17} aria-hidden="true" />{(Object.keys(rangeLabels) as RangeKey[]).map((key) => <button key={key} className={range === key ? "active" : ""} onClick={() => setRange(key)}>{rangeLabels[key]}</button>)}</div>
          <button className="analytics-export" onClick={exportData} disabled={!filteredEvents.length}><Download size={16} /> Export data</button>
        </div>

        {!consent ? <section className="analytics-notice"><span className="analytics-notice-icon"><BarChart3 size={22} /></span><div><strong>Analytics is currently paused</strong><span>Enable optional analytics to start collecting product visits and website interactions. Your existing privacy choice is fully respected.</span></div><button className="analytics-enable" onClick={enableAnalytics}>Enable analytics</button></section> : <div className="analytics-collecting"><span /> Live data collection is active</div>}

        <section className="analytics-kpis" aria-label="Key performance indicators">
          <article><span className="analytics-kpi-icon"><Eye /></span><div><span>Page views</span><strong>{formatCompact(pageViews.length)}</strong><small>Across {pages.length} {pages.length === 1 ? "page" : "pages"}</small></div></article>
          <article><span className="analytics-kpi-icon"><Users /></span><div><span>Visitors</span><strong>{formatCompact(visitors)}</strong><small>Unique browser sessions</small></div></article>
          <article><span className="analytics-kpi-icon"><PackageSearch /></span><div><span>Product views</span><strong>{formatCompact(productViewEvents.length)}</strong><small>{engagementRate}% of page views</small></div></article>
          <article><span className="analytics-kpi-icon"><MousePointerClick /></span><div><span>Views / visitor</span><strong>{averagePages.toFixed(1)}</strong><small>{formatCompact(filteredEvents.length)} tracked interactions</small></div></article>
        </section>

        <section className="analytics-panel analytics-trend-panel">
          <div className="analytics-panel-head"><div><p className="eyebrow">Traffic trend</p><h2>Audience activity</h2></div><div className="analytics-legend"><span><i className="views" /> Page views</span><span><i className="sessions" /> Visitors</span></div></div>
          {pageViews.length ? <div className="analytics-chart" role="img" aria-label="Page views and visitors over time"><div className="analytics-chart-grid"><span /><span /><span /><span /></div>{series.map((item) => <div className="analytics-chart-day" key={item.label} title={`${item.label}: ${item.views} page views, ${item.sessions} visitors`}><div className="analytics-bars"><i style={{ height: `${Math.max(item.views ? 8 : 0, item.views / maxTrend * 100)}%` }} /><b style={{ height: `${Math.max(item.sessions ? 8 : 0, item.sessions / maxTrend * 100)}%` }} /></div><span>{item.label}</span></div>)}</div> : <EmptyState icon={<BarChart3 />} title="Your traffic trend will appear here" text="As soon as analytics records visits, this chart will show activity over time." />}
        </section>

        <section className="analytics-grid analytics-grid-primary">
          <article className="analytics-panel analytics-products-panel">
            <div className="analytics-panel-head"><div><p className="eyebrow">Catalogue interest</p><h2>Most viewed products</h2></div><PackageSearch /></div>
            {viewedProducts.length ? <ol className="analytics-product-list">{viewedProducts.slice(0, 5).map((item, index) => <li key={item.id}>{item.href ? <Link href={item.href}><span className="analytics-rank">{String(index + 1).padStart(2, "0")}</span>{productImage(item.id) ? <Image src={productImage(item.id)!} alt="" width={76} height={58} /> : <span className="analytics-product-placeholder"><PackageSearch /></span>}<span className="analytics-product-name"><strong>{item.label}</strong><small>{item.count} {item.count === 1 ? "view" : "views"}</small></span><ArrowUpRight /></Link> : <div><span className="analytics-rank">{String(index + 1).padStart(2, "0")}</span><span className="analytics-product-placeholder"><PackageSearch /></span><span className="analytics-product-name"><strong>{item.label}</strong><small>{item.count} views</small></span></div>}</li>)}</ol> : <EmptyState icon={<PackageSearch />} title="No product views yet" text="Products will be ranked here after their detail pages are visited." />}
          </article>
          <article className="analytics-panel"><div className="analytics-panel-head"><div><p className="eyebrow">Traffic</p><h2>Top pages</h2></div><Eye /></div>{pages.length ? <RankList items={pages.slice(0, 6)} max={pages[0]?.count || 1} /> : <EmptyState icon={<Eye />} title="No page visits yet" text="Your most popular pages will appear here once visits are recorded." />}</article>
        </section>

        <section className="analytics-grid analytics-grid-secondary">
          <article className="analytics-panel"><div className="analytics-panel-head"><div><p className="eyebrow">Audience</p><h2>Visitors by region</h2></div><Globe2 /></div><p className="analytics-panel-note">Region is inferred from the browser locale in this prototype. Production reporting should use consent-aware geolocation.</p>{regions.length ? <RankList items={regions.slice(0, 5)} max={regions[0]?.count || 1} suffix="visitors" /> : <EmptyState icon={<Globe2 />} title="No regional data yet" text="Audience locations will appear after visits are collected." compact />}</article>
          <article className="analytics-panel"><div className="analytics-panel-head"><div><p className="eyebrow">Engagement</p><h2>Tracked interactions</h2></div><MousePointerClick /></div><p className="analytics-panel-note">A clear view of the actions visitors take across the Musterring experience.</p>{eventMix.length ? <RankList items={eventMix.slice(0, 5)} max={eventMix[0]?.count || 1} /> : <EmptyState icon={<MousePointerClick />} title="No interactions yet" text="Searches, comparisons and other actions will be grouped here." compact />}</article>
        </section>

        <footer className="analytics-footnote"><span>Data source</span><p>This prototype reports consented activity stored in this browser only. A shared analytics service is required for production-wide reporting.</p></footer>
      </div>
    </div>
  );
}

function RankList({ items, max, suffix }: { items: RankedItem[]; max: number; suffix?: string }) {
  return <ol className="analytics-rank-list">{items.map((item, index) => <li key={item.id}>{item.href ? <Link href={item.href}><RankContent item={item} index={index} max={max} suffix={suffix} /></Link> : <div><RankContent item={item} index={index} max={max} suffix={suffix} /></div>}</li>)}</ol>;
}

function RankContent({ item, index, max, suffix }: { item: RankedItem; index: number; max: number; suffix?: string }) {
  return <><span className="analytics-rank">{String(index + 1).padStart(2, "0")}</span><span className="analytics-rank-name">{item.label}<i><b style={{ width: `${Math.max(8, item.count / max * 100)}%` }} /></i></span><strong>{item.count}<small>{suffix ? ` ${suffix}` : ""}</small></strong></>;
}

function EmptyState({ icon, title, text, compact = false }: { icon: React.ReactNode; title: string; text: string; compact?: boolean }) {
  return <div className={`analytics-empty${compact ? " compact" : ""}`}><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div></div>;
}

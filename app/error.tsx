"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="section" role="alert"><div className="container"><p className="eyebrow">Unable to load this view</p><h1 className="h2">Your saved browser data is safe.</h1><p>Retry the page. If the problem continues, return to the furniture catalog.</p><div className="chips"><button className="button primary" onClick={reset}>Try again</button><Link className="button ghost" href="/furniture">Open furniture</Link></div></div></section>;
}

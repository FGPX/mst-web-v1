"use client";

import Link from "next/link";
import { LocateFixed, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { dealers } from "@/lib/data";
import { storage } from "@/lib/persistence";

const coordinates: Record<string, [number, number]> = {
  Hannover: [52.3759, 9.732],
  Berlin: [52.52, 13.405],
  Hamburg: [53.5511, 9.9937],
  München: [48.1351, 11.582],
  Köln: [50.9375, 6.9603],
  Frankfurt: [50.1109, 8.6821],
  Stuttgart: [48.7758, 9.1829],
  Düsseldorf: [51.2277, 6.7735]
};

function distanceKm(from: [number, number], to: [number, number]) {
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(to[0] - from[0]);
  const dLon = radians(to[1] - from[1]);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(from[0])) * Math.cos(radians(to[0])) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function DealersClient() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [locationState, setLocationState] = useState<"idle" | "loading" | "ready" | "denied" | "error">("idle");
  const filtered = useMemo(() => dealers
    .filter((dealer) => `${dealer.postcode} ${dealer.city} ${dealer.name}`.toLowerCase().includes(query.toLowerCase()))
    .map((dealer) => ({ ...dealer, calculatedDistance: location && coordinates[dealer.city] ? distanceKm(location, coordinates[dealer.city]) : dealer.distanceKm }))
    .sort((left, right) => left.calculatedDistance - right.calculatedDistance), [query, location]);
  const locate = () => {
    if (!navigator.geolocation) {
      setLocationState("error");
      return;
    }
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLocationState("ready");
      },
      (error) => setLocationState(error.code === error.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  };
  return <section className="section"><div className="container">
    <p className="eyebrow">Dealer Locator</p>
    <h1 className="h2">Select a Musterring retailer.</h1>
    <div className="chips">
      <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Postcode or city" aria-label="Postcode or city" />
      <button className="button ghost" onClick={locate} disabled={locationState === "loading"}><LocateFixed size={17} /> {locationState === "loading" ? "Locating…" : "Use my location"}</button>
    </div>
    <p role="status" className="muted">
      {locationState === "ready" ? "Retailers are sorted by distance from your current location." :
        locationState === "denied" ? "Location permission was denied. Search by postcode or city instead." :
        locationState === "error" ? "Location is unavailable. Search by postcode or city instead." :
        "Your precise location is used only in this browser and is not stored. The dealer list remains available without permission."}
    </p>
    <p className="muted">A live map is enabled only when an approved map adapter is configured; DEMO_MODE always keeps this complete list fallback.</p>
    {filtered.length ? <div className="grid grid-3" style={{ marginTop: 24 }}>{filtered.map((dealer) => <article className="card card-body" key={dealer.id}>
      <p className="eyebrow"><MapPin size={14} /> {dealer.calculatedDistance.toFixed(1)} km · {dealer.city}</p>
      <h2>{dealer.name}</h2><p>{dealer.address}, {dealer.postcode} {dealer.city}</p><p>{dealer.openingHours}</p>
      <p>{dealer.languages.join(", ")} · {dealer.categories.join(", ")}</p>
      <div className="chips">{dealer.services.map((service) => <span className="chip" key={service}>{service}</span>)}</div>
      <div className="chips" style={{ marginTop: 14 }}><button className="button primary" onClick={() => { storage.setDealer(dealer.id); storage.track({ name: "dealer_selected", dealerId: dealer.id }); }}>Select Retailer</button><Link className="button ghost" href={`/dealers/${dealer.id}`}>Details</Link><Link className="button consult" href="/handover?request=quote">Request a Quote</Link></div>
    </article>)}</div> : <div className="card card-body"><h2>No retailer found</h2><p>Try a nearby city or postcode.</p><button className="button ghost" onClick={() => setQuery("")}>Show all retailers</button></div>}
  </div></section>;
}

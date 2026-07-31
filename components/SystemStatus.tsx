"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { storage } from "@/lib/persistence";

export function SystemStatus() {
  const [online, setOnline] = useState(true);
  const [consentKnown, setConsentKnown] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    setOnline(navigator.onLine);
    setConsentKnown(window.localStorage.getItem("musterring.consent") !== null);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return (
    <>
      {!online ? <div className="system-status" role="status">You are offline. Saved projects and catalogue tools remain available in this browser.</div> : null}
      {!consentKnown ? <div className="consent-banner" role="dialog" aria-label="Analytics preferences">
        <p><strong>Privacy choices</strong> Optional local analytics help test this demo. No analytics is stored before you choose.</p>
        <div><button onClick={() => { storage.setConsent(false); setConsentKnown(true); }}>Use necessary storage only</button><button onClick={() => { storage.setConsent(true); setConsentKnown(true); }}>Allow anonymous usage insights</button></div>
      </div> : null}
      {process.env.NODE_ENV === "development" && pathname === "/presentation" ? <div className="integration-status" title="Production map, CRM, email and PIM adapters are not configured">DEMO MODE · local adapters active</div> : null}
    </>
  );
}

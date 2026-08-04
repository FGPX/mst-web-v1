"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SystemStatus } from "@/components/SystemStatus";
import { AlternativeFinderPanel } from "@/components/AlternativeFinderPanel";
import { MusterringAdvisor } from "@/components/MusterringAdvisor";
import { storage } from "@/lib/persistence";

export function ExperienceChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const partnerExperience = pathname.startsWith("/partner");

  useEffect(() => {
    storage.track({ name: "page_viewed", route: pathname });
  }, [pathname]);

  if (partnerExperience) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <Header />
      <SystemStatus />
      <main id="main">{children}</main>
      <AlternativeFinderPanel />
      <MusterringAdvisor />
      <Footer />
    </>
  );
}

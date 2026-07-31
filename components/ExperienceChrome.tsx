"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SystemStatus } from "@/components/SystemStatus";
import { AlternativeFinderPanel } from "@/components/AlternativeFinderPanel";
import { MusterringAdvisor } from "@/components/MusterringAdvisor";

export function ExperienceChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const partnerExperience = pathname.startsWith("/partner");

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

import type { Metadata } from "next";
import "./globals.css";
import { ExperienceChrome } from "@/components/ExperienceChrome";

export const metadata: Metadata = {
  title: "Musterring | Intelligent Search and plan your room",
  description: "Discover furniture, plan your room and prepare your project for a personal Musterring consultation."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main">Skip to content</a>
        <ExperienceChrome>{children}</ExperienceChrome>
      </body>
    </html>
  );
}

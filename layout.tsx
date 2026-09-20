import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SevereAlertBanner from "@/components/SevereAlertBanner";

export const metadata: Metadata = {
  title: "VayuShield — Atmospheric Health & Early Warning Intelligence",
  description:
    "Unified air quality exposure intelligence and pre-disaster cyclone early-warning command center. Zero mandatory sensors, zero mandatory API keys.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Navbar />
        <SevereAlertBanner />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-slate-600">
          VayuShield · Built for hackathon demo · Data shown is a physically-plausible mock
          fallback modeled on CPCB &amp; IMD reporting formats.
        </footer>
      </body>
    </html>
  );
}

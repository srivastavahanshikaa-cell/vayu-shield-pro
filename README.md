# VayuShield — Atmospheric Health & Pre-Disaster Early Warning Intelligence System

A unified Next.js 14 (App Router) + TypeScript + Tailwind CSS platform combining:

1. **Air Quality & Exposure Intelligence** — live-style AQI monitoring across
   Delhi, Bengaluru & Kolkata, 6-gas breakdowns, profile-aware health triage,
   forecast charting, and a "Best Time to Go Out" calculator.
2. **Pre-Disaster Cyclone & Extreme Weather Command Center** — a live landfall
   countdown, storm telemetry matrix, phased T-48h/T-24h/T-6h readiness
   checklist, evacuation shelter locator, national helpline directory, and a
   Web Audio emergency siren simulator.

The platform runs with **zero mandatory sensors and zero mandatory API keys**.
It ships with a realistic, physically-plausible mock data layer modeled on
CPCB (Central Pollution Control Board) AQI sub-index breakpoints and IMD
(India Meteorological Department) cyclone bulletin structure, so it works
fully out of the box for a hackathon demo.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Optional integrations

Copy `.env.example` to `.env.local` to enable optional enhancements:

- `GEMINI_API_KEY` — unlocks live Google Gemini-generated, profile-personalised
  health tips in the Air Quality pillar. Without it, the app gracefully shows
  a clear fallback message and all core functionality still works.
- `CPCB_API_KEY` / `IMD_API_KEY` — placeholders for wiring in real government
  data feeds. The routes in `app/api/air-quality/route.ts` and
  `app/api/cyclone/route.ts` are structured so a live fetch can be dropped in
  ahead of the mock fallback.

## Project structure

```
app/
  layout.tsx              Root layout, nav, global severe-alert banner
  page.tsx                Landing / overview page
  air-quality/page.tsx    Air Quality Intelligence dashboard
  cyclone/page.tsx        Cyclone Command Center dashboard
  api/
    air-quality/route.ts           AQI + 6-gas data (mock CPCB fallback)
    air-quality/forecast/route.ts  +3h/+6h/+12h forecast
    cyclone/route.ts               Cyclone telemetry + shelters + helplines
    gemini/route.ts                Optional Gemini AI health tip proxy
components/
  Navbar.tsx, SevereAlertBanner.tsx
  air/        CitySelector, AQICard, PollutantBreakdown, ProfileTriage,
              ForecastChart, BestTimeOut
  cyclone/    LandfallCountdown, TelemetryMatrix, ReadinessChecklist,
              ShelterLocator, HelplineDirectory, SirenSimulator
lib/
  types.ts      Shared TypeScript types
  aqi.ts        CPCB-style AQI sub-index math, categorisation, health logic
  mockData.ts   Deterministic mock data generators for both pillars
```

## Key design notes

- **AQI computation** uses simplified official CPCB breakpoint tables for
  PM2.5, PM10, NO₂, SO₂, CO and O₃, with the overall AQI taken as the maximum
  sub-index (the dominant pollutant), matching the real methodology.
- **Mock data realism**: pollutant readings use deterministic, hour-seeded
  jitter around per-city baselines, so numbers feel "live" during a demo
  without being random noise on every refresh.
- **Cyclone scenario**: a single evolving storm ("Cyclone Ashani") approaches
  the Odisha/West Bengal coast; distance-to-coast, wind speed, pressure, and
  severity all derive from a shared countdown clock, so every screen stays
  internally consistent as landfall approaches.
- **Severe alert banner**: automatically appears site-wide once the cyclone
  scenario reaches "evacuation" or "severe" severity — no manual trigger
  needed.

## Tech stack

- Next.js 14 (App Router, Route Handlers)
- TypeScript (strict mode)
- Tailwind CSS
- Recharts (AQI forecast chart)
- Web Audio API (siren simulator, no audio assets required)

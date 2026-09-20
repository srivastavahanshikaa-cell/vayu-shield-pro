import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Atmospheric Health &amp; Pre-Disaster Early Warning Intelligence
        </p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
          Vayu<span className="text-emerald-400">Shield</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          One unified platform combining real-time air quality exposure intelligence with a
          cyclone &amp; extreme weather early-warning command center — running entirely on
          CPCB &amp; IMD-style mock fallback data. Zero sensors, zero mandatory API keys.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/air-quality"
            className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            🌬️ Air Quality Intelligence
          </Link>
          <Link
            href="/cyclone"
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            🌀 Cyclone Command Center
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-bold text-white">🌬️ Air Quality &amp; Exposure Intelligence</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>• Live AQI across Delhi, Bengaluru &amp; Kolkata with 6-gas breakdowns</li>
            <li>• Profile-aware triage for asthma, elderly, children &amp; pregnant users</li>
            <li>• +3h / +6h / +12h forecast with Best Time to Go Out calculator</li>
            <li>• Optional Gemini AI-personalised health tips</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-bold text-white">🌀 Pre-Disaster Cyclone Command Center</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>• Live landfall countdown &amp; storm telemetry matrix</li>
            <li>• T-48h / T-24h / T-6h phased readiness checklist</li>
            <li>• Evacuation shelter locator &amp; national helpline directory</li>
            <li>• Web Audio emergency siren simulator for live demos</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

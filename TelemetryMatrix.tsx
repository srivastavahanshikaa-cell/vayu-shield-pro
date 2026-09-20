import type { CycloneData } from "@/lib/types";

export default function TelemetryMatrix({ cyclone }: { cyclone: CycloneData }) {
  const stats = [
    { label: "Category", value: cyclone.category, icon: "🌀" },
    { label: "Max Sustained Winds", value: cyclone.maxWindKmh + " km/h", icon: "💨" },
    { label: "Central Pressure", value: cyclone.centralPressureHpa + " hPa", icon: "🌡️" },
    { label: "Storm Surge Height", value: cyclone.stormSurgeM + " m", icon: "🌊" },
    { label: "Distance to Coastline", value: cyclone.distanceToCoastKm + " km", icon: "📍" },
  ];
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Storm Telemetry Matrix — {cyclone.name}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-slate-950/60 p-3 text-center">
            <div className="text-2xl">{s.icon}</div>
            <p className="mt-1 text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-sm font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

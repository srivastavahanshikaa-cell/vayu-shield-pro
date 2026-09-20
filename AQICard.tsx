import type { AQIData } from "@/lib/types";
import { categoryStyles } from "@/lib/aqi";

export default function AQICard({ data }: { data: AQIData }) {
  const styles = categoryStyles(data.category);
  return (
    <div className={"rounded-2xl border border-slate-800 p-6 ring-1 " + styles.bg + " " + styles.ring}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {data.station.stationName}, {data.station.cityName}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Source: {data.source === "MOCK_FALLBACK" ? "Mock fallback (CPCB-style)" : "CPCB Live"} ·{" "}
            Updated {new Date(data.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
        <span className={"rounded-full px-3 py-1 text-xs font-semibold " + styles.text + " " + styles.bg}>
          {data.category}
        </span>
      </div>
      <div className="mt-6 flex items-end gap-4">
        <span className={"text-6xl font-black " + styles.text}>{data.aqi}</span>
        <div className="pb-2">
          <p className="text-sm text-slate-400">Air Quality Index</p>
          <p className="text-sm">
            Dominant pollutant: <span className="font-semibold text-white">{data.dominantPollutant}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

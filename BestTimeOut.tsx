import type { ForecastPoint } from "@/lib/types";
import { bestTimeToGoOut } from "@/lib/aqi";

export default function BestTimeOut({ forecast }: { forecast: ForecastPoint[] }) {
  const { label } = bestTimeToGoOut(forecast);
  return (
    <div className="rounded-2xl border border-emerald-800/50 bg-emerald-500/5 p-6">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-400">
        🕐 Best Time to Go Out Today
      </h3>
      <p className="text-sm text-slate-200">{label}</p>
    </div>
  );
}

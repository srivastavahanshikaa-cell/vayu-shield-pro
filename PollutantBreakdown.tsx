import type { PollutantReading } from "@/lib/types";

export default function PollutantBreakdown({ pollutants }: { pollutants: PollutantReading[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        6-Gas Breakdown
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {pollutants.map((p) => {
          const ratio = Math.min(1.5, p.value / p.safeLimit);
          const over = ratio > 1;
          return (
            <div key={p.key} className="rounded-xl bg-slate-950/60 p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-400">{p.label}</span>
                <span className={"text-xs " + (over ? "text-red-400" : "text-emerald-400")}>
                  {over ? "Above limit" : "Within limit"}
                </span>
              </div>
              <p className="mt-1 text-xl font-bold text-white">
                {p.value} <span className="text-xs font-normal text-slate-500">{p.unit}</span>
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={"h-full " + (over ? "bg-red-500" : "bg-emerald-500")}
                  style={{ width: Math.min(100, ratio * 100) + "%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

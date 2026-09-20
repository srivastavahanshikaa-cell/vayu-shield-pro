import type { Shelter } from "@/lib/types";

export default function ShelterLocator({ shelters }: { shelters: Shelter[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Designated Evacuation Shelters
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {shelters.map((s) => {
          const occupancyPct = Math.round((s.occupancy / s.capacity) * 100);
          return (
            <div key={s.id} className="rounded-xl bg-slate-950/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-white">{s.name}</p>
                <span className="whitespace-nowrap rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {s.distanceKm} km
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{s.address}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {s.occupancy} / {s.capacity} occupied
                </span>
                <span>{occupancyPct}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={"h-full " + (occupancyPct > 80 ? "bg-red-500" : "bg-emerald-500")}
                  style={{ width: occupancyPct + "%" }}
                />
              </div>
              <a
                href={"tel:" + s.contact}
                className="mt-3 inline-block rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
              >
                📞 Call {s.contact}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import type { CityId } from "@/lib/types";

const CITIES: { id: CityId; name: string; station: string }[] = [
  { id: "delhi", name: "Delhi", station: "ITO, Central Delhi" },
  { id: "bengaluru", name: "Bengaluru", station: "BTM Layout" },
  { id: "kolkata", name: "Kolkata", station: "Victoria Memorial" },
];

export default function CitySelector({
  value,
  onChange,
}: {
  value: CityId;
  onChange: (city: CityId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CITIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={
            "rounded-xl border px-4 py-2 text-left transition " +
            (value === c.id
              ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
              : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500")
          }
        >
          <div className="font-semibold">{c.name}</div>
          <div className="text-xs text-slate-500">{c.station}</div>
        </button>
      ))}
    </div>
  );
}

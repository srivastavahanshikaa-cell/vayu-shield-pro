"use client";
import { useEffect, useState } from "react";

function formatRemaining(ms: number) {
  if (ms <= 0) return { h: 0, m: 0, s: 0, landed: true };
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h, m, s, landed: false };
}

export default function LandfallCountdown({ landfallIso }: { landfallIso: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(landfallIso).getTime();
  const { h, m, s, landed } = formatRemaining(target - now);

  return (
    <div className="rounded-2xl border border-red-800/60 bg-red-950/30 p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
        {landed ? "Landfall in progress" : "Projected Landfall Countdown"}
      </p>
      <div className="mt-3 flex items-center justify-center gap-3 font-mono">
        {[
          { v: h, label: "HRS" },
          { v: m, label: "MIN" },
          { v: s, label: "SEC" },
        ].map((unit) => (
          <div key={unit.label} className="rounded-xl bg-slate-950 px-4 py-3">
            <div className="text-4xl font-black text-white tabular-nums">
              {String(unit.v).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] tracking-widest text-slate-500">{unit.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Estimated landfall: {new Date(landfallIso).toLocaleString()}
      </p>
    </div>
  );
}

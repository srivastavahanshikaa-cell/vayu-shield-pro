"use client";
import { useMemo, useState } from "react";
import { CHECKLIST_PHASES } from "@/lib/mockData";

export default function ReadinessChecklist() {
  const [activePhase, setActivePhase] = useState(CHECKLIST_PHASES[0].id);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const phase = CHECKLIST_PHASES.find((p) => p.id === activePhase)!;
  const progress = useMemo(() => {
    const done = phase.items.filter((i) => checked[i.id]).length;
    return Math.round((done / phase.items.length) * 100);
  }, [checked, phase]);

  function toggle(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        T-Minus Readiness Protocol
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CHECKLIST_PHASES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePhase(p.id)}
            className={
              "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition " +
              (activePhase === p.id
                ? "border-red-400 bg-red-500/10 text-red-300"
                : "border-slate-700 text-slate-400 hover:border-slate-500")
            }
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{phase.window}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-red-500 transition-all" style={{ width: progress + "%" }} />
        </div>

        <ul className="mt-4 space-y-2">
          {phase.items.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-950/60 p-3 hover:bg-slate-950">
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  className="mt-0.5 h-4 w-4 accent-red-500"
                />
                <span
                  className={
                    "text-sm " + (checked[item.id] ? "text-slate-500 line-through" : "text-slate-200")
                  }
                >
                  {item.text}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

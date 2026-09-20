import type { Helpline } from "@/lib/types";

export default function HelplineDirectory({ helplines }: { helplines: Helpline[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        National Emergency Helpline Directory
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {helplines.map((h) => (
          <a
            key={h.number}
            href={"tel:" + h.number}
            className="flex flex-col items-center rounded-xl bg-slate-950/60 p-4 text-center transition hover:bg-slate-950"
          >
            <span className="text-2xl font-black text-red-400">{h.number}</span>
            <span className="mt-1 text-xs text-slate-400">{h.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import type { AQIData, HealthProfile } from "@/lib/types";
import { healthRecommendation } from "@/lib/aqi";

const PROFILES: { id: HealthProfile; label: string; icon: string }[] = [
  { id: "general", label: "General", icon: "🧍" },
  { id: "asthma", label: "Asthma/Respiratory", icon: "🫁" },
  { id: "elderly", label: "Elderly", icon: "👵" },
  { id: "children", label: "Children", icon: "🧒" },
  { id: "pregnant", label: "Pregnant", icon: "🤰" },
];

export default function ProfileTriage({ data }: { data: AQIData }) {
  const [profile, setProfile] = useState<HealthProfile>("general");
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"gemini" | "fallback" | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  const rec = healthRecommendation(profile, data.category, data.dominantPollutant);

  async function getAITip() {
    setLoadingTip(true);
    setAiTip(null);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          aqi: data.aqi,
          category: data.category,
          dominantPollutant: data.dominantPollutant,
          cityName: data.station.cityName,
        }),
      });
      const json = await res.json();
      setAiTip(json.tip);
      setAiSource(json.source);
    } catch {
      setAiTip("Could not reach the AI tip service right now.");
      setAiSource("fallback");
    } finally {
      setLoadingTip(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Dynamic Health Triage
      </h3>
      <div className="flex flex-wrap gap-2">
        {PROFILES.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setProfile(p.id);
              setAiTip(null);
            }}
            className={
              "rounded-full border px-3 py-1.5 text-sm transition " +
              (profile === p.id
                ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                : "border-slate-700 text-slate-300 hover:border-slate-500")
            }
          >
            <span className="mr-1">{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-slate-950/60 p-4">
        <p className="font-semibold text-white">{rec.headline}</p>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
          {rec.tips.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-400">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-slate-900 p-2">
            <p className="text-slate-500">Mask advice</p>
            <p className="font-medium text-white">{rec.maskAdvice}</p>
          </div>
          <div className="rounded-lg bg-slate-900 p-2">
            <p className="text-slate-500">Outdoor advice</p>
            <p className="font-medium text-white">{rec.outdoorAdvice}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={getAITip}
          disabled={loadingTip}
          className="rounded-lg bg-indigo-500/20 px-3 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/30 disabled:opacity-50"
        >
          {loadingTip ? "Asking Gemini…" : "✨ Get AI-personalised tip"}
        </button>
        {aiTip && (
          <p className="mt-2 rounded-lg bg-indigo-950/40 p-3 text-sm text-indigo-200">
            {aiSource === "fallback" && (
              <span className="mr-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                Fallback
              </span>
            )}
            {aiTip}
          </p>
        )}
      </div>
    </div>
  );
}

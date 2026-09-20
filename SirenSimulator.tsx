"use client";
import { useRef, useState } from "react";

export default function SirenSimulator() {
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const sweepRef = useRef<number | null>(null);

  function play() {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    let rising = true;
    let freq = 500;
    const interval = window.setInterval(() => {
      freq += rising ? 20 : -20;
      if (freq >= 900) rising = false;
      if (freq <= 500) rising = true;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
    }, 40);

    audioCtxRef.current = ctx;
    oscRef.current = osc;
    sweepRef.current = interval;
    setPlaying(true);
  }

  function stop() {
    if (sweepRef.current) window.clearInterval(sweepRef.current);
    oscRef.current?.stop();
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    oscRef.current = null;
    sweepRef.current = null;
    setPlaying(false);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Audio Siren / Broadcast Simulator
      </h3>
      <p className="mb-4 text-xs text-slate-500">
        Plays a simulated civil-defense alert tone via the Web Audio API — great for live demo
        impact. No audio files required.
      </p>
      <button
        onClick={playing ? stop : play}
        className={
          "rounded-xl px-5 py-3 font-semibold transition " +
          (playing
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-red-500/20 text-red-300 hover:bg-red-500/30")
        }
      >
        {playing ? "⏹ Stop Siren" : "🔊 Test Emergency Siren"}
      </button>
    </div>
  );
}

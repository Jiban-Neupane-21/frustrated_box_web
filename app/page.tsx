"use client";

// frustratedbox-web/app/page.tsx
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const MAX_LENGTH = 280;
const FULL_PRESSURE_AT = 200; // characters that max out the gauge
const BURN_MS = 1400;
const DONE_MS = 4000;

type Phase = "idle" | "venting" | "done";

export default function HomePage() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const pressure =
    phase === "venting" ? 0 : Math.min(text.length / FULL_PRESSURE_AT, 1);
  const pressurePct = Math.round(pressure * 100);
  const straining = pressure > 0.75;

  function letItOut() {
    if (!text.trim() || phase === "venting") return;
    setPhase("venting");
    timers.current.push(
      setTimeout(() => {
        setText("");
        setPhase("done");
      }, BURN_MS),
      setTimeout(() => setPhase("idle"), BURN_MS + DONE_MS),
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-zinc-100 selection:bg-red-950 selection:text-red-200">
      {/* Ambient heat: the whole page warms up as pressure builds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[32%] h- w- -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-800 blur-[140px] transition-all duration-500 ease-out"
        style={{
          opacity: 0.08 + pressure * 0.32,
          transform: `translate(-50%, -50%) scale(${0.85 + pressure * 0.4})`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#000_100%)]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-6">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <div
            className={straining ? "fb-strain" : ""}
            style={{
              filter: `drop-shadow(0 0 ${8 + pressure * 28}px rgba(220,38,38,${0.15 + pressure * 0.5}))`,
            }}
          >
            <Logo size={150} showText={false} />
          </div>
          <h1 className="mt-8 text-4xl font-black leading-[1.05] tracking-tighter text-white sm:text-6xl">
            Frustrated
            <span className="text-red-600">Box</span>
          </h1>
          <h1 className="mt-8 text-4xl font-black leading-[1.05] tracking-tighter text-white sm:text-6xl">
            We&apos;re in
            <br />
            <span className="text-red-600">development.</span>
          </h1>
          <p className="mt-4 text-base text-white/60 sm:text-lg">
            Frustrated Box is being built. Check back soon.
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";

// frustratedbox-web/app/page.tsx
import { Logo } from "@/components/ui/Logo";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-zinc-100 selection:bg-red-950 selection:text-red-200">
      {/* Ambient background glow behind the logo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[32%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-800/20 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#000_100%)]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-6">
        {/* Hero Section */}
        <section className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <div className="transition-transform duration-300 hover:scale-105">
            <Logo size={150} showText={false} />
          </div>

          <h1 className="mt-8 text-4xl font-black leading-[1.05] tracking-tighter text-white sm:text-6xl">
            Frustrated <span className="text-red-600">Box</span>
          </h1>

          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white/90 sm:text-5xl">
            We&apos;re in <span className="text-red-600">development.</span>
          </h2>

          <p className="mt-4 text-base text-white/60 sm:text-lg">
            Frustrated Box is being built. Check back soon.
          </p>
        </section>
      </div>
    </main>
  );
}

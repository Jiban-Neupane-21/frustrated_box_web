"use client";
import { FeedStream } from "@/app/features/feed/components/FeedStream";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-zinc-100 selection:bg-red-950 selection:text-red-200">
      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
        {/* Center Infinite Feed Stream */}
        <section className="flex-1 pb-16">
          <FeedStream />
        </section>
      </div>
    </main>
  );
}

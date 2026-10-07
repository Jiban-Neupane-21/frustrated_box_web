import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Archivo, Source_Serif_4 } from "next/font/google";

const display = Archivo({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-display",
});
const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Community Rules | FrustratedBox",
  description:
    "The core ground rules and moderation guidelines for venting safely on FrustratedBox.",
};

interface RuleItem {
  id: string;
  title: string;
  description: string;
  allowed: string;
  prohibited: string;
}

const RULES: RuleItem[] = [
  {
    id: "doxxing",
    title: "Don't expose real people",
    description:
      "Venting is for releasing frustration, not for starting real-world witch hunts. Never reveal anyone's identity.",
    allowed: 'Use stand-ins like "my coworker", "client X", or "my landlord".',
    prohibited:
      "Real names, phone numbers, email addresses, home locations, or photos.",
  },
  {
    id: "harassment",
    title: "Vent about experiences, not at individuals",
    description:
      "Be as angry as you like at systems, situations, and stressful interactions. Don't aim abuse at a specific person.",
    allowed: "Anger about unpaid overtime, bad code, or stressful policies.",
    prohibited: "Threats of physical harm, extortion, or coordinated bullying.",
  },
  {
    id: "hate-speech",
    title: "No hate speech or discrimination",
    description:
      "Frustration is not an excuse for prejudice. Discriminatory posts are removed immediately and the poster's IP is banned.",
    allowed: "Criticism of behavior, company culture, and broken processes.",
    prohibited:
      "Slurs or attacks based on caste, ethnicity, gender, sexual orientation, or religion.",
  },
  {
    id: "crisis",
    title: "Get crisis help from people trained for it",
    description:
      "FrustratedBox can't respond to a mental health emergency, and a peer forum is no substitute for a crisis line.",
    allowed:
      "Contacting emergency services, a crisis line, or a licensed therapist when you're in severe distress.",
    prohibited:
      "Posting self-harm plans or encouraging self-destructive behavior.",
  },
  {
    id: "authentic",
    title: "Post real frustrations, not ads",
    description:
      "Keep the feed honest. Don't dress up promotions, referral schemes, or SEO campaigns as venting.",
    allowed: "Everyday burnout and unfiltered struggles, in your own words.",
    prohibited:
      "Affiliate links, course sales, or bots that automate engagement.",
  },
];

export default function CommunityRulesPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-black text-zinc-300 font-(family-name:--font-display)`}
    >
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white  focus-visible:outline-2 focus-visible:outline-red-500"
          >
            <ChevronLeft className="h-4 w-4" />
            FrustratedBox
          </Link>
          <span className="text-sm text-zinc-500">Updated October 2026</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-14 pb-24">
        <h1 className="font-(family-name:--font-display) text-5xl font-black leading-[0.95] tracking-tighter text-white sm:text-7xl">
          Community
          <br />
          rules
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-zinc-400">
          FrustratedBox is a place to scream into the void without being judged.
          Five rules keep it that way.
        </p>

        {/* The one loud element on the page */}
        <aside className="mt-12 bg-red-600 px-6 py-6 text-black sm:px-8">
          <p className="font-(family-name:--font-display) text-2xl font-black leading-tight sm:text-3xl">
            Hate the situation, not the person.
          </p>
          <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-black/85">
            Say what you really think. Anonymity is there to protect honesty,
            not to hurt someone who can&apos;t answer back.
          </p>
        </aside>

        {/* Rules are referred to by number in moderation, so numbering stays */}
        <ol className="mt-16 divide-y divide-zinc-800 border-t border-zinc-800">
          {RULES.map((rule, i) => (
            <li
              key={rule.id}
              id={rule.id}
              className="grid scroll-mt-8 gap-4 py-10 sm:grid-cols-[5rem_1fr] sm:gap-8"
            >
              <span
                aria-hidden="true"
                className="font-(family-name:--font-display) text-5xl font-black leading-none text-red-600"
              >
                {i + 1}
              </span>

              <div>
                <h2 className="font-(family-name:--font-display) text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  <span className="sr-only">Rule {i + 1}: </span>
                  {rule.title}
                </h2>
                <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.75] text-zinc-400">
                  {rule.description}
                </p>

                <dl className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-zinc-800">
                  <div className="sm:pr-8">
                    <dt className="font-(family-name:--font-display) text-sm font-semibold text-white">
                      Fine
                    </dt>
                    <dd className="mt-1 text-[16px] leading-relaxed text-zinc-400">
                      {rule.allowed}
                    </dd>
                  </div>
                  <div className="sm:pl-8">
                    <dt className="font-(family-name:--font-display) text-sm font-semibold text-red-500">
                      Removed
                    </dt>
                    <dd className="mt-1 text-[16px] leading-relaxed text-zinc-400">
                      {rule.prohibited}
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>

        <section className="border-t border-zinc-800 pt-10">
          <h2 className="font-family-name--font-display text-xl font-extrabold tracking-tight text-white">
            How we enforce these rules
          </h2>
          <p className="mt-3 max-w-[68ch] text-[17px] leading-[1.75] text-zinc-400">
            Posts that break a rule are blurred, pushed down the feed, or
            deleted. Accounts that keep breaking rules, such as repeated doxxing
            attempts, are banned permanently by account, device, and IP address.
            Use the report button on any post to flag it.
          </p>
          <p className="mt-4 text-[17px] text-zinc-400">
            For a serious violation, email{" "}
            <a
              href="mailto:safety@frustratedbox.com"
              className="text-red-500 underline underline-offset-4 hover:text-red-400  focus-visible:outline-2 focus-visible:outline-red-500"
            >
              safety@frustratedbox.com
            </a>
            .
          </p>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-zinc-500">
          <p>© 2026 FrustratedBox</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white">
              Terms of service
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

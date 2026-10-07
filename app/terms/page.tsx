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
  title: "Terms of Service | FrustratedBox",
  description:
    "Read the community rules, disclaimers, and terms governing FrustratedBox.",
};

const prohibited = [
  {
    term: "Personal information",
    text: "Real full names, private phone numbers, home or workplace addresses, personal emails, or photos shared without permission.",
  },
  {
    term: "Harassment and threats",
    text: "Targeted intimidation, stalking, incitement to violence, or extortion aimed at an individual.",
  },
  {
    term: "Defamation",
    text: "Unverified criminal accusations against real people or named small businesses.",
  },
  {
    term: "Hate speech",
    text: "Abuse based on race, ethnicity, caste, religion, disability, gender, or sexual orientation.",
  },
  {
    term: "Illegal activity and spam",
    text: "Selling illegal substances, copyright theft, phishing, or running bots and automated spam.",
  },
];

const toc = [
  ["eligibility", "Eligibility"],
  ["conduct", "What you can't post"],
  ["ownership", "Your content and anonymity"],
  ["moderation", "Moderation and bans"],
  ["liability", "Disclaimers"],
  ["contact", "Report a violation"],
];

const h2 =
  "font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-white";
const p = "text-[17px] leading-[1.75] text-zinc-400";

export default function TermsOfServicePage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-black text-zinc-300 font-family-name--font-display`}
    >
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white focus-visible:outline  focus-visible:outline-red-500"
          >
            <ChevronLeft className="h-4 w-4" />
            FrustratedBox
          </Link>
          <span className="text-sm text-zinc-500">Updated October 2026</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-14 pb-24">
        {/* Title: type does the work, no badge or gradient */}
        <h1 className="font-(family-name:--font-display) text-5xl font-black leading-[0.95] tracking-tighter text-white sm:text-7xl">
          Terms of
          <br />
          Service
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-zinc-400">
          By using FrustratedBox you agree to the terms below. They exist so
          people can vent freely without anyone getting hurt.
        </p>

        {/* The one loud element on the page */}
        <aside
          role="note"
          className="mt-12 bg-red-600 px-6 py-6 text-black sm:px-8"
        >
          <p className="font-(family-name:--font-display) text-2xl font-black leading-tight sm:text-3xl">
            FrustratedBox is not therapy or crisis support.
          </p>
          <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-black/85">
            If you are thinking about harming yourself, or you&apos;re in a
            medical emergency, contact your local emergency services or a crisis
            hotline right now. People here can listen, but they can&apos;t keep
            you safe.
          </p>
        </aside>

        <div className="mt-16 grid gap-12 lg:grid-cols-[13rem_1fr]">
          {/* Sticky table of contents */}
          <nav aria-label="On this page" className="hidden lg:block">
            <ul className="sticky top-8 space-y-3 border-l border-zinc-800 pl-4 text-sm">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-zinc-500 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-red-500"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-[68ch] divide-y divide-zinc-800">
            <section id="eligibility" className="scroll-mt-8 pb-10">
              <h2 className={h2}>1. Eligibility</h2>
              <p className={`${p} mt-3`}>
                You must be at least 13, or the age of majority where you live,
                to create an account or browse as a guest. If you don&apos;t
                agree with these terms, stop using the service.
              </p>
            </section>

            <section id="conduct" className="scroll-mt-8 py-10">
              <h2 className={h2}>2. What you can&apos;t post</h2>
              <p className={`${p} mt-3`}>
                Rants can be raw and honest. They can&apos;t cause harm to real
                people. You agree not to post any of the following.
              </p>
              <dl className="mt-6 divide-y divide-zinc-900 border-y border-zinc-900">
                {prohibited.map((item) => (
                  <div
                    key={item.term}
                    className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
                  >
                    <dt className="font-(family-name:--font-display) font-semibold text-red-500">
                      {item.term}
                    </dt>
                    <dd className="text-[16px] leading-relaxed text-zinc-400">
                      {item.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section id="ownership" className="scroll-mt-8 py-10">
              <h2 className={h2}>3. Your content and anonymity</h2>
              <p className={`${p} mt-3`}>
                You keep ownership of what you post. By posting, you give
                FrustratedBox a worldwide, non-exclusive, royalty-free license
                to host, display, blur, and format it on the platform.
              </p>
              <p className={`${p} mt-4`}>
                Anonymous posting hides your identity from other users, not from
                us. We record network data such as IP addresses to keep the
                platform secure, and we will respond to valid legal orders when
                violent threats or serious crimes are involved.
              </p>
            </section>

            <section id="moderation" className="scroll-mt-8 py-10">
              <h2 className={h2}>4. Moderation and bans</h2>
              <p className={`${p} mt-3`}>
                Administrators and moderators can blur, hide, edit, or delete
                any post that puts people at risk. We may suspend or ban an
                account or IP address without notice for serious or repeated
                violations.
              </p>
            </section>

            <section id="liability" className="scroll-mt-8 py-10">
              <h2 className={h2}>5. Disclaimers</h2>
              <p className={`${p} mt-3`}>
                FrustratedBox is provided &quot;as is&quot; and &quot;as
                available,&quot; without warranties of any kind. We don&apos;t
                verify claims made in user posts, and we aren&apos; t
                responsible for distress caused by what other people write. To
                the fullest extent the law allows, FrustratedBox and its
                operators are not liable for indirect or punitive damages.
              </p>
            </section>

            <section id="contact" className="scroll-mt-8 pt-10">
              <h2 className={h2}>6. Report a violation</h2>
              <p className={`${p} mt-3`}>
                If a post breaks these terms or infringes your legal rights,
                email{" "}
                <a
                  href="mailto:safety@frustratedbox.com"
                  className="text-red-500 underline underline-offset-4 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-500"
                >
                  safety@frustratedbox.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-zinc-500">
          <p>© 2026 FrustratedBox</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link href="/rules" className="hover:text-white">
              Community rules
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

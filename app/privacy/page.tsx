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
  title: "Privacy Policy | FrustratedBox",
  description:
    "Learn how FrustratedBox manages anonymity, collects data, and protects user identity.",
};

const collected = [
  {
    term: "Account details",
    text: "Your email address, a hashed password, and your handle, if you register.",
  },
  {
    term: "Your content",
    text: "The text, tags, reactions, and comments you choose to post.",
  },
  {
    term: "Technical data",
    text: "IP address, browser type, and approximate device details, collected automatically for rate limiting, DDoS protection, and spam prevention.",
  },
];

const uses = [
  "Showing you a personalized feed, community spaces, and frustration reactions.",
  "Enforcing guest blur limits and blocking abusive bots.",
  "Investigating reports of doxxing, severe cyberbullying, or attempts to sabotage the platform.",
  "Keeping the system healthy, fast, and able to scale.",
];

const toc = [
  ["collect", "What we collect"],
  ["use", "How we use it"],
  ["sharing", "Sharing and third parties"],
  ["cookies", "Cookies and local storage"],
  ["deletion", "Retention and deletion"],
  ["contact", "Contact"],
];

const h2 =
  "font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-white";
const p = "text-[17px] leading-[1.75] text-zinc-400";

export default function PrivacyPolicyPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-black text-zinc-300 font-(family-name:--font-body)`}
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
          <span className="text-sm text-zinc-500">Effective October 2026</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-14 pb-24">
        <h1 className="font-(family-name:--font-display) text-5xl font-black leading-[0.95] tracking-tighter text-white sm:text-7xl">
          Privacy
          <br />
          policy
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-zinc-400">
          Real venting needs privacy. This page explains what we collect, what
          stays anonymous, and when we&apos;d ever share anything.
        </p>

        {/* The one loud element on the page */}
        <aside className="mt-12 bg-red-600 px-6 py-6 text-black sm:px-8">
          <p className="font-(family-name:--font-display) text-2xl font-black leading-tight sm:text-3xl">
            Anonymous means anonymous to other users.
          </p>
          <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-black/85">
            When you post anonymously, your profile and handle are removed from
            the feed. Other members can&apos;t trace the post back to your
            username or linked social accounts.
          </p>
        </aside>

        <div className="mt-16 grid gap-12 lg:grid-cols-[13rem_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <ul className="sticky top-8 space-y-3 border-l border-zinc-800 pl-4 text-sm">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-zinc-500 hover:text-red-500  focus-visible:outline-2 focus-visible:outline-red-500"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-[68ch] divide-y divide-zinc-800">
            <section id="collect" className="scroll-mt-8 pb-10">
              <h2 className={h2}>1. What we collect</h2>
              <p className={`${p} mt-3`}>
                We collect only what the service needs to work.
              </p>
              <dl className="mt-6 divide-y divide-zinc-900 border-y border-zinc-900">
                {collected.map((item) => (
                  <div
                    key={item.term}
                    className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
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

            <section id="use" className="scroll-mt-8 py-10">
              <h2 className={h2}>2. How we use it</h2>
              <p className={`${p} mt-3`}>
                We use your information only to run and protect the platform:
              </p>
              <ul className="mt-4 space-y-3">
                {uses.map((text) => (
                  <li
                    key={text}
                    className="border-l-2 border-red-600 pl-4 text-[16px] leading-relaxed text-zinc-400"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </section>

            <section id="sharing" className="scroll-mt-8 py-10">
              <h2 className={h2}>3. Sharing and third parties</h2>
              <p className={`${p} mt-3`}>
                <strong className="font-semibold text-white">
                  We never sell your data.
                </strong>{" "}
                FrustratedBox makes no money from data brokers, advertisers, or
                third-party profiling.
              </p>
              <p className={`${p} mt-4`}>
                We may hand over technical logs when there is a verified legal
                warrant, an imminent violent threat, or serious criminal
                activity, and only as far as the law that applies to us
                requires.
              </p>
            </section>

            <section id="cookies" className="scroll-mt-8 py-10">
              <h2 className={h2}>4. Cookies and local storage</h2>
              <p className={`${p} mt-3`}>
                We use authentication tokens and local storage to keep you
                signed in and to remember feed preferences such as your theme
                and guest scroll limit. We don&apos;t use cross-site tracking or
                third-party advertising cookies.
              </p>
            </section>

            <section id="deletion" className="scroll-mt-8 py-10">
              <h2 className={h2}>5. Retention and deletion</h2>
              <p className={`${p} mt-3`}>
                You can delete individual posts or permanently delete your
                account at any time. When you delete your account, your
                authentication credentials are purged from our primary database
                within 30 days.
              </p>
            </section>

            <section id="contact" className="scroll-mt-8 pt-10">
              <h2 className={h2}>6. Contact</h2>
              <p className={`${p} mt-3`}>
                For account deletion, privacy requests, or security concerns,
                email{" "}
                <a
                  href="mailto:privacy@frustratedbox.com"
                  className="text-red-500 underline underline-offset-4 hover:text-red-400  focus-visible:outline-2 focus-visible:outline-red-500"
                >
                  privacy@frustratedbox.com
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
            <Link href="/terms" className="hover:text-white">
              Terms of service
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

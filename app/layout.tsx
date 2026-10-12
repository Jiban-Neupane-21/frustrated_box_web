import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://frustratedbox.com",
  ),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "Frustrated Box – Anonymous Confessions, Thoughts & Quotes",
    template: "%s | Frustrated Box",
  },
  description:
    "Got something on your mind? Confess a secret, share your thoughts, join a community, or read quotes from people who get it. Anonymous, no judgment.",
  keywords: [
    "anonymous confession",
    "confess anonymously",
    "secret confessions",
    "anonymous thoughts",
    "share your thoughts anonymously",
    "late night thoughts",
    "3am thoughts",
    "deep thoughts",
    "overthinking at night",
    "can't sleep thoughts",
    "unsent thoughts",
    "things i can't tell anyone",
    "get it off my chest",
    "let it out anonymously",
    "bottled up feelings",
    "relatable quotes",
    "deep quotes",
    "anonymous community",
    "anonymous posting",
    "rant online",
    "feeling frustrated",
    "feeling overwhelmed",
    "work stress",
    "burnout",
    "anonymous diary",
    "write anonymously",
    "safe space to talk",
    "say what you can't say out loud",
  ],
  authors: [{ name: "Frustrated Box Team" }],
  openGraph: {
    title: "Frustrated Box – Say What You Can't Say Out Loud",
    description:
      "Confess a secret, share your thoughts, or find a community that gets it. Anonymous, no judgment, just let it go.",
    siteName: "Frustrated Box",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frustrated Box – Say What You Can't Say Out Loud",
    description:
      "Got something bottled up? Confess it, share your 3am thoughts, or join a community anonymously.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frustrated Box | Let It Out",
  description:
    "An anonymous venting platform to release frustrations, share thoughts, and explore relatable community rants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#050505] text-zinc-100 selection:bg-red-900/60 selection:text-red-200">
        {/* Responsive App Shell: Top Navbar for Mobile/Tablet, 3-Column for Desktop */}
        <AppShell
          session={{
            id: "mod-1",
            username: "tech_moderator",
            displayName: "Alex Mercer",
            role: "admin",
            managedCommunities: [
              {
                id: "c1",
                name: "Tech Life",
                slug: "tech-life",
                role: "moderator",
                pendingReportsCount: 4, // पेन्डिङ रिपोर्ट ब्याज
              },
              {
                id: "c2",
                name: "Corporate Cage",
                slug: "corporate-cage",
                role: "owner",
                pendingReportsCount: 0,
              },
            ],
          }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}

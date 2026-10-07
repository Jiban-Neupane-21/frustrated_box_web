"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";

export function AuthButtons() {
  return (
    <Link
      href="/login"
      aria-label="Sign in"
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-2.5 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-95 sm:px-4"
    >
      <LogIn className="h-4 w-4 sm:hidden" />
      <span className="hidden sm:inline">Sign in</span>
    </Link>
  );
}

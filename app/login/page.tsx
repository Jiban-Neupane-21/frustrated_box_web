// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/"); // Login successful भएपछि home/feed मा redirect
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      setError(message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick testing helper to auto-fill mock credentials
  const fillTestAccount = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("Password@123");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#0d0d0f] border-[#2a0808] text-zinc-100 shadow-2xl shadow-red-950/20">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-red-600">
            FrustratedBox
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Log in to vent, view raw feeds, and engage.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-xs rounded bg-red-950/60 border border-red-800 text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-zinc-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@frustratedbox.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#141416] border-zinc-800 focus-visible:ring-red-700 text-zinc-100 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#141416] border-zinc-800 focus-visible:ring-red-700 text-zinc-100 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-800 hover:bg-red-700 text-white font-medium transition"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          {/* Development Quick Role Switcher for Testing */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80">
            <p className="text-[11px] text-zinc-500 mb-2 font-mono uppercase tracking-wider">
              Testing Accounts (Click to Fill)
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestAccount("admin@frustratedbox.com")}
                className="border-zinc-800 bg-[#141416] hover:bg-red-950/40 hover:text-red-400 text-zinc-300 text-xs"
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestAccount("mod@frustratedbox.com")}
                className="border-zinc-800 bg-[#141416] hover:bg-red-950/40 hover:text-red-400 text-zinc-300 text-xs"
              >
                Moderator
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestAccount("user@frustratedbox.com")}
                className="border-zinc-800 bg-[#141416] hover:bg-red-950/40 hover:text-red-400 text-zinc-300 text-xs"
              >
                User
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center border-t border-zinc-800/60 pt-4">
          <p className="text-xs text-zinc-400">
            New here?{" "}
            <Link href="/register" className="text-red-500 hover:underline">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
